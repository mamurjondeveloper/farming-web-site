import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useLanguage } from "../context/LanguageContext";

function Home() {
  const [latestArticles, setLatestArticles] = useState([]);
  const [latestPrices, setLatestPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchHomeData() {
      try {
        setLoading(true);
        setError("");

        const [articlesRes, pricesRes] = await Promise.all([
          api.get("/api/articles"),
          api.get("/api/prices"),
        ]);

        const articleList = articlesRes?.data?.data || [];
        const priceList = pricesRes?.data?.data || [];

        setLatestArticles(articleList.slice(0, 3));
        setLatestPrices(priceList.slice(0, 3));
      } catch (_err) {
        setError("Ma'lumotlarni yuklashda xatolik yuz berdi. Keyinroq qayta urinib ko'ring.");
      } finally {
        setLoading(false);
      }
    }

    fetchHomeData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-emerald-500 to-teal-600 p-8 shadow-2xl md:p-14 border border-green-500 text-white shadow-green-600/30">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {/* Subtle nature pattern background */}
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}></div>
        </div>
        
        {/* Animated Leaf SVG 1 */}
        <div className="absolute top-10 right-10 opacity-20 animate-float-slow text-white pointer-events-none">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,22c0,0-10-10-10-15s5-5,10-5s10,0,10,5S12,22,12,22z M12,4c-3.3,0-6,1.8-6,4c0,3.3,3.4,8,6,12 c2.6-4,6-8.7,6-12C18,5.8,15.3,4,12,4z"/>
            <path d="M12,20c-0.6,0-1-0.4-1-1v-8c0-0.6,0.4-1,1-1s1,0.4,1,1v8C13,19.6,12.6,20,12,20z"/>
          </svg>
        </div>

        {/* Animated Leaf SVG 2 */}
        <div className="absolute -bottom-8 left-1/4 opacity-15 animate-sway text-white pointer-events-none" style={{ transformOrigin: 'bottom center' }}>
          <svg width="180" height="180" viewBox="0 0 24 24" fill="currentColor">
             <path d="M21.36,6.2C20.66,4.72,18.06,2,11.5,2C4.34,2,2.07,7.18,2.02,7.31c-0.1,0.25-0.12,0.52-0.08,0.78 C2.01,8.37,2.2,8.6,2.46,8.7c0.05,0.02,4.88,1.8,10.04,1.8c3.27,0,6.28-0.67,8.68-1.92c0.26-0.14,0.47-0.34,0.57-0.61 C21.85,7.7,21.9,7.38,21.36,6.2z"/>
             <path d="M11.5,22c-0.11,0-0.22-0.01-0.34-0.04c-0.42-0.13-0.72-0.48-0.78-0.91C10.15,19.66,8.59,15.9,2.83,11.53 c-0.44-0.33-0.53-0.96-0.2-1.4c0.33-0.44,0.96-0.53,1.4-0.2c5.96,4.52,7.71,8.51,7.97,9.97C12.18,20.08,12,20.4,11.66,20.52 C11.61,20.54,11.55,20.55,11.5,20.55z"/>
          </svg>
        </div>

        <div className="relative z-10 max-w-2xl">
          <span className="inline-block py-1 px-3 rounded-full bg-white/20 text-white text-xs font-bold tracking-wider mb-4 border border-white/30 backdrop-blur-md">FERMER-INFO PLATFORMASI</span>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl leading-tight text-white animate-grow">
            {t("welcome")}
          </h1>
          <p className="mt-5 text-green-100 md:text-xl leading-relaxed max-w-xl font-medium">
            {t("welcomeDesc")}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/articles" className="btn-farm bg-white text-green-700 shadow-xl shadow-black/10">Barcha maqolalar</Link>
            <Link to="/prices" className="btn-farm-outline border-white/40 text-white hover:bg-white hover:text-green-700 hover:border-white">Narxlar jadvali</Link>
          </div>
        </div>
        {/* Decorative blobs */}
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-emerald-400/40 blur-3xl mix-blend-screen pointer-events-none"></div>
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-teal-400/30 blur-3xl mix-blend-screen pointer-events-none"></div>
      </section>

      {loading && (
        <div className="grid gap-6 lg:grid-cols-2 animate-pulse">
           <div className="h-64 rounded-2xl bg-slate-200"></div>
           <div className="h-64 rounded-2xl bg-slate-200"></div>
        </div>
      )}
      
      {error && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">{error}</p>}

      {!loading && !error && (
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Articles Section */}
          <section className="farm-card p-6 flex flex-col h-full animate-float" style={{ animationDelay: "0.2s" }}>
            <div className="mb-6 flex items-center justify-between border-b border-green-100 pb-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                 </div>
                 <h2 className="text-xl font-bold text-slate-800">{t("latestArticles")}</h2>
              </div>
              <Link to="/articles" className="text-sm font-bold text-green-600 hover:text-green-800 hover:scale-105 transition-transform flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-lg">
                {t("viewAll")} <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className="space-y-4 flex-1">
              {latestArticles.length === 0 ? (
                <div className="flex items-center justify-center p-8 border-2 border-dashed border-green-200 rounded-2xl bg-white/50 h-full">
                   <p className="text-sm text-green-700/60 font-medium">{t("noArticles")}</p>
                </div>
              ) : (
                latestArticles.map((item) => {
                  const getImageSrc = (url) => {
                    if (!url) return null;
                    if (url.startsWith('http')) return url;
                    return `http://localhost:5000${url}`;
                  };
                  return (
                    <article key={item.id} className="group rounded-2xl border border-white/60 bg-white/60 p-4 transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-green-600/5 hover:-translate-y-1 cursor-pointer flex flex-col sm:flex-row gap-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-100 to-transparent opacity-50 rounded-bl-3xl z-0"></div>
                      {item.coverImage && (
                        <img src={getImageSrc(item.coverImage)} alt={item.title} className="w-full sm:w-28 h-40 sm:h-28 rounded-xl object-cover flex-shrink-0 shadow-sm relative z-10" />
                      )}
                      <div className="relative z-10 flex-1">
                        <h3 className="font-extrabold text-slate-800 group-hover:text-green-600 transition-colors text-lg leading-snug">{item.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm text-slate-500 font-medium leading-relaxed">{item.summary}</p>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>

          {/* Prices Section */}
          <section className="farm-card p-6 flex flex-col h-full animate-float-slow" style={{ animationDelay: "0.5s" }}>
            <div className="mb-6 flex items-center justify-between border-b border-green-100 pb-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                 </div>
                 <h2 className="text-xl font-bold text-slate-800">{t("priceSummary")}</h2>
              </div>
              <Link to="/prices" className="text-sm font-bold text-orange-600 hover:text-orange-800 hover:scale-105 transition-transform flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-lg">
                {t("goToTable")} <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className="space-y-3 flex-1">
              {latestPrices.length === 0 ? (
                <div className="flex items-center justify-center p-8 border-2 border-dashed border-orange-200 rounded-2xl bg-white/50 h-full">
                   <p className="text-sm text-orange-700/60 font-medium">{t("noPrices")}</p>
                </div>
              ) : (
                latestPrices.map((item) => (
                  <div key={item.id} className="group flex items-center justify-between rounded-2xl border border-white/60 bg-white/60 p-4 transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-orange-600/5 hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-orange-100 to-transparent opacity-50 rounded-bl-3xl z-0"></div>
                    <div className="relative z-10">
                      <p className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                        <span>{item.productName}</span>
                        <span className="text-[10px] uppercase font-bold text-orange-600 bg-orange-100 px-2.5 py-1 rounded-lg border border-orange-200/50">{item.region}</span>
                      </p>
                    </div>
                    <div className="text-right relative z-10">
                       <p className="font-extrabold text-orange-600 text-lg">
                        {item.priceMin?.toLocaleString?.() ?? item.priceMin} - {item.priceMax?.toLocaleString?.() ?? item.priceMax} <span className="text-xs text-orange-500/70 font-semibold">{item.currency || "UZS"}</span>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default Home;
