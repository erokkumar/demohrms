import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2

const API_URL = "https://localhost:5000/api/project"; // Replace with your real API

const ProjectTableWithCRUD = () => {
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
  const navigate=useNavigate();
  const itemsPerPage = 5;
  const emp_name = localStorage.getItem("user_name");
  const role = localStorage.getItem("role");

  // Fetch Data from API
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch data");

        // const filterData = await response.json();
        // const result = role!="Manager"?filterData.filter(
        //   (item) => item.allocated_by === emp_name || item.allocated_to === emp_name
        // ):filterData;
        const result = await response.json();
        setData(result);
        setFilteredData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    console.log(data,"show me data");

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


useEffect(() => {
  fetchData();
  fetchDataEmployee();
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
      item.Project_Code.toLowerCase().includes(search.toLowerCase()) ||
      item.Project_Name.toLowerCase().includes(search.toLowerCase())
  ))};

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Handle Edit Click
  const handleEditClick = (item) => {
    setModalData({
      ...item,
      Project_Start_Date: item.Project_Start_Date ? item.Project_Start_Date.split("T")[0] : "", // Extract YYYY-MM-DD format
      Project_End_Date: item.Project_End_Date ? item.Project_End_Date.split("T")[0] : "", // Extract YYYY-MM-DD format
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
    setModalData({Project_Code:"", Project_Name:"", Client_Name:"", Project_Category:"", Project_Start_Date:"", Project_End_Date:"", Component:"" ,Platform:"" , Scope:"" });
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
                <th style={{fontSize:'15px'}}>Project Code</th>
                <th style={{fontSize:'15px'}}>Project Name</th>
                <th style={{fontSize:'15px'}}>Client Name</th>
                <th style={{fontSize:'15px'}}>Project Category</th>
                <th style={{fontSize:'15px'}}>Project Start Date</th>
                <th style={{fontSize:'15px'}}>Project End_Date</th>
                <th style={{fontSize:'15px'}}>Component</th>
                <th style={{fontSize:'15px'}}>Platform</th>
                <th style={{fontSize:'15px'}}>Scope</th>
                <th style={{fontSize:'15px'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr key={item.id}>
                  <td style={{fontSize:'15px'}}>{item.Project_Code}</td>
                  <td style={{fontSize:'15px'}}>{item.Project_Name}</td>
                  <td style={{fontSize:'15px'}}>{item.Client_Name}</td>
                  <td style={{fontSize:'15px'}}>{item.Project_Category}</td>
                  <td style={{fontSize:'15px'}}>{item.Project_Start_Date.split("T")[0]}</td>
                  <td style={{fontSize:'15px'}}>{item.Project_End_Date.split("T")[0]}</td>
                  <td style={{fontSize:'15px'}}>{item.Component}</td>
                  <td style={{fontSize:'15px'}}>{item.Platform}</td>
                  <td style={{fontSize:'15px'}}>{item.Scope}</td>
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
                <h5 className="modal-title">{isEditing ? "Edit Project" : "Add Project"}</h5>
                {/* <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button> */}
              </div>
              <div className="modal-body">
                <form onSubmit={handleFormSubmit} style={{overflowY:'scroll',height:'400px'}}>
                  <div className="mb-3">
                    <label className="form-label" style={{fontSize:'15px'}}>Project Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={modalData.Project_Code}
                      onChange={(e) => setModalData({ ...modalData, Project_Code: e.target.value })}
                      required
                    //   disabled={isEditing && modalData.allocated_by !== emp_name}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{fontSize:'15px'}}>Project Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={modalData.Project_Name}
                      onChange={(e) => setModalData({ ...modalData, Project_Name: e.target.value })}
                      required
                    //   disabled={isEditing && modalData.allocated_by !== emp_name}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{fontSize:'15px'}}>Client Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={modalData.Client_Name}
                      onChange={(e) => setModalData({ ...modalData, Client_Name: e.target.value })}
                      required
                    //   disabled={isEditing && modalData.allocated_by !== emp_name}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{fontSize:'15px'}}>Project Category</label>
                    <input
                      type="text"
                      className="form-control"
                      value={modalData.Project_Category}
                      onChange={(e) => setModalData({ ...modalData, Project_Category: e.target.value })}
                      required
                    //   disabled={isEditing && modalData.allocated_by !== emp_name}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{fontSize:'15px'}}>Project Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={modalData.Project_Start_Date || ""}
                      onChange={(e) => setModalData({ ...modalData, Project_Start_Date: e.target.value })}
                      required
                    //   disabled={isEditing && modalData.allocated_by !== emp_name}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{fontSize:'15px'}}>Project End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={modalData.Project_End_Date || ""}
                      onChange={(e) => setModalData({ ...modalData, Project_End_Date: e.target.value })}
                      required
                    //   disabled={isEditing && modalData.allocated_by !== emp_name}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{fontSize:'15px'}}>Component</label>
                    <input
                      type="text"
                      className="form-control"
                      value={modalData.Component || ""}
                      onChange={(e) => setModalData({ ...modalData, Component: e.target.value })}
                      required
                    //   disabled={isEditing && modalData.allocated_by !== emp_name}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{fontSize:'15px'}}>Platform</label>
                    <input
                      type="text"
                      className="form-control"
                      value={modalData.Platform || ""}
                      onChange={(e) => setModalData({ ...modalData, Platform: e.target.value })}
                      required
                    //   disabled={isEditing && modalData.allocated_by !== emp_name}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{fontSize:'15px'}}>Scope</label>
                    <textarea  className="form-control"
                      value={modalData.Scope}
                      onChange={(e) => setModalData({ ...modalData, Scope: e.target.value })}
                      required
                    //   disabled={isEditing && modalData.allocated_by !== emp_name}
                      >

                      </textarea>
                  
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

export default ProjectTableWithCRUD;
