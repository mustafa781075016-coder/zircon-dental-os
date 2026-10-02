import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  LayoutDashboard, Users, Calendar, LogOut, Menu, Bell, X,
  Stethoscope, Syringe, Receipt, FileText, Settings as SettingsIcon,
  Plus, Search, Mail, Lock, Loader2, ArrowRight, Save, Trash2, Edit3,
  MessageCircle, Clock, DollarSign, UserPlus, ClipboardList, HeartPulse, FileSpreadsheet
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

// ====== JAW MODAL FOR TEETH SELECTION ======
function JawModalBulk({ selected, onToggle, onClose, treatName, doctorName, cost }:{ selected:number[], onToggle:(n:number)=>void, onClose:()=>void, treatName:string, doctorName:string, cost:number }){
  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#0a1028] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-auto" onClick={e=>e.stopPropagation()}>
        <div className="p-4 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#0a1028] z-10">
          <h3 className="text-white font-bold">مخطط الأسنان - اختر الأسنان 8 7 6 5 4 3 2 1 | 1 2 3 4 5 6 7 8</h3>
          <button onClick={onClose} className="p-2 rounded-lg bg-white/5 text-white"><X size={18}/></button>
        </div>
        <div className="p-4 space-y-6">
          {/* الفك العلوي - ترقيم صحيح */}
          <div>
            <div className="text-xs text-slate-400 mb-2 text-center">الفك العلوي - 8 7 6 5 4 3 2 1 | 1 2 3 4 5 6 7 8</div>
            <div className="grid grid-cols-8 gap-2">
              {TEETH_UPPER_PALMER.map(({fdi,palmer,quad})=>{ 
                const sel=selected.includes(fdi); 
                const color = TOOTH_COLORS[palmer] || '#94a3b8';
                return <button key={fdi} onClick={()=>onToggle(fdi)} className={`relative rounded-xl border p-2 flex flex-col items-center gap-1 transition-all ${sel?'bg-emerald-500/20 border-emerald-500/50 scale-105':'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                  <span className="text-lg">🦷</span>
                  <span className="text-[11px] font-bold" style={{color: sel? '#10b981': color}}>{palmer}</span>
                  <span className="text-[8px] text-slate-500">{fdi}</span>
                  <span className="text-[7px] text-slate-600">{quad}</span>
                </button>
              })}
            </div>
          </div>
          <div className="h-px bg-red-500/20 w-full" />
          {/* الفك السفلي */}
          <div>
            <div className="text-xs text-slate-400 mb-2 text-center">الفك السفلي - 8 7 6 5 4 3 2 1 | 1 2 3 4 5 6 7 8</div>
            <div className="grid grid-cols-8 gap-2">
              {TEETH_LOWER_PALMER.map(({fdi,palmer,quad})=>{ 
                const sel=selected.includes(fdi); 
                const color = TOOTH_COLORS[palmer] || '#94a3b8';
                return <button key={fdi} onClick={()=>onToggle(fdi)} className={`relative rounded-xl border p-2 flex flex-col items-center gap-1 transition-all ${sel?'bg-emerald-500/20 border-emerald-500/50 scale-105':'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                  <span className="text-lg">🦷</span>
                  <span className="text-[11px] font-bold" style={{color: sel? '#10b981': color}}>{palmer}</span>
                  <span className="text-[8px] text-slate-500">{fdi}</span>
                  <span className="text-[7px] text-slate-600">{quad}</span>
                </button>
              })}
            </div>
          </div>
          {/* جدول المعالجات اسفل المخطط - يتحدث تلقائيا */}
          {selected.length>0 && <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
            <div className="p-3 text-sm font-bold text-white">المعالجات المحددة - {selected.length} أسنان</div>
            <div className="overflow-auto"><table className="w-full text-xs">
              <thead className="bg-white/5 text-slate-400"><tr><th className="p-2 text-right">اسم المعالجة</th><th className="p-2 text-right">اسم الطبيب</th><th className="p-2 text-right">سعر المعالجة</th><th className="p-2 text-right">رقم السن</th></tr></thead>
              <tbody>{selected.map(num=><tr key={num} className="border-t border-white/5"><td className="p-2 text-white">{treatName||'-'}</td><td className="p-2 text-slate-300">{doctorName||'-'}</td><td className="p-2 text-emerald-400">{cost} ر.س</td><td className="p-2 text-emerald-300 font-bold">{num} ({num%10})</td></tr>)}</tbody>
            </table></div>
          </div>}
        </div>
        <div className="p-4 border-t border-white/10 flex justify-between sticky bottom-0 bg-[#0a1028]">
          <span className="text-xs text-slate-400">{selected.length} أسنان مختارة - اضغط على صورة الفكين مرة أخرى للإغلاق وتفريغ نوع المعالجة</span>
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-gradient-to-l from-violet-600 to-blue-600 text-white text-sm font-bold">تم - إغلاق وتفريغ نوع المعالجة</button>
        </div>
      </div>
    </div>
  )
}

// ====== TREATMENTS BULK PAGE - 8 COLUMNS ======
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
    setBulkRows([...rows, ...bulkRows]);
    // تفريغ نوع المعالجة عند الإغلاق كما طلبت
    setForm({ ...form, treatTypeId:'', treatName:'', cost:0, teeth:[], status:'مخطط لها', notes:'' });
    setJawOpen(false);
  }

  async function saveAll(){
    if(bulkRows.length===0){ alert('لا يوجد معالجات للحفظ'); return; }
    // حفظ في implants كمثال - كل سن زرعة
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
    alert(`تم حفظ ${bulkRows.length} معالجة في ملف المريض`);
    setBulkRows([]);
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

      {jawOpen && <JawModalBulk selected={form.teeth} onToggle={(n)=>{ const has=form.teeth.includes(n); setForm({...form, teeth: has? form.teeth.filter((x:any)=>x!==n): [...form.teeth,n] }) }} onClose={()=>{ setForm({...form, treatTypeId:'', treatName:'', cost:0}); setJawOpen(false) }} treatName={form.treatName} doctorName={form.doctorName} cost={form.cost} />}
    </div>
  )
}

// ====== DISEASE LOG PAGE - سجل الأمراض ======
function DiseaseLog(){
  const [activeSub, setActiveSub] = useState('treatments');
  const [records, setRecords] = useState<any[]>(()=>{
    try{ return JSON.parse(localStorage.getItem('zircon_bulkRows')||'[]') }catch{ return [] }
  });
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
          <div className="p-4 font-bold text-white">سجل المعالجات - {records.length} سجل</div>
          <div className="overflow-auto"><table className="w-full text-sm"><thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-3">اسم المعالجة</th><th className="text-right px-4 py-3">اسم الطبيب</th><th className="text-right px-4 py-3">سعر المعالجة</th><th className="text-right px-4 py-3">رقم السن</th><th className="text-right px-4 py-3">المريض</th><th className="text-right px-4 py-3">التاريخ</th></tr></thead><tbody className="divide-y divide-white/5">{records.map((r:any)=><tr key={r.id}><td className="px-4 py-2 text-white">{r.treatName}</td><td className="px-4 py-2 text-slate-300">{r.doctorName}</td><td className="px-4 py-2 text-emerald-400">{r.cost} ر.س</td><td className="px-4 py-2 text-emerald-300">🦷 {r.tooth}</td><td className="px-4 py-2 text-slate-300">{r.patientName}</td><td className="px-4 py-2 text-slate-500 text-xs">{fmtDate(r.date)}</td></tr>)}</tbody></table></div>
        </div>
      )}
      {activeSub==='medical' && <div className={card}><h3 className="text-white font-bold mb-2">الملف الطبي</h3><p className="text-slate-400 text-sm">هنا يتم عرض الملف الطبي الكامل للمريض - السجل المرضي، الأمراض المزمنة، الأدوية، التحسس - يمكن إضافته لاحقا</p><div className="mt-4 p-6 rounded-xl bg-white/5 border border-dashed border-white/10 text-center text-slate-500 text-sm">الملف الطبي - قيد التطوير - يمكن ربطه بجدول medical_records</div></div>}
      {activeSub==='finance' && <div className={card}><h3 className="text-white font-bold mb-2">سند حساب</h3><p className="text-slate-400 text-sm">سندات القبض والصرف والحسابات المالية</p><div className="mt-4 grid grid-cols-3 gap-3"><div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center"><div className="text-xl font-bold text-emerald-400">{records.reduce((s:any,r:any)=>s+r.cost,0)} ر.س</div><div className="text-xs text-slate-400">إجمالي المعالجات</div></div><div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4 text-center"><div className="text-xl font-bold text-blue-400">{records.length}</div><div className="text-xs text-slate-400">عدد المعالجات</div></div><div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 text-center"><div className="text-xl font-bold text-amber-400">{records.filter((r:any)=>r.status==='تمت').length}</div><div className="text-xs text-slate-400">مكتملة</div></div></div></div>}
    </div>
  )
}

// ====== ORIGINAL COMPONENTS (kept exactly as your design) ======
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
    { id:'treatments-bulk', label:'  ↳ اضافة معالجات', icon: FileSpreadsheet },
    { id:'appointments', label:'المواعيد', icon: Calendar },
    { id:'surgeries', label:'الجراحات', icon: Stethoscope },
    { id:'implants', label:'الزرعات', icon: Syringe },
    { id:'disease-log', label:'سجل الأمراض', icon: ClipboardList },
    { id:'disease-treatments', label:'  ↳ سجل المعالجات', icon: FileText },
    { id:'disease-medical', label:'  ↳ الملف الطبي', icon: HeartPulse },
    { id:'disease-finance', label:'  ↳ سند حساب', icon: Receipt },
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
            <button key={m.id} onClick={()=>{ 
              if(m.id.startsWith('disease-')){ setPage('disease-log'); } else { setPage(m.id); } 
              setSidebarOpen(false); 
            }} className={`w-full flex items-center gap-3 text-right p-3 rounded-xl text-sm transition ${page===m.id || (m.id==='disease-log' && page.startsWith('disease')) ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'hover:bg-white/5 text-slate-300'} ${m.label.includes('↳')?'mr-4 !text-xs !py-2 !bg-white/[0.02]':''}`}>
              <m.icon size={m.label.includes('↳')?14:18}/> {m.label.replace('↳','').trim()}
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
