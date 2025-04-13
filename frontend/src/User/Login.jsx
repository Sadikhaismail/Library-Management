import React, { useState } from "react";
import API from "../Api";
import { useNavigate, Link } from "react-router-dom";

const UserLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Step 1: Validate email ends with @gmail.com
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(form.email)) {
      setError("Email format is invalid (must end with @gmail.com)");
      return;
    }

    try {
      const { data } = await API.post("/api/users/login", form);
      const { token } = data;
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err) {
      // ✅ Step 2: Handle email not registered
      if (
        err.response?.data?.message?.toLowerCase().includes("not registered")
      ) {
        setError("Email not registered");
      } else {
        setError(err.response?.data?.message || "Login failed");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">
            Explore the Book World
          </h1>
          <p className="text-sm text-gray-600">
            Login to start your reading journey.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
            autoComplete="email"
            className="w-full h-12 px-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            autoComplete="current-password"
            className="w-full h-12 px-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 transition duration-300"
          >
            Login
          </button>
        </form>

        {/* Register Link */}
        <p className="text-sm text-center text-gray-600 mt-4">
          Not registered?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
