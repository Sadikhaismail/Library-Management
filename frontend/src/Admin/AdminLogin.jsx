import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../Api";

const AdminLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // clear error while typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Check if email ends with '@gmail.com'
    if (!form.email.endsWith("@gmail.com")) {
      setError("Invalid email format");
      return;
    }

    try {
      const { data } = await API.post("/api/admin/login", form);
      setSuccessMessage(data.message);
      setError("");

      localStorage.setItem("token", data.token);

      setTimeout(() => {
        navigate("/manage");
      }, 1500);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message === "Email not registered"
          ? "Email not registered. Please check or register."
          : err.response?.data?.message || "Something went wrong";

      setSuccessMessage("");
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Admin Login
        </h2>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {successMessage && <p className="text-green-600 text-center mb-4">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Not registered?{" "}
          <Link to="/Admin" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
