import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Parol kuchi
  const [strengthScore, setStrengthScore] = useState(0);
  const [strengthText, setStrengthText] = useState("");
  const [strengthColor, setStrengthColor] = useState("bg-slate-200");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
     let score = 0;
     let feedback = [];
     
     if (password.length > 0) {
        if (password.length >= 8) score += 1;
        else feedback.push("Kamida 8 ta belgi kiriting.");
        
        if (/[A-Z]/.test(password)) score += 1;
        else feedback.push("Bitta katta harf (A-Z) qo'shing.");
        
        if (/[0-9]/.test(password)) score += 1;
        else feedback.push("Bitta raqam (0-9) kiriting.");
        
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        else feedback.push("Maxsus belgi (!, @, #, $, %, etc) qo'shing.");
     }

     setStrengthScore(score);
     setSuggestions(feedback);

     if (score === 0) { setStrengthText(""); setStrengthColor("bg-slate-200"); }
     else if (score === 1) { setStrengthText("Juda zaif"); setStrengthColor("bg-red-500"); }
     else if (score === 2) { setStrengthText("O'rtacha"); setStrengthColor("bg-orange-500"); }
     else if (score === 3) { setStrengthText("Yaxshi"); setStrengthColor("bg-blue-500"); }
     else if (score === 4) { setStrengthText("Kuchli"); setStrengthColor("bg-green-500"); }
  }, [password]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (strengthScore < 3) {
       setError("Parol juda kuchsiz! Uni kuchaytiring.");
       return;
    }
    
    try {
      setLoading(true);
      setError("");
      
      const res = await api.post("/api/auth/register-public", { 
         username, email, password 
      });
      
      if (res.data.success && res.data.token) {
        login(res.data.admin, res.data.token);
        navigate("/profile");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Ro'yxatdan o'tishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] animate-in fade-in duration-500">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-green-900/5 p-8 border border-slate-100">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-slate-800">Ro'yxatdan o'tish</h1>
          <p className="text-sm text-slate-500 mt-2">Fermer Info tizimidan to'liq foydalanish uchun akkaunt yarating.</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-100 text-sm font-medium text-red-600 flex items-start gap-3">
             <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
             </svg>
             <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Foydalanuvchi nomi (Login)</label>
            <input
              type="text" required value={username} onChange={e => setUsername(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 bg-slate-50 focus:bg-white transition-all"
              placeholder="Masalan: ali_fermer"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pochta (Email)</label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 bg-slate-50 focus:bg-white transition-all"
              placeholder="Sizning elektron pochtangiz"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Yangi parol</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 bg-slate-50 focus:bg-white transition-all pr-12"
                placeholder="Kamida 8 xarfdan iborat kuchli parol"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center justify-center p-2 text-slate-400 hover:text-green-600 transition-colors">
                {showPassword ? "Yashirish" : "Ko'rsatish"}
              </button>
            </div>
            
            {/* Parol kuchi indikatori moduli */}
            {password.length > 0 && (
               <div className="mt-3 bg-slate-50 rounded-lg p-3 border border-slate-100 text-xs">
                 <div className="flex justify-between items-center mb-1.5">
                    <span className="font-semibold text-slate-600">Xavfsizlik darajasi:</span>
                    <span className={`font-bold ${strengthScore < 3 ? 'text-red-500' : 'text-green-600'}`}>{strengthText}</span>
                 </div>
                 <div className="flex gap-1 h-1.5 w-full">
                    {[1,2,3,4].map(num => (
                       <div key={num} className={`h-full flex-1 rounded-full ${strengthScore >= num ? strengthColor : 'bg-slate-200 transition-colors duration-300'}`}></div>
                    ))}
                 </div>
                 {suggestions.length > 0 && (
                    <ul className="mt-2 text-slate-500 space-y-1">
                       {suggestions.map((sug, i) => (
                         <li key={i} className="flex gap-1.5 items-start">
                           <span className="text-orange-400 mt-0.5">•</span> <span>{sug}</span>
                         </li>
                       ))}
                    </ul>
                 )}
               </div>
            )}
          </div>

          <button type="submit" disabled={loading}
            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold shadow-lg shadow-green-600/20 hover:shadow-green-600/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2">
            {loading ? "Jarayonda..." : "Ro'yxatdan o'tish"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Allaqachon hisobingiz bormi? <Link to="/login" className="font-bold text-green-600 hover:text-green-700 hover:underline">Kirish</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
