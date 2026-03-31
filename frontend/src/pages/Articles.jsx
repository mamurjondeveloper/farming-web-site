import { useEffect, useState } from "react";
import api from "../api/axios";
import { useLanguage } from "../context/LanguageContext";

function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/articles");
        setArticles(response?.data?.data || []);
      } catch (_err) {
        setError("Maqolalarni yuklashda xatolik yuz berdi.");
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  return (
    <section className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 md:text-4xl tracking-tight">
          {t("articlesTitle")}
        </h1>
        <p className="mt-3 text-base text-slate-500 max-w-2xl">
          {t("articlesDesc")}
        </p>
      </div>

      {loading && (
         <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-48 rounded-2xl bg-slate-200"></div>
            ))}
         </div>
      )}
      
      {error && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">{error}</p>}

      {!loading && !error && (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {articles.length === 0 ? (
            <div className="col-span-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center text-slate-500">
              <p className="font-medium">{t("noArticles")}</p>
            </div>
          ) : (
            articles.map((article) => {
              const getImageSrc = (url) => {
                if (!url) return null;
                if (url.startsWith('http')) return url;
                return `http://localhost:5000${url}`;
              };
              return (
              <article
                key={article.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-green-300 cursor-pointer overflow-hidden relative"
              >
                <div>
                  {article.coverImage && (
                    <div className="mb-4 -mx-6 -mt-6 h-48 bg-slate-100">
                      <img src={getImageSrc(article.coverImage)} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="mb-3 inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700 uppercase tracking-wide">
                    {article.category || "Boshqa"}
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 group-hover:text-green-700 transition-colors leading-snug">
                    {article.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-sm text-slate-600 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs font-medium text-slate-400">
                    {article.createdAt
                      ? new Date(article.createdAt).toLocaleDateString("ru-RU", { day: 'numeric', month: 'short', year: 'numeric'})
                      : "Sana mavjud emas"}
                  </span>
                  <span className="text-xs font-semibold text-green-600 group-hover:underline">
                    Batafsil &rarr;
                  </span>
                </div>
              </article>
              );
            })
          )}
        </div>
      )}
    </section>
  );
}

export default Articles;
