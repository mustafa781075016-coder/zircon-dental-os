import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  LayoutDashboard, Users, Calendar, LogOut, Menu, Bell, X,
  Stethoscope, Syringe, Receipt, FileText, Settings as SettingsIcon,
  ClipboardList, HeartPulse,
  Plus, Search, Mail, Lock, Loader2, ArrowRight, Save, Trash2, Edit3,
  MessageCircle, Clock, DollarSign
} from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const btn = 'w-full rounded-xl bg-gradient-to-l from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-semibold py-3 transition disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20';
const btnSm = 'rounded-xl bg-gradient-to-l from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-semibold px-4 py-2.5 text-sm transition disabled:opacity-60 flex items-center gap-2 shadow-md';
const btnGhost = 'rounded-xl bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 text-sm transition';
const inp = 'w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:bg-white/[0.07] transition';
const card = 'rounded-2xl border border-white/10 bg-white/[.03] backdrop-blur-xl p-5 shadow-xl';
const label = 'block text-xs text-slate-400 mb-1.5 font-medium';

function fmtDate(d: any) {
  if (!d) return '—';
  const date = new Date(d);
  if (isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('ar-EG-u-nu-latn', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}
function fmtDateTime(d: any) {
  if (!d) return '—';
  const date = new Date(d);
  if (isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('ar-EG-u-nu-latn', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(e: any) {
    e.preventDefault();
    setErr(''); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setErr('بيانات الدخول غير صحيحة'); return; }
    onLogin();
  }
  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center p-6 bg-[#060a1a]">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[.03] backdrop-blur-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 grid place-items-center text-2xl font-bold text-white mb-4 shadow-xl">Z</div>
          <h1 className="text-2xl font-bold text-white">Zircon OS</h1>
          <p className="text-sm text-blue-300/70 mt-2">نظام ادارة عيادة زراعة الاسنان</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className={label}>البريد الالكتروني</label>
            <div className="relative">
              <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required dir="ltr" className={inp + ' pr-10'} />
            </div>
          </div>
          <div>
            <label className={label}>كلمة المرور</label>
            <div className="relative">
              <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required dir="ltr" className={inp + ' pr-10'} />
            </div>
          </div>
          {err && <div className="rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3">{err}</div>}
          <button type="submit" disabled={loading} className={btn}>
            {loading && <Loader2 className="animate-spin" size={18} />} دخول
          </button>
        </form>
      </div>
    </div>
  );
}



// ====== NEW ARCH TOOTH CHART - PASTE THIS INSTEAD OF OLD ToothChart ======

const TEETH_UPPER = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28];
const TEETH_LOWER = [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];

const TOOTH_COLORS: any = {
  1: '#e06a6a', 2: '#b78a4a', 3: '#2ea86a', 4: '#3a8ab5', 5: '#6b4c9a', 6: '#d16a8a', 7: '#a3b82a', 8: '#7a8a2e',
};

function getShortNumber(fdi: number) { return fdi % 10; }

function ToothShape({ num, has, onClick }: { num: number, has: boolean, onClick: () => void }) {
  const shortNum = getShortNumber(num);
  const color = (TOOTH_COLORS as any)[shortNum] || '#94a3b8';
  const isMolar = shortNum >= 6;
  const isPremolar = shortNum === 4 || shortNum === 5;
  const isCanine = shortNum === 3;
  
  // شكل السن حسب النوع - مطابق للصورة
  let path = "";
  let vb = "0 0 50 60";
  if (shortNum === 1) {
    path = "M 8 12 Q 25 2 42 12 Q 40 32 25 46 Q 10 32 8 12 Z"; // مثلث قاطع مركزي
  } else if (shortNum === 2) {
    path = "M 10 14 Q 25 4 40 14 Q 38 30 25 42 Q 12 30 10 14 Z"; // قاطع جانبي
  } else if (shortNum === 3) {
    path = "M 13 10 Q 25 0 37 10 Q 40 26 25 48 Q 10 26 13 10 Z"; // ناب مدبب
  } else if (isPremolar) {
    path = "M 10 16 Q 25 6 40 16 Q 43 30 40 46 Q 25 56 10 46 Q 7 30 10 16 Z"; // ضاحك بيضاوي
  } else {
    path = "M 8 14 Q 14 8 25 10 Q 36 8 42 14 Q 46 22 44 34 Q 46 46 41 52 Q 32 56 25 54 Q 18 56 9 52 Q 4 46 6 34 Q 4 22 8 14 Z"; // رحى مموجة
  }

  return (
    <button onClick={onClick} className="absolute group" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%' }}>
      <svg viewBox={vb} className="w-full h-full overflow-visible">
        <path d={path} fill={has ? '#10b981' : 'rgba(255,255,255,0.04)'} stroke={has ? '#10b981' : 'rgba(255,255,255,0.25)'} strokeWidth="1.6" className="transition-all group-hover:fill-white/[0.08] group-hover:stroke-white/40" />
        <text x="25" y={isMolar ? "34" : "30"} textAnchor="middle" dominantBaseline="middle" fontSize={isMolar ? "20" : "22"} fontWeight="800" fill={has ? 'white' : color} className="select-none" style={{ fontFamily: 'system-ui' }}>{shortNum}</text>
        {has && <text x="25" y="44" textAnchor="middle" fontSize="7" fontWeight="700" fill="white">زرعة</text>}
      </svg>
      {/* رقم FDI صغير فوق */}
      <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[8px] font-bold text-slate-500/70 group-hover:text-slate-300">{num}</span>
    </button>
  );
}

function ToothChart({ implants, onToothClick }: { implants: any[], onToothClick: (n:number)=>void }) {
  const implanted = new Set(implants.map((i:any)=>i.tooth_number));
  
  const Arch = ({ teeth, isUpper }: { teeth: number[], isUpper: boolean }) => {
    return (
      <div className="relative w-full h-[440px] md:h-[480px] mx-auto max-w-[420px]">
        {/* قوس خلفي */}
        <div className={`absolute left-1/2 -translate-x-1/2 w-[92%] h-[92%] border border-white/10 rounded-[50%] pointer-events-none ${isUpper ? 'top-[4%] rounded-b-none border-b-0' : 'bottom-[4%] rounded-t-none border-t-0'}`} />
        {teeth.map((n, idx) => {
          const total = teeth.length;
          const startAngle = isUpper ? 180 : 0;
          const endAngle = isUpper ? 360 : 180;
          const angle = startAngle + (endAngle - startAngle) * (idx / (total - 1));
          const rad = (angle * Math.PI) / 180;
          const rx = 43;
          const ry = 54;
          const cx = 50;
          const cy = isUpper ? 80 : 20;
          const x = cx + rx * Math.cos(rad);
          const y = cy + ry * Math.sin(rad);
          const has = implanted.has(n);
          return (
            <div key={n} style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }} className="absolute w-[44px] h-[52px] md:w-[48px] md:h-[56px]">
              <ToothShape num={n} has={has} onClick={() => onToothClick(n)} />
            </div>
          );
        })}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-slate-500/30 tracking-widest pointer-events-none">{isUpper ? 'علوي' : 'سفلي'}</div>
      </div>
    );
  };

  return (
    <div className={card + ' !p-3 md:!p-5 !bg-white/[.03]'}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-white text-sm md:text-base">مخطط الأسنان - الترقيم 1-8 الملون (اضغط على السن)</h3>
        <div className="flex gap-2 text-[9px] text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>مزروع</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white/20"></span>فارغ</span>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-2">
          <div className="text-center text-[11px] text-slate-400 mb-1 font-medium">الفك العلوي</div>
          <Arch teeth={TEETH_UPPER} isUpper={true} />
        </div>
        <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-2">
          <div className="text-center text-[11px] text-slate-400 mb-1 font-medium">الفك السفلي</div>
          <Arch teeth={TEETH_LOWER} isUpper={false} />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-2 text-[10px]">
        {[
          {n:1,c:'#e06a6a',l:'قواطع مركزية'},
          {n:2,c:'#b78a4a',l:'قواطع جانبية'},
          {n:3,c:'#2ea86a',l:'أنياب'},
          {n:4,c:'#3a8ab5',l:'ضواحك أولى'},
          {n:5,c:'#6b4c9a',l:'ضواحك ثانية'},
          {n:6,c:'#d16a8a',l:'أرحاء أولى'},
          {n:7,c:'#a3b82a',l:'أرحاء ثانية'},
          {n:8,c:'#7a8a2e',l:'أرحاء ثالثة'},
        ].map(i=>(
          <span key={i.n} className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 border border-white/10"><span className="w-2 h-2 rounded-full" style={{background:i.c}}></span>{i.n}: {i.l}</span>
        ))}
      </div>
      <div className="mt-2 text-center text-[10px] text-slate-500">الأرقام الكبيرة الملونة: 1-8 (مثل صورتك) - الأرقام الصغيرة فوق: ترقيم FDI العالمي 11-48</div>
    </div>
  );
}




const JAW_IMAGE_PLACEHOLDER = "/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIbGNtcwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABzYXdzY3RybAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWhhbmSdkQA9QICwPUB0LIGepSKOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAABxjcHJ0AAABDAAAAAx3dHB0AAABGAAAABRyWFlaAAABLAAAABRnWFlaAAABQAAAABRiWFlaAAABVAAAABRyVFJDAAABaAAAAGBnVFJDAAABaAAAAGBiVFJDAAABaAAAAGBkZXNjAAAAAAAAAAV1UkdCAAAAAAAAAAAAAAAAdGV4dAAAAABDQzAAWFlaIAAAAAAAAPNUAAEAAAABFslYWVogAAAAAAAAb6AAADjyAAADj1hZWiAAAAAAAABilgAAt4kAABjaWFlaIAAAAAAAACSgAAAPhQAAtsRjdXJ2AAAAAAAAACoAAAB8APgBnAJ1A4MEyQZOCBIKGAxiDvQRzxT2GGocLiBDJKwpai5+M+s5sz/WRldNNlR2XBdkHWyGdVZ+jYgskjacq6eMstu+mcrH12Xkd/H5////2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAQ4BaADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDz+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAClpKWgApDS0UAJRRRQAUUUUAFFLRQAlFLRQAlFLRQAlLRRQAUUUUAFFF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C4EVGRUpphosAwimkU8000rDGkUlOoxRYYlOFFKBTsA4CngcUiinAUWEQkc0mOaew5pDTsK4qinEUKKcRRYLkRFMIqU1GaVhjcUYpcUYpWGJinUmKUUJBcWnAUCnLTsK4uKjI5qZRTGHNOwrkeKAORTiKFHIpWHccRTCKlIppFFguRMKZUjCmd6Vhir1qVBzUYqVaLCJQuelRsKmSkdadhMYo+WonU+lWUHFRuODRYaZVIptSsKZipaKuAqQCmCpVosFyVBTwtIoqQCnYi5XdMHpULLV9kzVV15pNDTKjCkqVxTAOamxdwxS4pcUoFOwgHSnAUAUo60WC41loUVIRkUKOaLBcei5q5szFnHY1DEnXir+zEB47GqS0Mm9TClGHb61FirFwPnb61F2rNrU2i9CNhkUwAVNjim7eaVh3HxLVgLSRJwKnC1SRDZGF9qRxwasbaikFNolMzpVwRmoSKtTL0qHHFZNGyZFipFHIoC81Mqe1JIGyvOMROew/wAao1fvPliYev8AjVCsp7msdgoooqShKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiloASpITiVfqKZQODn0qthGyy5RfpViBfnI9qih/eW0f+6KnT5n3e2K3hqc83YZInWo1X5qvXUeXBqtt/eitLEpj8VYhXIqBelWrcc1SREhjpiottXXSoCuDRYlMqSJkGoSmK0DFu5zVeVMA1LiaKRTIpMVIeKaRzSsXcdD98fUVqFv3I+grKXhx9a0S/7kD2FUiGiA9KtWcRc8elUw29NvpzXRxQ+Tp8DZzvjU/oKqxDIkdYuop8ogu0wm3dgj7vrVOQ81W8wo/402wUStd25jkdT2OP1qsa354heWRmBwUATH5f41hOvG305qStho5Faunx5Vun+cVljpW7pnywMf8AaI/QVSQmyrdHDkVEi5okO56u29uXVeaokpslRMK23sxnBJ6+tQyWIbIDH8TSaHcxHFQkVo3FrJHjlapMgz71NhpkVKKCMU5RmlYokjXmrCrUUY5q2FwKtIm5A45pR0of7xo6inYVyFzUTVaEBfjI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V2Fzms+MkGrcJ5qkyGjViiWdcHqDmqtxG0UojwceuKntnIyc1pXNsk9oZQP3gVjxjr2/lWiZlI5u6TacDoRmqHetW5XEJ74AyT2NZTfeoLiKOtPABpgFW7WBpCV2/N1x7UJCkTWlm0zAncBkfw1uw2lrEg3zIGHYtj+tUbqf7EBFb4JGfM3DlfT+dUg7uxd3ZsnIyc8UCszf/cPwsqfg2ap3Ue1DzkfSq0LYYEcVp7BPbMp6kDpTuTymSHAq1K+bY/7prHWZmPzcfSr5cm05/umjcaRkzcu31poFOk5f5eaVV3OBUtFoVUzirMUWfX8qWGEZw1aVtbo2etCRMmV448YqbZUzxFDgjml2g1djK5WlXCGs2bqfrWvcDEZrIlHJ+tSzSJA44qILVhlzSImWHHGahLUty0HQRk44P5VPcKEt5G7qpP6VYtYhtywwM1T1h/J08sD8znYQfQg0paIIas5qRt8jse5JqOlz1pM8YrkbOxAetJRRUjCilpKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAClpKWgApeMCkooBDlOCcV19tMt9AZlOcNt5+me31rjgcGt7w3cqkskLsQm0t3xngdK2pPUxqq6OisGwdp9RU9zbFySB296ghAjlA7kjFXxMAOe3FdZxXMGWIgnimxjDitq7hiUkZGc/3faqUlsR8wAxTGXLPDqR71mX37uRh04/pWjYEK5yeMf4VT1mMrL06g/yFMRqWo2aQvbcqt+grFuj8rf57VuEbdLtv+uCZ/IVg3XCt/ntWbNImROev1qmXMbZz2q1N3+tU3IPWsWzoijRVlmQEHOKs2hywQ+v9KxIJzE4Uk4JHetiBgGRx0Iz+laRkmRONjb8P25jge4YY3xOoP4//AFqS5bOR71owx/Z9JjQjBGRx9TWXcEZ49TVsyKkhqu5qaQ1Xc1DNEQSHCs3cHio7af7Ndo5OAzBW+meadJy3tVObkMe5GPpUc1i+W5r3SKW8xOUYk8enaprEbrQov/PTP6CsvT7vePs8megC5Oela+nqUkaPvjd/KtYu6MpqxveFY/J0hrg8eeDz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FACk0lBpKQBRRRQMKKKKACikooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigBaKSigBaKSigBaKKKAFoopKdwFoNJRSAWikopgPBpc00UUxC0lJRSGFFFFAhaM0lFAC0UlFAC0UlFAC0UlFAC0uabRTAdSUlFAC0tJRQFhaKSigLC0uabRQFhc0UlFAWFpc02igLDiaSkooEOzRmm0UAOzS54plLQAtJQaSgLDhS54ptFAC0GkooAUGlJptFABSikooAdmkJpKKAAGlzTaKAHZpO9JRQA7NJSUUALRSUUDsOzSGkooCwtFJRQAtFJRQAtJRSUALRSUUALRSUUALRSUUALRSUUALRSUUgDvRRRQAUUUlIY4UpNNopisBpKKKQBRRRQMWikooAKKKSgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAFooooAKKKKACikpaAAUtJS0wCkoooAKKKKACiiigApaSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSloAKKKKACiiigAooooAKKKKBBRRRQAUtJRQApopKKAFopKKAFoNJRQAUtJRQAtFJRQAtFJRQAUUUUAFFFFABRRRQAUUUUDCiiigAooooAKKKSgBaKSigBaKSigBaKSigBaKSigAooooAKKKKACiiigAooooAKKKKQBSUUUALRRRQAUUUlAC0lFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUALRSUtABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRSUUALRSUUALRSUUALRSUtABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRSUALRSUUALRSUtABRRRQAUUUUAFFFFABRRRQAUlLSUAFLSUtABRRRQAlFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAtFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFACUUUUALRRRQAUlLSUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAH/9k=";
function SearchableSelect({ items, value, onSelect, placeholder, displayKey='name', searchKeys=['name'] }: any){
  const [q, setQ] = useState(value || '');
  const [open, setOpen] = useState(false);
  const filtered = items.filter((it:any)=>{
    const str = searchKeys.map((k:string)=> (it[k]||'')).join(' ').toLowerCase();
    return str.includes(q.toLowerCase());
  }).slice(0,8);
  useEffect(()=>{ setQ(value||''); },[value]);
  return (
    <div className="relative">
      <input className={inp + ' !py-2.5 !text-[13px]'} placeholder={placeholder} value={q} onChange={e=>{ setQ(e.target.value); setOpen(true); } } onFocus={()=>setOpen(true)} onBlur={()=>setTimeout(()=>setOpen(false),200)} />
      {open && filtered.length>0 && (
        <div className="absolute z-50 top-full mt-1 w-full rounded-xl bg-[#0f172a] border border-white/10 shadow-2xl max-h-[180px] overflow-auto">
          {filtered.map((it:any, idx:number)=>(
            <button key={idx} type="button" onMouseDown={()=>{ onSelect(it); setQ(it[displayKey]||it.full_name||it.treatment_name||''); setOpen(false); }} className="w-full text-right px-3 py-2.5 text-sm text-slate-200 hover:bg-blue-600/20 hover:text-white border-b border-white/5 last:border-0 flex justify-between">
              <span>{it[displayKey]||it.full_name||it.treatment_name}</span>
              {it.price && <span className="text-emerald-400 text-xs">{it.price} ر.س</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
function ToothChartModal({ open, onClose, selected, onToggle, treatmentName, doctorName, price }: any){
  if(!open) return null;
  const upperRight = [18,17,16,15,14,13,12,11];
  const upperLeft = [21,22,23,24,25,26,27,28];
  const lowerLeft = [31,32,33,34,35,36,37,38];
  const lowerRight = [41,42,43,44,45,46,47,48];
  const renderRow = (teeth:any[])=>{
    return (
      <div className="flex justify-center gap-1">
        {teeth.map(fdi=>{
          const shortNum = getShortNumber(fdi);
          const isSel = selected.includes(fdi);
          return (
            <button key={fdi} onClick={()=>onToggle(fdi)} className={`relative w-[42px] h-[56px] rounded-[12px] border-2 flex flex-col items-center justify-center transition-all ${isSel ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30 scale-105' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}`}>
              <span className="text-[22px] leading-none">🦷</span>
              <span className={`text-[16px] font-black mt-1 ${isSel ? 'text-white' : 'text-slate-200'}`}>{shortNum}</span>
              <span className="text-[8px] text-slate-400">{fdi}</span>
              {isSel && <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] text-white">✓</span>}
            </button>
          );
        })}
      </div>
    );
  };
  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 md:p-4">
      <div className="w-full max-w-[680px] rounded-2xl bg-[#0f172a] border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-[#0f172a] p-4 border-b border-white/10 flex justify-between items-center">
          <h3 className="font-bold text-white">مخطط الأسنان - اختر الأسنان (مطابق للرسم الأحمر)</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">✕</button>
        </div>
        <div className="p-4 space-y-4">
          <div className="rounded-xl bg-white p-4">
            <div className="text-center font-mono text-red-600 font-bold text-[14px] leading-6 select-none" dir="ltr">
              <div className="flex justify-center items-center gap-2"><span>8 7 6 5 4 3 2 1</span><span className="w-[2px] h-6 bg-red-600 mx-2"></span><span>1 2 3 4 5 6 7 8</span></div>
              <div className="w-full h-[2px] bg-red-600 my-1"></div>
              <div className="flex justify-center items-center gap-2"><span>8 7 6 5 4 3 2 1</span><span className="w-[2px] h-6 bg-red-600 mx-2"></span><span>1 2 3 4 5 6 7 8</span></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-center text-[11px] text-slate-400">الفك العلوي</div>
            <div className="flex justify-center items-center gap-4"><div className="flex gap-1">{renderRow(upperRight)}</div><div className="w-[2px] h-[60px] bg-red-500/50"></div><div className="flex gap-1">{renderRow(upperLeft)}</div></div>
            <div className="w-full h-[2px] bg-red-500/50"></div>
            <div className="flex justify-center items-center gap-4"><div className="flex gap-1">{renderRow(lowerRight)}</div><div className="w-[2px] h-[60px] bg-red-500/50"></div><div className="flex gap-1">{renderRow(lowerLeft)}</div></div>
            <div className="text-center text-[11px] text-slate-400">الفك السفلي</div>
          </div>
          {selected.length>0 && (
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <div className="bg-white/5 px-3 py-2 text-xs text-slate-300 font-bold">المعالجات المضافة أسفل المخطط - {selected.length} أسنان محددة</div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-white/5 text-slate-400"><tr><th className="text-right px-3 py-2">اسم المعالجة</th><th className="text-right px-3 py-2">اسم الطبيب</th><th className="text-right px-3 py-2">سعر المعالجة</th><th className="text-right px-3 py-2">رقم السن</th></tr></thead>
                  <tbody className="divide-y divide-white/5">
                    {selected.map((fdi:any)=>(
                      <tr key={fdi} className="text-slate-200"><td className="px-3 py-2">{treatmentName||'—'}</td><td className="px-3 py-2">{doctorName||'—'}</td><td className="px-3 py-2 text-emerald-300">{price ? `${price} ر.س` : '—'}</td><td className="px-3 py-2"><span className="px-2 py-1 rounded-full bg-blue-600 text-white font-bold">{getShortNumber(fdi)} ({fdi})</span></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <div className="flex gap-2"><button onClick={onClose} className={btnSm + ' flex-1 !justify-center'}>إغلاق وتفريغ نوع المعالجة ✓</button></div>
        </div>
      </div>
    </div>
  );
}

function Treatments({ setPage, setSelectedPatient }: any){
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [treatmentDefs, setTreatmentDefs] = useState<any[]>([]);
  const [rows, setRows] = useState<any[]>([{ id: Date.now(), patient_id:'', patient_name:'', doctor_id:'', doctor_name:'', treatment_def_id:'', treatment_name:'', teeth:[], cost:'', date: new Date().toISOString().split('T')[0], status:'planned', notes:'', showTeethModal:false }]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(()=>{
    (async()=>{
      const [p,d,td] = await Promise.all([
        supabase.from('patients').select('id, full_name').order('full_name').limit(100),
        supabase.from('doctors').select('*').order('created_at'),
        supabase.from('treatment_definitions').select('*').order('created_at'),
      ]);
      setPatients(p.data||[]);
      setDoctors(d.data||[{id:'1', name:'د. أحمد' }, {id:'2', name:'د. محمد'}]);
      setTreatmentDefs(td.data||[{id:'1', name:'حشوة تجميلية', price:500}, {id:'2', name:'زراعة', price:3000}, {id:'3', name:'تنظيف', price:200}]);
      setLoading(false);
    })();
  },[]);
  const addRow = () => setRows([...rows, { id: Date.now(), patient_id:'', patient_name:'', doctor_id:'', doctor_name:'', treatment_def_id:'', treatment_name:'', teeth:[], cost:'', date: new Date().toISOString().split('T')[0], status:'planned', notes:'', showTeethModal:false }]);
  const updateRow = (id:any, patch:any) => setRows(rows.map(r=> r.id===id ? {...r, ...patch} : r));
  const handleSave = async () => {
    setSaving(true);
    const toInsert:any[] = [];
    rows.forEach(r=>{
      if(!r.patient_id || !r.treatment_name) return;
      if(r.teeth.length===0){
        toInsert.push({ patient_id:r.patient_id, tooth_number:null, treatment_type:r.treatment_name, doctor_name:r.doctor_name, cost: r.cost ? Number(r.cost) : null, status:r.status, description:r.notes||null, treatment_date:r.date });
      } else {
        r.teeth.forEach((fdi:any)=> toInsert.push({ patient_id:r.patient_id, tooth_number:fdi, treatment_type:r.treatment_name, doctor_name:r.doctor_name, cost: r.cost ? Number(r.cost) : null, status:r.status, description:r.notes||null, treatment_date:r.date }));
      }
    });
    if(toInsert.length===0){ setSaving(false); alert('أضف بيانات أولا'); return; }
    const { error } = await supabase.from('treatments').insert(toInsert);
    setSaving(false);
    if(error) alert('خطأ: ' + error.message);
    else { alert(`تم حفظ ${toInsert.length} معالجات بنجاح في ملف المريض`); setRows([{ id: Date.now(), patient_id:'', patient_name:'', doctor_id:'', doctor_name:'', treatment_def_id:'', treatment_name:'', teeth:[], cost:'', date: new Date().toISOString().split('T')[0], status:'planned', notes:'', showTeethModal:false }]); }
  };
  if(loading) return <div className="p-8 text-center text-slate-400">جاري التحميل...</div>;
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center"><h2 className="text-xl font-bold text-white">سجل المعالجات - الجدول التفاعلي 8 أعمدة</h2><div className="flex gap-2"><button onClick={addRow} className={btnGhost + ' !text-xs'}>+ صف</button><button onClick={handleSave} disabled={saving} className={btnSm}>{saving ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>} حفظ المعالجات</button></div></div>
      <div className={card + ' !p-0 overflow-auto'}>
        <div className="min-w-[1200px]">
          <div className="grid grid-cols-8 gap-2 bg-white/5 p-3 text-[11px] font-bold text-slate-300 text-center sticky top-0">
            <div>1 اسم المريض</div><div>2 الطبيب</div><div>3 نوع المعالجة</div><div>4 رقم الأسنان 🦷</div><div>5 التكلفة</div><div>6 التاريخ</div><div>7 الحالة</div><div>8 ملاحظات</div>
          </div>
          {rows.map(row=>(
            <div key={row.id} className="grid grid-cols-8 gap-2 p-3 border-b border-white/5 items-start">
              <div><SearchableSelect items={patients} value={row.patient_name} displayKey="full_name" searchKeys={['full_name']} placeholder="بحث مريض..." onSelect={(it:any)=>updateRow(row.id, {patient_id:it.id, patient_name:it.full_name})} /></div>
              <div><SearchableSelect items={doctors} value={row.doctor_name} displayKey="name" searchKeys={['name']} placeholder="بحث طبيب..." onSelect={(it:any)=>updateRow(row.id, {doctor_id:it.id, doctor_name:it.name})} /></div>
              <div><SearchableSelect items={treatmentDefs} value={row.treatment_name} displayKey="name" searchKeys={['name']} placeholder="بحث معالجة..." onSelect={(it:any)=>updateRow(row.id, {treatment_def_id:it.id, treatment_name:it.name, cost: it.price})} /></div>
              <div>
                <button onClick={()=>updateRow(row.id, {showTeethModal:true})} className="w-full h-[42px] rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 flex flex-col items-center justify-center gap-1 relative overflow-hidden">
                  <img src={JAW_IMAGE} alt="jaw" className="w-full h-full object-cover opacity-40 absolute inset-0" />
                  <span className="relative z-10 text-[11px] text-white font-bold">{row.teeth.length>0 ? `${row.teeth.length} أسنان` : '🦷 الفكين'}</span>
                  {row.teeth.length>0 && <span className="relative z-10 text-[9px] text-blue-300">{row.teeth.map(getShortNumber).join(', ')}</span>}
                </button>
                {row.showTeethModal && <ToothChartModal open={true} selected={row.teeth} treatmentName={row.treatment_name} doctorName={row.doctor_name} price={row.cost} onToggle={(fdi:any)=>{ const exists = row.teeth.includes(fdi); updateRow(row.id, {teeth: exists ? row.teeth.filter((t:any)=>t!==fdi) : [...row.teeth, fdi]}); }} onClose={()=>updateRow(row.id, {showTeethModal:false, treatment_name:'', treatment_def_id:'', cost:''})} />}
              </div>
              <div><input type="number" className={inp + ' !py-2.5 !text-[13px]'} placeholder="تلقائي" value={row.cost} onChange={e=>updateRow(row.id, {cost:e.target.value})} /></div>
              <div><input type="date" className={inp + ' !py-2.5'} value={row.date} onChange={e=>updateRow(row.id, {date:e.target.value})} /></div>
              <div><select className={inp + ' !py-2.5'} value={row.status} onChange={e=>updateRow(row.id, {status:e.target.value})}><option value="planned">مخطط</option><option value="in_progress">قيد التنفيذ</option><option value="completed">مكتمل</option></select></div>
              <div><input className={inp + ' !py-2.5 !text-[12px]'} placeholder="ملاحظات" value={row.notes} onChange={e=>updateRow(row.id, {notes:e.target.value})} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Settings({ user }: any){
  const [tab, setTab] = useState('doctors');
  const [doctors, setDoctors] = useState<any[]>([]);
  const [treatmentDefs, setTreatmentDefs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [newDoctor, setNewDoctor] = useState({name:'', specialty:''});
  const [newTreatment, setNewTreatment] = useState({name:'', price:''});
  const [editItem, setEditItem] = useState<any>(null);
  const [editType, setEditType] = useState('');
  const load = async () => {
    const [d, t] = await Promise.all([
      supabase.from('doctors').select('*').order('created_at',{ascending:false}),
      supabase.from('treatment_definitions').select('*').order('created_at',{ascending:false}),
    ]);
    if(d.data) setDoctors(d.data);
    if(t.data) setTreatmentDefs(t.data);
  };
  useEffect(()=>{ load(); },[]);
  const addDoctor = async () => {
    if(!newDoctor.name) return;
    const { error } = await supabase.from('doctors').insert({name:newDoctor.name, specialty:newDoctor.specialty||null});
    if(!error){ setNewDoctor({name:'', specialty:''}); load(); } else alert(error.message);
  };
  const addTreatment = async () => {
    if(!newTreatment.name || !newTreatment.price) return alert('الاسم والسعر مطلوب');
    const { error } = await supabase.from('treatment_definitions').insert({name:newTreatment.name, price: Number(newTreatment.price)});
    if(!error){ setNewTreatment({name:'', price:''}); load(); } else alert(error.message);
  };
  const deleteItem = async (table:string, id:string) => {
    if(!confirm('حذف نهائي؟')) return;
    await supabase.from(table).delete().eq('id', id); load();
  };
  const saveEdit = async () => {
    if(!editItem) return;
    const table = editType==='doctor' ? 'doctors' : 'treatment_definitions';
    const payload:any = editType==='doctor' ? {name:editItem.name, specialty:editItem.specialty} : {name:editItem.name, price:Number(editItem.price)};
    const { error } = await supabase.from(table).update(payload).eq('id', editItem.id);
    if(!error){ setEditItem(null); load(); } else alert(error.message);
  };
  const filteredDoctors = doctors.filter((d:any)=> d.name.toLowerCase().includes(search.toLowerCase()));
  const filteredTreatments = treatmentDefs.filter((t:any)=> t.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-4">
      <div className={card}>
        <h2 className="text-lg font-bold text-white mb-2">الاعدادات</h2>
        <p className="text-sm text-slate-400">البريد: {user?.email}</p>
        <p className="text-xs text-slate-500 mt-1">Zircon OS V2 - عيادة زراعة الاسنان</p>
      </div>
      <div className="flex gap-2 border-b border-white/10">
        <button onClick={()=>setTab('doctors')} className={`px-4 py-2 text-sm border-b-2 ${tab==='doctors' ? 'border-blue-500 text-white' : 'border-transparent text-slate-400'}`}>إدارة الأطباء (طبيب)</button>
        <button onClick={()=>setTab('treatments')} className={`px-4 py-2 text-sm border-b-2 ${tab==='treatments' ? 'border-blue-500 text-white' : 'border-transparent text-slate-400'}`}>إدارة المعالجات (معالجة)</button>
      </div>
      <div className="flex gap-2"><input className={inp + ' !py-2 max-w-[300px]'} placeholder="بحث سريع..." value={search} onChange={e=>setSearch(e.target.value)} /></div>
      {tab==='doctors' && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className={card + ' space-y-3'}>
            <h3 className="font-bold text-white text-sm">إضافة طبيب</h3>
            <input className={inp} placeholder="اسم الطبيب *" value={newDoctor.name} onChange={e=>setNewDoctor({...newDoctor, name:e.target.value})} />
            <input className={inp} placeholder="التخصص (اختياري)" value={newDoctor.specialty} onChange={e=>setNewDoctor({...newDoctor, specialty:e.target.value})} />
            <button onClick={addDoctor} className={btnSm}>إضافة طبيب</button>
          </div>
          <div className={card + ' !p-0 overflow-hidden'}>
            <div className="p-3 font-bold text-white text-sm border-b border-white/10">عرض الأطباء - اضغط للتعديل</div>
            <div className="divide-y divide-white/5 max-h-[400px] overflow-auto">
              {filteredDoctors.map((d:any)=><div key={d.id} className="p-3 flex justify-between items-center hover:bg-white/5"><div><div className="text-white text-sm">{d.name}</div><div className="text-xs text-slate-400">{d.specialty||''}</div></div><div className="flex gap-2"><button onClick={()=>{ setEditItem(d); setEditType('doctor'); }} className="text-blue-400 text-xs">تعديل</button><button onClick={()=>deleteItem('doctors', d.id)} className="text-red-400 text-xs">حذف</button></div></div>)}
            </div>
          </div>
        </div>
      )}
      {tab==='treatments' && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className={card + ' space-y-3'}>
            <h3 className="font-bold text-white text-sm">إضافة معالجة (الاسم + السعر ضروري لربطه بالتكلفة)</h3>
            <input className={inp} placeholder="اسم المعالجة *" value={newTreatment.name} onChange={e=>setNewTreatment({...newTreatment, name:e.target.value})} />
            <input type="number" className={inp} placeholder="سعر المعالجة * (مثال: 500)" value={newTreatment.price} onChange={e=>setNewTreatment({...newTreatment, price:e.target.value})} />
            <button onClick={addTreatment} className={btnSm}>إضافة معالجة</button>
          </div>
          <div className={card + ' !p-0 overflow-hidden'}>
            <div className="p-3 font-bold text-white text-sm border-b border-white/10">عرض المعالجات وأسعارها</div>
            <div className="divide-y divide-white/5 max-h-[400px] overflow-auto">
              {filteredTreatments.map((t:any)=><div key={t.id} className="p-3 flex justify-between items-center hover:bg-white/5"><div><div className="text-white text-sm">{t.name}</div><div className="text-xs text-emerald-400">{t.price} ر.س</div></div><div className="flex gap-2"><button onClick={()=>{ setEditItem(t); setEditType('treatment'); }} className="text-blue-400 text-xs">تعديل</button><button onClick={()=>deleteItem('treatment_definitions', t.id)} className="text-red-400 text-xs">حذف</button></div></div>)}
            </div>
          </div>
        </div>
      )}
      {editItem && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className={card + ' w-full max-w-md space-y-3'}>
            <h3 className="font-bold text-white">تعديل {editType==='doctor' ? 'الطبيب' : 'المعالجة'}</h3>
            <input className={inp} value={editItem.name} onChange={e=>setEditItem({...editItem, name:e.target.value})} placeholder="الاسم" />
            {editType==='doctor' ? <input className={inp} value={editItem.specialty||''} onChange={e=>setEditItem({...editItem, specialty:e.target.value})} placeholder="التخصص" /> : <input type="number" className={inp} value={editItem.price} onChange={e=>setEditItem({...editItem, price:e.target.value})} placeholder="السعر" />}
            <div className="flex gap-2"><button onClick={saveEdit} className={btnSm}>حفظ التعديل</button><button onClick={()=>setEditItem(null)} className={btnGhost}>إلغاء</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

function DiseasesLog({ setPage }: any){
  const [tab, setTab] = useState('treatments_log');
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(()=>{ supabase.from('treatments').select('*, patient:patients(full_name)').order('created_at',{ascending:false}).limit(100).then(({data})=>setLogs(data||[])); },[tab]);
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">سجل الأمراض</h2>
      <div className="flex gap-2 border-b border-white/10">
        <button onClick={()=>setTab('treatments_log')} className={`px-4 py-2 text-sm border-b-2 ${tab==='treatments_log' ? 'border-blue-500 text-white' : 'border-transparent text-slate-400'}`}>سجل المعالجات</button>
        <button onClick={()=>setTab('medical_file')} className={`px-4 py-2 text-sm border-b-2 ${tab==='medical_file' ? 'border-blue-500 text-white' : 'border-transparent text-slate-400'}`}>الملف الطبي</button>
        <button onClick={()=>setTab('account')} className={`px-4 py-2 text-sm border-b-2 ${tab==='account' ? 'border-blue-500 text-white' : 'border-transparent text-slate-400'}`}>سند حساب</button>
      </div>
      {tab==='treatments_log' && (
        <div className={card + ' !p-0 overflow-hidden'}>
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-2">المريض</th><th className="text-right px-4 py-2">المعالجة</th><th className="text-right px-4 py-2">الطبيب</th><th className="text-right px-4 py-2">السن</th><th className="text-right px-4 py-2">السعر</th><th className="text-right px-4 py-2">التاريخ</th></tr></thead><tbody className="divide-y divide-white/5">{logs.map((l:any)=><tr key={l.id}><td className="px-4 py-2 text-white">{l.patient?.full_name}</td><td className="px-4 py-2 text-slate-200">{l.treatment_type}</td><td className="px-4 py-2 text-slate-300">{l.doctor_name||'—'}</td><td className="px-4 py-2"><span className="px-2 py-1 rounded bg-white/10 text-white text-xs">{l.tooth_number||'—'}</span></td><td className="px-4 py-2 text-emerald-300">{l.cost} ر.س</td><td className="px-4 py-2 text-slate-400 text-xs">{fmtDate(l.created_at)}</td></tr>)}</tbody></table></div>
        </div>
      )}
      {tab==='medical_file' && <div className={card}><p className="text-slate-400 text-sm">الملف الطبي - يتم تجميع كل معالجات المريض، صور الأشعة، والملاحظات الطبية هنا. قريباً.</p></div>}
      {tab==='account' && <div className={card}><p className="text-slate-400 text-sm">سند حساب - الفواتير، المدفوعات، والرصيد. قريباً.</p><button onClick={()=>setPage('reports')} className={btnSm + ' mt-3'}>الذهاب للتقارير المالية</button></div>}
    </div>
  );
}


function Dashboard({ setPage }: { setPage: (p:string)=>void }) {
  const [stats, setStats] = useState({ patients: 0, today: 0, surgeries: 0, implants: 0, followups: 0, unpaid: 0 });
  const [recent, setRecent] = useState<any[]>([]);
  const [todayAppts, setTodayAppts] = useState<any[]>([]);
  const [upcomingFollowups, setUpcomingFollowups] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const start = new Date(); start.setHours(0,0,0,0);
      const end = new Date(); end.setHours(23,59,59,999);
      const mStart = new Date(); mStart.setDate(1); mStart.setHours(0,0,0,0);
      const [p, a, s, i, f, inv] = await Promise.all([
        supabase.from('patients').select('*', { count: 'exact', head: true }),
        supabase.from('appointments').select('*', { count: 'exact', head: true }).gte('scheduled_start', start.toISOString()).lte('scheduled_start', end.toISOString()),
        supabase.from('surgeries').select('*', { count: 'exact', head: true }).gte('created_at', mStart.toISOString()),
        supabase.from('implants').select('*', { count: 'exact', head: true }),
        supabase.from('follow_ups').select('*', { count: 'exact', head: true }).eq('status','scheduled'),
        supabase.from('invoices').select('amount').eq('status','unpaid'),
      ]);
      setStats({ patients: p.count||0, today: a.count||0, surgeries: s.count||0, implants: i.count||0, followups: f.count||0, unpaid: (inv.data as any)?.reduce((s:number,r:any)=>s+Number(r.amount),0) || 0 });
      const { data: rp } = await supabase.from('patients').select('*').order('created_at', { ascending: false }).limit(5);
      setRecent(rp || []);
      const { data: ta } = await supabase.from('appointments').select('*, patient:patients(full_name)').gte('scheduled_start', start.toISOString()).lte('scheduled_start', end.toISOString()).order('scheduled_start');
      setTodayAppts(ta || []);
      const { data: fu } = await supabase.from('follow_ups').select('*, patient:patients(full_name, phone)').eq('status','scheduled').order('scheduled_date').limit(5);
      setUpcomingFollowups(fu || []);
    })();
  }, []);

  const Stat = ({ icon: Icon, label, value, tone }: any) => (
    <div className={card}>
      <div className={'h-10 w-10 rounded-xl grid place-items-center mb-3 ' + tone}><Icon size={20} /></div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-slate-400 mt-1">{label}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">لوحة تحكم الزراعة</h2>
          <p className="text-slate-400 mt-1 text-sm">متابعة حالات زراعة الاسنان</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setPage('patient-new')} className={btnSm}><Plus size={16}/> مريض</button>
          <button onClick={() => setPage('appointment-new')} className={btnSm}><Plus size={16}/> موعد</button>
          <button onClick={() => setPage('surgery-new')} className={btnSm}><Plus size={16}/> جراحة</button>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Stat icon={Users} label="اجمالي المرضى" value={stats.patients} tone="bg-blue-500/20 text-blue-300" />
        <Stat icon={Calendar} label="مواعيد اليوم" value={stats.today} tone="bg-emerald-500/20 text-emerald-300" />
        <Stat icon={Clock} label="متابعات قادمة" value={stats.followups} tone="bg-amber-500/20 text-amber-300" />
        <Stat icon={Stethoscope} label="الجراحات هذا الشهر" value={stats.surgeries} tone="bg-purple-500/20 text-purple-300" />
        <Stat icon={Syringe} label="اجمالي الزرعات" value={stats.implants} tone="bg-cyan-500/20 text-cyan-300" />
        <Stat icon={DollarSign} label="مبالغ غير مدفوعة" value={`${stats.unpaid.toLocaleString()} ر.س`} tone="bg-red-500/20 text-red-300" />
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className={card}>
          <h3 className="font-semibold text-white mb-4">احدث المرضى</h3>
          <div className="space-y-2">
            {recent.map((p:any) => (
              <div key={p.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <div className="h-9 w-9 rounded-full bg-blue-500/20 text-blue-300 grid place-items-center text-sm font-semibold">{p.full_name?.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">{p.full_name}</div>
                  <div className="text-xs text-slate-400" dir="ltr">{p.patient_code}</div>
                </div>
                <a href={`https://wa.me/${p.phone?.replace(/\D/g,'')}`} target="_blank" className="text-emerald-400"><MessageCircle size={16}/></a>
              </div>
            ))}
          </div>
        </div>
        <div className={card}>
          <h3 className="font-semibold text-white mb-4">مواعيد اليوم</h3>
          <div className="space-y-2">
            {todayAppts.length===0 ? <p className="text-sm text-slate-500">لا توجد مواعيد اليوم</p> :
              todayAppts.map((a:any) => (
              <div key={a.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <div className="text-sm font-semibold text-blue-300 w-14" dir="ltr">{new Date(a.scheduled_start).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
                <div className="flex-1 text-sm text-white truncate">{a.patient?.full_name}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={card + ' border-amber-500/20'}>
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Clock size={16} className="text-amber-400"/> متابعات تحتاج تواصل</h3>
          <div className="space-y-2">
            {upcomingFollowups.length===0 ? <p className="text-sm text-slate-500">لا توجد متابعات قادمة</p> :
              upcomingFollowups.map((f:any) => (
              <div key={f.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">{f.patient?.full_name}</div>
                  <div className="text-xs text-slate-400">{f.follow_type} - {fmtDate(f.scheduled_date)}</div>
                </div>
                <a href={`https://wa.me/${f.patient?.phone?.replace(/\D/g,'')}`} target="_blank" className="h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-300 grid place-items-center"><MessageCircle size={14}/></a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Patients({ setPage, setEditItem, setSelectedPatient }: any) {
  const [list, setList] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const load = useCallback(async ()=>{
    setLoading(true);
    let q = supabase.from('patients').select('*').order('created_at', { ascending: false }).limit(100);
    if (search) q = q.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%,patient_code.ilike.%${search}%`);
    const { data } = await q;
    setList(data || []); setLoading(false);
  }, [search]);
  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [load]);
  async function del(id: string) {
    if (!confirm('حذف المريض؟')) return;
    await supabase.from('patients').delete().eq('id', id); load();
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث بالاسم او الجوال..." className={inp + ' pr-10'} />
        </div>
        <button onClick={() => { setEditItem(null); setPage('patient-new'); }} className={btnSm}><Plus size={16}/> مريض جديد</button>
      </div>
      <div className={card + ' !p-0 overflow-hidden'}>
        {loading ? <div className="p-8 text-center text-slate-400">جاري التحميل...</div> :
         list.length === 0 ? <div className="p-8 text-center text-slate-400">لا يوجد مرضى</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-slate-400 text-xs">
                <tr><th className="text-right px-4 py-3">الكود</th><th className="text-right px-4 py-3">الاسم</th><th className="text-right px-4 py-3">الجوال</th><th className="text-right px-4 py-3">اجراءات</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {list.map((p:any) => (
                  <tr key={p.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 font-mono text-blue-300 text-xs" dir="ltr">{p.patient_code}</td>
                    <td className="px-4 py-3 text-white font-medium"><button onClick={()=>{ setSelectedPatient(p); setPage('patient-detail'); }} className="hover:text-blue-400">{p.full_name}</button></td>
                    <td className="px-4 py-3 text-slate-300" dir="ltr">{p.phone}</td>
                    <td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => { setEditItem(p); setPage('patient-new'); }} className="text-blue-400"><Edit3 size={16}/></button><button onClick={() => del(p.id)} className="text-red-400"><Trash2 size={16}/></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function PatientForm({ patient, onSave, onCancel }: any) {
  const isEdit = !!patient?.id;
  const [form, setForm] = useState({
    full_name: patient?.full_name || '', phone: patient?.phone || '', medical_alerts: patient?.medical_alerts || '', notes: patient?.notes || '',
    gender: patient?.gender || '', date_of_birth: patient?.date_of_birth || '',
  });
  const [err, setErr] = useState(''); const [loading, setLoading] = useState(false);
  async function submit(e: any) {
    e.preventDefault(); setErr('');
    if (!form.full_name.trim() || !form.phone.trim()) { setErr('الاسم والجوال مطلوبان'); return; }
    setLoading(true);
    const payload: any = { full_name: form.full_name.trim(), phone: form.phone.trim(), gender: form.gender || null, date_of_birth: form.date_of_birth || null, medical_alerts: form.medical_alerts || null, notes: form.notes || null };
    let res = isEdit ? await supabase.from('patients').update(payload).eq('id', patient.id) : await supabase.from('patients').insert(payload);
    setLoading(false);
    if (res.error) { setErr(res.error.message); return; }
    onSave();
  }
  return (
    <form onSubmit={submit} className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-3"><button type="button" onClick={onCancel} className="text-slate-400"><ArrowRight size={20}/></button><h2 className="text-xl font-bold text-white">{isEdit ? 'تعديل المريض' : 'اضافة مريض جديد'}</h2></div>
      <div className={card}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label><span className={label}>الاسم *</span><input className={inp} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required /></label>
          <label><span className={label}>الجوال *</span><input className={inp} dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></label>
          <label><span className={label}>الجنس</span><select className={inp} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}><option value="">—</option><option value="male">ذكر</option><option value="female">انثى</option></select></label>
          <label><span className={label}>تاريخ الميلاد</span><input className={inp} type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} /></label>
          <label className="md:col-span-2"><span className={label}>تنبيهات طبية</span><textarea className={inp} rows={2} value={form.medical_alerts} onChange={(e) => setForm({ ...form, medical_alerts: e.target.value })} /></label>
        </div>
      </div>
      {err && <div className="rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3">{err}</div>}
      <div className="flex gap-3"><button type="submit" disabled={loading} className={btnSm + ' !px-6 !py-2.5'}>{loading ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>} حفظ</button><button type="button" onClick={onCancel} className={btnGhost}>الغاء</button></div>
    </form>
  );
}

function PatientDetail({ patient, onBack, setPage, setEditItem }: any) {
  const [tab, setTab] = useState('overview');
  const [surgeries, setSurgeries] = useState<any[]>([]);
  const [implants, setImplants] = useState<any[]>([]);
  const [followups, setFollowups] = useState<any[]>([]);
  const [treatments, setTreatments] = useState<any[]>([]);
  const [showImplantModal, setShowImplantModal] = useState(false);
  const [selectedTooth, setSelectedTooth] = useState<number>(11);
  const load = useCallback(async()=>{
    const [s, i, f, t] = await Promise.all([
      supabase.from('surgeries').select('*').eq('patient_id', patient.id).order('created_at',{ascending:false}),
      supabase.from('implants').select('*').eq('patient_id', patient.id).order('created_at',{ascending:false}),
      supabase.from('follow_ups').select('*').eq('patient_id', patient.id).order('scheduled_date'),
      supabase.from('treatments').select('*').eq('patient_id', patient.id).order('created_at',{ascending:false}),
    ]);
    setSurgeries(s.data||[]); setImplants(i.data||[]); setFollowups(f.data||[]); setTreatments(t.data||[]);
  },[patient.id]);
  useEffect(()=>{ load(); },[load]);
  function handleToothClick(tooth: number) {
    setSelectedTooth(tooth);
    if (surgeries.length===0) { alert('يجب انشاء جراحة اولا قبل اضافة زرعة'); return; }
    setShowImplantModal(true);
  }
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={onBack} className="text-slate-400"><ArrowRight size={20}/></button>
        <h2 className="text-xl font-bold text-white">{patient.full_name}</h2>
        <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300 font-mono" dir="ltr">{patient.patient_code}</span>
        <div className="flex-1" />
        <a href={`https://wa.me/${patient.phone?.replace(/\D/g,'')}`} target="_blank" className={btnSm + ' !bg-emerald-600'}><MessageCircle size={16}/> واتساب</a>
        <button onClick={()=>{ setEditItem(patient); setPage('patient-new'); }} className={btnGhost}><Edit3 size={16}/> تعديل</button>
      </div>
      <div className="border-b border-white/10 overflow-x-auto"><div className="flex gap-1 min-w-max">
        {[{id:'overview', label:'نظرة عامة'},{id:'chart', label:`مخطط الاسنان (${implants.length})`},{id:'treatments', label:`المعالجات (${treatments.length})`},{id:'surgeries', label:`الجراحات (${surgeries.length})`},{id:'followups', label:`المتابعات (${followups.length})`}].map(t=><button key={t.id} onClick={() => setTab(t.id)} className={'px-4 py-2.5 text-sm border-b-2 whitespace-nowrap ' + (tab === t.id ? 'border-blue-500 text-white' : 'border-transparent text-slate-400')}>{t.label}</button>)}
      </div></div>
      {tab==='overview' && <div className={card}><div className="grid grid-cols-3 gap-3 text-center"><div className="rounded-xl bg-white/5 p-3"><div className="text-xl font-bold text-white">{surgeries.length}</div><div className="text-xs text-slate-400">جراحات</div></div><div className="rounded-xl bg-white/5 p-3"><div className="text-xl font-bold text-emerald-400">{implants.length}</div><div className="text-xs text-slate-400">زرعات</div></div><div className="rounded-xl bg-white/5 p-3"><div className="text-xl font-bold text-amber-400">{followups.length}</div><div className="text-xs text-slate-400">متابعات</div></div></div></div>}
      {tab==='chart' && <div className="space-y-4"><ToothChart implants={implants} onToothClick={handleToothClick}/><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{implants.map((im:any)=><div key={im.id} className={card}><div className="flex justify-between"><span className="text-2xl font-bold text-emerald-400">{im.tooth_number}</span><span className="text-xs px-2 py-1 rounded bg-emerald-500/20 text-emerald-300">{im.status}</span></div><div className="text-sm text-white mt-1">{im.brand}</div><div className="text-xs text-slate-400 mt-1" dir="ltr">{im.diameter_mm} x {im.length_mm} mm | Torque {im.torque_ncm} Ncm</div></div>)}</div></div>}
      {tab==='surgeries' && <div className="space-y-3">{surgeries.map((s:any)=><div key={s.id} className={card + ' flex justify-between items-center'}><div><div className="text-white font-medium">{s.surgery_type} - {fmtDate(s.scheduled_date)}</div><div className="text-xs text-slate-400">{s.status}</div></div></div>)}</div>}
      {tab==='treatments' && <div className="space-y-3">{treatments.length===0 ? <p className="text-sm text-slate-500">لا توجد معالجات</p> : treatments.map((tr:any)=><div key={tr.id} className={card + ' flex justify-between items-center'}><div><div className="text-white font-medium">{tr.treatment_type} - سن {tr.tooth_number || '—'}</div><div className="text-xs text-slate-400">{tr.description || ''} - {tr.cost ? `${tr.cost} ر.س` : ''}</div><div className="text-[10px] text-slate-500 mt-1">{fmtDate(tr.created_at)}</div></div><span className={`text-xs px-2 py-1 rounded ${tr.status==='completed' ? 'bg-emerald-500/20 text-emerald-300' : tr.status==='in_progress' ? 'bg-blue-500/20 text-blue-300' : 'bg-amber-500/20 text-amber-300'}`}>{tr.status}</span></div>)}</div>}
      {tab==='followups' && <div className="space-y-3">
        <button onClick={async()=>{
          if (surgeries.length===0) { alert('انشئ جراحة اولا'); return; }
          const base = new Date(surgeries[0].scheduled_date || new Date());
          const dates = [{type:'فك غرز', days:7},{type:'متابعة التئام', days:14},{type:'كشف اندماج العظم', days:90},{type:'موعد التركيب', days:180}];
          for (const d of dates) { const dt = new Date(base); dt.setDate(dt.getDate()+d.days); await supabase.from('follow_ups').insert({ patient_id: patient.id, surgery_id: surgeries[0].id, follow_type: d.type, scheduled_date: dt.toISOString().slice(0,10), status:'scheduled' }); }
          load();
        }} className={btnSm}><Plus size={16}/> انشاء متابعات تلقائية</button>
        {followups.map((f:any)=><div key={f.id} className={card + ' flex justify-between items-center'}><div><div className="text-white">{f.follow_type}</div><div className="text-xs text-slate-400">{fmtDate(f.scheduled_date)}</div></div><span className={`text-xs px-2 py-1 rounded ${f.status==='completed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>{f.status}</span></div>)}
      </div>}
      {showImplantModal && <ImplantModal surgeryId={surgeries[0]?.id} patientId={patient.id} initialTooth={selectedTooth} onClose={()=>setShowImplantModal(false)} onSave={()=>{ setShowImplantModal(false); load(); }} />}
    </div>
  );
}

function Surgeries({ setPage, setSelectedPatient }: any) {
  const [list, setList] = useState<any[]>([]);
  useEffect(()=>{ (async()=>{ const {data}=await supabase.from('surgeries').select('*, patient:patients(full_name)').order('created_at',{ascending:false}).limit(100); setList(data||[]); })(); },[]);
  return <div className="space-y-4"><div className="flex justify-between"><h2 className="text-xl font-bold text-white">الجراحات</h2><button onClick={()=>setPage('surgery-new')} className={btnSm}><Plus size={16}/> جراحة جديدة</button></div><div className={card + ' !p-0 overflow-hidden'}><table className="w-full text-sm"><thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-3">التاريخ</th><th className="text-right px-4 py-3">المريض</th><th className="text-right px-4 py-3">النوع</th></tr></thead><tbody className="divide-y divide-white/5">{list.map((s:any)=><tr key={s.id} className="hover:bg-white/5"><td className="px-4 py-3 text-slate-300 text-xs">{fmtDate(s.scheduled_date)}</td><td className="px-4 py-3 text-white"><button onClick={()=>{ setSelectedPatient(s.patient); setPage('patient-detail'); }} className="text-blue-400">{s.patient?.full_name}</button></td><td className="px-4 py-3 text-slate-300 text-xs">{s.surgery_type}</td></tr>)}</tbody></table></div></div>;
}

function Appointments({ setPage }: any) {
  const [list, setList] = useState<any[]>([]);
  useEffect(()=>{ (async()=>{ const {data}=await supabase.from('appointments').select('*, patient:patients(full_name)').order('scheduled_start',{ascending:false}).limit(100); setList(data||[]); })(); },[]);
  return <div className="space-y-4"><div className="flex justify-between"><h2 className="text-xl font-bold text-white">المواعيد</h2><button onClick={()=>setPage('appointment-new')} className={btnSm}><Plus size={16}/> موعد جديد</button></div><div className={card + ' !p-0 overflow-hidden'}><table className="w-full text-sm"><thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-3">التاريخ</th><th className="text-right px-4 py-3">المريض</th><th className="text-right px-4 py-3">النوع</th></tr></thead><tbody className="divide-y divide-white/5">{list.map((a:any)=><tr key={a.id} className="hover:bg-white/5"><td className="px-4 py-3 text-slate-300 text-xs">{fmtDateTime(a.scheduled_start)}</td><td className="px-4 py-3 text-white">{a.patient?.full_name}</td><td className="px-4 py-3 text-slate-300 text-xs">{a.appointment_type}</td></tr>)}</tbody></table></div></div>;
}

function AppointmentForm({ onSave, onCancel }: any) {
  const [patients, setPatients] = useState<any[]>([]); const [patientId, setPatientId] = useState(''); const [type, setType] = useState('consultation'); const [date, setDate] = useState(new Date().toISOString().slice(0,10)); const [time, setTime] = useState('10:00');
  useEffect(()=>{ supabase.from('patients').select('id, full_name').limit(50).then(({data})=>setPatients(data||[])); },[]);
  async function submit(e:any){ e.preventDefault(); const start=new Date(`${date}T${time}`); const {data:u}=await supabase.auth.getUser(); await supabase.from('appointments').insert({ patient_id: patientId, doctor_id: u?.user?.id, appointment_type: type, status:'scheduled', scheduled_start: start.toISOString(), duration_minutes:30 }); onSave(); }
  return <form onSubmit={submit} className="space-y-4 max-w-xl"><h2 className="text-xl font-bold text-white">حجز موعد جديد</h2><div className={card + ' space-y-4'}><label><span className={label}>المريض *</span><select className={inp} value={patientId} onChange={e=>setPatientId(e.target.value)} required><option value="">اختر مريض</option>{patients.map((p:any)=><option key={p.id} value={p.id}>{p.full_name}</option>)}</select></label><label><span className={label}>النوع</span><select className={inp} value={type} onChange={e=>setType(e.target.value)}><option value="consultation">استشارة</option><option value="implant_surgery">جراحة زراعة</option><option value="follow_up">متابعة</option></select></label><div className="grid grid-cols-2 gap-4"><label><span className={label}>التاريخ</span><input type="date" value={date} onChange={e=>setDate(e.target.value)} className={inp}/></label><label><span className={label}>الوقت</span><input type="time" value={time} onChange={e=>setTime(e.target.value)} className={inp}/></label></div></div><button type="submit" className={btnSm}>حفظ الموعد</button><button type="button" onClick={onCancel} className={btnGhost}>الغاء</button></form>;
}

function SurgeryForm({ onSave, onCancel }: any) {
  const [patients, setPatients] = useState<any[]>([]); const [patientId, setPatientId] = useState(''); const [type, setType] = useState('single_implant'); const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  useEffect(()=>{ supabase.from('patients').select('id, full_name').limit(50).then(({data})=>setPatients(data||[])); },[]);
  async function submit(e:any){ e.preventDefault(); const {data:u}=await supabase.auth.getUser(); const {error}=await supabase.from('surgeries').insert({ patient_id: patientId, doctor_id: u?.user?.id, surgery_type: type, status:'planned', scheduled_date: new Date(date).toISOString() }); if(error){ alert(error.message); return; } onSave(); }
  return <form onSubmit={submit} className="space-y-4 max-w-xl"><h2 className="text-xl font-bold text-white">جراحة جديدة</h2><div className={card + ' space-y-4'}><label><span className={label}>المريض *</span><select className={inp} value={patientId} onChange={e=>setPatientId(e.target.value)} required><option value="">اختر مريض</option>{patients.map((p:any)=><option key={p.id} value={p.id}>{p.full_name}</option>)}</select></label><label><span className={label}>نوع الجراحة</span><select className={inp} value={type} onChange={e=>setType(e.target.value)}><option value="single_implant">زرعة واحدة</option><option value="multiple_implants">زرعات متعددة</option><option value="full_arch">قوس كامل</option></select></label><label><span className={label}>التاريخ</span><input type="date" value={date} onChange={e=>setDate(e.target.value)} className={inp}/></label></div><button type="submit" className={btnSm}>انشاء الجراحة</button><button type="button" onClick={onCancel} className={btnGhost}>الغاء</button></form>;
}

function ImplantModal({ surgeryId, patientId, initialTooth, onClose, onSave }: any) {
  const [form, setForm] = useState({ tooth_number: initialTooth||11, brand: 'Straumann', diameter_mm: '4.1', length_mm: '10', torque_ncm: '35', bone_density: 'D2' });
  const [loading, setLoading] = useState(false);
  async function submit(e:any){
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.from('implants').insert({
      patient_id: patientId, surgery_id: surgeryId,
      tooth_number: form.tooth_number, status:'placed', brand: form.brand,
      diameter_mm: Number(form.diameter_mm), length_mm: Number(form.length_mm), torque_ncm: Number(form.torque_ncm),
      bone_density: form.bone_density, placed_at: new Date().toISOString(),
    });
    setLoading(false);
    if(error){ alert(error.message); return; }
    onSave();
  }
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b1733]">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10"><h3 className="text-white font-semibold">اضافة زرعة سن {form.tooth_number}</h3><button onClick={onClose} className="text-slate-400"><X size={18}/></button></div>
        <form onSubmit={submit} className="p-5 grid grid-cols-2 gap-4">
          <label><span className={label}>السن</span><input type="number" className={inp} value={form.tooth_number} onChange={e=>setForm({...form, tooth_number: Number(e.target.value)})}/></label>
          <label><span className={label}>الماركة</span><select className={inp} value={form.brand} onChange={e=>setForm({...form, brand: e.target.value})}><option>Straumann</option><option>Nobel Biocare</option><option>Mega Gen</option><option>Osstem</option></select></label>
          <label><span className={label}>القطر</span><input className={inp} value={form.diameter_mm} onChange={e=>setForm({...form, diameter_mm: e.target.value})}/></label>
          <label><span className={label}>الطول</span><input className={inp} value={form.length_mm} onChange={e=>setForm({...form, length_mm: e.target.value})}/></label>
          <label><span className={label}>العزم Ncm</span><input className={inp + ' border-amber-500/40'} value={form.torque_ncm} onChange={e=>setForm({...form, torque_ncm: e.target.value})}/></label>
          <label><span className={label}>كثافة العظم</span><select className={inp} value={form.bone_density} onChange={e=>setForm({...form, bone_density: e.target.value})}><option>D1</option><option>D2</option><option>D3</option><option>D4</option></select></label>
          <div className="col-span-2 flex justify-end gap-2 pt-2 border-t border-white/10"><button type="button" onClick={onClose} className={btnGhost}>الغاء</button><button type="submit" disabled={loading} className={btnSm}>{loading && <Loader2 className="animate-spin" size={14}/>} حفظ الزرعة</button></div>
        </form>
      </div>
    </div>
  );
}

function Implants() {
  const [list, setList] = useState<any[]>([]);
  useEffect(()=>{ supabase.from('implants').select('*, patient:patients(full_name)').order('created_at',{ascending:false}).limit(100).then(({data})=>setList(data||[])); },[]);
  return <div className="space-y-4"><h2 className="text-xl font-bold text-white">سجل الزرعات - {list.length} زرعة</h2><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{list.map((im:any)=><div key={im.id} className={card}><div className="text-2xl font-bold text-emerald-400">{im.tooth_number}</div><div className="text-white text-sm">{im.patient?.full_name}</div><div className="text-xs text-slate-400">{im.brand} - {im.diameter_mm}x{im.length_mm}mm - {im.torque_ncm} Ncm</div></div>)}</div></div>;
}



function TreatmentForm({ onSave, onCancel }: any) {
  const [patients, setPatients] = useState<any[]>([]);
  const [form, setForm] = useState({ patient_id: '', tooth_number: '', treatment_type: 'حشوة تجميلية', description: '', cost: '', status: 'planned' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  useEffect(()=>{ supabase.from('patients').select('id, full_name').order('full_name').limit(100).then(({data})=>setPatients(data||[])); },[]);
  async function submit(e:any){
    e.preventDefault(); setErr('');
    if(!form.patient_id){ setErr('اختر المريض'); return; }
    setLoading(true);
    const payload: any = {
      patient_id: form.patient_id,
      tooth_number: form.tooth_number ? Number(form.tooth_number) : null,
      treatment_type: form.treatment_type,
      description: form.description || null,
      cost: form.cost ? Number(form.cost) : null,
      status: form.status,
    };
    const { error } = await supabase.from('treatments').insert(payload);
    setLoading(false);
    if(error){ setErr(error.message + ' - تأكد من إنشاء جدول treatments في Supabase'); return; }
    onSave();
  }
  return (
    <form onSubmit={submit} className="space-y-4 max-w-2xl">
      <div className="flex items-center gap-3"><button type="button" onClick={onCancel} className="text-slate-400"><ArrowRight size={20}/></button><h2 className="text-xl font-bold text-white">إضافة معالجة جديدة</h2></div>
      <div className={card + ' space-y-4'}>
        <div className="grid md:grid-cols-2 gap-4">
          <label><span className={label}>المريض *</span><select className={inp} value={form.patient_id} onChange={e=>setForm({...form, patient_id: e.target.value})} required><option value="">اختر المريض</option>{patients.map((p:any)=><option key={p.id} value={p.id}>{p.full_name}</option>)}</select></label>
          <label><span className={label}>رقم السن (1-8 أو FDI)</span><input type="number" className={inp} placeholder="مثال: 11 أو 6" value={form.tooth_number} onChange={e=>setForm({...form, tooth_number: e.target.value})} /></label>
          <label><span className={label}>نوع المعالجة *</span><select className={inp} value={form.treatment_type} onChange={e=>setForm({...form, treatment_type: e.target.value})}>
            <option>حشوة تجميلية</option><option>حشوة عصب</option><option>قلع</option><option>تنظيف وتلميع</option><option>زراعة</option><option>تركيب زيركون</option><option>تركيب مؤقت</option><option>تقويم</option><option>تبييض</option><option>علاج لثة</option><option>أخرى</option>
          </select></label>
          <label><span className={label}>التكلفة (ر.س)</span><input type="number" className={inp} placeholder="500" value={form.cost} onChange={e=>setForm({...form, cost: e.target.value})} /></label>
          <label><span className={label}>الحالة</span><select className={inp} value={form.status} onChange={e=>setForm({...form, status: e.target.value})}><option value="planned">مخطط لها</option><option value="in_progress">قيد التنفيذ</option><option value="completed">مكتملة</option></select></label>
          <label className="md:col-span-2"><span className={label}>ملاحظات</span><textarea className={inp} rows={3} placeholder="تفاصيل المعالجة..." value={form.description} onChange={e=>setForm({...form, description: e.target.value})}></textarea></label>
        </div>
      </div>
      {err && <div className="rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3">{err}</div>}
      <div className="flex gap-3"><button type="submit" disabled={loading} className={btnSm + ' !px-6'}>{loading ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>} حفظ المعالجة</button><button type="button" onClick={onCancel} className={btnGhost}>إلغاء</button></div>

    </form>
  );
}


function Reports() {


  const [stats, setStats] = useState({ patients:0, surgeries:0, implants:0 });
  useEffect(()=>{ (async()=>{ const [p,s,i]=await Promise.all([ supabase.from('patients').select('*',{count:'exact', head:true}), supabase.from('surgeries').select('*',{count:'exact', head:true}), supabase.from('implants').select('*',{count:'exact', head:true}) ]); setStats({ patients: p.count||0, surgeries: s.count||0, implants: i.count||0 }); })(); },[]);
  return <div className="space-y-4"><h2 className="text-xl font-bold text-white">التقارير</h2><div className="grid grid-cols-2 gap-4"><div className={card}><div className="text-2xl font-bold text-white">{stats.patients}</div><div className="text-sm text-slate-400">اجمالي المرضى</div></div><div className={card}><div className="text-2xl font-bold text-purple-400">{stats.surgeries}</div><div className="text-sm text-slate-400">اجمالي الجراحات</div></div><div className={card}><div className="text-2xl font-bold text-emerald-400">{stats.implants}</div><div className="text-sm text-slate-400">اجمالي الزرعات</div></div></div></div>;
}

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [page, setPage] = useState('dashboard');
  const [editItem, setEditItem] = useState<any>(null);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  if (!session) return <Login onLogin={() => supabase.auth.getSession().then(({data}) => setSession(data.session))} />;

  const menu = [
    { id:'dashboard', label:'لوحة التحكم', icon: LayoutDashboard },
    { id:'patients', label:'المرضى', icon: Users },
    { id:'treatments', label:'إضافة معالجة', icon: ClipboardList },
    { id:'appointments', label:'المواعيد', icon: Calendar },
    { id:'surgeries', label:'الجراحات', icon: Stethoscope },
    { id:'implants', label:'الزرعات', icon: Syringe },
    { id:'reports', label:'التقارير', icon: FileText },
    { id:'settings', label:'الاعدادات', icon: SettingsIcon },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-[#060a1a] text-white flex">
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={()=>setSidebarOpen(false)} />}
      <aside className={`fixed lg:static inset-y-0 right-0 z-50 w-64 border-l border-white/10 bg-[#0a1028] p-4 flex flex-col transition-transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3"><div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 grid place-items-center font-bold">Z</div><div><div className="font-bold">Zircon</div><div className="text-[10px] text-slate-400">Dental OS V2</div></div></div>
          <button onClick={()=>setSidebarOpen(false)} className="lg:hidden text-slate-400"><X size={18}/></button>
        </div>
        <nav className="space-y-1 flex-1 overflow-y-auto">
          {menu.map(m=>(
            <button key={m.id} onClick={()=>{ setPage(m.id); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 text-right p-3 rounded-xl text-sm transition ${page===m.id ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'hover:bg-white/5 text-slate-300'}`}>
              <m.icon size={18}/> {m.label}
            </button>
          ))}
        </nav>
        <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-2 text-red-400 p-3 text-sm hover:bg-red-500/10 rounded-xl"><LogOut size={18}/> تسجيل خروج</button>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-white/10 bg-[#0a1028]/50 backdrop-blur-xl flex items-center justify-between px-4">
          <button onClick={()=>setSidebarOpen(true)} className="lg:hidden text-white"><Menu size={20}/></button>
          <div className="text-sm text-slate-400 hidden lg:block">نظام ادارة زراعة الاسنان - تنظيم المواعيد والمتابعات والجراحات</div>
          <div className="flex items-center gap-3"><Bell size={18} className="text-slate-400"/><div className="h-8 w-8 rounded-full bg-blue-500/20 text-blue-300 grid place-items-center text-xs font-bold">م</div></div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {page==='dashboard' && <Dashboard setPage={setPage} />}
          {page==='patients' && <Patients setPage={setPage} setEditItem={setEditItem} setSelectedPatient={setSelectedPatient} />}
          {page==='patient-new' && <PatientForm patient={editItem} onSave={()=>setPage('patients')} onCancel={()=>setPage('patients')} />}
          {page==='patient-detail' && selectedPatient && <PatientDetail patient={selectedPatient} onBack={()=>setPage('patients')} setPage={setPage} setEditItem={setEditItem} />}
          {page==='appointments' && <Appointments setPage={setPage} />}
          {page==='appointment-new' && <AppointmentForm onSave={()=>setPage('appointments')} onCancel={()=>setPage('appointments')} />}
          {page==='treatments' && <Treatments setPage={setPage} setSelectedPatient={setSelectedPatient} />}
          {page==='treatment-new' && <TreatmentForm onSave={()=>setPage('treatments')} onCancel={()=>setPage('treatments')} />}
          {page==='surgeries' && <Surgeries setPage={setPage} setSelectedPatient={setSelectedPatient} />}
          {page==='surgery-new' && <SurgeryForm onSave={()=>setPage('surgeries')} onCancel={()=>setPage('surgeries')} />}
          {page==='implants' && <Implants />}
          {page==='reports' && <Reports />}
          {page==='settings' && <div className={card}><h2 className="text-white font-bold mb-4">الاعدادات</h2><p className="text-slate-400 text-sm">البريد: mustafa781075016@gmail.com</p><p className="text-slate-500 text-xs mt-2">Zircon OS V2 - عيادة زراعة الاسنان</p></div>}
        </main>
      </div>
    </div>
  );
}
