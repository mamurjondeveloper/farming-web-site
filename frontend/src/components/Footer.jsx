import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="mt-8 border-t border-slate-100 bg-slate-50/50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
        <div className="text-center md:text-left">
          <p className="text-sm font-medium text-slate-500">
            &copy; {new Date().getFullYear()} Fermer-Info. {t("allRightsReserved")}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {t("footerDesc")}
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span>Ekranning pastki o'ng burchakdagi ☻ tugmani bosib tizimga kiring</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

