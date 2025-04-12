import React, { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2

const API_URL = "https://localhost:5000/api/task"; // Replace with your real API

const TaskTableWithCRUD = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [employee , setEmployee] = useState([]);
  const [project , setProject] = useState([]);
  const itemsPerPage = 5;
  const emp_name = localStorage.getItem("user_name");
  const role = localStorage.getItem("role");

  // Fetch Data from API
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch data");

        const filterData = await response.json();
        const result = role!="Manager"?filterData.filter(
          (item) => item.allocated_by === emp_name || item.allocated_to === emp_name
        ):filterData;
        setData(result);
        setFilteredData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

const fetchDataEmployee = async () => {
      try {
        const response = await fetch("https://localhost:5000/api/users");
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setEmployee(result);
      } catch (error) {
        setError(error.message);
      }
    };
const fetchDataproject = async () => {
      try {
        const response = await fetch("https://localhost:5000/api/project");
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setProject(result);
      } catch (error) {
        setError(error.message);
      }
    };


useEffect(() => {
  fetchData();
  fetchDataEmployee();
  fetchDataproject();
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
      item.task.toLowerCase().includes(search.toLowerCase()) ||
      item.allocated_to.toLowerCase().includes(search.toLowerCase())
  ))};

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Handle Edit Click
  const handleEditClick = (item) => {
    setModalData({
      ...item,
      date: item.date ? item.date.split("T")[0] : "", // Extract YYYY-MM-DD format
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
    setModalData({task: "", effort: "", allocation_time: "", project: "", date: "", discription: "", action: "" ,allocated_by: "" , allocated_to: "" });
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
                <th style={{fontSize:'15px'}}>Task</th>
                <th style={{fontSize:'15px'}}>Effort</th>
                <th style={{fontSize:'15px'}}>Allocation time</th>
                <th style={{fontSize:'15px'}}>Project</th>
                <th style={{fontSize:'15px'}}>Date</th>
                <th style={{fontSize:'15px'}}>Description</th>
                <th style={{fontSize:'15px'}}>Allocated By</th>
                <th style={{fontSize:'15px'}}>Allocated To</th>
                <th style={{fontSize:'15px'}}>Status</th>
                <th style={{fontSize:'15px'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr key={item.id}>
                  <td style={{fontSize:'15px'}}>{item.task}</td>
                  <td style={{fontSize:'15px'}}>{item.effort}</td>
                  <td style={{fontSize:'15px'}}>{item.allocation_time}</td>
                  <td style={{fontSize:'15px'}}>{item.project}</td>
                  <td style={{fontSize:'15px'}}>{item.date.split("T")[0]}</td>
                  <td style={{fontSize:'15px'}}>{item.discription}</td>
                  <td style={{fontSize:'15px'}}>{item.allocated_by}</td>
                  <td style={{fontSize:'15px'}}>{item.allocated_to}</td>
                  <td style={{fontSize:'15px'}}>{item.action}</td>
                  <td>
                  <button className="btn btn-warning btn-sm w-100" onClick={() => handleEditClick(item)}>
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                    {item.allocated_by === emp_name && (
                      <button className="btn btn-danger btn-sm w-100" onClick={() => handleDelete(item.id)}>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                        )}
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
                <h5 className="modal-title">{isEditing ? "Edit Task" : "Add Task"}</h5>
                {/* <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button> */}
              </div>
              <div className="modal-body">
                <form onSubmit={handleFormSubmit} style={{overflowY:'scroll',height:'400px'}}>
                  <div className="mb-3">
                    <label className="form-label" style={{fontSize:'15px'}}>Task</label>
                    <input
                      type="text"
                      className="form-control"
                      value={modalData.task}
                      onChange={(e) => setModalData({ ...modalData, task: e.target.value })}
                      required
                      disabled={isEditing && modalData.allocated_by !== emp_name}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{fontSize:'15px'}}>Effort</label>
                    <input
                      type="text"
                      className="form-control"
                      value={modalData.effort}
                      onChange={(e) => setModalData({ ...modalData, effort: e.target.value })}
                      required
                      disabled={isEditing && modalData.allocated_by !== emp_name}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{fontSize:'15px'}}>Allocation Time</label>
                    <input
                      type="time"
                      className="form-control"
                      value={modalData.allocation_time}
                      onChange={(e) => setModalData({ ...modalData, allocation_time: e.target.value })}
                      required
                      disabled={isEditing && modalData.allocated_by !== emp_name}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{fontSize:'15px'}}>Project</label>
                    
                    <select
                        name="name"
                        className="form-control"
                        required
                        value={modalData.project}
                        onChange={(e) => setModalData({ ...modalData, project: e.target.value })}
                        disabled={isEditing && modalData.allocated_by !== emp_name}
                      >
                          <option value="" disabled>Select Project</option> {/* Default option */}
                          {project.map((item, index) => (
                            <option key={index} value={item.Project_Name}>
                              {item.Project_Name}
                            </option>
                          ))}
                  </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{fontSize:'15px'}}>Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={modalData.date || ""}
                      onChange={(e) => setModalData({ ...modalData, date: e.target.value })}
                      required
                      disabled={isEditing && modalData.allocated_by !== emp_name}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{fontSize:'15px'}}>Description</label>
                    <textarea  className="form-control"
                      value={modalData.discription}
                      onChange={(e) => setModalData({ ...modalData, discription: e.target.value })}
                      required
                      disabled={isEditing && modalData.allocated_by !== emp_name}>

                      </textarea>
                  
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{fontSize:'15px'}}>Allocated By</label>
                   
                     <select
                        name="name"
                        className="form-control"
                        required
                        value={modalData.allocated_by}
                        onChange={(e) => setModalData({ ...modalData, allocated_by: e.target.value })}
                        disabled={isEditing && modalData.allocated_by !== emp_name}
                      >
                          <option value="" disabled>Select an employee</option> {/* Default option */}
                          {employee.map((item, index) => (
                            <option key={index} value={item.user_name}>
                              {item.user_name}
                            </option>
                          ))}
                  </select>

                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{fontSize:'15px'}}>Allocated To</label>
                    <select
                        name="name"
                        className="form-control"
                        required
                        value={modalData.allocated_to}
                        onChange={(e) => setModalData({ ...modalData, allocated_to: e.target.value })}
                        disabled={isEditing && modalData.allocated_by !== emp_name}
                      >
                          <option value="" disabled>Select an employee</option> {/* Default option */}
                          {employee.map((item, index) => (
                            <option key={index} value={item.user_name}>
                              {item.user_name}
                            </option>
                          ))}
                  </select>
                  </div>
               
                  
                  <div className="mb-3">
                    <label className="form-label" style={{fontSize:'15px'}}>Select Status</label>

                    <select name="statue" className="form-control" value={modalData.action} onChange={(e) => setModalData({ ...modalData, action: e.target.value })} required>
                      <option value="">Select Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Wip">WIP</option>
                      <option value="Done">Done</option>
                    </select>
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

export default TaskTableWithCRUD;
