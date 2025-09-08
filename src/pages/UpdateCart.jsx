import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

export default function UpdateProduct() {
  const { productId } = useParams(); // ✅ route se productId lena
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/products/oneProduct?productId=${productId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, token]);

  // ✅ Handle input changes
  const handleChange = (field, value) => {
    if (field === "image") {
      const file = value;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        let base64String = reader.result;
        if (base64String.startsWith("data:image")) {
          base64String = base64String.split(",")[1]; // only raw base64
        }
        setProduct({ ...product, data: base64String });
      };
    } else {
      setProduct({ ...product, [field]: value });
    }
  };

  // ✅ Update product
  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/products/update?productId=${productId}`,
        {
          productName: product.productName,
          price: Number(product.price),
          productType: product.productType,
          data: product.data,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Product updated successfully ✅");
      navigate("/listing"); // back to product listing
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Failed to update product ❌");
    }
  };

  if (loading) return <h2 className="text-center mt-10">Loading product...</h2>;
  if (!product) return <h2 className="text-center mt-10">Product not found</h2>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Update Product</h1>

      <div className="bg-white p-6 rounded-xl shadow-md max-w-lg mx-auto">
        {product.data && (
          <img
            src={`data:image/jpeg;base64,${product.data}`}
            alt={product.productName}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}

        <label className="block mb-2">
          Name:
          <input
            type="text"
            value={product.productName}
            onChange={(e) => handleChange("productName", e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </label>

        <label className="block mb-2">
          Price:
          <input
            type="number"
            value={product.price}
            onChange={(e) => handleChange("price", e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </label>

        <label className="block mb-2">
          Product Type:
          <input
            type="text"
            value={product.productType}
            onChange={(e) => handleChange("productType", e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </label>

        <label className="block mb-4">
          Image:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleChange("image", e.target.files[0])}
            className="w-full"
          />
        </label>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleUpdate}
          className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Update Product
        </motion.button>
      </div>
    </div>
  );
}
