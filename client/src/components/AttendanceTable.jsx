import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AttendanceTable = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Fetch all attendance records
  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/attendance`);
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      setAttendance(data);
    } catch (error) {
      setError(error.message);
      toast.error("An error occurred while fetching data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
      <ToastContainer />
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
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
            {attendance.map((record) => (
              <tr key={record._id} className="hover:bg-gray-50">
                <td className="border p-3">{record.worker_name || "N/A"}</td>
                <td className="border p-3">{record.nationality || "N/A"}</td>
                <td className="border p-3">{record.job_title || "N/A"}</td>
                <td className="border p-3">{record.project_id?.name || "N/A"}</td>
                <td className="border p-3">{new Date(record.date).toLocaleDateString()}</td>
                <td className="border p-3">{record.status}</td>
                <td className="border p-3">{new Date(record.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AttendanceTable;
