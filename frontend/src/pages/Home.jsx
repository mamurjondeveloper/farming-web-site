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
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8 shadow-sm md:p-12 border border-green-100">
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl leading-tight text-slate-800">
            {t("welcome")}
          </h1>
          <p className="mt-4 text-slate-600 md:text-lg leading-relaxed max-w-2xl">
            {t("welcomeDesc")}
          </p>
        </div>
        {/* Decorative blobs */}
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-green-200/40 blur-3xl"></div>
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-emerald-200/30 blur-3xl"></div>
      </section>

      {loading && (
        <div className="grid gap-6 lg:grid-cols-2 animate-pulse">
           <div className="h-64 rounded-2xl bg-slate-200"></div>
           <div className="h-64 rounded-2xl bg-slate-200"></div>
        </div>
      )}
      
      {error && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">{error}</p>}

      {!loading && !error && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Articles Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col h-full">
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-800">{t("latestArticles")}</h2>
              <Link to="/articles" className="text-sm font-semibold text-green-600 hover:text-green-800 hover:underline transition-colors flex items-center gap-1">
                {t("viewAll")} <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className="space-y-4 flex-1">
              {latestArticles.length === 0 ? (
                <div className="flex items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 h-full">
                   <p className="text-sm text-slate-500 font-medium">{t("noArticles")}</p>
                </div>
              ) : (
                latestArticles.map((item) => {
                  const getImageSrc = (url) => {
                    if (!url) return null;
                    if (url.startsWith('http')) return url;
                    return `http://localhost:5000${url}`;
                  };
                  return (
                    <article key={item.id} className="group rounded-xl border border-slate-100 bg-white p-4 transition-all duration-300 hover:bg-green-50/50 hover:shadow-md hover:border-green-200 cursor-pointer flex flex-col sm:flex-row gap-4">
                      {item.coverImage && (
                        <img src={getImageSrc(item.coverImage)} alt={item.title} className="w-full sm:w-24 h-40 sm:h-24 rounded-lg object-cover flex-shrink-0 border border-slate-100" />
                      )}
                      <div>
                        <h3 className="font-bold text-slate-800 group-hover:text-green-700 transition-colors">{item.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm text-slate-600 leading-relaxed">{item.summary}</p>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>

          {/* Prices Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col h-full">
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-800">{t("priceSummary")}</h2>
              <Link to="/prices" className="text-sm font-semibold text-green-600 hover:text-green-800 hover:underline transition-colors flex items-center gap-1">
                {t("goToTable")} <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className="space-y-3 flex-1">
              {latestPrices.length === 0 ? (
                <div className="flex items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 h-full">
                   <p className="text-sm text-slate-500 font-medium">{t("noPrices")}</p>
                </div>
              ) : (
                latestPrices.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 transition-all hover:bg-slate-50 hover:border-slate-300">
                    <div>
                      <p className="font-semibold text-slate-800 flex items-center gap-2">
                        <span>{item.productName}</span>
                        <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{item.region}</span>
                      </p>
                    </div>
                    <div className="text-right">
                       <p className="font-bold text-green-700">
                        {item.priceMin?.toLocaleString?.() ?? item.priceMin} - {item.priceMax?.toLocaleString?.() ?? item.priceMax} <span className="text-xs text-green-600/70">{item.currency || "UZS"}</span>
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
