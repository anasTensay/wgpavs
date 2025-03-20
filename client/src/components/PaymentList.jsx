"use client";

import React, { useEffect, useState } from "react";
import AddPayment from "./AddPayment";

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editPaymentStatus, setEditPaymentStatus] = useState("");
  const [editPaymentDate, setEditPaymentDate] = useState("");
  const [editProjectId, setEditProjectId] = useState("");
  const [editContractorId, setEditContractorId] = useState("");
  const [projects, setProjects] = useState([]);
  const [contractors, setContractors] = useState([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchPayments();
    fetchProjects();
    fetchContractors();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/payments`);
      const data = await res.json();
      if (res.ok) {
        setPayments(data);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/projects`);
      const data = await res.json();
      if (res.ok) {
        setProjects(data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchContractors = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/contractors`);
      const data = await res.json();
      if (res.ok) {
        setContractors(data);
      }
    } catch (error) {
      console.error("Error fetching contractors:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        amount: editAmount,
        paymentStatus: editPaymentStatus,
        paymentDate: editPaymentDate,
        project_id: editProjectId,
        contractor_id: editContractorId,
      };
      const res = await fetch(`${apiUrl}/api/payments/${selectedPayment._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (res.ok) {
        setShowEditPopup(false);
        setSelectedPayment(null);
        fetchPayments();
      }
    } catch (error) {
      console.error("An error occurred while updating payment data:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPayment) {
      console.error("No payment selected for deletion");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/payments/${selectedPayment._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setShowDeletePopup(false);
        setSelectedPayment(null);
        fetchPayments();
      }
    } catch (error) {
      console.error("An error occurred while deleting payment data:", error);
    }
  };

  const handleEditClick = (payment) => {
    setSelectedPayment(payment);
    setEditAmount(payment.amount);
    setEditPaymentStatus(payment.paymentStatus);
    setEditPaymentDate(payment.paymentDate);
    setEditProjectId(payment.project_id);
    setEditContractorId(payment.contractor_id);
    setShowEditPopup(true);
  };

  const handleProjectChange = (e) => {
    const selectedProjectId = e.target.value;
    setEditProjectId(selectedProjectId);

    const selectedProject = projects.find(
      (project) => project._id === selectedProjectId
    );

    if (selectedProject) {
      setEditContractorId(selectedProject.contractor_id);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Payment Management
      </h2>
      <div className="mb-8">
        <AddPayment onAdd={fetchPayments} />
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Project Name</th>
              <th className="border p-3 text-left">Contractor Name</th>
              <th className="border p-3 text-left">Payment Date</th>
              <th className="border p-3 text-left">Amount</th>
              <th className="border p-3 text-left">Payment Status</th>
              <th className="border p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id} className="hover:bg-gray-50">
                <td className="border p-3">
                  {payment.project_id?.name || "N/A"}
                </td>
                <td className="border p-3">
                  {payment.contractor_id?.name || "N/A"}
                </td>
                <td className="border p-3">
                  {new Date(payment.payment_date).toLocaleDateString()}
                </td>
                <td className="border p-3">
                  <p>{payment.amount}%</p>
                </td>
                <td className="border p-3">{payment.payment_status}</td>
                <td className="border p-3">
                  <div className="space-x-2 flex">
                    <button
                      onClick={() => handleEditClick(payment)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPayment(payment);
                        setShowDeletePopup(true);
                      }}
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
              Edit Payment Details
            </h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-gray-700">Amount:</label>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block text-gray-700">Payment Status:</label>
                <select
                  value={editPaymentStatus}
                  onChange={(e) => setEditPaymentStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Payment Date:</label>
                <input
                  type="date"
                  value={editPaymentDate}
                  onChange={(e) => setEditPaymentDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block text-gray-700">Project:</label>
                <select
                  value={editProjectId}
                  onChange={handleProjectChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  required
                >
                  <option value="">Select Project</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Contractor:</label>
                <input
                  type="text"
                  value={
                    contractors.find((c) => c._id === editContractorId)?.name ||
                    ""
                  }
                  readOnly
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
              Confirm Deletion
            </h3>
            <p className="mb-6 text-center">
              Are you sure you want to delete the payment:{" "}
              <span className="font-bold">{selectedPayment?.amount}</span>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeletePopup(false);
                  setSelectedPayment(null);
                }}
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

export default PaymentList;