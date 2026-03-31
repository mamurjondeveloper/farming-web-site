import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function AdminPrices() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form holatlari
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Yozuv maydonlari
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [marketName, setMarketName] = useState("");
  const [productName, setProductName] = useState("");
  const [unit, setUnit] = useState("kg");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [priceDate, setPriceDate] = useState("");

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/prices");
      setPrices(res.data?.data || []);
    } catch (err) {
      console.error(err);
      alert("Narxlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    setPriceDate(new Date().toISOString().split('T')[0]); // Default to today
  }, []);

  const resetForm = () => {
    setRegion("");
    setDistrict("");
    setMarketName("");
    setProductName("");
    setUnit("kg");
    setPriceMin("");
    setPriceMax("");
    setPriceDate(new Date().toISOString().split('T')[0]);
    setEditId(null);
    setShowAddForm(false);
  };

  const handleEditClick = (item) => {
    setEditId(item.id);
    setRegion(item.region || "");
    setDistrict(item.district || "");
    setMarketName(item.marketName || "");
    setProductName(item.productName || "");
    setUnit(item.unit || "kg");
    setPriceMin(item.priceMin || "");
    setPriceMax(item.priceMax || "");
    setPriceDate(item.priceDate ? new Date(item.priceDate).toISOString().split('T')[0] : "");
    setShowAddForm(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Rostdan ham narxni o'chirib tashlamoqchimisiz?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await api.delete(`/api/prices/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPrices();
    } catch (err) {
      alert("O'chirishda xatolik: " + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        region, district, marketName, productName, unit,
        priceMin: Number(priceMin), priceMax: Number(priceMax), priceDate 
      };
      
      const token = localStorage.getItem("adminToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (editId) {
        await api.put(`/api/prices/${editId}`, payload, config);
      } else {
        await api.post("/api/prices", payload, config);
      }
      
      resetForm();
      fetchPrices();
    } catch (err) {
      alert("Saqlashda xatolik: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 animate-in fade-in duration-500">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Narxlarni Boshqarish</h1>
          <p className="text-sm text-slate-500 mt-1">Bozorlardagi mahsulot narxlarini qo'shish va tahrirlash.</p>
        </div>
        <div className="flex items-center gap-3">
           <Link to="/admin/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-100 px-3 py-2 rounded-lg">Menyuga qaytish</Link>
           {!showAddForm && (
              <button onClick={() => setShowAddForm(true)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700">
                + Yangi Narx Qo'shish
              </button>
           )}
        </div>
      </div>

      {showAddForm && (
        <div className="mb-8 rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-blue-800">{editId ? "Narxni Tahrirlash" : "Yangi Narx Kiritish"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid gap-4 md:grid-cols-3">
               <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1">Hudud / Viloyat *</label>
                 <input type="text" required value={region} onChange={(e) => setRegion(e.target.value)} className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-blue-500 bg-white" placeholder="Masalan: Toshkent" />
               </div>
               <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1">Tuman</label>
                 <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-blue-500 bg-white" />
               </div>
               <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1">Bozor nomi</label>
                 <input type="text" value={marketName} onChange={(e) => setMarketName(e.target.value)} className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-blue-500 bg-white" />
               </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
               <div className="md:col-span-2">
                 <label className="block text-sm font-semibold text-slate-700 mb-1">Mahsulot *</label>
                 <input type="text" required value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-blue-500 bg-white" placeholder="Masalan: Pomidor" />
               </div>
               <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1">O'lchov (Unit) *</label>
                 <input type="text" required value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-blue-500 bg-white" />
               </div>
               <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1">Sana *</label>
                 <input type="date" required value={priceDate} onChange={(e) => setPriceDate(e.target.value)} className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-blue-500 bg-white" />
               </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:w-1/2">
               <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1">Min narx *</label>
                 <input type="number" required value={priceMin} onChange={(e) => setPriceMin(e.target.value)} className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-blue-500 bg-white" />
               </div>
               <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1">Max narx *</label>
                 <input type="number" required value={priceMax} onChange={(e) => setPriceMax(e.target.value)} className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-blue-500 bg-white" />
               </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
               <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700">
                 {editId ? "O'zgarishlarni Saqlash" : "Narxni Saqlash"}
               </button>
               <button type="button" onClick={resetForm} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                 Bekor qilish
               </button>
            </div>
          </form>
        </div>
      )}

      {loading && !showAddForm ? (
        <div className="text-center py-10 text-slate-500">Yuklanmoqda...</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
           <table className="min-w-full text-left text-sm text-slate-600">
             <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                <tr>
                   <th className="px-6 py-3 font-medium">Mahsulot</th>
                   <th className="px-6 py-3 font-medium">Hudud/Bozor</th>
                   <th className="px-6 py-3 font-medium text-right">Narx (Min/Max)</th>
                   <th className="px-6 py-3 font-medium text-center">Amallar</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {prices.map((item) => (
                   <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3">
                         <div className="font-bold text-slate-700">{item.productName}</div>
                         <div className="text-xs text-slate-400">({item.priceDate ? new Date(item.priceDate).toLocaleDateString("ru-RU") : ""})</div>
                      </td>
                      <td className="px-6 py-3">
                         <div className="font-medium">{item.region}</div>
                         <div className="text-xs text-slate-400">{item.marketName}</div>
                      </td>
                      <td className="px-6 py-3 text-right">
                         <span className="font-bold text-blue-700">{item.priceMin?.toLocaleString()} - {item.priceMax?.toLocaleString()} </span>
                         <span className="text-xs">UZS</span>
                      </td>
                      <td className="px-6 py-3 text-center">
                         <button onClick={() => handleEditClick(item)} className="mx-1 text-blue-600 hover:underline">Tahrirlash</button>
                         <button onClick={() => handleDeleteClick(item.id)} className="mx-1 text-red-600 hover:underline">O'chirish</button>
                      </td>
                   </tr>
                ))}
                {prices.length === 0 && (
                   <tr>
                      <td colSpan="4" className="text-center py-8 text-slate-500">Narxlar ro'yxati bo'sh</td>
                   </tr>
                )}
             </tbody>
           </table>
        </div>
      )}
    </div>
  );
}

export default AdminPrices;
