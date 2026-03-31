import { Navigate, Route, Routes } from "react-router-dom";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import FloatingAuth from "./components/FloatingAuth";
import Home from "./pages/Home";
import Articles from "./pages/Articles";
import Prices from "./pages/Prices";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRegister from "./pages/AdminRegister";
import AdminArticles from "./pages/AdminArticles";
import AdminPrices from "./pages/AdminPrices";

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-800">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/prices" element={<Prices />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/articles" element={<AdminArticles />} />
          <Route path="/admin/prices" element={<AdminPrices />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Suzib yuradigan Login/Register oynasi */}
      <FloatingAuth />
    </div>
  );
}

export default App;
