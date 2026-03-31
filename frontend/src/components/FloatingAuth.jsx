import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function FloatingAuth() {
  const navigate = useNavigate();

  // Oyna holatlari
  const [isOpen, setIsOpen] = useState(false);       // Forma ochiqmi
  const [isMinimized, setIsMinimized] = useState(true); // Kichik ikonka holatidami
  const [activeTab, setActiveTab] = useState("login"); // login yoki register

  // Login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Register
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState("editor");

  // Logged in admin
  const [adminUser, setAdminUser] = useState(null);

  // Drag funksiyalari
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  // Sahifa yuklanganda oldindan saqlangan holatni ko'rish
  useEffect(() => {
    const userStr = localStorage.getItem("adminUser");
    if (userStr) {
      try { setAdminUser(JSON.parse(userStr)); } catch(e) {}
    }
    // Boshlang'ich pozitsiya - pastki o'ng burchak
    setPosition({
      x: window.innerWidth - 80,
      y: window.innerHeight - 80,
    });
  }, []);

  // ---- DRAG LOGIKASI ----
  const handleMouseDown = useCallback((e) => {
    if (!isMinimized) return; // Faqat ikonkani sudrab olish
    setIsDragging(true);
    const rect = dragRef.current.getBoundingClientRect();
    offsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, [isMinimized]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    const newX = e.clientX - offsetRef.current.x;
    const newY = e.clientY - offsetRef.current.y;
    setPosition({
      x: Math.max(0, Math.min(newX, window.innerWidth - 64)),
      y: Math.max(0, Math.min(newY, window.innerHeight - 64)),
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // ---- TOUCH DRAG (mobile) ----
  const handleTouchStart = useCallback((e) => {
    if (!isMinimized) return;
    setIsDragging(true);
    const rect = dragRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    offsetRef.current = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  }, [isMinimized]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPosition({
      x: Math.max(0, Math.min(touch.clientX - offsetRef.current.x, window.innerWidth - 64)),
      y: Math.max(0, Math.min(touch.clientY - offsetRef.current.y, window.innerHeight - 64)),
    });
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleMouseUp);
      return () => {
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleMouseUp);
      };
    }
  }, [isDragging, handleTouchMove, handleMouseUp]);

  // ---- AUTH FUNKSIYALARI ----
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const res = await api.post("/api/auth/login", { username, password });
      if (res.data.success && res.data.token) {
        localStorage.setItem("adminToken", res.data.token);
        localStorage.setItem("adminUser", JSON.stringify(res.data.admin));
        setAdminUser(res.data.admin);
        setUsername("");
        setPassword("");
        setIsOpen(false);
        setIsMinimized(true);
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login yoki parol noto'g'ri");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const token = localStorage.getItem("adminToken");
      await api.post("/api/auth/register", { username: regUsername, password: regPassword, role: regRole }, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess("Yangi admin muvaffaqiyatli yaratildi!");
      setRegUsername("");
      setRegPassword("");
      setRegRole("editor");
    } catch (err) {
      setError(err.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setAdminUser(null);
    setIsOpen(false);
    setIsMinimized(true);
    navigate("/");
  };

  const openWidget = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setError("");
    setSuccess("");
  };

  const minimizeWidget = () => {
    setIsOpen(false);
    setIsMinimized(true);
  };

  // ---- MINIMIZED ICON (Suzib yuradigan kichik tugma) ----
  if (isMinimized) {
    return (
      <div
        ref={dragRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={() => { if (!isDragging) openWidget(); }}
        style={{
          position: "fixed",
          left: position.x,
          top: position.y,
          zIndex: 9999,
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
          touchAction: "none",
        }}
        className="group"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-green-500/40 active:scale-95 border-2 border-white/30">
          {adminUser ? (
            <span className="text-white text-lg font-bold uppercase">{adminUser.username.charAt(0)}</span>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
          {/* Online ko'rsatkich */}
          {adminUser && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
          )}
        </div>
      </div>
    );
  }

  // ---- OPEN WIDGET (Katta forma oynasi) ----
  return (
    <>
      {/* Qorong'ilashgan orqa fon */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998] transition-opacity"
        onClick={minimizeWidget}
      />

      <div
        className="fixed z-[9999] w-[360px] max-h-[85vh] overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-2xl shadow-black/10"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-700">
              {adminUser ? `${adminUser.username}` : "Kirish"}
            </span>
          </div>
          <button
            onClick={minimizeWidget}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-red-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* ---- Agar admin tizimga kirgan bo'lsa ---- */}
          {adminUser ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg uppercase">
                  {adminUser.username.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{adminUser.username}</p>
                  <p className="text-xs text-green-600 font-medium">{adminUser.role === "superadmin" ? "Super Admin" : "Tahrirchi"}</p>
                </div>
              </div>

              <button
                onClick={() => { navigate("/admin/dashboard"); minimizeWidget(); }}
                className="w-full py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm"
              >
                📊 Boshqaruv Paneliga o'tish
              </button>

              {/* Superadmin uchun Register tab */}
              {adminUser.role === "superadmin" && (
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Yangi Admin Yaratish</p>
                  {error && <p className="text-xs text-red-500 mb-2 p-2 bg-red-50 rounded-lg">{error}</p>}
                  {success && <p className="text-xs text-green-600 mb-2 p-2 bg-green-50 rounded-lg">{success}</p>}
                  <form onSubmit={handleRegister} className="space-y-3">
                    <input type="text" required placeholder="Yangi login" value={regUsername} onChange={e => setRegUsername(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 bg-slate-50 focus:bg-white transition" />
                    <input type="text" required placeholder="Parol" value={regPassword} onChange={e => setRegPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 bg-slate-50 focus:bg-white transition" />
                    <select value={regRole} onChange={e => setRegRole(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-green-400 bg-slate-50 focus:bg-white transition">
                      <option value="editor">Oddiy Admin</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                    <button type="submit" disabled={loading}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-50">
                      {loading ? "Yaratilmoqda..." : "+ Admin yaratish"}
                    </button>
                  </form>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="w-full py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors"
              >
                Chiqish
              </button>
            </div>
          ) : (
            /* ---- Login forma ---- */
            <div>
              {error && (
                <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-100 text-xs text-red-600 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Login</label>
                  <input
                    type="text" required value={username} onChange={e => setUsername(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 bg-slate-50 focus:bg-white transition"
                    placeholder="admin"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Parol</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 bg-slate-50 focus:bg-white transition pr-10"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-green-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {showPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        )}
                      </svg>
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold shadow-md shadow-green-600/20 hover:shadow-lg hover:shadow-green-600/30 transition-all active:scale-[0.98] disabled:opacity-60">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Kirish...
                    </span>
                  ) : "Tizimga kirish"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default FloatingAuth;
