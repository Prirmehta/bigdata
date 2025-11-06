import React, { useEffect, useState } from "react";
import { Eye } from "react-bootstrap-icons";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const StudentDashboard = ({ name, onLogout }) => {
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);
  const [openCompanyId, setOpenCompanyId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/companies")
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch((err) => console.error("Error fetching companies:", err));

    fetch("http://localhost:5000/api/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Error fetching students:", err));
  }, []);

  const toggleCompany = (id) => setOpenCompanyId(openCompanyId === id ? null : id);

  const customGreen = "#29644D";

  return (
    <div className="min-vh-100 bg-light">
      {/* HEADER */}
      <header
        className="d-flex justify-content-between align-items-center text-white p-3 shadow-sm"
        style={{ backgroundColor: customGreen }}
      >
        <h2 className="fw-bold mb-0">Placement Portal – Student</h2>
        <div className="d-flex align-items-center gap-3">
          <span className="fw-semibold">Hello, {name || "User"}</span>
          <button
            className="btn btn-light fw-semibold"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="container py-4">
        <h4 className="fw-bold mb-4" style={{ color: customGreen }}>
          Companies and Selected Students
        </h4>

        {companies.length === 0 ? (
          <p className="text-muted">No companies found.</p>
        ) : (
          companies.map((company) => {
            // ✅ Filter students selected in this company
            const selectedStudents = students.filter(
              (s) => s.selectedCompany && s.selectedCompany.toLowerCase() === company.name.toLowerCase()
            );

            return (
              <div key={company._id} className="card shadow-sm mb-4">
                <div
                  className="card-header d-flex justify-content-between align-items-center text-white"
                  style={{ backgroundColor: customGreen }}
                >
                  <div>
                    <h5 className="mb-0 fw-bold">{company.name}</h5>
                    <small>
                      {company.position} — {company.location || "Location N/A"}
                    </small>
                  </div>

                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-${company._id}`}>
                        View Selected Students
                      </Tooltip>
                    }
                  >
                    <button
                      className="btn btn-light border-0"
                      onClick={() => toggleCompany(company._id)}
                      style={{
                        transition: "transform 0.15s ease",
                        borderRadius: "50%",
                        width: "38px",
                        height: "38px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Eye color={customGreen} size={20} />
                    </button>
                  </OverlayTrigger>
                </div>

                {/* SELECTED STUDENTS TABLE */}
                {openCompanyId === company._id && (
                  <div className="card-body">
                    <h6 className="fw-bold mb-3" style={{ color: customGreen }}>
                      Selected Students
                    </h6>
                    <table className="table table-bordered table-striped">
                      <thead style={{ backgroundColor: "#E7F3EE" }}>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Branch</th>
                          <th>CGPA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedStudents.length > 0 ? (
                          selectedStudents.map((s) => (
                            <tr key={s._id}>
                              <td>{s.name}</td>
                              <td>{s.email}</td>
                              <td>{s.branch}</td>
                              <td>{s.cgpa}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center text-muted">
                              No students selected for this company
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
