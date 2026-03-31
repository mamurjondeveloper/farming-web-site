import { useEffect, useState, useMemo } from "react";
import api from "../api/axios";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Maxsus tooltip (grafik qanchalik chiroyli korinishi uchun)
// eslint-disable-next-line react/prop-types
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl shadow-green-900/10 border border-green-100">
        <p className="text-sm font-bold text-slate-500 mb-2">{label}</p>
        {/* eslint-disable-next-line react/prop-types */}
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
             <p className="text-lg font-extrabold" style={{ color: entry.color }}>
               {entry.payload.price.toLocaleString()} <span className="text-xs font-semibold">{entry.payload.currency}</span>
             </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Modal oynasi kompyonenti
// eslint-disable-next-line react/prop-types
function TickerChartModal({ isOpen, onClose, tickerItem }) {
  const chartData = useMemo(() => {
     // eslint-disable-next-line react/prop-types
     if (!tickerItem || !tickerItem.history) return [];
     
     // History backend dan DESC bilan kelayotgan boldi, bizga xronologiya uchun ASC kerak
     // eslint-disable-next-line react/prop-types
     const reversed = [...tickerItem.history].reverse();
     
     return reversed.map(h => {
        const date = new Date(h.createdAt);
        return {
           name: date.toLocaleDateString("uz-UZ", { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit', second: '2-digit' }),
           price: h.price,
           currency: h.currency
        };
     });
  }, [tickerItem]);

  if (!isOpen || !tickerItem) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-4xl bg-white rounded-3xl p-6 sm:p-10 shadow-2xl animate-in zoom-in-95 duration-300 border border-white flex flex-col items-center">
         <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
         </button>
         
         <div className="mb-8 w-full">
            <h2 className="text-3xl font-extrabold text-slate-800">
               {/* eslint-disable-next-line react/prop-types */}
               <span className="text-emerald-600">{tickerItem.productName}</span> — Narx o'zgarishlari trendi
            </h2>
            <p className="text-slate-500 font-medium mt-1">Vaqt kesimida joriy mahsulotning haqiqiy bitta chiziqli birja grafigi (Trading Area Chart)</p>
         </div>
         
         {chartData.length < 2 ? (
            <div className="h-[400px] w-full flex items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
               <div className="text-center px-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-amber-500">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold text-slate-600">Grafik chizish uchun ma'lumot yetarli emas.</p>
                  <p className="text-slate-400 mt-1 mb-2">Eng kamida 2 xil vaqtda narx kiritilgan bo'lishi lozim (Nuqtalar kesishishi uchun).</p>
               </div>
            </div>
         ) : (
            <div className="w-full h-[400px] -ml-4 mt-4">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                     <defs>
                       <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                         <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => val.toLocaleString()} dx={-10} />
                     <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                     <Area type="linear" dataKey="price" stroke="#10b981" strokeWidth={5} fillOpacity={1} fill="url(#colorPrice)" name="Narx o'sishi" activeDot={{ r: 8, strokeWidth: 0, fill: '#10b981' }} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         )}
      </div>
    </div>
  );
}


function TopTicker() {
  const [tickerPrices, setTickerPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal 
  const [selectedTickerItem, setSelectedTickerItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchTicker() {
      try {
        const response = await api.get("/api/ticker");
        if (response.data && response.data.success) {
          setTickerPrices(response.data.data);
        }
      } catch (error) {
        console.error("Ticker fetch error", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTicker();
  }, []);

  const openChart = (item) => {
     setSelectedTickerItem(item);
     setIsModalOpen(true);
  };

  // Agar ma'lumotlar juda kam bo'lsa (masalan 1-2 ta), bir nechta nusxa yaratamizki 
  // doimiy oqim (stream) ko'rinishida to'xtovsiz o'tib tursin.
  const repeatedTicker = useMemo(() => {
    if (tickerPrices.length === 0) return [];
    // Kamida 8-10 ta element bo'lishini ta'minlaymiz (yoki originalni 4 marta ko'paytiramiz)
    const repeatCount = tickerPrices.length < 5 ? 4 : 2;
    let list = [];
    for(let i = 0; i < repeatCount; i++) {
      list = [...list, ...tickerPrices];
    }
    return list;
  }, [tickerPrices]);

  // Dinamik vaqt (duration) - oqishga qulay bolishi uchun ancha sekinlashtiramiz
  const animationDuration = useMemo(() => {
    return Math.max(35, repeatedTicker.length * 15) + "s";
  }, [repeatedTicker]);

  if (loading) {
    return (
      <div className="bg-slate-900 border-b border-green-500/30 overflow-hidden py-2 relative flex justify-center items-center h-10">
        <div className="w-4 h-4 rounded-full border-2 border-green-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (tickerPrices.length === 0) {
     return (
        <div className="bg-[#111827] border-b border-green-500/20 py-2 relative h-10 flex items-center justify-center text-xs text-slate-500">
           Hozircha o'rtacha narx ma'lumotlari kiritilmagan
        </div>
     );
  }

  return (
    <>
      <div className="bg-gradient-to-r from-slate-900 to-[#1e293b] border-b border-emerald-500/30 overflow-hidden relative group h-8 flex items-center">
        <div 
          className="flex animate-marquee whitespace-nowrap py-1 items-center select-none"
          style={{ animationDuration: animationDuration }}
        >
          {repeatedTicker.map((item, index) => (
            <div 
               key={item.id + "-" + index} 
               onClick={() => openChart(item)}
               className="inline-flex mx-10 items-center cursor-pointer hover:bg-white/10 px-4 py-0.5 rounded-xl transition-all hover:scale-105 active:scale-95"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span>
                <span className="font-bold text-slate-100 tracking-wide uppercase text-[11px]">{item.productName}</span>
              </div>
              <span className="mx-3 text-emerald-500/30 font-bold">|</span>
              
              {item.price ? (
                 <span className="font-black text-emerald-400 text-sm">
                   {item.price.toLocaleString()}{" "}
                   <span className="text-[9px] text-slate-400 font-bold align-top">{item.currency || "UZS"}</span>
                 </span>
              ) : (
                 <span className="font-medium text-slate-500 italic text-[11px]">-- Kutilmoqda --</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <TickerChartModal 
         isOpen={isModalOpen} 
         onClose={() => setIsModalOpen(false)} 
         tickerItem={selectedTickerItem} 
      />
    </>
  );
}

export default TopTicker;
