import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CartAddingPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    type: "",
    photo: null,
  });

  const [preview, setPreview] = useState(null);

  // ✅ Handle text inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      setPreview(URL.createObjectURL(file)); // image preview
    }
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.type || !formData.photo) {
      alert("⚠️ Please fill all fields!");
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("type", formData.type);
      data.append("photo", formData.photo);

      const token = localStorage.getItem("token");

      const res = await axios.post("http://localhost:8080/api/products/save", data, {
        headers: {
          Authorization: `Bearer ${token}`, // 👈 JWT token required
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Product added successfully!");
      navigate("/listing"); // redirect to product listing page
    } catch (err) {
      console.error("❌ Error adding product:", err);
      alert("❌ Failed to add product! Check console for details.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-2xl p-8 w-11/12 sm:w-96"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          ➕ Add New Product
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Product Name */}
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400"
            required
          />

          {/* Product Price */}
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="number"
            name="price"
            placeholder="Product Price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400"
            required
          />

          {/* Product Type */}
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            name="type"
            placeholder="Product Type (e.g., Electronics, Clothing)"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400"
            required
          />

          {/* Product Photo */}
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400"
            required
          />

          {/* Preview */}
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 w-full h-40 object-cover rounded-lg border"
            />
          )}

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-xl font-semibold hover:bg-indigo-700"
          >
            Add Product
          </motion.button>
        </form>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/cart")}
          className="mt-4 w-full px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600"
        >
          Back to Cart
        </motion.button>
      </motion.div>
    </div>
  );
}
