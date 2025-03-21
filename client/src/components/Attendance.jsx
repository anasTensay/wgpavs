"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AttendanceTable from "./AttendanceTable";
import { useSelector } from "react-redux";

const Attendance = () => {
  const [workers, setWorkers] = useState([]); // Workers list
  const [projects, setProjects] = useState([]); // Projects list
  const [attendanceRecords, setAttendanceRecords] = useState([]); // Add state for attendance records
  const [formData, setFormData] = useState({
    worker_id: "",
    project_id: "",
    date: "",
    status: "Present",
    worker_name: "",
    nationality: "Saudi",
    job_title: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  console.log(attendanceRecords)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Function to fetch data
  const fetchData = async (endpoint) => {
    try {
      const res = await fetch(`${apiUrl}${endpoint}`);
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    } catch (error) {
      setError(error.message);
      toast.error("An error occurred while fetching data");
    }
  };

  // Fetch attendance records
  const fetchAttendance = async () => {
    let url = `${apiUrl}/api/attendance/records`;

    // إذا كان المستخدم من نوع "شركة"، نضيف companyId إلى الـ URL
    if (currentUser.isComown) {
      url = `${apiUrl}/api/attendance/records/${currentUser._id}`;
    }

    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();
    if (res.ok) {
      setAttendanceRecords(data);
    }

  };

  // Fetch workers list
  const fetchWorkers = async () => {
    let url = `${apiUrl}/api/workers`;

    // إذا كان المستخدم من نوع "شركة"، نضيف companyId إلى الـ URL
    if (currentUser.isComown) {
      url = `${apiUrl}/api/workers/${currentUser._id}`;
    }

    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();
    if (res.ok) {
      setWorkers(data);
    }
  };

  // Fetch projects list
  const fetchProjects = async () => {
    let url = `${apiUrl}/api/projects`;

    // إذا كان المستخدم من نوع "شركة"، نضيف companyId إلى الـ URL
    if (currentUser.isComown) {
      url = `${apiUrl}/api/projects/company/${currentUser._id}`;
    }

    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();
    if (res.ok) {
      setProjects(data);
    }
  };

  useEffect(() => {
    fetchWorkers();
    fetchProjects();
    fetchAttendance(); // Also fetch attendance records on component mount
  }, []);

  // Register new attendance
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/attendance`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData, companyId: currentUser?.isComown ? currentUser._id : ""
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Attendance recorded successfully");
        fetchAttendance(); // Refresh the attendance data
        setFormData({
          worker_id: "",
          project_id: "",
          date: "",
          status: "Present",
          worker_name: "",
          nationality: "Saudi",
          job_title: "",
        });
      } else {
        throw new Error(data.message || "An error occurred while recording attendance");
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update worker name when selected
  const handleWorkerChange = (workerId) => {
    const selectedWorker = workers.find((worker) => worker._id === workerId);
    if (selectedWorker) {
      setFormData({
        ...formData,
        worker_id: workerId,
        worker_name: selectedWorker.name,
        nationality: selectedWorker.nationality || "Saudi",
        job_title: selectedWorker.job_title || "",
      });
    }
  };

  if (loading && !attendanceRecords.length) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center">Attendance Management</h1>

      {/* Attendance Registration Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-6"
      >
        <h2 className="text-xl font-semibold mb-4">Register New Attendance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Workers List */}
          <select
            value={formData.worker_id}
            onChange={(e) => handleWorkerChange(e.target.value)}
            className="p-2 border rounded"
            required
          >
            <option value="">Select Worker</option>
            {workers.map((worker) => (
              <option key={worker._id} value={worker._id}>
                {worker.name}
              </option>
            ))}
          </select>
          {/* Projects List */}
          <select
            value={formData.project_id}
            onChange={(e) =>
              setFormData({ ...formData, project_id: e.target.value })
            }
            className="p-2 border rounded"
            required
          >
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="p-2 border rounded"
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
          <input
            type="text"
            value={formData.worker_name}
            onChange={(e) =>
              setFormData({ ...formData, worker_name: e.target.value })
            }
            placeholder="Worker Name"
            className="p-2 border rounded"
            required
            readOnly
          />
          <select
            value={formData.nationality}
            onChange={(e) =>
              setFormData({ ...formData, nationality: e.target.value })
            }
            className="p-2 border rounded"
            disabled
          >
            <option value="Saudi">Saudi</option>
            <option value="Non-Saudi">Non-Saudi</option>
          </select>
          <input
            type="text"
            value={formData.job_title}
            onChange={(e) =>
              setFormData({ ...formData, job_title: e.target.value })
            }
            placeholder="Job Title"
            className="p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Register"}
        </button>
      </form>

      {/* Pass attendance data to the AttendanceTable component */}
      <AttendanceTable records={attendanceRecords} refreshData={fetchAttendance} />
    </div>
  );
};

export default Attendance;