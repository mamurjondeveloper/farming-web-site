import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function AdminRegister() {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("editor");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("adminUser");
    if (!userStr) {
      navigate("/admin/login");
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== "superadmin") {
      navigate("/admin/dashboard");
      return;
    }
    setAdminUser(user);
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccessMsg("");

      const token = localStorage.getItem("adminToken");
      await api.post(
        "/api/auth/register",
        { username, password, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMsg("Yangi admin muvaffaqiyatli yaratildi!");
      setUsername("");
      setPassword("");
      setRole("editor");
    } catch (err) {
      setError(err.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  if (!adminUser) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 animate-in fade-in duration-500">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Yangi Admin Qo'shish</h1>
          <p className="text-sm text-slate-500 mt-1">Faqat superadminlar uchun ruxsat etilgan.</p>
        </div>
        <Link to="/admin/dashboard" className="text-sm font-medium text-green-600 hover:text-green-800 hover:underline">
           &larr; Orqaga
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100 flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}
        
        {successMsg && (
          <div className="mb-6 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 border border-emerald-100 flex items-center gap-2">
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Login (Username)</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 bg-slate-50 focus:bg-white"
              placeholder="Yangi login"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Parol</label>
            <input
              type="text"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 bg-slate-50 focus:bg-white"
              placeholder="Yangi parol"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Administrator Roli</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 bg-slate-50 focus:bg-white"
            >
              <option value="editor">Oddiy Admin (Maqola va Narxlar tahrirchisi)</option>
              <option value="superadmin">Superadmin (Barcha huquqlar)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-green-700 disabled:opacity-70 mt-2"
          >
            {loading ? "Qo'shilmoqda..." : "Admin yaratish"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminRegister;
