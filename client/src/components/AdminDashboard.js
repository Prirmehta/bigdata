import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminDashboard = ({ onLogout }) => {
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [studentForm, setStudentForm] = useState({
    name: "",
    email: "",
    branch: "",
    cgpa: "",
  });
  const [companyForm, setCompanyForm] = useState({
    name: "",
    location: "",
    position: "",
    recruiting: "",
    pay: "",
  });
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingCompany, setEditingCompany] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditCompanyModal, setShowEditCompanyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState("");
    // 🆕 States for selection feature
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");


  const branchOptions = [
    "Information & Communication Technology (ICT)",
    "Computer Science (CS)",
    "Electrical Engineering",
    "Electronics & Communication Engineering",
    "Petroleum Engineering",
    "Chemical Engineering",
  ];

  const positionOptions = [
    "Software Engineer",
    "Data Analyst",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Cloud Engineer",
    "UI/UX Designer",
    "Business Analyst",
    "Financial Analyst",
    "Account Executive",
    "Marketing Associate",
    "HR Associate",
    "Operations Executive",
  ];

  useEffect(() => {
    fetch("http://localhost:5000/api/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Error fetching students:", err));

    fetch("http://localhost:5000/api/companies")
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch((err) => console.error("Error fetching companies:", err));
  }, []);

  const handleLogoutClick = () => {
    localStorage.clear();
    onLogout && onLogout();
  };

  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setStudentForm({ ...studentForm, [name]: value });
  };

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyForm({ ...companyForm, [name]: value });
  };

  const handleAddStudent = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentForm),
      });
      const newStudent = await res.json();
      setStudents([newStudent, ...students]);
      setStudentForm({ name: "", email: "", branch: "", cgpa: "" });
    } catch (err) {
      console.error("Error adding student:", err);
      alert("Error adding student");
    }
  };

  const handleAddCompany = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyForm),
      });
      const newCompany = await res.json();
      setCompanies([newCompany, ...companies]);
      setCompanyForm({
        name: "",
        location: "",
        position: "",
        recruiting: "",
        pay: "",
      });
    } catch (err) {
      console.error("Error adding company:", err);
      alert("Error adding company");
    }
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setStudentForm({
      name: student.name || "",
      email: student.email || "",
      branch: student.branch || "",
      cgpa: student.cgpa || "",
    });
    setShowEditModal(true);
  };

  // ✅ Fixed version for company editing
  const openEditCompanyModal = (company) => {
    setEditingCompany(company);
    setCompanyForm({
      name: company.name || "",
      location: company.location || "",
      position: company.position || "",
      recruiting: company.recruiting || "",
      pay: company.pay || "",
    });
    setShowEditCompanyModal(true);
  };

  const handleUpdateStudent = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/students/${editingStudent._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(studentForm),
        }
      );
      const updated = await res.json();
      setStudents(students.map((s) => (s._id === updated._id ? updated : s)));
      setShowEditModal(false);
      setEditingStudent(null);
      setStudentForm({ name: "", email: "", branch: "", cgpa: "" });
    } catch (err) {
      console.error("Error updating student:", err);
    }
  };

  // ✅ Fixed version for company update
  const handleUpdateCompany = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/companies/${editingCompany._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(companyForm),
        }
      );
      const updated = await res.json();
      setCompanies(companies.map((c) => (c._id === updated._id ? updated : c)));
      setShowEditCompanyModal(false);
      setEditingCompany(null);
      setCompanyForm({
        name: "",
        location: "",
        position: "",
        recruiting: "",
        pay: "",
      });
    } catch (err) {
      console.error("Error updating company:", err);
    }
  };

  const openDeleteModal = (item, type) => {
    setItemToDelete(item);
    setDeleteType(type);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const endpoint =
        deleteType === "student"
          ? `http://localhost:5000/api/students/${itemToDelete._id}`
          : `http://localhost:5000/api/companies/${itemToDelete._id}`;

      await fetch(endpoint, { method: "DELETE" });

      if (deleteType === "student") {
        setStudents(students.filter((s) => s._id !== itemToDelete._id));
      } else {
        setCompanies(companies.filter((c) => c._id !== itemToDelete._id));
      }

      setShowDeleteModal(false);
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

    // 🆕 Handle opening the "Selected" modal
  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setSelectedCompanyName(student.selectedCompany || "");
    setShowSelectModal(true);
  };

  // 🆕 Save company name for the selected student
  const handleSaveSelection = async () => {
  if (!selectedCompanyName.trim()) {
    alert("Please enter a company name");
    return;
  }

  console.log("🟦 Sending selection request for:", selectedStudent._id, selectedCompanyName);

  try {
    const res = await fetch(
      `http://localhost:5000/api/students/select/${selectedStudent._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedCompany: selectedCompanyName }),
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to update selection: ${res.statusText}`);
    }

    const updatedStudent = await res.json();
    console.log("✅ Backend response:", updatedStudent);

    setStudents(
      students.map((s) =>
        s._id === updatedStudent._id ? updatedStudent : s
      )
    );

    setShowSelectModal(false);
    setSelectedStudent(null);
    setSelectedCompanyName("");
  } catch (err) {
    console.error("❌ Error saving selection:", err);
    alert("Error saving selection");
  }
};


  const customBlue = { backgroundColor: "#27408C", border: "none" };

  return (
    <div className="bg-light min-vh-100">
      <header
        className="d-flex justify-content-between align-items-center text-white p-3 shadow-sm"
        style={customBlue}
      >
        <h2 className="fw-bold mb-0">Placement Portal – Admin</h2>
        <Button variant="light" onClick={handleLogoutClick}>
          Logout
        </Button>
      </header>

      <div className="container py-4">
        {/* STUDENT SECTION */}
        <div className="card shadow-sm mb-5">
          <div className="card-header text-white fw-bold" style={customBlue}>
            Add Student
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-3">
                <Form.Control
                  type="text"
                  name="name"
                  value={studentForm.name}
                  onChange={handleStudentChange}
                  placeholder="Name"
                />
              </div>
              <div className="col-md-3">
                <Form.Control
                  type="email"
                  name="email"
                  value={studentForm.email}
                  onChange={handleStudentChange}
                  placeholder="Email"
                />
              </div>
              <div className="col-md-3">
                <Form.Select
                  name="branch"
                  value={studentForm.branch}
                  onChange={handleStudentChange}
                >
                  <option value="">Select Branch</option>
                  {branchOptions.map((b, i) => (
                    <option key={i} value={b}>
                      {b}
                    </option>
                  ))}
                </Form.Select>
              </div>
              <div className="col-md-3">
                <Form.Control
                  type="number"
                  name="cgpa"
                  value={studentForm.cgpa}
                  onChange={handleStudentChange}
                  placeholder="CGPA (out of 10)"
                />
              </div>
            </div>
            <Button className="mt-3" style={customBlue} onClick={handleAddStudent}>
              Add Student
            </Button>

            <h5 className="mt-4 fw-bold" style={{ color: "#27408C" }}>
              Student List
            </h5>
            <Table striped bordered hover responsive className="mt-2">
              <thead style={{ backgroundColor: "#27408C", color: "white" }}>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Branch</th>
                  <th>CGPA</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((s) => (
                    <tr key={s._id}>
                      <td>{s.name}</td>
                      <td>{s.email}</td>
                      <td>{s.branch}</td>
                      <td>{s.cgpa}</td>
<td>
  {s.selectedCompany ? (
    <span className="text-success fw-bold">✅ {s.selectedCompany}</span>
  ) : (
    <span className="text-muted">❌ Not Selected</span>
  )}
</td>
<td>
  <Button
    variant="success"
    size="sm"
    className="me-2"
    onClick={() => handleSelectStudent(s)}
  >
    🎯
  </Button>
  <Button
    variant="warning"
    size="sm"
    className="me-2"
    onClick={() => openEditModal(s)}
  >
    ✏️
  </Button>
  <Button
    variant="danger"
    size="sm"
    onClick={() => openDeleteModal(s, "student")}
  >
    🗑️
  </Button>
</td>

                      
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>

        {/* COMPANY SECTION */}
        <div className="card shadow-sm">
          <div className="card-header text-white fw-bold" style={customBlue}>
            Add Company
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-2">
                <Form.Control
                  type="text"
                  name="name"
                  value={companyForm.name}
                  onChange={handleCompanyChange}
                  placeholder="Company Name"
                />
              </div>
              <div className="col-md-2">
                <Form.Control
                  type="text"
                  name="location"
                  value={companyForm.location}
                  onChange={handleCompanyChange}
                  placeholder="Location"
                />
              </div>
              <div className="col-md-3">
                <Form.Select
                  name="position"
                  value={companyForm.position}
                  onChange={handleCompanyChange}
                >
                  <option value="">Select Position</option>
                  {positionOptions.map((p, i) => (
                    <option key={i} value={p}>
                      {p}
                    </option>
                  ))}
                </Form.Select>
              </div>
              <div className="col-md-2">
                <Form.Control
                  type="text"
                  name="recruiting"
                  value={companyForm.recruiting}
                  onChange={handleCompanyChange}
                  placeholder="Hiring Count"
                />
              </div>
              <div className="col-md-2">
                <Form.Control
                  type="text"
                  name="pay"
                  value={companyForm.pay}
                  onChange={handleCompanyChange}
                  placeholder="Pay (in LPA)"
                />
              </div>
            </div>
            <Button className="mt-3" style={customBlue} onClick={handleAddCompany}>
              Add Company
            </Button>

            <h5 className="mt-4 fw-bold" style={{ color: "#27408C" }}>
              Company List
            </h5>
            <Table striped bordered hover responsive className="mt-2">
              <thead style={{ backgroundColor: "#27408C", color: "white" }}>
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Position</th>
                  <th>Hiring</th>
                  <th>Pay</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.length > 0 ? (
                  companies.map((c) => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>{c.location}</td>
                      <td>{c.position}</td>
                      <td>{c.recruiting}</td>
                      <td>{c.pay}</td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => openEditCompanyModal(c)}
                        >
                          ✏️
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => openDeleteModal(c, "company")}
                        >
                          🗑️
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No companies found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      {/* EDIT STUDENT MODAL */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control
              className="mb-3"
              type="text"
              name="name"
              value={studentForm.name}
              onChange={handleStudentChange}
              placeholder="Name"
            />
            <Form.Control
              className="mb-3"
              type="email"
              name="email"
              value={studentForm.email}
              onChange={handleStudentChange}
              placeholder="Email"
            />
            <Form.Select
              className="mb-3"
              name="branch"
              value={studentForm.branch}
              onChange={handleStudentChange}
            >
              <option value="">Select Branch</option>
              {branchOptions.map((b, i) => (
                <option key={i} value={b}>
                  {b}
                </option>
              ))}
            </Form.Select>
            <Form.Control
              type="number"
              name="cgpa"
              value={studentForm.cgpa}
              onChange={handleStudentChange}
              placeholder="CGPA"
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button style={customBlue} onClick={handleUpdateStudent}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* EDIT COMPANY MODAL */}
      <Modal
        show={showEditCompanyModal}
        onHide={() => setShowEditCompanyModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Company</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control
              className="mb-3"
              type="text"
              name="name"
              value={companyForm.name}
              onChange={handleCompanyChange}
              placeholder="Company Name"
            />
            <Form.Control
              className="mb-3"
              type="text"
              name="location"
              value={companyForm.location}
              onChange={handleCompanyChange}
              placeholder="Location"
            />
            <Form.Select
              className="mb-3"
              name="position"
              value={companyForm.position}
              onChange={handleCompanyChange}
            >
              <option value="">Select Position</option>
              {positionOptions.map((p, i) => (
                <option key={i} value={p}>
                  {p}
                </option>
              ))}
            </Form.Select>
            <Form.Control
              className="mb-3"
              type="text"
              name="recruiting"
              value={companyForm.recruiting}
              onChange={handleCompanyChange}
              placeholder="Hiring Count"
            />
            <Form.Control
              type="text"
              name="pay"
              value={companyForm.pay}
              onChange={handleCompanyChange}
              placeholder="Pay (in LPA)"
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditCompanyModal(false)}>
            Cancel
          </Button>
          <Button style={customBlue} onClick={handleUpdateCompany}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

            {/* 🆕 SELECT STUDENT MODAL */}
      <Modal show={showSelectModal} onHide={() => setShowSelectModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Mark Student as Selected</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label>Enter Company Name</Form.Label>
            <Form.Control
              type="text"
              value={selectedCompanyName}
              onChange={(e) => setSelectedCompanyName(e.target.value)}
              placeholder="Company Name"
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSelectModal(false)}>
            Cancel
          </Button>
          <Button style={customBlue} onClick={handleSaveSelection}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>


      {/* DELETE CONFIRMATION MODAL */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this {deleteType}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
