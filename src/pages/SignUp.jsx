import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "USER", // ✅ Default role
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Signup Data:", formData);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/eccomerce/register",
        {
          emailid: formData.email,
          password: formData.password,
          fullname: formData.fullname,
          role: formData.role, // ✅ Send role to backend
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Signup success:", res.data);
      alert("Signed Up Successfully!");
      navigate("/signin");
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-2xl p-8 w-11/12 sm:w-96"
      >
        <h2 className="text-3xl font-bold text-center text-purple-600 mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={formData.fullname}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-400"
            required
          />
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-400"
            required
          />
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-400"
            required
          />

          {/* ✅ Role Selection */}
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="USER"
                checked={formData.role === "USER"}
                onChange={handleChange}
              />
              User
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="ADMIN"
                checked={formData.role === "ADMIN"}
                onChange={handleChange}
              />
              Admin
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-xl font-semibold hover:bg-purple-700"
          >
            Sign Up
          </motion.button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-purple-600 font-semibold hover:underline"
            onClick={() => {
              console.log("Navigating to signin page");
            }}
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
