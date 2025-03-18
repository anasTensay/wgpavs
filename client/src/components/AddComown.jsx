"use client";

import React, { useState } from "react";

const AddComown = () => {
    const [companyId, setCompanyId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // حالة لتخزين رسائل الخطأ
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const comown = {
                companyId,
                name,
                email,
                password,
            };
            const res = await fetch(`${apiUrl}/api/authComown/register`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(comown),
            });
            const data = await res.json();

            if (res.ok) {
                setCompanyId("");
                setName("");
                setEmail("");
                setPassword("");
                setError(""); // إعادة تعيين رسالة الخطأ
                alert("تمت إضافة صاحب الشركة بنجاح");
            } else {
                // عرض رسالة الخطأ من الخادم
                setError(data.message || "حدث خطأ أثناء إضافة صاحب الشركة");
            }
        } catch (error) {
            console.error("An error occurred while adding the comown:", error);
            setError("حدث خطأ أثناء إضافة صاحب الشركة");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 text-center">Add Comown</h3>

            {/* عرض رسالة الخطأ إذا كانت موجودة */}
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

            {/* حقل معرف الشركة */}
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Company ID:</label>
                <input
                    type="text"
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
            </div>

            {/* حقل اسم صاحب الشركة */}
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

            {/* حقل كلمة المرور */}
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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

export default AddComown;