import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";

export default function CartPage() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const token = localStorage.getItem("token");

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Cart from backend
  useEffect(() => {
    if (!userId || !token) {
      navigate("/signin");
      return;
    }

    const fetchCart = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/cart/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(res.data.items || []);
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId, token, navigate]);

  // ✅ Remove product from cart
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

  // ✅ Buy single product
  const buyProduct = async (item) => {
    alert(`You bought ${item.product.name} for ₹${item.product.price}`);
    await removeFromCart(item.product.id);
  };

  // ✅ Buy all products
  const buyAllProducts = async () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    const totalAmount = cart.reduce(
      (acc, item) => acc + Number(item.product.price),
      0
    );

    alert(`You bought all products for ₹${totalAmount}`);

    try {
      await axios.delete(`http://localhost:8080/api/cart/${userId}/clear`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart([]);
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  if (loading) {
    return <h2 className="text-center mt-10">Loading cart...</h2>;
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h2 className="text-2xl font-bold text-gray-600">🛒 Your Cart is Empty</h2>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/listing")}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Back to Products
        </motion.button>
      </div>
    );
  }

  // ✅ Total Amount for UI display
  const totalAmount = cart.reduce((acc, item) => acc + Number(item.product.price), 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cart.map((item) => (
          <motion.div
            key={item.id}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="font-semibold text-lg">{item.product.name}</h2>
            <p className="text-sm text-gray-500">{item.product.productType}</p>
            <p className="text-green-600 font-bold">₹{item.product.price}</p>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => removeFromCart(item.product.id)}
              className="mt-3 w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Remove from Cart
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => buyProduct(item)}
              className="mt-2 w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Buy Product
            </motion.button>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold">
          Total Amount: <span className="text-green-600 font-bold">₹{totalAmount}</span>
        </h2>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={buyAllProducts}
          className="mt-4 w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Buy All Products
        </motion.button>
      </div>
    </div>
  );
}
