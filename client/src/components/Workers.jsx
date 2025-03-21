"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Workers = () => {
  const { currentUser } = useSelector((state) => state.user);
  const contractor_id = currentUser?.isContractor ? currentUser._id : "";
  const [workers, setWorkers] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    contractor_id: contractor_id, // Set contractor_id automatically
    contact_info: { email: "", phone: "" },
    nationality: "Saudi",
    job_title: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [idError, setIdError] = useState(""); // State for ID validation error

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchWorkers();
    fetchContractors();
  }, []);

  const fetchWorkers = async () => {
    try {
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
    } catch (error) {
      console.error("Error fetching workers:", error);
    }
  };

  const fetchContractors = async () => {
    try {
      let url = `${apiUrl}/api/contractors`;

      // إذا كان المستخدم من نوع "شركة"، نضيف companyId إلى الـ URL
      if (currentUser.isComown) {
        url = `${apiUrl}/api/contractors/${currentUser._id}`;
      }

      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        setContractors(data);
      }
    } catch (error) {
      console.error("Error fetching contractors:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the ID already exists
    const existingWorker = workers.find((worker) => worker.id === formData.id);
    if (existingWorker && !editMode) {
      setIdError("Worker ID must be unique. This ID already exists.");
      return;
    }

    try {
      const method = editMode ? "PUT" : "POST";
      const url = editMode
        ? `${apiUrl}/api/workers/${selectedWorker._id}`
        : `${apiUrl}/api/workers`;

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData, companyId: currentUser?.isComown ? currentUser._id : ""
        }),
      });

      if (res.ok) {
        fetchWorkers();
        setFormData({
          id: "",
          name: "",
          contractor_id: contractor_id,
          contact_info: { email: "", phone: "" },
          nationality: "Saudi",
          job_title: "",
        });
        setEditMode(false);
        setIdError(""); // Clear ID error
      } else {
        const data = await res.json();
        alert(data.message || "An error occurred while saving the worker.");
      }
    } catch (error) {
      console.error("Error saving worker:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${apiUrl}/api/workers/${id}`, {
        method: "DELETE",
      });
      fetchWorkers();
    } catch (error) {
      console.error("Error deleting worker:", error);
    }
  };

  const handleEdit = (worker) => {
    setFormData({
      id: worker.id,
      name: worker.name,
      contractor_id: worker.contractor_id,
      contact_info: worker.contact_info,
      nationality: worker.nationality,
      job_title: worker.job_title,
    });
    setEditMode(true);
    setSelectedWorker(worker);
    setIdError(""); // Clear ID error when editing
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Worker Management</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-6"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editMode ? "Edit Worker" : "Add New Worker"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => {
                setFormData({ ...formData, id: e.target.value });
                setIdError(""); // Clear ID error on change
              }}
              placeholder="Worker Id"
              className="p-2 border rounded"
              required
              disabled={editMode} // Disable ID field in edit mode
            />
            {idError && <p className="text-red-500 text-sm mt-1">{idError}</p>}
          </div>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Worker Name"
            className="p-2 border rounded"
            required
          />
          {!currentUser?.isContractor && (
            <select
              name="contractor_id"
              value={formData.contractor_id}
              onChange={(e) =>
                setFormData({ ...formData, contractor_id: e.target.value })
              } className="block w-full p-2 mb-4 border border-gray-300 rounded"
              required
            >
              <option value="">Select Contractor</option>
              {contractors.map((contractor) => (
                <option key={contractor._id} value={contractor._id}>
                  {contractor.name}
                </option>
              ))}
            </select>
          )}
          <input
            type="email"
            value={formData.contact_info.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                contact_info: {
                  ...formData.contact_info,
                  email: e.target.value,
                },
              })
            }
            placeholder="Email (Optional)"
            className="p-2 border rounded"
          />
          <input
            type="text"
            value={formData.contact_info.phone}
            onChange={(e) =>
              setFormData({
                ...formData,
                contact_info: {
                  ...formData.contact_info,
                  phone: e.target.value,
                },
              })
            }
            placeholder="Phone Number"
            className="p-2 border rounded"
            required
          />
          <select
            value={formData.job_title}
            onChange={(e) =>
              setFormData({ ...formData, job_title: e.target.value })
            }
            placeholder="Job Title"
            className="p-2 border rounded"
          >
            <option value="WPR">WPR</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Safety-Officer">Safety Officer</option>
            <option value="Helper">Helper</option>
            <option value="HVAC">HVAC</option>
            <option value="Elect">Elect</option>
            <option value="PCST">PCST</option>
            <option value="Welder">Welder</option>
            <option value="Fabricator">Fabricator</option>
            <option value="Metal">Metal</option>
            <option value="Machinist">Machinist</option>
          </select>
          <select
            value={formData.nationality}
            onChange={(e) =>
              setFormData({ ...formData, nationality: e.target.value })
            }
            className="p-2 border rounded"
          >
            <option value="Saudi">Saudi</option>
            <option value="Non-Saudi">Non-Saudi</option>
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editMode ? "Update" : "Add"}
        </button>
      </form>
      <div className="bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Id</th>
              <th className="border p-3 text-left">Name</th>
              <th className="border p-3 text-left">Contractor</th>
              <th className="border p-3 text-left">Email</th>
              <th className="border p-3 text-left">Phone</th>
              <th className="border p-3 text-left">Nationality</th>
              <th className="border p-3 text-left">Job Title</th>
              <th className="border p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((worker) => (
              <tr key={worker._id} className="hover:bg-gray-50">
                <td className="border p-3">{worker.id}</td>
                <td className="border p-3">{worker.name}</td>
                <td className="border p-3">
                  {worker.contractor_id ? worker.contractor_id.name : "N/A"}
                </td>
                <td className="border p-3">
                  {worker.contact_info?.email || "N/A"}
                </td>
                <td className="border p-3">
                  {worker.contact_info?.phone || "N/A"}
                </td>
                <td className="border p-3">{worker.nationality || "N/A"}</td>
                <td className="border p-3">{worker.job_title || "N/A"}</td>
                <td className="border p-3">
                  <div className="space-x-2 flex">
                    <button
                      onClick={() => handleEdit(worker)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(worker._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Workers;