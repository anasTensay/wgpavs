import React, { useState } from "react";
import { useSelector } from "react-redux";

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
  const [error, setError] = useState(""); // حالة لتخزين رسائل الخطأ
  const { currentUser } = useSelector((state) => state.user);
  const companyId = currentUser._id
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق من أن القيم لا تتجاوز 100%
    if (amount > 100 || Iktva > 100) {
      setError("القيم يجب ألا تتجاوز 100%");
      return;
    }

    try {
      const contractor = {
        companyId: currentUser?.isComown ? currentUser._id : "",
        id,
        name,
        email,
        phoneNumber: phoneNumber || null,
        start_date: startDate,
        end_date: endDate,
        amount,
        Iktva,
        password,
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
        setError(""); // إعادة تعيين رسالة الخطأ
        onAdd();
      }
    } catch (error) {
      console.error("An error occurred while adding the contractor:", error);
      setError("حدث خطأ أثناء إضافة المقاول");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4 text-center">
        Add Contractor
      </h3>

      {/* عرض رسالة الخطأ إذا كانت موجودة */}
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      {/* حقل معرف المقاول */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">ID:</label>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      {/* حقل اسم المقاول */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      {/* حقل البريد الإلكتروني */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      {/* حقل رقم الهاتف (اختياري) */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">
          Phone Number (optional):
        </label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      {/* حقل تاريخ انتهاء شهادة الأمن السيبراني */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">
          Cybersecurity Cert Expire Date:
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      {/* حقل تاريخ انتهاء التأهيل المسبق */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">
          Pre-Qualification Expire Date:
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      {/* حقل نسبة التوطين (Saudization) */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Saudization (%):</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setError(""); // إعادة تعيين رسالة الخطأ عند التغيير
          }}
          placeholder="Enter Saudization percentage"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          min="0"
          max="100"
          required
        />
      </div>

      {/* حقل نسبة الاكتفاء المحلي (Iktva) */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Iktva (%):</label>
        <input
          type="number"
          value={Iktva}
          onChange={(e) => {
            setIktva(e.target.value);
            setError(""); // إعادة تعيين رسالة الخطأ عند التغيير
          }}
          placeholder="Enter Iktva percentage"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          min="0"
          max="100"
          required
        />
      </div>

      {/* حقل كلمة المرور */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Password:</label>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      {/* زر الإضافة */}
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