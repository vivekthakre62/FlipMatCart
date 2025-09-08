import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ListingPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [categories, setCategories] = useState(["All"]); // dynamic categories
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "USER";
  const userId = user?.id;
  const token = localStorage.getItem("token");

  // ✅ Fetch products, cart & categories
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/products/show");
        setProducts(res.data);
        // setCategories(["All", ...res.data.productType]);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/products/catagories");
        setCategories(["All", ...res.data]);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    const fetchCart = async () => {
      if (!userId || !token) return;
      try {
        const res = await axios.get(`http://localhost:8080/api/cart/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(res.data.items || []);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    fetchProducts();
    fetchCategories();
    fetchCart();
  }, [userId, token]);

  // ✅ Cart actions
  const addToCart = async (product) => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/cart/${userId}/add/${product.id}`,
        { quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data.items || []);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/cart/${userId}/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data.items || []);
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  const isInCart = (id) => cart.some((item) => item.product?.id === Number(id));

  const buyProduct = async (product) => {
    await addToCart(product);
    navigate("/cart");
  };

  // ✅ Admin actions
  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:8080/api/products/remove?productId=${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/signin");
  };

  // ✅ Filtered products
  const filteredProducts = products.filter((product) => {
    const categoryMatch = categoryFilter === "All" || product.productType === categoryFilter;
    const priceMatch =
      priceFilter === "All" ||
      (priceFilter === "Low" && product.price < 5000) ||
      (priceFilter === "Medium" && product.price >= 5000 && product.price <= 20000) ||
      (priceFilter === "High" && product.price > 20000);
    return categoryMatch && priceMatch;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Product Listing</h1>
        <div className="flex gap-3">
          {role === "USER" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/cart")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
            >
              🛒 Cart
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
          >
            🚪 Logout
          </motion.button>
          {role === "ADMIN" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/cartadding")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
            >
              + Add Product
            </motion.button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6 items-center sm:items-start">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full sm:w-auto"
        >
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full sm:w-auto"
        >
          <option value="All">All Prices</option>
          <option value="Low">Below ₹5000</option>
          <option value="Medium">₹5000 - ₹20000</option>
          <option value="High">Above ₹20000</option>
        </select>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl flex flex-col items-center"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={`data:image/jpeg;base64,${product.data}`}
              alt={product.name}
              className="w-full h-40 sm:h-48 object-cover rounded-lg"
            />
            <h2 className="font-semibold text-base sm:text-lg mt-2 text-center">{product.name}</h2>
            <p className="text-sm text-gray-500">{product.productType}</p>
            <p className="text-green-600 font-bold">₹{product.price}</p>

            {role === "ADMIN" ? (
              <div className="w-full flex flex-col gap-2 mt-3">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate(`/updatecart/${product.id}`)}
                  className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                  Update Product
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteProduct(product.id)}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete Product
                </motion.button>
              </div>
            ) : (
              <div className="w-full flex flex-col gap-2 mt-3">
                {isInCart(product.id) ? (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeFromCart(product.id)}
                    className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Remove from Cart
                  </motion.button>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addToCart(product)}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Add to Cart
                  </motion.button>
                )}

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => buyProduct(product)}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Buy Product
                </motion.button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
