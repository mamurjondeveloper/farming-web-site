import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  CheckCircle, AlertTriangle, Info, Trash2, 
  Search, Filter, Plus
} from "lucide-react";

// Mock Data
const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: "Tizim yangilanishi muvaffaqiyatli yakunlandi",
    message: "Barcha bazalar optimizatsiya qilindi va 2.4 versiyaga o'tildi.",
    type: "success",
    date: "Bugun, 10:45",
    isRead: false,
  },
  {
    id: 2,
    title: "Yangi foydalanuvchi ro'yxatdan o'tdi",
    message: "Aliyeva Nargiza 'Fermer' maqomida tasdiqlashni kutmoqda.",
    type: "info",
    date: "Kech, 16:30",
    isRead: true,
  },
  {
    id: 3,
    title: "Server xatoligi!",
    message: "API dan ma'lumot olishda vaqtinchalik uzilish yuz berdi.",
    type: "warning",
    date: "12 Mart, 09:15",
    isRead: false,
  },
  {
    id: 4,
    title: "Oylik hisobot tayyor",
    message: "Platformaning fevral oyi uchun to'liq moliya hisoboti tayyorlandi.",
    type: "info",
    date: "11 Mart, 14:00",
    isRead: true,
  }
];

const ICONS = {
  success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

const BG_COLORS = {
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  info: "bg-blue-50 text-blue-700",
};

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); 
  const [showAddForm, setShowAddForm] = useState(false);

  // New message form states
  const [newTitle, setNewTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [newType, setNewType] = useState("info");

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleDelete = (id) => {
    if (!window.confirm("Rostdan ham xabarni o'chirib tashlamoqchimisiz?")) return;
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newNotif = {
      id: Date.now(),
      title: newTitle,
      message: newMessage,
      type: newType,
      date: "Hozir",
      isRead: false
    };
    setNotifications([newNotif, ...notifications]);
    
    // reset form
    setNewTitle("");
    setNewMessage("");
    setNewType("info");
    setShowAddForm(false);
  };

  const filteredNotifications = notifications.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          n.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filterType === "all" ? true :
      filterType === "unread" ? !n.isRead : n.isRead;
    
    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            Bildirishnomalar
            {unreadCount > 0 && (
              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {unreadCount} yangi
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Tizimdagi barcha voqealar va xabarlar ro'yxati.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
           <Link to="/admin/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-100 px-3 py-2 rounded-lg transition-colors">Menyuga qaytish</Link>
           {!showAddForm && (
              <button onClick={() => setShowAddForm(true)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4"/> Yangi xabar
              </button>
           )}
        </div>
      </div>

      {/* Add New Notification Form */}
      {showAddForm && (
        <div className="mb-8 rounded-2xl border border-indigo-200 bg-indigo-50 p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-indigo-800">Yangi Xabar Yaratish</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-1">Sarlavha *</label>
               <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Masalan: Sayt vaqtincha ishlamaydi" className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500 bg-white" />
            </div>
            
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-1">Xabar matni *</label>
               <textarea required value={newMessage} onChange={(e) => setNewMessage(e.target.value)} rows="3" placeholder="Batafsil ma'lumot kiriting..." className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500 bg-white" />
            </div>

            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-1">Xabar turi</label>
               <select value={newType} onChange={(e) => setNewType(e.target.value)} className="rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-500 bg-white w-full md:w-1/3">
                 <option value="info">Oddiy (Info)</option>
                 <option value="warning">Muhim (Warning)</option>
                 <option value="success">Yutuq (Success)</option>
               </select>
            </div>

            <div className="flex items-center gap-3 pt-2">
               <button type="submit" className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700">
                 Jo'natish
               </button>
               <button type="button" onClick={() => setShowAddForm(false)} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                 Bekor qilish
               </button>
            </div>
          </form>
        </div>
      )}

      {/* Toolbar */}
      {!showAddForm && (
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="relative w-full sm:w-1/2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Sarlavha yoki matn bo'yicha qidiruv..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border-none outline-none bg-transparent text-slate-700"
            />
          </div>
          <div className="w-full sm:w-auto flex items-center gap-2 sm:border-l sm:border-slate-200 sm:pl-4">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full sm:w-auto bg-transparent border-none outline-none text-sm font-medium text-slate-600 cursor-pointer p-1"
            >
              <option value="all">Barchasi</option>
              <option value="unread">O'qilmaganlar</option>
              <option value="read">O'qilganlar</option>
            </select>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="grid gap-3">
        {filteredNotifications.length === 0 ? (
           <p className="text-center py-10 text-slate-500">Bu toifadagi xabarlar topilmadi.</p>
        ) : (
          filteredNotifications.map((notification) => (
            <div key={notification.id} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border ${notification.isRead ? 'bg-white border-slate-200' : 'bg-indigo-50/30 border-indigo-200 shadow-sm'} transition-colors`}>
               <div className="flex items-start gap-3 mb-3 sm:mb-0 w-full sm:w-auto">
                  <div className={`p-2 rounded-lg flex-shrink-0 mt-1 ${notification.isRead ? 'bg-slate-100 opacity-60' : BG_COLORS[notification.type]}`}>
                    {ICONS[notification.type]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                       <h3 className={`font-semibold text-sm sm:text-base ${notification.isRead ? 'text-slate-600' : 'text-slate-800'}`}>
                         {notification.title}
                       </h3>
                       {!notification.isRead && (
                         <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block shrink-0"></span>
                       )}
                    </div>
                    <p className={`text-sm mb-1 ${notification.isRead ? 'text-slate-400' : 'text-slate-500'}`}>
                      {notification.message}
                    </p>
                    <div className="text-xs text-slate-400 font-medium">{notification.date}</div>
                  </div>
               </div>
               <div className="flex items-center gap-2 sm:ml-4 self-start sm:self-center mt-2 sm:mt-0">
                  {!notification.isRead && (
                    <button 
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-md text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> O'qilgan qilish
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(notification.id)}
                    className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-md text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                     <Trash2 className="w-3.5 h-3.5" /> O'chirish
                  </button>
               </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
