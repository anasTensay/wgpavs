import React, { useState, useEffect } from "react";
import AddContractor from "./AddContractor";

const ContractorManagementComp = () => {
  const [contractors, setContractors] = useState([]);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhoneNumber, setEditPhoneNumber] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editIktva, setEditIktva] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/contractors`);
      const data = await res.json();
      console.log(data); // تحقق من البيانات هنا
      if (res.ok) {
        setContractors(Array.isArray(data) ? data : [data]);
      }
    } catch (error) {
      console.error("An error occurred while fetching contractor data:", error);
    }
  };

  const handleEditClick = (contractor) => {
    setSelectedContractor(contractor);
    setEditId(contractor.id); // تعيين قيمة الـ ID
    setEditName(contractor.name);
    setEditPhoneNumber(contractor.phoneNumber || "");
    setEditEmail(contractor.email);
    setEditPassword(contractor.password);
    setEditStartDate(contractor.start_date);
    setEditEndDate(contractor.end_date);
    setEditAmount(contractor.amount);
    setEditIktva(contractor.Iktva);
    setShowEditPopup(true);
  };

  const handleDeleteClick = (contractor) => {
    setSelectedContractor(contractor);
    setShowDeletePopup(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        id: editId, // إضافة الـ ID المحدث
        name: editName,
        email: editEmail,
        phoneNumber: editPhoneNumber,
        password: editPassword,
        start_date: editStartDate,
        end_date: editEndDate,
        amount: editAmount,
        Iktva: editIktva,
      };
      const res = await fetch(
        `${apiUrl}/api/contractors/${selectedContractor._id}`,
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
        setSelectedContractor(null);
        fetchContractors();
      }
    } catch (error) {
      console.error("An error occurred while updating contractor data:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/api/contractors/${selectedContractor._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setShowDeletePopup(false);
        setSelectedContractor(null);
        fetchContractors();
      }
    } catch (error) {
      console.error("An error occurred while deleting contractor data:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Contractor Management
      </h2>
      <div className="mb-8">
        <AddContractor onAdd={fetchContractors} />
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">ID</th>
              <th className="border p-3 text-left">Contractor Name</th>
              <th className="border p-3 text-left">Contractor Mobile</th>
              <th className="border p-3 text-left">Contractor Email</th>
              <th className="border p-3 text-left">
                Cybersecurity Cert expire date
              </th>
              <th className="border p-3 text-left">
                Pre-Qualification expire date
              </th>
              <th className="border p-3 text-left">Saudizaion</th>
              <th className="border p-3 text-left">Iktva</th>
              <th className="border p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(contractors) &&
              contractors.map((contractor) => (
                <tr key={contractor._id} className="hover:bg-gray-50">
                  <td className="border p-3">{contractor.id}</td>
                  <td className="border p-3">{contractor.name}</td>
                  <td className="border p-3">
                    {contractor.phoneNumber || "N/A"}
                  </td>
                  <td className="border p-3">{contractor.email}</td>
                  <td className="border p-3">
                    {new Date(contractor.start_date).toLocaleDateString()}
                  </td>
                  <td className="border p-3">
                    {new Date(contractor.end_date).toLocaleDateString()}
                  </td>
                  <td className="border p-3">
                    <p>{contractor.amount}%</p>
                  </td>
                  <td className="border p-3">
                    <p>{contractor.Iktva}%</p>
                  </td>
                  <td className="border p-3">
                    <div className="space-x-2 flex">
                      <button
                        onClick={() => handleEditClick(contractor)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(contractor)}
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
              Edit Contractor
            </h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              {/* حقل ID */}
              <div>
                <label className="block text-gray-700">ID:</label>
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
              <div>
                <label className="block text-gray-700">Start Date:</label>
                <input
                  type="date"
                  value={editStartDate}
                  onChange={(e) => setEditStartDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block text-gray-700">End Date:</label>
                <input
                  type="date"
                  value={editEndDate}
                  onChange={(e) => setEditEndDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block text-gray-700">Saudizaion:</label>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block text-gray-700">Iktva:</label>
                <input
                  type="number"
                  value={editIktva}
                  onChange={(e) => setEditIktva(e.target.value)}
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
              Are you sure you want to delete the contractor:{" "}
              <span className="font-bold">{selectedContractor?.name}</span>?
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

export default ContractorManagementComp;