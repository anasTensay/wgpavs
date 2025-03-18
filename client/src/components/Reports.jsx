"use client"

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
    projectId: "",
    contractorId: "",
  });
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";

  // Fetch data based on filters
  const fetchData = async () => {
    setLoading(true);
    try {
      const url = new URL(`${apiUrl}/api/contractors/projects`);
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          url.searchParams.append(key, filters[key]);
        }
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
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, "report.xlsx");
  };

  // Export to CSV
  const exportToCSV = () => {
    const parser = new Parser();
    const csv = parser.parse(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center">Reports</h2>

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
            <label className="block text-gray-700">Project ID</label>
            <input
              type="text"
              name="projectId"
              value={filters.projectId}
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
          <h3 className="text-xl font-semibold">Report Data</h3>
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
          <p>Loading...</p>
        ) : (
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3 text-left">Name</th>
                <th className="border p-3 text-left">Start Date</th>
                <th className="border p-3 text-left">End Date</th>
                <th className="border p-3 text-left">Status</th>
                <th className="border p-3 text-left">Location</th>
                <th className="border p-3 text-left">Assigned Location</th>
                <th className="border p-3 text-left">Company ID</th>
                <th className="border p-3 text-left">Contractor Name</th>
                <th className="border p-3 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              {data.map((project) => (
                <tr key={project._id} className="hover:bg-gray-50">
                  <td className="border p-3">{project.name}</td>
                  <td className="border p-3">
                    {new Date(project.start_date).toLocaleDateString()}
                  </td>
                  <td className="border p-3">
                    {new Date(project.end_date).toLocaleDateString()}
                  </td>
                  <td className="border p-3">{project.status}</td>
                  <td className="border p-3">{project.location}</td>
                  <td className="border p-3">{project.assigned_location}</td>
                  <td className="border p-3">{project.company_id}</td>
                  <td className="border p-3">
                    {project.contractor_id?.name || "N/A"}
                  </td>
                  <td className="border p-3">{project.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;