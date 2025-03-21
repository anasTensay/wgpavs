"use client"

import React, { useState, useEffect } from "react";
import AddOfficer from "./AddOfficer";
import { useSelector } from "react-redux";

const OfficerManagementComp = () => {
  const [officers, setOfficers] = useState([]);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhoneNumber, setEditPhoneNumber] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const companyId = currentUser._id
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    try {
      let url = `${apiUrl}/api/officer`;

      // إذا كان المستخدم من نوع "شركة"، نضيف companyId إلى الـ URL
      if (currentUser.isComown) {
        url = `${apiUrl}/api/officer/${companyId}`;
      }

      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json()
      if (res.ok) {
        setOfficers(data);
      }
    } catch (error) {
      console.error("An error occurred while fetching officer data:", error);
    }
  };

  const handleEditClick = (officer) => {
    setSelectedOfficer(officer);
    setEditId(officer.id);
    setEditName(officer.name);
    setEditPhoneNumber(officer.phoneNumber || "");
    setEditEmail(officer.email);
    setEditPassword(officer.password);
    setShowEditPopup(true);
  };

  const handleDeleteClick = (Officer) => {
    setSelectedOfficer(Officer);
    setShowDeletePopup(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        id: editId,
        name: editName,
        email: editEmail,
        phoneNumber: editPhoneNumber,
        password: editPassword,
      };
      const res = await fetch(`${apiUrl}/api/officer/${selectedOfficer._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (res.ok) {
        setShowEditPopup(false);
        setSelectedOfficer(null);
        fetchOfficers();
      }
    } catch (error) {
      console.error("An error occurred while updating officer data:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/officer/${selectedOfficer._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setShowDeletePopup(false);
        setSelectedOfficer(null);
        fetchOfficers();
      }
    } catch (error) {
      console.error("An error occurred while deleting officer data:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Officer Management
      </h2>
      <div className="mb-8">
        <AddOfficer onAdd={fetchOfficers} />
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">ID</th>
              <th className="border p-3 text-left">Officer Name</th>
              <th className="border p-3 text-left">Officer Mobile</th>
              <th className="border p-3 text-left">Officer Email</th>
              <th className="border p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {officers.map((Officer) => (
              <tr key={Officer._id} className="hover:bg-gray-50">
                <td className="border p-3">{Officer.id}</td>
                <td className="border p-3">{Officer.name}</td>
                <td className="border p-3">{Officer.phoneNumber || "N/A"}</td>
                <td className="border p-3">{Officer.email}</td>
                <td className="border p-3">
                  <div className="space-x-2 flex">
                    <button
                      onClick={() => handleEditClick(Officer)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(Officer)}
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
              Edit Officer
            </h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">id:</label>
                <input
                  type="text"
                  value={editId}
                  onChange={(e) => setEditId(e.target.value)}
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
                <label className="block text-gray-700">Phone Number:</label>
                <input
                  type="text"
                  value={editPhoneNumber}
                  onChange={(e) => setEditPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block text-gray-700">Password:</label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
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
              Are you sure you want to delete the Officer:{" "}
              <span className="font-bold">{selectedOfficer?.name}</span>?
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

export default OfficerManagementComp;
