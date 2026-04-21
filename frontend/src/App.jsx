import { Navigate, Route, Routes } from "react-router-dom";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import TopTicker from "./components/TopTicker";
import Home from "./pages/Home";
import Articles from "./pages/Articles";
import Prices from "./pages/Prices";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRegister from "./pages/AdminRegister";
import AdminArticles from "./pages/AdminArticles";
import AdminPrices from "./pages/AdminPrices";
import AdminTicker from "./pages/AdminTicker";
import AdminNotifications from "./pages/AdminNotifications";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

function App() {
  return (
    <div className="flex min-h-[100dvh] flex-col text-slate-800">
      <TopTicker />
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/prices" element={<Prices />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/articles" element={<AdminArticles />} />
          <Route path="/admin/prices" element={<AdminPrices />} />
          <Route path="/admin/ticker" element={<AdminTicker />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
