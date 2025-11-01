import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String },
    position: { type: String, required: true },
    recruiting: { type: String },
    pay: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);
