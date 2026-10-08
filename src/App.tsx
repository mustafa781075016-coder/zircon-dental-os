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
function Reports() { const [stats, setStats] = useState({ patients:0, surgeries:0, implants:0 }); useEffect(()=>{ (async()=>{ const [p,s,i]=await Promise.all([ supabase.from('patients').select('*',{count:'exact', head:true}), supabase.from('surgeries').select('*',{count:'exact', head:true}), supabase.from('implants').select('*',{count:'exact', head:true}) ]); setStats({ patients: p.count||0, surgeries: s.count||0, implants: i.count||0 }); })(); },[]); return <div className="space-y-4"><h2 className="text-xl font-bold text-white">التقارير</h2><div className="grid grid-cols-2 gap-4"><div className={card}><div className="text-2xl font-bold text-white">{stats.patients}</div><div className="text-sm text-slate-400">اجمالي المرضى</div></div><div className={card}><div className="text-2xl font-bold text-purple-400">{stats.surgeries}</div><div className="text-sm text-slate-400">اجمالي الجراحات</div></div><div className={card}><div className="text-2xl font-bold text-emerald-400">{stats.implants}</div><div className="text-sm text-slate-400">اجمالي الزرعات</div></div></div></div>; }


// ==================== صفحة الاستقبال - بطاقة المعاينة - قلب النظام ====================
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
function SessionBookingPage(){
  const [cards, setCards] = useState<any[]>(()=>{ try{ const v=JSON.parse(localStorage.getItem('zircon_visitCards')||'[]'); if(v.length>0) return v; return JSON.parse(localStorage.getItem('zircon_receptionCards')||'[]'); }catch{ return [] } });
  const [doctors, setDoctors] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon_doctors')||'[]') }catch{ return [] } });
  const [bookings, setBookings] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon_sessionBookings')||'[]') }catch{ return [] } });
  const [form, setForm] = useState({ patientId:'', patientName:'', cardNo:'', doctorId:'', doctorName:'', date:TODAY });
  useEffect(()=>{ try{ const v=JSON.parse(localStorage.getItem('zircon_visitCards')||'[]'); if(v.length>0) setCards(v); }catch{} },[]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  useEffect(()=>{ localStorage.setItem('zircon_sessionBookings', JSON.stringify(bookings)) },[bookings]);
  const dayBookings = bookings.filter((b:any)=> b.date===form.date && (form.doctorName ? b.doctorName===form.doctorName : true));
  function bookSession(){
    if(!form.patientName || !form.doctorName || !form.date){ alert('اختر المريض والطبيب وتاريخ الحجز'); return; }
    const conflict = bookings.find((b:any)=> b.date===form.date && b.doctorName===form.doctorName && b.cardNo===form.cardNo);
    if(conflict){ alert('هذا المريض لديه حجز مسبق في نفس اليوم لنفس الطبيب'); return; }
    const newBooking = { ...form, id:Date.now().toString(), bookedAt:new Date().toISOString() };
    setBookings([newBooking, ...bookings]);
    alert(`تم حجز جلسة للمريض ${form.patientName} - بطاقة ${form.cardNo} - مع ${form.doctorName} بتاريخ ${form.date}`);
    setForm({ ...form, patientId:'', patientName:'', cardNo:'' });
  }
  function removeBooking(){
    if(!selectedBooking){ alert('اختر حجز من الجدول أولا'); return; }
    if(confirm(`إزالة حجز ${selectedBooking.patientName} ؟`)){ setBookings(bookings.filter((b:any)=> b.id!==selectedBooking.id)); setSelectedBooking(null); }
  }
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">حجز الجلسات - مربوط ببطاقة المعاينة - المريض الواحد له عدة حجوزات بنفس رقم البطاقة</h2>
      <div className={card + ' !p-4'}>
        <div className="grid md:grid-cols-4 gap-3">
          <div><label className={label}>اسم المريض - من البطاقة</label><select value={form.patientId} onChange={e=>{ const p=cards.find((x:any)=>x.id===e.target.value); setForm({...form, patientId:p?.id||'', patientName:p?.full_name||'', cardNo:p?.cardNo||''}) }} className={inp}><option value="">اختر مريض</option>{cards.map((c:any)=><option key={c.id} value={c.id}>{c.full_name} - {c.cardNo}</option>)}</select></div>
          <div><label className={label}>الطبيب المعالج</label><select value={form.doctorId} onChange={e=>{ const d=doctors.find((x:any)=>x.id===e.target.value); setForm({...form, doctorId:d?.id||'', doctorName:d?.name||''}) }} className={inp}><option value="">اختر طبيب</option>{doctors.map((d:any)=><option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
          <div><label className={label}>تاريخ الحجز - مثال: 05 أكتوبر 2026</label><input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} className={inp}/></div>
          <div className="flex items-end gap-2">
            <button onClick={bookSession} className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 text-sm flex items-center justify-center gap-2"><span>✓</span> حجز جلسة - زر أخضر</button>
            <button onClick={removeBooking} className="rounded-xl bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 text-sm flex items-center justify-center gap-2"><span>X</span> ازالة الحجز - زر أحمر</button>
          </div>
        </div>
        {form.cardNo && <div className="mt-3 text-xs text-blue-300">بطاقة المعاينة = ملف المريض الدائم - رقم البطاقة: {form.cardNo} - حجز جلسة = موعد داخل هذا الملف</div>}
      </div>
      <div className={card + ' !p-0 overflow-hidden'}>
        <div className="p-3 border-b border-white/10 flex justify-between"><span className="font-bold text-white text-sm">كل الحجوزات في نفس اليوم لنفس الطبيب - لتجنب التعارض - {dayBookings.length} حجز في {form.date}</span><span className="text-xs text-slate-400">رقم البطاقة + اسم المريض + اسم الطبيب</span></div>
        <div className="overflow-auto max-h-[400px]">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-slate-400 text-xs sticky top-0"><tr><th className="text-right px-3 py-2">رقم البطاقة</th><th className="text-right px-3 py-2">اسم المريض</th><th className="text-right px-3 py-2">اسم الطبيب</th><th className="text-right px-3 py-2">تاريخ الحجز</th><th className="text-right px-3 py-2">وقت الحجز</th></tr></thead>
            <tbody className="divide-y divide-white/5">
              {dayBookings.length===0 ? <tr><td colSpan={5} className="p-6 text-center text-slate-500">لا يوجد حجوزات في هذا اليوم لهذا الطبيب</td></tr> :
                dayBookings.map((b:any)=><tr key={b.id} className={`hover:bg-white/5 cursor-pointer ${selectedBooking?.id===b.id ? 'bg-blue-500/10' : ''}`} onClick={()=>setSelectedBooking(b)}>
                  <td className="px-3 py-2 font-mono text-blue-300 font-bold">{b.cardNo}</td>
                  <td className="px-3 py-2 text-white">{b.patientName}</td>
                  <td className="px-3 py-2 text-slate-300">{b.doctorName}</td>
                  <td className="px-3 py-2 text-slate-400">{fmtDate(b.date)}</td>
                  <td className="px-3 py-2 text-slate-500 text-xs">{fmtDateTime(b.bookedAt)}</td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
      <div className={card + ' !p-3 !bg-blue-500/5 border-blue-500/20'}>
        <div className="text-xs text-slate-300 space-y-1">
          <div><b className="text-white">الربط بين الصفحتين:</b></div>
          <div>بطاقة المعاينة = ملف المريض الدائم - رقم البطاقة (مثال: 5768) هو المعرف الوحيد</div>
          <div>حجز جلسة = موعد داخل هذا الملف - المريض الواحد ممكن يكون له عدة حجوزات جلسات مرتبطة بنفس رقم بطاقة المعاينة</div>
        </div>
      </div>
    </div>
  );
}





/* ============ DOCTOR DASHBOARD - حسب المواصفات صورة 4 ============ */
function DoctorDashboard({ setPage, setActivePatient, currentUser }: any) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [currentDoctor, setCurrentDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [viewMode, setViewMode] = useState<'all' | 'today' | 'date'>('today');
  const [activeSel, setActiveSel] = useState<any>(null);

  const loadData = useCallback(()=>{
    try {
      const s = JSON.parse(localStorage.getItem('zircon_sessions') || '[]');
      setSessions(s);
      const v = JSON.parse(localStorage.getItem('zircon_visitCards') || '[]');
      const r = JSON.parse(localStorage.getItem('zircon_receptionCards') || '[]');
      const merged = v.length>0 ? v : r;
      setCards(merged);
    } catch {}
    try {
      const u = currentUser || JSON.parse(localStorage.getItem('zircon_currentUser')||'null');
      if(u?.doctorName) setCurrentDoctor(u.doctorName);
    } catch {}
  },[currentUser]);

  useEffect(()=>{ loadData(); },[loadData]);
  useEffect(()=>{
    const id = setInterval(loadData, 2000);
    return ()=>clearInterval(id);
  },[loadData]);

  function findCardBySession(s:any){
    return cards.find((c:any)=> (c.cardNumber||c.cardNo)==s.cardNumber || (c.name||c.full_name)==s.patientName);
  }

  function enterPatient(s:any){
    const card = findCardBySession(s);
    setActivePatient({
      cardNumber: s.cardNumber,
      name: s.patientName,
      doctor: s.doctor || currentDoctor,
      phone: card?.phone || s.phone || '',
      age: card?.age || '',
      gender: card?.gender || '',
      cardData: card || null,
      sessionId: s.id,
      sessionDate: s.date,
      ratio: card?.ratio || '67 / 50'
    });
    setPage('treatment-screen');
  }

  function postponeSession(s:any){
    const newDate = prompt('تاريخ التأجيل الجديد (YYYY-MM-DD):', s.date);
    if(!newDate) return;
    const updated = sessions.map((x:any)=> x.id===s.id ? {...x, date:newDate} : x);
    localStorage.setItem('zircon_sessions', JSON.stringify(updated));
    setSessions(updated);
    alert('تم تأجيل الموعد');
  }

  function cancelSession(s:any){
    if(!confirm(`إلغاء موعد ${s.patientName} - #${s.cardNumber}؟`)) return;
    const updated = sessions.filter((x:any)=> x.id!==s.id);
    localStorage.setItem('zircon_sessions', JSON.stringify(updated));
    setSessions(updated);
  }

  // FIXED: ربط مباشر بين الاستقبال والطبيب - اذا لا يوجد حجوزات، اعرض بطاقات المعاينة مباشرة
  const sessionsOrCards = sessions.length>0 ? sessions : cards.map((c:any)=>({
    id: 'card_'+c.cardNumber,
    cardNumber: c.cardNumber,
    patientName: c.name,
    patientId: c.cardNumber,
    doctor: c.doctor,
    date: (c.createdAt||'').slice(0,10) || TODAY,
    phone: c.phone,
    createdAt: c.createdAt,
    source: 'from_visitCards_fallback'
  }));
  // منطق العمل: المريض يظهر بعد التسجيل في الاستقبال (حتى بدون حجز جلسة منفصل)
  const filteredSessions = sessionsOrCards.filter((s:any)=>{
    // لا نفلتر بالطبيب اذا المستخدم مدير او لم يتم تحديد طبيب
    if(currentDoctor && s.doctor && currentDoctor!=='مدير' && s.doctor!==currentDoctor) {
      // تساهل في المقارنة - اذا الاسم يحتوي جزء
      if(!s.doctor.includes(currentDoctor) && !currentDoctor.includes(s.doctor)) {
        // اذا الطبيب فارغ في البطاقة، اسمح بالعرض
        if(s.doctor && s.doctor.trim()!=='') return false;
      }
    }
    if(viewMode==='today') {
      // اعرض اليوم + البطاقات التي بدون تاريخ اليوم ايضا لضمان الظهور
      const d = (s.date||'').slice(0,10);
      return d===TODAY || s.source==='from_visitCards_fallback';
    }
    if(viewMode==='date') return (s.date||'').slice(0,10)===selectedDate;
    return true;
  }).sort((a:any,b:any)=> (b.createdAt||'').localeCompare(a.createdAt||''));

  const todayCount = sessions.filter((s:any)=> s.date===TODAY).length;

  const Icons = [
    { icon:'🦷', label:'المعالجة', desc:'حفظ / تعديل / مسح البحث / إلغاء', action:()=>{
        if(activeSel) enterPatient(activeSel);
        else if(filteredSessions.length>0) enterPatient(filteredSessions[0]);
        else if(cards.length>0) {
          const c = cards[0];
          enterPatient({ id:'card_'+c.cardNumber, cardNumber:c.cardNumber, patientName:c.name, doctor:c.doctor, date:TODAY, phone:c.phone });
        }
        else alert('لا يوجد مرضى - اذهب للاستقبال وسجل بطاقة معاينة أولا');
      }, tone:'from-emerald-500/20 to-teal-700/10 border-emerald-500/30 ring-2 ring-emerald-500/20' },
    { icon:'📋', label:'بطاقة معاينة', desc:'بيانات المريض من الاستقبال', action:()=>setPage('doctor-cards'), tone:'from-blue-500/20 to-indigo-700/10 border-blue-500/30' },
    { icon:'📊', label:'قائمة المعالجات', desc:'حشو، خلع، زيركون...', action:()=>setPage('doctor-treatments-list'), tone:'from-purple-500/20 to-violet-700/10 border-purple-500/30' },
    { icon:'💊', label:'قائمة الأدوية', desc:'وصفات جاهزة', action:()=>setPage('medicines-list'), tone:'from-amber-500/20 to-orange-700/10 border-amber-500/30' },
    { icon:'📅', label:'قائمة المواعيد', desc:'مواعيد محجوزة', action:()=>setPage('doctor-appointments'), tone:'from-cyan-500/20 to-blue-700/10 border-cyan-500/30' },
  ];

  // الكروت الجديدة الثلاثة المستخرجة من شاشة المعالجة
  const NewCards = [
    { 
      icon:'💰', label:'عروض الأسعار', desc:'وظائف عامة للعيادة',
      tone:'from-amber-500/20 to-yellow-700/10 border-amber-500/30',
      buttons: [
        { label:'عرض سعر عام', action:()=>{
            const html = `<html dir="rtl"><head><title>عرض سعر عام</title><style>body{font-family:Cairo,Arial;text-align:center;padding:20px}table{width:100%;border-collapse:collapse;margin-top:15px}th,td{border:1px solid #000;padding:8px}h1{color:#1e40af}</style></head><body><h1>مركز زركون - عرض سعر عام</h1><p>التاريخ: ${new Date().toLocaleDateString('ar-EG')}</p><table><thead><tr><th>المعالجة</th><th>السعر</th></tr></thead><tbody><tr><td>زراعة سن</td><td>3500 ر.س</td></tr><tr><td>حشوة تجميلية</td><td>500 ر.س</td></tr><tr><td>تنظيف</td><td>200 ر.س</td></tr></tbody></table></body></html>`;
            const w = window.open('','_blank'); if(w){ w.document.write(html); w.document.close(); setTimeout(()=>w.print(),400); }
        }},
        { label:'عرض سعر الحالة', action:()=>{
            const sel = activeSel || (filteredSessions[0]) || null;
            const p = sel ? {name:sel.patientName, cardNumber:sel.cardNumber, phone:sel.phone||''} : {name:'محمد علي', cardNumber:'5708', phone:'777938352'};
            const treatments = JSON.parse(localStorage.getItem('zircon_bulkRows')||'[]').filter((t:any)=> t.patientName===p.name);
            const total = treatments.reduce((s:any,r:any)=>s+Number(r.cost||0),0) || 2000;
            const html = `<html dir="rtl"><head><title>عرض سعر حالة</title><style>body{font-family:Cairo,Arial;padding:20px}.box{border:2px solid #000;padding:15px;border-radius:10px;max-width:600px;margin:auto}table{width:100%;border-collapse:collapse;margin-top:10px}th,td{border:1px solid #000;padding:6px;font-size:13px}</style></head><body><div class="box"><h1 style="text-align:center;color:#1e40af">عرض سعر حالة - #${p.cardNumber}</h1><p><b>المريض:</b> ${p.name} | <b>الجوال:</b> ${p.phone}</p><table><thead><tr><th>المعالجة</th><th>الطبيب</th><th>السن</th><th>السعر</th></tr></thead><tbody>${treatments.length? treatments.map((t:any)=>`<tr><td>${t.treatName||'-'}</td><td>${t.doctorName||'-'}</td><td>${t.tooth||'-'}</td><td>${t.cost} ر.س</td></tr>`).join('') : `<tr><td>حشو ضوئي</td><td>د. أحمد الشطبي - 67 / 50</td><td>8</td><td>2000 ر.س</td></tr>`}<tr style="background:#f0f0f0;font-weight:bold"><td colspan="3">الإجمالي</td><td>${total} ر.س</td></tr></tbody></table><p style="font-size:11px;margin-top:15px">رقم بطاقة المعاينة هو المعرف الوحيد طول فترة العلاج</p></div></body></html>`;
            const w = window.open('','_blank'); if(w){ w.document.write(html); w.document.close(); setTimeout(()=>w.print(),400); }
        }},
      ]
    },
    { 
      icon:'📊', label:'التقارير', desc:'مركز تقارير العيادة',
      tone:'from-indigo-500/20 to-purple-700/10 border-indigo-500/30',
      buttons: [
        { label:'تقرير عام', action:()=>setPage('reports')},
        { label:'تقرير تفصيلي', action:()=>setPage('disease-log')},
        { label:'تقرير جدولي', action:()=>setPage('treatments-bulk')},
      ]
    },
    { 
      icon:'🦷', label:'إدارة الجلسات', desc:'حجز ومتابعة',
      tone:'from-cyan-500/20 to-teal-700/10 border-cyan-500/30',
      buttons: [
        { label:'+ إضافة جلسة', action:()=>{
            const p = JSON.parse(localStorage.getItem('zircon_visitCards')||'[]')[0];
            if(p){ 
              const sess={id:Date.now().toString(), cardNumber:p.cardNumber, patientName:p.name, doctor:p.doctor, date:new Date().toISOString().slice(0,10), phone:p.phone, createdAt:new Date().toISOString()}; 
              const all=JSON.parse(localStorage.getItem('zircon_sessions')||'[]'); 
              localStorage.setItem('zircon_sessions', JSON.stringify([sess,...all])); 
              localStorage.setItem('zircon_sessionBookings', JSON.stringify([sess,...all])); 
              alert('✓ تمت إضافة جلسة للمريض '+p.name); 
              window.location.reload();
            } else setPage('session-booking'); 
        }},
        { label:'↩ التراجع على ماتم', action:()=>{ if(confirm('تراجع عن آخر عملية؟')){ const all=JSON.parse(localStorage.getItem('zircon_sessions')||'[]'); if(all.length>0){ localStorage.setItem('zircon_sessions', JSON.stringify(all.slice(1))); alert('تم التراجع'); window.location.reload(); } } }},
      ]
    },
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-600/20 to-indigo-700/10 p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><Stethoscope size={24} className="text-blue-400"/> لوحة تحكم الطبيب</h2>
            <p className="text-slate-300 text-xs mt-1">مرحباً د. {currentDoctor || currentUser?.username || 'الطبيب'} — {todayCount} مريض في قائمة اليوم</p>
            <p className="text-[10px] text-slate-500 mt-1">المرضى يظهرون هنا فقط بعد حجز جلسة من الاستقبال</p>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <span className="text-xs text-slate-400">التاريخ:</span>
            <select value={viewMode} onChange={e=>setViewMode(e.target.value as any)} className="rounded-xl bg-white/10 border border-white/20 px-3 py-2 text-sm text-white">
              <option value="today">اليوم ({TODAY}) - {todayCount}</option>
              <option value="all">كل الحجوزات ({sessions.length})</option>
              <option value="date">تاريخ محدد</option>
            </select>
            {viewMode==='date' && <input type="date" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)} className="rounded-xl bg-white/10 border border-white/20 px-3 py-2 text-sm text-white"/>}
            <button onClick={loadData} className="rounded-xl bg-white/10 hover:bg-white/20 text-white p-2"><RefreshCw size={16}/></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {Icons.map((ic:any,i:number)=>(
          <button key={'old-'+i} onClick={ic.action} className={'rounded-2xl border bg-gradient-to-br p-5 text-center hover:scale-[1.02] transition ' + ic.tone}>
            <div className="text-4xl mb-2">{ic.icon}</div>
            <div className="text-sm font-bold text-white">{ic.label}</div>
            <div className="text-[10px] text-slate-400 mt-1">{ic.desc}</div>
          </button>
        ))}
        {NewCards.map((ic:any,i:number)=>(
          <div key={'new-'+i} className={'rounded-2xl border bg-gradient-to-br p-4 text-center transition ' + ic.tone}>
            <div className="text-4xl mb-1">{ic.icon}</div>
            <div className="text-sm font-bold text-white">{ic.label}</div>
            <div className="text-[10px] text-slate-400 mb-3">{ic.desc}</div>
            <div className="flex flex-col gap-1.5">
              {ic.buttons.map((b:any, bi:number)=>(
                <button key={bi} onClick={b.action} className="w-full rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white px-2 py-2 text-xs font-bold">
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={card + ' !p-0 overflow-hidden'}>
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center gap-2"><Users size={18} className="text-cyan-400"/> قائمة الانتظار - {filteredSessions.length} <span className="text-xs text-slate-400 font-normal">- محتوى اليوم {TODAY}</span></h3>
          <span className="text-xs text-slate-500">رقم بطاقة المعاينة | اسم المريض | تاريخ الموعد | الطبيب المعالج</span>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-3">#</th><th className="text-right px-4 py-3">رقم البطاقة</th><th className="text-right px-4 py-3">اسم المريض</th><th className="text-right px-4 py-3">تاريخ الموعد</th><th className="text-right px-4 py-3">الطبيب المعالج</th><th className="text-right px-4 py-3">إجراءات</th></tr></thead>
            <tbody className="divide-y divide-white/5">
              {filteredSessions.length===0 ? (
                <tr><td colSpan={6} className="p-10 text-center">
                  <div className="text-5xl mb-3">📅</div>
                  <div className="text-slate-300 font-bold">لا يوجد مرضى في قائمة الانتظار</div>
                  <div className="text-xs text-slate-500 mt-2">المريض يظهر هنا فقط بعد ما الاستقبال يعمله حجز جلسة<br/>عدد البطاقات في الاستقبال: {cards.length} - عدد الحجوزات: {sessions.length}</div>
                  <button onClick={()=>setPage('doctor-cards')} className={btnSm + ' mt-4 mx-auto'}>عرض بطاقات المعاينة</button>
                </td></tr>
              ) : filteredSessions.map((s:any, idx:number)=>(
                <tr key={s.id} onClick={()=>setActiveSel(s)} className={`hover:bg-white/5 cursor-pointer ${activeSel?.id===s.id ? 'bg-blue-500/20 border-r-2 border-r-blue-500' : ''}`}>
                  <td className="px-4 py-3 text-slate-400">#{idx+1}</td>
                  <td className="px-4 py-3 font-mono text-blue-300 text-xs" dir="ltr">#{s.cardNumber}</td>
                  <td className="px-4 py-3 text-white font-medium">{s.patientName}</td>
                  <td className="px-4 py-3 text-slate-300 text-xs" dir="ltr">{s.date}</td>
                  <td className="px-4 py-3 text-slate-300 text-xs">{s.doctor}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={(e)=>{ e.stopPropagation(); enterPatient(s); }} className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"><Check size={12}/> دخول</button>
                      <button onClick={(e)=>{ e.stopPropagation(); postponeSession(s); }} className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs">تأجيل</button>
                      <button onClick={(e)=>{ e.stopPropagation(); cancelSession(s); }} className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs">X</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function JawModal({ selected, onToggle, onClose }: any) {
  const Cell = ({ fdi }: any) => {
    const palmer = fdi % 10;
    const sel = selected.includes(fdi);
    return (
      <button onClick={()=>onToggle(fdi)} className={`relative rounded-lg border-2 aspect-square flex flex-col items-center justify-center transition-all ${sel ? 'bg-emerald-500 border-emerald-300 scale-105' : 'bg-white/5 border-white/15 hover:bg-white/10'}`}>
        <span className={`text-lg font-black ${sel ? 'text-white' : 'text-white/70'}`}>{palmer}</span>
        <span className={`text-[7px] ${sel ? 'text-white/80' : 'text-slate-500'}`}>{fdi}</span>
      </button>
    );
  };
  const upperRight = [18,17,16,15,14,13,12,11];
  const upperLeft = [21,22,23,24,25,26,27,28];
  const lowerRight = [48,47,46,45,44,43,42,41];
  const lowerLeft = [31,32,33,34,35,36,37,38];
  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-2" onClick={onClose}>
      <div className="bg-[#0a1028] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-auto" onClick={e=>e.stopPropagation()}>
        <div className="p-3 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#0a1028] z-10">
          <h3 className="text-white font-bold text-sm">🦷 مخطط الأسنان - اختر السن (مهم للربط)</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-white/10 text-white"><X size={16}/></button>
        </div>
        <div className="p-4 space-y-4">
          <div><div className="text-center text-[11px] text-slate-400 mb-2">الفك العلوي</div><div className="flex gap-1"><div className="grid grid-cols-8 gap-1 flex-1">{upperRight.map(fdi=><Cell key={fdi} fdi={fdi}/>)}</div><div className="w-[2px] bg-red-500 mx-1"></div><div className="grid grid-cols-8 gap-1 flex-1">{upperLeft.map(fdi=><Cell key={fdi} fdi={fdi}/>)}</div></div></div>
          <div className="h-[2px] bg-red-500 w-full"></div>
          <div><div className="text-center text-[11px] text-slate-400 mb-2">الفك السفلي</div><div className="flex gap-1"><div className="grid grid-cols-8 gap-1 flex-1">{lowerRight.map(fdi=><Cell key={fdi} fdi={fdi}/>)}</div><div className="w-[2px] bg-red-500 mx-1"></div><div className="grid grid-cols-8 gap-1 flex-1">{lowerLeft.map(fdi=><Cell key={fdi} fdi={fdi}/>)}</div></div></div>
          {selected.length>0 && <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-sm text-emerald-300">تم اختيار {selected.length} أسنان: {selected.join(', ')}</div>}
        </div>
        <div className="p-3 border-t border-white/10 flex justify-end sticky bottom-0 bg-[#0a1028]"><button onClick={onClose} className="px-6 py-2 rounded-xl bg-blue-600 text-white font-bold">تم</button></div>
      </div>
    </div>
  );
}

/* ============ DOCTOR CARDS VIEW ============ */
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
  const [items] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon_treatTypes')||'[{"id":"1","name":"8 - حشو ضوئي","price":2000},{"id":"2","name":"خلع سن","price":1500},{"id":"3","name":"تركيب زيركون","price":8000}]'); }catch{ return []; } });
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3"><button onClick={()=>setPage('dashboard')} className="text-slate-400"><ArrowRight size={20}/></button><h2 className="text-xl font-bold text-white">قائمة المعالجات - جدول بكل أنواع المعالجات وأسعارها</h2></div>
      <div className={card + ' !p-0 overflow-hidden'}><table className="w-full text-sm"><thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-3">#</th><th className="text-right px-4 py-3">اسم المعالجة</th><th className="text-right px-4 py-3">السعر</th></tr></thead><tbody className="divide-y divide-white/5">{items.map((it:any,i:number)=><tr key={it.id} className="hover:bg-white/5"><td className="px-4 py-3 text-slate-400">{i+1}</td><td className="px-4 py-3 text-white">{it.name}</td><td className="px-4 py-3 text-emerald-400">{it.price}</td></tr>)}</tbody></table></div>
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
          <div><label className={label}>نوع المعالجة * - مثال: 8 - حشو ضوئي</label><select value={currentForm.treatType} onChange={e=>{ const t=treatTypes.find((x:any)=>x.name===e.target.value); setCurrentForm({...currentForm, treatType:e.target.value, cost:t?.price||currentForm.cost}); }} className={inp}><option value="">اختر من قائمة المعالجات</option>{treatTypes.map((t:any)=><option key={t.id} value={t.name}>{t.name} - {t.price}</option>)}</select></div>
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
          {page==='settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}