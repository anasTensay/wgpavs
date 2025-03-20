"use client";

import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaFilter } from "react-icons/fa";
import { useSelector } from "react-redux";

const AdminContractor = () => {
  const [projects, setProjects] = useState([]);
  const [comowns, setComowns] = useState([]);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editProgressStatus, setEditProgressStatus] = useState("");
  const [editPaidPercentage, setEditPaidPercentage] = useState(0);
  const [editRemarks, setEditRemarks] = useState("");
  const [upcomingProjects, setUpcomingProjects] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const contractorId = currentUser?._id;

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    companyId: "",
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (contractorId) {
      fetchProjects();
      fetchComowns();
    }
  }, [contractorId]);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/projects/contractor/${contractorId}`);
      const data = await res.json();
      if (res.ok) {
        const updatedProjects = data.map((project) => ({
          ...project,
          contractorWillWorkNextWeek: project.contractorWillWorkNextWeek || false,
          schstartDate: project.schstartDate || "N/A",
          schendDate: project.schendDate || "N/A",
        }));
        setProjects(updatedProjects);
        setUpcomingProjects(getUpcomingWeekProjects(updatedProjects));
      } else {
        toast.error("Failed to fetch projects");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("An error occurred while fetching projects");
    }
  };

  const fetchComowns = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/authComown`);
      const data = await res.json();
      if (res.ok) {
        setComowns(data);
      } else {
        toast.error("Failed to fetch comowns");
      }
    } catch (error) {
      console.error("Error fetching comowns:", error);
      toast.error("An error occurred while fetching comowns");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const applyFilters = () => {
    const filteredProjects = projects.filter((project) => {
      const matchesStartDate = filters.startDate
        ? new Date(project.schstartDate) >= new Date(filters.startDate)
        : true;
      const matchesEndDate = filters.endDate
        ? new Date(project.schendDate) <= new Date(filters.endDate)
        : true;
      const matchesCompany = filters.companyId
        ? project.company_id === filters.companyId
        : true;

      return matchesStartDate && matchesEndDate && matchesCompany;
    });

    setProjects(filteredProjects);
  };

  const getComownName = (comownId) => {
    const comown = comowns.find((comown) => comown._id === comownId);
    return comown ? comown.name : "N/A";
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        status: editStatus,
        progressStatus: editProgressStatus,
        paidPercentage: editPaidPercentage,
        remarks: editRemarks,
      };
      const res = await fetch(`${apiUrl}/api/projects/${selectedProject._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (res.ok) {
        setShowEditPopup(false);
        setSelectedProject(null);
        fetchProjects();
        toast.success("Project updated successfully");
      } else {
        toast.error("Failed to update project");
      }
    } catch (error) {
      console.error("An error occurred while updating project data:", error);
      toast.error("An error occurred while updating project");
    }
  };

  const handleEditClick = (project) => {
    setSelectedProject(project);
    setEditStatus(project.status);
    setEditProgressStatus(project.progressStatus || "");
    setEditPaidPercentage(project.paidPercentage || 0);
    setEditRemarks(project.remarks || "");
    setShowEditPopup(true);
  };

  const getUpcomingWeekProjects = (projects) => {
    const today = new Date();
    const oneWeekLater = new Date();
    oneWeekLater.setDate(today.getDate() + 7);

    return projects.map((project) => {
      const startDate = new Date(project.schstartDate);
      const endDate = new Date(project.schendDate);

      const isUpcoming =
        (startDate >= today && startDate <= oneWeekLater) ||
        (endDate >= today && endDate <= oneWeekLater) ||
        (startDate <= today && endDate >= oneWeekLater);

      return {
        ...project,
        contractorWillWorkNextWeek: project.contractorWillWorkNextWeek ? "نعم" : "لا",
        isUpcoming: isUpcoming ? "نعم" : "لا",
      };
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen" dir="ltr">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center">
        Contractor Dashboard
      </h1>

      {/* Filter Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Filter Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-700">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700">End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700">Company</label>
            <select
              name="companyId"
              value={filters.companyId}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="">Select Company</option>
              {comowns.map((comown) => (
                <option key={comown._id} value={comown._id}>
                  {comown.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={applyFilters}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          <FaFilter className="inline-block mr-2" />
          Apply Filters
        </button>
      </div>

      {/* Projects Table */}
      <div className="bg-white shadow-lg rounded-lg p-6 overflow-x-auto mb-8">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Company</th>
              <th className="border p-3 text-left">Project ID</th>
              <th className="border p-3 text-left">Project Name</th>
              <th className="border p-3 text-left">Location</th>
              <th className="border p-3 text-left">End User</th>
              <th className="border p-3 text-left">Project Status</th>
              <th className="border p-3 text-left">Progress Status</th>
              <th className="border p-3 text-left">Paid Percentage</th>
              <th className="border p-3 text-left">Remarks</th>
              <th className="border p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id} className="hover:bg-gray-50">
                <td className="border p-3">{getComownName(project.company_id)}</td>
                <td className="border p-3">{project.project_number}</td>
                <td className="border p-3">{project.name}</td>
                <td className="border p-3">{project.location}</td>
                <td className="border p-3">{project.assigned_location}</td>
                <td className="border p-3">{project.status}</td>
                <td className="border p-3">{project.progressStatus || "N/A"}</td>
                <td className="border p-3">{project.paidPercentage || 0}%</td>
                <td className="border p-3">{project.remarks || "N/A"}</td>
                <td className="border p-3">
                  <button
                    onClick={() => handleEditClick(project)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upcoming Week Schedule Table */}
      <h2 className="text-2xl font-bold mb-4 text-center">
        Upcoming Week Schedule
      </h2>
      <div className="bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Project Name</th>
              <th className="border p-3 text-left">Start Date</th>
              <th className="border p-3 text-left">End Date</th>
              <th className="border p-3 text-left">Will Work Next Week</th>
              <th className="border p-3 text-left">Upcoming Week Schedule</th>
            </tr>
          </thead>
          <tbody>
            {upcomingProjects.length > 0 ? (
              upcomingProjects.map((project) => (
                <tr key={project._id} className="hover:bg-gray-50">
                  <td className="border p-3">{project.name}</td>
                  <td className="border p-3">{formatDate(project.schstartDate)}</td>
                  <td className="border p-3">{formatDate(project.schendDate)}</td>
                  <td className="border p-3">{project.contractorWillWorkNextWeek}</td>
                  <td className="border p-3">{project.isUpcoming}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="border p-3 text-center">
                  No projects for the upcoming week
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showEditPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96">
            <h3 className="text-2xl font-semibold mb-4 text-center">
              Edit Project Data
            </h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-gray-700">Project Status:</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                >
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Progress Status:</label>
                <select
                  value={editProgressStatus}
                  onChange={(e) => setEditProgressStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Delayed">Delayed</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Paid Percentage:</label>
                <input
                  type="number"
                  value={editPaidPercentage}
                  onChange={(e) => setEditPaidPercentage(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block text-gray-700">Remarks:</label>
                <textarea
                  value={editRemarks}
                  onChange={(e) => setEditRemarks(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditPopup(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContractor;