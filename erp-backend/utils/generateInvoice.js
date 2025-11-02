import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import Company from "../models/companyModel.js"; // ✅ import model

export const generateInvoice = async (res, type, data) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${type}-invoice-${data._id}.pdf`
  );

  doc.pipe(res);

  // 🏢 Fetch company info from DB
  let company = await Company.findOne().lean();
  if (!company) {
    company = {
      name: "NextGen ERP Pvt. Ltd.",
      address: "101 Skyline Tower, MG Road, Bengaluru",
      phone: "+91 98765 43210",
      email: "support@nextgenerp.in",
      gstin: "29ABCDE1234F1Z5",
      logo: null,
    };
  }

  // ✅ Draw logo if exists
  try {
    if (company.logo) {
      const rootDir = path.resolve();
      const logoPath = company.logo.startsWith("/uploads")
        ? path.join(rootDir, company.logo) // Convert /uploads/logo.png → absolute path
        : path.resolve(company.logo);

      console.log("🖼️ Using logo path:", logoPath);

      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 45, { width: 60 });
      } else {
        console.log("⚠️ Logo file not found:", logoPath);
      }
    }
  } catch (err) {
    console.log("⚠️ Logo render failed:", err.message);
  }

  // 🧾 Header
  doc
    .fontSize(18)
    .text(company.name, 120, 50)
    .fontSize(10)
    .fillColor("gray")
    .text(company.address, 120, 70)
    .text(`Phone: ${company.phone}`, 120, 85)
    .text(`Email: ${company.email}`, 120, 100)
    .text(`GSTIN: ${company.gstin}`, 120, 115)
    .moveDown(2)
    .fillColor("black")
    .fontSize(16)
    .text(type === "sale" ? "TAX INVOICE" : "PURCHASE INVOICE", {
      align: "center",
    })
    .moveDown(1);

  // Party Info
  const party = type === "sale" ? data.customer : data.supplier;
  doc
    .fontSize(12)
    .text(`${type === "sale" ? "Bill To:" : "Supplier:"}`, 50, 160)
    .moveDown(0.3)
    .fontSize(11)
    .text(party?.name || "N/A")
    .text(party?.company || "")
    .text(party?.email || "")
    .moveDown(1);

  doc
    .fontSize(12)
    .text(`Invoice No: ${data._id}`)
    .text(`Date: ${new Date(data.createdAt).toLocaleDateString()}`)
    .moveDown(1);

  // ✏️ Table Header
  const startY = doc.y + 10;
  doc
    .fontSize(12)
    .fillColor("black")
    .text("Item", 50, startY, { continued: true })
    .text("Qty", 250, startY, { continued: true })
    .text("Rate", 320, startY, { continued: true })
    .text("Amount", 420, startY)
    .moveTo(50, startY + 15)
    .lineTo(550, startY + 15)
    .stroke("#aaa");

  let y = startY + 25;

  // Items
  data.items.forEach((item) => {
    const title = item.product?.title || "Unknown";
    const qty = item.quantity || 0;
    const price = item.price || 0;
    const subtotal = qty * price;

    doc
      .fontSize(11)
      .text(title, 50, y, { width: 180 })
      .text(qty.toString(), 250, y)
      .text(`₹${price.toFixed(2)}`, 320, y)
      .text(`₹${subtotal.toFixed(2)}`, 420, y);

    y += 20;
  });

  // 🧾 Totals
  y += 10;
  const gstRate = 18;
  const gstAmount = (data.totalAmount * gstRate) / 100;
  const grandTotal = data.totalAmount + gstAmount;

  doc
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke("#ccc")
    .fontSize(12)
    .text(`Subtotal: ₹${data.totalAmount.toFixed(2)}`, 350, y + 10, {
      align: "right",
    })
    .text(`GST @${gstRate}%: ₹${gstAmount.toFixed(2)}`, 350, y + 25, {
      align: "right",
    })
    .font("Helvetica-Bold")
    .text(`Grand Total: ₹${grandTotal.toFixed(2)}`, 350, y + 45, {
      align: "right",
    })
    .font("Helvetica")
    .moveDown(2);

  // 🗒 Notes
  if (data.notes) {
    doc
      .fontSize(11)
      .text("Notes:", 50, y + 70, { underline: true })
      .moveDown(0.5)
      .text(data.notes);
  }

  // ✍️ Signature
  doc
    .moveDown(3)
    .fontSize(11)
    .text(`For ${company.name}`, { align: "right" })
    .moveDown(2)
    .text("Authorized Signature", { align: "right" })
    .moveDown(3);

  // Footer
  doc
    .fontSize(9)
    .fillColor("gray")
    .text(
      "This is a system-generated invoice. Thank you for your business!",
      50,
      780,
      { align: "center" }
    );

  doc.end();
};
