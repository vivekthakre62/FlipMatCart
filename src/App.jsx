import { Routes, Route, BrowserRouter } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Signin from "./pages/Signin";
import ListingPage from "./pages/ListingPage";
import CartPage from "./pages/CartPage";
import Cartadding from "./pages/Cartadding";
import ProtectedRoute from "./components/ProtectedRoute";
import UpdateCart from "./pages/UpdateCart";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/listing"
          element={
            <ProtectedRoute>
              <ListingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cartadding"
          element={
            <ProtectedRoute>
              <Cartadding />
            </ProtectedRoute>
          }
        />
<Route
  path="/updatecart/:productId"
  element={
    <ProtectedRoute>
      <UpdateCart />
    </ProtectedRoute>
  }
/>

      </Routes>

    </BrowserRouter>
  );
}
