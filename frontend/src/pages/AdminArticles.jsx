import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form holatlari
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Yozuv maydonlari
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/articles");
      setArticles(res.data?.data || []);
    } catch (err) {
      console.error(err);
      alert("Maqolalarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const resetForm = () => {
    setTitle("");
    setSummary("");
    setContent("");
    setCategory("");
    setCoverImage("");
    setEditId(null);
    setShowAddForm(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append("image", file);
    
    try {
       setUploadingImage(true);
       const token = localStorage.getItem("adminToken");
       const res = await api.post("/api/upload", formData, {
          headers: { 
             "Content-Type": "multipart/form-data", 
             Authorization: `Bearer ${token}` 
          }
       });
       if (res.data.success) {
          // Baza uchun DB ga kelgan URLni saqlaymiz (masalan: /uploads/image-123.jpg)
          // Bunda frontend /api prefixisiz uni server.js root ga statik murojaat orqali oladi
          setCoverImage(res.data.url);
       }
    } catch (err) {
       alert("Rasmni yuklashda xatolik: " + (err.response?.data?.message || err.message));
    } finally {
       setUploadingImage(false);
    }
  };

  const handleEditClick = (item) => {
    setEditId(item.id);
    setTitle(item.title || "");
    setSummary(item.summary || "");
    setContent(item.content || "");
    setCategory(item.category || "");
    setCoverImage(item.coverImage || "");
    setShowAddForm(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Rostdan ham maqolani o'chirib tashlamoqchimisiz?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await api.delete(`/api/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchArticles();
    } catch (err) {
      alert("O'chirishda xatolik: " + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { title, summary, content, category, coverImage };
      const token = localStorage.getItem("adminToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (editId) {
        await api.put(`/api/articles/${editId}`, payload, config);
      } else {
        await api.post("/api/articles", payload, config);
      }
      
      resetForm();
      fetchArticles();
    } catch (err) {
      alert("Saqlashda xatolik: " + (err.response?.data?.message || err.message));
    }
  };

  // Funksiya rasmni ko'rsatish uchun: agar u backenddan relative bo'lsa (masalan /uploads/...), local backend domain qo'shiladi. 
  // API proxysi ishlasa, frontend da API portisiz ham ishlashi mumkin, lekn bazan static filelar public bo'lsa to'g'ridan-to'g'ri chaqiriladi
  const getImageSrc = (url) => {
     if (!url) return null;
     if (url.startsWith('http')) return url;
     // Agar react 5173 da ishlasa va proxy bo'lsa, proxy fqat /api uchun ishlaydi!
     // Shu sababli /uploads uchun ham bizga to'g'ri adres kerak. 
     // Demak port 5000 ni qo'shamiz (yoki vite.config dan /uploads proxy qilishimiz kerak bo'ladi, bu yerda to'g'ridan to'gri port kiritamiz):
     return `http://localhost:5000${url}`;
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 animate-in fade-in duration-500">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Maqolalarni Boshqarish</h1>
          <p className="text-sm text-slate-500 mt-1">Platformadagi barcha maqolalarni o'zgartirish yoki yangi qo'shish.</p>
        </div>
        <div className="flex items-center gap-3">
           <Link to="/admin/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-100 px-3 py-2 rounded-lg">Menyuga qaytish</Link>
           {!showAddForm && (
              <button onClick={() => setShowAddForm(true)} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-700">
                + Yangi Maqola
              </button>
           )}
        </div>
      </div>

      {showAddForm && (
        <div className="mb-8 rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-green-800">{editId ? "Maqolani Tahrirlash" : "Yangi Maqola Yaratish"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
               <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1">Sarlavha (Title) *</label>
                 <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-green-500 bg-white" />
               </div>
               <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1">Kategoriya *</label>
                 <input type="text" required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-green-500 bg-white" />
               </div>
            </div>
            
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-1">Qisqacha mazmuni (Summary) *</label>
               <textarea required value={summary} onChange={(e) => setSummary(e.target.value)} rows="2" className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-green-500 bg-white" />
            </div>

            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-1">To'liq matn (Content) *</label>
               <textarea required value={content} onChange={(e) => setContent(e.target.value)} rows="6" className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-green-500 bg-white" />
            </div>

            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-1">Maqola rasmi (Cover Image)</label>
               <div className="flex items-center gap-4">
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="w-full rounded-lg border border-slate-300 p-2 outline-none focus:border-green-500 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                  {uploadingImage && <span className="text-sm text-green-600 whitespace-nowrap">Yuklanmoqda...</span>}
               </div>
               {coverImage && (
                  <div className="mt-4 relative inline-block">
                     <img src={getImageSrc(coverImage)} alt="preview" className="h-32 w-auto object-cover rounded-lg shadow-sm border border-slate-200" />
                     <button type="button" onClick={() => setCoverImage("")} className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center font-bold shadow hover:bg-red-200">&times;</button>
                  </div>
               )}
            </div>

            <div className="flex items-center gap-3 pt-2">
               <button type="submit" disabled={uploadingImage} className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-green-700 disabled:opacity-50">
                 {editId ? "O'zgarishlarni Saqlash" : "Chop etish"}
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
        <div className="grid gap-4">
          {articles.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
               <div className="flex gap-4 mb-4 md:mb-0">
                  {item.coverImage ? (
                    <img src={getImageSrc(item.coverImage)} alt="" className="w-24 h-24 object-cover rounded-lg border border-slate-100 flex-shrink-0" />
                  ) : (
                    <div className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs flex-shrink-0">Rasmsiz</div>
                  )}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-1 rounded">{item.category}</span>
                    <h3 className="font-bold text-slate-800 mt-1">{item.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mt-1">{item.summary}</p>
                    <div className="text-xs text-slate-400 mt-2">
                       By {item.createdBy} • Views: {item.viewsCount}
                    </div>
                  </div>
               </div>
               <div className="flex items-center gap-2 md:ml-4">
                  <button onClick={() => handleEditClick(item)} className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-sm font-medium transition-colors">Tahrirlash</button>
                  <button onClick={() => handleDeleteClick(item.id)} className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-sm font-medium transition-colors">O'chirish</button>
               </div>
            </div>
          ))}
          {articles.length === 0 && <p className="text-center py-8 text-slate-500">Maqolalar yo'q.</p>}
        </div>
      )}
    </div>
  );
}

export default AdminArticles;
