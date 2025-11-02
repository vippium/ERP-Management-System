import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: { type: String, default: "NextGen ERP Pvt. Ltd." },
    gstin: { type: String, default: "29ABCDE1234F1Z5" },
    email: { type: String, default: "support@nextgenerp.in" },
    phone: { type: String, default: "+91 98765 43210" },
    address: { type: String, default: "101 Skyline Tower, MG Road, Bengaluru" },
    logo: { type: String }, // file path or base64
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);
export default Company;
