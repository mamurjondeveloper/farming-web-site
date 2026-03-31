import { useEffect, useState } from "react";
import api from "../api/axios";
import { useLanguage } from "../context/LanguageContext";

function Prices() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t } = useLanguage();

  const [searchRegion, setSearchRegion] = useState("");
  const [searchProduct, setSearchProduct] = useState("");

  useEffect(() => {
    async function fetchPrices() {
      try {
        setLoading(true);
        setError("");
        const response = await api.get("/api/prices");
        setPrices(response?.data?.data || []);
      } catch (_err) {
        setError("Narxlarni yuklashda xatolik yuz berdi.");
      } finally {
        setLoading(false);
      }
    }

    fetchPrices();
  }, []);

  const filteredPrices = prices.filter((p) => {
    const rMatch =
      !searchRegion || p.region?.toLowerCase().includes(searchRegion.toLowerCase());
    const pMatch =
      !searchProduct || p.productName?.toLowerCase().includes(searchProduct.toLowerCase());
    return rMatch && pMatch;
  });

  return (
    <section className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 md:text-4xl tracking-tight">
           {t("pricesTitle")}
        </h1>
        <p className="mt-3 text-base text-slate-500 max-w-2xl">
           {t("pricesDesc")}
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <input
          type="text"
          placeholder={t("searchRegion")}
          className="w-full rounded-xl border border-slate-300 py-3 pl-4 pr-3 text-sm outline-none transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-100 sm:w-1/3"
          value={searchRegion}
          onChange={(e) => setSearchRegion(e.target.value)}
        />
        <input
          type="text"
          placeholder={t("searchProduct")}
          className="w-full rounded-xl border border-slate-300 py-3 pl-4 pr-3 text-sm outline-none transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-100 sm:w-2/3"
          value={searchProduct}
          onChange={(e) => setSearchProduct(e.target.value)}
        />
      </div>

      {loading && (
        <div className="w-full animate-pulse shadow-sm rounded-2xl border border-slate-200 overflow-hidden">
           <div className="h-12 bg-slate-100 border-b border-slate-200"></div>
           {[1,2,3,4,5].map(n => <div key={n} className="h-16 bg-white border-b border-slate-100"></div>)}
        </div>
      )}
      
      {error && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">{error}</p>}

      {!loading && !error && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold tracking-wider">{t("region")}</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">{t("product")}</th>
                  <th className="px-6 py-4 font-semibold tracking-wider text-right">{t("price")}</th>
                  <th className="px-6 py-4 font-semibold tracking-wider text-right hidden md:table-cell">{t("date")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPrices.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500 font-medium bg-slate-50/50">
                      Topilmadi...
                    </td>
                  </tr>
                ) : (
                  filteredPrices.map((item) => (
                    <tr key={item.id} className="hover:bg-green-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-700">{item.region}</span>
                        {item.district && (
                          <span className="ml-1 text-xs text-slate-400">({item.district})</span>
                        )}
                        <div className="text-xs text-slate-400 mt-0.5">{item.marketName}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {item.productName}{" "}
                        <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500 font-bold uppercase">
                          per {item.unit}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-green-700 text-base">
                          {item.priceMin?.toLocaleString?.()} - {item.priceMax?.toLocaleString?.()}
                        </span>
                        <span className="ml-1 text-xs font-medium text-green-600/70 uppercase">
                          {item.currency}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right hidden md:table-cell text-slate-400">
                        {item.priceDate
                          ? new Date(item.priceDate).toLocaleDateString("ru-RU", { day: 'numeric', month: 'short', year: 'numeric'})
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

export default Prices;
