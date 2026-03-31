import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";

function navClassName({ isActive }) {
  return isActive
    ? "rounded-md bg-green-100 px-3 py-2 text-green-800 transition-colors"
    : "rounded-md px-3 py-2 text-slate-700 hover:bg-green-50 hover:text-green-700 transition-colors";
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { language, changeLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const profileRef = useRef();

  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("adminUser");
    if (userStr) {
      try { setAdminUser(JSON.parse(userStr)); } catch(e) {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setAdminUser(null);
    setProfileOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileRef]);

  return (
    <header className="sticky top-0 z-50 border-b border-green-100 bg-white/80 backdrop-blur-xl shadow-sm transition-all duration-300">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo va loyiha nomi */}
        <Link to="/" className="flex items-center gap-2 group">
           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-green-500/30 group-hover:scale-105 transition-transform">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21.05v-8.49M7.414 9.172A5.986 5.986 0 0112 7.414a5.986 5.986 0 014.586 1.758M12 12v3" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.243 14.828c.78-.78.78-2.048 0-2.828l-8.486-8.485C6.977 2.734 5.709 2.734 4.93 3.515S3.515 5.56 4.293 6.342l8.485 8.486c.78.78 2.048.78 2.828 0z" />
             </svg>
           </div>
           <span className="text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-600 group-hover:from-green-600 group-hover:to-emerald-500 transition-colors">
             Fermer-Info
           </span>
        </Link>

        {/* Desktop menyu */}
        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={navClassName}>
            {t("home")}
          </NavLink>
          <NavLink to="/articles" className={navClassName}>
            {t("articles")}
          </NavLink>
          <NavLink to="/prices" className={navClassName}>
            {t("prices")}
          </NavLink>
          
          {/* Tillar */}
          <div className="ml-4 flex items-center gap-1 border-l pl-4 border-slate-200">
            {["uz", "ru", "en"].map((lang) => (
              <button
                key={lang}
                onClick={() => changeLanguage(lang)}
                className={`px-2 py-1 text-xs font-semibold rounded ${
                  language === lang
                    ? "bg-green-600 text-white"
                    : "text-slate-500 hover:bg-slate-100"
                } transition-colors uppercase`}
              >
                {lang}
              </button>
            ))}
          </div>

          <div className="ml-4 border-l pl-4 border-slate-200 flex items-center gap-2 relative">
            {!adminUser ? (
               <>
                  <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-green-600 transition-colors">Kirish</Link>
                  <Link to="/register" className="text-sm font-semibold text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-lg transition-colors shadow-sm">Ro'yxatdan o'tish</Link>
               </>
            ) : (
               <div className="relative" ref={profileRef}>
                  <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 cursor-pointer outline-none group">
                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-sm font-bold uppercase shadow-sm group-hover:scale-105 transition-transform">
                       {adminUser.username.charAt(0)}
                     </div>
                     <span className="text-sm font-semibold text-slate-700 group-hover:text-green-600 transition-colors hidden lg:block">{adminUser.username}</span>
                  </button>

                  {profileOpen && (
                     <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="px-4 py-2 border-b border-slate-50 mb-1">
                           <p className="text-xs font-semibold text-slate-500 uppercase">{adminUser.role === 'superadmin' ? 'Boshqaruvchi' : adminUser.role === 'editor' ? 'Jurnalist' : 'Foydalanuvchi'}</p>
                        </div>
                        {(adminUser.role === "superadmin" || adminUser.role === "editor") && (
                           <Link to="/admin/dashboard" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 font-medium transition-colors">Dashboard</Link>
                        )}
                        <Link to="/profile" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 font-medium transition-colors">Profil o'zlamalari</Link>
                        <div className="border-t border-slate-100 my-1"></div>
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors">Chiqish</button>
                     </div>
                  )}
               </div>
            )}
          </div>
        </nav>

        {/* Mobil menyu tugmasi */}
        <button
          type="button"
          className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 md:hidden active:bg-slate-50 transition-colors"
          onClick={() => setOpen((prev) => !prev)}
        >
          Menu
        </button>
      </div>

      {/* Mobil menyu */}
      {open && (
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 pb-3 md:hidden border-t border-slate-100 pt-2 animate-in slide-in-from-top-2">
          <NavLink to="/" className={navClassName} onClick={() => setOpen(false)}>
            {t("home")}
          </NavLink>
          <NavLink to="/articles" className={navClassName} onClick={() => setOpen(false)}>
            {t("articles")}
          </NavLink>
          <NavLink to="/prices" className={navClassName} onClick={() => setOpen(false)}>
            {t("prices")}
          </NavLink>
          <div className="mt-2 flex gap-2 pt-2 border-t border-slate-100">
             {["uz", "ru", "en"].map((lang) => (
              <button
                key={lang}
                onClick={() => { changeLanguage(lang); setOpen(false); }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded ${
                  language === lang
                    ? "bg-green-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                } transition-colors uppercase`}
              >
                {lang}
              </button>
            ))}
          </div>

          <div className="mt-2 flex flex-col gap-2 pt-2 border-t border-slate-100 pb-2">
            {!adminUser ? (
               <>
                  <Link to="/login" onClick={() => setOpen(false)} className="w-full text-center py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm">Kirish</Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="w-full text-center py-2 rounded-lg bg-green-600 text-white font-semibold text-sm shadow-sm">Ro'yxatdan o'tish</Link>
               </>
            ) : (
               <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3 mb-3 border-b border-slate-200 pb-3">
                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold uppercase shadow-sm">
                       {adminUser.username.charAt(0)}
                     </div>
                     <div>
                        <p className="text-sm font-bold text-slate-800">{adminUser.username}</p>
                        <p className="text-xs text-slate-500 uppercase font-semibold">{adminUser.role === 'superadmin' ? 'Boshqaruvchi' : adminUser.role === 'editor' ? 'Jurnalist' : 'Foydalanuvchi'}</p>
                     </div>
                  </div>
                  
                  <div className="space-y-1">
                     {(adminUser.role === "superadmin" || adminUser.role === "editor") && (
                        <Link to="/admin/dashboard" onClick={() => setOpen(false)} className="block w-full py-2 px-3 rounded-lg text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 font-medium transition-colors">Dashboard</Link>
                     )}
                     <Link to="/profile" onClick={() => setOpen(false)} className="block w-full py-2 px-3 rounded-lg text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 font-medium transition-colors">Profil o'zlamalari</Link>
                     <button onClick={handleLogout} className="w-full text-left py-2 px-3 rounded-lg text-sm text-red-600 hover:bg-red-50 font-medium transition-colors">Tizimdan chiqish</button>
                  </div>
               </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

export default Navbar;
