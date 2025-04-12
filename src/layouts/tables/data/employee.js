import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2

const API_URL = "https://localhost:5000/api/users"; // Replace with your real API

const EmployeeTableWithCRUD = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const itemsPerPage = 5;

  // Fetch Data from API
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setData(result);
        setFilteredData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

useEffect(() => {
  fetchData();
}
, []);
  // Filter Data Based on Search Input
useEffect(() => {
  updateFilteredData();}, [search]);
const updateFilteredData = () =>{
  if (search === "") {
    return setFilteredData(data);
  }
setFilteredData(data.filter(
    (item) =>
      item.emp_id.toLowerCase().includes(search.toLowerCase()) ||
      item.user_email.toLowerCase().includes(search.toLowerCase())
  ))};

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Handle Edit Click
  const handleEditClick = (item) => {
    setModalData({
      ...item,
      dob: item.date ? item.dob.split("T")[0] : "", // Extract YYYY-MM-DD format
    });
    setIsEditing(true);
    setShowModal(true);
  };

  // Handle Delete with SweetAlert2 Confirmation
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
          if (response.ok) {
            setData((prevData) => prevData.filter((item) => item.id !== id));
            Swal.fire("Deleted!", "Your record has been deleted.", "success");
          } else {
            Swal.fire("Error!", "Failed to delete record.", "error");
          }
        } catch (error) {
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
      fetchData()
    });
  };

  // Handle Create Click
  const handleCreateClick = () => {
    setModalData({ user_email: "", password: "", role: "", user_name: "", dob: "", department: "", profil: "" });
    setIsEditing(false);
    setShowModal(true);
  };

  // Handle Form Submit (Create or Update)
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const method = isEditing ? "PUT" : "POST";
    const endpoint = isEditing ? `${API_URL}/${modalData.id}` : API_URL;

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modalData),
      });

      if (response.ok) {
        const updatedData = await response.json();
        if (isEditing) {
          setData((prevData) => prevData.map((item) => (item.id === modalData.id ? updatedData : item)));
          Swal.fire("Updated!", "Your record has been updated.", "success");
        } else {
          setData((prevData) => [...prevData, { ...updatedData, id: prevData.length + 1 }]); // Fake ID for UI
          Swal.fire("Created!", "New record has been added.", "success");
        }
        
        setShowModal(false);
        fetchData()
        
      } else {
        Swal.fire("Error!", "Failed to save data.", "error");
      }
    } catch (error) {
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  return (
    <div className="container p-2">
      <div className="d-flex justify-content-between align-items-center mb-3">
      <input
  type="text"
  className="form-control w-25"
  placeholder="Search..."
  value={search}
  onChange={(e) => {
    setSearch(e.target.value);
    updateFilteredData();
  }}
/>

        <button className="btn btn-success" onClick={handleCreateClick}>
          + Add New
        </button>
      </div>

      {loading && <p>Loading data...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="table">
            <thead className="thead-white">
              <tr>
                <th style={{fontSize:'15px'}}>Emp Id</th>
                <th style={{fontSize:'15px'}}>Employee Email</th>
                <th style={{fontSize:'15px'}}>Role</th>
                <th style={{fontSize:'15px'}}>Employee name</th>
                <th style={{fontSize:'15px'}}>Dob</th>
                <th style={{fontSize:'15px'}}>Department</th>
                <th style={{fontSize:'15px'}}>Profile</th>
                <th style={{fontSize:'15px'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr key={item.id}>
                  <td style={{fontSize:'15px'}}>{item.emp_id}</td>
                  <td style={{fontSize:'15px'}}>{item.user_email}</td>
                  <td style={{fontSize:'15px'}}>{item.role}</td>
                  <td style={{fontSize:'15px'}}>{item.user_name}</td>
                  <td style={{fontSize:'15px'}}>{item.dob.split("T")[0]}</td>
                  <td style={{fontSize:'15px'}}>{item.department}</td>
                  <td style={{fontSize:'15px'}}>{item.profil}</td>
                  <td>
                    <button className="btn btn-warning btn-sm w-100" onClick={() => handleEditClick(item)}>
                    <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button className="btn btn-danger btn-sm w-100" onClick={() => handleDelete(item.id)}>
                    <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="d-flex justify-content-between">
        <button className="btn btn-primary" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button className="btn btn-primary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
          Next
        </button>
      </div>

      {/* Bootstrap Modal for Creating & Editing */}
      {modalData && (
        <div className={`modal ${showModal ? "d-block" : "d-none"}`} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{isEditing ? "Edit Employee" : "Add Employee"}</h5>
                {/* <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button> */}
              </div>
              <div className="modal-body">
                <form onSubmit={handleFormSubmit} style={{overflowY:'scroll',height:'400px'}}>
                  <div className="mb-3">
                    <label className="form-label" style={{fontSize:'15px'}}>Employee Email</label>
                    <input
                      type="text"
                      className="form-control"
                      value={modalData.user_email}
                      onChange={(e) => setModalData({ ...modalData, user_email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{fontSize:'15px'}}>Password</label>
                    <input
                      type="text"
                      className="form-control"
                      value={modalData.password}
                      onChange={(e) => setModalData({ ...modalData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{fontSize:'15px'}}>Select Role</label>

                    <select name="leave_type" className="form-control" value={modalData.role} onChange={(e) => setModalData({ ...modalData, role: e.target.value })} required>
                    <option value="">Select Role</option>
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{fontSize:'15px'}}>Employee Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={modalData.user_name}
                      onChange={(e) => setModalData({ ...modalData, user_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{fontSize:'15px'}}>Employee D.O.B</label>
                    <input
                      type="date"
                      className="form-control"
                      value={modalData.dob}
                      onChange={(e) => setModalData({ ...modalData, dob: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{fontSize:'15px'}}>Enter Department</label>
                    <input
                      type="text"
                      className="form-control"
                      value={modalData.department}
                      onChange={(e) => setModalData({ ...modalData, department: e.target.value })}
                      required
                    />
                  
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{fontSize:'15px'}}>Enter Designation</label>
                    <input
                      type="text"
                      className="form-control"
                      value={modalData.profil}
                      onChange={(e) => setModalData({ ...modalData, profil: e.target.value })}
                      required
                    />
                  
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {isEditing ? "Save Changes" : "Create"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTableWithCRUD;
