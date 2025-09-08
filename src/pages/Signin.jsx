import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailid: "",
    password: "",
    role: "USER", // ✅ default role
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Signin Data:", formData);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/eccomerce/login",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Signin success:", res.data);

      // ✅ Save user & token in localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      alert("Signed in successfully ✅");
    
      navigate("/listing");
     
    } catch (err) {
      console.error("Signin error:", err);
      alert("Invalid credentials!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-2xl p-8 w-11/12 sm:w-96"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="email"
            name="emailid"
            placeholder="Email Address"
            value={formData.emailid}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400"
            required
          />
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400"
            required
          />

          {/* ✅ Role Selection (User / Admin) */}
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
            className="w-full bg-indigo-600 text-white py-2 rounded-xl font-semibold hover:bg-indigo-700"
          >
            Sign In
          </motion.button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
