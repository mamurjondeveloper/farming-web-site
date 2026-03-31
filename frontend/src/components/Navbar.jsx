import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

function navClassName({ isActive }) {
  return isActive
    ? "rounded-md bg-green-100 px-3 py-2 text-green-800 transition-colors"
    : "rounded-md px-3 py-2 text-slate-700 hover:bg-green-50 hover:text-green-700 transition-colors";
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const { language, changeLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white shadow-sm transition-all duration-300">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo va loyiha nomi */}
        <Link to="/" className="text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 hover:scale-105 transition-transform">
          Fermer-Info
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
        </nav>

        {/* Mobil menyu tugmasi */}
        <button
          type="button"
          className="rounded-md border border-green-200 px-3 py-2 text-sm text-green-700 md:hidden active:bg-green-50"
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
                className={`flex-1 py-1 text-xs font-semibold rounded ${
                  language === lang
                    ? "bg-green-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                } transition-colors uppercase`}
              >
                {lang}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

export default Navbar;
