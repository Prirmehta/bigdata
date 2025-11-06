import express from "express";
import Student from "./studentModel.js";

const router = express.Router();

// GET all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ADD a new student
router.post("/", async (req, res) => {
  try {
    const { name, email, branch, cgpa } = req.body;
    if (!name || !email) return res.status(400).json({ message: "Name and email required" });

    const existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ message: "Student with this email already exists" });

    const newStudent = new Student({ name, email, branch, cgpa });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    console.error("Error adding student:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Student not found" });
    res.json(updated);
  } catch (err) {
    console.error("Error updating student:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted" });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Mark student as selected
router.put("/select/:id", async (req, res) => {
  try {
    const { selectedCompany } = req.body;
    console.log("➡️ Update request received for:", req.params.id, "with:", selectedCompany);

    if (!selectedCompany) {
      return res.status(400).json({ message: "Company name required" });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { selectedCompany },
      { new: true }
    );

    console.log("✅ Updated student:", updatedStudent);

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(updatedStudent);
  } catch (err) {
    console.error("❌ Error saving selection:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
