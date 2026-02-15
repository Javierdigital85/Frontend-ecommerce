import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import Layout from "./Layout/Layout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { UserContextProvider } from "./context/UserContext";
import { ProductContextProvider } from "./context/ProductContext";
import { Toaster } from "react-hot-toast";
import DetailProduct from "./pages/DetailProduct";
import { CartContextProvider } from "./context/CartContext";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import PaymentPending from "./pages/PaymentPending";
import Profile from "./pages/Profile";
import { LanguageProvider } from "./context/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <UserContextProvider>
        <ProductContextProvider>
          <CartContextProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />}></Route>
                <Route path="/register" element={<Register />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/profile" element={<Profile />}></Route>
                <Route path="/detailProduct/:id" element={<DetailProduct />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/failure" element={<PaymentFailure />} />
                <Route path="/payment/pending" element={<PaymentPending />} />

                <Route
                  path="/admin/dashboard/*"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </CartContextProvider>
        </ProductContextProvider>
        <Toaster />
      </UserContextProvider>
    </LanguageProvider>
  );
}

export default App;
