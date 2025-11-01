import express from "express";
import Company from "./companyModel.js";

const router = express.Router();

// ✅ Get all companies
router.get("/", async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.json(companies);
  } catch (err) {
    console.error("Error fetching companies:", err);
    res.status(500).json({ message: "Server error while fetching companies" });
  }
});

// ✅ Add a new company
router.post("/", async (req, res) => {
  try {
    const { name, location, position, recruiting, pay } = req.body;

    if (!name || !position) {
      return res
        .status(400)
        .json({ message: "Company name and position are required" });
    }

    const newCompany = new Company({
      name,
      location,
      position,
      recruiting,
      pay,
    });

    const savedCompany = await newCompany.save();
    res.status(201).json(savedCompany);
  } catch (err) {
    console.error("Error adding company:", err);
    res.status(500).json({ message: "Server error while adding company" });
  }
});

// ✅ Update an existing company
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCompany = await Company.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json(updatedCompany);
  } catch (err) {
    console.error("Error updating company:", err);
    res.status(500).json({ message: "Server error while updating company" });
  }
});

// ✅ Delete a company
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCompany = await Company.findByIdAndDelete(id);

    if (!deletedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json({ message: "Company deleted successfully" });
  } catch (err) {
    console.error("Error deleting company:", err);
    res.status(500).json({ message: "Server error while deleting company" });
  }
});

export default router;
