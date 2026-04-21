import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [adminUser, setAdminUser] = useState(null);
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/login");
      return;
    }

    api.get("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const user = res.data.admin;
        setAdminUser(user);
        setUsername(user.username || "");
        setEmail(user.email || "");
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        navigate("/login");
      });
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = { username, email };
      if (password) payload.password = password;

      const token = localStorage.getItem("adminToken");
      const res = await api.put("/api/auth/profile", payload, {
         headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
         setSuccess("Profilingiz muvaffaqiyatli yangilandi");
         setAdminUser(res.data.admin);
         localStorage.setItem("adminUser", JSON.stringify(res.data.admin));
         setPassword("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
     logout();
     navigate("/");
  };

  if (loading) return <div className="text-center py-20">Yuklanmoqda...</div>;

  return (
    <div className="max-w-2xl mx-auto py-10 animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
         <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-8">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold uppercase shadow-md shadow-green-500/30">
                  {adminUser?.username?.charAt(0) || "U"}
               </div>
               <div>
                  <h1 className="text-2xl font-extrabold text-slate-800">Shaxsiy Profil</h1>
                  <p className="text-sm font-medium text-slate-500 mt-0.5">Rolingiz: {adminUser?.role === 'superadmin' ? 'Boshqaruvchi' : adminUser?.role === 'editor' ? 'Jurnalist' : 'Foydalanuvchi'}</p>
               </div>
            </div>
            
            <button onClick={handleLogout} className="px-5 py-2 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition shadow-sm border border-red-100">
               Tizimdan chiqish
            </button>
         </div>

         {error && <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 font-medium text-sm">{error}</div>}
         {success && <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-700 font-medium text-sm border border-green-200">{success}</div>}

         <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Foydalanuvchi nomi</label>
                  <input type="text" value={username} onChange={e => setUsername(e.target.value)} required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 transition" />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 transition" />
               </div>
            </div>

            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-2">Parolni o'zgartirish <span className="text-slate-400 font-normal">(ixtiyoriy)</span></label>
               <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Yangi parol (ixtiyoriy)"
                 className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 transition" />
               <p className="text-xs text-slate-500 mt-2">Agar parolni o'zgartirishni xohlamasangiz, ushbu maydonni bo'sh qoldiring.</p>
            </div>

            <div className="pt-4 flex border-t border-slate-100 justify-end gap-3 mt-8">
               {(adminUser?.role === 'superadmin' || adminUser?.role === 'editor') && (
                  <button type="button" onClick={() => navigate("/admin/dashboard")} className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition">
                     Dashboardga o'tish
                  </button>
               )}
               <button type="submit" disabled={saving} className="px-8 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 shadow-lg shadow-green-600/30 transition-all active:scale-[0.98]">
                  {saving ? "Saqlanmoqda..." : "Saqlash"}
               </button>
            </div>
         </form>
      </div>
    </div>
  );
}

export default Profile;
