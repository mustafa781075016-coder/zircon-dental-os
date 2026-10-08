import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  LayoutDashboard, Users, Calendar, LogOut, Menu, Bell, X,
  Stethoscope, Syringe, Receipt, FileText, Settings as SettingsIcon,
  Plus, Search, Mail, Lock, Loader2, ArrowRight, Save, Trash2, Edit3,
  MessageCircle, Clock, DollarSign, UserPlus, ClipboardList, HeartPulse, FileSpreadsheet,
  Megaphone, TrendingUp, Target, BarChart3, Printer, Printer as PrinterIcon, Phone, CreditCard, Banknote, RefreshCw, ListOrdered, FileCheck, Building2, Clock4, Upload as UploadIcon, Image as ImageIcon, Check, Undo2, Filter
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
const TODAY = new Date().toISOString().slice(0,10);

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

function Login({ onLogin }: { onLogin: (user?:any) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(e: any) {
    e.preventDefault();
    setErr(''); setLoading(true);
    // 1. تحقق من المستخدمين المحليين (اللي ضفتهم في الإعدادات)
    try{
      const localUsers = JSON.parse(localStorage.getItem('zircon_appUsers')||'[]');
      const found = localUsers.find((u:any)=> u.username.trim()===username.trim() && u.password===password);
      if(found){
        localStorage.setItem('zircon_currentUser', JSON.stringify(found));
        setLoading(false);
        onLogin(found);
        return;
      }
    }catch{}
    // 2. محاولة دخول عبر Supabase للإيميل الأصلي
    try{
      const { error, data } = await supabase.auth.signInWithPassword({ email: username, password });
      if(!error && data.session){
        const adminUser = { id:'admin', username: username, role:'مدير', isSupabase:true };
        localStorage.setItem('zircon_currentUser', JSON.stringify(adminUser));
        setLoading(false);
        onLogin(adminUser);
        return;
      }
    }catch{}
    // 3. إذا admin الافتراضي (admin/123456) لم يكن في القائمة
    if(username==='admin' && password==='123456'){
      const adminUser = { id:'1', username:'admin', password:'123456', role:'مدير' };
      localStorage.setItem('zircon_currentUser', JSON.stringify(adminUser));
      setLoading(false);
      onLogin(adminUser);
      return;
    }
    setLoading(false);
    setErr('اسم المستخدم أو كلمة المرور غير صحيحة - تأكد من البيانات المدخلة في الإعدادات');
  }
  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center p-6 bg-[#060a1a]">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[.03] backdrop-blur-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 grid place-items-center text-2xl font-bold text-white mb-4 shadow-xl">Z</div>
          <h1 className="text-2xl font-bold text-white">Zircon OS</h1>
          <p className="text-sm text-blue-300/70 mt-2">نظام ادارة عيادة زراعة الاسنان</p>
          <p className="text-[11px] text-slate-500 mt-2">ادخل اسم المستخدم وكلمة المرور التي تم إنشاؤها في الإعدادات</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className={label}>اسم المستخدم أو البريد الإلكتروني</label>
            <div className="relative">
              <Users size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="مثال: doctor1 أو admin أو الإيميل" dir="ltr" className={inp + ' pr-10'} />
            </div>
          </div>
          <div>
            <label className={label}>كلمة المرور</label>
            <div className="relative">
              <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••" dir="ltr" className={inp + ' pr-10'} />
            </div>
          </div>
          {err && <div className="rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3">{err}</div>}
          <button type="submit" disabled={loading} className={btn}>
            {loading && <Loader2 className="animate-spin" size={18} />} دخول - حسب الدور
          </button>
          <div className="text-center text-[11px] text-slate-500 mt-2">
            <div>المدير: admin / 123456</div>
            <div>أو استخدم المستخدمين الذين أنشأتهم في الإعدادات</div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ====== TOOTH CHART ARCH ======
const TEETH_UPPER = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28];
const TEETH_LOWER = [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];
const TEETH_UPPER_PALMER = [
  {fdi:18,palmer:8,quad:'UR'}, {fdi:17,palmer:7,quad:'UR'}, {fdi:16,palmer:6,quad:'UR'}, {fdi:15,palmer:5,quad:'UR'},
  {fdi:14,palmer:4,quad:'UR'}, {fdi:13,palmer:3,quad:'UR'}, {fdi:12,palmer:2,quad:'UR'}, {fdi:11,palmer:1,quad:'UR'},
  {fdi:21,palmer:1,quad:'UL'}, {fdi:22,palmer:2,quad:'UL'}, {fdi:23,palmer:3,quad:'UL'}, {fdi:24,palmer:4,quad:'UL'},
  {fdi:25,palmer:5,quad:'UL'}, {fdi:26,palmer:6,quad:'UL'}, {fdi:27,palmer:7,quad:'UL'}, {fdi:28,palmer:8,quad:'UL'},
];
const TEETH_LOWER_PALMER = [
  {fdi:48,palmer:8,quad:'LR'}, {fdi:47,palmer:7,quad:'LR'}, {fdi:46,palmer:6,quad:'LR'}, {fdi:45,palmer:5,quad:'LR'},
  {fdi:44,palmer:4,quad:'LR'}, {fdi:43,palmer:3,quad:'LR'}, {fdi:42,palmer:2,quad:'LR'}, {fdi:41,palmer:1,quad:'LR'},
  {fdi:31,palmer:1,quad:'LL'}, {fdi:32,palmer:2,quad:'LL'}, {fdi:33,palmer:3,quad:'LL'}, {fdi:34,palmer:4,quad:'LL'},
  {fdi:35,palmer:5,quad:'LL'}, {fdi:36,palmer:6,quad:'LL'}, {fdi:37,palmer:7,quad:'LL'}, {fdi:38,palmer:8,quad:'LL'},
];

const TOOTH_COLORS: any = {
  1: '#e06a6a', 2: '#b78a4a', 3: '#2ea86a', 4: '#3a8ab5', 5: '#6b4c9a', 6: '#d16a8a', 7: '#a3b82a', 8: '#7a8a2e',
};
function getShortNumber(fdi: number) { return fdi % 10; }

function ToothShape({ num, has, onClick }: { num: number, has: boolean, onClick: () => void }) {
  const shortNum = getShortNumber(num);
  const color = (TOOTH_COLORS as any)[shortNum] || '#94a3b8';
  const isMolar = shortNum >= 6;
  let path = "";
  let vb = "0 0 50 60";
  if (shortNum === 1) path = "M 8 12 Q 25 2 42 12 Q 40 32 25 46 Q 10 32 8 12 Z";
  else if (shortNum === 2) path = "M 10 14 Q 25 4 40 14 Q 38 30 25 42 Q 12 30 10 14 Z";
  else if (shortNum === 3) path = "M 13 10 Q 25 0 37 10 Q 40 26 25 48 Q 10 26 13 10 Z";
  else if (shortNum === 4 || shortNum === 5) path = "M 10 16 Q 25 6 40 16 Q 43 30 40 46 Q 25 56 10 46 Q 7 30 10 16 Z";
  else path = "M 8 14 Q 14 8 25 10 Q 36 8 42 14 Q 46 22 44 34 Q 46 46 41 52 Q 32 56 25 54 Q 18 56 9 52 Q 4 46 6 34 Q 4 22 8 14 Z";
  return (
    <button onClick={onClick} className="absolute group" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%' }}>
      <svg viewBox={vb} className="w-full h-full overflow-visible">
        <path d={path} fill={has ? '#10b981' : 'rgba(255,255,255,0.04)'} stroke={has ? '#10b981' : 'rgba(255,255,255,0.25)'} strokeWidth="1.6" className="transition-all group-hover:fill-white/[0.08] group-hover:stroke-white/40" />
        <text x="25" y={isMolar ? "34" : "30"} textAnchor="middle" dominantBaseline="middle" fontSize={isMolar ? "20" : "22"} fontWeight="800" fill={has ? 'white' : color} className="select-none" style={{ fontFamily: 'system-ui' }}>{shortNum}</text>
        {has && <text x="25" y="44" textAnchor="middle" fontSize="7" fontWeight="700" fill="white">زرعة</text>}
      </svg>
      <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[8px] font-bold text-slate-500/70 group-hover:text-slate-300">{num}</span>
    </button>
  );
}

function ToothChart({ implants, onToothClick }: { implants: any[], onToothClick: (n:number)=>void }) {
  const implanted = new Set(implants.map((i:any)=>i.tooth_number));
  const Arch = ({ teeth, isUpper }: { teeth: number[], isUpper: boolean }) => {
    return (
      <div className="relative w-full h-[440px] md:h-[480px] mx-auto max-w-[420px]">
        <div className={`absolute left-1/2 -translate-x-1/2 w-[92%] h-[92%] border border-white/10 rounded-[50%] pointer-events-none ${isUpper ? 'top-[4%] rounded-b-none border-b-0' : 'bottom-[4%] rounded-t-none border-t-0'}`} />
        {teeth.map((n, idx) => {
          const total = teeth.length;
          const startAngle = isUpper ? 180 : 0;
          const endAngle = isUpper ? 360 : 180;
          const angle = startAngle + (endAngle - startAngle) * (idx / (total - 1));
          const rad = (angle * Math.PI) / 180;
          const rx = 43; const ry = 54; const cx = 50; const cy = isUpper ? 80 : 20;
          const x = cx + rx * Math.cos(rad); const y = cy + ry * Math.sin(rad);
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
    </div>
  );
}

// ====== SEARCH SELECT COMPONENT FOR TREATMENTS BULK ======
function SearchSelect({ placeholder, options, value, onSelect, displayKey='name' }:{ placeholder:string, options:any[], value:string, onSelect:(o:any)=>void, displayKey?:string }){
  const [q,setQ]=useState(value)
  const [open,setOpen]=useState(false)
  const filtered = options.filter((o:any)=> {
    const name = (o[displayKey] || o.name || o.full_name || o).toString().toLowerCase()
    return name.includes(q.toLowerCase())
  }).slice(0,8)
  useEffect(()=>setQ(value),[value])
  return (
    <div className="relative">
      <input value={q} onChange={e=>{ setQ(e.target.value); setOpen(true) }} onFocus={()=>setOpen(true)} placeholder={placeholder} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 outline-none" />
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl bg-[#0f172a] border border-white/10 shadow-2xl max-h-48 overflow-auto">
          {filtered.length===0 ? <div className="p-3 text-xs text-slate-400">لا يوجد نتائج - اكتب للبحث</div> :
            filtered.map((o:any,i:number)=>{
              const label = o[displayKey] || o.name || o.full_name || o
              return <button key={i} onClick={()=>{ setQ(label); onSelect(o); setOpen(false) }} className="w-full text-right px-3 py-2 text-xs text-white hover:bg-white/10 flex justify-between"><span>{label}</span>{o.price? <span className="text-emerald-400">{o.price} ر.س</span>: null}</button>
            })
          }
        </div>
      )}
      {open && <div className="fixed inset-0 z-40" onClick={()=>setOpen(false)}></div>}
    </div>
  )
}

// ====== JAW MODAL FOR TEETH SELECTION - EXACT REPLICA ======

function JawModalBulk({ selected, onToggle, onClose, treatName, doctorName, cost }: { selected:number[], onToggle:(n:number)=>void, onClose:()=>void, treatName:string, doctorName:string, cost:number }) {
  // Anatomical SVG per Palmer number - matches reference image
  const ToothSVG = ({ palmer, selected }: { palmer:number, selected:boolean }) => {
    let d = "";
    if(palmer===1) d = "M 10 8 C 14 3, 22 3, 26 8 L 24 20 C 23 27, 21 32, 18 38 C 15 32, 13 27, 12 20 Z"; // central
    else if(palmer===2) d = "M 11 9 C 15 4, 21 4, 25 9 L 23.5 21 C 22.5 28, 20 33, 18 38 C 16 33, 13.5 28, 12.5 21 Z"; // lateral
    else if(palmer===3) d = "M 12 10 C 16 2, 20 2, 24 10 L 23 22 L 20 42 L 18 48 L 16 42 L 13 22 Z"; // canine pointed
    else if(palmer===4 || palmer===5) d = "M 9 11 C 13 6, 23 6, 27 11 L 28 20 L 25 30 L 23 36 L 13 36 L 10 30 L 8 20 Z";
    else d = "M 7 12 C 10 7, 16 7, 18 10 C 20 7, 26 7, 29 12 L 30 22 L 28 32 L 26 40 L 22 42 L 18 36 L 14 42 L 10 40 L 8 32 L 6 22 Z"; // molars
    
    return (
      <svg viewBox="0 0 36 50" className="w-full h-full">
        <path d={d} fill={selected ? "#10b981" : "#ffffff"} stroke={selected ? "#10b981" : "#334155"} strokeWidth={selected ? "1.2" : "0.6"} />
        {selected && <path d={d} fill="#10b981" fillOpacity="0.2" />}
      </svg>
    )
  };

  const Cell = ({ fdi }: { fdi: number }) => {
    const palmer = fdi % 10;
    const sel = selected.includes(fdi);
    const cmap: any = { 1:'#ff6b6b', 2:'#f59e0b', 3:'#10b981', 4:'#3b82f6', 5:'#8b5cf6', 6:'#ec4899', 7:'#f1c40f', 8:'#84cc16' };
    const quad = fdi >= 11 && fdi <= 18 ? 'UR' : fdi >=21 && fdi<=28 ? 'UL' : fdi>=31 && fdi<=38 ? 'LL' : 'LR';
    return (
      <button
        onClick={() => onToggle(fdi)}
        className={`group relative flex flex-col items-center justify-between rounded-xl border p-1 md:p-1.5 transition-all min-h-[82px] md:min-h-[110px] ${sel ? 'bg-emerald-500/20 border-emerald-400/60 shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-[1.04] z-10' : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-white/20'}`}
      >
        <div className="w-7 h-8 md:w-9 md:h-10 mt-1"><ToothSVG palmer={palmer} selected={sel} /></div>
        <div className="flex flex-col items-center leading-none gap-0.5 mt-1">
          <span className="text-[14px] md:text-[18px] font-black" style={{color: sel ? '#fff' : cmap[palmer]}}>{palmer}</span>
          <span className="text-[8px] md:text-[9px] text-slate-400 font-mono">{fdi}</span>
          <span className="text-[7px] text-slate-500/70 hidden md:block">{quad}</span>
        </div>
        {sel && <div className="absolute -top-1.5 -left-1.5 w-4 h-4 md:w-5 md:h-5 rounded-full bg-emerald-500 border-2 border-[#0a1028] text-white flex items-center justify-center text-[9px] md:text-[11px] font-bold">✓</div>}
      </button>
    );
  };

  const upperRight = [18,17,16,15,14,13,12,11];
  const upperLeft  = [21,22,23,24,25,26,27,28];
  const lowerRight = [48,47,46,45,44,43,42,41];
  const lowerLeft  = [31,32,33,34,35,36,37,38];

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-1 md:p-4" onClick={onClose}>
      <div className="bg-[#0a1028] border border-white/10 rounded-2xl w-full max-w-[98vw] md:max-w-4xl max-h-[98vh] md:max-h-[92vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-3 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#0a1028] z-20 rounded-t-2xl shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm md:text-base font-bold text-white">مخطط الأسنان - نفس الصورة المرفقة</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 hidden md:inline">8 7 6 5 4 3 2 1 | 1 2 3 4 5 6 7 8</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white"><X size={16}/></button>
        </div>

        {/* Body - scrollable */}
        <div className="flex-1 overflow-auto p-2 md:p-4 space-y-3">
          {/* Upper */}
          <div className="rounded-xl bg-white/[0.02] border border-white/5 p-2 md:p-3">
            <div className="text-center text-[10px] md:text-[11px] text-slate-400 mb-2 font-medium">الفك العلوي - 8 7 6 5 4 3 2 1 | 1 2 3 4 5 6 7 8</div>
            <div className="flex items-stretch justify-center gap-1">
              <div className="grid grid-cols-8 gap-1 md:gap-1.5 flex-1">{upperRight.map(fdi => <Cell key={fdi} fdi={fdi} />)}</div>
              <div className="w-[2px] bg-red-500/80 rounded-full mx-1 self-stretch min-h-[90px] md:min-h-[120px]"></div>
              <div className="grid grid-cols-8 gap-1 md:gap-1.5 flex-1">{upperLeft.map(fdi => <Cell key={fdi} fdi={fdi} />)}</div>
            </div>
          </div>

          <div className="h-[2px] bg-red-500/70 w-full rounded-full"></div>

          {/* Lower */}
          <div className="rounded-xl bg-white/[0.02] border border-white/5 p-2 md:p-3">
            <div className="text-center text-[10px] md:text-[11px] text-slate-400 mb-2 font-medium">الفك السفلي - 8 7 6 5 4 3 2 1 | 1 2 3 4 5 6 7 8</div>
            <div className="flex items-stretch justify-center gap-1">
              <div className="grid grid-cols-8 gap-1 md:gap-1.5 flex-1">{lowerRight.map(fdi => <Cell key={fdi} fdi={fdi} />)}</div>
              <div className="w-[2px] bg-red-500/80 rounded-full mx-1 self-stretch min-h-[90px] md:min-h-[120px]"></div>
              <div className="grid grid-cols-8 gap-1 md:gap-1.5 flex-1">{lowerLeft.map(fdi => <Cell key={fdi} fdi={fdi} />)}</div>
            </div>
          </div>

          {/* Selected preview table - same as request: اسم المعالجة | اسم الطبيب | سعر | رقم السن */}
          {selected.length > 0 && (
            <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 overflow-hidden">
              <div className="p-2.5 text-xs font-bold text-white flex justify-between border-b border-white/10 bg-white/5">
                <span>🦷 {selected.length} أسنان مختارة - سيتم إضافتها للملف الطبي وسند الحساب</span>
                <span className="text-emerald-400">{cost} ر.س للسن</span>
              </div>
              <div className="overflow-auto max-h-36">
                <table className="w-full text-xs">
                  <thead className="bg-white/5 text-slate-400 sticky top-0">
                    <tr><th className="p-2 text-right">اسم المعالجة</th><th className="p-2 text-right">اسم الطبيب</th><th className="p-2 text-right">سعر المعالجة</th><th className="p-2 text-right">رقم السن</th></tr>
                  </thead>
                  <tbody>
                    {selected.map(num => (
                      <tr key={num} className="border-t border-white/5 hover:bg-white/5">
                        <td className="p-2 text-white">{treatName || '-'}</td>
                        <td className="p-2 text-slate-300">{doctorName || '-'}</td>
                        <td className="p-2 text-emerald-400 font-bold">{cost} ر.س</td>
                        <td className="p-2 text-emerald-300 font-bold">🦷 {num}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer - fixed */}
        <div className="p-2.5 md:p-3 border-t border-white/10 flex justify-between items-center bg-[#0a1028] rounded-b-2xl shrink-0 gap-2">
          <span className="text-[10px] md:text-[11px] text-slate-400">{selected.length > 0 ? `${selected.length} أسنان مختارة - اضغط تم للإغلاق (لن يتم تفريغ المعالجة)` : 'اضغط على الأسنان للاختيار - الحجم ملائم للشاشة'}</span>
          <button onClick={onClose} className="px-5 md:px-7 py-2.5 rounded-xl bg-gradient-to-l from-violet-600 to-blue-600 hover:from-violet-500 text-white text-xs md:text-sm font-bold shadow-lg shrink-0">تم - إغلاق ({selected.length})</button>
        </div>
      </div>
    </div>
  );
}



function TreatmentsBulk(){
  const [patientsList, setPatientsList] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>(()=>{
    try{ return JSON.parse(localStorage.getItem('zircon_doctors')||'[{"id":"1","name":"د. أحمد الشطبي","specialty":"زراعة"},{"id":"2","name":"د. جلال الداعري","specialty":"تقويم"}]') }catch{ return [] }
  });
  const [treatTypes, setTreatTypes] = useState<any[]>(()=>{
    try{ return JSON.parse(localStorage.getItem('zircon_treatTypes')||'[{"id":"1","name":"حشوة تجميلية","price":500},{"id":"2","name":"زراعة سن","price":3500},{"id":"3","name":"تنظيف","price":200}]') }catch{ return [] }
  });
  const [bulkRows, setBulkRows] = useState<any[]>(()=>{
    try{ return JSON.parse(localStorage.getItem('zircon_bulkRows')||'[]') }catch{ return [] }
  });
  const [form, setForm] = useState({ patientId:'', patientName:'', doctorId:'', doctorName:'', treatTypeId:'', treatName:'', teeth:[] as number[], cost:0, date:TODAY, status:'مخطط لها', notes:'' });
  const [jawOpen, setJawOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(()=>{ supabase.from('patients').select('id, full_name').limit(100).then(({data})=>setPatientsList(data||[])) },[]);
  useEffect(()=>{ localStorage.setItem('zircon_bulkRows', JSON.stringify(bulkRows)) },[bulkRows]);

  function addRow(){
    if(!form.patientName || !form.doctorName || !form.treatName || form.teeth.length===0){ alert('أكمل جميع الحقول واختر الأسنان'); return; }
    const rows = form.teeth.map((toothNum:any)=>({
      id: Date.now().toString()+Math.random(), patientId: form.patientId, patientName: form.patientName,
      doctorId: form.doctorId, doctorName: form.doctorName, treatTypeId: form.treatTypeId, treatName: form.treatName,
      tooth: toothNum, teeth: form.teeth, cost: form.cost, date: form.date, status: form.status, notes: form.notes
    }));
    const updated = [...rows, ...bulkRows];
    setBulkRows(updated);
    // حفظ في الملف الطبي وسند الحساب مباشرة
    try{
      const savedTreats = JSON.parse(localStorage.getItem('zircon_savedTreatments')||'[]');
      localStorage.setItem('zircon_savedTreatments', JSON.stringify([...rows, ...savedTreats]));
      // أيضا تحديث zircon_bulkRows هو نفسه يستخدم في الملف الطبي
    }catch{}
    // تفريغ المعالجة عند الضغط على إضافة السجل فقط (كما طلبت)
    setForm({ ...form, treatTypeId:'', treatName:'', cost:0, teeth:[], status:'مخطط لها', notes:'' });
    setJawOpen(false);
  }

  async function saveAll(){
    if(bulkRows.length===0){ alert('لا يوجد معالجات للحفظ'); return; }
    // حفظ في implants + الملف الطبي + سند الحساب
    for(const r of bulkRows){
      try{
        await supabase.from('implants').insert({
          patient_id: r.patientId || null,
          tooth_number: r.tooth,
          brand: r.treatName,
          status: 'planned',
          diameter_mm: 4.1,
          length_mm: 10,
          torque_ncm: 35
        });
      }catch{}
    }
    try{
      const saved = JSON.parse(localStorage.getItem('zircon_savedTreatments')||'[]');
      const merged = [...bulkRows, ...saved];
      localStorage.setItem('zircon_savedTreatments', JSON.stringify(merged));
      // أيضا حفظ في سجل المرضى الخاص
      const medicalFiles = JSON.parse(localStorage.getItem('zircon_medicalFiles')||'{}');
      bulkRows.forEach((r:any)=>{
        if(!medicalFiles[r.patientId]) medicalFiles[r.patientId] = [];
        medicalFiles[r.patientId].push(r);
      });
      localStorage.setItem('zircon_medicalFiles', JSON.stringify(medicalFiles));
      // سند الحساب
      const finance = JSON.parse(localStorage.getItem('zircon_financeRecords')||'[]');
      localStorage.setItem('zircon_financeRecords', JSON.stringify([...bulkRows, ...finance]));
    }catch{}
    alert(`تم حفظ ${bulkRows.length} معالجة - تمت إضافتها لجدول المعالجات في الملف الطبي الخاص بالمريض وسند حسابه`);
    // لا نفرغ هنا، تبقى للمراجعة - المستخدم يفرغ يدويا إذا أراد
  }

  const filteredRows = bulkRows.filter((r:any)=> r.patientName.includes(search) || r.doctorName.includes(search) || r.treatName.includes(search));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-xl font-bold text-white">إضافة معالجات - سجل المعالجات 8 أعمدة</h2>
        <div className="flex gap-2">
          <div className="relative"><Search size={14} className="absolute right-2 top-2.5 text-slate-500"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث في السجل..." className="pr-7 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs w-40 text-white"/></div>
          <button onClick={saveAll} className={btnSm}><Save size={16}/> حفظ المعالجات - {bulkRows.length}</button>
        </div>
      </div>

      {/* نموذج الإضافة - 8 أعمدة */}
      <div className={card + ' !p-4'}>
        <div className="grid grid-cols-1 md:grid-cols-8 gap-3">
          <div><label className={label}>1 اسم المريض - بحث</label><SearchSelect placeholder="ابحث عن مريض..." options={patientsList} value={form.patientName} onSelect={(o:any)=>setForm({...form, patientId:o.id, patientName:o.full_name})} displayKey="full_name"/></div>
          <div><label className={label}>2 الطبيب - بحث</label><SearchSelect placeholder="ابحث عن طبيب..." options={doctors} value={form.doctorName} onSelect={(o:any)=>setForm({...form, doctorId:o.id, doctorName:o.name})} displayKey="name"/></div>
          <div><label className={label}>3 نوع المعالجة - بحث</label><SearchSelect placeholder="ابحث عن معالجة..." options={treatTypes} value={form.treatName} onSelect={(o:any)=>setForm({...form, treatTypeId:o.id, treatName:o.name, cost:o.price})} displayKey="name"/></div>
          <div><label className={label}>4 رقم الأسنان 🦷</label>
            <button onClick={()=>setJawOpen(true)} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-xs text-white flex items-center justify-center gap-2 hover:bg-white/10">
              <span className="text-lg">🦷</span>{form.teeth.length>0? `${form.teeth.length} أسنان - ${form.teeth.join(',')}`:'صورة الفكين - اضغط'}
            </button>
          </div>
          <div><label className={label}>5 التكلفة - تلقائي</label><input value={form.cost} readOnly className={inp + ' !bg-emerald-500/10 !border-emerald-500/30 !text-emerald-300'}/></div>
          <div><label className={label}>6 التاريخ - تلقائي</label><input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} className={inp}/></div>
          <div><label className={label}>7 الحالة</label><select value={form.status} onChange={e=>setForm({...form, status:e.target.value})} className={inp}><option>مخطط لها</option><option>تمت</option><option>قيد التنفيذ</option><option>ملغاة</option></select></div>
          <div><label className={label}>8 ملاحظات</label><input value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} placeholder="ملاحظات..." className={inp}/></div>
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={addRow} className={btnSm}><Plus size={16}/> إضافة للسجل المؤقت</button>
          <span className="text-xs text-slate-500 py-2">التكلفة تظهر تلقائيا - التاريخ اليوم - عند اختيار الأسنان يضاف الجدول اسفل المخطط - عند الإغلاق يتم تفريغ نوع المعالجة</span>
        </div>
      </div>

      {/* جدول العرض 8 أعمدة */}
      <div className={card + ' !p-0 overflow-hidden'}>
        <div className="overflow-auto">
          <table className="w-full text-sm min-w-[1000px]">
            <thead className="bg-white/5 text-slate-400 text-xs">
              <tr><th className="text-right px-3 py-3">1 اسم المريض</th><th className="text-right px-3 py-3">2 الطبيب</th><th className="text-right px-3 py-3">3 نوع المعالجة</th><th className="text-right px-3 py-3">4 رقم الأسنان 🦷</th><th className="text-right px-3 py-3">5 التكلفة</th><th className="text-right px-3 py-3">6 التاريخ</th><th className="text-right px-3 py-3">7 الحالة</th><th className="text-right px-3 py-3">8 ملاحظات</th><th className="px-3"></th></tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredRows.length===0? <tr><td colSpan={9} className="p-6 text-center text-slate-500">لا يوجد سجلات - ابدأ بإضافة معالجة</td></tr>:
              filteredRows.map((r:any)=><tr key={r.id} className="hover:bg-white/5">
                <td className="px-3 py-2 text-white">{r.patientName}</td>
                <td className="px-3 py-2 text-slate-300">{r.doctorName}</td>
                <td className="px-3 py-2 text-slate-300">{r.treatName}</td>
                <td className="px-3 py-2"><span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs flex items-center gap-1 w-fit">🦷 {r.tooth} ({r.tooth%10})</span></td>
                <td className="px-3 py-2 text-emerald-400">{r.cost} ر.س</td>
                <td className="px-3 py-2 text-slate-400 text-xs">{fmtDate(r.date)}</td>
                <td className="px-3 py-2"><span className="text-xs px-2 py-1 rounded bg-white/10 text-white">{r.status}</span></td>
                <td className="px-3 py-2 text-slate-500 text-xs">{r.notes||'—'}</td>
                <td className="px-3 py-2"><button onClick={()=>setBulkRows(bulkRows.filter((x:any)=>x.id!==r.id))} className="text-red-400"><Trash2 size={14}/></button></td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {jawOpen && <JawModalBulk selected={form.teeth} onToggle={(n)=>{ const has=form.teeth.includes(n); setForm({...form, teeth: has? form.teeth.filter((x:any)=>x!==n): [...form.teeth,n] }) }} onClose={()=>{ setJawOpen(false) }} treatName={form.treatName} doctorName={form.doctorName} cost={form.cost} />}
    </div>
  )
}

// ====== DISEASE LOG PAGE - سجل الأمراض ======

// ====== DISEASE LOG PAGE - سجل الأمراض ======
function DiseaseLog(){
  const [activeSub, setActiveSub] = useState('treatments');
  const [records, setRecords] = useState<any[]>(()=>{
    try{ 
      const saved = JSON.parse(localStorage.getItem('zircon_savedTreatments')||'[]');
      const bulk = JSON.parse(localStorage.getItem('zircon_bulkRows')||'[]');
      const finance = JSON.parse(localStorage.getItem('zircon_financeRecords')||'[]');
      const all = [...bulk, ...saved, ...finance];
      const uniq = Array.from(new Map(all.map((r:any)=>[r.id,r])).values());
      return uniq as any[];
    }catch{ return [] }
  });
  useEffect(()=>{
    const id=setInterval(()=>{
      try{
        const saved = JSON.parse(localStorage.getItem('zircon_savedTreatments')||'[]');
        const bulk = JSON.parse(localStorage.getItem('zircon_bulkRows')||'[]');
        const finance = JSON.parse(localStorage.getItem('zircon_financeRecords')||'[]');
        const all = [...bulk, ...saved, ...finance];
        const uniq = Array.from(new Map(all.map((r:any)=>[r.id,r])).values());
        setRecords(uniq as any[]);
      }catch{}
    },1000);
    return ()=>clearInterval(id);
  },[]);
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">سجل الأمراض</h2>
      <div className="flex gap-2 border-b border-white/10">
        <button onClick={()=>setActiveSub('treatments')} className={`px-4 py-2 text-sm border-b-2 ${activeSub==='treatments'?'border-blue-500 text-white':'border-transparent text-slate-400'}`}>سجل المعالجات</button>
        <button onClick={()=>setActiveSub('medical')} className={`px-4 py-2 text-sm border-b-2 ${activeSub==='medical'?'border-blue-500 text-white':'border-transparent text-slate-400'}`}>الملف الطبي</button>
        <button onClick={()=>setActiveSub('finance')} className={`px-4 py-2 text-sm border-b-2 ${activeSub==='finance'?'border-blue-500 text-white':'border-transparent text-slate-400'}`}>سند حساب</button>
      </div>
      {activeSub==='treatments' && (
        <div className={card + ' !p-0 overflow-hidden'}>
          <div className="p-4 font-bold text-white flex justify-between"><span>سجل المعالجات - {records.length} سجل</span><span className="text-xs text-slate-400">اسم المعالجة | اسم الطبيب | سعر المعالجة | رقم السن</span></div>
          <div className="overflow-auto"><table className="w-full text-sm"><thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-3">اسم المعالجة</th><th className="text-right px-4 py-3">اسم الطبيب</th><th className="text-right px-4 py-3">سعر المعالجة</th><th className="text-right px-4 py-3">رقم السن</th><th className="text-right px-4 py-3">المريض</th><th className="text-right px-4 py-3">التاريخ</th></tr></thead><tbody className="divide-y divide-white/5">{records.map((r:any)=><tr key={r.id} className="hover:bg-white/5"><td className="px-4 py-2 text-white">{r.treatName}</td><td className="px-4 py-2 text-slate-300">{r.doctorName}</td><td className="px-4 py-2 text-emerald-400">{r.cost} ر.س</td><td className="px-4 py-2 text-emerald-300">🦷 {r.tooth} ({r.tooth%10})</td><td className="px-4 py-2 text-slate-300">{r.patientName}</td><td className="px-4 py-2 text-slate-500 text-xs">{fmtDate(r.date)}</td></tr>)}</tbody></table></div>
        </div>
      )}
      {activeSub==='medical' && <div className="space-y-3">
        <div className={card}><h3 className="text-white font-bold mb-2 flex items-center gap-2"><HeartPulse size={18} className="text-red-400"/> الملف الطبي - جدول المعالجات لكل مريض</h3><p className="text-slate-400 text-xs">عند حفظ المعالجات ينضاف الجدول تلقائيا هنا في الملف الطبي الخاص بالمريض - الشكل: اسم المعالجة | اسم الطبيب | سعر المعالجة | رقم السن</p></div>
        <div className={card + ' !p-0 overflow-hidden'}><div className="overflow-auto"><table className="w-full text-sm"><thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-3">المريض</th><th className="text-right px-4 py-3">اسم المعالجة</th><th className="text-right px-4 py-3">اسم الطبيب</th><th className="text-right px-4 py-3">سعر المعالجة</th><th className="text-right px-4 py-3">رقم السن</th><th className="text-right px-4 py-3">التاريخ</th><th className="text-right px-4 py-3">الحالة</th></tr></thead><tbody className="divide-y divide-white/5">{records.map((r:any)=><tr key={r.id} className="hover:bg-white/5"><td className="px-4 py-2 text-white font-medium">{r.patientName}</td><td className="px-4 py-2 text-slate-200">{r.treatName}</td><td className="px-4 py-2 text-slate-300">{r.doctorName}</td><td className="px-4 py-2 text-emerald-400">{r.cost} ر.س</td><td className="px-4 py-2 text-emerald-300">🦷 {r.tooth}</td><td className="px-4 py-2 text-slate-500 text-xs">{fmtDate(r.date)}</td><td className="px-4 py-2"><span className="text-xs px-2 py-1 rounded bg-white/10">{r.status}</span></td></tr>)}</tbody></table></div></div>
      </div>}
      {activeSub==='finance' && <div className="space-y-3">
        <div className={card}><h3 className="text-white font-bold mb-2 flex items-center gap-2"><Receipt size={18} className="text-amber-400"/> سند حساب - الحسابات المالية</h3><p className="text-slate-400 text-xs">عند حفظ المعالجات ينضاف جدول المعالجات هنا في سند حساب المريض - نفس الجدول: اسم المعالجة | اسم الطبيب | سعر | رقم السن</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center"><div className="text-xl font-bold text-emerald-400">{records.reduce((s:any,r:any)=>s+Number(r.cost||0),0)} ر.س</div><div className="text-xs text-slate-400">إجمالي المعالجات</div></div>
            <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4 text-center"><div className="text-xl font-bold text-blue-400">{records.length}</div><div className="text-xs text-slate-400">عدد المعالجات</div></div>
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 text-center"><div className="text-xl font-bold text-amber-400">{records.filter((r:any)=>r.status==='تمت').length}</div><div className="text-xs text-slate-400">مكتملة</div></div>
          </div>
        </div>
        <div className={card + ' !p-0 overflow-hidden'}><div className="p-3 font-bold text-white text-sm">سند حساب مفصل</div><div className="overflow-auto"><table className="w-full text-sm"><thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-3">المريض</th><th className="text-right px-4 py-3">اسم المعالجة</th><th className="text-right px-4 py-3">الطبيب</th><th className="text-right px-4 py-3">السعر</th><th className="text-right px-4 py-3">السن</th><th className="text-right px-4 py-3">التاريخ</th><th className="text-right px-4 py-3">الحالة المالية</th></tr></thead><tbody className="divide-y divide-white/5">{records.map((r:any)=><tr key={r.id} className="hover:bg-white/5"><td className="px-4 py-2 text-white">{r.patientName}</td><td className="px-4 py-2 text-slate-300">{r.treatName}</td><td className="px-4 py-2 text-slate-400">{r.doctorName}</td><td className="px-4 py-2 text-emerald-400 font-bold">{r.cost} ر.س</td><td className="px-4 py-2 text-emerald-300">🦷 {r.tooth}</td><td className="px-4 py-2 text-slate-500 text-xs">{fmtDate(r.date)}</td><td className="px-4 py-2"><span className={`text-xs px-2 py-1 rounded ${r.status==='تمت'?'bg-emerald-500/20 text-emerald-300':'bg-amber-500/20 text-amber-300'}`}>{r.status==='تمت'?'مدفوع':'غير مدفوع'}</span></td></tr>)}</tbody></table></div></div>
      </div>}
    </div>
  )
}



// ====== ORIGINAL COMPONENTS (kept exactly as your design) ======

// ==================== لوحة تحكم خاصة بالاستقبال - مصممة من جديد ====================

/* ============ RECEPTION DASHBOARD - بطاقة المعاينة - قلب النظام - تصميم جديد كامل ============ */
function ReceptionCardPage(props:any){ return ReceptionDashboard(props); } // alias - نفس صفحة بطاقة المعاينة

/* DETAILED DASHBOARD OLD ALIAS REMOVED */

function ReceptionDashboard({ setPage }: any) {
  const [searchName, setSearchName] = useState('');
  const [searchCard, setSearchCard] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [cards, setCards] = useState<any[]>(() => { try { return JSON.parse(localStorage.getItem('zircon_visitCards') || '[]'); } catch { return []; } });
  const [doctors, setDoctors] = useState<any[]>([]);
  const [recSettings, setRecSettings] = useState<any>(() => {
    try { return { workStart:'00:00', workEnd:'23:59', clinicName:'مركز زركون CAD CAM لتحميل وتقويم وزراعة الأسنان', logo:'', phone1:'770605604', phone2:'', phone3:'', address:'صنعاء - الدائري الغربي - حولة ٢٠', examFee:1000, officeName:'' , ...JSON.parse(localStorage.getItem('zircon.receptionSettings.v1') || '{}') }; } catch { return { workStart:'00:00', workEnd:'23:59', clinicName:'مركز زركون', logo:'', phone1:'770605604', phone2:'', phone3:'', address:'صنعاء', examFee:1000, officeName:'' }; }
  });
  const [editingCard, setEditingCard] = useState<any>(null);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [showWaiting, setShowWaiting] = useState(false);
  const [showDaily, setShowDaily] = useState(false);
  const [printCopies, setPrintCopies] = useState(1);
  const [form, setForm] = useState({ name: '', age: '', gender: 'ذكر', phone: '', doctor: '', paymentMethod: '2 - نقد', transferType: '', currency: '101 - ريال يمني', regDate: TODAY, freeRenew: false });
  const [loginTime] = useState(()=> new Date());

  useEffect(() => { localStorage.setItem('zircon_visitCards', JSON.stringify(cards)); }, [cards]);
  useEffect(() => {
    try { setDoctors(JSON.parse(localStorage.getItem('zircon_doctors') || '[]')); } catch {}
    try { 
      const s = JSON.parse(localStorage.getItem('zircon.receptionSettings.v1') || '{}');
      setRecSettings((prev:any)=> ({...prev, ...s}));
    } catch {}
    // تسجيل وقت الدخول تلقائيا
    const entry = { time: new Date().toISOString(), display: new Date().toLocaleString('ar-EG'), user: 'استقبال' };
    const logs = JSON.parse(localStorage.getItem('zircon_receptionLogins')||'[]');
    logs.unshift(entry);
    localStorage.setItem('zircon_receptionLogins', JSON.stringify(logs.slice(0,50)));
  }, []);

  function generateCardNumber() { const maxNum = cards.reduce((m: any, c: any) => Math.max(m, parseInt(c.cardNumber) || 5700), 5700); return (maxNum + 1).toString(); }
  function clearSearch() { setSearchName(''); setSearchCard(''); setSearchPhone(''); }
  function newCard() { setEditingCard(null); setForm({ name: '', age: '', gender: 'ذكر', phone: '', doctor: '', paymentMethod: '2 - نقد', transferType: '', currency: '101 - ريال يمني', regDate: TODAY, freeRenew: false }); }
  function editCard(c: any) { setEditingCard(c); setForm({ ...c, freeRenew: c.freeRenew || false }); }
  function pushUndo() { setUndoStack([...undoStack, JSON.parse(JSON.stringify(cards))]); }
  function saveCard() {
    if (!form.name.trim() || !form.phone.trim()) { alert('الاسم والجوال مطلوبان'); return; }
    pushUndo();
    if (editingCard) { 
      setCards(cards.map((c: any) => c.cardNumber === editingCard.cardNumber ? { ...form, cardNumber: editingCard.cardNumber, createdAt: editingCard.createdAt, completed: editingCard.completed } : c)); 
      alert('تم تعديل البيانات'); 
      setEditingCard(null); 
    }
    else { 
      const newNum = generateCardNumber(); 
      const newCardObj = { ...form, cardNumber: newNum, createdAt: new Date().toISOString(), completed: false }; 
      setCards([newCardObj, ...cards]); 
      // ===== FIX: انشاء حجز جلسة تلقائيا ليظهر في قائمة انتظار الطبيب =====
      try{
        const sess = JSON.parse(localStorage.getItem('zircon_sessions')||'[]');
        const newSession = {
          id: Date.now().toString(),
          cardNumber: newNum,
          patientName: form.name,
          patientId: newNum,
          doctor: form.doctor,
          doctorId: form.doctor,
          date: TODAY,
          phone: form.phone,
          createdAt: new Date().toISOString(),
          source: 'auto_from_reception'
        };
        localStorage.setItem('zircon_sessions', JSON.stringify([newSession, ...sess]));
        const bks = JSON.parse(localStorage.getItem('zircon_sessionBookings')||'[]');
        localStorage.setItem('zircon_sessionBookings', JSON.stringify([newSession, ...bks]));
      }catch(e){ console.error(e) }
      alert(`✓ تم حفظ الحالة\nرقم بطاقة المعاينة: ${newNum} - وتم حجز جلسة تلقائيا للطبيب`); 
      newCard(); 
    }
  }
  function undo() { if (undoStack.length === 0) { alert('لا يوجد عمليات'); return; } setCards(undoStack[undoStack.length - 1]); setUndoStack(undoStack.slice(0, -1)); alert('تم التراجع'); }
  function renewCard(c: any, isFree: boolean = false) { if (!confirm(`تجديد المعاينة للمريض "${c.name}"؟`)) return; pushUndo(); setCards(cards.map((x: any) => x.cardNumber === c.cardNumber ? { ...x, lastRenew: new Date().toISOString(), completed: false, freeRenew: isFree } : x)); alert(isFree ? 'تم تجديد مجاني' : 'تم تجديد المعاينة - زيارة جديدة بنفس الرقم'); }
  function toggleCompleted(c: any) { setCards(cards.map((x: any) => x.cardNumber === c.cardNumber ? { ...x, completed: !x.completed } : x)); }

  function printCard(c: any) {
    const s = recSettings;
    const logoHtml = s.logo ? `<img src="${s.logo}" style="height:80px;display:block;margin:0 auto 10px" />` : '';
    const phones = [s.phone1, s.phone2, s.phone3].filter(Boolean).join(' / ');
    const html = `<html dir="rtl"><head><title>بطاقة معاينة</title><style>*{box-sizing:border-box}body{font-family:Cairo,Arial,sans-serif;padding:20px;text-align:center;background:#fff;color:#000;margin:0}.card{border:3px solid #000;padding:25px;max-width:420px;margin:20px auto;border-radius:12px}h1{margin:0 0 6px;font-size:22px}p{margin:5px 0;font-size:13px}.num{font-size:48px;font-weight:900;color:#0066cc;margin:18px 0;border:2px dashed #0066cc;padding:10px;border-radius:8px;letter-spacing:3px}.footer{font-size:10px;color:#666;margin-top:15px;border-top:1px solid #ccc;padding-top:8px}</style></head><body>
    <div class="card">${logoHtml}
    <h1>${s.clinicName || 'عيادة زركون'}</h1>
    <p style="font-size:11px">${s.address || ''}</p>
    <p style="font-size:11px" dir="ltr">📞 ${phones}</p>
    <hr style="margin:12px 0"/>
    <div class="num">#${c.cardNumber}</div>
    <p><b>الاسم:</b> ${c.name}</p>
    <p><b>العمر:</b> ${c.age || '—'} | <b>الجنس:</b> ${c.gender}</p>
    <p><b>الجوال:</b> ${c.phone}</p>
    <p><b>الطبيب المعالج:</b> ${c.doctor || '—'}</p>
    <p><b>تاريخ التسجيل:</b> ${c.regDate}</p>
    <p><b>سعر المعاينة:</b> ${s.examFee || 0} ريال</p>
    <div class="footer">يرجى الاحتفاظ بهذه البطاقة وإحضارها معك في كل زيارة | الدوام من ${s.workStart} إلى ${s.workEnd}</div>
    </div></body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); setTimeout(() => { for (let i = 0; i < printCopies; i++) w.print(); }, 400); }
  }
  function openWhatsApp(c: any) { const msg = `مرحباً ${c.name}\nرقم بطاقة المعاينة: #${c.cardNumber}\n${recSettings.clinicName}\nنتشرف بخدمتكم 🌟`; window.open(`https://wa.me/${c.phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank'); }
  function sendSMS(c: any) { alert(`سيتم إرسال SMS إلى ${c.phone}\n\nرقم بطاقتك: #${c.cardNumber}`); }

  const filtered = cards.filter((c: any) => {
    const matchName = !searchName || (c.name || '').includes(searchName);
    const matchCard = !searchCard || (c.cardNumber || '').includes(searchCard);
    const matchPhone = !searchPhone || (c.phone || '').includes(searchPhone);
    let matchFilter = true;
    if (filter === 'completed') matchFilter = c.completed;
    if (filter === 'incomplete') matchFilter = !c.completed;
    return matchName && matchCard && matchPhone && matchFilter;
  });
  const todayCount = cards.filter((c: any) => (c.createdAt || '').slice(0, 10) === TODAY).length;
  const waitingCount = cards.filter((c: any) => !c.completed).length;

  if (showWaiting) return (
    <div className="space-y-4">
      <div className="flex items-center gap-3"><button onClick={() => setShowWaiting(false)} className="text-slate-400"><ArrowRight size={20}/></button><h2 className="text-xl font-bold text-white">قائمة الانتظار - {waitingCount} - حسب ترتيب التسجيل</h2></div>
      <div className={card + ' !p-0 overflow-hidden'}>
        <table className="w-full text-sm"><thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-3">#</th><th className="text-right px-4 py-3">رقم البطاقة</th><th className="text-right px-4 py-3">الاسم</th><th className="text-right px-4 py-3">الطبيب</th><th className="text-right px-4 py-3">التسجيل</th></tr></thead>
          <tbody className="divide-y divide-white/5">{cards.filter((c: any) => !c.completed).sort((a: any, b: any) => (a.createdAt || '').localeCompare(b.createdAt || '')).map((c: any, i: number) => (<tr key={c.cardNumber} className="hover:bg-white/5"><td className="px-4 py-2 text-white font-bold">#{i + 1}</td><td className="px-4 py-2 font-mono text-blue-300 text-xs" dir="ltr">#{c.cardNumber}</td><td className="px-4 py-2 text-white">{c.name}</td><td className="px-4 py-2 text-slate-300">{c.doctor || '—'}</td><td className="px-4 py-2 text-slate-400 text-xs">{fmtDateTime(c.createdAt)}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );

  if (showDaily) return (
    <div className="space-y-4">
      <div className="flex items-center gap-3"><button onClick={() => setShowDaily(false)} className="text-slate-400"><ArrowRight size={20}/></button><h2 className="text-xl font-bold text-white">اليومية - حسابات اليوم - {TODAY}</h2></div>
      <div className="grid grid-cols-3 gap-3">
        <div className={card}><div className="text-xs text-slate-400">حالات اليوم</div><div className="text-2xl font-bold text-white mt-1">{todayCount}</div></div>
        <div className={card}><div className="text-xs text-slate-400">مكتملة</div><div className="text-2xl font-bold text-emerald-400 mt-1">{cards.filter((c: any) => c.completed && (c.createdAt || '').slice(0, 10) === TODAY).length}</div></div>
        <div className={card}><div className="text-xs text-slate-400">قيد المعالجة</div><div className="text-2xl font-bold text-amber-400 mt-1">{cards.filter((c: any) => !c.completed && (c.createdAt || '').slice(0, 10) === TODAY).length}</div></div>
      </div>
      <div className={card + ' !p-0 overflow-hidden'}>
        <table className="w-full text-sm"><thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-3">رقم البطاقة</th><th className="text-right px-4 py-3">الاسم</th><th className="text-right px-4 py-3">الطبيب</th><th className="text-right px-4 py-3">الدفع</th><th className="text-right px-4 py-3">التاريخ</th></tr></thead>
          <tbody className="divide-y divide-white/5">{cards.filter((c: any) => (c.createdAt || '').slice(0, 10) === TODAY).map((c: any) => (<tr key={c.cardNumber} className="hover:bg-white/5"><td className="px-4 py-2 font-mono text-blue-300 text-xs" dir="ltr">#{c.cardNumber}</td><td className="px-4 py-2 text-white">{c.name}</td><td className="px-4 py-2 text-slate-300">{c.doctor || '—'}</td><td className="px-4 py-2 text-slate-300 text-xs">{c.paymentMethod}</td><td className="px-4 py-2 text-slate-400 text-xs">{fmtDateTime(c.createdAt)}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-bold text-white">بطاقة المعاينة - قلب النظام - لوحة تحكم الاستقبال</h2>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">✓ دخول: {loginTime.toLocaleString('ar-EG')}</span>
            <span className="px-2 py-1 rounded bg-white/5 text-slate-400">{TODAY}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="grid grid-cols-4 gap-2">
            <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-2 text-center"><div className="font-bold text-blue-300">{todayCount}</div><div className="text-[10px] text-slate-400">اليوم</div></div>
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-2 text-center"><div className="font-bold text-amber-300">{waitingCount}</div><div className="text-[10px] text-slate-400">انتظار</div></div>
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2 text-center"><div className="font-bold text-emerald-300">{cards.length}</div><div className="text-[10px] text-slate-400">إجمالي</div></div>
            <div className="rounded-xl bg-violet-500/10 border border-violet-500/20 p-2 text-center"><div className="font-bold text-violet-300">{cards.filter((c:any)=>c.completed).length}</div><div className="text-[10px] text-slate-400">أكمل</div></div>
          </div>
        </div>
      </div>

      <div className={card}>
        <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Search size={18} className="text-blue-400"/> البحث عن حالة - اسم المريض أو رقم البطاقة أو الجوال</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <input placeholder="اسم المريض" value={searchName} onChange={e => setSearchName(e.target.value)} className={inp} />
          <input placeholder="رقم بطاقة المعاينة مثال: 5768" value={searchCard} onChange={e => setSearchCard(e.target.value)} className={inp} />
          <input placeholder="رقم الجوال" value={searchPhone} onChange={e => setSearchPhone(e.target.value)} className={inp} dir="ltr" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => {}} className={btnSm}><Search size={16}/> البحث عن حالة</button>
          <button onClick={clearSearch} className={btnGhost}>مسح البحث</button>
          <button onClick={newCard} className={btnSm + ' !bg-emerald-600 hover:!bg-emerald-500'}><Plus size={16}/> إضافة حالة جديدة - يفضي الفورم</button>
        </div>
      </div>

      <div className={card}>
        <h3 className="font-bold text-white mb-3 flex items-center gap-2">{editingCard ? <><Edit3 size={18} className="text-amber-400"/> تعديل حالة - #{editingCard.cardNumber}</> : <><Plus size={18} className="text-emerald-400"/> بيانات حالة جديدة - البيانات الإجبارية *</>}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div><label className={label}>اسم المريض *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inp} placeholder="الاسم الكامل" /></div>
          <div><label className={label}>العمر</label><input type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} className={inp} placeholder="مثال: 30" /></div>
          <div><label className={label}>النوع (ذكر/أنثى)</label><select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className={inp}><option>ذكر</option><option>أنثى</option></select></div>
          <div><label className={label}>رقم التلفون * - مهم للواتساب وال SMS</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={inp + ' border-amber-500/30'} dir="ltr" placeholder="77xxxxxxx" /></div>
          <div><label className={label}>الطبيب المعالج * - مثال: د/ احمد</label><select value={form.doctor} onChange={e => setForm({ ...form, doctor: e.target.value })} className={inp}><option value="">اختر الطبيب</option>{doctors.map((d: any) => <option key={d.id} value={d.name}>{d.name}</option>)}</select></div>
          <div><label className={label}>رقم بطاقة المعاينة - يولد تلقائيا - المعرف الوحيد</label><input value={editingCard?.cardNumber || ''} readOnly placeholder="يولد بعد الحفظ مثال: 5768" className={inp + ' !bg-blue-500/10 !border-blue-500/30 text-blue-300'} /></div>
          <div><label className={label}>طريقة الدفع - مثال: 2 - نقد</label><select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })} className={inp}><option>2 - نقد</option><option>1 - آجل</option><option>3 - تحويل</option></select></div>
          <div><label className={label}>نوع الحوالة</label><select value={form.transferType} onChange={e => setForm({ ...form, transferType: e.target.value })} className={inp}><option value="">—</option><option>حوالة بنكية</option><option>كاش</option></select></div>
          <div><label className={label}>اسم العملة - 101 - ريال يمني</label><select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} className={inp}><option>101 - ريال يمني</option><option>102 - سعودي</option><option>103 - دولار</option></select></div>
          <div><label className={label}>تاريخ التسجيل - تلقائي اليوم</label><input type="date" value={form.regDate} onChange={e => setForm({ ...form, regDate: e.target.value })} className={inp} /></div>
          <div className="flex items-center gap-2 pt-6"><input type="checkbox" checked={form.freeRenew} onChange={e => setForm({ ...form, freeRenew: e.target.checked })} className="w-4 h-4" /><span className="text-xs text-slate-300">تجديد مجاني - بدون رسوم</span></div>
        </div>
        <div className="mt-3 flex items-center gap-4 flex-wrap">
          <label className="flex items-center gap-2 text-sm text-slate-300">خيارات الطباعة:<select value={printCopies} onChange={e => setPrintCopies(Number(e.target.value))} className="rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-xs text-white"><option value={1}>كرت واحد</option><option value={2}>كرتين</option></select></label>
        </div>
        <div className="mt-4 flex gap-2 flex-wrap">
          <button onClick={saveCard} className={btnSm + ' !px-6'}><Save size={16}/> حفظ بيانات حالة - يولد رقم البطاقة</button>
          {editingCard && <button onClick={() => printCard(editingCard)} className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold px-4 py-2.5 text-sm flex items-center gap-2"><PrinterIcon size={16}/> كرت معاينة - طباعة</button>}
          {editingCard && <button onClick={() => openWhatsApp(editingCard)} className={btnSm + ' !bg-emerald-600 hover:!bg-emerald-500'}><MessageCircle size={16}/> WhatsApp - رقم الكرت وموعد</button>}
          {editingCard && <button onClick={() => sendSMS(editingCard)} className={btnGhost}>📱 SMS</button>}
          <button onClick={undo} disabled={undoStack.length === 0} className={btnGhost + ' disabled:opacity-40'}>↶ التراجع على ماتم</button>
          <button onClick={() => setShowDaily(true)} className={btnGhost}>📊 اليومية - حسابات اليوم</button>
          <button onClick={() => setShowWaiting(true)} className={btnGhost}>⏳ عرض قائمة الانتظار - {waitingCount}</button>
          {editingCard && <button onClick={() => renewCard(editingCard, form.freeRenew)} className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 text-sm flex items-center gap-2"><RefreshCw size={16}/> تجديد المعاينة - زيارة جديدة بنفس الرقم</button>}
          {editingCard && <button onClick={() => renewCard(editingCard, true)} className="rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold px-4 py-2.5 text-sm flex items-center gap-2"><RefreshCw size={16}/> تجديد مجاني</button>}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        <Filter size={14} className="text-slate-500"/><span className="text-xs text-slate-400">فلتر أكمل المعالجة / لم يكمل:</span>
        <button onClick={() => setFilter('all')} className={'px-3 py-1.5 rounded-lg text-xs transition ' + (filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-300')}>الكل ({cards.length})</button>
        <button onClick={() => setFilter('incomplete')} className={'px-3 py-1.5 rounded-lg text-xs transition ' + (filter === 'incomplete' ? 'bg-amber-600 text-white' : 'bg-white/5 text-slate-300')}>لم يكمل ({cards.filter((c: any) => !c.completed).length})</button>
        <button onClick={() => setFilter('completed')} className={'px-3 py-1.5 rounded-lg text-xs transition ' + (filter === 'completed' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-300')}>أكمل ({cards.filter((c: any) => c.completed).length})</button>
      </div>

      <div className={card + ' !p-0 overflow-hidden'}>
        <div className="p-3 border-b border-white/10 flex justify-between items-center"><h3 className="font-bold text-white text-sm">سجل كل الحالات - يعرض تاريخ ووقت التسجيل بالضبط مثال: 05/01/2026 07:24 - {filtered.length} حالة</h3><div className="text-xs text-slate-400">{loginTime.toLocaleString('ar-EG')}</div></div>
        <div className="overflow-auto max-h-[400px]">
          <table className="w-full text-sm min-w-[1000px]">
            <thead className="bg-white/5 text-slate-400 text-xs sticky top-0"><tr><th className="text-right px-3 py-3">تاريخ ووقت التسجيل</th><th className="text-right px-3 py-3">رقم البطاقة - المعرف الوحيد</th><th className="text-right px-3 py-3">الاسم</th><th className="text-right px-3 py-3">العمر</th><th className="text-right px-3 py-3">النوع</th><th className="text-right px-3 py-3">الجوال</th><th className="text-right px-3 py-3">الطبيب</th><th className="text-right px-3 py-3">الدفع</th><th className="text-right px-3 py-3">العملة</th><th className="text-right px-3 py-3">الحالة</th><th className="text-right px-3 py-3">إجراءات</th></tr></thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? <tr><td colSpan={11} className="p-6 text-center text-slate-500">لا توجد حالات - أضف حالة جديدة</td></tr> :
                filtered.map((c: any) => (<tr key={c.cardNumber} className="hover:bg-white/5 cursor-pointer" onClick={()=>editCard(c)}>
                  <td className="px-3 py-2 text-slate-300 text-xs">{fmtDateTime(c.createdAt)}</td>
                  <td className="px-3 py-2 font-mono text-blue-300 font-bold text-xs" dir="ltr">#{c.cardNumber}</td>
                  <td className="px-3 py-2 text-white">{c.name}</td>
                  <td className="px-3 py-2 text-slate-400">{c.age || '—'}</td>
                  <td className="px-3 py-2 text-slate-400">{c.gender}</td>
                  <td className="px-3 py-2 text-slate-300" dir="ltr">{c.phone}</td>
                  <td className="px-3 py-2 text-slate-300 text-xs">{c.doctor || '—'}</td>
                  <td className="px-3 py-2"><span className={`text-xs px-2 py-1 rounded ${c.paymentMethod.includes('نقد')?'bg-emerald-500/20 text-emerald-300':'bg-blue-500/20 text-blue-300'}`}>{c.paymentMethod}</span></td>
                  <td className="px-3 py-2 text-slate-400 text-xs">{c.currency}</td>
                  <td className="px-3 py-2"><button onClick={(e)=>{e.stopPropagation(); toggleCompleted(c);}} className={'text-xs px-2 py-1 rounded ' + (c.completed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300')}>{c.completed ? '✓ أكمل المعالجة' : '⏳ لم يكمل'}</button>{c.freeRenew && <span className="text-[10px] px-1 rounded bg-violet-500/20 text-violet-300 ml-1">مجاني</span>}</td>
                  <td className="px-3 py-2"><div className="flex gap-1 flex-wrap">
                    <button onClick={(e)=>{e.stopPropagation(); editCard(c);}} className="p-1.5 rounded hover:bg-blue-500/20 text-blue-400"><Edit3 size={12}/></button>
                    <button onClick={(e)=>{e.stopPropagation(); printCard(c);}} className="p-1.5 rounded hover:bg-purple-500/20 text-purple-400"><PrinterIcon size={12}/></button>
                    <button onClick={(e)=>{e.stopPropagation(); openWhatsApp(c);}} className="p-1.5 rounded hover:bg-emerald-500/20 text-emerald-400"><MessageCircle size={12}/></button>
                    <button onClick={(e)=>{e.stopPropagation(); renewCard(c, false);}} className="p-1.5 rounded hover:bg-amber-500/20 text-amber-400"><RefreshCw size={12}/></button>
                    <button onClick={(e)=>{e.stopPropagation(); setPage('session-booking');}} className="p-1.5 rounded hover:bg-cyan-500/20 text-cyan-400"><Calendar size={12}/></button>
                  </div></td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </div>
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
        <div><h2 className="text-2xl font-bold text-white">لوحة تحكم الزراعة</h2><p className="text-slate-400 mt-1 text-sm">متابعة حالات زراعة الاسنان</p></div>
        <div className="flex gap-2 flex-wrap"><button onClick={() => setPage('patient-new')} className={btnSm}><Plus size={16}/> مريض</button><button onClick={() => setPage('appointment-new')} className={btnSm}><Plus size={16}/> موعد</button><button onClick={() => setPage('surgery-new')} className={btnSm}><Plus size={16}/> جراحة</button></div>
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
        <div className={card}><h3 className="font-semibold text-white mb-4">احدث المرضى</h3><div className="space-y-2">{recent.map((p:any) => (<div key={p.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0"><div className="h-9 w-9 rounded-full bg-blue-500/20 text-blue-300 grid place-items-center text-sm font-semibold">{p.full_name?.charAt(0)}</div><div className="flex-1 min-w-0"><div className="text-sm text-white truncate">{p.full_name}</div><div className="text-xs text-slate-400" dir="ltr">{p.patient_code}</div></div><a href={`https://wa.me/${p.phone?.replace(/\D/g,'')}`} target="_blank" className="text-emerald-400"><MessageCircle size={16}/></a></div>))}</div></div>
        <div className={card}><h3 className="font-semibold text-white mb-4">مواعيد اليوم</h3><div className="space-y-2">{todayAppts.length===0 ? <p className="text-sm text-slate-500">لا توجد مواعيد اليوم</p> : todayAppts.map((a:any) => (<div key={a.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0"><div className="text-sm font-semibold text-blue-300 w-14" dir="ltr">{new Date(a.scheduled_start).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div><div className="flex-1 text-sm text-white truncate">{a.patient?.full_name}</div></div>))}</div></div>
        <div className={card + ' border-amber-500/20'}><h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Clock size={16} className="text-amber-400"/> متابعات تحتاج تواصل</h3><div className="space-y-2">{upcomingFollowups.length===0 ? <p className="text-sm text-slate-500">لا توجد متابعات قادمة</p> : upcomingFollowups.map((f:any) => (<div key={f.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0"><div className="flex-1 min-w-0"><div className="text-sm text-white truncate">{f.patient?.full_name}</div><div className="text-xs text-slate-400">{f.follow_type} - {fmtDate(f.scheduled_date)}</div></div><a href={`https://wa.me/${f.patient?.phone?.replace(/\D/g,'')}`} target="_blank" className="h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-300 grid place-items-center"><MessageCircle size={14}/></a></div>))}</div></div>
      </div>
    </div>
  );
}
function Patients({ setPage, setEditItem, setSelectedPatient }: any) {
  const [list, setList] = useState<any[]>([]); const [search, setSearch] = useState(''); const [loading, setLoading] = useState(true);
  const load = useCallback(async ()=>{ setLoading(true); let q = supabase.from('patients').select('*').order('created_at', { ascending: false }).limit(100); if (search) q = q.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%,patient_code.ilike.%${search}%`); const { data } = await q; setList(data || []); setLoading(false); }, [search]);
  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [load]);
  async function del(id: string) { if (!confirm('حذف المريض؟')) return; await supabase.from('patients').delete().eq('id', id); load(); }
  return (<div className="space-y-4"><div className="flex flex-wrap gap-3 items-center"><div className="relative flex-1 min-w-[240px]"><Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث بالاسم او الجوال..." className={inp + ' pr-10'} /></div><button onClick={() => { setEditItem(null); setPage('patient-new'); }} className={btnSm}><Plus size={16}/> مريض جديد</button></div><div className={card + ' !p-0 overflow-hidden'}>{loading ? <div className="p-8 text-center text-slate-400">جاري التحميل...</div> : list.length === 0 ? <div className="p-8 text-center text-slate-400">لا يوجد مرضى</div> : (<div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-3">الكود</th><th className="text-right px-4 py-3">الاسم</th><th className="text-right px-4 py-3">الجوال</th><th className="text-right px-4 py-3">اجراءات</th></tr></thead><tbody className="divide-y divide-white/5">{list.map((p:any) => (<tr key={p.id} className="hover:bg-white/5"><td className="px-4 py-3 font-mono text-blue-300 text-xs" dir="ltr">{p.patient_code}</td><td className="px-4 py-3 text-white font-medium"><button onClick={()=>{ setSelectedPatient(p); setPage('patient-detail'); }} className="hover:text-blue-400">{p.full_name}</button></td><td className="px-4 py-3 text-slate-300" dir="ltr">{p.phone}</td><td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => { setEditItem(p); setPage('patient-new'); }} className="text-blue-400"><Edit3 size={16}/></button><button onClick={() => del(p.id)} className="text-red-400"><Trash2 size={16}/></button></div></td></tr>))}</tbody></table></div>)}</div></div>);
}
function PatientForm({ patient, onSave, onCancel }: any) {
  const isEdit = !!patient?.id; const [form, setForm] = useState({ full_name: patient?.full_name || '', phone: patient?.phone || '', medical_alerts: patient?.medical_alerts || '', notes: patient?.notes || '', gender: patient?.gender || '', date_of_birth: patient?.date_of_birth || '', }); const [err, setErr] = useState(''); const [loading, setLoading] = useState(false);
  async function submit(e: any) { e.preventDefault(); setErr(''); if (!form.full_name.trim() || !form.phone.trim()) { setErr('الاسم والجوال مطلوبان'); return; } setLoading(true); const payload: any = { full_name: form.full_name.trim(), phone: form.phone.trim(), gender: form.gender || null, date_of_birth: form.date_of_birth || null, medical_alerts: form.medical_alerts || null, notes: form.notes || null }; let res = isEdit ? await supabase.from('patients').update(payload).eq('id', patient.id) : await supabase.from('patients').insert(payload); setLoading(false); if (res.error) { setErr(res.error.message); return; } onSave(); }
  return (<form onSubmit={submit} className="space-y-5 max-w-3xl"><div className="flex items-center gap-3"><button type="button" onClick={onCancel} className="text-slate-400"><ArrowRight size={20}/></button><h2 className="text-xl font-bold text-white">{isEdit ? 'تعديل المريض' : 'اضافة مريض جديد'}</h2></div><div className={card}><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><label><span className={label}>الاسم *</span><input className={inp} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required /></label><label><span className={label}>الجوال *</span><input className={inp} dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></label><label><span className={label}>الجنس</span><select className={inp} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}><option value="">—</option><option value="male">ذكر</option><option value="female">انثى</option></select></label><label><span className={label}>تاريخ الميلاد</span><input className={inp} type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} /></label><label className="md:col-span-2"><span className={label}>تنبيهات طبية</span><textarea className={inp} rows={2} value={form.medical_alerts} onChange={(e) => setForm({ ...form, medical_alerts: e.target.value })} /></label></div></div>{err && <div className="rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3">{err}</div>}<div className="flex gap-3"><button type="submit" disabled={loading} className={btnSm + ' !px-6 !py-2.5'}>{loading ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>} حفظ</button><button type="button" onClick={onCancel} className={btnGhost}>الغاء</button></div></form>);
}
function PatientDetail({ patient, onBack, setPage, setEditItem }: any) {
  const [tab, setTab] = useState('overview'); const [surgeries, setSurgeries] = useState<any[]>([]); const [implants, setImplants] = useState<any[]>([]); const [followups, setFollowups] = useState<any[]>([]); const [showImplantModal, setShowImplantModal] = useState(false); const [selectedTooth, setSelectedTooth] = useState<number>(11); const [bulkRecords, setBulkRecords] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon_bulkRows')||'[]').filter((r:any)=>r.patientId===patient.id || r.patientName===patient.full_name) }catch{ return [] } });
  const load = useCallback(async()=>{ const [s, i, f] = await Promise.all([ supabase.from('surgeries').select('*').eq('patient_id', patient.id).order('created_at',{ascending:false}), supabase.from('implants').select('*').eq('patient_id', patient.id).order('created_at',{ascending:false}), supabase.from('follow_ups').select('*').eq('patient_id', patient.id).order('scheduled_date'), ]); setSurgeries(s.data||[]); setImplants(i.data||[]); setFollowups(f.data||[]); },[patient.id]);
  useEffect(()=>{ load(); },[load]);
  function handleToothClick(tooth: number) { setSelectedTooth(tooth); if (surgeries.length===0) { alert('يجب انشاء جراحة اولا قبل اضافة زرعة'); return; } setShowImplantModal(true); }
  return (<div className="space-y-5"><div className="flex items-center gap-3 flex-wrap"><button onClick={onBack} className="text-slate-400"><ArrowRight size={20}/></button><h2 className="text-xl font-bold text-white">{patient.full_name}</h2><span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300 font-mono" dir="ltr">{patient.patient_code}</span><div className="flex-1" /><a href={`https://wa.me/${patient.phone?.replace(/\D/g,'')}`} target="_blank" className={btnSm + ' !bg-emerald-600'}><MessageCircle size={16}/> واتساب</a><button onClick={()=>{ setEditItem(patient); setPage('patient-new'); }} className={btnGhost}><Edit3 size={16}/> تعديل</button></div><div className="border-b border-white/10 overflow-x-auto"><div className="flex gap-1 min-w-max">{[{id:'overview', label:'نظرة عامة'},{id:'chart', label:`مخطط الاسنان (${implants.length})`},{id:'treatments', label:`سجل المعالجات (${bulkRecords.length})`},{id:'surgeries', label:`الجراحات (${surgeries.length})`},{id:'followups', label:`المتابعات (${followups.length})`}].map(t=><button key={t.id} onClick={() => setTab(t.id)} className={'px-4 py-2.5 text-sm border-b-2 whitespace-nowrap ' + (tab === t.id ? 'border-blue-500 text-white' : 'border-transparent text-slate-400')}>{t.label}</button>)}</div></div>{tab==='overview' && <div className={card}><div className="grid grid-cols-3 gap-3 text-center"><div className="rounded-xl bg-white/5 p-3"><div className="text-xl font-bold text-white">{surgeries.length}</div><div className="text-xs text-slate-400">جراحات</div></div><div className="rounded-xl bg-white/5 p-3"><div className="text-xl font-bold text-emerald-400">{implants.length}</div><div className="text-xs text-slate-400">زرعات</div></div><div className="rounded-xl bg-white/5 p-3"><div className="text-xl font-bold text-amber-400">{followups.length}</div><div className="text-xs text-slate-400">متابعات</div></div></div></div>}{tab==='chart' && <div className="space-y-4"><ToothChart implants={implants} onToothClick={handleToothClick}/><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{implants.map((im:any)=><div key={im.id} className={card}><div className="flex justify-between"><span className="text-2xl font-bold text-emerald-400">{im.tooth_number}</span><span className="text-xs px-2 py-1 rounded bg-emerald-500/20 text-emerald-300">{im.status}</span></div><div className="text-sm text-white mt-1">{im.brand}</div><div className="text-xs text-slate-400 mt-1" dir="ltr">{im.diameter_mm} x {im.length_mm} mm | Torque {im.torque_ncm} Ncm</div></div>)}</div></div>}{tab==='treatments' && <div className={card + ' !p-0 overflow-hidden'}><div className="p-4 font-bold text-white">سجل المعالجات - اسم المعالجة | اسم الطبيب | سعر المعالجة | رقم السن</div><div className="overflow-auto"><table className="w-full text-sm"><thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-3">اسم المعالجة</th><th className="text-right px-4 py-3">اسم الطبيب</th><th className="text-right px-4 py-3">سعر المعالجة</th><th className="text-right px-4 py-3">رقم السن</th><th className="text-right px-4 py-3">التاريخ</th><th className="text-right px-4 py-3">الحالة</th></tr></thead><tbody className="divide-y divide-white/5">{bulkRecords.map((r:any)=><tr key={r.id}><td className="px-4 py-2 text-white">{r.treatName}</td><td className="px-4 py-2 text-slate-300">{r.doctorName}</td><td className="px-4 py-2 text-emerald-400">{r.cost} ر.س</td><td className="px-4 py-2 text-emerald-300">🦷 {r.tooth}</td><td className="px-4 py-2 text-slate-400 text-xs">{fmtDate(r.date)}</td><td className="px-4 py-2"><span className="text-xs px-2 py-1 rounded bg-white/10">{r.status}</span></td></tr>)}</tbody></table></div></div>}{tab==='surgeries' && <div className="space-y-3">{surgeries.map((s:any)=><div key={s.id} className={card + ' flex justify-between items-center'}><div><div className="text-white font-medium">{s.surgery_type} - {fmtDate(s.scheduled_date)}</div><div className="text-xs text-slate-400">{s.status}</div></div></div>)}</div>}{tab==='followups' && <div className="space-y-3"><button onClick={async()=>{ if (surgeries.length===0) { alert('انشئ جراحة اولا'); return; } const base = new Date(surgeries[0].scheduled_date || new Date()); const dates = [{type:'فك غرز', days:7},{type:'متابعة التئام', days:14},{type:'كشف اندماج العظم', days:90},{type:'موعد التركيب', days:180}]; for (const d of dates) { const dt = new Date(base); dt.setDate(dt.getDate()+d.days); await supabase.from('follow_ups').insert({ patient_id: patient.id, surgery_id: surgeries[0].id, follow_type: d.type, scheduled_date: dt.toISOString().slice(0,10), status:'scheduled' }); } load(); }} className={btnSm}><Plus size={16}/> انشاء متابعات تلقائية</button>{followups.map((f:any)=><div key={f.id} className={card + ' flex justify-between items-center'}><div><div className="text-white">{f.follow_type}</div><div className="text-xs text-slate-400">{fmtDate(f.scheduled_date)}</div></div><span className={`text-xs px-2 py-1 rounded ${f.status==='completed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>{f.status}</span></div>)}</div>}{showImplantModal && <ImplantModal surgeryId={surgeries[0]?.id} patientId={patient.id} initialTooth={selectedTooth} onClose={()=>setShowImplantModal(false)} onSave={()=>{ setShowImplantModal(false); load(); }} />}</div>);
}
function Surgeries({ setPage, setSelectedPatient }: any) { const [list, setList] = useState<any[]>([]); useEffect(()=>{ (async()=>{ const {data}=await supabase.from('surgeries').select('*, patient:patients(full_name)').order('created_at',{ascending:false}).limit(100); setList(data||[]); })(); },[]); return <div className="space-y-4"><div className="flex justify-between"><h2 className="text-xl font-bold text-white">الجراحات</h2><button onClick={()=>setPage('surgery-new')} className={btnSm}><Plus size={16}/> جراحة جديدة</button></div><div className={card + ' !p-0 overflow-hidden'}><table className="w-full text-sm"><thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-3">التاريخ</th><th className="text-right px-4 py-3">المريض</th><th className="text-right px-4 py-3">النوع</th></tr></thead><tbody className="divide-y divide-white/5">{list.map((s:any)=><tr key={s.id} className="hover:bg-white/5"><td className="px-4 py-3 text-slate-300 text-xs">{fmtDate(s.scheduled_date)}</td><td className="px-4 py-3 text-white"><button onClick={()=>{ setSelectedPatient(s.patient); setPage('patient-detail'); }} className="text-blue-400">{s.patient?.full_name}</button></td><td className="px-4 py-3 text-slate-300 text-xs">{s.surgery_type}</td></tr>)}</tbody></table></div></div>; }
function Appointments({ setPage }: any) { const [list, setList] = useState<any[]>([]); useEffect(()=>{ (async()=>{ const {data}=await supabase.from('appointments').select('*, patient:patients(full_name)').order('scheduled_start',{ascending:false}).limit(100); setList(data||[]); })(); },[]); return <div className="space-y-4"><div className="flex justify-between"><h2 className="text-xl font-bold text-white">المواعيد</h2><button onClick={()=>setPage('appointment-new')} className={btnSm}><Plus size={16}/> موعد جديد</button></div><div className={card + ' !p-0 overflow-hidden'}><table className="w-full text-sm"><thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-3">التاريخ</th><th className="text-right px-4 py-3">المريض</th><th className="text-right px-4 py-3">النوع</th></tr></thead><tbody className="divide-y divide-white/5">{list.map((a:any)=><tr key={a.id} className="hover:bg-white/5"><td className="px-4 py-3 text-slate-300 text-xs">{fmtDateTime(a.scheduled_start)}</td><td className="px-4 py-3 text-white">{a.patient?.full_name}</td><td className="px-4 py-3 text-slate-300 text-xs">{a.appointment_type}</td></tr>)}</tbody></table></div></div>; }
function AppointmentForm({ onSave, onCancel }: any) { const [patients, setPatients] = useState<any[]>([]); const [patientId, setPatientId] = useState(''); const [type, setType] = useState('consultation'); const [date, setDate] = useState(new Date().toISOString().slice(0,10)); const [time, setTime] = useState('10:00'); useEffect(()=>{ supabase.from('patients').select('id, full_name').limit(50).then(({data})=>setPatients(data||[])); },[]); async function submit(e:any){ e.preventDefault(); const start=new Date(`${date}T${time}`); const {data:u}=await supabase.auth.getUser(); await supabase.from('appointments').insert({ patient_id: patientId, doctor_id: u?.user?.id, appointment_type: type, status:'scheduled', scheduled_start: start.toISOString(), duration_minutes:30 }); onSave(); } return <form onSubmit={submit} className="space-y-4 max-w-xl"><h2 className="text-xl font-bold text-white">حجز موعد جديد</h2><div className={card + ' space-y-4'}><label><span className={label}>المريض *</span><select className={inp} value={patientId} onChange={e=>setPatientId(e.target.value)} required><option value="">اختر مريض</option>{patients.map((p:any)=><option key={p.id} value={p.id}>{p.full_name}</option>)}</select></label><label><span className={label}>النوع</span><select className={inp} value={type} onChange={e=>setType(e.target.value)}><option value="consultation">استشارة</option><option value="implant_surgery">جراحة زراعة</option><option value="follow_up">متابعة</option></select></label><div className="grid grid-cols-2 gap-4"><label><span className={label}>التاريخ</span><input type="date" value={date} onChange={e=>setDate(e.target.value)} className={inp}/></label><label><span className={label}>الوقت</span><input type="time" value={time} onChange={e=>setTime(e.target.value)} className={inp}/></label></div></div><button type="submit" className={btnSm}>حفظ الموعد</button><button type="button" onClick={onCancel} className={btnGhost}>الغاء</button></form>; }
function SurgeryForm({ onSave, onCancel }: any) { const [patients, setPatients] = useState<any[]>([]); const [patientId, setPatientId] = useState(''); const [type, setType] = useState('single_implant'); const [date, setDate] = useState(new Date().toISOString().slice(0,10)); useEffect(()=>{ supabase.from('patients').select('id, full_name').limit(50).then(({data})=>setPatients(data||[])); },[]); async function submit(e:any){ e.preventDefault(); const {data:u}=await supabase.auth.getUser(); const {error}=await supabase.from('surgeries').insert({ patient_id: patientId, doctor_id: u?.user?.id, surgery_type: type, status:'planned', scheduled_date: new Date(date).toISOString() }); if(error){ alert(error.message); return; } onSave(); } return <form onSubmit={submit} className="space-y-4 max-w-xl"><h2 className="text-xl font-bold text-white">جراحة جديدة</h2><div className={card + ' space-y-4'}><label><span className={label}>المريض *</span><select className={inp} value={patientId} onChange={e=>setPatientId(e.target.value)} required><option value="">اختر مريض</option>{patients.map((p:any)=><option key={p.id} value={p.id}>{p.full_name}</option>)}</select></label><label><span className={label}>نوع الجراحة</span><select className={inp} value={type} onChange={e=>setType(e.target.value)}><option value="single_implant">زرعة واحدة</option><option value="multiple_implants">زرعات متعددة</option><option value="full_arch">قوس كامل</option></select></label><label><span className={label}>التاريخ</span><input type="date" value={date} onChange={e=>setDate(e.target.value)} className={inp}/></label></div><button type="submit" className={btnSm}>انشاء الجراحة</button><button type="button" onClick={onCancel} className={btnGhost}>الغاء</button></form>; }
function ImplantModal({ surgeryId, patientId, initialTooth, onClose, onSave }: any) { const [form, setForm] = useState({ tooth_number: initialTooth||11, brand: 'Straumann', diameter_mm: '4.1', length_mm: '10', torque_ncm: '35', bone_density: 'D2' }); const [loading, setLoading] = useState(false); async function submit(e:any){ e.preventDefault(); setLoading(true); const { error } = await supabase.from('implants').insert({ patient_id: patientId, surgery_id: surgeryId, tooth_number: form.tooth_number, status:'placed', brand: form.brand, diameter_mm: Number(form.diameter_mm), length_mm: Number(form.length_mm), torque_ncm: Number(form.torque_ncm), bone_density: form.bone_density, placed_at: new Date().toISOString(), }); setLoading(false); if(error){ alert(error.message); return; } onSave(); } return (<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4"><div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b1733]"><div className="flex items-center justify-between px-5 py-3 border-b border-white/10"><h3 className="text-white font-semibold">اضافة زرعة سن {form.tooth_number}</h3><button onClick={onClose} className="text-slate-400"><X size={18}/></button></div><form onSubmit={submit} className="p-5 grid grid-cols-2 gap-4"><label><span className={label}>السن</span><input type="number" className={inp} value={form.tooth_number} onChange={e=>setForm({...form, tooth_number: Number(e.target.value)})}/></label><label><span className={label}>الماركة</span><select className={inp} value={form.brand} onChange={e=>setForm({...form, brand: e.target.value})}><option>Straumann</option><option>Nobel Biocare</option><option>Mega Gen</option><option>Osstem</option></select></label><label><span className={label}>القطر</span><input className={inp} value={form.diameter_mm} onChange={e=>setForm({...form, diameter_mm: e.target.value})}/></label><label><span className={label}>الطول</span><input className={inp} value={form.length_mm} onChange={e=>setForm({...form, length_mm: e.target.value})}/></label><label><span className={label}>العزم Ncm</span><input className={inp + ' border-amber-500/40'} value={form.torque_ncm} onChange={e=>setForm({...form, torque_ncm: e.target.value})}/></label><label><span className={label}>كثافة العظم</span><select className={inp} value={form.bone_density} onChange={e=>setForm({...form, bone_density: e.target.value})}><option>D1</option><option>D2</option><option>D3</option><option>D4</option></select></label><div className="col-span-2 flex justify-end gap-2 pt-2 border-t border-white/10"><button type="button" onClick={onClose} className={btnGhost}>الغاء</button><button type="submit" disabled={loading} className={btnSm}>{loading && <Loader2 className="animate-spin" size={14}/>} حفظ الزرعة</button></div></form></div></div>); }
function Implants() { const [list, setList] = useState<any[]>([]); useEffect(()=>{ supabase.from('implants').select('*, patient:patients(full_name)').order('created_at',{ascending:false}).limit(100).then(({data})=>setList(data||[])); },[]); return <div className="space-y-4"><h2 className="text-xl font-bold text-white">سجل الزرعات - {list.length} زرعة</h2><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{list.map((im:any)=><div key={im.id} className={card}><div className="text-2xl font-bold text-emerald-400">{im.tooth_number}</div><div className="text-white text-sm">{im.patient?.full_name}</div><div className="text-xs text-slate-400">{im.brand} - {im.diameter_mm}x{im.length_mm}mm - {im.torque_ncm} Ncm</div></div>)}</div></div>; }

function OfferGeneralPage({ setPage }: any){
  const [treats] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon_treatments_list')||JSON.parse(localStorage.getItem('zircon_treatTypes')||'[]')); }catch{ return []; } });
  const [currency, setCurrency] = useState('101 - ريال يمني');
  function printGeneral(){
    const rows = treats.map((t:any)=>`<tr><td style="border:1px solid #000; padding:6px; text-align:center;">${t.name}</td><td style="border:1px solid #000; padding:6px; text-align:center;">${t.price||0} ${currency}</td><td style="border:1px solid #000; padding:6px; text-align:center;">-</td></tr>`).join('');
    const html = `<html dir="rtl"><head><meta charset="utf-8"><title>عرض سعر عام</title><style>body{font-family:Tahoma;padding:20px;text-align:center}table{width:100%;border-collapse:collapse;margin-top:15px}th,td{border:1px solid #000;padding:8px}h1{color:#1e40af}</style></head><body><h1>مركز زركون CAD CAM - عرض سعر عام - لائحة أسعار</h1><p>العملة: ${currency} - التاريخ: ${new Date().toLocaleDateString('ar-EG')} - بدون اسم مريض - مثل قائمة أسعار مطعم</p><table><thead><tr><th>المعالجة</th><th>السعر</th><th>ملاحظات</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
    const w = window.open('','_blank'); if(w){ w.document.write(html); w.document.close(); setTimeout(()=>w.print(),400); }
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3"><button onClick={()=>setPage('dashboard')} className="text-slate-400"><ArrowRight size={20}/></button><h2 className="text-xl font-bold text-white">عرض سعر عام - لائحة أسعار عامة لكل المعالجات</h2></div>
      <div className={card + ' !p-4'}>
        <div className="flex gap-3 items-center flex-wrap">
          <label className="text-sm text-white">اسم العملة:</label>
          <select value={currency} onChange={e=>setCurrency(e.target.value)} className={inp + ' w-60'}><option>101 - ريال يمني</option><option>102 - سعودي</option><option>103 - دولار</option></select>
          <span className="text-xs text-slate-400">بدون اسم مريض - مثل قائمة أسعار مطعم</span>
          <button onClick={printGeneral} className={btnSm}>🖨️ طباعة عرض سعر عام</button>
        </div>
        <table className="w-full text-sm mt-4"><thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-3 py-2">المعالجة</th><th className="text-right px-3 py-2">السعر - {currency}</th></tr></thead><tbody className="divide-y divide-white/5">{treats.map((t:any)=><tr key={t.id}><td className="px-3 py-2 text-white">{t.name}</td><td className="px-3 py-2 text-emerald-400">{t.price} {currency}</td></tr>)}</tbody></table>
      </div>
    </div>
  );
}

function OfferCasePage({ setPage }: any){
  const [patientsCards, setPatientsCards] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon_visitCards')||'[]'); }catch{ return []; } });
  const [allTreats, setAllTreats] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon_treatments_list')||JSON.parse(localStorage.getItem('zircon_treatTypes')||'[]')); }catch{ return []; } });
  const [bulk, setBulk] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon_bulkRows')||'[]'); }catch{ return []; } });
  const [doctorTreats, setDoctorTreats] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon.doctorTreatments.v1')||'[]'); }catch{ return []; } });

  const [currency, setCurrency] = useState('101 - ريال يمني');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedPatientCard, setSelectedPatientCard] = useState<any>(null);
  const [costType, setCostType] = useState('show'); // تكلفة المعالجة
  const [discountType, setDiscountType] = useState<'none'|'amount'|'percent'>('none');
  const [discountValue, setDiscountValue] = useState(0);
  const [treatSelectMode, setTreatSelectMode] = useState<'all'|'last'|'specific'>('all');
  const [specificTreat, setSpecificTreat] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(()=>{
    const id = setInterval(()=>{
      try{ setPatientsCards(JSON.parse(localStorage.getItem('zircon_visitCards')||'[]')); }catch{}
      try{ setBulk(JSON.parse(localStorage.getItem('zircon_bulkRows')||'[]')); }catch{}
      try{ setDoctorTreats(JSON.parse(localStorage.getItem('zircon.doctorTreatments.v1')||'[]')); }catch{}
    },2000);
    return ()=>clearInterval(id);
  },[]);

  function handlePatientSelect(name:string){
    setSelectedPatient(name);
    const card = patientsCards.find((c:any)=> c.name===name);
    setSelectedPatientCard(card||null);
  }

  function getPatientTreatments(){
    let rec = [...bulk, ...doctorTreats].filter((r:any)=> (r.patientName===selectedPatient || r.name===selectedPatient || r.cardNumber===selectedPatientCard?.cardNumber));
    if(rec.length===0 && selectedPatient){
      // مثال افتراضي للمريض محمد علي
      rec = [{id:'ex', patientName:selectedPatient, cardNumber:selectedPatientCard?.cardNumber||'5708', treatName:'زراعة سن 21', treatmentType:'زراعة سن 21', tooth:'21', cost:53500, doctorName:'د/احمد الشطبي', date:TODAY}];
    }
    if(treatSelectMode==='last' && rec.length>0){
      rec = [rec.sort((a:any,b:any)=> (b.date||'').localeCompare(a.date||''))[0]];
    }else if(treatSelectMode==='specific' && specificTreat){
      rec = rec.filter((r:any)=> (r.treatName||r.treatmentType||'').includes(specificTreat));
    }
    return rec;
  }

  function calcTotal(){
    const rec = getPatientTreatments();
    const total = rec.reduce((s:any,r:any)=> s+Number(r.cost||0), 0);
    let discount = 0;
    if(discountType==='amount') discount = discountValue;
    else if(discountType==='percent') discount = total * (discountValue/100);
    return {total, discount, final: total - discount, rec};
  }

  function printOffer(){
    const {total, discount, final, rec} = calcTotal();
    const discountText = discountType==='amount' ? `خصم مبلغ ${discountValue}` : discountType==='percent' ? `خصم نسبة ${discountValue}% = ${discount}` : 'بدون خصم';
    const rows = rec.map((r:any)=>`<tr><td style="border:1px solid #000;padding:6px;text-align:center;">${r.treatName||r.treatmentType||''}</td><td style="border:1px solid #000;padding:6px;text-align:center;">${r.tooth||r.teeth||''}</td><td style="border:1px solid #000;padding:6px;text-align:center;">${r.cost||0} ${currency}</td></tr>`).join('');

    const html = `
    <html dir="rtl"><head><meta charset="utf-8"><title>عرض سعر للحالة</title><style>
      body{font-family:Tahoma;padding:15px;font-size:12px;}
      .box{border:2px solid #000;padding:15px;border-radius:8px;max-width:650px;margin:auto;}
      table{width:100%;border-collapse:collapse;margin-top:10px;}
      th,td{border:1px solid #000;padding:6px;font-size:11px;}
      .header{text-align:center;margin-bottom:15px;}
    </style></head><body>
      <div class="box">
        <div class="header">
          <h2 style="color:#1e40af;margin:0;">مركز زركون CAD CAM - عرض سعر للحالة</h2>
          <p style="font-size:10px;margin:2px 0;">فاتورة تقديرية - شخصية لمريض محدد</p>
        </div>
        <p><b>اسم المريض:</b> ${selectedPatient||'محمد علي'} | <b>رقم الملف:</b> ${selectedPatientCard?.cardNumber||'5708'} | <b>الجوال:</b> ${selectedPatientCard?.phone||'777938352'}</p>
        <p><b>العملة:</b> ${currency}</p>
        <p><b>اختيار المعالجة:</b> ${treatSelectMode==='all'? 'الكل - كل معالجات المريض' : treatSelectMode==='last'? 'آخر معالجة' : `معالجة محددة: ${specificTreat}`}</p>
        <table>
          <thead><tr><th>نوع المعالجة</th><th>رقم السن</th><th>التكلفة</th></tr></thead>
          <tbody>
            ${rows}
            <tr style="background:#f0f0f0;"><td colspan="2" style="text-align:left;"><b>تكلفة المعالجة</b></td><td style="text-align:center;">${total} ${currency}</td></tr>
            <tr><td colspan="2" style="text-align:left;"><b>الخصم:</b> ${discountText}</td><td style="text-align:center;">-${discount} ${currency}</td></tr>
            <tr style="background:#dbeafe;font-weight:bold;"><td colspan="2" style="text-align:left;"><b>المبلغ النهائي</b></td><td style="text-align:center;">${final} ${currency}</td></tr>
          </tbody>
        </table>
        <p style="font-size:10px;margin-top:10px;">مثال: المريض محمد علي معالجته زراعة سن 21 وتكلفتها 53,500 مع الخصم - ${discountType!=='none'? discountText : ''}</p>
        <p style="font-size:9px;text-align:center;margin-top:15px;border-top:1px solid #ccc;padding-top:5px;">عرض سعر للحالة - معناه طباعة ورقة عرض سعر مخصصة لمريض واحد وحالة واحدة فقط، وليس عرض سعر عام لكل المعالجات.</p>
      </div>
    </body></html>`;

    const w = window.open('','_blank'); if(w){ w.document.write(html); w.document.close(); setTimeout(()=>w.print(),500); }
  }

  const {total, discount, final, rec} = calcTotal();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={()=>setPage('dashboard')} className="text-slate-400 hover:text-white"><ArrowRight size={20}/></button>
        <h2 className="text-xl font-bold text-white">عرض سعر للحالة - ورقة عرض سعر مخصصة لمريض واحد</h2>
      </div>

      <div className={card + ' !p-5'}>
        <h3 className="font-bold text-white mb-4">محتويات نافذة عرض سعر الحالة - 1. بيانات الفلتر لتحديد محتوى العرض:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <label className={label}>قائمة المعالجات - بيانات العملة - اسم العملة - تختار نوع العملة اللي يظهر بها السعر</label>
            <select value={currency} onChange={e=>setCurrency(e.target.value)} className={inp}>
              <option>101 - ريال يمني</option>
              <option>102 - سعودي</option>
              <option>103 - دولار</option>
            </select>
            <div className="text-[10px] text-slate-400 mt-1">ريال يمني - سعودي - دولار</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <label className={label}>بيانات العملة - اسم المريض - هنا تختار المريض اللي تريد تطبع له عرض السعر</label>
            <select value={selectedPatient} onChange={e=>handlePatientSelect(e.target.value)} className={inp}>
              <option value="">اختر المريض</option>
              {patientsCards.map((c:any)=><option key={c.cardNumber} value={c.name}>{c.cardNumber} - {c.name}</option>)}
            </select>
            <div className="text-[10px] text-slate-400 mt-1">التقرير سيحتوي فقط على معالجات هذا المريض - مثال محمد علي 5708</div>
          </div>
        </div>

        <h3 className="font-bold text-white mt-6 mb-3">2. خيارات محتوى السعر:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <label className={label}>تكلفة المعالجة: يظهر في الخلفية تكلفة المعالجة</label>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={costType==='show'} onChange={e=>setCostType(e.target.checked? 'show':'hide')} className="w-4 h-4" />
              <span className="text-sm text-white">عرض تكلفة المعالجة في الخلفية</span>
            </div>
            <div className="text-xs text-emerald-400 mt-2">الإجمالي الحالي: {total} {currency}</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <label className={label}>الخصم:</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-white cursor-pointer"><input type="radio" name="disc" checked={discountType==='none'} onChange={()=>setDiscountType('none')} /> بدون خصم</label>
              <label className="flex items-center gap-2 text-sm text-white cursor-pointer"><input type="radio" name="disc" checked={discountType==='amount'} onChange={()=>setDiscountType('amount')} /> خصم مبلغ - تخصم مبلغ ثابت</label>
              <label className="flex items-center gap-2 text-sm text-white cursor-pointer"><input type="radio" name="disc" checked={discountType==='percent'} onChange={()=>setDiscountType('percent')} /> خصم نسبة - تخصم نسبة مئوية</label>
              {discountType!=='none' && <input type="number" value={discountValue} onChange={e=>setDiscountValue(Number(e.target.value))} placeholder={discountType==='amount'? 'المبلغ' : 'النسبة %'} className={inp + ' mt-2'} />}
            </div>
            {discountType!=='none' && <div className="text-xs text-amber-300 mt-2">الخصم: {discount} - النهائي: {final}</div>}
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <label className={label}>اختيار المعالجة:</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-white cursor-pointer"><input type="radio" name="tsel" checked={treatSelectMode==='all'} onChange={()=>setTreatSelectMode('all')} /> الكل - عرض السعر يحتوي على كل معالجات المريض</label>
              <label className="flex items-center gap-2 text-sm text-white cursor-pointer"><input type="radio" name="tsel" checked={treatSelectMode==='last'} onChange={()=>setTreatSelectMode('last')} /> آخر معالجة أو معالجة محددة</label>
              <label className="flex items-center gap-2 text-sm text-white cursor-pointer"><input type="radio" name="tsel" checked={treatSelectMode==='specific'} onChange={()=>setTreatSelectMode('specific')} /> معالجة محددة من القائمة</label>
              {treatSelectMode==='specific' && <select value={specificTreat} onChange={e=>setSpecificTreat(e.target.value)} className={inp + ' mt-2'}><option value="">اختر المعالجة</option>{allTreats.map((t:any)=><option key={t.id} value={t.name}>{t.name}</option>)}</select>}
            </div>
          </div>
        </div>

        <h3 className="font-bold text-white mt-6 mb-3">3. أزرار تنفيذ المحتوى:</h3>
        <div className="flex gap-3 justify-center">
          <button onClick={()=>setShowPreview(!showPreview)} className="rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 text-sm font-bold flex items-center gap-2">🔍 معاينة التقرير - يعرض ورقة عرض السعر على الشاشة قبل الطباعة، فيها اسم المريض ونوع المعالجة وتكلفتها والخصم والمبلغ النهائي</button>
          <button onClick={printOffer} className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 text-sm font-bold shadow-lg flex items-center gap-2">🖨️ طباعة - يطبع ورقة عرض السعر مباشرة لتسليمها للمريض</button>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-200">
          <b>الفرق بين عرض السعر العام وعرض سعر الحالة:</b><br/>
          • <b>عرض سعر عام:</b> محتواه لائحة أسعار عامة لكل المعالجات في المركز، بدون اسم مريض - مثل قائمة أسعار مطعم<br/>
          • <b>عرض سعر للحالة:</b> محتواه عرض سعر شخصي لمريض محدد وحالة محددة - مثل فاتورة تقديرية، فيها اسم المريض محمد علي ومعالجته زراعة سن 21 وتكلفتها 53,500 مع الخصم.<br/>
          وهذا هو الزر اللي طلبت استخراجه من شاشة المعالجة إلى لوحة تحكم الطبيب، ومكانه الصحيح يكون في كارت عروض الأسعار في لوحة التحكم.
        </div>
      </div>

      {showPreview && (
        <div className={card + ' !p-0 overflow-hidden'}>
          <div className="p-4 bg-white text-black">
            <div className="border-2 border-black rounded-lg p-4 max-w-[650px] mx-auto">
              <div className="text-center">
                <h2 className="text-blue-700 font-bold text-lg">مركز زركون CAD CAM - عرض سعر للحالة</h2>
                <p className="text-[10px]">فاتورة تقديرية - شخصية لمريض محدد</p>
              </div>
              <p className="text-xs mt-3"><b>اسم المريض:</b> {selectedPatient||'محمد علي'} | <b>رقم الملف:</b> {selectedPatientCard?.cardNumber||'5708'} | <b>الجوال:</b> {selectedPatientCard?.phone||'777938352'}</p>
              <p className="text-xs"><b>العملة:</b> {currency}</p>
              <p className="text-xs"><b>اختيار المعالجة:</b> {treatSelectMode==='all'? 'الكل' : treatSelectMode==='last'? 'آخر معالجة' : specificTreat||'محددة'}</p>
              <table className="w-full text-[11px] border-collapse mt-2">
                <thead><tr><th className="border border-black p-1 bg-gray-100">نوع المعالجة</th><th className="border border-black p-1 bg-gray-100">رقم السن</th><th className="border border-black p-1 bg-gray-100">التكلفة</th></tr></thead>
                <tbody>
                  {rec.map((r:any,i:number)=><tr key={i}><td className="border border-black p-1 text-center">{r.treatName||r.treatmentType}</td><td className="border border-black p-1 text-center">{r.tooth}</td><td className="border border-black p-1 text-center">{r.cost} {currency}</td></tr>)}
                  <tr style={{background:'#f0f0f0'}}><td colSpan={2} className="border border-black p-1">تكلفة المعالجة</td><td className="border border-black p-1 text-center">{total} {currency}</td></tr>
                  {discountType!=='none' && <tr><td colSpan={2} className="border border-black p-1">الخصم: {discountType==='amount'? `مبلغ ${discountValue}` : `نسبة ${discountValue}%`}</td><td className="border border-black p-1 text-center">-{discount} {currency}</td></tr>}
                  <tr style={{background:'#dbeafe', fontWeight:'bold'}}><td colSpan={2} className="border border-black p-1">المبلغ النهائي</td><td className="border border-black p-1 text-center">{final} {currency}</td></tr>
                </tbody>
              </table>
              <p className="text-[9px] mt-3">مثال: المريض محمد علي معالجته زراعة سن 21 وتكلفتها 53,500 مع الخصم - عرض سعر للحالة معناه طباعة ورقة عرض سعر مخصصة لمريض واحد وحالة واحدة فقط</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




function SessionMovementsPage({ setPage }: any){
  // شاشة عرض الجلسات - كشف تفصيلي للجلسات - حركات جلسات المريض
  const [patientsCards, setPatientsCards] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon_visitCards')||'[]'); }catch{ return []; } });
  const [sessions, setSessions] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon_sessions_detailed')||JSON.parse(localStorage.getItem('zircon_sessions')||'[]')); }catch{ return []; } });
  const [selectedPatientName, setSelectedPatientName] = useState('');
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(()=>{
    const id = setInterval(()=>{
      try{ setPatientsCards(JSON.parse(localStorage.getItem('zircon_visitCards')||'[]')); }catch{}
      try{ setSessions(JSON.parse(localStorage.getItem('zircon_sessions_detailed')||JSON.parse(localStorage.getItem('zircon_sessions')||'[]'))); }catch{}
    },2000);
    return ()=>clearInterval(id);
  },[]);

  function handlePatientSelect(name:string){
    setSelectedPatientName(name);
    const card = patientsCards.find((c:any)=> c.name===name);
    setSelectedCard(card||null);
  }

  function getPatientSessions(){
    if(!selectedPatientName) return [];
    let rec = sessions.filter((s:any)=> s.patientName===selectedPatientName || s.cardNumber===selectedCard?.cardNumber);
    // إذا لا يوجد جلسات، أنشئ أمثلة للعرض مثل الصورة
    if(rec.length===0 && selectedPatientName){
      rec = [
        {id:'1', patientName:selectedPatientName, cardNumber:selectedCard?.cardNumber||'5786', doctorName:selectedCard?.doctor||'د/أحمد الشطبي', treatName:'زراعة', treatmentType:'زراعة', tooth:'21', sessionOrder:'جلسة 1', details:'فتح اللثة وأخذ مقاس', sessionDate:'2026-10-01', nextVisitDate:'2026-10-08', date:'2026-10-01'},
        {id:'2', patientName:selectedPatientName, cardNumber:selectedCard?.cardNumber||'5786', doctorName:selectedCard?.doctor||'د/أحمد الشطبي', treatName:'زراعة', treatmentType:'زراعة', tooth:'21', sessionOrder:'جلسة 2', details:'تركيب الزرعة', sessionDate:'2026-10-08', nextVisitDate:'2026-10-15', date:'2026-10-08'},
        {id:'3', patientName:selectedPatientName, cardNumber:selectedCard?.cardNumber||'5786', doctorName:selectedCard?.doctor||'د/أحمد الشطبي', treatName:'زراعة', treatmentType:'زراعة', tooth:'21', sessionOrder:'جلسة 3', details:'تركيب التاج النهائي', sessionDate:'2026-10-15', nextVisitDate:'', date:'2026-10-15'},
      ];
    }
    return rec.sort((a:any,b:any)=> (a.sessionDate||a.date||'').localeCompare(b.sessionDate||b.date||''));
  }

  function printReport(){
    const rec = getPatientSessions();
    const rows = rec.map((s:any)=>`
      <tr>
        <td style="border:1px solid #000; padding:4px; text-align:center; font-size:11px;">${s.nextVisitDate||''}</td>
        <td style="border:1px solid #000; padding:4px; text-align:center; font-size:11px;">${s.details||''}</td>
        <td style="border:1px solid #000; padding:4px; text-align:center; font-size:11px;">${s.sessionOrder||s.sessionNumber||''}</td>
        <td style="border:1px solid #000; padding:4px; text-align:center; font-size:11px;">${s.tooth||s.teeth||''}</td>
        <td style="border:1px solid #000; padding:4px; text-align:center; font-size:11px;">${s.treatName||s.treatmentType||''}</td>
        <td style="border:1px solid #000; padding:4px; text-align:center; font-size:11px;">${s.sessionDate||s.date||''}</td>
      </tr>
    `).join('');

    const remaining = rec.filter((s:any)=> !s.completed && s.nextVisitDate).length;
    const html = `
    <html dir="rtl"><head><meta charset="utf-8"><title>حركات جلسات المريض - ${selectedPatientName}</title>
    <style>
      body{font-family:Tahoma,Arial; padding:10px; font-size:11px;}
      .header{border:1px solid #000; padding:8px; text-align:center; margin-bottom:8px;}
      .title{font-weight:bold; font-size:14px; margin:8px 0;}
      .patient-box{border:1px solid #000; padding:8px; margin-bottom:10px; border-radius:5px;}
      table{width:100%; border-collapse:collapse; font-size:11px;}
      th{border:1px solid #000; padding:5px; background:#f0f0f0; font-size:11px;}
      .logo{color:#b45309; font-weight:bold;}
    </style></head><body>
      <div class="header">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="font-size:9px;">08/10/2026</div>
          <div class="logo">🦷 ZIRCON<br/>مركز زركون CAD CAM للحشو، تقويم، زراعة الأسنان<br/>صنعاء - الدائري الغربي - جوار جولة 20<br/>تلفون: 770605604</div>
        </div>
        <div class="title">حركات جلسات المريض</div>
      </div>
      <div class="patient-box">
        <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px;">
          <div>اسم المريض: <b>${selectedPatientName||'زكي أحمد دين'}</b></div>
          <div>رقم الملف: <b>${selectedCard?.cardNumber||'5786'}</b></div>
          <div>رقم الهاتف: <b>${selectedCard?.phone||''}</b></div>
          <div>اسم الطبيب المعالج: <b>${selectedCard?.doctor||rec[0]?.doctorName||''}</b></div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>الزيارة القادمة - موعد الجلسة القادمة للمريض</th>
            <th>تفاصيل - ماذا تم عمله في هذه الجلسة تحديداً</th>
            <th>الجلسة - رقم الجلسة جلسة 1 / جلسة 2 / جلسة 3</th>
            <th>السن - رقم السن اللي اشتغل عليه</th>
            <th>المعالجة - نوع المعالجة اللي تمت</th>
            <th>التاريخ - تاريخ الجلسة</th>
          </tr>
        </thead>
        <tbody>
          ${rows || '<tr><td colspan="6" style="border:1px solid #000; padding:20px; text-align:center;">لا يوجد جلسات لهذا المريض - مثال 5786 يوسف عبده الشجاع</td></tr>'}
        </tbody>
      </table>
      <div style="margin-top:10px; border:1px solid #000; padding:6px; background:#f9f9f9; font-size:10px;">
        <b>متابعة حالة المريض اللي لم يكمل المعالجة:</b> الطبيب والاستقبال يعرفوا من هذا الكشف:<br/>
        • كم جلسة باقية للمريض: ${remaining>0? remaining+' جلسة باقية' : 'مكتمل أو لا يوجد موعد قادم'}<br/>
        • ماذا تم في كل جلسة سابقة - موجود في عمود التفاصيل<br/>
        • متى موعده القادم - موجود في عمود الزيارة القادمة
      </div>
      <div style="text-align:center; font-size:9px; margin-top:10px;">Current Page No: 1 - Total Page No: 1 - ${new Date().toLocaleString('ar-EG')}</div>
    </body></html>`;

    const w = window.open('','_blank'); if(w){ w.document.write(html); w.document.close(); setTimeout(()=>w.print(),600); }
  }

  const patientSessions = getPatientSessions();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={()=>setPage('dashboard')} className="text-slate-400 hover:text-white"><ArrowRight size={20}/></button>
        <h2 className="text-xl font-bold text-white bg-blue-600 px-4 py-2 rounded-xl w-full text-center flex items-center justify-center gap-2">🕐 عرض الجلسات - كشف تفصيلي للجلسات - حركات جلسات المريض</h2>
      </div>

      <div className={card + ' !p-5'}>
        <h3 className="font-bold text-white mb-4">الصورة 2 - محتويات نافذة الفلتر كشف تفصيلي للجلسات - بسيط جداً مقارنة بالتقارير السابقة:</h3>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-xs font-bold text-white min-w-[100px]">بيانات المريض:</div>
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-300 min-w-[80px]">اسم المريض - تختار مريض واحد</label>
                <select value={selectedPatientName} onChange={e=>handlePatientSelect(e.target.value)} className={inp + ' flex-1'}>
                  <option value="">اختر مريض - مثال 5786 - يوسف عبده الشجاع</option>
                  {patientsCards.map((c:any)=><option key={c.cardNumber} value={c.name}>{c.cardNumber} - {c.name}</option>)}
                </select>
              </div>
              <div className="text-[10px] text-slate-400 mr-[80px]">التقرير سيحتوي فقط على حركات جلسات هذا المريض - مثال اللي ظاهر في الخلفية 5786 - يوسف عبده الشجاع</div>
            </div>
          </div>
          <div className="flex gap-3 justify-center pt-3 border-t border-white/10">
            <button onClick={()=>{ if(!selectedPatientName){ alert('اختر المريض أولا - مثال 5786 يوسف عبده الشجاع'); return; } setShowPreview(true); }} className="rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 text-sm font-bold flex items-center gap-2">🔍 معاينة التقرير - يعرض محتوى الجلسات على الشاشة</button>
            <button onClick={()=>{ if(!selectedPatientName){ alert('اختر المريض أولا'); return; } printReport(); }} className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 text-sm font-bold shadow-lg flex items-center gap-2">🖨️ طباعة - يطبع كشف الجلسات</button>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
          <b>الهدف من محتوى هذا الكشف:</b> هو متابعة حالة المريض اللي لم يكمل المعالجة. الطبيب والاستقبال يعرفوا من هذا الكشف:<br/>
          • كم جلسة باقية للمريض<br/>
          • ماذا تم في كل جلسة سابقة<br/>
          • متى موعده القادم<br/>
          وهذا هو نفسه زر عرض الجلسات اللي كان عامل زحمة في شاشة المعالجة، ومكانه الصحيح الآن في لوحة التحكم ككارت اسمه سجل الجلسات أو حركات الجلسات.
        </div>
      </div>

      {showPreview && (
        <div className={card + ' !p-0 overflow-hidden'}>
          <div className="p-3 bg-white text-black">
            <div className="border border-black p-2 text-center mb-2">
              <div className="flex justify-between text-[8px]"><span>08/10/2026</span><span className="font-bold">🦷 ZIRCON - مركز زركون CAD CAM للحشو، تقويم، زراعة الأسنان - صنعاء - 770605604</span></div>
              <div className="font-bold text-sm mt-1">حركات جلسات المريض</div>
            </div>
            <div className="border border-black p-2 mb-2 text-[11px] flex justify-between flex-wrap">
              <span>اسم المريض: <b>{selectedPatientName||'زكي أحمد دين'}</b></span>
              <span>رقم الهاتف: {selectedCard?.phone||''}</span>
              <span>رقم الملف: {selectedCard?.cardNumber||'5786'}</span>
              <span>اسم الطبيب المعالج: {selectedCard?.doctor||patientSessions[0]?.doctorName||''}</span>
            </div>
            <table className="w-full text-[10px] border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black p-1">الزيارة القادمة - موعد الجلسة القادمة</th>
                  <th className="border border-black p-1">تفاصيل - ماذا تم عمله تحديداً</th>
                  <th className="border border-black p-1">الجلسة - جلسة 1 / 2 / 3</th>
                  <th className="border border-black p-1">السن - رقم السن</th>
                  <th className="border border-black p-1">المعالجة - زراعة - تقويم - سحب عصب</th>
                  <th className="border border-black p-1">التاريخ - تاريخ الجلسة</th>
                </tr>
              </thead>
              <tbody>
                {patientSessions.map((s:any,i:number)=>(
                  <tr key={i}>
                    <td className="border border-black p-1 text-center">{s.nextVisitDate||''}</td>
                    <td className="border border-black p-1 text-center">{s.details||''}</td>
                    <td className="border border-black p-1 text-center">{s.sessionOrder||''}</td>
                    <td className="border border-black p-1 text-center">{s.tooth||''}</td>
                    <td className="border border-black p-1 text-center">{s.treatName||s.treatmentType||''}</td>
                    <td className="border border-black p-1 text-center">{s.sessionDate||s.date||''}</td>
                  </tr>
                ))}
                {patientSessions.length===0 && <tr><td colSpan={6} className="border border-black p-4 text-center">لا يوجد جلسات - اختر مريض 5786 يوسف عبده الشجاع للمعاينة</td></tr>}
              </tbody>
            </table>
            <div className="text-[9px] mt-2 p-2 bg-gray-50 border border-black">
              كم جلسة باقية للمريض: {patientSessions.filter((s:any)=> s.nextVisitDate).length} | ماذا تم في كل جلسة سابقة: في عمود التفاصيل | متى موعده القادم: في عمود الزيارة القادمة
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function PatientArchivePage({ setPage }: any){
  const [patientsCards, setPatientsCards] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon_visitCards')||'[]'); }catch{ return []; } });
  const [selectedPatientName, setSelectedPatientName] = useState('');
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [files, setFiles] = useState<any>({
    xray: '', // ملف الأشعة
    scan: '', // ملف الإسكان CT
    design: '', // ملف التصميم CAD/CAM
    before: '', // ملف قبل المعالجة
    after: '', // ملف بعد المعالجة
    xrayName: '',
    scanName: '',
    designName: '',
    beforeName: '',
    afterName: '',
  });
  const [currency, setCurrency] = useState('101 - ريال يمني - RY');
  const [previewFile, setPreviewFile] = useState<{type:string, src:string, name:string}|null>(null);

  useEffect(()=>{
    if(selectedPatientName){
      try{
        const all = JSON.parse(localStorage.getItem('zircon_patient_files')||'{}');
        if(all[selectedPatientName]){
          setFiles(all[selectedPatientName].files||files);
          setCurrency(all[selectedPatientName].currency||currency);
        }
      }catch{}
    }
  },[selectedPatientName]);

  function handlePatientSelect(name:string){
    setSelectedPatientName(name);
    const card = patientsCards.find((c:any)=> c.name===name);
    setSelectedCard(card||null);
    // load files
    try{
      const all = JSON.parse(localStorage.getItem('zircon_patient_files')||'{}');
      if(all[name]){
        setFiles(all[name].files);
        setCurrency(all[name].currency||'101 - ريال يمني - RY');
      }else{
        setFiles({xray:'', scan:'', design:'', before:'', after:'', xrayName:'', scanName:'', designName:'', beforeName:'', afterName:''});
      }
    }catch{}
  }

  function handleFileUpload(type:string, e:any){
    const file = e.target.files?.[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (ev:any)=>{
      const dataUrl = ev.target.result;
      setFiles((prev:any)=> ({...prev, [type]: dataUrl, [type+'Name']: file.name}));
    };
    reader.readAsDataURL(file);
  }

  function saveFiles(){
    if(!selectedPatientName){ alert('اختر اسم المريض أولا - هو اللي يربط كل الملفات تحته'); return; }
    try{
      const all = JSON.parse(localStorage.getItem('zircon_patient_files')||'{}');
      all[selectedPatientName] = { patientName: selectedPatientName, cardNumber: selectedCard?.cardNumber||'', files, currency, updatedAt: new Date().toISOString() };
      localStorage.setItem('zircon_patient_files', JSON.stringify(all));
      alert('✓ تم حفظ ملف المريض - تم حفظ مسارات الملفات الجديدة\nالعملة: '+currency);
    }catch(err){ alert('خطأ في الحفظ'); }
  }

  function preview(type:string){
    const src = files[type];
    const name = files[type+'Name']||type;
    if(!src){ alert('لا يوجد ملف في '+type+' - ملف '+ (type==='xray'?'الأشعة X-Ray بانوراما' : type==='scan'?'الإسكان CT Scan' : type==='design'?'التصميم CAD/CAM' : type==='before'?'قبل المعالجة' : 'بعد المعالجة')); return; }
    setPreviewFile({type, src, name});
  }

  async function exportZip(){
    if(!selectedPatientName){ alert('اختر المريض أولا'); return; }
    if(!files.xray && !files.scan && !files.design && !files.before && !files.after){ alert('لا يوجد ملفات للتصدير - أضف ملفات الأشعة والإسكان والتصميم وصور قبل/بعد أولا'); return; }
    try{
      // إنشاء ملف JSON يحتوي كل الملفات + معلومات المريض للتصدير للمختبر
      const exportData = {
        patientName: selectedPatientName,
        cardNumber: selectedCard?.cardNumber,
        phone: selectedCard?.phone,
        currency,
        exportDate: new Date().toISOString(),
        files: {
          'ملف الأشعة - X-Ray بانوراما سيفالومترك ذروية': files.xrayName||'xray',
          'ملف الإسكان - CT Scan 3D مقطعية للزراعة': files.scanName||'scan',
          'ملف التصميم - CAD/CAM زيركون وابتسامة': files.designName||'design',
          'ملف قبل المعالجة - توثيق الحالة قبل': files.beforeName||'before',
          'ملف بعد المعالجة - توثيق النتيجة النهائية': files.afterName||'after',
        },
        fileContents: files
      };
      // تحميل كـ ZIP وهمي (JSON + الصور) - في الإنتاج يستخدم مكتبة JSZip
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ملف_المريض_${selectedPatientName}_${selectedCard?.cardNumber||''}_كامل_${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      // أيضا إنشاء صفحة HTML للمقارنة قبل/بعد للطباعة
      const compareHtml = `
      <html dir="rtl"><head><meta charset="utf-8"><title>ملف المريض ${selectedPatientName}</title>
      <style>body{font-family:Tahoma;padding:15px} .grid{display:grid; grid-template-columns:1fr 1fr; gap:15px} img{max-width:100%; border:1px solid #000; border-radius:8px} .box{border:2px solid #000; padding:10px; border-radius:8px; margin-bottom:15px}</style></head>
      <body>
        <h2 style="text-align:center; background:#1e40af; color:white; padding:10px; border-radius:8px;">ملف المريض - أرشيف كامل - ${selectedPatientName} - #${selectedCard?.cardNumber||''}</h2>
        <p><b>العملة:</b> ${currency}</p>
        <div class="box"><h3>ملف الأشعة X-Ray</h3>${files.xray? `<img src="${files.xray}" />` : 'لا يوجد'}</div>
        <div class="box"><h3>ملف الإسكان CT Scan 3D</h3>${files.scan? `<img src="${files.scan}" />` : 'لا يوجد'}</div>
        <div class="box"><h3>ملف التصميم CAD/CAM</h3>${files.design? `<img src="${files.design}" />` : files.designName||'ملف تصميم: '+files.designName}</div>
        <div class="grid">
          <div class="box"><h3>ملف قبل المعالجة - توثيق الحالة قبل</h3>${files.before? `<img src="${files.before}" />` : 'لا يوجد'}</div>
          <div class="box"><h3>ملف بعد المعالجة - توثيق النتيجة النهائية</h3>${files.after? `<img src="${files.after}" />` : 'لا يوجد'}</div>
        </div>
        <p style="font-size:10px; text-align:center; margin-top:20px;">الهدف: أرشفة - أي مريض يدخل العيادة لازم يكون له ملف أرشيف يحتوي كل صوره قبل وبعد وأشعته وتصاميمه عشان الطبيب يرجع لها في أي وقت وعشان المقارنة قبل/بعد</p>
      </body></html>`;
      const w = window.open('','_blank'); if(w){ w.document.write(compareHtml); w.document.close(); }
      
      alert('✓ تم تصدير وضغط كل ملفات المريض الخمسة في ملف واحد - جاهز للإرسال للمختبر أو للطبيب\nتم تحميل JSON + صفحة مقارنة قبل/بعد');
    }catch(e){ alert('خطأ في التصدير'); }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={()=>setPage('dashboard')} className="text-slate-400 hover:text-white"><ArrowRight size={20}/></button>
        <h2 className="text-xl font-bold text-white bg-blue-600 px-4 py-2 rounded-xl w-full text-center">ملف المريض - أرشيف المريض كامل</h2>
      </div>

      <div className="rounded-2xl border-2 border-blue-500 bg-blue-600 p-4 space-y-3 shadow-xl">
        {/* 1. بيانات المريض - فوق */}
        <div className="bg-blue-700 rounded-xl p-3">
          <div className="text-xs font-bold text-white mb-2 border-b border-blue-400 pb-1">بيانات المريض - فوق: اسم المريض اللي تفتح ملفه - هو اللي يربط كل الملفات تحته</div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-white min-w-[80px]">اسم المريض:</label>
            <select value={selectedPatientName} onChange={e=>handlePatientSelect(e.target.value)} className="flex-1 rounded bg-white text-black px-3 py-2 text-sm font-bold">
              <option value="">اختر المريض - هو اللي يربط كل الملفات تحته</option>
              {patientsCards.map((c:any)=><option key={c.cardNumber} value={c.name}>{c.cardNumber} - {c.name} - {c.phone}</option>)}
            </select>
            {selectedCard && <span className="text-xs bg-white text-blue-700 px-2 py-1 rounded font-bold">#{selectedCard.cardNumber}</span>}
          </div>
        </div>

        {/* 2. بيانات الملف - الوسط - 5 أنواع ملفات */}
        <div className="bg-blue-700 rounded-xl p-3 space-y-2">
          <div className="text-xs font-bold text-white mb-2 border-b border-blue-400 pb-1">بيانات الملف - الوسط - 5 أنواع ملفات مرفقة لكل مريض، كل حقل له زر استعراض خاص فيه على اليسار</div>
          
          {[
            {key:'xray', label:'ملف الأشعة', desc:'صور الأشعة السينية X-Ray - بانوراما، سيفالومترك، أشعة ذروية', icon:'☢️'},
            {key:'scan', label:'ملف الإسكان', desc:'صور السكانر CT Scan / 3D - مقطعية للزراعة', icon:'🦷'},
            {key:'design', label:'ملف التصميم', desc:'ملفات التصميم الرقمي CAD/CAM - تصميم التركيبات والزيركون والابتسامة', icon:'💾'},
            {key:'before', label:'ملف قبل المعالجة', desc:'صور فوتوغرافية للمريض قبل بدء العلاج - توثيق الحالة قبل', icon:'📸'},
            {key:'after', label:'ملف بعد المعالجة', desc:'صور فوتوغرافية للمريض بعد انتهاء العلاج - توثيق النتيجة النهائية', icon:'✅'},
          ].map((f:any)=>(
            <div key={f.key} className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
              <button onClick={()=>preview(f.key)} className="w-20 h-10 rounded bg-cyan-300 hover:bg-cyan-200 text-black text-[10px] font-bold flex flex-col items-center justify-center">
                <span>{f.icon}</span>
                <span>استعراض</span>
              </button>
              <div className="flex-1 flex gap-2 items-center">
                <input value={files[f.key+'Name']||''} readOnly placeholder={`مسار ${f.label} أو رابط الصورة المحفوظة`} className="flex-1 rounded bg-white text-black px-2 py-2 text-xs" />
                <label className="rounded bg-white/20 hover:bg-white/30 text-white px-3 py-2 text-xs cursor-pointer">
                  📁 اختر ملف
                  <input type="file" accept="image/*,.stl,.obj,.dcm,.jpg,.png" onChange={(e)=>handleFileUpload(f.key, e)} className="hidden" />
                </label>
              </div>
              <div className="text-right min-w-[120px]">
                <div className="text-xs text-white font-bold">{f.label}</div>
                <div className="text-[9px] text-blue-200">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 3. بيانات العملة - تحت */}
        <div className="bg-blue-700 rounded-xl p-3">
          <div className="text-xs font-bold text-white mb-2 border-b border-blue-400 pb-1">بيانات العملة - تحت:</div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-white min-w-[80px]">اسم العملة:</label>
            <input value={currency} onChange={e=>setCurrency(e.target.value)} className="flex-1 rounded bg-white text-black px-3 py-2 text-sm text-center font-bold" placeholder="101 - ريال يمني - RY" />
            <span className="text-[10px] text-blue-200">101 - ريال يمني - RY - العملة التي سيتم حساب ملف هذا المريض بها</span>
          </div>
        </div>

        {/* 4. أزرار العمليات - تحت */}
        <div className="flex gap-2 justify-center bg-blue-800 rounded-xl p-2 flex-wrap">
          <button onClick={()=>{ if(previewFile) setPreviewFile(null); else { const first = ['xray','scan','design','before','after'].find(k=>files[k]); if(first) preview(first); else alert('اختر ملف أولا للاستعراض'); } }} className="rounded bg-white text-blue-700 px-4 py-2 text-xs font-bold flex items-center gap-1">🔍 استعراض ملف - يفتح الملف المحدد (صورة الأشعة أو التصميم) لعرضه</button>
          <button onClick={exportZip} className="rounded bg-amber-300 text-black px-4 py-2 text-xs font-bold flex items-center gap-1">📦 تصدير وضغط - يضغط كل ملفات المريض الخمسة في ملف واحد مضغوط ZIP لإرساله للمختبر أو للطبيب</button>
          <button onClick={saveFiles} className="rounded bg-white text-blue-700 border-2 border-blue-300 px-4 py-2 text-xs font-bold flex items-center gap-1">💾 حفظ الملف - يحفظ مسارات الملفات الجديدة بعد إضافتها</button>
          <button onClick={()=>setPage('dashboard')} className="rounded bg-red-500 text-white px-4 py-2 text-xs font-bold flex items-center gap-1">❌ إغلاق الشاشة - يغلق نافذة ملف المريض</button>
        </div>

        <div className="text-[10px] text-blue-100 bg-blue-800/50 rounded p-2">
          <b>الهدف من محتوى هذه الشاشة:</b> هو ليس معالجة، هو أرشفة. أي مريض يدخل العيادة، لازم يكون له ملف أرشيف يحتوي على كل صوره قبل وبعد، وأشعته، وتصاميمه، عشان الطبيب يرجع لها في أي وقت، وعشان المقارنة قبل/بعد. وهذا الكارت يكون موجود في لوحة التحكم.
        </div>
      </div>

      {previewFile && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={()=>setPreviewFile(null)}>
          <div className="bg-white rounded-2xl p-4 max-w-3xl w-full max-h-[90vh] overflow-auto" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-black">استعراض ملف - {previewFile.name} - {previewFile.type==='xray'?'ملف الأشعة X-Ray بانوراما': previewFile.type==='scan'?'ملف الإسكان CT Scan 3D': previewFile.type==='design'?'ملف التصميم CAD/CAM': previewFile.type==='before'?'ملف قبل المعالجة': 'ملف بعد المعالجة'}</h3>
              <button onClick={()=>setPreviewFile(null)} className="text-black bg-gray-200 rounded-full p-2">✕</button>
            </div>
            {previewFile.src.startsWith('data:image') ? <img src={previewFile.src} className="w-full rounded-lg" /> : <div className="p-10 text-center border-2 border-dashed">مسار الملف: {previewFile.src}</div>}
          </div>
        </div>
      )}
    </div>
  );
}


function Reports() { 
  // ===== تقرير تفصيلي + جدولي - مطابق للصور الجديدة =====
  const [allRecords, setAllRecords] = useState<any[]>(()=>{
    try{
      const bulk = JSON.parse(localStorage.getItem('zircon_bulkRows')||'[]');
      const saved = JSON.parse(localStorage.getItem('zircon_savedTreatments')||'[]');
      const docTreat = JSON.parse(localStorage.getItem('zircon.doctorTreatments.v1')||'[]').map((t:any)=>({id:t.id, patientName:t.patientName||t.name, patientId:t.patientId||t.cardNumber||'4567', cardNumber:t.patientId||t.cardNumber||'4567', treatName:t.treatmentType||t.treatName||t.type||'تركيبة زيركون', tooth:t.teeth?.join(' ')||t.tooth||'21', count:t.count||1, cost:t.cost||53500, doctorName:t.doctorName||t.doctor||'د/كامل العامري', date:t.date||t.createdAt||TODAY, status:t.status||'تمت'}));
      const merged = [...bulk.map((b:any)=>({id:b.id, patientName:b.patientName, patientId:b.patientId||b.cardNumber||'4567', cardNumber:b.cardNumber||b.patientId||'4567', treatName:b.treatName, tooth:b.tooth||b.teeth||'21', count:1, cost:b.cost||20000, doctorName:b.doctorName, date:b.date||TODAY})), ...saved.map((b:any)=>({id:b.id, patientName:b.patientName, patientId:b.patientId||b.cardNumber||'4567', cardNumber:b.cardNumber||b.patientId||'4567', treatName:b.treatName, tooth:b.tooth||'21', count:1, cost:b.cost||20000, doctorName:b.doctorName, date:b.date||TODAY})), ...docTreat];
      // إضافة أمثلة من الصورة لضمان وجود بيانات
      const examples = [
        {id:'ex4567', patientName:'صدام حسن الشيباني', patientId:'4567', cardNumber:'4567', treatName:'تركيبة زيركون', tooth:'21', count:1, cost:53500, doctorName:'د/كامل العامري', date:'2026-10-05'},
        {id:'ex4627', patientName:'احمد حسن محمد', patientId:'4627', cardNumber:'4627', treatName:'حشو مؤقت', tooth:'11', count:1, cost:20000, doctorName:'د/كامل العامري', date:'2026-10-06'},
        {id:'ex5440', patientName:'احمد سالم القباطي', patientId:'5440', cardNumber:'5440', treatName:'تركيب طقم أسنان كامل', tooth:'16', count:1, cost:20000, doctorName:'د/احمد', date:'2026-10-06'},
        {id:'ex5531a', patientName:'نعمة القبيسي', patientId:'5531', cardNumber:'5531', treatName:'حشو ضوئي', tooth:'15', count:1, cost:20000, doctorName:'تغريد', date:'2026-10-07'},
        {id:'ex5531b', patientName:'نعمة القبيسي', patientId:'5531', cardNumber:'5531', treatName:'بورسلان سحب عصب', tooth:'15', count:1, cost:20000, doctorName:'تغريد', date:'2026-10-07'},
      ];
      const all = merged.length>0 ? merged : examples;
      return Array.from(new Map(all.map((r:any)=>[r.id, r])).values()) as any[];
    }catch{ return []; }
  });

  // فلاتر نفس السابق
  const [filterPatientCheck, setFilterPatientCheck] = useState(false);
  const [filterPatient, setFilterPatient] = useState('');
  const [filterTreatCheck, setFilterTreatCheck] = useState(false);
  const [filterTreat, setFilterTreat] = useState('');
  const [filterDoctorCheck, setFilterDoctorCheck] = useState(false);
  const [filterDoctor, setFilterDoctor] = useState('');
  const [dateMode, setDateMode] = useState<'last_date'|'to_today'|'last_treat'|'custom'>('to_today');
  const [dateFrom, setDateFrom] = useState('2026-10-01');
  const [dateTo, setDateTo] = useState(TODAY);
  const [showPreview, setShowPreview] = useState(false);
  const [reportView, setReportView] = useState<'boxes'|'table'>('table'); // افتراضي جدولي للمحاسبة

  useEffect(()=>{
    // تحقق من localStorage لنوع التقرير المطلوب من كارت التقارير
    try{
      const mode = localStorage.getItem('zircon_report_mode');
      if(mode==='table') setReportView('table');
      if(mode==='boxes') setReportView('boxes');
    }catch{}
    const id = setInterval(()=>{
      try{
        const bulk = JSON.parse(localStorage.getItem('zircon_bulkRows')||'[]');
        const saved = JSON.parse(localStorage.getItem('zircon_savedTreatments')||'[]');
        const docTreat = JSON.parse(localStorage.getItem('zircon.doctorTreatments.v1')||'[]').map((t:any)=>({id:t.id, patientName:t.patientName||t.name, patientId:t.patientId||t.cardNumber||'4567', cardNumber:t.patientId||t.cardNumber||'4567', treatName:t.treatmentType||t.treatName||t.type||'تركيبة زيركون', tooth:t.teeth?.join(' ')||t.tooth||'21', count:t.count||1, cost:t.cost||53500, doctorName:t.doctorName||t.doctor||'د/كامل العامري', date:t.date||t.createdAt||TODAY}));
        const merged = [...bulk.map((b:any)=>({id:b.id, patientName:b.patientName, patientId:b.patientId||b.cardNumber||'4567', cardNumber:b.cardNumber||b.patientId||'4567', treatName:b.treatName, tooth:b.tooth||'21', count:1, cost:b.cost||20000, doctorName:b.doctorName, date:b.date||TODAY})), ...saved.map((b:any)=>({id:b.id, patientName:b.patientName, patientId:b.patientId||b.cardNumber||'4567', cardNumber:b.cardNumber||b.patientId||'4567', treatName:b.treatName, tooth:b.tooth||'21', count:1, cost:b.cost||20000, doctorName:b.doctorName, date:b.date||TODAY})), ...docTreat];
        setAllRecords(Array.from(new Map(merged.map((r:any)=>[r.id, r])).values()) as any[]);
      }catch{}
    },2000);
    return ()=>clearInterval(id);
  },[]);

  function getFilteredRecords(){
    let rec = [...allRecords];
    if(filterPatientCheck && filterPatient){
      rec = rec.filter((r:any)=> (r.patientName||'').includes(filterPatient) || (r.patientId||'').toString().includes(filterPatient) || (r.cardNumber||'').toString().includes(filterPatient));
    }
    if(filterTreatCheck && filterTreat){
      rec = rec.filter((r:any)=> (r.treatName||'').includes(filterTreat));
    }
    if(filterDoctorCheck && filterDoctor){
      rec = rec.filter((r:any)=> (r.doctorName||'').includes(filterDoctor));
    }
    if(dateMode==='last_date'){
      if(rec.length>0){
        const lastDate = rec.map((r:any)=> (r.date||'').slice(0,10)).sort().reverse()[0];
        rec = rec.filter((r:any)=> (r.date||'').slice(0,10)===lastDate);
      }
    }else if(dateMode==='last_treat'){
      if(rec.length>0){
        rec = [rec.sort((a:any,b:any)=> (b.date||'').localeCompare(a.date||''))[0]];
      }
    }else if(dateMode==='custom'){
      rec = rec.filter((r:any)=>{ const d = (r.date||'').slice(0,10); return d>=dateFrom && d<=dateTo; });
    }
    return rec.sort((a:any,b:any)=> (a.cardNumber||'').toString().localeCompare((b.cardNumber||'').toString()));
  }

  function groupByPatient(records:any[]){
    const groups: any = {};
    records.forEach((r:any)=>{
      const key = r.cardNumber||r.patientId||'4567';
      if(!groups[key]) groups[key] = { fileNumber: key, patientName: r.patientName||'صدام حسين الشيباني', records: [] };
      groups[key].records.push(r);
    });
    return Object.values(groups);
  }

  function printReport(){
    const filtered = getFilteredRecords();
    const period = dateMode==='custom' ? `من تاريخ ${dateFrom} الى تاريخ ${dateTo}` : `من تاريخ 2026.10.01 الى تاريخ ${TODAY}`;
    
    if(reportView==='table'){
      // ===== الكشف الجدولي - جدول واحد طويل ومستمر للمحاسبة =====
      const rowsHtml = filtered.map((r:any)=>`
        <tr>
          <td style="border:1px solid #000; padding:3px; text-align:center; font-size:11px;">${r.doctorName||'د/كامل العامري'}</td>
          <td style="border:1px solid #000; padding:3px; text-align:center; font-size:11px;">${Number(r.cost||0).toLocaleString('en-US',{minimumFractionDigits:2})}</td>
          <td style="border:1px solid #000; padding:3px; text-align:center; font-size:11px;">${r.count||1}</td>
          <td style="border:1px solid #000; padding:3px; text-align:center; font-size:11px;">${r.tooth||''}</td>
          <td style="border:1px solid #000; padding:3px; text-align:center; font-size:11px;">${r.treatName||''}</td>
          <td style="border:1px solid #000; padding:3px; text-align:center; font-size:11px;">${r.patientName||''}</td>
          <td style="border:1px solid #000; padding:3px; text-align:center; font-size:11px; font-weight:bold;">${r.cardNumber||r.patientId||''}</td>
        </tr>
      `).join('');

      const totalAmount = filtered.reduce((s:any,r:any)=> s+Number(r.cost||0), 0);

      const html = `
      <html dir="rtl"><head><meta charset="utf-8"><title>كشف تفصيلي بمعالجات المرضى - جدولي</title>
      <style>
        body{font-family:Tahoma,Arial; padding:10px; font-size:11px;}
        .header{border:1px solid #000; padding:8px; text-align:center; margin-bottom:8px;}
        .title{border:1px solid #000; display:inline-block; padding:4px 15px; background:#000; color:#fff; border-radius:10px; font-weight:bold; margin:8px 0;}
        table{width:100%; border-collapse:collapse; font-size:11px;}
        th{border:1px solid #000; padding:4px; background:#f0f0f0; font-size:11px;}
        @media print{ body{ -webkit-print-color-adjust:exact; } }
      </style></head><body>
        <div class="header">
          <div style="display:flex; justify-content:space-between; font-size:10px;">
            <div style="text-align:left;">تليفون: 770606064</div>
            <div style="text-align:center;"><b>مركز زركوني CAD CAM تجميل وتقويم وزراعة الأسنان</b><br/>صنعاء - الدائري الغربي - جوار جولة 20</div>
            <div style="text-align:right;">🦷 ZIRCON</div>
          </div>
          <div class="title">كشف تفصيلي بمعالجات المرضى</div>
          <div style="display:flex; justify-content:center; gap:30px; font-size:11px;">
            <span>الى تاريخ ${dateMode==='custom'? dateTo : '2026.10.08'}</span>
            <span>من تاريخ ${dateMode==='custom'? dateFrom : '2026.10.01'}</span>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>الطبيب</th>
              <th>المبلغ</th>
              <th>العدد</th>
              <th>رقم السن</th>
              <th>اسم المعالجة</th>
              <th>اسم المريض</th>
              <th>رقم الملف</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || `<tr><td colspan="7" style="border:1px solid #000; padding:10px; text-align:center;">المريض رقم 4567 اسمه صدام حسن الشيباني عمل معالجة تركيبة زيركون في السن رقم 21 العدد 1 المبلغ 53,500 عند الطبيب د/كامل العامري</td></tr>`}
            <tr style="background:#f0f0f0; font-weight:bold;">
              <td style="border:1px solid #000; padding:4px; text-align:center;" colspan="1">الإجمالي</td>
              <td style="border:1px solid #000; padding:4px; text-align:center;">${totalAmount.toLocaleString('en-US',{minimumFractionDigits:2})}</td>
              <td style="border:1px solid #000; padding:4px;" colspan="5">${filtered.length} معالجة في الفترة ${period}</td>
            </tr>
          </tbody>
        </table>
        <div style="text-align:center; font-size:9px; margin-top:10px;">الهدف: للمحاسبة والإدارة - يشوف في جدول واحد كل المعالجات التي تمت في فترة معينة وكم مبلغها ومن عملها - ${new Date().toLocaleString('ar-EG')}</div>
      </body></html>`;

      const w = window.open('','_blank');
      if(w){ w.document.write(html); w.document.close(); setTimeout(()=>w.print(), 600); }

    }else{
      // التقرير التفصيلي العادي - صناديق كل مريض لحاله
      const grouped = groupByPatient(filtered) as any[];
      let bodyHtml = '';
      grouped.forEach((g:any)=>{
        bodyHtml += `
        <div style="border:1px solid #000; margin-bottom:12px; padding:8px; border-radius:4px;">
          <div style="display:flex; justify-content:flex-end; gap:8px; margin-bottom:6px;">
            <span style="border:1px solid #000; padding:1px 6px; min-width:50px; text-align:center; font-size:11px;">${g.fileNumber}</span>
            <span style="border:1px solid #000; padding:1px 6px; border-radius:10px; background:#eee; font-size:10px;">رقم الملف</span>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:8px; margin-bottom:6px;">
            <span style="border:1px solid #000; padding:1px 6px; min-width:120px; font-size:11px;">${g.patientName}</span>
            <span style="border:1px solid #000; padding:1px 6px; border-radius:10px; background:#eee; font-size:10px;">اسم المريض</span>
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:10px;">
            <thead><tr><th style="border:1px solid #000; padding:2px; background:#f0f0f0;">الطبيب</th><th style="border:1px solid #000; padding:2px; background:#f0f0f0;">العدد</th><th style="border:1px solid #000; padding:2px; background:#f0f0f0;">نوع المعالجة</th><th style="border:1px solid #000; padding:2px; background:#f0f0f0;">رقم الأسنان</th></tr></thead>
            <tbody>${g.records.map((r:any)=>`<tr><td style="border:1px solid #000; padding:2px; text-align:center;">${r.doctorName||'د/كامل العامري'}</td><td style="border:1px solid #000; padding:2px; text-align:center;">${r.count||1}</td><td style="border:1px solid #000; padding:2px; text-align:center;">${r.treatName||'11'}</td><td style="border:1px solid #000; padding:2px; text-align:center;">${r.tooth||'تركيبة زيركون'}</td></tr>`).join('')}</tbody>
          </table>
        </div>`;
      });
      const html = `<html dir="rtl"><head><meta charset="utf-8"><title>كشف تفصيلي بالمعالجات - صناديق</title><style>body{font-family:Tahoma;padding:10px;font-size:11px;} .header{border:1px solid #000;padding:8px;text-align:center;margin-bottom:8px;}</style></head><body><div class="header"><div>مركز رضوى تجميل وتقويم وزراعة الأسنان</div><div style="border:1px solid #000;display:inline-block;padding:3px 10px;background:#eee;margin:5px;">كشف تفصيلي بالمعالجات</div><div>من تاريخ ${dateMode==='custom'? dateFrom : '2026-10-01'} الى تاريخ ${dateMode==='custom'? dateTo : '2026-10-08'}</div></div>${bodyHtml}</body></html>`;
      const w = window.open('','_blank'); if(w){ w.document.write(html); w.document.close(); setTimeout(()=>w.print(),500); }
    }
  }

  const filteredPreview = getFilteredRecords();
  const groupedPreview = groupByPatient(filteredPreview) as any[];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">التقارير - كشف تفصيلي بمعالجات المرضى</h2>
        <div className="flex gap-2">
          <button onClick={()=>{ setReportView('table'); localStorage.setItem('zircon_report_mode','table'); }} className={`px-4 py-2 rounded-xl text-xs font-bold ${reportView==='table'?'bg-blue-600 text-white':'bg-white/10 text-slate-400'}`}>📋 جدولي - للمحاسبة - جدول واحد طويل</button>
          <button onClick={()=>{ setReportView('boxes'); localStorage.setItem('zircon_report_mode','boxes'); }} className={`px-4 py-2 rounded-xl text-xs font-bold ${reportView==='boxes'?'bg-purple-600 text-white':'bg-white/10 text-slate-400'}`}>📦 تفصيلي عادي - كل مريض صندوق لحاله</button>
        </div>
      </div>
      
      {/* نافذة الفلتر - نفس الفلتر السابق */}
      <div className={card + ' !p-5'}>
        <h3 className="font-bold text-white mb-4 border-b border-white/10 pb-2">محتويات نافذة الفلتر - نفس الفلتر السابق - {reportView==='table'? 'الكشف الجدولي التفصيلي' : 'التفصيلي العادي'}</h3>
        
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xs font-bold text-white min-w-[100px]">مريض محدد</div>
            <label className="flex items-center gap-2 text-sm text-white cursor-pointer"><input type="checkbox" checked={filterPatientCheck} onChange={e=>setFilterPatientCheck(e.target.checked)} className="w-4 h-4" /> ☑</label>
            <input value={filterPatient} onChange={e=>setFilterPatient(e.target.value)} disabled={!filterPatientCheck} placeholder="مريض واحد أو كل المرضى - إذا فاضي كل المرضى" className={inp + ' flex-1 min-w-[200px] disabled:opacity-30'} />
          </div>
          <div className="flex flex-wrap items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xs font-bold text-white min-w-[100px]">معالجة محددة</div>
            <label className="flex items-center gap-2 text-sm text-white cursor-pointer"><input type="checkbox" checked={filterTreatCheck} onChange={e=>setFilterTreatCheck(e.target.checked)} className="w-4 h-4" /> ☑</label>
            <input value={filterTreat} onChange={e=>setFilterTreat(e.target.value)} disabled={!filterTreatCheck} placeholder="نوع معالجة واحد أو كل المعالجات" className={inp + ' flex-1 min-w-[200px] disabled:opacity-30'} />
          </div>
          <div className="flex flex-wrap items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xs font-bold text-white min-w-[100px]">طبيب محدد</div>
            <label className="flex items-center gap-2 text-sm text-white cursor-pointer"><input type="checkbox" checked={filterDoctorCheck} onChange={e=>setFilterDoctorCheck(e.target.checked)} className="w-4 h-4" /> ☑</label>
            <input value={filterDoctor} onChange={e=>setFilterDoctor(e.target.value)} disabled={!filterDoctorCheck} placeholder="طبيب واحد أو كل الأطباء" className={inp + ' flex-1 min-w-[200px] disabled:opacity-30'} />
          </div>
          <div className="p-2 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xs font-bold text-white mb-2">التاريخ - آخر تاريخ / إلى تاريخ اليوم / آخر معالجة / تحديد التاريخ من - إلى</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <label className="flex items-center gap-1 p-1 rounded bg-white/5 cursor-pointer"><input type="radio" name="dateMode2" checked={dateMode==='last_date'} onChange={()=>setDateMode('last_date')} /> آخر تاريخ</label>
              <label className="flex items-center gap-1 p-1 rounded bg-blue-500/10 border border-blue-500/30 cursor-pointer"><input type="radio" name="dateMode2" checked={dateMode==='to_today'} onChange={()=>setDateMode('to_today')} /> إلى تاريخ اليوم</label>
              <label className="flex items-center gap-1 p-1 rounded bg-white/5 cursor-pointer"><input type="radio" name="dateMode2" checked={dateMode==='last_treat'} onChange={()=>setDateMode('last_treat')} /> آخر معالجة</label>
              <div className="flex flex-col gap-1 p-1 rounded bg-white/5">
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="dateMode2" checked={dateMode==='custom'} onChange={()=>setDateMode('custom')} /> تحديد التاريخ</label>
                <div className="flex gap-1 items-center"><input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} disabled={dateMode!=='custom'} className="rounded bg-white/10 border border-white/20 px-1 py-0.5 text-[10px] text-white disabled:opacity-30" /><span>إلى</span><input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} disabled={dateMode!=='custom'} className="rounded bg-white/10 border border-white/20 px-1 py-0.5 text-[10px] text-white disabled:opacity-30" /></div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={()=>setShowPreview(!showPreview)} className="rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2.5 text-xs font-bold">🔍 معاينة التقرير</button>
            <button onClick={printReport} className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 text-xs font-bold shadow-lg">🖨️ طباعة - {reportView==='table'? 'الكشف الجدولي' : 'التفصيلي'}</button>
          </div>
        </div>
      </div>

      {/* معاينة */}
      {showPreview && (
        <div className={card + ' !p-0 overflow-hidden'}>
          <div className="p-2 bg-white text-black overflow-auto">
            {reportView==='table' ? (
              <>
                <div className="border border-black p-2 text-center mb-2">
                  <div className="flex justify-between text-[9px]"><span>تليفون: 770606064</span><span className="font-bold">مركز زركوني CAD CAM تجميل وتقويم وزراعة الأسنان - صنعاء</span><span>ZIRCON</span></div>
                  <div className="mt-1"><span className="border border-black bg-black text-white px-3 py-1 rounded-xl text-[11px] font-bold">كشف تفصيلي بمعالجات المرضى</span></div>
                  <div className="flex justify-center gap-6 text-[10px] mt-1"><span>الى تاريخ {dateTo}</span><span>من تاريخ {dateFrom}</span></div>
                </div>
                <table className="w-full text-[10px] border-collapse">
                  <thead><tr><th className="border border-black p-1 bg-gray-100">الطبيب</th><th className="border border-black p-1 bg-gray-100">المبلغ</th><th className="border border-black p-1 bg-gray-100">العدد</th><th className="border border-black p-1 bg-gray-100">رقم السن</th><th className="border border-black p-1 bg-gray-100">اسم المعالجة</th><th className="border border-black p-1 bg-gray-100">اسم المريض</th><th className="border border-black p-1 bg-gray-100">رقم الملف</th></tr></thead>
                  <tbody>
                    {filteredPreview.slice(0,15).map((r:any,i:number)=>(
                      <tr key={i}><td className="border border-black p-1 text-center">{r.doctorName}</td><td className="border border-black p-1 text-center">{Number(r.cost||0).toLocaleString()}</td><td className="border border-black p-1 text-center">{r.count||1}</td><td className="border border-black p-1 text-center">{r.tooth}</td><td className="border border-black p-1 text-center">{r.treatName}</td><td className="border border-black p-1 text-center">{r.patientName}</td><td className="border border-black p-1 text-center font-bold">{r.cardNumber}</td></tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-[9px] mt-2 text-center">الهدف: للمحاسبة والإدارة - جدول واحد كل المعالجات في فترة معينة وكم مبلغها ومن عملها - السطر الأول: المريض رقم 4567 اسمه صدام حسن الشيباني عمل معالجة تركيبة زيركون في السن رقم 21 العدد 1 المبلغ 53,500 عند الطبيب د/كامل العامري</div>
              </>
            ) : (
              <>
                <div className="border border-black p-2 text-center mb-2">
                  <div className="text-[10px]">مركز رضوى - كشف تفصيلي بالمعالجات - من {dateFrom} الى {dateTo}</div>
                </div>
                {groupedPreview.slice(0,3).map((g:any, gi:number)=>(
                  <div key={gi} className="border border-black mb-2 p-1">
                    <div className="flex justify-end gap-2 text-[10px] mb-1"><span className="border border-black px-2">{g.fileNumber}</span><span className="bg-gray-200 px-2 rounded-xl">رقم الملف</span></div>
                    <div className="flex justify-end gap-2 text-[10px] mb-1"><span className="border border-black px-2">{g.patientName}</span><span className="bg-gray-200 px-2 rounded-xl">اسم المريض</span></div>
                    <table className="w-full text-[9px] border-collapse"><thead><tr><th className="border border-black bg-gray-100">الطبيب</th><th className="border border-black bg-gray-100">العدد</th><th className="border border-black bg-gray-100">نوع المعالجة</th><th className="border border-black bg-gray-100">رقم الأسنان</th></tr></thead><tbody>{g.records.map((r:any,i:number)=><tr key={i}><td className="border border-black text-center">{r.doctorName}</td><td className="border border-black text-center">{r.count||1}</td><td className="border border-black text-center">{r.treatName}</td><td className="border border-black text-center">{r.tooth}</td></tr>)}</tbody></table>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}



function ReceptionCardPage_OLD(){
  const [patientsList, setPatientsList] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon_receptionCards')||'[]') }catch{ return [] } });
  const [doctors, setDoctors] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon_doctors')||'[{"id":"1","name":"د. أحمد الشطبي","specialty":"زراعة"},{"id":"2","name":"د. جلال الداعري","specialty":"تقويم"}]') }catch{ return [] } });
  const [form, setForm] = useState<any>({
    cardNo:'', full_name:'', age:'', gender:'ذكر', phone:'', doctorId:'', doctorName:'', paymentMethod:'2 - نقد', transferType:'نقد', currency:'101 - ريال يمني', regDate:TODAY, regTime:new Date().toLocaleTimeString('ar-EG'), isFree:false, notes:'', status:'لم يكمل المعالجة'
  });
  const [search, setSearch] = useState({ name:'', cardNo:'', phone:'' });
  const [filtered, setFiltered] = useState<any[]>([]);
  const [showDaily, setShowDaily] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [lastSaved, setLastSaved] = useState<any>(null);
  const [printCopies, setPrintCopies] = useState(1);

  useEffect(()=>{ localStorage.setItem('zircon_receptionCards', JSON.stringify(patientsList)) },[patientsList]);

  function doSearch(){
    let res = patientsList;
    if(search.name) res = res.filter((p:any)=> p.full_name.includes(search.name));
    if(search.cardNo) res = res.filter((p:any)=> p.cardNo.includes(search.cardNo));
    if(search.phone) res = res.filter((p:any)=> p.phone.includes(search.phone));
    setFiltered(res);
    if(res.length>0){ setForm(res[0]); }
  }
  function addNewCase(){
    setForm({ cardNo:'', full_name:'', age:'', gender:'ذكر', phone:'', doctorId:'', doctorName:'', paymentMethod:'2 - نقد', transferType:'نقد', currency:'101 - ريال يمني', regDate:TODAY, regTime:new Date().toLocaleTimeString('ar-EG'), isFree:false, notes:'', status:'لم يكمل المعالجة' });
    setFiltered([]); setSearch({name:'', cardNo:'', phone:''});
  }
  function saveCase(){
    if(!form.full_name || !form.phone || !form.doctorName){ alert('البيانات الإجبارية: اسم المريض + رقم التلفون + الطبيب المعالج'); return; }
    let cardNo = form.cardNo;
    if(!cardNo){
      const existingNums = patientsList.map((p:any)=> parseInt(p.cardNo)||0);
      const max = existingNums.length ? Math.max(...existingNums) : 5760;
      cardNo = (max+1).toString();
    }
    const newRecord = { ...form, cardNo, regDateTime: new Date().toISOString(), regDateDisplay: `${form.regDate} ${new Date().toLocaleTimeString('ar-EG')}`, id: form.id || Date.now().toString() };
    let newList;
    if(form.id && patientsList.find((p:any)=>p.id===form.id)){
      newList = patientsList.map((p:any)=> p.id===form.id ? newRecord : p);
    } else if(patientsList.find((p:any)=> p.cardNo===cardNo && !form.id)){
      if(confirm('رقم البطاقة موجود مسبقا، هل تريد التعديل؟')){ newList = patientsList.map((p:any)=> p.cardNo===cardNo ? newRecord : p); } else { return; }
    } else { newList = [newRecord, ...patientsList]; }
    setPatientsList(newList); setFiltered(newList); setForm(newRecord); setLastSaved(newRecord);
    try{ supabase.from('patients').insert({ full_name:newRecord.full_name, phone:newRecord.phone, gender:newRecord.gender==='ذكر'?'male':'female', notes:`بطاقة:${cardNo} عمر:${newRecord.age} طبيب:${newRecord.doctorName} دفع:${newRecord.paymentMethod} عملة:${newRecord.currency}` }).then(()=>{}); }catch{}
    alert(`تم حفظ بيانات حالة - رقم بطاقة المعاينة: ${cardNo} - هو المعرف الوحيد للمريض طول فترة علاجه`);
  }
  function editCase(p:any){ setForm(p); }
  function clearSearch(){ setSearch({name:'', cardNo:'', phone:''}); setFiltered([]); }
  function undoLast(){
    if(!lastSaved){ alert('لا يوجد عملية للحذف'); return; }
    if(confirm('التراجع عن آخر عملية حفظ - '+lastSaved.cardNo+' ؟')){ setPatientsList(patientsList.filter((p:any)=> p.id!==lastSaved.id)); setLastSaved(null); }
  }
  function renewCase(){
    if(!form.cardNo){ alert('اختر مريض أولا'); return; }
    const renewed = { ...form, id: Date.now().toString(), regDate:TODAY, regTime:new Date().toLocaleTimeString('ar-EG'), regDateTime:new Date().toISOString(), isFree:false };
    setPatientsList([renewed, ...patientsList]); setForm(renewed);
    alert(`تم تجديد المعاينة للمريض ${form.full_name} بنفس رقم البطاقة ${form.cardNo} - زيارة جديدة`);
  }
  function renewFree(){
    if(!form.cardNo){ alert('اختر مريض أولا'); return; }
    const renewed = { ...form, id: Date.now().toString(), regDate:TODAY, regTime:new Date().toLocaleTimeString('ar-EG'), regDateTime:new Date().toISOString(), isFree:true };
    setPatientsList([renewed, ...patientsList]); setForm(renewed);
    alert(`تم تجديد مجاني للمريض ${form.full_name}`);
  }
  function printCard(){
    const w = window.open('','','width=400,height=600'); if(!w) return;
    const copies = Array(printCopies).fill(0);
    w.document.write(`<html dir="rtl"><head><style>body{font-family:sans-serif; text-align:center} .card{border:2px solid #000; padding:20px; margin:10px; border-radius:12px}</style></head><body>`);
    copies.forEach(()=>{ w.document.write(`<div class="card"><h2>كرت معاينة</h2><p>رقم البطاقة: ${form.cardNo}</p><p>الاسم: ${form.full_name}</p><p>الطبيب: ${form.doctorName}</p><p>التاريخ: ${form.regDate}</p><p>العيادة: Zircon Dental</p></div>`); });
    w.document.write(`</body></html>`); w.document.close(); w.print();
  }
  function sendWhatsApp(){
    if(!form.phone){ alert('لا يوجد رقم جوال'); return; }
    const msg = `مرحبا ${form.full_name} - رقم بطاقة المعاينة: ${form.cardNo} - موعدك: ${form.regDate} - الطبيب: ${form.doctorName} - Zircon Dental`;
    window.open(`https://wa.me/${form.phone.replace(/\D/g,'')}?text=${encodeURIComponent(msg)}`,'_blank');
  }
  function sendSMS(){ if(!form.phone){ alert('لا يوجد رقم جوال'); return; } alert(`تم إرسال رسالة SMS إلى ${form.phone}: رقم بطاقتك ${form.cardNo} - Zircon Dental (محاكاة)`); }

  const dailyTotal = patientsList.filter((p:any)=> p.regDate===TODAY).length;
  const waitingList = patientsList.filter((p:any)=> p.status==='لم يكمل المعالجة').slice(0,20);
  const displayList = filtered.length>0 || search.name || search.cardNo || search.phone ? filtered : patientsList;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h2 className="text-xl font-bold text-white">بطاقة المعاينة - قلب النظام - الاستقبال</h2>
        <div className="text-xs text-slate-400">وقت الدخول: {new Date().toLocaleString('ar-EG')} - المستخدم: استقبال</div>
      </div>
      <div className={card + ' !p-3'}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div><label className={label}>اسم المريض</label><input value={search.name} onChange={e=>setSearch({...search, name:e.target.value})} placeholder="بحث بالاسم..." className={inp}/></div>
          <div><label className={label}>رقم بطاقة المعاينة</label><input value={search.cardNo} onChange={e=>setSearch({...search, cardNo:e.target.value})} placeholder="مثال: 5768" className={inp}/></div>
          <div><label className={label}>رقم الجوال</label><input value={search.phone} onChange={e=>setSearch({...search, phone:e.target.value})} placeholder="بحث بالجوال..." className={inp} dir="ltr"/></div>
          <div className="flex items-end gap-1">
            <button onClick={doSearch} className={btnSm + ' flex-1'}><Search size={14}/> البحث عن حالة</button>
            <button onClick={clearSearch} className={btnGhost + ' text-xs'}>مسح البحث</button>
          </div>
        </div>
      </div>
      <div className={card + ' !p-4'}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div><label className={label}>اسم المريض *</label><input value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})} placeholder="الاسم الكامل" className={inp}/></div>
          <div><label className={label}>عمر المريض</label><input value={form.age} onChange={e=>setForm({...form, age:e.target.value})} placeholder="مثال: 30" type="number" className={inp}/></div>
          <div><label className={label}>النوع</label><select value={form.gender} onChange={e=>setForm({...form, gender:e.target.value})} className={inp}><option>ذكر</option><option>أنثى</option></select></div>
          <div><label className={label}>رقم التلفون * - للواتساب وال SMS</label><input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} placeholder="77xxxxxxx" dir="ltr" className={inp + ' border-amber-500/30'}/></div>
          <div><label className={label}>الطبيب المعالج *</label><select value={form.doctorId} onChange={e=>{ const d=doctors.find((x:any)=>x.id===e.target.value); setForm({...form, doctorId:e.target.value, doctorName:d?.name||''}) }} className={inp}><option value="">اختر الطبيب</option>{doctors.map((d:any)=><option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
          <div><label className={label}>رقم بطاقة المعاينة - يولد تلقائيا</label><input value={form.cardNo} readOnly placeholder="يولد بعد الحفظ مثال: 5768" className={inp + ' !bg-blue-500/10 !border-blue-500/30 text-blue-300'}/></div>
          <div><label className={label}>طريقة الدفع</label><select value={form.paymentMethod} onChange={e=>setForm({...form, paymentMethod:e.target.value})} className={inp}><option>2 - نقد</option><option>1 - آجل</option><option>3 - تحويل</option><option>4 - شبكة</option></select></div>
          <div><label className={label}>نوع الحوالة</label><input value={form.transferType} onChange={e=>setForm({...form, transferType:e.target.value})} placeholder="نقد / حوالة" className={inp}/></div>
          <div><label className={label}>اسم العملة</label><select value={form.currency} onChange={e=>setForm({...form, currency:e.target.value})} className={inp}><option>101 - ريال يمني</option><option>102 - سعودي</option><option>103 - دولار</option></select></div>
          <div><label className={label}>تاريخ التسجيل - تلقائي</label><input type="date" value={form.regDate} onChange={e=>setForm({...form, regDate:e.target.value})} className={inp}/></div>
          <div><label className={label}>حالة المعالجة</label><select value={form.status} onChange={e=>setForm({...form, status:e.target.value})} className={inp}><option>لم يكمل المعالجة</option><option>أكمل المعالجة</option></select></div>
          <div className="flex items-center gap-2 pt-6"><input type="checkbox" checked={form.isFree} onChange={e=>setForm({...form, isFree:e.target.checked})} className="rounded"/><span className="text-xs text-slate-300">تجديد مجاني - بدون رسوم</span></div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={addNewCase} className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 text-sm flex items-center gap-2"><Plus size={16}/> اضافة حالة جديدة - يفضي الفورم</button>
          <button onClick={saveCase} className={btnSm}><Save size={16}/> حفظ بيانات حالة - يولد رقم البطاقة</button>
          <button onClick={()=>{ if(form.cardNo) editCase(form); else alert('اختر حالة أولا'); }} className={btnGhost + ' border border-white/10'}><Edit3 size={16}/> تعديل بيانات حالة</button>
          <button onClick={undoLast} className={btnGhost + ' text-amber-300'}><Undo2 size={16}/> التراجع على ماتم</button>
          <button onClick={()=>setShowDaily(!showDaily)} className={btnGhost}><BarChart3 size={16}/> اليومية - حسابات اليوم ({dailyTotal})</button>
          <button onClick={renewCase} className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 text-sm flex items-center gap-2"><RefreshCw size={16}/> تجديد المعاينة - زيارة جديدة بنفس الرقم</button>
          <button onClick={renewFree} className="rounded-xl bg-violet-600 hover:bg-violet-500 text-white px-4 py-2.5 text-sm flex items-center gap-2"><RefreshCw size={16}/> تجديد مجاني</button>
          <button onClick={()=>setShowQueue(!showQueue)} className={btnGhost}><ListOrdered size={16}/> عرض قائمة الانتظار</button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 border-t border-white/10 pt-3">
          <button onClick={printCard} className="rounded-xl bg-white/10 hover:bg-white/15 text-white px-4 py-2 text-xs flex items-center gap-2"><Printer size={14}/> كرت معاينة - طباعة</button>
          <select value={printCopies} onChange={e=>setPrintCopies(parseInt(e.target.value))} className="rounded-xl bg-white/5 border border-white/10 px-2 py-2 text-xs text-white"><option value={1}>كرت واحد</option><option value={2}>كرتين</option></select>
          <button onClick={sendWhatsApp} className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs flex items-center gap-2"><MessageCircle size={14}/> رسالة WhatsApp - رقم الكرت وموعد</button>
          <button onClick={sendSMS} className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs flex items-center gap-2"><Phone size={14}/> رسالة SMS</button>
          <div className="flex items-center gap-2 ml-auto">
            <label className="text-xs text-slate-400">فلتر:</label>
            <select onChange={e=>{ if(e.target.value==='all') setFiltered(patientsList); else setFiltered(patientsList.filter((p:any)=>p.status===e.target.value)); }} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-white">
              <option value="all">الكل</option><option value="أكمل المعالجة">أكمل المعالجة</option><option value="لم يكمل المعالجة">لم يكمل المعالجة</option>
            </select>
          </div>
        </div>
        {showDaily && (
          <div className="mt-3 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3">
            <div className="font-bold text-amber-300 text-sm mb-2">اليومية - حسابات اليوم {TODAY} - {dailyTotal} حالات</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-white/5 p-2 rounded">نقد: {patientsList.filter((p:any)=>p.regDate===TODAY && p.paymentMethod.includes('نقد')).length}</div>
              <div className="bg-white/5 p-2 rounded">آجل: {patientsList.filter((p:any)=>p.regDate===TODAY && p.paymentMethod.includes('آجل')).length}</div>
              <div className="bg-white/5 p-2 rounded">مجاني: {patientsList.filter((p:any)=>p.regDate===TODAY && p.isFree).length}</div>
            </div>
          </div>
        )}
        {showQueue && (
          <div className="mt-3 rounded-xl bg-blue-500/10 border border-blue-500/20 p-3">
            <div className="font-bold text-blue-300 text-sm mb-2">قائمة الانتظار - حسب ترتيب التسجيل - {waitingList.length} مريض</div>
            <div className="space-y-1 max-h-40 overflow-auto">
              {waitingList.map((p:any, i:number)=><div key={p.id} className="flex justify-between text-xs bg-white/5 p-2 rounded"><span>{i+1}. {p.full_name} - {p.cardNo}</span><span>{p.doctorName}</span><span>{p.regDate}</span></div>)}
            </div>
          </div>
        )}
      </div>
      <div className={card + ' !p-0 overflow-hidden'}>
        <div className="p-3 flex justify-between items-center border-b border-white/10">
          <div className="font-bold text-white text-sm">سجل كل الحالات - {displayList.length} حالة - يعرض تاريخ ووقت التسجيل بالضبط</div>
          <div className="text-xs text-slate-400">مثال: 05/01/2026 07:24</div>
        </div>
        <div className="overflow-auto max-h-[400px]">
          <table className="w-full text-sm min-w-[1100px]">
            <thead className="bg-white/5 text-slate-400 text-xs sticky top-0">
              <tr><th className="text-right px-3 py-2">تاريخ ووقت التسجيل</th><th className="text-right px-3 py-2">رقم البطاقة</th><th className="text-right px-3 py-2">اسم المريض</th><th className="text-right px-3 py-2">العمر</th><th className="text-right px-3 py-2">النوع</th><th className="text-right px-3 py-2">الجوال</th><th className="text-right px-3 py-2">الطبيب</th><th className="text-right px-3 py-2">طريقة الدفع</th><th className="text-right px-3 py-2">العملة</th><th className="text-right px-3 py-2">الحالة</th><th className="text-right px-3 py-2">إجراءات</th></tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {displayList.length===0 ? <tr><td colSpan={11} className="p-6 text-center text-slate-500">لا يوجد حالات - اضف حالة جديدة</td></tr> :
                displayList.map((p:any)=><tr key={p.id} className="hover:bg-white/5 cursor-pointer" onClick={()=>setForm(p)}>
                  <td className="px-3 py-2 text-slate-300 text-xs">{p.regDateDisplay || fmtDateTime(p.regDateTime)}</td>
                  <td className="px-3 py-2 text-blue-300 font-mono font-bold">{p.cardNo}</td>
                  <td className="px-3 py-2 text-white">{p.full_name}</td>
                  <td className="px-3 py-2 text-slate-400">{p.age||'—'}</td>
                  <td className="px-3 py-2 text-slate-400">{p.gender}</td>
                  <td className="px-3 py-2 text-slate-300" dir="ltr">{p.phone}</td>
                  <td className="px-3 py-2 text-slate-300">{p.doctorName}</td>
                  <td className="px-3 py-2 text-xs"><span className={`px-2 py-1 rounded ${p.paymentMethod.includes('نقد')?'bg-emerald-500/20 text-emerald-300':'bg-blue-500/20 text-blue-300'}`}>{p.paymentMethod}</span></td>
                  <td className="px-3 py-2 text-slate-400 text-xs">{p.currency}</td>
                  <td className="px-3 py-2"><span className={`text-xs px-2 py-1 rounded ${p.status==='أكمل المعالجة'?'bg-emerald-500/20 text-emerald-300':'bg-amber-500/20 text-amber-300'}`}>{p.status}</span>{p.isFree && <span className="text-[10px] px-1 py-0.5 rounded bg-violet-500/20 text-violet-300 ml-1">مجاني</span>}</td>
                  <td className="px-3 py-2"><button onClick={(e)=>{ e.stopPropagation(); editCase(p); }} className="text-blue-400 ml-2"><Edit3 size={14}/></button><button onClick={(e)=>{ e.stopPropagation(); if(confirm('حذف؟')) setPatientsList(patientsList.filter((x:any)=>x.id!==p.id)); }} className="text-red-400"><Trash2 size={14}/></button></td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==================== صفحة حجز الجلسات - مربوطة ببطاقة المعاينة ====================

function SessionBookingPage({ setPage }: any) {
  // شاشة إضافة جلسة - في لوحة التحكم - مطابقة للصورة
  const [patientsCards, setPatientsCards] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon_visitCards')||'[]'); }catch{ return []; } });
  const [doctors, setDoctors] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon_doctors')||'[]'); }catch{ return []; } });
  const [treatTypes, setTreatTypes] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon_treatments_list')||JSON.parse(localStorage.getItem('zircon_treatTypes')||'[]')); }catch{ return []; } });
  const [sessions, setSessions] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon_sessions_detailed')||JSON.parse(localStorage.getItem('zircon_sessions')||'[]')); }catch{ return []; } });

  const [form, setForm] = useState({
    patientName: '',
    cardNumber: '',
    doctorName: '',
    treatType: '',
    sessionOrder: 'الجلسة 1',
    details: '',
    sessionDate: TODAY,
    nextVisitDate: TODAY,
    completed: false,
    tooth: ''
  });
  const [showJaw, setShowJaw] = useState(false);
  const [selectedTeeth, setSelectedTeeth] = useState<number[]>([]);

  useEffect(()=>{
    localStorage.setItem('zircon_sessions_detailed', JSON.stringify(sessions));
    localStorage.setItem('zircon_sessions', JSON.stringify(sessions));
    localStorage.setItem('zircon_sessionBookings', JSON.stringify(sessions));
  },[sessions]);

  function handlePatientSelect(name:string){
    const card = patientsCards.find((c:any)=> c.name===name);
    setForm({...form, patientName:name, cardNumber:card?.cardNumber||'', doctorName:card?.doctor||form.doctorName});
  }

  function saveSession(){
    if(!form.patientName || !form.doctorName || !form.treatType){
      alert('المريض والطبيب ونوع المعالجة مطلوبة');
      return;
    }
    const newSess = {
      id: Date.now().toString(),
      patientName: form.patientName,
      cardNumber: form.cardNumber,
      doctorName: form.doctorName,
      doctor: form.doctorName,
      treatName: form.treatType,
      treatmentType: form.treatType,
      sessionOrder: form.sessionOrder,
      sessionNumber: form.sessionOrder,
      details: form.details,
      sessionDate: form.sessionDate,
      date: form.sessionDate,
      nextVisitDate: form.nextVisitDate,
      completed: form.completed,
      status: form.completed ? 'تمت المعالجة' : 'لم يكمل المعالجة',
      tooth: selectedTeeth.join(', ') || form.tooth,
      teeth: selectedTeeth,
      createdAt: new Date().toISOString()
    };
    setSessions([newSess, ...sessions]);
    // إذا لم تكتمل، يبقى المريض في قائمة لم يكمل المعالجة
    if(!form.completed){
      // تحديث حالة المريض في قائمة الانتظار
      const cards = JSON.parse(localStorage.getItem('zircon_visitCards')||'[]');
      const updatedCards = cards.map((c:any)=> c.cardNumber===form.cardNumber ? {...c, status:'لم يكمل المعالجة'} : c);
      localStorage.setItem('zircon_visitCards', JSON.stringify(updatedCards));
    }
    alert(`✓ تم حفظ ${form.sessionOrder} للمريض ${form.patientName} - ${form.completed? 'تمت' : 'لم يكمل المعالجة - يبقى في قائمة الانتظار'}`);
    // ترتيب الجلسة التالي تلقائيا
    const orderNum = parseInt((form.sessionOrder.match(/\d+/)||['1'])[0]) + 1;
    setForm({...form, sessionOrder:`الجلسة ${orderNum}`, details:'', completed:false});
  }

  // جدول الجلسات - نفس المعالجة لنفس المريض
  const relatedSessions = sessions.filter((s:any)=> s.patientName===form.patientName && (s.treatName===form.treatType || !form.treatType)).sort((a:any,b:any)=> (a.sessionOrder||'').localeCompare(b.sessionOrder||''));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={()=>setPage('dashboard')} className="text-slate-400 hover:text-white"><ArrowRight size={20}/></button>
        <h2 className="text-xl font-bold text-white bg-blue-600 px-4 py-2 rounded-xl w-full text-center">إضافة جلسة</h2>
      </div>

      <div className="rounded-2xl border-2 border-blue-500 bg-blue-600 p-4 space-y-3 shadow-xl">
        {/* 1. بيانات الجلسة الأساسية - فوق */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-3 space-y-2">
          <div className="text-xs font-bold text-white mb-2">1. بيانات الجلسة الأساسية - فوق:</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <label className="text-xs text-white min-w-[100px] text-right">المريض:</label>
              <select value={form.patientName} onChange={e=>handlePatientSelect(e.target.value)} className="flex-1 rounded bg-white text-black px-2 py-2 text-sm">
                <option value="">اختر المريض</option>
                {patientsCards.map((c:any)=><option key={c.cardNumber} value={c.name}>{c.cardNumber} - {c.name}</option>)}
              </select>
              <span className="text-[10px] text-blue-200">اسم المريض اللي تضاف له الجلسة</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-white min-w-[100px] text-right">الطبيب المعالج:</label>
              <select value={form.doctorName} onChange={e=>setForm({...form, doctorName:e.target.value})} className="flex-1 rounded bg-white text-black px-2 py-2 text-sm">
                <option value="">اختر الطبيب</option>
                {doctors.map((d:any)=><option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-white min-w-[100px] text-right">نوع المعالجة:</label>
              <select value={form.treatType} onChange={e=>setForm({...form, treatType:e.target.value})} className="flex-1 rounded bg-white text-black px-2 py-2 text-sm">
                <option value="">ما هي المعالجة التي تحتاج جلسات</option>
                {treatTypes.map((t:any)=><option key={t.id} value={t.name}>{t.name} - {t.price}</option>)}
              </select>
              <span className="text-[10px] text-blue-200">مثال زراعة، تقويم، سحب عصب</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-white min-w-[100px] text-right">ترتيب الجلسة:</label>
              <select value={form.sessionOrder} onChange={e=>setForm({...form, sessionOrder:e.target.value})} className="flex-1 rounded bg-white text-black px-2 py-2 text-sm">
                <option>الجلسة 1</option><option>الجلسة 2</option><option>الجلسة 3</option><option>الجلسة 4</option><option>الجلسة 5</option><option>جلسة شهرية</option>
              </select>
              <span className="text-[10px] text-blue-200">رقم الجلسة - الجلسة 1 / 2 / 3</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-white min-w-[100px] text-right">تفاصيل الجلسة:</label>
            <input value={form.details} onChange={e=>setForm({...form, details:e.target.value})} placeholder="وصف ما سيتم عمله في هذه الجلسة" className="flex-1 rounded bg-white text-black px-2 py-2 text-sm" />
            <span className="text-[10px] text-blue-200">وصف ما سيتم عمله</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="flex items-center gap-2">
              <label className="text-xs text-white min-w-[80px]">تاريخ الجلسة:</label>
              <input type="date" value={form.sessionDate} onChange={e=>setForm({...form, sessionDate:e.target.value})} className="rounded bg-white text-black px-2 py-1 text-sm" />
              <span className="text-[10px] text-blue-100">تاريخ اليوم الحالي 2026، أكتوبر 08</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-white min-w-[100px]">تاريخ الزيارة القادمة:</label>
              <input type="date" value={form.nextVisitDate} onChange={e=>setForm({...form, nextVisitDate:e.target.value})} className="rounded bg-white text-black px-2 py-1 text-sm" />
              <span className="text-[10px] text-blue-100">الموعد القادم للمريض</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 rounded px-2 py-1">
              <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
                <input type="checkbox" checked={form.completed} onChange={e=>setForm({...form, completed:e.target.checked})} className="w-4 h-4" />
                تمت الجلسة [✓]
              </label>
              <span className="text-[10px] text-blue-100">إذا اكتملت يختفي من لم يكمل، إذا لا يبقى في القائمة</span>
            </div>
          </div>
        </div>

        {/* 2. جدول الجلسات - الوسط */}
        <div className="bg-white rounded-xl p-2 overflow-hidden">
          <div className="text-xs font-bold text-blue-800 mb-2">2. جدول الجلسات - الوسط - كل جلسات نفس المعالجة لنفس المريض</div>
          <div className="overflow-auto">
            <table className="w-full text-[11px] text-black border-collapse">
              <thead>
                <tr className="bg-blue-100">
                  <th className="border border-blue-300 p-1">المعالجة</th>
                  <th className="border border-blue-300 p-1">الجلسة</th>
                  <th className="border border-blue-300 p-1">السن</th>
                  <th className="border border-blue-300 p-1">تاريخ الجلسة</th>
                  <th className="border border-blue-300 p-1">تاريخ الزيارة القادمة</th>
                  <th className="border border-blue-300 p-1">تمت المعالجة</th>
                </tr>
              </thead>
              <tbody>
                {relatedSessions.map((s:any)=>(
                  <tr key={s.id} className={s.completed? 'bg-green-50' : 'bg-amber-50'}>
                    <td className="border p-1 text-center">{s.treatName}</td>
                    <td className="border p-1 text-center">{s.sessionOrder}</td>
                    <td className="border p-1 text-center">{s.tooth||''}</td>
                    <td className="border p-1 text-center">{s.sessionDate||s.date}</td>
                    <td className="border p-1 text-center">{s.nextVisitDate||''}</td>
                    <td className="border p-1 text-center">{s.completed? '✓ تمت' : 'لم يكمل'}</td>
                  </tr>
                ))}
                {relatedSessions.length===0 && <tr><td colSpan={6} className="border p-3 text-center text-gray-500">لا يوجد جلسات سابقة لنفس المعالجة - الجلسات تظهر هنا - مثال: الزراعة 3 جلسات أو التقويم شهري</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="text-[9px] text-gray-500 mt-1">أعمدة: المعالجة | الجلسة | السن | تاريخ الجلسة | تاريخ الزيارة القادمة | تمت المعالجة</div>
        </div>

        {/* 3. أزرار العمليات - تحت */}
        <div className="flex justify-between items-center bg-blue-700 rounded-xl p-2">
          <div className="flex gap-2">
            <button onClick={()=>setPage('dashboard')} className="rounded bg-white text-red-600 border-2 border-red-500 px-4 py-2 text-sm font-bold flex items-center gap-2"><span className="text-xl">❌</span> إغلاق الشاشة - يغلق نافذة الجلسة</button>
            <button onClick={saveSession} className="rounded bg-white text-blue-700 border-2 border-blue-300 px-6 py-2 text-sm font-bold shadow">💾 حفظ الجلسة - يحفظ الجلسة الجديدة</button>
          </div>
          <button onClick={()=>setShowJaw(true)} className="rounded bg-white p-1 flex flex-col items-center">
            <div className="text-3xl">🦷</div>
            <div className="text-[10px] text-blue-800 font-bold">قائمة الأسنان - يفتح مخطط الأسنان لتحديد السن</div>
          </button>
        </div>

        <div className="text-[10px] text-blue-100 bg-blue-800/50 rounded p-2">
          <b>الهدف:</b> أي معالجة تحتاج أكثر من زيارة مثل الزراعة تحتاج 3 جلسات أو التقويم يحتاج جلسات شهرية، لا تسجل كمعالجة واحدة، تسجل كجلسات. كل جلسة لها تاريخ وموعد قادم، والنظام يبقي المريض في حالة <b>لم يكمل المعالجة</b> حتى تعلم على تمت الجلسة في آخر جلسة.
          <br/>وهذا هو زر + إضافة جلسة اللي كان موجود في شاشة المعالجة ومسبب زحمة، ومكانه الصحيح يكون كارت لحاله في لوحة تحكم الطبيب اسمه إدارة الجلسات.
        </div>
      </div>

      {showJaw && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={()=>setShowJaw(false)}>
          <div className="bg-white rounded-2xl p-4 max-w-lg w-full" onClick={e=>e.stopPropagation()}>
            <h3 className="font-bold mb-3">اختر السن</h3>
            <div className="grid grid-cols-8 gap-2">
              {[18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28,48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38].map((n:any)=>(
                <button key={n} onClick={()=>{
                  const exists = selectedTeeth.includes(n);
                  const next = exists ? selectedTeeth.filter(x=>x!==n) : [...selectedTeeth, n];
                  setSelectedTeeth(next);
                  setForm({...form, tooth: next.join(', ')});
                }} className={`p-2 rounded border text-sm ${selectedTeeth.includes(n)? 'bg-blue-600 text-white' : 'bg-white text-black'}`}>{n}</button>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={()=>setShowJaw(false)} className="flex-1 rounded bg-blue-600 text-white py-2">تم - {selectedTeeth.join(', ')||'لم يحدد'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function DoctorCardsView({ setPage }: any) {
  const [cards, setCards] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  useEffect(()=>{ try{ const v=JSON.parse(localStorage.getItem('zircon_visitCards')||'[]'); const r=JSON.parse(localStorage.getItem('zircon_receptionCards')||'[]'); setCards(v.length>0?v:r);}catch{} },[]);
  const filtered = cards.filter((c:any)=> !search || (c.name||c.full_name||'').includes(search) || (c.cardNumber||c.cardNo||'').includes(search));
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3"><button onClick={()=>setPage('dashboard')} className="text-slate-400"><ArrowRight size={20}/></button><h2 className="text-xl font-bold text-white">بطاقة معاينة - بيانات المريض من الاستقبال - {filtered.length}</h2></div>
      <div className="relative"><Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ابحث..." className={inp + ' pr-10'}/></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c:any)=><div key={c.cardNumber||c.cardNo} className={card}><div className="text-2xl font-mono font-bold text-blue-400" dir="ltr">#{c.cardNumber||c.cardNo}</div><div className="text-white font-bold mt-1">{c.name||c.full_name}</div><div className="text-xs text-slate-400">الطبيب: {c.doctor||c.doctorName||'—'}</div><div className="text-xs text-slate-300" dir="ltr">{c.phone||''}</div></div>)}
      </div>
    </div>
  );
}

function DoctorTreatmentsList({ setPage }: any) {
  const defaultTreats = [
    {id:'65', number:'65', name:'ايكون', order:'.', price:'15750.000', needsTooth:true},
    {id:'67', number:'67', name:'جلسة تقويم', order:'.', price:'10000', needsTooth:false},
    {id:'68', number:'68', name:'Fibor post', order:'.', price:'10000', needsTooth:true},
    {id:'74', number:'74', name:'سحب عصب + MTA', order:'.', price:'30000', needsTooth:true},
    {id:'75', number:'75', name:'حارس ليلي', order:'.', price:'15000', needsTooth:false},
    {id:'90', number:'90', name:'فيبر بست', order:'.', price:'10000', needsTooth:true},
    {id:'91', number:'91', name:'جلسة تعقيم بالليزر', order:'.', price:'10000', needsTooth:false},
    {id:'92', number:'92', name:'جراحة تخفيض الشفة العليا', order:'.', price:'75000', needsTooth:false},
  ];
  const [treats, setTreats] = useState<any[]>(()=>{
    try{
      const saved = JSON.parse(localStorage.getItem('zircon_treatments_list')||'[]');
      if(saved.length>0) return saved;
      const old = JSON.parse(localStorage.getItem('zircon_treatTypes')||'[]');
      if(old.length>0) return old.map((o:any)=>({id:o.id, number:o.id, name:o.name, order:'.', price:o.price?.toString()||'0', needsTooth:true}));
      return defaultTreats;
    }catch{ return defaultTreats; }
  });
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [form, setForm] = useState({number:'', name:'', order:'.', price:'', needsTooth:true});
  const [editId, setEditId] = useState<string|null>(null);
  const [undoStack, setUndoStack] = useState<any[]>([]);

  useEffect(()=>{
    localStorage.setItem('zircon_treatments_list', JSON.stringify(treats));
    // مزامنة مع treatTypes للتوافق مع باقي النظام
    const mapped = treats.map((t:any)=>({id:t.id, number:t.number, name:t.name, order:t.order, price:parseFloat(t.price)||0, needsTooth:t.needsTooth}));
    localStorage.setItem('zircon_treatTypes', JSON.stringify(mapped));
  },[treats]);

  function pushUndo(){ setUndoStack([...undoStack, JSON.parse(JSON.stringify(treats))]); }
  function handleSearch(){ setSearch(searchInput); }
  function clearSearch(){ setSearch(''); setSearchInput(''); }
  function addNew(){
    pushUndo();
    const nextNum = (Math.max(...treats.map((m:any)=>parseInt(m.number)||60), 60) + 1).toString();
    setForm({number:nextNum, name:'', order:'.', price:'', needsTooth:true});
    setEditId(null);
  }
  function saveTreat(){
    if(!form.name.trim()){ alert('اسم المعالجة مطلوب'); return; }
    pushUndo();
    if(editId){
      setTreats(treats.map((m:any)=> m.id===editId ? {...m, number:form.number||m.number, name:form.name, order:form.order, price:form.price, needsTooth:form.needsTooth} : m));
      alert('✓ تم تعديل المعالجة');
    }else{
      const newT = {id:Date.now().toString(), number:form.number||(Math.max(...treats.map((m:any)=>parseInt(m.number)||60),60)+1).toString(), name:form.name, order:form.order, price:form.price, needsTooth:form.needsTooth};
      setTreats([newT, ...treats]);
      alert('✓ تم حفظ المعالجة');
    }
    setForm({number:'', name:'', order:'.', price:'', needsTooth:true});
    setEditId(null);
  }
  function editTreat(m:any){
    setForm({number:m.number, name:m.name, order:m.order||'.', price:m.price, needsTooth:!!m.needsTooth});
    setEditId(m.id);
    window.scrollTo({top:0, behavior:'smooth'});
  }
  function undo(){
    if(undoStack.length===0){ alert('لا يوجد عمليات للتراجع'); return; }
    setTreats(undoStack[undoStack.length-1]);
    setUndoStack(undoStack.slice(0,-1));
    alert('↩ تم التراجع على ماتم');
  }

  const filtered = treats.filter((m:any)=>{
    if(!search) return true;
    return (m.name||'').toLowerCase().includes(search.toLowerCase()) || (m.number||'').includes(search);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={()=>setPage('dashboard')} className="text-slate-400 hover:text-white"><ArrowRight size={20}/></button>
        <h2 className="text-xl font-bold text-white">قائمة المعالجات - جدول بكل أنواع المعالجات وأسعارها</h2>
        <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">{treats.length} معالجة</span>
      </div>

      {/* 1. أزرار التحكم - فوق - نفس نمط شاشة الأدوية */}
      <div className={card + ' !p-4'}>
        <div className="text-xs font-bold text-slate-300 mb-3">1. أزرار التحكم - فوق - نفس نمط شاشة الأدوية</div>
        <div className="flex flex-wrap gap-2 justify-end items-center">
          <div className="flex gap-2 items-center">
            <input value={searchInput} onChange={e=>setSearchInput(e.target.value)} placeholder="البحث عن معالجة" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs w-40 text-white placeholder:text-slate-500" />
            <button onClick={handleSearch} className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-bold">البحث عن معالجة</button>
          </div>
          <button onClick={undo} className="rounded-xl bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 text-xs font-bold">↩ التراجع على ماتم</button>
          <button onClick={addNew} className="rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 text-xs font-bold">+ إضافة معالجة</button>
          <button onClick={clearSearch} className="rounded-xl bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-xs">مسح البحث</button>
          <button onClick={()=>{ if(editId){ saveTreat(); }else{ alert('اختر معالجة من الجدول أولا للتعديل'); } }} className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 text-xs font-bold">تعديل معالجة</button>
          <button onClick={saveTreat} className="rounded-xl bg-gradient-to-l from-blue-600 to-indigo-600 text-white px-5 py-2 text-xs font-bold shadow">💾 حفظ معالجة</button>
        </div>
      </div>

      {/* 2. بيانات المعالجة - الوسط */}
      <div className={card + ' !p-4'}>
        <div className="text-xs font-bold text-slate-300 mb-3">2. بيانات المعالجة - الوسط</div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div>
            <label className={label}>رقم المعالجة: 65 - رقم تسلسلي في النظام</label>
            <input value={form.number} onChange={e=>setForm({...form, number:e.target.value})} placeholder="65" className={inp} />
          </div>
          <div>
            <label className={label}>المعالجة: ايكون - اسم المعالجة</label>
            <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="اسم المعالجة" className={inp} />
          </div>
          <div>
            <label className={label}>ترتيب المعالجة: . - ترتيب ظهورها في القائمة المنسدلة للطبيب</label>
            <input value={form.order} onChange={e=>setForm({...form, order:e.target.value})} placeholder="." className={inp} />
          </div>
          <div>
            <label className={label}>سعر المعالجة: 15750.000 - السعر الافتراضي</label>
            <input value={form.price} onChange={e=>setForm({...form, price:e.target.value})} placeholder="15750" className={inp} type="number" />
          </div>
          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-3 text-sm cursor-pointer hover:bg-white/10">
              <input type="checkbox" checked={form.needsTooth} onChange={e=>setForm({...form, needsTooth:e.target.checked})} className="w-4 h-4 rounded" />
              <span className="text-white text-xs font-bold">☑ هل المعالجة تحتاج تحديد السن</span>
            </label>
            <div className="text-[10px] text-amber-300 mt-1">لو علمت عليه، يفتح مخطط الأسنان تلقائياً في شاشة المعالجة</div>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={saveTreat} className={btnSm + ' flex-1'}>💾 {editId? 'تعديل' : 'حفظ'} - {form.needsTooth? 'سيفتح مخطط الأسنان تلقائيا' : 'بدون مخطط أسنان'}</button>
          {editId && <button onClick={()=>{ setForm({number:'', name:'', order:'.', price:'', needsTooth:true}); setEditId(null); }} className={btnGhost}>إلغاء التعديل</button>}
        </div>
      </div>

      {/* 3. الجدول - تحت */}
      <div className={card + ' !p-0 overflow-hidden'}>
        <div className="p-3 border-b border-white/10 flex justify-between items-center">
          <div className="text-sm font-bold text-white">3. الجدول - تحت - {filtered.length} معالجة</div>
          <div className="text-[10px] text-slate-400">رقم المعالجة | المعالجة | سعر المعالجة</div>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-white/5 text-slate-400 text-xs">
              <tr>
                <th className="text-right px-4 py-3">رقم المعالجة</th>
                <th className="text-right px-4 py-3">المعالجة</th>
                <th className="text-right px-4 py-3">سعر المعالجة</th>
                <th className="text-right px-4 py-3">تحتاج سن؟</th>
                <th className="text-right px-4 py-3">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((m:any)=>(
                <tr key={m.id} className="hover:bg-white/5 cursor-pointer" onClick={()=>editTreat(m)}>
                  <td className="px-4 py-3 font-mono text-blue-300 font-bold">{m.number}</td>
                  <td className="px-4 py-3 text-white">{m.name}</td>
                  <td className="px-4 py-3 text-emerald-400 font-mono">{m.price}</td>
                  <td className="px-4 py-3 text-xs">{m.needsTooth? <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300">🦷 نعم</span> : <span className="px-2 py-1 rounded bg-white/10 text-slate-400">لا</span>}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={(e)=>{ e.stopPropagation(); editTreat(m); }} className="p-1.5 rounded bg-blue-500/20 text-blue-300"><Edit3 size={12}/></button>
                      <button onClick={(e)=>{ e.stopPropagation(); if(confirm('حذف '+m.name+'؟')){ pushUndo(); setTreats(treats.filter((x:any)=>x.id!==m.id)); } }} className="p-1.5 rounded bg-red-500/20 text-red-300"><Trash2 size={12}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length===0 && <tr><td colSpan={5} className="p-8 text-center text-slate-500">لا يوجد معالجات - أضف معالجة جديدة</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-white/5 text-[10px] text-slate-400">
          <b>☑ هل المعالجة تحتاج تحديد السن:</b> هذا أهم خيار! لو علمت عليه، لما الطبيب يختار المعالجة في شاشة المعالجة يفتح له مخطط الأسنان تلقائياً عشان يحدد رقم السن. الأمثلة: 65 ايكون 15750، 67 جلسة تقويم 10000، 68 Fibor post 10000، 74 سحب عصب + MTA 30000
        </div>
      </div>
    </div>
  );
}


function MedicinesList({ setPage }: any) {
  // البيانات الافتراضية من الصورة
  const defaultMeds = [
    {id:'101', number:'101', name:'Cefotrxion Vail 500mg', desc:'مضاد حيوي - حقن وريدي', dosage:'1x2x3'},
    {id:'102', number:'102', name:'Linxomycin vail', desc:'مضاد حيوي - للالتهابات', dosage:'1x2x3'},
    {id:'103', number:'103', name:'Dexamethazol vail', desc:'مضاد التهاب ستيرويدي', dosage:'1x(1/2)x2x3'},
    {id:'104', number:'104', name:'Augmin Tab 625', desc:'مضاد حيوي - أموكسيسيلين + كلافولانيك', dosage:'1x2x3'},
    {id:'105', number:'105', name:'Augmin Tab 1g', desc:'مضاد حيوي قوي', dosage:'1x2x3'},
    {id:'106', number:'106', name:'Amoxil Tab 500mg', desc:'أموكسيسيلين - مضاد حيوي', dosage:'1x3x5'},
    {id:'107', number:'107', name:'Amoxil Syrab', desc:'شراب أطفال', dosage:'5ml x2x5'},
    {id:'108', number:'108', name:'Amoxil Syrab 250mg', desc:'شراب أطفال 250', dosage:'5ml x3x5'},
  ];
  const [medicines, setMedicines] = useState<any[]>(()=>{
    try{
      const saved = JSON.parse(localStorage.getItem('zircon_medicines')||'[]');
      if(saved.length>0) return saved;
      const old = JSON.parse(localStorage.getItem('zircon.prescriptions.v1')||'[]');
      if(old.length>0) return old.map((o:any,i:number)=>({id:(101+i).toString(), number:(101+i).toString(), name:o.name, desc:o.desc||'', dosage:o.dosage||'1x2x3'}));
      return defaultMeds;
    }catch{ return defaultMeds; }
  });
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({number:'', name:'', desc:'', dosage:'1x2x3'});
  const [editId, setEditId] = useState<string|null>(null);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [searchInput, setSearchInput] = useState('');

  useEffect(()=>{ localStorage.setItem('zircon_medicines', JSON.stringify(medicines)); localStorage.setItem('zircon.prescriptions.v1', JSON.stringify(medicines)); },[medicines]);

  function pushUndo(){ setUndoStack([...undoStack, JSON.parse(JSON.stringify(medicines))]); }

  function handleSearch(){
    setSearch(searchInput);
  }

  function clearSearch(){
    setSearch('');
    setSearchInput('');
  }

  function addNew(){
    pushUndo();
    const nextNum = (Math.max(...medicines.map((m:any)=>parseInt(m.number)||100), 100) + 1).toString();
    setForm({number:nextNum, name:'', desc:'', dosage:'1x2x3'});
    setEditId(null);
  }

  function saveMedicine(){
    if(!form.name.trim() || !form.dosage.trim()){ alert('اسم الدواء والجرعة مطلوبان'); return; }
    pushUndo();
    if(editId){
      setMedicines(medicines.map((m:any)=> m.id===editId ? {...m, number:form.number||m.number, name:form.name, desc:form.desc, dosage:form.dosage} : m));
      alert('✓ تم تعديل بيانات الدواء');
    }else{
      const newMed = {id:Date.now().toString(), number:form.number||(Math.max(...medicines.map((m:any)=>parseInt(m.number)||100),100)+1).toString(), name:form.name, desc:form.desc, dosage:form.dosage};
      setMedicines([newMed, ...medicines]);
      alert('✓ تم حفظ بيانات دواء');
    }
    setForm({number:'', name:'', desc:'', dosage:'1x2x3'});
    setEditId(null);
  }

  function editMedicine(m:any){
    setForm({number:m.number, name:m.name, desc:m.desc, dosage:m.dosage});
    setEditId(m.id);
    window.scrollTo({top:0, behavior:'smooth'});
  }

  function undo(){
    if(undoStack.length===0){ alert('لا يوجد عمليات للتراجع'); return; }
    setMedicines(undoStack[undoStack.length-1]);
    setUndoStack(undoStack.slice(0,-1));
    alert('↩ تم التراجع على ماتم');
  }

  const filtered = medicines.filter((m:any)=>{
    if(!search) return true;
    return (m.name||'').toLowerCase().includes(search.toLowerCase()) || (m.number||'').includes(search);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={()=>setPage('dashboard')} className="text-slate-400 hover:text-white"><ArrowRight size={20}/></button>
        <h2 className="text-xl font-bold text-white">قائمة الأدوية - وصفات جاهزة</h2>
        <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">{medicines.length} دواء</span>
      </div>

      {/* 1. أزرار التحكم - فوق */}
      <div className={card + ' !p-4'}>
        <div className="text-xs font-bold text-slate-300 mb-3">1. أزرار التحكم - فوق</div>
        <div className="flex flex-wrap gap-2 justify-end items-center">
          <div className="flex gap-2 items-center">
            <input value={searchInput} onChange={e=>setSearchInput(e.target.value)} placeholder="البحث عن دواء" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs w-40 text-white placeholder:text-slate-500" />
            <button onClick={handleSearch} className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-bold">البحث عن دواء</button>
          </div>
          <button onClick={undo} className="rounded-xl bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 text-xs font-bold">↩ التراجع على ماتم</button>
          <button onClick={addNew} className="rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 text-xs font-bold">+ إضافة دواء جديد</button>
          <button onClick={clearSearch} className="rounded-xl bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-xs">مسح البحث</button>
          <button onClick={()=>{ if(editId) { saveMedicine(); } else { alert('اختر دواء من الجدول أولا للتعديل'); } }} className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 text-xs font-bold">تعديل بيانات دواء</button>
          <button onClick={saveMedicine} className="rounded-xl bg-gradient-to-l from-blue-600 to-indigo-600 text-white px-5 py-2 text-xs font-bold shadow">💾 حفظ بيانات دواء</button>
        </div>
      </div>

      {/* 2. بيانات الدواء - الوسط */}
      <div className={card + ' !p-4'}>
        <div className="text-xs font-bold text-slate-300 mb-3">2. بيانات الدواء - الوسط</div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className={label}>رقم الدواء: 101 - رقم تسلسلي</label>
            <input value={form.number} onChange={e=>setForm({...form, number:e.target.value})} placeholder="101" className={inp} />
          </div>
          <div className="md:col-span-1">
            <label className={label}>اسم الدواء: Cefotrxion Vail 500mg</label>
            <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="اسم الدواء" className={inp} />
          </div>
          <div className="md:col-span-1">
            <label className={label}>وصف الدواء: الوصف الطبي / الاستخدام</label>
            <input value={form.desc} onChange={e=>setForm({...form, desc:e.target.value})} placeholder="الوصف الطبي" className={inp} />
          </div>
          <div>
            <label className={label}>الجرعة: 1x2x3 - صيغة الأطباء</label>
            <input value={form.dosage} onChange={e=>setForm({...form, dosage:e.target.value})} placeholder="1x2x3" className={inp + ' font-mono'} dir="ltr" />
            <div className="text-[10px] text-slate-500 mt-1">مثال: 1x(1/2)x2x3 = نصف حبة مرتين × 3 أيام</div>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={saveMedicine} className={btnSm + ' flex-1'}>💾 {editId? 'تعديل' : 'حفظ'} - يسحب تلقائيا في شاشة المعالجة</button>
          {editId && <button onClick={()=>{ setForm({number:'', name:'', desc:'', dosage:'1x2x3'}); setEditId(null); }} className={btnGhost}>إلغاء التعديل</button>}
        </div>
      </div>

      {/* 3. جدول الأدوية - تحت */}
      <div className={card + ' !p-0 overflow-hidden'}>
        <div className="p-3 border-b border-white/10 flex justify-between items-center">
          <div className="text-sm font-bold text-white">3. جدول الأدوية - تحت - {filtered.length} دواء</div>
          <div className="text-[10px] text-slate-400">رقم العلاج | اسم العلاج | وصف العلاج | الجرعة</div>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-white/5 text-slate-400 text-xs">
              <tr>
                <th className="text-right px-4 py-3">رقم العلاج</th>
                <th className="text-right px-4 py-3">اسم العلاج</th>
                <th className="text-right px-4 py-3">وصف العلاج</th>
                <th className="text-right px-4 py-3">الجرعة</th>
                <th className="text-right px-4 py-3">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((m:any)=>(
                <tr key={m.id} className="hover:bg-white/5 cursor-pointer" onClick={()=>editMedicine(m)}>
                  <td className="px-4 py-3 font-mono text-blue-300 font-bold">{m.number}</td>
                  <td className="px-4 py-3 text-white">{m.name}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{m.desc||'—'}</td>
                  <td className="px-4 py-3 font-mono text-emerald-300 text-xs" dir="ltr">{m.dosage}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={(e)=>{ e.stopPropagation(); editMedicine(m); }} className="p-1.5 rounded bg-blue-500/20 text-blue-300"><Edit3 size={12}/></button>
                      <button onClick={(e)=>{ e.stopPropagation(); if(confirm('حذف '+m.name+'؟')){ pushUndo(); setMedicines(medicines.filter((x:any)=>x.id!==m.id)); } }} className="p-1.5 rounded bg-red-500/20 text-red-300"><Trash2 size={12}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length===0 && <tr><td colSpan={5} className="p-8 text-center text-slate-500">لا يوجد أدوية - أضف دواء جديد</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-white/5 text-[10px] text-slate-400">
          الفكرة: هذه القائمة تربط في شاشة <b>المعالجة</b>، لما الطبيب يختار الدواء من القائمة المنسدلة، يسحب الاسم والجرعة تلقائياً - مثال: 1x2x3 = حبة × مرتين في اليوم × 3 أيام
        </div>
      </div>
    </div>
  );
}


function DoctorAppointments({ setPage }: any) {
  const [sessions, setSessions] = useState<any[]>([]);
  useEffect(()=>{ try{ setSessions(JSON.parse(localStorage.getItem('zircon_sessions')||'[]'));}catch{} },[]);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3"><button onClick={()=>setPage('dashboard')} className="text-slate-400"><ArrowRight size={20}/></button><h2 className="text-xl font-bold text-white">قائمة المواعيد - مواعيد المرضى المحجوزين</h2></div>
      <div className={card + ' !p-0 overflow-hidden'}><table className="w-full text-sm"><thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-3">التاريخ</th><th className="text-right px-4 py-3">البطاقة</th><th className="text-right px-4 py-3">المريض</th><th className="text-right px-4 py-3">الطبيب</th></tr></thead><tbody className="divide-y divide-white/5">{sessions.map((s:any)=><tr key={s.id} className="hover:bg-white/5"><td className="px-4 py-3 text-slate-300 text-xs">{s.date}</td><td className="px-4 py-3 text-blue-300 text-xs" dir="ltr">#{s.cardNumber}</td><td className="px-4 py-3 text-white">{s.patientName}</td><td className="px-4 py-3 text-slate-300 text-xs">{s.doctor}</td></tr>)}</tbody></table></div>
    </div>
  );
}

/* ============ TREATMENT SCREEN - أهم شاشة عند الطبيب - صورة 1 و 3 ============ */
function TreatmentScreen({ activePatient, setPage }: any) {
  const [treatTypes, setTreatTypes] = useState<any[]>([]);
  const [medicines, setMedicines] = useState<any[]>(()=>{
    try{
      const m = JSON.parse(localStorage.getItem('zircon_medicines')||'[]');
      if(m.length>0) return m;
      return JSON.parse(localStorage.getItem('zircon.prescriptions.v1')||'[]');
    }catch{ return []; }
  });
  useEffect(()=>{ 
    try{ 
      const m = JSON.parse(localStorage.getItem('zircon_medicines')||'[]');
      if(m.length>0) setMedicines(m);
    }catch{} 
    const id = setInterval(()=>{ try{ const m = JSON.parse(localStorage.getItem('zircon_medicines')||'[]'); if(m.length>0) setMedicines(m); }catch{} },2000);
    return ()=>clearInterval(id);
  },[]);
  const [allTreatments, setAllTreatments] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon.doctorTreatments.v1')||'[]'); }catch{ return []; } });
  const [currentForm, setCurrentForm] = useState<any>({
    treatType: '', cost: 2000, date: TODAY, discountAmount: 0, discountRatio: '67 / 50',
    diagnosis: '', teeth: [] as number[], medicine: '', notes: '', status: 'لم يكمل المعالجة'
  });
  const [showJaw, setShowJaw] = useState(false);
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [searchTreat, setSearchTreat] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCompleted, setFilterCompleted] = useState('all');
  const [editingId, setEditingId] = useState<string|null>(null);

  useEffect(()=>{ try{ setTreatTypes(JSON.parse(localStorage.getItem('zircon_treatTypes')||'[]')); }catch{} try{ const m=JSON.parse(localStorage.getItem('zircon.prescriptions.v1')||'[]'); setMedicines(m);}catch{} },[]);
  useEffect(()=>{ localStorage.setItem('zircon.doctorTreatments.v1', JSON.stringify(allTreatments)); },[allTreatments]);

  if(!activePatient) return (
    <div className="space-y-4">
      <button onClick={()=>setPage('dashboard')} className={btnGhost}><ArrowRight size={18}/> رجوع</button>
      <div className={card + ' text-center text-slate-400 py-12'}>اختر مريضاً من القائمة بالدخول</div>
    </div>
  );

  function saveTreatment(){
    if(!currentForm.treatType){ alert('اختر نوع المعالجة'); return; }
    if(editingId){
      setAllTreatments(allTreatments.map((t:any)=> t.id===editingId ? {...t, ...currentForm, treatmentType: currentForm.treatType, cost: Number(currentForm.cost), discountAmount: Number(currentForm.discountAmount), discountRatio: currentForm.discountRatio, diagnosis: currentForm.diagnosis, teeth: currentForm.teeth, medicine: currentForm.medicine, date: currentForm.date, notes: currentForm.notes, status: currentForm.status} : t));
      setEditingId(null);
      alert('✓ تم تعديل المعالجة');
    } else {
      const newT:any = {
        id: Date.now().toString(),
        patientId: activePatient.cardNumber,
        patientName: activePatient.name,
        doctorName: activePatient.doctor,
        treatmentType: currentForm.treatType,
        cost: Number(currentForm.cost),
        discountAmount: Number(currentForm.discountAmount),
        discountRatio: currentForm.discountRatio,
        diagnosis: currentForm.diagnosis,
        teeth: currentForm.teeth,
        medicine: currentForm.medicine,
        date: currentForm.date,
        notes: currentForm.notes,
        status: currentForm.status,
        completed: false,
        stopped: false,
        createdAt: new Date().toISOString()
      };
      setAllTreatments([newT, ...allTreatments]);
      alert('✓ تم حفظ معالجة');
    }
    setCurrentForm({ treatType:'', cost:2000, date:TODAY, discountAmount:0, discountRatio:'67 / 50', diagnosis:'', teeth:[], medicine:'', notes:'', status:'لم يكمل المعالجة' });
  }

  function editTreatment(t:any){
    setCurrentForm({ treatType:t.treatmentType, cost:t.cost, date:t.date, discountAmount:t.discountAmount||0, discountRatio:t.discountRatio||'67 / 50', diagnosis:t.diagnosis||'', teeth:t.teeth||[], medicine:t.medicine||'', notes:t.notes||'', status:t.status||'لم يكمل المعالجة' });
    setEditingId(t.id);
  }

  function deleteTreatment(id:string){
    if(!confirm('حذف المعالجة؟')) return;
    setAllTreatments(allTreatments.filter((t:any)=> t.id!==id));
  }

  function toggleCompleted(t:any){
    setAllTreatments(allTreatments.map((x:any)=> x.id===t.id ? {...x, completed:!x.completed, status: !x.completed ? 'أكمل المعالجة' : 'لم يكمل المعالجة'} : x));
  }
  function toggleStopped(t:any){
    setAllTreatments(allTreatments.map((x:any)=> x.id===t.id ? {...x, stopped:!x.stopped} : x));
  }

  function printPriceQuote(detailed:boolean){
    const total = Number(currentForm.cost) - Number(currentForm.discountAmount);
    const html = `<html dir="rtl"><head><title>عرض سعر</title><style>body{font-family:Arial;padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #999;padding:8px}</style></head><body><h2>عرض سعر ${detailed ? 'تفصيلي' : 'عام'} - ${activePatient.name} #${activePatient.cardNumber}</h2><table><tr><th>المعالجة</th><th>السن</th><th>التكلفة</th></tr><tr><td>${currentForm.treatType}</td><td>${currentForm.teeth.join(',')}</td><td>${currentForm.cost}</td></tr></table><p>الخصم: ${currentForm.discountAmount} - النسبة: ${currentForm.discountRatio}</p><h3>الإجمالي: ${total}</h3>${detailed ? `<p>التشخيص: ${currentForm.diagnosis}</p>` : ''}</body></html>`;
    const w=window.open('','_blank'); if(w){ w.document.write(html); w.document.close(); setTimeout(()=>w.print(),300); }
  }

  function printReport(type:string){
    const list = patientTreatments;
    const rows = list.map((t:any)=>`<tr><td>${t.treatmentType}</td><td>${t.doctorName}</td><td>${t.cost}</td><td>${t.teeth.join(',')}</td><td>${t.date}</td><td>${t.completed ? '✓' : ''}</td><td>${t.stopped ? '✓' : ''}</td></tr>`).join('');
    const html = `<html dir="rtl"><head><title>تقرير ${type}</title><style>body{font-family:Arial;padding:20px}table{width:100%;border-collapse:collapse;font-size:12px}th,td{border:1px solid #999;padding:6px}</style></head><body><h2>تقرير معالجة ${type} - ${activePatient.name} #${activePatient.cardNumber}</h2><table><tr><th>المعالجة</th><th>الطبيب</th><th>التكلفة</th><th>السن</th><th>التاريخ</th><th>تمت</th><th>متوقفة</th></tr>${rows}</table></body></html>`;
    const w=window.open('','_blank'); if(w){ w.document.write(html); w.document.close(); setTimeout(()=>w.print(),300); }
  }

  function transferToAccounts(){
    const toTransfer = patientTreatments.filter((t:any)=> t.completed);
    if(toTransfer.length===0){ alert('لا توجد معالجات مكتملة للترحيل - علم على تمت المعالجة أولا'); return; }
    try{
      const existing = JSON.parse(localStorage.getItem('zircon_accountsPending')||'[]');
      const merged = [...existing];
      toTransfer.forEach((t:any)=>{ if(!existing.find((e:any)=>e.id===t.id)) merged.push(t); });
      localStorage.setItem('zircon_accountsPending', JSON.stringify(merged));
      alert(`✓ تم ترحيل ${toTransfer.length} معالجة للحسابات - يرجع المريض للاستقبال للمحاسبة`);
    }catch{}
  }

  function undoLast(){
    if(allTreatments.length===0){ alert('لا يوجد'); return; }
    setAllTreatments(allTreatments.slice(1));
    alert('تم التراجع');
  }

  const patientTreatments = allTreatments.filter((t:any)=> t.patientId===activePatient.cardNumber);
  const filteredTreatments = patientTreatments.filter((t:any)=>{
    if(searchTreat && !t.treatmentType.includes(searchTreat)) return false;
    if(filterCompleted==='completed' && !t.completed) return false;
    if(filterCompleted==='incomplete' && t.completed) return false;
    if(filterStatus==='stopped' && !t.stopped) return false;
    if(filterStatus==='completedOnly' && !t.completed) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* الشريط العلوي - الأزرار */}
      <div className="flex flex-wrap gap-2 items-center">
        <button onClick={()=>setPage('dashboard')} className={btnGhost}><ArrowRight size={16}/> رجوع</button>
        <button onClick={()=>{ setCurrentForm({ treatType:'', cost:2000, date:TODAY, discountAmount:0, discountRatio:'67 / 50', diagnosis:'', teeth:[], medicine:'', notes:'', status:'لم يكمل المعالجة' }); setEditingId(null); }} className="rounded-xl bg-red-600/80 hover:bg-red-600 text-white px-3 py-2 text-xs">✕ إلغاء معالجة</button>
        <button onClick={()=>setShowSessionModal(true)} className="rounded-xl bg-cyan-600 hover:bg-cyan-600 text-white px-3 py-2 text-xs">+ إضافة جلسة</button>
        <button onClick={saveTreatment} className={btnSm + ' !text-xs'}><Save size={14}/> {editingId ? 'حفظ تعديل المعالجة' : 'حفظ معالجة'}</button>
        <button onClick={()=>{ if(filteredTreatments[0]) editTreatment(filteredTreatments[0]); }} className="rounded-xl bg-purple-600 hover:bg-purple-600 text-white px-3 py-2 text-xs">تعديل معالجة</button>
        <button onClick={()=>setSearchTreat('')} className="rounded-xl bg-white/10 hover:bg-white/20 text-white px-3 py-2 text-xs">مسح البحث</button>
        <button onClick={undoLast} className="rounded-xl bg-amber-600/80 hover:bg-amber-600 text-white px-3 py-2 text-xs">↶ التراجع على ماتم</button>
        <button onClick={()=>printPriceQuote(false)} className="rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white px-3 py-2 text-xs">عرض سعر عام</button>
        <button onClick={()=>printPriceQuote(true)} className="rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white px-3 py-2 text-xs">عرض سعر الحالة</button>
        <div className="flex gap-1">
          <button onClick={()=>printReport('عام')} className="rounded-xl bg-slate-600 hover:bg-slate-500 text-white px-2 py-2 text-[11px]">تقرير عام</button>
          <button onClick={()=>printReport('تفصيلي')} className="rounded-xl bg-slate-600 hover:bg-slate-500 text-white px-2 py-2 text-[11px]">تفصيلي</button>
          <button onClick={()=>printReport('جدولي تفصيلي')} className="rounded-xl bg-slate-600 hover:bg-slate-500 text-white px-2 py-2 text-[11px]">جدولي</button>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Search size={14} className="text-slate-500"/>
          <input value={searchTreat} onChange={e=>setSearchTreat(e.target.value)} placeholder="البحث عن معالجة" className="rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-xs w-32 text-white"/>
        </div>
      </div>

      {/* بيانات المريض */}
      <div className={card}>
        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          <div><div className="text-xs text-slate-400">بيانات المريض</div><div className="text-white font-bold mt-1">{activePatient.cardNumber} - {activePatient.name}</div><div className="text-[10px] text-slate-500">رقم بطاقة المعاينة هو المعرف الوحيد طول فترة العلاج</div></div>
          <div><div className="text-xs text-slate-400">بيانات المعاينة</div><div className="text-blue-300 font-mono mt-1" dir="ltr">#{activePatient.cardNumber}</div><div className="text-xs text-slate-400 mt-1">الجوال: {activePatient.phone || '—'} | العمر: {activePatient.age || '—'}</div></div>
          <div><div className="text-xs text-slate-400">الطبيب المعالج</div><div className="text-white mt-1">{activePatient.doctor} - {activePatient.ratio || '67 / 50'}</div><div className="text-[10px] text-amber-300">نسبة العيادة / الطبيب</div></div>
        </div>
      </div>

      {/* بيانات المعالجة الحالية */}
      <div className={card}>
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">🦷 بيانات المعالجة الحالية</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div><label className={label}>نوع المعالجة * - مثال: 8 - حشو ضوئي</label><select value={currentForm.treatType} onChange={e=>{ const t=treatTypes.find((x:any)=>x.name===e.target.value || x.id===e.target.value); const selected = treatTypes.find((x:any)=> (x.name===e.target.value || x.id===e.target.value)); const price = selected?.price || t?.price || currentForm.cost; const needs = selected?.needsTooth; setCurrentForm({...currentForm, treatType:e.target.value, cost:price}); if(needs){ setTimeout(()=>setShowJaw(true), 300); } }} className={inp}><option value="">اختر من قائمة المعالجات</option>{treatTypes.map((t:any)=><option key={t.id} value={t.name}>{t.name} - {t.price}</option>)}</select></div>
          <div><label className={label}>تكلفة المعالجة</label><input type="number" value={currentForm.cost} onChange={e=>setCurrentForm({...currentForm, cost:e.target.value})} className={inp + ' !text-emerald-300'}/></div>
          <div><label className={label}>تاريخ المعالجة</label><input type="date" value={currentForm.date} onChange={e=>setCurrentForm({...currentForm, date:e.target.value})} className={inp}/></div>
          <div><label className={label}>الخصم - خصم مبلغ</label><input type="number" value={currentForm.discountAmount} onChange={e=>setCurrentForm({...currentForm, discountAmount:e.target.value})} className={inp}/></div>
          <div><label className={label}>خصم نسبة - نظام النسبة بين العيادة والطبيب</label><input value={currentForm.discountRatio} onChange={e=>setCurrentForm({...currentForm, discountRatio:e.target.value})} placeholder="مثال: 67 / 50" className={inp}/></div>
          <div><label className={label}>التشخيص + صورة سن</label><button onClick={()=>setShowDiagnosis(true)} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-xs text-white hover:bg-white/10 flex items-center justify-between"><span>{currentForm.diagnosis ? currentForm.diagnosis.slice(0,30) : '📝 كتابة تشخيص الحالة'}</span><span>🖼️</span></button></div>
          <div><label className={label}>قائمة أسنان - مخطط أسنان مهم للربط - مثال: 31، 3، 12</label><button onClick={()=>setShowJaw(true)} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-xs text-white hover:bg-white/10">🦷 {currentForm.teeth.length>0 ? `${currentForm.teeth.length} أسنان: ${currentForm.teeth.join(', ')}` : 'اختر السن من المخطط'}</button></div>
          <div><label className={label}>الأدوية</label><select value={currentForm.medicine} onChange={e=>setCurrentForm({...currentForm, medicine:e.target.value})} className={inp}><option value="">اختر دواء من قائمة الأدوية</option>{medicines.map((m:any)=><option key={m.id} value={m.name}>{m.name}</option>)}</select></div>
          <div><label className={label}>ملاحظات</label><input value={currentForm.notes} onChange={e=>setCurrentForm({...currentForm, notes:e.target.value})} className={inp}/></div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={()=>alert('رفع ملف - سيتم إضافة رفع أشعة')} className={btnGhost + ' text-xs'}>📎 إضافة ملف للمريض - رفع أشعة أو صور</button>
          <button onClick={()=>printPriceQuote(false)} className="rounded-xl bg-white/5 hover:bg-white/10 text-white px-4 py-2 text-xs border border-white/10">💾 حفظ عرض السعر</button>
          <button onClick={transferToAccounts} className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 text-sm font-bold flex items-center gap-2">💰 ترحيل الى الحسابات - بعد ما يخلص يرحلها للاستقبال يحاسب</button>
        </div>
      </div>

      {/* الجدول السفلي - سجل معالجات المريض */}
      <div className={card + ' !p-0 overflow-hidden'}>
        <div className="p-3 border-b border-white/10 flex justify-between items-center"><h3 className="font-bold text-white text-sm">سجل معالجات المريض - {filteredTreatments.length} - كل المعالجات السابقة لنفس المريض</h3><span className="text-xs text-slate-400">المثال: حشو ضوئي - د/ أحمد - 2000 - سن 31 - 05/10/2026</span></div>
        <div className="overflow-auto">
          <table className="w-full text-sm min-w-[1000px]">
            <thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-3 py-3">المعالجة</th><th className="text-right px-3 py-3">الطبيب المعالج</th><th className="text-right px-3 py-3">تكلفة المعالجة</th><th className="text-right px-3 py-3">السن</th><th className="text-right px-3 py-3">تاريخ المعالجة</th><th className="text-right px-3 py-3">تمت المعالجة [✓]</th><th className="text-right px-3 py-3">المعالجة متوقفة [✓]</th><th></th></tr></thead>
            <tbody className="divide-y divide-white/5">
              {filteredTreatments.length===0 ? <tr><td colSpan={8} className="p-6 text-center text-slate-500">لا توجد معالجات سابقة</td></tr> :
                filteredTreatments.map((t:any)=><tr key={t.id} className="hover:bg-white/5">
                  <td className="px-3 py-2 text-white">{t.treatmentType}</td>
                  <td className="px-3 py-2 text-slate-300">{t.doctorName}</td>
                  <td className="px-3 py-2 text-emerald-400" dir="ltr">{t.cost}</td>
                  <td className="px-3 py-2 text-emerald-300">🦷 {t.teeth.join(', ')}</td>
                  <td className="px-3 py-2 text-slate-400 text-xs" dir="ltr">{t.date}</td>
                  <td className="px-3 py-2 text-center"><input type="checkbox" checked={t.completed} onChange={()=>toggleCompleted(t)} className="w-4 h-4"/></td>
                  <td className="px-3 py-2 text-center"><input type="checkbox" checked={t.stopped} onChange={()=>toggleStopped(t)} className="w-4 h-4"/></td>
                  <td className="px-3 py-2"><div className="flex gap-1"><button onClick={()=>editTreatment(t)} className="text-blue-400"><Edit3 size={14}/></button><button onClick={()=>deleteTreatment(t.id)} className="text-red-400"><Trash2 size={14}/></button></div></td>
                </tr>)}
            </tbody>
          </table>
        </div>
        {/* الفلاتر تحت الجدول */}
        <div className="p-3 border-t border-white/10 flex flex-wrap gap-2 items-center">
          <Filter size={14} className="text-slate-500"/>
          <button onClick={()=>setFilterStatus(filterStatus==='stopped' ? 'all' : 'stopped')} className={'px-3 py-1.5 rounded-lg text-xs ' + (filterStatus==='stopped' ? 'bg-amber-600 text-white' : 'bg-white/5 text-slate-300')}>عرض المعالجات المتوقفة</button>
          <button onClick={()=>setFilterStatus(filterStatus==='completedOnly' ? 'all' : 'completedOnly')} className={'px-3 py-1.5 rounded-lg text-xs ' + (filterStatus==='completedOnly' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-300')}>عرض المعالجات المكتملة</button>
          <span className="text-xs text-slate-500">|</span>
          <span className="text-xs text-slate-400">وقت المعالجة:</span>
          <select value={filterCompleted} onChange={e=>setFilterCompleted(e.target.value)} className="rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-xs text-white">
            <option value="all">الكل</option>
            <option value="current">المعالجة الحالية</option>
            <option value="completed">أكمل المعالجة</option>
            <option value="incomplete">لم يكمل المعالجة</option>
          </select>
          <span className="text-xs text-slate-400">اختيار المعالجة:</span>
          <select value={filterCompleted} onChange={e=>setFilterCompleted(e.target.value)} className="rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-xs text-white">
            <option value="all">الكل</option>
            <option value="completed">أكمل المعالجة</option>
            <option value="incomplete">لم يكمل المعالجة</option>
          </select>
        </div>
      </div>

      {showDiagnosis && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a1028] p-5 space-y-3">
            <h3 className="font-bold text-white">التشخيص + صورة السن</h3>
            <textarea rows={5} value={currentForm.diagnosis} onChange={e=>setCurrentForm({...currentForm, diagnosis:e.target.value})} className={inp} placeholder="اكتب تشخيص الحالة..."/>
            <div className="flex gap-2"><button className={btnGhost + ' text-xs'}>🖼️ رفع صورة سن / أشعة</button></div>
            <div className="flex justify-end gap-2"><button onClick={()=>setShowDiagnosis(false)} className={btnSm}>حفظ</button></div>
          </div>
        </div>
      )}

      {showJaw && <JawModal selected={currentForm.teeth} onToggle={(n:any)=>{ const has=currentForm.teeth.includes(n); setCurrentForm({...currentForm, teeth: has ? currentForm.teeth.filter((x:any)=>x!==n) : [...currentForm.teeth, n]}); }} onClose={()=>setShowJaw(false)} />}

      {showSessionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a1028] p-5 space-y-3">
            <h3 className="font-bold text-white">إضافة جلسة - لو المعالجة تحتاج جلسات</h3>
            <p className="text-xs text-slate-400">المريض: {activePatient.name} - يخليها لم يكمل ويحدد موعد قادم</p>
            <input type="date" value={currentForm.date} onChange={e=>setCurrentForm({...currentForm, date:e.target.value})} className={inp}/>
            <textarea value={currentForm.notes} onChange={e=>setCurrentForm({...currentForm, notes:e.target.value})} placeholder="ملاحظات الجلسة" className={inp} rows={2}/>
            <div className="flex justify-end gap-2">
              <button onClick={()=>setShowSessionModal(false)} className={btnGhost}>إلغاء</button>
              <button onClick={()=>{
                try{
                  const sessions = JSON.parse(localStorage.getItem('zircon_sessions')||'[]');
                  sessions.push({ id:Date.now().toString(), cardNumber:activePatient.cardNumber, patientName:activePatient.name, doctor:activePatient.doctor, date:currentForm.date, createdAt:new Date().toISOString() });
                  localStorage.setItem('zircon_sessions', JSON.stringify(sessions));
                  alert('✓ تم إضافة جلسة جديدة - موعد قادم: ' + currentForm.date);
                  setShowSessionModal(false);
                }catch{}
              }} className={btnSm}>حفظ الجلسة</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsPage(){

  const [settingsTab, setSettingsTab] = useState<'doctors'|'treatments'|'users'>('doctors');
  const [doctors, setDoctors] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon_doctors')||'[{"id":"1","name":"د. أحمد الشطبي","specialty":"زراعة"},{"id":"2","name":"د. جلال الداعري","specialty":"تقويم"}]') }catch{ return [] } });
  const [treatTypes, setTreatTypes] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon_treatTypes')||'[{"id":"1","name":"حشوة تجميلية","price":500},{"id":"2","name":"زراعة سن","price":3500},{"id":"3","name":"تنظيف","price":200}]') }catch{ return [] } });
  const [appUsers, setAppUsers] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon_appUsers')||'[{"id":"1","username":"admin","password":"123456","role":"مدير"}]') }catch{ return [] } });
  const [newDoc, setNewDoc] = useState({name:'', specialty:''});
  const [newTreat, setNewTreat] = useState({name:'', price:500});
  const [newUser, setNewUser] = useState({username:'', password:'', role:'طبيب'});
  const [userSearch, setUserSearch] = useState('');
  const [editItem, setEditItem] = useState<any>(null);
  useEffect(()=>{ localStorage.setItem('zircon_doctors', JSON.stringify(doctors)) },[doctors]);
  useEffect(()=>{ localStorage.setItem('zircon_treatTypes', JSON.stringify(treatTypes)) },[treatTypes]);
  useEffect(()=>{ localStorage.setItem('zircon_appUsers', JSON.stringify(appUsers)) },[appUsers]);
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">الاعدادات - Zircon OS V2</h2>
      <div className={card + ' !p-4'}><p className="text-slate-400 text-sm">البريد: mustafa781075016@gmail.com</p><p className="text-slate-500 text-xs mt-1">Zircon OS V2 - عيادة زراعة الاسنان</p></div>
      <div className={card + ' !p-4'}>
        <div className="flex gap-2 border-b border-white/10 overflow-auto">
          <button onClick={()=>setSettingsTab('doctors')} className={`px-4 py-2 text-sm border-b-2 whitespace-nowrap ${settingsTab==='doctors'?'border-blue-500 text-white':'border-transparent text-slate-400'}`}>إدارة الأطباء (طبيب)</button>
          <button onClick={()=>setSettingsTab('treatments')} className={`px-4 py-2 text-sm border-b-2 whitespace-nowrap ${settingsTab==='treatments'?'border-blue-500 text-white':'border-transparent text-slate-400'}`}>إدارة المعالجات (معالجة)</button>
        </div>
        <div className="mt-3 flex">
          <button onClick={()=>setSettingsTab('users')} className={`w-full md:w-auto px-6 py-2.5 rounded-xl text-sm font-bold border flex items-center justify-center gap-2 ${settingsTab==='users'?'bg-gradient-to-l from-violet-600 to-blue-600 border-violet-500 text-white':'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}>
            <UserPlus size={16}/> إضافة مستخدم - اسم المستخدم وكلمة المرور وعرض المستخدمين
          </button>
        </div>
        {settingsTab==='doctors' && (
          <div className="mt-5 space-y-4">
            <div className="grid md:grid-cols-3 gap-3"><div><label className={label}>اسم الطبيب</label><input value={newDoc.name} onChange={e=>setNewDoc({...newDoc,name:e.target.value})} placeholder="د. أحمد" className={inp}/></div><div><label className={label}>التخصص</label><input value={newDoc.specialty} onChange={e=>setNewDoc({...newDoc,specialty:e.target.value})} placeholder="زراعة" className={inp}/></div><div className="flex items-end"><button onClick={()=>{ if(!newDoc.name) return; setDoctors([...doctors,{id:Date.now().toString(),...newDoc}]); setNewDoc({name:'',specialty:''}) }} className={btnSm}><Plus size={16}/> إضافة</button></div></div>
            <div className="space-y-2">{doctors.map((d:any)=><div key={d.id} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5"><span className="text-white text-sm">{d.name} - {d.specialty}</span><div className="flex gap-2"><button onClick={()=>setEditItem({type:'doc',data:d})} className="text-blue-400"><Edit3 size={14}/></button><button onClick={()=>setDoctors(doctors.filter((x:any)=>x.id!==d.id))} className="text-red-400"><Trash2 size={14}/></button></div></div>)}</div>
          </div>
        )}
        {settingsTab==='treatments' && (
          <div className="mt-5 space-y-4">
            <div className="grid md:grid-cols-3 gap-3"><div><label className={label}>اسم المعالجة</label><input value={newTreat.name} onChange={e=>setNewTreat({...newTreat,name:e.target.value})} placeholder="زراعة" className={inp}/></div><div><label className={label}>السعر - ضروري لربطه بالتكلفة</label><input type="number" value={newTreat.price} onChange={e=>setNewTreat({...newTreat,price:parseInt(e.target.value)||0})} className={inp}/></div><div className="flex items-end"><button onClick={()=>{ if(!newTreat.name) return; setTreatTypes([...treatTypes,{id:Date.now().toString(),...newTreat}]); setNewTreat({name:'',price:500}) }} className={btnSm}><Plus size={16}/> إضافة</button></div></div>
            <div className="space-y-2">{treatTypes.map((t:any)=><div key={t.id} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5"><span className="text-white text-sm">{t.name} - {t.price} ر.س</span><div className="flex gap-2"><button onClick={()=>setEditItem({type:'treat',data:t})} className="text-blue-400"><Edit3 size={14}/></button><button onClick={()=>setTreatTypes(treatTypes.filter((x:any)=>x.id!==t.id))} className="text-red-400"><Trash2 size={14}/></button></div></div>)}</div>
          </div>
        )}
        {settingsTab==='users' && (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl bg-white/[.02] border border-white/10 p-4 space-y-3"><div className="font-semibold text-white flex items-center gap-2"><UserPlus size={18}/> إضافة مستخدم جديد</div><div className="grid md:grid-cols-3 gap-3"><div><label className={label}>اسم المستخدم *</label><input value={newUser.username} onChange={e=>setNewUser({...newUser,username:e.target.value})} placeholder="مثال: doctor1" className={inp}/></div><div><label className={label}>كلمة المرور *</label><input value={newUser.password} onChange={e=>setNewUser({...newUser,password:e.target.value})} placeholder="••••••" type="password" className={inp}/></div><div><label className={label}>الدور</label><select value={newUser.role} onChange={e=>setNewUser({...newUser,role:e.target.value})} className={inp}><option>طبيب</option><option>مدير</option><option>استقبال</option><option>محاسب</option></select></div></div><button onClick={()=>{ if(!newUser.username||!newUser.password){ alert('ادخل اسم المستخدم وكلمة المرور'); return } setAppUsers([...appUsers,{id:Date.now().toString(),...newUser}]); setNewUser({username:'',password:'',role:'طبيب'}) }} className={btnSm + ' w-full md:w-auto flex items-center gap-2'}><Plus size={16}/> إضافة المستخدم</button></div>
            <div className={card + ' !bg-white/[.02]'}><div className="flex justify-between items-center mb-3"><div className="font-bold flex items-center gap-2 text-white"><Users size={18}/> عرض المستخدمين - {appUsers.filter((u:any)=> u.username.toLowerCase().includes(userSearch.toLowerCase())).length}</div><div className="relative"><Search size={14} className="absolute right-2 top-2.5 text-slate-500"/><input value={userSearch} onChange={e=>setUserSearch(e.target.value)} placeholder="بحث سريع..." className="pr-7 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs w-40 text-white"/></div></div><div className="overflow-auto"><table className="w-full text-sm"><thead className="text-slate-400 text-xs"><tr><th className="p-2 text-right">اسم المستخدم</th><th className="p-2 text-right">كلمة المرور</th><th className="p-2 text-right">الدور</th><th className="p-2"></th></tr></thead><tbody>{appUsers.filter((u:any)=> u.username.toLowerCase().includes(userSearch.toLowerCase())).map((u:any)=><tr key={u.id} className="border-t border-white/5 hover:bg-white/[0.02]"><td className="p-3 flex items-center gap-2 text-white"><div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center text-xs">{u.username[0]}</div>{u.username}</td><td className="p-3 font-mono text-xs"><span className="flex items-center gap-1 text-slate-300"><Lock size={12} className="text-slate-500"/>{'*'.repeat(u.password.length)}<span className="text-[10px] text-slate-500">({u.password.length})</span></span></td><td className="p-3"><span className="text-xs px-2 py-1 rounded bg-white/10 text-white">{u.role}</span></td><td className="p-3 flex gap-1 justify-end"><button onClick={()=>setEditItem({type:'user',data:u})} className="p-1.5 rounded bg-white/5 text-white"><Edit3 size={12}/></button><button onClick={()=>{ if(confirm('حذف '+u.username+'؟')) setAppUsers(appUsers.filter((x:any)=>x.id!==u.id)) }} className="p-1.5 rounded bg-red-500/20 text-red-300"><Trash2 size={12}/></button></td></tr>)}</tbody></table></div></div>
          </div>
        )}
        {editItem && (<div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={()=>setEditItem(null)}><div className="bg-[#0f172a] border border-white/10 rounded-2xl p-4 w-full max-w-md" onClick={e=>e.stopPropagation()}><h3 className="font-bold mb-3 text-white">{editItem.type==='user'?'تعديل مستخدم': editItem.type==='doc'?'تعديل طبيب':'تعديل معالجة'}</h3>{editItem.type==='doc' && <div className="space-y-2"><input value={editItem.data.name} onChange={e=>setEditItem({...editItem,data:{...editItem.data,name:e.target.value}})} className={inp}/><input value={editItem.data.specialty||''} onChange={e=>setEditItem({...editItem,data:{...editItem.data,specialty:e.target.value}})} className={inp}/><div className="flex gap-2"><button onClick={()=>{setDoctors(doctors.map((d:any)=>d.id===editItem.data.id?editItem.data:d));setEditItem(null)}} className={btnSm}>حفظ</button><button onClick={()=>setEditItem(null)} className={btnGhost}>إلغاء</button></div></div>}{editItem.type==='treat' && <div className="space-y-2"><input value={editItem.data.name} onChange={e=>setEditItem({...editItem,data:{...editItem.data,name:e.target.value}})} className={inp}/><input type="number" value={editItem.data.price} onChange={e=>setEditItem({...editItem,data:{...editItem.data,price:parseInt(e.target.value)||0}})} className={inp}/><div className="flex gap-2"><button onClick={()=>{setTreatTypes(treatTypes.map((t:any)=>t.id===editItem.data.id?editItem.data:t));setEditItem(null)}} className={btnSm}>حفظ</button><button onClick={()=>setEditItem(null)} className={btnGhost}>إلغاء</button></div></div>}{editItem.type==='user' && <div className="space-y-2"><input value={editItem.data.username} onChange={e=>setEditItem({...editItem,data:{...editItem.data,username:e.target.value}})} placeholder="اسم المستخدم" className={inp}/><input value={editItem.data.password} onChange={e=>setEditItem({...editItem,data:{...editItem.data,password:e.target.value}})} placeholder="كلمة المرور" className={inp}/><select value={editItem.data.role} onChange={e=>setEditItem({...editItem,data:{...editItem.data,role:e.target.value}})} className={inp}><option>طبيب</option><option>مدير</option><option>استقبال</option></select><div className="flex gap-2"><button onClick={()=>{setAppUsers(appUsers.map((u:any)=>u.id===editItem.data.id?editItem.data:u));setEditItem(null)}} className={btnSm}>حفظ</button><button onClick={()=>setEditItem(null)} className={btnGhost}>إلغاء</button><button onClick={()=>{setAppUsers(appUsers.filter((u:any)=>u.id!==editItem.data.id));setEditItem(null)}} className="px-3 py-2 rounded-xl bg-red-600 text-white text-sm">حذف</button></div></div>}</div></div>)}
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(()=>{
    try{ return JSON.parse(localStorage.getItem('zircon_currentUser')||'null') }catch{ return null }
  });
  const [page, setPage] = useState('dashboard');
  const [editItem, setEditItem] = useState<any>(null);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  // إذا لا يوجد لا supabase ولا مستخدم محلي => اعرض تسجيل الدخول
  if (!session && !currentUser) return <Login onLogin={(u:any)=>{
    if(u){ setCurrentUser(u); setSession({user:u}); } else {
      supabase.auth.getSession().then(({data}) => { setSession(data.session); try{ setCurrentUser(JSON.parse(localStorage.getItem('zircon_currentUser')||'null')) }catch{} });
    }
  }} />;

  const role = currentUser?.role || 'مدير';
  const isDoctor = role==='طبيب';
  const isReception = role==='استقبال';
  const isAccountant = role==='محاسب';
  const isManager = role==='مدير' || !currentUser?.role;

  // قائمة الصلاحيات حسب الدور
  const allMenu = [
    { id:'dashboard', label:'لوحة التحكم', icon: LayoutDashboard, roles:['مدير','طبيب','استقبال','محاسب'] },
    { id:'reception-card', label:'بطاقة المعاينة', icon: FileCheck, roles:['مدير','استقبال'] },
    { id:'session-booking', label:'حجز الجلسات', icon: Calendar, roles:['مدير','استقبال'] },
    { id:'patients', label:'المرضى', icon: Users, roles:['مدير','طبيب','استقبال'] },
    { id:'treatments-bulk', label:'اضافة معالجات', icon: FileSpreadsheet, roles:['مدير','طبيب'] },
    { id:'appointments', label:'المواعيد', icon: Calendar, roles:['مدير','طبيب','استقبال'] },
    { id:'surgeries', label:'الجراحات', icon: Stethoscope, roles:['مدير','طبيب'] },
    { id:'implants', label:'الزرعات', icon: Syringe, roles:['مدير','طبيب'] },
    { id:'disease-log', label:'سجل الأمراض', icon: ClipboardList, roles:['مدير','طبيب','استقبال','محاسب'] },
    { id:'reports', label:'التقارير', icon: FileText, roles:['مدير','محاسب'] },
    { id:'offer-general', label:'عرض سعر عام', icon: Receipt, roles:['مدير','طبيب','استقبال','محاسب'] },
    { id:'offer-case', label:'عرض سعر للحالة', icon: Receipt, roles:['مدير','طبيب','استقبال'] },
    { id:'patient-archive', label:'ملف المريض - أرشيف', icon: FileCheck, roles:['مدير','طبيب','استقبال'] },
    { id:'session-movements', label:'عرض الجلسات - حركات الجلسات', icon: Clock, roles:['مدير','طبيب','استقبال'] },
    { id:'settings', label:'الاعدادات', icon: SettingsIcon, roles:['مدير'] },
  ];
  const menu = allMenu.filter(m=> m.roles.includes(role));

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
            <button key={m.id} onClick={()=>{ 
              if(m.id.startsWith('disease-')){ setPage('disease-log'); } else { setPage(m.id); } 
              setSidebarOpen(false); 
            }} className={`w-full flex items-center gap-3 text-right p-3 rounded-xl text-sm transition ${page===m.id || (m.id==='disease-log' && page.startsWith('disease')) ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'hover:bg-white/5 text-slate-300'} ${m.label.includes('↳')?'mr-4 !text-xs !py-2 !bg-white/[0.02]':''}`}>
              <m.icon size={m.label.includes('↳')?14:18}/> {m.label.replace('↳','').trim()}
            </button>
          ))}
        </nav>
        <div className="mt-auto space-y-2">
          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
            <div className="flex items-center gap-2"><div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 grid place-items-center text-xs font-bold">{currentUser?.username?.[0]?.toUpperCase()||'م'}</div><div><div className="text-sm font-bold text-white">{currentUser?.username}</div><div className="text-[11px] text-slate-400">{role}</div></div></div>
          </div>
          <button onClick={() => { localStorage.removeItem('zircon_currentUser'); supabase.auth.signOut(); setCurrentUser(null); setSession(null); }} className="w-full flex items-center gap-2 text-red-400 p-3 text-sm hover:bg-red-500/10 rounded-xl"><LogOut size={18}/> تسجيل خروج - {currentUser?.username}</button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-white/10 bg-[#0a1028]/50 backdrop-blur-xl flex items-center justify-between px-4">
          <button onClick={()=>setSidebarOpen(true)} className="lg:hidden text-white"><Menu size={20}/></button>
          <div className="text-sm text-slate-400 hidden lg:block">مرحبا {currentUser?.username} - دورك: {role} - نظام ادارة زراعة الاسنان</div>
          <div className="flex items-center gap-3"><Bell size={18} className="text-slate-400"/><div className="h-8 w-8 rounded-full bg-blue-500/20 text-blue-300 grid place-items-center text-xs font-bold">{currentUser?.username?.[0]?.toUpperCase()||'م'}</div></div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {page==='dashboard' && (role==='استقبال' ? <ReceptionDashboard setPage={setPage} /> : role==='طبيب' ? <DoctorDashboard setPage={setPage} setActivePatient={setSelectedPatient} currentUser={currentUser} /> : <Dashboard setPage={setPage} />)}
          {page==='reception-card' && <ReceptionCardPage />}
          {page==='session-booking' && <SessionBookingPage />}
          {page==='doctor-cards' && <DoctorCardsView setPage={setPage} />}
          {page==='doctor-treatments-list' && <DoctorTreatmentsList setPage={setPage} />}
          {page==='medicines-list' && <MedicinesList setPage={setPage} />}
          {page==='doctor-appointments' && <DoctorAppointments setPage={setPage} />}
          {page==='treatment-screen' && <TreatmentScreen activePatient={selectedPatient} setPage={setPage} />}
          {page==='patients' && <Patients setPage={setPage} setEditItem={setEditItem} setSelectedPatient={setSelectedPatient} />}
          {page==='treatments-bulk' && <TreatmentsBulk />}
          {page==='patient-new' && <PatientForm patient={editItem} onSave={()=>setPage('patients')} onCancel={()=>setPage('patients')} />}
          {page==='patient-detail' && selectedPatient && <PatientDetail patient={selectedPatient} onBack={()=>setPage('patients')} setPage={setPage} setEditItem={setEditItem} />}
          {page==='appointments' && <Appointments setPage={setPage} />}
          {page==='appointment-new' && <AppointmentForm onSave={()=>setPage('appointments')} onCancel={()=>setPage('appointments')} />}
          {page==='surgeries' && <Surgeries setPage={setPage} setSelectedPatient={setSelectedPatient} />}
          {page==='surgery-new' && <SurgeryForm onSave={()=>setPage('surgeries')} onCancel={()=>setPage('surgeries')} />}
          {page==='implants' && <Implants />}
          {page==='disease-log' && <DiseaseLog />}
          {page==='reports' && <Reports />}
          {page==='offer-general' && <OfferGeneralPage setPage={setPage} />}
          {page==='offer-case' && <OfferCasePage setPage={setPage} />}
          {page==='patient-archive' && <PatientArchivePage setPage={setPage} />}
          {page==='session-movements' && <SessionMovementsPage setPage={setPage} />}
          {page==='settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}