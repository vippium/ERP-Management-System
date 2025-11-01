import asyncHandler from "express-async-handler";
import Company from "../models/companyModel.js";
import fs from "fs";
import path from "path";

/**
 * @route GET /api/company
 * @desc  Get current company info
 * @access Admin
 */
export const getCompanyInfo = asyncHandler(async (req, res) => {
  let company = await Company.findOne();
  if (!company) company = await Company.create({});
  res.json(company);
});

/**
 * @route PUT /api/company
 * @desc  Update company info
 * @access Admin
 */
export const updateCompanyInfo = asyncHandler(async (req, res) => {
  let company = await Company.findOne();
  if (!company) company = await Company.create({});

  const { name, gstin, email, phone, address } = req.body;
  if (req.file) company.logo = `/uploads/${req.file.filename}`;

  company.name = name || company.name;
  company.gstin = gstin || company.gstin;
  company.email = email || company.email;
  company.phone = phone || company.phone;
  company.address = address || company.address;

  const updated = await company.save();
  res.json(updated);
});
