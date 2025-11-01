import csv from "csv-parser";
import { Readable } from "stream";
import Customer from "../models/customerModel.js";

/**
 * POST /api/customers/import
 * FormData: file -> CSV file
 * Protected route (require JWT)
 */
export const importCustomers = async (req, res, next) => {
  try {
    if (!req.file || !req.file.buffer) {
      res.status(400);
      throw new Error("CSV file is required");
    }

    const results = [];
    const errors = [];
    let rowIndex = 0;

    // create readable stream from buffer
    const stream = Readable.from(req.file.buffer);

    await new Promise((resolve, reject) => {
      stream
        .pipe(csv({ skipLines: 0, mapHeaders: ({ header }) => header.trim() }))
        .on("data", (row) => {
          rowIndex += 1;
          // Normalize keys (lowercase) and trim values
          const normalized = {};
          Object.keys(row).forEach((k) => {
            normalized[k.trim()] = (row[k] || "").toString().trim();
          });

          // Basic validation: name required
          if (!normalized.name) {
            errors.push({
              row: rowIndex,
              error: "Missing required field: name",
            });
            return;
          }

          // Optionally map fields to your schema fields
          const doc = {
            name: normalized.name,
            email: normalized.email || undefined,
            phone: normalized.phone || undefined,
            address: normalized.address || undefined,
            city: normalized.city || undefined,
            country: normalized.country || "India",
            gstNumber:
              normalized.gstNumber || normalized.gst_number || undefined,
            createdBy: req.user?._id,
          };

          results.push(doc);
        })
        .on("end", () => resolve())
        .on("error", (err) => reject(err));
    });

    if (results.length === 0 && errors.length) {
      return res.status(400).json({ created: 0, errors });
    }

    // Insert many — use ordered:false so one bad doc doesn't stop all
    let inserted = { insertedCount: 0 };
    if (results.length) {
      try {
        const insertRes = await Customer.insertMany(results, {
          ordered: false,
        });
        inserted.insertedCount = insertRes.length;
      } catch (err) {
        // handle bulk write errors (duplicate key etc.)
        if (err && err.writeErrors && err.writeErrors.length) {
          // count successful inserts if possible
          inserted.insertedCount = err.result?.nInserted || 0;
          err.writeErrors.forEach((we) => {
            // try to extract index / message
            errors.push({
              row: we.index + 1, // approx row (0-indexed)
              error: we.errmsg || we.toString(),
            });
          });
        } else {
          // unknown insert error — fail gracefully
          return next(err);
        }
      }
    }

    res.json({
      created: inserted.insertedCount,
      totalRows: results.length + errors.length,
      errors,
    });
  } catch (err) {
    next(err);
  }
};
