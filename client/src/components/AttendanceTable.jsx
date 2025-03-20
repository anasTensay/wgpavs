import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AttendanceTable = ({ records = [], refreshData }) => {
  // Helper function to safely access nested properties
  const getNestedValue = (obj, path, defaultValue = "N/A") => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj) || defaultValue;
  };

  // Convert Arabic status and nationality to English for display
  const convertToEnglish = (value, type) => {
    if (type === 'status') {
      return value === 'حاضر' ? 'Present' : value === 'غائب' ? 'Absent' : value;
    }
    if (type === 'nationality') {
      return value === 'سعودي' ? 'Saudi' : value === 'غير سعودي' ? 'Non-Saudi' : value;
    }
    return value;
  };

  // If no records are passed, display a message
  if (!records || records.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6 text-center">
        <p className="text-gray-500">No attendance records found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Attendance Records</h2>
      <ToastContainer />
      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-3 text-left">Worker ID</th>
            <th className="border p-3 text-left">Worker Name</th>
            <th className="border p-3 text-left">Nationality</th>
            <th className="border p-3 text-left">Job Title</th>
            <th className="border p-3 text-left">Project</th>
            <th className="border p-3 text-left">Date</th>
            <th className="border p-3 text-left">Status</th>
            <th className="border p-3 text-left">Created At</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record._id} className="hover:bg-gray-50">
              <td className="border p-3">
                {getNestedValue(record, 'worker_id.id')}
              </td>
              <td className="border p-3">{record.worker_name || "N/A"}</td>
              <td className="border p-3">{convertToEnglish(record.nationality, 'nationality') || "N/A"}</td>
              <td className="border p-3">{record.job_title || "N/A"}</td>
              <td className="border p-3">
                {getNestedValue(record, 'project_id.name')}
              </td>
              <td className="border p-3">
                {record.date ? new Date(record.date).toLocaleDateString() : "N/A"}
              </td>
              <td className="border p-3">
                <span className={`px-2 py-1 rounded ${convertToEnglish(record.status, 'status') === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {convertToEnglish(record.status, 'status') || "N/A"}
                </span>
              </td>
              <td className="border p-3">
                {record.createdAt ? new Date(record.createdAt).toLocaleString() : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;