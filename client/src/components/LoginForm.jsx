"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";

const LoginForm = ({ role }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // تحديد API بناءً على نوع المستخدم
  const getApiEndpoint = () => {
    switch (role) {
      case "admin":
        return `${apiUrl}/api/authAdmin/login`;
      case "owner":
        return `${apiUrl}/api/authComown/login`;
      case "contractor":
        return `${apiUrl}/api/contractors/login`;
      case "officer":
        return `${apiUrl}/api/officer/login`;
      default:
        return `${apiUrl}/api/auth/login`;
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());

    try {
      const res = await fetch(getApiEndpoint(), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || data.success === false) {
        dispatch(signInFailure(data.message));
        throw new Error(data.message || "Login failed. Please try again.");
      }

      dispatch(signInSuccess(data));

      // تحديد الصفحة التي سيتم التوجيه إليها
      if (data.isAdmin) {
        router.push(`/dashboardAdm`);
      } else if (data.isComown) {
        router.push(`/dashboardOwn`);
      } else if (data.isContractor) {
        router.push(`/dashboardCont`);
      }
      else if (data.isOfficer) {
        router.push(`/projectPage`);
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center py-10"
    >
      <div className="flex w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="w-full lg:w-1/2 px-6 py-8">
          <h2 className="text-3xl font-semibold text-center mb-6">
            {role.charAt(0).toUpperCase() + role.slice(1)} Login
          </h2>

          {errorMessage && (
            <div className="mb-4 text-red-500 text-center">{errorMessage}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-lg font-medium mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg mt-4 transition"
              disabled={loading}
            >
              {loading ? "جارٍ التسجيل..." : "تسجيل الدخول"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link href={"/register"}>ليس لدي حساب؟</Link>
            <button
              onClick={() => router.push("/login")}
              className="text-blue-500 hover:underline"
            >
              تسجيل الدخول
            </button>
          </div>
        </div>

        <div
          className="hidden lg:block w-1/2 bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/contact_img.png")' }}
        ></div>
      </div>
    </div>
  );
};

export default LoginForm;
