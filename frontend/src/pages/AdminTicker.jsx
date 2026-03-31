import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function AdminTicker() {
  const navigate = useNavigate();
  const [tickers, setTickers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Add Product Modal
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCurrency, setNewCurrency] = useState("UZS");

  // History/Table Modal
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedTicker, setSelectedTicker] = useState(null);
  
  // Add new history price
  const [histPrice, setHistPrice] = useState("");
  const [histCurrency, setHistCurrency] = useState("UZS");

  useEffect(() => {
    fetchTickers();
  }, []);

  const fetchTickers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return navigate("/login");

      setLoading(true);
      const res = await api.get("/api/ticker", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickers(res.data.data || []);
      
      // Update selectedTicker reference if History modal is open to reflect live changes
      if (selectedTicker) {
         const updatedTicker = res.data.data?.find(t => t.id === selectedTicker.id);
         if (updatedTicker) setSelectedTicker(updatedTicker);
      }
      setError("");
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/login");
      } else {
        setError("Ma'lumotlarni yuklashda xatolik");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      await api.post("/api/ticker", {
        productName: newProductName,
        price: Number(newPrice),
        currency: newCurrency
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      setIsAddProductModalOpen(false);
      setNewProductName(""); setNewPrice("");
      fetchTickers();
    } catch (err) {
      alert("Xatolik: " + (err.response?.data?.message || err.message));
    }
  };

  const handleToggleVisibility = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await api.put(`/api/ticker/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTickers();
    } catch (err) {
      alert("Xatolik: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Rostdan ham bu mahsulotni barcha narx tarixi bilan birga o'chirasizmi?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await api.delete(`/api/ticker/${id}`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      fetchTickers();
    } catch (err) {
      alert("Xatolik: " + (err.response?.data?.message || err.message));
    }
  };

  const openHistoryModal = (ticker) => {
    setSelectedTicker(ticker);
    setHistPrice(String(ticker.price || ""));
    setHistCurrency(ticker.currency || "UZS");
    setIsHistoryModalOpen(true);
  };

  const handleAddHistoryPrice = async (e) => {
    e.preventDefault();
    if (!selectedTicker) return;
    try {
      const token = localStorage.getItem("adminToken");
      await api.post(`/api/ticker/${selectedTicker.id}/history`, {
        price: Number(histPrice),
        currency: histCurrency
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      setHistPrice("");
      fetchTickers();
    } catch (err) {
      alert("Xatolik: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteHistoryRow = async (historyId) => {
    if (!window.confirm("Aynan shu kunning tarixiy narxi o'chirilsinmi?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await api.delete(`/api/ticker/history/${historyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTickers();
    } catch (err) {
      alert("Xatolik: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-500 font-semibold animate-pulse">Yuklanmoqda...</div>;

  return (
    <div className="max-w-6xl mx-auto py-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
        <div>
           <h1 className="text-3xl font-extrabold text-slate-800">Ticker Bozor(Birja)</h1>
           <p className="text-slate-500 mt-2 text-sm font-medium">Bosh sahifadagi yuguruvchi qator va grafik tarixini boshqarish</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
           <button onClick={() => navigate("/admin/dashboard")} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition">
             Orqaga qaytish
           </button>
           <button onClick={() => setIsAddProductModalOpen(true)} className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-500/30 transition-all active:scale-[0.98]">
             + Yangi mahsulot qo'shish
           </button>
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium">{error}</div>
      ) : tickers.length === 0 ? (
        <div className="text-center py-20 px-4 bg-white rounded-3xl border border-slate-200 shadow-sm">
           <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           </div>
           <p className="text-lg font-bold text-slate-700">Hozircha ob'ektlar yo'q</p>
           <p className="text-slate-500 mt-1 max-w-sm mx-auto">Tepadagi tugmani bosing va mahsulot nomi va yagona boshlang'ich narx yozib birinchi Ticker'ni yarating.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
           {tickers.map(ticker => (
             <div key={ticker.id} className={`bg-white rounded-3xl p-6 border transition-all duration-300 relative group overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 ${ticker.isVisible ? 'border-orange-100 hover:border-orange-300' : 'border-slate-200 opacity-60'}`}>
                
                {/* Ko'zcha (Toggle) Button */}
                <button onClick={() => handleToggleVisibility(ticker.id)} 
                        title={ticker.isVisible ? "Hozir ko'rinib turibdi. Yashirish uchun bosing" : "Hozir yashirin. Ko'rsatish uchun bosing"}
                        className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors border shadow-sm ${ticker.isVisible ? 'bg-orange-50 hover:bg-orange-100 text-orange-600 border-orange-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-500 border-slate-200'}`}>
                   {ticker.isVisible ? (
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                     </svg>
                   ) : (
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                     </svg>
                   )}
                </button>

                <h3 className="text-xl font-extrabold text-slate-800 pr-12">{ticker.productName}</h3>
                <div className="mt-4 mb-6 relative z-10">
                   <p className="text-sm text-slate-500 font-medium mb-1">Eng oxirgi narx:</p>
                   {ticker.price ? (
                      <p className="text-3xl font-bold text-orange-600">
                         {ticker.price?.toLocaleString?.() ?? ticker.price} <span className="text-sm font-semibold">{ticker.currency}</span>
                      </p>
                   ) : (
                      <p className="text-sm font-bold text-slate-400">Narx kiritilmagan</p>
                   )}
                   <p className="text-xs text-slate-400 mt-2 flex items-center gap-1 font-semibold">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      Jadvaldagi yozuvlar: {ticker.history?.length || 0} marta
                   </p>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                   <button onClick={() => openHistoryModal(ticker)} className="flex-1 py-2.5 rounded-xl bg-orange-50 text-orange-700 font-bold hover:bg-orange-100 transition shadow-sm border border-orange-100 flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Tarix Jadvali
                   </button>
                   <button onClick={() => handleDeleteItem(ticker.id)} className="w-12 h-11 flex items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                   </button>
                </div>
             </div>
           ))}
        </div>
      )}

      {/* MODAL: Yangi mahsulot g'oyasi qo'shish */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAddProductModalOpen(false)}></div>
           <div className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-white animate-in zoom-in-95 duration-200">
              <h2 className="text-2xl font-extrabold text-slate-800 mb-6">Ticker a'zosi yaratish</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                 <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mahsulot nomi (Masalan: Paxta)</label>
                    <input type="text" required value={newProductName} onChange={e => setNewProductName(e.target.value)}
                       className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-50" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-sm font-semibold text-slate-700 mb-1.5">Dastlabki Narx</label>
                       <input type="number" required value={newPrice} onChange={e => setNewPrice(e.target.value)} 
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-50" />
                    </div>
                    <div>
                       <label className="block text-sm font-semibold text-slate-700 mb-1.5">Valyuta</label>
                       <input type="text" required value={newCurrency} onChange={e => setNewCurrency(e.target.value)} 
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-50" />
                    </div>
                 </div>
                 <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setIsAddProductModalOpen(false)} className="flex-1 py-3 rounded-xl border border-slate-300 font-bold text-slate-600 hover:bg-slate-50">Bekor qilish</button>
                    <button type="submit" className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 shadow-lg shadow-orange-500/30">Saqlash</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* MODAL: Tarix Jadvali va Narx qo'shish */}
      {isHistoryModalOpen && selectedTicker && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setIsHistoryModalOpen(false); setSelectedTicker(null); }}></div>
           <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
              
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between z-10">
                 <div>
                   <h2 className="text-xl font-extrabold text-slate-800"><span className="text-emerald-600">{selectedTicker.productName}</span> — Narxlar Jadvali tarixi</h2>
                   <p className="text-sm text-slate-500 font-medium">Barcha kiritilgan narxlar xronologiyasi tepadagi grafikda chiziladi.</p>
                 </div>
                 <button onClick={() => { setIsHistoryModalOpen(false); setSelectedTicker(null); }} className="w-10 h-10 bg-white hover:bg-slate-100 text-slate-500 rounded-full flex items-center justify-center border border-slate-200">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>

              {/* Table Body (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-6 bg-white min-h-[250px] max-h-[400px]">
                 {selectedTicker.history && selectedTicker.history.length > 0 ? (
                    <table className="w-full text-left text-sm text-slate-600">
                       <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] sticky top-0 z-10 border-b border-slate-100">
                          <tr>
                             <th className="py-3 px-4 rounded-tl-lg">Sana va Vaqt</th>
                             <th className="py-3 px-4">Kiritilgan Narx</th>
                             <th className="py-3 px-4">Kiritdi</th>
                             <th className="py-3 px-4 text-center rounded-tr-lg">Amal</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          {selectedTicker.history.map((histRow) => {
                             const dateLabel = new Date(histRow.createdAt).toLocaleString("uz-UZ", { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' });
                             return (
                                <tr key={histRow.id} className="hover:bg-slate-50/70 transition-colors">
                                   <td className="py-3 px-4 font-medium text-slate-700">{dateLabel}</td>
                                   <td className="py-3 px-4">
                                      <span className="font-extrabold text-orange-600">{histRow.price?.toLocaleString()} </span>
                                      <span className="text-[10px] font-bold text-slate-400">{histRow.currency}</span>
                                   </td>
                                   <td className="py-3 px-4 text-slate-400 font-medium text-xs">{histRow.createdBy || '-'}</td>
                                   <td className="py-3 px-4 flex justify-center">
                                      <button onClick={() => handleDeleteHistoryRow(histRow.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition" title="Bu narxni o'chirish">
                                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                      </button>
                                   </td>
                                </tr>
                             )
                          })}
                       </tbody>
                    </table>
                 ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                       <p className="font-medium">Hali narx tarixi kiritilmagan.</p>
                    </div>
                 )}
              </div>

              {/* Add New History Form Action */}
              <div className="p-6 border-t border-slate-100 bg-slate-50">
                 <form onSubmit={handleAddHistoryPrice} className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 flex gap-3">
                       <div className="flex-1 relative">
                          <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] uppercase font-bold text-emerald-600 rounded">Yangi narx yozish</label>
                          <input type="number" required value={histPrice} onChange={e => setHistPrice(e.target.value)} placeholder="0.00"
                              className="w-full rounded-xl border border-emerald-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 bg-white" />
                       </div>
                       <div className="w-24 relative">
                          <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] uppercase font-bold text-emerald-600 rounded">Valyuta</label>
                          <input type="text" required value={histCurrency} onChange={e => setHistCurrency(e.target.value)} 
                              className="w-full rounded-xl border border-emerald-200 px-3 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 bg-white text-center" />
                       </div>
                    </div>
                    <button type="submit" className="py-3 px-6 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md shadow-emerald-500/20 whitespace-nowrap">
                       + Kiritish
                    </button>
                 </form>
              </div>

           </div>
        </div>
      )}

    </div>
  );
}

export default AdminTicker;
