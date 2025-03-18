"use client";

import React, { useState, useEffect } from "react";
import AddComown from "./AddComown";

const ComownManagementComp = () => {
  const [comowns, setComowns] = useState([]);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedComown, setSelectedComown] = useState(null);
  const [editCompanyId, setEditCompanyId] = useState("");
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchComowns();
  }, []);

  const fetchComowns = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/authComown`);
      const data = await res.json();
      if (res.ok) {
        setComowns(Array.isArray(data) ? data : [data]);
      }
    } catch (error) {
      console.error("An error occurred while fetching comown data:", error);
    }
  };

  const handleEditClick = (comown) => {
    setSelectedComown(comown);
    setEditCompanyId(comown.companyId);
    setEditName(comown.name);
    setEditEmail(comown.email);
    setEditPassword(comown.password);
    setShowEditPopup(true);
  };

  const handleDeleteClick = (comown) => {
    setSelectedComown(comown);
    setShowDeletePopup(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        companyId: editCompanyId,
        name: editName,
        email: editEmail,
        password: editPassword,
      };
      const res = await fetch(
        `${apiUrl}/api/authComown/${selectedComown._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setShowEditPopup(false);
        setSelectedComown(null);
        fetchComowns();
      }
    } catch (error) {
      console.error("An error occurred while updating comown data:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/api/authComown/${selectedComown._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setShowDeletePopup(false);
        setSelectedComown(null);
        fetchComowns();
      }
    } catch (error) {
      console.error("An error occurred while deleting comown data:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Comown Management
      </h2>
      <div className="mb-8">
        <AddComown onAdd={fetchComowns} />
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Company ID</th>
              <th className="border p-3 text-left">Name</th>
              <th className="border p-3 text-left">Email</th>
              <th className="border p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(comowns) &&
              comowns.map((comown) => (
                <tr key={comown._id} className="hover:bg-gray-50">
                  <td className="border p-3">{comown.companyId}</td>
                  <td className="border p-3">{comown.name}</td>
                  <td className="border p-3">{comown.email}</td>
                  <td className="border p-3">
                    <div className="space-x-2 flex">
                      <button
                        onClick={() => handleEditClick(comown)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(comown)}
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
      {showEditPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96">
            <h3 className="text-2xl font-semibold mb-4 text-center">
              Edit Comown
            </h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-gray-700">Company ID:</label>
                <input
                  type="text"
                  value={editCompanyId}
                  onChange={(e) => setEditCompanyId(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block text-gray-700">Name:</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block text-gray-700">Email:</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block text-gray-700">Password:</label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  required
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
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96">
            <h3 className="text-2xl font-semibold mb-4 text-center">
              Confirm Delete
            </h3>
            <p className="mb-6 text-center">
              Are you sure you want to delete the comown:{" "}
              <span className="font-bold">{selectedComown?.name}</span>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComownManagementComp;