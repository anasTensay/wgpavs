"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaFileExcel, FaFileCsv, FaFilter } from "react-icons/fa";
import * as XLSX from "xlsx";
import { Parser } from "json2csv";

const ReportsPage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    companyId: "",
    contractorId: "",
    location: "",
    assignedLocation: "",
    status: ""
  });
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";

  const statuses = ["All", "Active", "Expired", "Completed"];
  const locations = [
    "All",
    "NGL",
    "Flare-Area",
    "SRU-HU",
    "FG",
    "UT",
    "Cogen",
    "Off-Site",
    "Sulfur-Loading",
    "Handlling"
  ];
  const assignedLocations = [
    "All",
    "NGL",
    "Degital",
    "GT",
    "SRU",
    "FG",
    "UT",
    "Elect",
    "PSCT",
    "CU",
    "T&l",
    "Multi-Craft",
    "PZV",
    "HVAC"
  ];

  // Fetch projects based on filters
  const fetchData = async () => {
    setLoading(true);
    try {
      let url = new URL(`${apiUrl}/api/projects`);

      // إذا كان المستخدم من نوع "شركة"، نضيف companyId إلى الـ URL
      if (currentUser.isComown) {
        url = new URL(`${apiUrl}/api/projects/company/${currentUser._id}`);
      }

      // Apply contractorId filter if present
      if (filters.contractorId) {
        url = new URL(`${apiUrl}/api/projects/contractor/${filters.contractorId}`);
      }

      // Add other filters as query parameters
      const queryParams = {};
      if (filters.startDate) queryParams.start_date_gte = filters.startDate;
      if (filters.endDate) queryParams.end_date_lte = filters.endDate;
      if (filters.status && filters.status !== "All") queryParams.status = filters.status;
      if (filters.location && filters.location !== "All") queryParams.location = filters.location;
      if (filters.assignedLocation && filters.assignedLocation !== "All") queryParams.assigned_location = filters.assignedLocation;

      // Add query parameters to URL
      Object.keys(queryParams).forEach(key => {
        url.searchParams.append(key, queryParams[key]);
      });

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert(
        "Failed to fetch data. Please check the API URL or try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Export to Excel
  const exportToExcel = () => {
    const formattedData = data.map(project => ({
      "Project Name": project.name,
      "Project Number": project.project_number,
      "Start Date": formatDate(project.start_date),
      "End Date": formatDate(project.end_date),
      "Status": project.status,
      "Location": project.location,
      "Assigned Location": project.assigned_location,
      "Contractor": project.contractor_id?.name || "N/A",
      "Notes": project.notes || "",
      "YTD FAI": project.ytdFAI || 0,
      "YTD Observation": project.ytdObservation || 0,
      "YTD Incident": project.ytdIncident || 0,
      "Total Not Closed": project.totalNotClosed || 0,
      "Created At": formatDate(project.createdAt)
    }));
    
    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Projects Report");
    XLSX.writeFile(wb, "projects-report.xlsx");
  };

  // Export to CSV
  const exportToCSV = () => {
    const formattedData = data.map(project => ({
      "Project Name": project.name,
      "Project Number": project.project_number,
      "Start Date": formatDate(project.start_date),
      "End Date": formatDate(project.end_date),
      "Status": project.status,
      "Location": project.location,
      "Assigned Location": project.assigned_location,
      "Contractor": project.contractor_id?.name || "N/A",
      "Notes": project.notes || "",
      "YTD FAI": project.ytdFAI || 0,
      "YTD Observation": project.ytdObservation || 0,
      "YTD Incident": project.ytdIncident || 0,
      "Total Not Closed": project.totalNotClosed || 0,
      "Created At": formatDate(project.createdAt)
    }));
    
    const parser = new Parser();
    const csv = parser.parse(formattedData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "projects-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "N/A";
      if (dateString.includes('+')) return "Invalid date";
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center">Projects Reports</h2>

      {/* Filters */}
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
            <label className="block text-gray-700">Company ID</label>
            <input
              type="text"
              name="companyId"
              value={filters.companyId}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700">Contractor ID</label>
            <input
              type="text"
              name="contractorId"
              value={filters.contractorId}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Location</label>
            <select
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Assigned Location</label>
            <select
              name="assignedLocation"
              value={filters.assignedLocation}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            >
              {assignedLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={fetchData}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          <FaFilter className="inline-block mr-2" />
          Apply Filters
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Projects Data</h3>
          <div className="space-x-2">
            <button
              onClick={exportToExcel}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              <FaFileExcel className="inline-block mr-2" />
              Export to Excel
            </button>
            <button
              onClick={exportToCSV}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              <FaFileCsv className="inline-block mr-2" />
              Export to CSV
            </button>
          </div>
        </div>
        {loading ? (
          <p className="text-center py-4">Loading...</p>
        ) : (
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3 text-left">Project Name</th>
                <th className="border p-3 text-left">Project Number</th>
                <th className="border p-3 text-left">Start Date</th>
                <th className="border p-3 text-left">End Date</th>
                <th className="border p-3 text-left">Status</th>
                <th className="border p-3 text-left">Location</th>
                <th className="border p-3 text-left">Assigned Location</th>
                <th className="border p-3 text-left">Contractor</th>
                <th className="border p-3 text-left">FAI Stats</th>
                <th className="border p-3 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((project) => (
                  <tr key={project._id} className="hover:bg-gray-50">
                    <td className="border p-3">{project.name}</td>
                    <td className="border p-3">{project.project_number}</td>
                    <td className="border p-3">{formatDate(project.start_date)}</td>
                    <td className="border p-3">{formatDate(project.end_date)}</td>
                    <td className="border p-3">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs ${
                          project.status === 'Active' ? 'bg-green-100 text-green-800' : 
                          project.status === 'Expired' ? 'bg-red-100 text-red-800' : 
                          'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="border p-3">{project.location}</td>
                    <td className="border p-3">{project.assigned_location}</td>
                    <td className="border p-3">{project.contractor_id?.name || "N/A"}</td>
                    <td className="border p-3">
                      <div className="text-xs">
                        <div>YTD FAI: {project.ytdFAI || 0}</div>
                        <div>YTD Obsv: {project.ytdObservation || 0}</div>
                        <div>YTD Incid: {project.ytdIncident || 0}</div>
                      </div>
                    </td>
                    <td className="border p-3">{project.notes || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="border p-3 text-center">
                    No projects available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;