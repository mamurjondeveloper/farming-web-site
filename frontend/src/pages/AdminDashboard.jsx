import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function AdminDashboard() {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    // Verify token validity
    api
      .get("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setAdminUser(res.data.admin);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        navigate("/admin/login");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading Dashboard...</div>;
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Boshqaruv Paneli</h1>
          <p className="text-sm text-slate-500 mt-1">
            Xush kelibsiz, <span className="font-semibold text-green-700">{adminUser?.username}</span> (Rol: {adminUser?.role})
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
        >
          Chiqish
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder stats cards */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-green-300 transition-colors">
          <h3 className="text-lg font-bold text-slate-700">Maqolalar</h3>
          <p className="mt-2 text-sm text-slate-500">Tizimdagi barcha maqolalarni o'qish, yangilari qo'shish va mavjudlarini tahrirlash.</p>
          <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
            <button onClick={() => navigate("/admin/articles")} className="w-full text-sm font-semibold text-white bg-green-600 rounded-lg px-3 py-2 hover:bg-green-700 transition">Boshqarish</button>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-300 transition-colors">
          <h3 className="text-lg font-bold text-slate-700">Narxlar (Hududiy)</h3>
          <p className="mt-2 text-sm text-slate-500">Bozorlardagi mahsulot narxlarini qo'shish, o'chirish va yangilash formasi.</p>
          <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
            <button onClick={() => navigate("/admin/prices")} className="w-full text-sm font-semibold text-white bg-blue-600 rounded-lg px-3 py-2 hover:bg-blue-700 transition">Boshqarish</button>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-emerald-300 transition-colors">
          <h3 className="text-lg font-bold text-slate-700">O'rtacha Narxlar (Ticker)</h3>
          <p className="mt-2 text-sm text-slate-500">Saytning sahifalari tepasida chiqib turuvchi o'rtacha narxlarni tahrirlash.</p>
          <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
            <button onClick={() => navigate("/admin/ticker")} className="w-full text-sm font-semibold text-white bg-emerald-600 rounded-lg px-3 py-2 hover:bg-emerald-700 transition">Boshqarish</button>
          </div>
        </div>
      </div>
      
      {/* For registering new admins */}
      {adminUser?.role === "superadmin" && (
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
           <h3 className="text-lg font-bold text-emerald-800">Faqat Superadmin uchun</h3>
           <p className="text-sm text-emerald-700 mb-4">Bu bo'lim orqali tizimga yangi administrator yoki tahrirchi (editor) ni ro'yxatdan o'tkazasiz.</p>
           <button onClick={() => navigate("/admin/register")} className="text-sm font-semibold text-white bg-emerald-600 rounded-lg px-4 py-2 hover:bg-emerald-700 transition shadow">
             + Yangi admin qo'shish
           </button>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
