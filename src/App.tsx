import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  LayoutDashboard, Users, Calendar, LogOut, Menu, Bell, X,
  Stethoscope, Syringe, Receipt, FileText, Settings as SettingsIcon,
  Plus, Search, Mail, Lock, Loader2, ArrowRight, Save, Trash2, Edit3,
  MessageCircle, Clock, DollarSign, UserPlus, ClipboardList, HeartPulse, FileSpreadsheet,
  Megaphone, TrendingUp, Target, BarChart3
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

async function hashPassword(pw: string): Promise<string> {
  const buf = new TextEncoder().encode(pw + '_zircon_salt_2024');
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('');
}

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

function Login({ onLogin }: { onLogin: (user:any)=>void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasUsers, setHasUsers] = useState<boolean|null>(null);

  useEffect(()=>{
    supabase.from('app_users').select('id', {count:'exact', head:true}).then(({count, error})=>{
      setHasUsers(!error && (count||0) > 0);
    });
  },[]);

  async function createFirstAdmin() {
    if(!username || !password){ setErr('ادخل اسم المستخدم وكلمة المرور'); return; }
    setLoading(true);
    const hash = await hashPassword(password);
    const { error } = await supabase.from('app_users').insert({ username: username.trim(), password_hash: hash, role: 'مدير' });
    setLoading(false);
    if(error){ setErr(error.message); return; }
    const user = { username, role:'مدير' };
    localStorage.setItem('zircon_currentUser', JSON.stringify(user));
    onLogin(user);
  }

  async function submit(e:any){
    e.preventDefault();
    setErr(''); setLoading(true);
    try{
      const { data, error } = await supabase.from('app_users').select('*').eq('username', username.trim()).eq('is_active', true).maybeSingle();
      if(error){ setLoading(false); setErr(error.message); return; }
      if(!data){ setLoading(false); setErr('اسم المستخدم غير موجود'); return; }
      const hash = await hashPassword(password);
      if(hash !== data.password_hash){ setLoading(false); setErr('كلمة المرور غير صحيحة'); return; }
      const user = { username: data.username, role: data.role };
      localStorage.setItem('zircon_currentUser', JSON.stringify(user));
      setLoading(false);
      onLogin(user);
    }catch(e:any){ setLoading(false); setErr(e.message||'خطأ'); }
  }

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center p-6 bg-[#060a1a]">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[.03] backdrop-blur-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 grid place-items-center text-2xl font-bold text-white mb-4 shadow-xl">Z</div>
          <h1 className="text-2xl font-bold text-white">Zircon OS</h1>
          <p className="text-sm text-blue-300/70 mt-2">نظام ادارة عيادة زراعة الاسنان</p>
        </div>
        {hasUsers === false ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm px-4 py-3">
              ⚠️ لا يوجد مستخدمون بعد. أنشئ المدير الأول:
            </div>
            <div>
              <label className={label}>اسم المستخدم</label>
              <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="admin" dir="ltr" className={inp}/>
            </div>
            <div>
              <label className={label}>كلمة المرور</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••" dir="ltr" className={inp}/>
            </div>
            {err && <div className="rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3">{err}</div>}
            <button onClick={createFirstAdmin} disabled={loading} className={btn}>
              {loading && <Loader2 className="animate-spin" size={18}/>} إنشاء المدير والدخول
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className={label}>اسم المستخدم</label>
              <div className="relative">
                <Users size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={username} onChange={e=>setUsername(e.target.value)} required dir="ltr" className={inp + ' pr-10'}/>
              </div>
            </div>
            <div>
              <label className={label}>كلمة المرور</label>
              <div className="relative">
                <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required dir="ltr" className={inp + ' pr-10'}/>
              </div>
            </div>
            {err && <div className="rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3">{err}</div>}
            <button type="submit" disabled={loading} className={btn}>
              {loading && <Loader2 className="animate-spin" size={18}/>} دخول
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const TEETH_UPPER = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28];
const TEETH_LOWER = [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];
const TOOTH_COLORS: any = { 1:'#e06a6a', 2:'#b78a4a', 3:'#2ea86a', 4:'#3a8ab5', 5:'#6b4c9a', 6:'#d16a8a', 7:'#a3b82a', 8:'#7a8a2e' };
function getShortNumber(fdi: number) { return fdi % 10; }

function ToothShape({ num, has, onClick }: { num: number, has: boolean, onClick: () => void }) {
  const shortNum = getShortNumber(num);
  const color = (TOOTH_COLORS as any)[shortNum] || '#94a3b8';
  const isMolar = shortNum >= 6;
  let path = "";
  if (shortNum === 1) path = "M 8 12 Q 25 2 42 12 Q 40 32 25 46 Q 10 32 8 12 Z";
  else if (shortNum === 2) path = "M 10 14 Q 25 4 40 14 Q 38 30 25 42 Q 12 30 10 14 Z";
  else if (shortNum === 3) path = "M 13 10 Q 25 0 37 10 Q 40 26 25 48 Q 10 26 13 10 Z";
  else if (shortNum === 4 || shortNum === 5) path = "M 10 16 Q 25 6 40 16 Q 43 30 40 46 Q 25 56 10 46 Q 7 30 10 16 Z";
  else path = "M 8 14 Q 14 8 25 10 Q 36 8 42 14 Q 46 22 44 34 Q 46 46 41 52 Q 32 56 25 54 Q 18 56 9 52 Q 4 46 6 34 Q 4 22 8 14 Z";
  return (
    <button onClick={onClick} className="absolute group" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%' }}>
      <svg viewBox="0 0 50 60" className="w-full h-full overflow-visible">
        <path d={path} fill={has ? '#10b981' : 'rgba(255,255,255,0.04)'} stroke={has ? '#10b981' : 'rgba(255,255,255,0.25)'} strokeWidth="1.6" className="transition-all group-hover:fill-white/[0.08] group-hover:stroke-white/40" />
        <text x="25" y={isMolar ? "34" : "30"} textAnchor="middle" dominantBaseline="middle" fontSize={isMolar ? "20" : "22"} fontWeight="800" fill={has ? 'white' : color} className="select-none">{shortNum}</text>
        {has && <text x="25" y="44" textAnchor="middle" fontSize="7" fontWeight="700" fill="white">زرعة</text>}
      </svg>
      <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[8px] font-bold text-slate-500/70 group-hover:text-slate-300">{num}</span>
    </button>
  );
}

function ToothChart({ implants, onToothClick }: { implants: any[], onToothClick: (n:number)=>void }) {
  const implanted = new Set(implants.map((i:any)=>i.tooth_number));
  const Arch = ({ teeth, isUpper }: { teeth: number[], isUpper: boolean }) => (
    <div className="relative w-full h-[440px] md:h-[480px] mx-auto max-w-[420px]">
      <div className={`absolute left-1/2 -translate-x-1/2 w-[92%] h-[92%] border border-white/10 rounded-[50%] pointer-events-none ${isUpper ? 'top-[4%] rounded-b-none border-b-0' : 'bottom-[4%] rounded-t-none border-t-0'}`} />
      {teeth.map((n, idx) => {
        const total = teeth.length;
        const startAngle = isUpper ? 180 : 0;
        const endAngle = isUpper ? 360 : 180;
        const angle = startAngle + (endAngle - startAngle) * (idx / (total - 1));
        const rad = (angle * Math.PI) / 180;
        const x = 50 + 43 * Math.cos(rad);
        const y = (isUpper ? 80 : 20) + 54 * Math.sin(rad);
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
  return (
    <div className={card + ' !p-3 md:!p-5'}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-white text-sm md:text-base">مخطط الأسنان - الترقيم 1-8</h3>
        <div className="flex gap-2 text-[9px] text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>مزروع</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white/20"></span>فارغ</span>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
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

function SearchSelect({ placeholder, options, value, onSelect, displayKey='name' }:{ placeholder:string, options:any[], value:string, onSelect:(o:any)=>void, displayKey?:string }){
  const [q,setQ]=useState(value);
  const [open,setOpen]=useState(false);
  const filtered = options.filter((o:any)=>{
    const name = (o[displayKey] || o.name || o.full_name || '').toString().toLowerCase();
    return name.includes(q.toLowerCase());
  }).slice(0,8);
  useEffect(()=>setQ(value),[value]);
  return (
    <div className="relative">
      <input value={q} onChange={e=>{ setQ(e.target.value); setOpen(true) }} onFocus={()=>setOpen(true)} placeholder={placeholder} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 outline-none"/>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={()=>setOpen(false)}></div>
          <div className="absolute z-50 mt-1 w-full rounded-xl bg-[#0f172a] border border-white/10 shadow-2xl max-h-48 overflow-auto">
            {filtered.length===0 ? <div className="p-3 text-xs text-slate-400">لا يوجد نتائج</div> :
              filtered.map((o:any,i:number)=>{
                const lbl = o[displayKey] || o.name || o.full_name;
                return <button key={i} onClick={()=>{ setQ(lbl); onSelect(o); setOpen(false) }} className="w-full text-right px-3 py-2 text-xs text-white hover:bg-white/10 flex justify-between"><span>{lbl}</span>{o.price? <span className="text-emerald-400">{o.price} ر.س</span>: null}</button>
              })
            }
          </div>
        </>
      )}
    </div>
  );
}

function JawModalBulk({ selected, onToggle, onClose, treatName, doctorName, cost }: { selected:number[], onToggle:(n:number)=>void, onClose:()=>void, treatName:string, doctorName:string, cost:number }) {
  const Cell = ({ fdi }: { fdi: number }) => {
    const palmer = fdi % 10;
    const sel = selected.includes(fdi);
    const cmap: any = { 1:'#ef4444', 2:'#f59e0b', 3:'#10b981', 4:'#3b82f6', 5:'#8b5cf6', 6:'#ec4899', 7:'#84cc16', 8:'#65a30d' };
    return (
      <button
        onClick={() => onToggle(fdi)}
        className={`relative rounded-lg border-2 aspect-square flex items-center justify-center transition-all ${sel ? 'bg-emerald-500 border-emerald-300 shadow-lg shadow-emerald-500/40 scale-105' : 'bg-white/5 border-white/15 hover:bg-white/10 hover:border-white/30'}`}
      >
        <span className="text-lg md:text-2xl font-black leading-none" style={{ color: sel ? 'white' : cmap[palmer] }}>{palmer}</span>
        <span className={`absolute top-0.5 right-1 text-[7px] md:text-[8px] leading-none ${sel ? 'text-white/80' : 'text-slate-500'}`}>{fdi}</span>
        {sel && <span className="absolute -top-1 -left-1 w-3 h-3 md:w-4 md:h-4 rounded-full bg-white text-emerald-600 flex items-center justify-center text-[8px] md:text-[10px] font-bold">✓</span>}
      </button>
    );
  };
  const upperRight = [18,17,16,15,14,13,12,11];
  const upperLeft  = [21,22,23,24,25,26,27,28];
  const lowerRight = [48,47,46,45,44,43,42,41];
  const lowerLeft  = [31,32,33,34,35,36,37,38];
  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-2 md:p-4" onClick={onClose}>
      <div className="bg-[#0a1028] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="p-3 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#0a1028] z-20 rounded-t-2xl">
          <h3 className="text-white font-bold text-sm">اختر الأسنان - أرقام 1-8</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20"><X size={16}/></button>
        </div>
        <div className="p-3 md:p-5 space-y-3">
          <div>
            <div className="text-center text-[11px] text-slate-400 mb-2 font-medium">الفك العلوي</div>
            <div className="flex items-center justify-center gap-1 md:gap-1.5">
              <div className="grid grid-cols-8 gap-1 md:gap-1.5 flex-1">{upperRight.map(fdi => <Cell key={fdi} fdi={fdi} />)}</div>
              <div className="w-[2px] h-10 bg-red-500 mx-0.5 rounded"></div>
              <div className="grid grid-cols-8 gap-1 md:gap-1.5 flex-1">{upperLeft.map(fdi => <Cell key={fdi} fdi={fdi} />)}</div>
            </div>
          </div>
          <div className="h-[2px] bg-red-500 w-full rounded"></div>
          <div>
            <div className="text-center text-[11px] text-slate-400 mb-2 font-medium">الفك السفلي</div>
            <div className="flex items-center justify-center gap-1 md:gap-1.5">
              <div className="grid grid-cols-8 gap-1 md:gap-1.5 flex-1">{lowerRight.map(fdi => <Cell key={fdi} fdi={fdi} />)}</div>
              <div className="w-[2px] h-10 bg-red-500 mx-0.5 rounded"></div>
              <div className="grid grid-cols-8 gap-1 md:gap-1.5 flex-1">{lowerLeft.map(fdi => <Cell key={fdi} fdi={fdi} />)}</div>
            </div>
          </div>
          {selected.length > 0 && (
            <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden mt-4">
              <div className="p-2.5 text-xs font-bold text-white flex justify-between border-b border-white/10">
                <span>🦷 {selected.length} أسنان مختارة</span>
                <span className="text-emerald-400">{cost} ر.س</span>
              </div>
              <div className="overflow-auto max-h-32">
                <table className="w-full text-xs">
                  <thead className="bg-white/5 text-slate-400">
                    <tr><th className="p-2 text-right">المعالجة</th><th className="p-2 text-right">الطبيب</th><th className="p-2 text-right">السعر</th><th className="p-2 text-right">رقم السن</th></tr>
                  </thead>
                  <tbody>
                    {selected.map(num => (
                      <tr key={num} className="border-t border-white/5">
                        <td className="p-2 text-white">{treatName || '-'}</td>
                        <td className="p-2 text-slate-300">{doctorName || '-'}</td>
                        <td className="p-2 text-emerald-400">{cost} ر.س</td>
                        <td className="p-2 text-emerald-300 font-bold">{num}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <div className="p-3 border-t border-white/10 flex justify-between items-center sticky bottom-0 bg-[#0a1028] gap-2 rounded-b-2xl">
          <span className="text-[11px] text-slate-400">{selected.length > 0 ? `${selected.length} أسنان` : 'لم تختر بعد'}</span>
          <button onClick={onClose} className="px-6 py-2 rounded-xl bg-gradient-to-l from-violet-600 to-blue-600 text-white text-sm font-bold">تم - إغلاق</button>
        </div>
      </div>
    </div>
  );
}

function TreatmentsBulk(){
  const [patientsList, setPatientsList] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [treatTypes, setTreatTypes] = useState<any[]>([]);
  const [bulkRows, setBulkRows] = useState<any[]>([]);
  const [form, setForm] = useState({ patientId:'', patientName:'', doctorId:'', doctorName:'', treatTypeId:'', treatName:'', teeth:[] as number[], cost:0, date:TODAY, status:'مخطط لها', notes:'' });
  const [jawOpen, setJawOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    (async()=>{
      setLoading(true);
      const [p,d,t] = await Promise.all([
        supabase.from('patients').select('id, full_name').order('full_name').limit(100),
        supabase.from('doctors').select('*').order('created_at'),
        supabase.from('treatment_definitions').select('*').order('created_at'),
      ]);
      setPatientsList(p.data||[]);
      setDoctors(d.data||[]);
      setTreatTypes(t.data||[]);
      setLoading(false);
    })();
  },[]);

  function addRow(){
    if(!form.patientName || !form.doctorName || !form.treatName || form.teeth.length===0){ alert('أكمل جميع الحقول واختر الأسنان'); return; }
    const rows = form.teeth.map((toothNum:any)=>({
      id: Date.now().toString()+Math.random(), patientId: form.patientId, patientName: form.patientName,
      doctorId: form.doctorId, doctorName: form.doctorName, treatTypeId: form.treatTypeId, treatName: form.treatName,
      tooth: toothNum, teeth: form.teeth, cost: form.cost, date: form.date, status: form.status, notes: form.notes
    }));
    setBulkRows([...rows, ...bulkRows]);
    setForm({ ...form, treatTypeId:'', treatName:'', cost:0, teeth:[], notes:'' });
    setJawOpen(false);
  }

  async function saveAll(){
    if(bulkRows.length===0){ alert('لا يوجد معالجات للحفظ'); return; }
    const grouped:any = {};
    bulkRows.forEach((r:any)=>{
      const key = `${r.patientId}_${r.treatName}_${r.date}`;
      if(!grouped[key]) grouped[key] = { ...r, teeth:[r.tooth] };
      else grouped[key].teeth.push(r.tooth);
    });

    const payload = Object.values(grouped).map((g:any)=>({
      patient_id: g.patientId || null,
      tooth_number: g.teeth[0],
      treatment_type: g.treatName,
      doctor_name: g.doctorName,
      cost: g.cost,
      status: g.status === 'تمت' ? 'completed' : g.status === 'قيد التنفيذ' ? 'in_progress' : 'planned',
      description: `أسنان: ${g.teeth.join(', ')} | ${g.notes||''}`,
      treatment_date: g.date,
    }));

    const { error } = await supabase.from('treatments').insert(payload);
    if(error){ alert('خطأ في الحفظ: ' + error.message); return; }
    alert(`تم حفظ ${payload.length} معالجة بنجاح - ستظهر في الملف الطبي وسند الحساب`);
    setBulkRows([]);
  }

  const filteredRows = bulkRows.filter((r:any)=> r.patientName.includes(search) || r.doctorName.includes(search) || r.treatName.includes(search));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-xl font-bold text-white">إضافة معالجات - سجل المعالجات</h2>
        <div className="flex gap-2">
          <div className="relative"><Search size={14} className="absolute right-2 top-2.5 text-slate-500"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث..." className="pr-7 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs w-40 text-white"/></div>
          <button onClick={saveAll} className={btnSm}><Save size={16}/> حفظ ({bulkRows.length})</button>
        </div>
      </div>

      {loading ? <div className={card + ' text-center text-slate-400'}>جاري التحميل...</div> : (
        <div className={card + ' !p-4'}>
          <div className="grid grid-cols-1 md:grid-cols-8 gap-3">
            <div><label className={label}>1 المريض</label><SearchSelect placeholder="ابحث..." options={patientsList} value={form.patientName} onSelect={(o:any)=>setForm({...form, patientId:o.id, patientName:o.full_name})} displayKey="full_name"/></div>
            <div><label className={label}>2 الطبيب</label><SearchSelect placeholder="ابحث..." options={doctors} value={form.doctorName} onSelect={(o:any)=>setForm({...form, doctorId:o.id, doctorName:o.name})}/></div>
            <div><label className={label}>3 المعالجة</label><SearchSelect placeholder="ابحث..." options={treatTypes} value={form.treatName} onSelect={(o:any)=>setForm({...form, treatTypeId:o.id, treatName:o.name, cost:o.price})}/></div>
            <div><label className={label}>4 الأسنان 🦷</label>
              <button onClick={()=>setJawOpen(true)} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-xs text-white flex items-center justify-center gap-2 hover:bg-white/10">
                <span className="text-lg">🦷</span>{form.teeth.length>0? `${form.teeth.length} أسنان`:'اختر'}
              </button>
            </div>
            <div><label className={label}>5 التكلفة</label><input value={form.cost} readOnly className={inp + ' !bg-emerald-500/10 !border-emerald-500/30 !text-emerald-300'}/></div>
            <div><label className={label}>6 التاريخ</label><input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} className={inp}/></div>
            <div><label className={label}>7 الحالة</label><select value={form.status} onChange={e=>setForm({...form, status:e.target.value})} className={inp}><option>مخطط لها</option><option>تمت</option><option>قيد التنفيذ</option></select></div>
            <div><label className={label}>8 ملاحظات</label><input value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} placeholder="ملاحظات" className={inp}/></div>
          </div>
          <div className="mt-3"><button onClick={addRow} className={btnSm}><Plus size={16}/> إضافة للسجل</button></div>
        </div>
      )}

      <div className={card + ' !p-0 overflow-hidden'}>
        <div className="overflow-auto">
          <table className="w-full text-sm min-w-[1000px]">
            <thead className="bg-white/5 text-slate-400 text-xs">
              <tr><th className="text-right px-3 py-3">المريض</th><th className="text-right px-3 py-3">الطبيب</th><th className="text-right px-3 py-3">المعالجة</th><th className="text-right px-3 py-3">السن</th><th className="text-right px-3 py-3">التكلفة</th><th className="text-right px-3 py-3">التاريخ</th><th className="text-right px-3 py-3">الحالة</th><th className="text-right px-3 py-3">ملاحظات</th><th></th></tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredRows.length===0? <tr><td colSpan={9} className="p-6 text-center text-slate-500">لا يوجد سجلات</td></tr>:
              filteredRows.map((r:any)=><tr key={r.id} className="hover:bg-white/5">
                <td className="px-3 py-2 text-white">{r.patientName}</td>
                <td className="px-3 py-2 text-slate-300">{r.doctorName}</td>
                <td className="px-3 py-2 text-slate-300">{r.treatName}</td>
                <td className="px-3 py-2"><span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs">🦷 {r.tooth}</span></td>
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

      {jawOpen && <JawModalBulk
        selected={form.teeth}
        onToggle={(n)=>{ const has=form.teeth.includes(n); setForm({...form, teeth: has? form.teeth.filter((x:any)=>x!==n): [...form.teeth,n] }) }}
        onClose={()=>setJawOpen(false)}
        treatName={form.treatName}
        doctorName={form.doctorName}
        cost={form.cost}
      />}
    </div>
  );
}

function DiseaseLog(){
  const [activeSub, setActiveSub] = useState('treatments');
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRecords = useCallback(async()=>{
    setLoading(true);
    const { data, error } = await supabase.from('treatments').select('*, patient:patients(full_name)').order('created_at', {ascending:false}).limit(500);
    if(!error && data) setRecords(data);
    else setRecords([]);
    setLoading(false);
  },[]);

  useEffect(()=>{ loadRecords(); },[loadRecords]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">سجل الأمراض</h2>
        <button onClick={loadRecords} className={btnGhost}><Loader2 size={14} className={loading?'animate-spin':''}/> تحديث</button>
      </div>
      <div className="flex gap-2 border-b border-white/10">
        <button onClick={()=>setActiveSub('treatments')} className={`px-4 py-2 text-sm border-b-2 ${activeSub==='treatments'?'border-blue-500 text-white':'border-transparent text-slate-400'}`}>سجل المعالجات</button>
        <button onClick={()=>setActiveSub('medical')} className={`px-4 py-2 text-sm border-b-2 ${activeSub==='medical'?'border-blue-500 text-white':'border-transparent text-slate-400'}`}>الملف الطبي</button>
        <button onClick={()=>setActiveSub('finance')} className={`px-4 py-2 text-sm border-b-2 ${activeSub==='finance'?'border-blue-500 text-white':'border-transparent text-slate-400'}`}>سند حساب</button>
      </div>
      {loading ? <div className={card + ' text-center text-slate-400'}>جاري التحميل...</div> : (
        <>
          {activeSub==='treatments' && (
            <div className={card + ' !p-0 overflow-hidden'}>
              <div className="p-4 font-bold text-white">سجل المعالجات - {records.length} سجل</div>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-3">المعالجة</th><th className="text-right px-4 py-3">الطبيب</th><th className="text-right px-4 py-3">السعر</th><th className="text-right px-4 py-3">السن</th><th className="text-right px-4 py-3">المريض</th><th className="text-right px-4 py-3">التاريخ</th></tr></thead>
                  <tbody className="divide-y divide-white/5">
                    {records.map((r:any)=><tr key={r.id} className="hover:bg-white/5">
                      <td className="px-4 py-2 text-white">{r.treatment_type}</td>
                      <td className="px-4 py-2 text-slate-300">{r.doctor_name||'—'}</td>
                      <td className="px-4 py-2 text-emerald-400">{r.cost} ر.س</td>
                      <td className="px-4 py-2 text-emerald-300">🦷 {r.tooth_number}</td>
                      <td className="px-4 py-2 text-slate-300">{r.patient?.full_name}</td>
                      <td className="px-4 py-2 text-slate-500 text-xs">{fmtDate(r.treatment_date || r.created_at)}</td>
                    </tr>)}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeSub==='medical' && (
            <div className={card + ' !p-0 overflow-hidden'}>
              <div className="p-4 font-bold text-white flex items-center gap-2"><HeartPulse size={18} className="text-red-400"/> الملف الطبي</div>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-3">المريض</th><th className="text-right px-4 py-3">المعالجة</th><th className="text-right px-4 py-3">الطبيب</th><th className="text-right px-4 py-3">السعر</th><th className="text-right px-4 py-3">السن</th><th className="text-right px-4 py-3">الحالة</th></tr></thead>
                  <tbody className="divide-y divide-white/5">
                    {records.map((r:any)=><tr key={r.id} className="hover:bg-white/5">
                      <td className="px-4 py-2 text-white font-medium">{r.patient?.full_name}</td>
                      <td className="px-4 py-2 text-slate-200">{r.treatment_type}</td>
                      <td className="px-4 py-2 text-slate-300">{r.doctor_name||'—'}</td>
                      <td className="px-4 py-2 text-emerald-400">{r.cost} ر.س</td>
                      <td className="px-4 py-2 text-emerald-300">🦷 {r.tooth_number}</td>
                      <td className="px-4 py-2"><span className="text-xs px-2 py-1 rounded bg-white/10">{r.status}</span></td>
                    </tr>)}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeSub==='finance' && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center"><div className="text-xl font-bold text-emerald-400">{records.reduce((s:any,r:any)=>s+Number(r.cost||0),0)} ر.س</div><div className="text-xs text-slate-400">إجمالي</div></div>
                <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4 text-center"><div className="text-xl font-bold text-blue-400">{records.length}</div><div className="text-xs text-slate-400">معالجات</div></div>
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 text-center"><div className="text-xl font-bold text-amber-400">{records.filter((r:any)=>r.status==='completed').length}</div><div className="text-xs text-slate-400">مكتملة</div></div>
              </div>
              <div className={card + ' !p-0 overflow-hidden'}>
                <div className="p-3 font-bold text-white text-sm flex items-center gap-2"><Receipt size={16} className="text-amber-400"/> سند حساب مفصل</div>
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-3">المريض</th><th className="text-right px-4 py-3">المعالجة</th><th className="text-right px-4 py-3">الطبيب</th><th className="text-right px-4 py-3">السعر</th><th className="text-right px-4 py-3">الحالة</th></tr></thead>
                    <tbody className="divide-y divide-white/5">
                      {records.map((r:any)=><tr key={r.id}>
                        <td className="px-4 py-2 text-white">{r.patient?.full_name}</td>
                        <td className="px-4 py-2 text-slate-300">{r.treatment_type}</td>
                        <td className="px-4 py-2 text-slate-400">{r.doctor_name||'—'}</td>
                        <td className="px-4 py-2 text-emerald-400 font-bold">{r.cost} ر.س</td>
                        <td className="px-4 py-2"><span className={`text-xs px-2 py-1 rounded ${r.status==='completed'?'bg-emerald-500/20 text-emerald-300':'bg-amber-500/20 text-amber-300'}`}>{r.status==='completed'?'مدفوع':'غير مدفوع'}</span></td>
                      </tr>)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
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
                <div className="flex-1 min-w-0"><div className="text-sm text-white truncate">{p.full_name}</div><div className="text-xs text-slate-400" dir="ltr">{p.patient_code}</div></div>
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
                <div className="flex-1 min-w-0"><div className="text-sm text-white truncate">{f.patient?.full_name}</div><div className="text-xs text-slate-400">{f.follow_type} - {fmtDate(f.scheduled_date)}</div></div>
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
  const [list, setList] = useState<any[]>([]); const [search, setSearch] = useState(''); const [loading, setLoading] = useState(true);
  const load = useCallback(async ()=>{ setLoading(true); let q = supabase.from('patients').select('*').order('created_at', { ascending: false }).limit(100); if (search) q = q.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%,patient_code.ilike.%${search}%`); const { data } = await q; setList(data || []); setLoading(false); }, [search]);
  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [load]);
  async function del(id: string) { if (!confirm('حذف المريض؟')) return; await supabase.from('patients').delete().eq('id', id); load(); }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px]"><Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث..." className={inp + ' pr-10'} /></div>
        <button onClick={() => { setEditItem(null); setPage('patient-new'); }} className={btnSm}><Plus size={16}/> مريض جديد</button>
      </div>
      <div className={card + ' !p-0 overflow-hidden'}>
        {loading ? <div className="p-8 text-center text-slate-400">جاري التحميل...</div> : list.length === 0 ? <div className="p-8 text-center text-slate-400">لا يوجد مرضى</div> : (
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
    full_name: patient?.full_name || '', phone: patient?.phone || '', medical_alerts: patient?.medical_alerts || '',
    notes: patient?.notes || '', gender: patient?.gender || '', date_of_birth: patient?.date_of_birth || '',
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
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className={btnSm + ' !px-6 !py-2.5'}>{loading ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>} حفظ</button>
        <button type="button" onClick={onCancel} className={btnGhost}>الغاء</button>
      </div>
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
      <div className="border-b border-white/10 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {[{id:'overview', label:'نظرة عامة'},{id:'chart', label:`مخطط الاسنان (${implants.length})`},{id:'treatments', label:`سجل المعالجات (${treatments.length})`},{id:'surgeries', label:`الجراحات (${surgeries.length})`},{id:'followups', label:`المتابعات (${followups.length})`}].map(t=><button key={t.id} onClick={() => setTab(t.id)} className={'px-4 py-2.5 text-sm border-b-2 whitespace-nowrap ' + (tab === t.id ? 'border-blue-500 text-white' : 'border-transparent text-slate-400')}>{t.label}</button>)}
        </div>
      </div>
      {tab==='overview' && <div className={card}><div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-white/5 p-3"><div className="text-xl font-bold text-white">{surge
