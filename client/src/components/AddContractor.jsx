import React, { useState } from "react";

const AddContractor = ({ onAdd }) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [amount, setAmount] = useState("");
  const [Iktva, setIktva] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const contractor = {
        id,
        name,
        email,
        phoneNumber: phoneNumber || null,
        start_date: startDate,
        end_date: endDate,
        amount,
        Iktva,
        password
      };
      const res = await fetch(`${apiUrl}/api/contractors/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contractor),
      });
      const data = await res.json();

      if (res.ok) {
        setId("");
        setName("");
        setPhoneNumber("");
        setEmail("");
        setPassword("");
        setStartDate("");
        setEndDate("");
        setAmount("");
        setIktva("");
        onAdd();
      }
    } catch (error) {
      console.error("An error occurred while adding the contractor:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4 text-center">
        Add Contractor
      </h3>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">id:</label>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">
          phone number (optional):
        </label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">
          Cybersecurity Cert expire date
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="block w-full p-2 mb-4 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">
          Pre-Qualification expire date
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="block w-full p-2 mb-4 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Saudizaion</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Saudizaion in percentage (%)"
          className="block w-full p-2 mb-4 border border-gray-300 rounded"
          min="0"
          max="100"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2"> Iktva</label>
        <input
          type="number"
          value={Iktva}
          onChange={(e) => setIktva(e.target.value)}
          placeholder="Iktva in percentage (%)"
          className="block w-full p-2 mb-4 border border-gray-300 rounded"
          min="0"
          max="100"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">password:</label>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
      >
        Add
      </button>
    </form>
  );
};

export default AddContractor;
