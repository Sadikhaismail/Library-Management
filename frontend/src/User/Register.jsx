import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../Api";

const UserRegister = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const isValid = {
    name: form.name.trim().length > 0,
    email: /\S+@\S+\.\S+/.test(form.email),
    password: form.password.length >= 6,
    confirmPassword: form.confirmPassword === form.password && form.confirmPassword.length > 0,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/users/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  const inputClass = (field) =>
    `w-full h-14 text-lg border rounded-md pl-4 focus:outline-none focus:ring-2 ${
      touched[field]
        ? isValid[field]
          ? "border-green-500 focus:ring-green-500"
          : "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-indigo-500"
    }`;

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md">
        {/* Heading */}
        <div className="mb-4 text-center">
          <h1 className="text-3xl font-bold text-indigo-700">
            Welcome to BookWorld 📚
          </h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm text-center mb-4">{error}</div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white p-6 rounded-lg shadow-lg"
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            autoComplete="name"
            className={inputClass("name")}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            autoComplete="email"
            className={inputClass("email")}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            autoComplete="new-password"
            className={inputClass("password")}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            autoComplete="new-password"
            className={inputClass("confirmPassword")}
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Register
          </button>
        </form>

        {/* Link to Login */}
        <p className="mt-5 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserRegister;
