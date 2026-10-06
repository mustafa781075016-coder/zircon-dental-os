import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  LayoutDashboard, Users, Calendar, LogOut, Menu, Bell, X,
  Stethoscope, Syringe, Receipt, FileText, Settings as SettingsIcon,
  Plus, Search, Lock, Loader2, ArrowRight, Save, Trash2, Edit3,
  MessageCircle, Clock, DollarSign, UserPlus, ClipboardList, HeartPulse, FileSpreadsheet,
  Printer as PrinterIcon, Phone, RefreshCw, Filter, Check
} from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
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

// ================= LOGIN =================
function Login({ onLogin }: { onLogin: (user?:any) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(e: any) {
    e.preventDefault();
    setErr(''); setLoading(true);
    try{
      const localUsers = JSON.parse(localStorage.getItem('zircon_appUsers')||'[]');
      const found = localUsers.find((u:any)=> u.username.trim()===username.trim() && u.password===password);
      if(found){
        localStorage.setItem('zircon_currentUser', JSON.stringify(found));
        setLoading(false); onLogin(found); return;
      }
    }catch{}
    try{
      const { error, data } = await supabase.auth.signInWithPassword({ email: username, password });
      if(!error && data.session){
        const adminUser = { id:'admin', username, role:'مدير', isSupabase:true };
        localStorage.setItem('zircon_currentUser', JSON.stringify(adminUser));
        setLoading(false); onLogin(adminUser); return;
      }
    }catch{}
    if(username==='admin' && password==='123456'){
      const adminUser = { id:'1', username:'admin', password:'123456', role:'مدير' };
      localStorage.setItem('zircon_currentUser', JSON.stringify(adminUser));
      setLoading(false); onLogin(adminUser); return;
    }
    setLoading(false);
    setErr('اسم المستخدم أو كلمة المرور غير صحيحة - تأكد من البيانات في الإعدادات');
  }
  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center p-6 bg-[#060a1a]">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[.03] backdrop-blur-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 grid place-items-center text-2xl font-bold text-white mb-4 shadow-xl">Z</div>
          <h1 className="text-2xl font-bold text-white">Zircon OS V2</h1>
          <p className="text-sm text-blue-300/70 mt-2">نظام ادارة عيادة زراعة الاسنان</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className={label}>اسم المستخدم أو البريد</label>
            <div className="relative">
              <Users size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="admin أو doctor1" dir="ltr" className={inp + ' pr-10'} />
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
          <button type="submit" disabled={loading} className={btn}>{loading && <Loader2 className="animate-spin" size={18} />} دخول</button>
          <div className="text-center text-[11px] text-slate-500">admin / 123456 أو المستخدمين من الإعدادات</div>
        </form>
      </div>
    </div>
  );
}

// ================= SEARCH SELECT =================
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
          {filtered.length===0 ? <div className="p-3 text-xs text-slate-400">لا يوجد نتائج</div> :
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

// ================= TOOTH CHART ARCH =================
const TEETH_UPPER = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28];
const TEETH_LOWER = [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];
const TOOTH_COLORS: any = { 1: '#e06a6a', 2: '#b78a4a', 3: '#2ea86a', 4: '#3a8ab5', 5: '#6b4c9a', 6: '#d16a8a', 7: '#a3b82a', 8: '#7a8a2e' };

function JawModalBulk({ selected, onToggle, onClose, treatName, doctorName, cost }: { selected:number[], onToggle:(n:number)=>void, onClose:()=>void, treatName:string, doctorName:string, cost:number }) {
  const Cell = ({ fdi }: { fdi: number }) => {
    const palmer = fdi % 10;
    const sel = selected.includes(fdi);
    const cmap: any = { 1:'#ff6b6b', 2:'#f59e0b', 3:'#10b981', 4:'#3b82f6', 5:'#8b5cf6', 6:'#ec4899', 7:'#f1c40f', 8:'#84cc16' };
    const quad = fdi >= 11 && fdi <= 18 ? 'UR' : fdi >=21 && fdi<=28 ? 'UL' : fdi>=31 && fdi<=38 ? 'LL' : 'LR';
    return (
      <button onClick={() => onToggle(fdi)} className={`group relative flex flex-col items-center justify-between rounded-xl border p-1 md:p-1.5 transition-all min-h-[82px] md:min-h-[110px] ${sel ? 'bg-emerald-500/20 border-emerald-400/60 shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-[1.04] z-10' : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08]'}`}>
        <div className="w-8 h-8 md:w-10 md:h-10 mt-1 flex items-center justify-center"><span className="text-2xl md:text-3xl" style={{ filter: sel ? 'brightness(1.3)' : 'grayscale(0.2)'}}>🦷</span></div>
        <div className="flex flex-col items-center leading-none gap-0.5 mt-1">
          <span className="text-[16px] md:text-[20px] font-black" style={{color: sel ? '#fff' : cmap[palmer]}}>{palmer}</span>
          <span className="text-[8px] md:text-[9px] text-slate-400 font-mono">{fdi}</span>
          <span className="text-[7px] text-slate-500/70 hidden md:block">{quad}</span>
        </div>
        {sel && <div className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0a1028] text-white flex items-center justify-center text-[11px] font-bold">✓</div>}
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
        <div className="p-3 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#0a1028] z-20 rounded-t-2xl shrink-0">
          <span className="text-sm md:text-base font-bold text-white">مخطط الأسنان - مطابق للصورة المرفقة 8 7 6 5 4 3 2 1 | 1 2 3 4 5 6 7 8</span>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white"><X size={16}/></button>
        </div>
        <div className="flex-1 overflow-auto p-2 md:p-4 space-y-3">
          <div className="rounded-xl bg-white/[0.02] border border-white/5 p-2 md:p-3">
            <div className="text-center text-[11px] text-slate-400 mb-2 font-medium">الفك العلوي</div>
            <div className="flex items-stretch justify-center gap-1">
              <div className="grid grid-cols-8 gap-1 md:gap-1.5 flex-1">{upperRight.map(fdi => <Cell key={fdi} fdi={fdi} />)}</div>
              <div className="w-[2px] bg-red-500/80 rounded-full mx-1 self-stretch min-h-[90px] md:min-h-[120px]"></div>
              <div className="grid grid-cols-8 gap-1 md:gap-1.5 flex-1">{upperLeft.map(fdi => <Cell key={fdi} fdi={fdi} />)}</div>
            </div>
          </div>
          <div className="h-[2px] bg-red-500/70 w-full rounded-full"></div>
          <div className="rounded-xl bg-white/[0.02] border border-white/5 p-2 md:p-3">
            <div className="text-center text-[11px] text-slate-400 mb-2 font-medium">الفك السفلي</div>
            <div className="flex items-stretch justify-center gap-1">
              <div className="grid grid-cols-8 gap-1 md:gap-1.5 flex-1">{lowerRight.map(fdi => <Cell key={fdi} fdi={fdi} />)}</div>
              <div className="w-[2px] bg-red-500/80 rounded-full mx-1 self-stretch min-h-[90px] md:min-h-[120px]"></div>
              <div className="grid grid-cols-8 gap-1 md:gap-1.5 flex-1">{lowerLeft.map(fdi => <Cell key={fdi} fdi={fdi} />)}</div>
            </div>
          </div>
          {selected.length > 0 && (
            <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 overflow-hidden">
              <div className="p-2.5 text-xs font-bold text-white flex justify-between border-b border-white/10 bg-white/5"><span>🦷 {selected.length} أسنان مختارة - سيتم إضافتها للملف الطبي وسند الحساب</span><span className="text-emerald-400">{cost} ر.س للسن</span></div>
              <div className="overflow-auto max-h-36"><table className="w-full text-xs"><thead className="bg-white/5 text-slate-400 sticky top-0"><tr><th className="p-2 text-right">اسم المعالجة</th><th className="p-2 text-right">اسم الطبيب</th><th className="p-2 text-right">سعر</th><th className="p-2 text-right">رقم السن</th></tr></thead><tbody>{selected.map(num => (<tr key={num} className="border-t border-white/5"><td className="p-2 text-white">{treatName || '-'}</td><td className="p-2 text-slate-300">{doctorName || '-'}</td><td className="p-2 text-emerald-400 font-bold">{cost} ر.س</td><td className="p-2 text-emerald-300 font-bold">🦷 {num}</td></tr>))}</tbody></table></div>
            </div>
          )}
        </div>
        <div className="p-2.5 md:p-3 border-t border-white/10 flex justify-between items-center bg-[#0a1028] rounded-b-2xl shrink-0 gap-2"><span className="text-[11px] text-slate-400">{selected.length} مختارة - عند الإغلاق لا يتم تفريغ المعالجة، التفريغ فقط عند الإضافة</span><button onClick={onClose} className="px-7 py-2.5 rounded-xl bg-gradient-to-l from-violet-600 to-blue-600 text-white text-sm font-bold shadow-lg">تم - إغلاق ({selected.length})</button></div>
      </div>
    </div>
  );
}

// ================= TREATMENTS BULK - 8 COLUMNS =================
function TreatmentsBulk(){
  const [patientsList, setPatientsList] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon_doctors')||'[{"id":"1","name":"د. أحمد الشطبي","specialty":"زراعة"},{"id":"2","name":"د. جلال الداعري","specialty":"تقويم"}]') }catch{ return [] } });
  const [treatTypes, setTreatTypes] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon_treatTypes')||'[{"id":"1","name":"حشوة تجميلية","price":500},{"id":"2","name":"زراعة سن","price":3500}]') }catch{ return [] } });
  const [bulkRows, setBulkRows] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon_bulkRows')||'[]') }catch{ return [] } });
  const [form, setForm] = useState({ patientId:'', patientName:'', doctorId:'', doctorName:'', treatTypeId:'', treatName:'', teeth:[] as number[], cost:0, date:TODAY, status:'مخطط لها', notes:'' });
  const [jawOpen, setJawOpen] = useState(false);
  const [search, setSearch] = useState('');
  useEffect(()=>{ supabase.from('patients').select('id, full_name').limit(100).then(({data})=>setPatientsList(data||[])) },[]);
  useEffect(()=>{ localStorage.setItem('zircon_bulkRows', JSON.stringify(bulkRows)) },[bulkRows]);
  function addRow(){
    if(!form.patientName || !form.doctorName || !form.treatName || form.teeth.length===0){ alert('أكمل: المريض + الطبيب + المعالجة + الأسنان'); return; }
    const rows = form.teeth.map((toothNum:any)=>({ id: Date.now().toString()+Math.random(), patientId: form.patientId, patientName: form.patientName, doctorId: form.doctorId, doctorName: form.doctorName, treatTypeId: form.treatTypeId, treatName: form.treatName, tooth: toothNum, teeth: form.teeth, cost: form.cost, date: form.date, status: form.status, notes: form.notes }));
    setBulkRows([...rows, ...bulkRows]);
    try{ const saved = JSON.parse(localStorage.getItem('zircon_savedTreatments')||'[]'); localStorage.setItem('zircon_savedTreatments', JSON.stringify([...rows, ...saved])); const fin = JSON.parse(localStorage.getItem('zircon_financeRecords')||'[]'); localStorage.setItem('zircon_financeRecords', JSON.stringify([...rows, ...fin])); }catch{}
    // التفريغ فقط عند الإضافة كما طلبت
    setForm({ ...form, treatTypeId:'', treatName:'', cost:0, teeth:[], status:'مخطط لها', notes:'' });
  }
  const filteredRows = bulkRows.filter((r:any)=> r.patientName.includes(search) || r.doctorName.includes(search) || r.treatName.includes(search));
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-3"><h2 className="text-xl font-bold text-white">إضافة معالجات - 8 أعمدة</h2><div className="flex gap-2"><div className="relative"><Search size={14} className="absolute right-2 top-2.5 text-slate-500"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث..." className="pr-7 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs w-40 text-white"/></div><span className="px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">{bulkRows.length} سجل</span></div></div>
      <div className={card + ' !p-4'}>
        <div className="grid grid-cols-1 md:grid-cols-8 gap-3">
          <div><label className={label}>1 اسم المريض</label><SearchSelect placeholder="ابحث..." options={patientsList} value={form.patientName} onSelect={(o:any)=>setForm({...form, patientId:o.id, patientName:o.full_name})} displayKey="full_name"/></div>
          <div><label className={label}>2 الطبيب</label><SearchSelect placeholder="ابحث..." options={doctors} value={form.doctorName} onSelect={(o:any)=>setForm({...form, doctorId:o.id, doctorName:o.name})} displayKey="name"/></div>
          <div><label className={label}>3 المعالجة</label><SearchSelect placeholder="ابحث..." options={treatTypes} value={form.treatName} onSelect={(o:any)=>setForm({...form, treatTypeId:o.id, treatName:o.name, cost:o.price})} displayKey="name"/></div>
          <div><label className={label}>4 الأسنان 🦷</label><button onClick={()=>setJawOpen(true)} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-xs text-white flex items-center justify-center gap-2 hover:bg-white/10">🦷 {form.teeth.length>0? `${form.teeth.length} - ${form.teeth.join(',')}`:'مخطط الفكين'}</button></div>
          <div><label className={label}>5 التكلفة</label><input value={form.cost} readOnly className={inp + ' !bg-emerald-500/10 !border-emerald-500/30 !text-emerald-300'}/></div>
          <div><label className={label}>6 التاريخ</label><input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} className={inp}/></div>
          <div><label className={label}>7 الحالة</label><select value={form.status} onChange={e=>setForm({...form, status:e.target.value})} className={inp}><option>مخطط لها</option><option>تمت</option><option>قيد التنفيذ</option><option>ملغاة</option></select></div>
          <div><label className={label}>8 ملاحظات</label><input value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} placeholder="..." className={inp}/></div>
        </div>
        <div className="mt-3 flex gap-2"><button onClick={addRow} className={btnSm}><Plus size={16}/> إضافة للسجل - تفريغ تلقائي للمعالجة</button><span className="text-xs text-slate-500 py-2">عند الضغط على تم في المخطط لا يتم تفريغ المعالجة - التفريغ فقط عند الإضافة</span></div>
      </div>
      <div className={card + ' !p-0 overflow-hidden'}><div className="overflow-auto"><table className="w-full text-sm min-w-[1000px]"><thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-3 py-3">1 المريض</th><th className="text-right px-3 py-3">2 الطبيب</th><th className="text-right px-3 py-3">3 المعالجة</th><th className="text-right px-3 py-3">4 السن 🦷</th><th className="text-right px-3 py-3">5 التكلفة</th><th className="text-right px-3 py-3">6 التاريخ</th><th className="text-right px-3 py-3">7 الحالة</th><th className="text-right px-3 py-3">8 ملاحظات</th><th></th></tr></thead><tbody className="divide-y divide-white/5">{filteredRows.length===0? <tr><td colSpan={9} className="p-6 text-center text-slate-500">لا يوجد</td></tr>: filteredRows.map((r:any)=><tr key={r.id} className="hover:bg-white/5"><td className="px-3 py-2 text-white">{r.patientName}</td><td className="px-3 py-2 text-slate-300">{r.doctorName}</td><td className="px-3 py-2 text-slate-300">{r.treatName}</td><td className="px-3 py-2"><span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs">🦷 {r.tooth} ({r.tooth%10})</span></td><td className="px-3 py-2 text-emerald-400">{r.cost} ر.س</td><td className="px-3 py-2 text-slate-400 text-xs">{fmtDate(r.date)}</td><td className="px-3 py-2"><span className="text-xs px-2 py-1 rounded bg-white/10">{r.status}</span></td><td className="px-3 py-2 text-slate-500 text-xs">{r.notes||'—'}</td><td className="px-3 py-2"><button onClick={()=>setBulkRows(bulkRows.filter((x:any)=>x.id!==r.id))} className="text-red-400"><Trash2 size={14}/></button></td></tr>)}</tbody></table></div></div>
      {jawOpen && <JawModalBulk selected={form.teeth} onToggle={(n)=>{ const has=form.teeth.includes(n); setForm({...form, teeth: has? form.teeth.filter((x:any)=>x!==n): [...form.teeth,n] }) }} onClose={()=> setJawOpen(false)} treatName={form.treatName} doctorName={form.doctorName} cost={form.cost} />}
    </div>
  )
}

// ================= DISEASE LOG =================
function DiseaseLog(){
  const [activeSub, setActiveSub] = useState('treatments');
  const [records, setRecords] = useState<any[]>(()=>{
    try{ 
      const saved = JSON.parse(localStorage.getItem('zircon_savedTreatments')||'[]');
      const bulk = JSON.parse(localStorage.getItem('zircon_bulkRows')||'[]');
      const all = [...bulk, ...saved];
      return Array.from(new Map(all.map((r:any)=>[r.id,r])).values()) as any[];
    }catch{ return [] }
  });
  useEffect(()=>{
    const id=setInterval(()=>{
      try{
        const saved = JSON.parse(localStorage.getItem('zircon_savedTreatments')||'[]');
        const bulk = JSON.parse(localStorage.getItem('zircon_bulkRows')||'[]');
        const all = [...bulk, ...saved];
        setRecords(Array.from(new Map(all.map((r:any)=>[r.id,r])).values()) as any[]);
      }catch{}
    },1000);
    return ()=>clearInterval(id);
  },[]);
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">سجل الأمراض - مربوط بكل الصفحات</h2>
      <div className="flex gap-2 border-b border-white/10">
        <button onClick={()=>setActiveSub('treatments')} className={`px-4 py-2 text-sm border-b-2 ${activeSub==='treatments'?'border-blue-500 text-white':'border-transparent text-slate-400'}`}>سجل المعالجات</button>
        <button onClick={()=>setActiveSub('medical')} className={`px-4 py-2 text-sm border-b-2 ${activeSub==='medical'?'border-blue-500 text-white':'border-transparent text-slate-400'}`}>الملف الطبي</button>
        <button onClick={()=>setActiveSub('finance')} className={`px-4 py-2 text-sm border-b-2 ${activeSub==='finance'?'border-blue-500 text-white':'border-transparent text-slate-400'}`}>سند حساب</button>
      </div>
      <div className={card + ' !p-0 overflow-hidden'}>
        <div className="p-3 font-bold text-white flex justify-between text-sm"><span>{activeSub==='treatments'?'سجل المعالجات': activeSub==='medical'?'الملف الطبي - جدول المعالجات لكل مريض':'سند حساب'} - {records.length}</span><span className="text-xs text-slate-400">اسم المعالجة | اسم الطبيب | سعر | رقم السن</span></div>
        <div className="overflow-auto"><table className="w-full text-sm"><thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-3">المريض</th><th className="text-right px-4 py-3">اسم المعالجة</th><th className="text-right px-4 py-3">الطبيب</th><th className="text-right px-4 py-3">السعر</th><th className="text-right px-4 py-3">السن</th><th className="text-right px-4 py-3">التاريخ</th><th className="text-right px-4 py-3">الحالة</th></tr></thead><tbody className="divide-y divide-white/5">{records.map((r:any)=><tr key={r.id} className="hover:bg-white/5"><td className="px-4 py-2 text-white">{r.patientName}</td><td className="px-4 py-2 text-slate-200">{r.treatName}</td><td className="px-4 py-2 text-slate-300">{r.doctorName}</td><td className="px-4 py-2 text-emerald-400">{r.cost} ر.س</td><td className="px-4 py-2 text-emerald-300">🦷 {r.tooth}</td><td className="px-4 py-2 text-slate-500 text-xs">{fmtDate(r.date)}</td><td className="px-4 py-2"><span className="text-xs px-2 py-1 rounded bg-white/10">{r.status}</span></td></tr>)}</tbody></table></div>
      </div>
      {activeSub==='finance' && <div className="grid grid-cols-3 gap-3"><div className={card + ' text-center'}><div className="text-xl font-bold text-emerald-400">{records.reduce((s:any,r:any)=>s+Number(r.cost||0),0)} ر.س</div><div className="text-xs text-slate-400">الإجمالي</div></div><div className={card + ' text-center'}><div className="text-xl font-bold text-blue-400">{records.length}</div><div className="text-xs text-slate-400">العدد</div></div><div className={card + ' text-center'}><div className="text-xl font-bold text-amber-400">{records.filter((r:any)=>r.status==='تمت').length}</div><div className="text-xs text-slate-400">مكتملة</div></div></div>}
    </div>
  )
}

// ================= RECEPTION DASHBOARD =================
function ReceptionDashboard({ setPage }: any) {
  const [searchName, setSearchName] = useState('');
  const [searchCard, setSearchCard] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [cards, setCards] = useState<any[]>(() => { try { return JSON.parse(localStorage.getItem('zircon_visitCards') || '[]'); } catch { return []; } });
  const [doctors, setDoctors] = useState<any[]>([]);
  const [recSettings, setRecSettings] = useState<any>(() => { try { return { workStart:'00:00', workEnd:'23:59', clinicName:'مركز زركون CAD CAM', logo:'', phone1:'770605604', address:'صنعاء', examFee:1000, ...JSON.parse(localStorage.getItem('zircon.receptionSettings.v1') || '{}') }; } catch { return { workStart:'00:00', workEnd:'23:59', clinicName:'مركز زركون', examFee:1000 }; } });
  const [editingCard, setEditingCard] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ name: '', age: '', gender: 'ذكر', phone: '', doctor: '', paymentMethod: '2 - نقد', currency: '101 - ريال يمني', regDate: TODAY, freeRenew: false });
  useEffect(() => { localStorage.setItem('zircon_visitCards', JSON.stringify(cards)); }, [cards]);
  useEffect(() => { try { setDoctors(JSON.parse(localStorage.getItem('zircon_doctors') || '[]')); } catch {} }, []);
  function generateCardNumber() { const maxNum = cards.reduce((m: any, c: any) => Math.max(m, parseInt(c.cardNumber) || 5700), 5700); return (maxNum + 1).toString(); }
  function saveCard() {
    if (!form.name.trim() || !form.phone.trim()) { alert('الاسم والجوال مطلوبان'); return; }
    if (editingCard) { setCards(cards.map((c: any) => c.cardNumber === editingCard.cardNumber ? { ...form, cardNumber: editingCard.cardNumber, createdAt: editingCard.createdAt, completed: editingCard.completed } : c)); setEditingCard(null); }
    else { const newNum = generateCardNumber(); const newCardObj = { ...form, cardNumber: newNum, createdAt: new Date().toISOString(), completed: false }; setCards([newCardObj, ...cards]); setForm({ name: '', age: '', gender: 'ذكر', phone: '', doctor: '', paymentMethod: '2 - نقد', currency: '101 - ريال يمني', regDate: TODAY, freeRenew: false }); alert(`تم حفظ - رقم البطاقة: ${newNum}`); }
  }
  const filtered = cards.filter((c: any) => {
    const matchName = !searchName || (c.name || '').includes(searchName);
    const matchCard = !searchCard || (c.cardNumber || '').includes(searchCard);
    const matchPhone = !searchPhone || (c.phone || '').includes(searchPhone);
    let matchFilter = true;
    if (filter === 'completed') matchFilter = c.completed;
    if (filter === 'incomplete') matchFilter = !c.completed;
    return matchName && matchCard && matchPhone && matchFilter;
  });
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">بطاقة المعاينة - قلب النظام - الاستقبال</h2>
      <div className={card}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <input placeholder="اسم المريض" value={searchName} onChange={e => setSearchName(e.target.value)} className={inp} />
          <input placeholder="رقم البطاقة" value={searchCard} onChange={e => setSearchCard(e.target.value)} className={inp} />
          <input placeholder="الجوال" value={searchPhone} onChange={e => setSearchPhone(e.target.value)} className={inp} dir="ltr" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div><label className={label}>اسم المريض *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inp} /></div>
          <div><label className={label}>العمر</label><input value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} className={inp} /></div>
          <div><label className={label}>النوع</label><select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className={inp}><option>ذكر</option><option>أنثى</option></select></div>
          <div><label className={label}>الجوال *</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={inp} dir="ltr" /></div>
          <div><label className={label}>الطبيب *</label><select value={form.doctor} onChange={e => setForm({ ...form, doctor: e.target.value })} className={inp}><option value="">اختر</option>{doctors.map((d: any) => <option key={d.id} value={d.name}>{d.name}</option>)}</select></div>
          <div className="flex items-end"><button onClick={saveCard} className={btnSm + ' w-full'}><Save size={16}/> حفظ - يولد رقم البطاقة</button></div>
        </div>
      </div>
      <div className={card + ' !p-0 overflow-hidden'}>
        <div className="overflow-auto max-h-[400px]"><table className="w-full text-sm min-w-[800px]"><thead className="bg-white/5 text-slate-400 text-xs sticky top-0"><tr><th className="text-right px-3 py-3">الوقت</th><th className="text-right px-3 py-3">رقم البطاقة</th><th className="text-right px-3 py-3">الاسم</th><th className="text-right px-3 py-3">الجوال</th><th className="text-right px-3 py-3">الطبيب</th><th>إجراء</th></tr></thead><tbody className="divide-y divide-white/5">{filtered.map((c: any) => (<tr key={c.cardNumber} className="hover:bg-white/5"><td className="px-3 py-2 text-slate-400 text-xs">{fmtDateTime(c.createdAt)}</td><td className="px-3 py-2 font-mono text-blue-300 font-bold text-xs" dir="ltr">#{c.cardNumber}</td><td className="px-3 py-2 text-white">{c.name}</td><td className="px-3 py-2 text-slate-300" dir="ltr">{c.phone}</td><td className="px-3 py-2 text-slate-300">{c.doctor}</td><td className="px-3 py-2"><button onClick={()=>{ setEditingCard(c); setForm(c); }} className="text-blue-400"><Edit3 size={14}/></button></td></tr>))}</tbody></table></div>
      </div>
    </div>
  );
}

// ================= DOCTOR DASHBOARD =================
function DoctorDashboard({ setPage, setActivePatient, currentUser }: any) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [currentDoctor, setCurrentDoctor] = useState('');
  const [activeSel, setActiveSel] = useState<any>(null);
  const loadData = useCallback(()=>{
    try { setSessions(JSON.parse(localStorage.getItem('zircon_sessions') || '[]')); const v = JSON.parse(localStorage.getItem('zircon_visitCards') || '[]'); setCards(v); } catch {}
    try { const u = currentUser || JSON.parse(localStorage.getItem('zircon_currentUser')||'null'); if(u?.doctorName) setCurrentDoctor(u.doctorName); } catch {}
  },[currentUser]);
  useEffect(()=>{ loadData(); const id=setInterval(loadData,2000); return ()=>clearInterval(id); },[loadData]);
  function enterPatient(s:any){
    const card = cards.find((c:any)=> (c.cardNumber)==s.cardNumber || c.name==s.patientName);
    setActivePatient({ cardNumber: s.cardNumber, name: s.patientName, doctor: s.doctor || currentDoctor, phone: card?.phone || '', age: card?.age || '', gender: card?.gender || '', cardData: card || null });
    setPage('treatment-screen');
  }
  const todaySessions = sessions.filter((s:any)=> s.date===TODAY);
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-600/20 to-indigo-700/10 p-5">
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Stethoscope size={24} className="text-blue-400"/> لوحة تحكم الطبيب - {todaySessions.length} مريض اليوم</h2>
        <p className="text-slate-300 text-xs mt-1">مرحباً د. {currentDoctor || currentUser?.username}</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { icon:'📋', label:'بطاقة معاينة', action:()=>setPage('doctor-cards') },
          { icon:'🦷', label:'المعالجة', desc:'الأساسية', action:()=>{ if(activeSel) enterPatient(activeSel); else if(todaySessions[0]) enterPatient(todaySessions[0]); else alert('اختر مريض'); } },
          { icon:'📊', label:'قائمة المعالجات', action:()=>setPage('doctor-treatments-list') },
          { icon:'💊', label:'الأدوية', action:()=>setPage('medicines-list') },
          { icon:'📅', label:'المواعيد', action:()=>setPage('doctor-appointments') },
        ].map((ic:any,i:number)=>(<button key={i} onClick={ic.action} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center hover:bg-white/[0.06]"><div className="text-3xl mb-2">{ic.icon}</div><div className="text-sm font-bold text-white">{ic.label}</div></button>))}
      </div>
      <div className={card + ' !p-0 overflow-hidden'}>
        <div className="p-4 border-b border-white/10"><h3 className="font-bold text-white">قائمة الانتظار - {todaySessions.length} - محتوى اليوم {TODAY}</h3></div>
        <div className="overflow-auto"><table className="w-full text-sm"><thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-3">#</th><th className="text-right px-4 py-3">رقم البطاقة</th><th className="text-right px-4 py-3">اسم المريض</th><th className="text-right px-4 py-3">التاريخ</th><th className="text-right px-4 py-3">الطبيب</th><th>إجراء</th></tr></thead><tbody className="divide-y divide-white/5">{todaySessions.map((s:any, idx:number)=>(<tr key={s.id} onClick={()=>setActiveSel(s)} className={`hover:bg-white/5 cursor-pointer ${activeSel?.id===s.id ? 'bg-blue-500/20' : ''}`}><td className="px-4 py-3 text-slate-400">#{idx+1}</td><td className="px-4 py-3 font-mono text-blue-300 text-xs" dir="ltr">#{s.cardNumber}</td><td className="px-4 py-3 text-white">{s.patientName}</td><td className="px-4 py-3 text-slate-300 text-xs">{s.date}</td><td className="px-4 py-3 text-slate-300 text-xs">{s.doctor}</td><td className="px-4 py-3"><button onClick={(e)=>{ e.stopPropagation(); enterPatient(s); }} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs">دخول</button></td></tr>))}</tbody></table></div>
      </div>
    </div>
  );
}

function TreatmentScreen({ activePatient, setPage }: any) {
  const [treatTypes, setTreatTypes] = useState<any[]>([]);
  const [allTreatments, setAllTreatments] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon.doctorTreatments.v1')||'[]'); }catch{ return []; } });
  const [currentForm, setCurrentForm] = useState<any>({ treatType: '', cost: 2000, date: TODAY, discountAmount: 0, discountRatio: '67 / 50', diagnosis: '', teeth: [] as number[], medicine: '', notes: '', status: 'لم يكمل المعالجة' });
  const [showJaw, setShowJaw] = useState(false);
  useEffect(()=>{ try{ setTreatTypes(JSON.parse(localStorage.getItem('zircon_treatTypes')||'[]')); }catch{} },[]);
  useEffect(()=>{ localStorage.setItem('zircon.doctorTreatments.v1', JSON.stringify(allTreatments)); },[allTreatments]);
  if(!activePatient) return <div className={card + ' text-center py-12 text-slate-400'}>اختر مريضاً من القائمة</div>;
  function saveTreatment(){
    if(!currentForm.treatType){ alert('اختر نوع المعالجة'); return; }
    const newT:any = { id: Date.now().toString(), patientId: activePatient.cardNumber, patientName: activePatient.name, doctorName: activePatient.doctor, treatmentType: currentForm.treatType, cost: Number(currentForm.cost), teeth: currentForm.teeth, date: currentForm.date, status: currentForm.status, completed: false, createdAt: new Date().toISOString() };
    setAllTreatments([newT, ...allTreatments]);
    try{ const bulk = JSON.parse(localStorage.getItem('zircon_bulkRows')||'[]'); const rows = currentForm.teeth.map((t:number)=>({ id: Date.now()+Math.random(), patientName: activePatient.name, doctorName: activePatient.doctor, treatName: currentForm.treatType, tooth: t, cost: currentForm.cost, date: currentForm.date, status: currentForm.status })); localStorage.setItem('zircon_bulkRows', JSON.stringify([...rows, ...bulk])); }catch{}
    setCurrentForm({ treatType:'', cost:2000, date:TODAY, discountAmount:0, discountRatio:'67 / 50', diagnosis:'', teeth:[], medicine:'', notes:'', status:'لم يكمل المعالجة' });
    alert('✓ تم حفظ معالجة');
  }
  const patientTreatments = allTreatments.filter((t:any)=> t.patientId===activePatient.cardNumber);
  return (
    <div className="space-y-4">
      <div className="flex gap-2"><button onClick={()=>setPage('dashboard')} className={btnGhost}><ArrowRight size={16}/> رجوع</button><button onClick={saveTreatment} className={btnSm}><Save size={14}/> حفظ معالجة</button></div>
      <div className={card}><div className="grid sm:grid-cols-3 gap-3 text-sm"><div><div className="text-xs text-slate-400">المريض</div><div className="text-white font-bold">{activePatient.cardNumber} - {activePatient.name}</div></div><div><div className="text-xs text-slate-400">الطبيب</div><div className="text-white">{activePatient.doctor}</div></div><div><div className="text-xs text-slate-400">الجوال</div><div className="text-white">{activePatient.phone}</div></div></div></div>
      <div className={card}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div><label className={label}>نوع المعالجة *</label><select value={currentForm.treatType} onChange={e=>{ const t=treatTypes.find((x:any)=>x.name===e.target.value); setCurrentForm({...currentForm, treatType:e.target.value, cost:t?.price||currentForm.cost}); }} className={inp}><option value="">اختر</option>{treatTypes.map((t:any)=><option key={t.id} value={t.name}>{t.name} - {t.price}</option>)}</select></div>
          <div><label className={label}>التكلفة</label><input type="number" value={currentForm.cost} onChange={e=>setCurrentForm({...currentForm, cost:e.target.value})} className={inp}/></div>
          <div><label className={label}>الأسنان 🦷</label><button onClick={()=>setShowJaw(true)} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-xs text-white">🦷 {currentForm.teeth.length>0 ? currentForm.teeth.join(', ') : 'اختر من المخطط'}</button></div>
        </div>
        <div className="mt-3"><button onClick={saveTreatment} className={btnSm + ' w-full'}>حفظ معالجة - ترحيل للملف الطبي وسند الحساب</button></div>
      </div>
      <div className={card + ' !p-0 overflow-hidden'}><div className="p-3 border-b border-white/10 font-bold text-white text-sm">سجل معالجات المريض - {patientTreatments.length}</div><div className="overflow-auto"><table className="w-full text-sm"><thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-3 py-3">المعالجة</th><th className="text-right px-3 py-3">الطبيب</th><th className="text-right px-3 py-3">التكلفة</th><th className="text-right px-3 py-3">السن</th><th className="text-right px-3 py-3">التاريخ</th></tr></thead><tbody className="divide-y divide-white/5">{patientTreatments.map((t:any)=><tr key={t.id}><td className="px-3 py-2 text-white">{t.treatmentType}</td><td className="px-3 py-2 text-slate-300">{t.doctorName}</td><td className="px-3 py-2 text-emerald-400">{t.cost}</td><td className="px-3 py-2 text-emerald-300">🦷 {t.teeth.join(', ')}</td><td className="px-3 py-2 text-slate-400 text-xs">{fmtDate(t.date)}</td></tr>)}</tbody></table></div></div>
      {showJaw && <JawModalBulk selected={currentForm.teeth} onToggle={(n:any)=>{ const has=currentForm.teeth.includes(n); setCurrentForm({...currentForm, teeth: has ? currentForm.teeth.filter((x:any)=>x!==n) : [...currentForm.teeth, n]}); }} onClose={()=>setShowJaw(false)} treatName={currentForm.treatType} doctorName={activePatient.doctor} cost={currentForm.cost} />}
    </div>
  );
}

// ================= SIMPLE PAGES =================
function Dashboard({ setPage }: { setPage: (p:string)=>void }) {
  const [stats, setStats] = useState({ patients: 0, today: 0, surgeries: 0, implants: 0 });
  useEffect(() => {
    (async () => {
      const start = new Date(); start.setHours(0,0,0,0);
      const end = new Date(); end.setHours(23,59,59,999);
      const mStart = new Date(); mStart.setDate(1); mStart.setHours(0,0,0,0);
      const [p, a, s, i] = await Promise.all([
        supabase.from('patients').select('*', { count: 'exact', head: true }),
        supabase.from('appointments').select('*', { count: 'exact', head: true }).gte('scheduled_start', start.toISOString()).lte('scheduled_start', end.toISOString()),
        supabase.from('surgeries').select('*', { count: 'exact', head: true }).gte('created_at', mStart.toISOString()),
        supabase.from('implants').select('*', { count: 'exact', head: true }),
      ]);
      setStats({ patients: p.count||0, today: a.count||0, surgeries: s.count||0, implants: i.count||0 });
    })();
  }, []);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h2 className="text-2xl font-bold text-white">لوحة تحكم الزراعة</h2><div className="flex gap-2"><button onClick={() => setPage('treatments-bulk')} className={btnSm}><Plus size={16}/> إضافة معالجات</button></div></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={card}><div className="text-2xl font-bold text-white">{stats.patients}</div><div className="text-sm text-slate-400">المرضى</div></div>
        <div className={card}><div className="text-2xl font-bold text-emerald-400">{stats.today}</div><div className="text-sm text-slate-400">مواعيد اليوم</div></div>
        <div className={card}><div className="text-2xl font-bold text-purple-400">{stats.surgeries}</div><div className="text-sm text-slate-400">جراحات الشهر</div></div>
        <div className={card}><div className="text-2xl font-bold text-cyan-400">{stats.implants}</div><div className="text-sm text-slate-400">الزرعات</div></div>
      </div>
    </div>
  );
}

function SessionBookingPage(){
  const [cards, setCards] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon_visitCards')||'[]'); }catch{ return [] } });
  const [doctors, setDoctors] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon_doctors')||'[]') }catch{ return [] } });
  const [bookings, setBookings] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon_sessionBookings')||'[]') }catch{ return [] } });
  const [form, setForm] = useState({ patientId:'', patientName:'', cardNo:'', doctorId:'', doctorName:'', date:TODAY });
  useEffect(()=>{ localStorage.setItem('zircon_sessionBookings', JSON.stringify(bookings)) },[bookings]);
  useEffect(()=>{ localStorage.setItem('zircon_sessions', JSON.stringify(bookings)) },[bookings]);
  const dayBookings = bookings.filter((b:any)=> b.date===form.date);
  function bookSession(){
    if(!form.patientName || !form.doctorName){ alert('اختر المريض والطبيب'); return; }
    const newBooking = { ...form, id:Date.now().toString(), bookedAt:new Date().toISOString() };
    setBookings([newBooking, ...bookings]);
    alert(`تم حجز جلسة ${form.patientName} - ${form.cardNo}`);
  }
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">حجز الجلسات - مربوط ببطاقة المعاينة</h2>
      <div className={card + ' !p-4'}>
        <div className="grid md:grid-cols-4 gap-3">
          <div><label className={label}>المريض</label><select value={form.patientId} onChange={e=>{ const p=cards.find((x:any)=>x.cardNumber===e.target.value); setForm({...form, patientId:p?.cardNumber||'', patientName:p?.name||'', cardNo:p?.cardNumber||''}) }} className={inp}><option value="">اختر</option>{cards.map((c:any)=><option key={c.cardNumber} value={c.cardNumber}>{c.name} - {c.cardNumber}</option>)}</select></div>
          <div><label className={label}>الطبيب</label><select value={form.doctorId} onChange={e=>{ const d=doctors.find((x:any)=>x.id===e.target.value); setForm({...form, doctorId:d?.id||'', doctorName:d?.name||''}) }} className={inp}><option value="">اختر</option>{doctors.map((d:any)=><option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
          <div><label className={label}>التاريخ</label><input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} className={inp}/></div>
          <div className="flex items-end"><button onClick={bookSession} className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 text-sm">✓ حجز جلسة</button></div>
        </div>
      </div>
      <div className={card + ' !p-0 overflow-hidden'}><table className="w-full text-sm"><thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-3 py-2">البطاقة</th><th className="text-right px-3 py-2">المريض</th><th className="text-right px-3 py-2">الطبيب</th><th className="text-right px-3 py-2">التاريخ</th></tr></thead><tbody className="divide-y divide-white/5">{dayBookings.map((b:any)=><tr key={b.id}><td className="px-3 py-2 text-blue-300">{b.cardNo}</td><td className="px-3 py-2 text-white">{b.patientName}</td><td className="px-3 py-2 text-slate-300">{b.doctorName}</td><td className="px-3 py-2 text-slate-400">{fmtDate(b.date)}</td></tr>)}</tbody></table></div>
    </div>
  );
}

function SettingsPage(){
  const [settingsTab, setSettingsTab] = useState<'doctors'|'treatments'|'users'>('doctors');
  const [doctors, setDoctors] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon_doctors')||'[{"id":"1","name":"د. أحمد الشطبي","specialty":"زراعة"}]') }catch{ return [] } });
  const [treatTypes, setTreatTypes] = useState<any[]>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon_treatTypes')||'[{"id":"1","name":"حشوة تجميلية","price":500}]') }catch{ return [] } });
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
      <div className={card + ' !p-4'}>
        <div className="flex gap-2 border-b border-white/10 mb-4">
          <button onClick={()=>setSettingsTab('doctors')} className={`px-4 py-2 text-sm border-b-2 ${settingsTab==='doctors'?'border-blue-500 text-white':'border-transparent text-slate-400'}`}>الأطباء</button>
          <button onClick={()=>setSettingsTab('treatments')} className={`px-4 py-2 text-sm border-b-2 ${settingsTab==='treatments'?'border-blue-500 text-white':'border-transparent text-slate-400'}`}>المعالجات</button>
          <button onClick={()=>setSettingsTab('users')} className={`px-4 py-2 text-sm border-b-2 flex items-center gap-2 ${settingsTab==='users'?'border-violet-500 text-white bg-violet-500/10 rounded-t-xl':'border-transparent text-slate-400'}`}><UserPlus size={14}/> المستخدمين</button>
        </div>
        {settingsTab==='doctors' && (
          <div className="space-y-3"><div className="grid md:grid-cols-3 gap-3"><input value={newDoc.name} onChange={e=>setNewDoc({...newDoc,name:e.target.value})} placeholder="اسم الطبيب" className={inp}/><input value={newDoc.specialty} onChange={e=>setNewDoc({...newDoc,specialty:e.target.value})} placeholder="التخصص" className={inp}/><button onClick={()=>{ if(!newDoc.name) return; setDoctors([...doctors,{id:Date.now().toString(),...newDoc}]); setNewDoc({name:'',specialty:''}) }} className={btnSm}><Plus size={16}/> إضافة</button></div>
            {doctors.map((d:any)=><div key={d.id} className="flex justify-between p-3 rounded-xl bg-white/5"><span className="text-white text-sm">{d.name} - {d.specialty}</span><div className="flex gap-2"><button onClick={()=>setEditItem({type:'doc',data:d})} className="text-blue-400"><Edit3 size={14}/></button><button onClick={()=>setDoctors(doctors.filter((x:any)=>x.id!==d.id))} className="text-red-400"><Trash2 size={14}/></button></div></div>)}</div>
        )}
        {settingsTab==='treatments' && (
          <div className="space-y-3"><div className="grid md:grid-cols-3 gap-3"><input value={newTreat.name} onChange={e=>setNewTreat({...newTreat,name:e.target.value})} placeholder="اسم المعالجة" className={inp}/><input type="number" value={newTreat.price} onChange={e=>setNewTreat({...newTreat,price:parseInt(e.target.value)||0})} className={inp}/><button onClick={()=>{ if(!newTreat.name) return; setTreatTypes([...treatTypes,{id:Date.now().toString(),...newTreat}]); setNewTreat({name:'',price:500}) }} className={btnSm}><Plus size={16}/> إضافة</button></div>
            {treatTypes.map((t:any)=><div key={t.id} className="flex justify-between p-3 rounded-xl bg-white/5"><span className="text-white text-sm">{t.name} - {t.price} ر.س</span><div className="flex gap-2"><button onClick={()=>setEditItem({type:'treat',data:t})} className="text-blue-400"><Edit3 size={14}/></button><button onClick={()=>setTreatTypes(treatTypes.filter((x:any)=>x.id!==t.id))} className="text-red-400"><Trash2 size={14}/></button></div></div>)}</div>
        )}
        {settingsTab==='users' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-white/[.02] border border-white/10 p-4 space-y-3"><div className="font-semibold text-white flex items-center gap-2"><UserPlus size={18}/> إضافة مستخدم جديد - اسم المستخدم وكلمة المرور</div><div className="grid md:grid-cols-3 gap-3"><div><label className={label}>اسم المستخدم *</label><input value={newUser.username} onChange={e=>setNewUser({...newUser,username:e.target.value})} placeholder="doctor1" className={inp}/></div><div><label className={label}>كلمة المرور *</label><input value={newUser.password} onChange={e=>setNewUser({...newUser,password:e.target.value})} type="password" placeholder="••••••" className={inp}/></div><div><label className={label}>الدور</label><select value={newUser.role} onChange={e=>setNewUser({...newUser,role:e.target.value})} className={inp}><option>طبيب</option><option>مدير</option><option>استقبال</option><option>محاسب</option></select></div></div><button onClick={()=>{ if(!newUser.username||!newUser.password){ alert('ادخل البيانات'); return } setAppUsers([...appUsers,{id:Date.now().toString(),...newUser}]); setNewUser({username:'',password:'',role:'طبيب'}) }} className={btnSm}><Plus size={16}/> إضافة المستخدم</button></div>
            <div className={card + ' !bg-white/[.02]'}><div className="flex justify-between items-center mb-3"><div className="font-bold flex items-center gap-2 text-white"><Users size={18}/> عرض المستخدمين - {appUsers.filter((u:any)=> u.username.toLowerCase().includes(userSearch.toLowerCase())).length}</div><div className="relative"><Search size={14} className="absolute right-2 top-2.5 text-slate-500"/><input value={userSearch} onChange={e=>setUserSearch(e.target.value)} placeholder="بحث..." className="pr-7 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs w-40 text-white"/></div></div><div className="overflow-auto"><table className="w-full text-sm"><thead className="text-slate-400 text-xs"><tr><th className="p-2 text-right">المستخدم</th><th className="p-2 text-right">كلمة المرور</th><th className="p-2 text-right">الدور</th><th></th></tr></thead><tbody>{appUsers.filter((u:any)=> u.username.toLowerCase().includes(userSearch.toLowerCase())).map((u:any)=><tr key={u.id} className="border-t border-white/5"><td className="p-3 flex items-center gap-2 text-white"><div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center text-xs">{u.username[0]}</div>{u.username}</td><td className="p-3 font-mono text-xs text-slate-300"><Lock size={12} className="inline ml-1"/>{'*'.repeat(u.password.length)} ({u.password.length})</td><td className="p-3"><span className="text-xs px-2 py-1 rounded bg-white/10">{u.role}</span></td><td className="p-3 flex gap-1 justify-end"><button onClick={()=>setEditItem({type:'user',data:u})} className="p-1.5 rounded bg-white/5"><Edit3 size={12}/></button><button onClick={()=>{ if(confirm('حذف '+u.username+'؟')) setAppUsers(appUsers.filter((x:any)=>x.id!==u.id)) }} className="p-1.5 rounded bg-red-500/20 text-red-300"><Trash2 size={12}/></button></td></tr>)}</tbody></table></div></div>
          </div>
        )}
        {editItem && (<div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={()=>setEditItem(null)}><div className="bg-[#0f172a] border border-white/10 rounded-2xl p-4 w-full max-w-md" onClick={e=>e.stopPropagation()}><h3 className="font-bold mb-3 text-white">تعديل</h3>{editItem.type==='doc' && <div className="space-y-2"><input value={editItem.data.name} onChange={e=>setEditItem({...editItem,data:{...editItem.data,name:e.target.value}})} className={inp}/><div className="flex gap-2"><button onClick={()=>{setDoctors(doctors.map((d:any)=>d.id===editItem.data.id?editItem.data:d));setEditItem(null)}} className={btnSm}>حفظ</button><button onClick={()=>setEditItem(null)} className={btnGhost}>إلغاء</button></div></div>}{editItem.type==='treat' && <div className="space-y-2"><input value={editItem.data.name} onChange={e=>setEditItem({...editItem,data:{...editItem.data,name:e.target.value}})} className={inp}/><input type="number" value={editItem.data.price} onChange={e=>setEditItem({...editItem,data:{...editItem.data,price:parseInt(e.target.value)||0}})} className={inp}/><div className="flex gap-2"><button onClick={()=>{setTreatTypes(treatTypes.map((t:any)=>t.id===editItem.data.id?editItem.data:t));setEditItem(null)}} className={btnSm}>حفظ</button><button onClick={()=>setEditItem(null)} className={btnGhost}>إلغاء</button></div></div>}{editItem.type==='user' && <div className="space-y-2"><input value={editItem.data.username} onChange={e=>setEditItem({...editItem,data:{...editItem.data,username:e.target.value}})} className={inp}/><input value={editItem.data.password} onChange={e=>setEditItem({...editItem,data:{...editItem.data,password:e.target.value}})} className={inp}/><select value={editItem.data.role} onChange={e=>setEditItem({...editItem,data:{...editItem.data,role:e.target.value}})} className={inp}><option>طبيب</option><option>مدير</option><option>استقبال</option><option>محاسب</option></select><div className="flex gap-2"><button onClick={()=>{setAppUsers(appUsers.map((u:any)=>u.id===editItem.data.id?editItem.data:u));setEditItem(null)}} className={btnSm}>حفظ</button><button onClick={()=>setEditItem(null)} className={btnGhost}>إلغاء</button></div></div>}</div></div>)}
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(()=>{ try{ return JSON.parse(localStorage.getItem('zircon_currentUser')||'null') }catch{ return null } });
  const [page, setPage] = useState('dashboard');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => { supabase.auth.getSession().then(({ data }) => setSession(data.session)); const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setSession(s)); return () => listener.subscription.unsubscribe(); }, []);
  if (!session && !currentUser) return <Login onLogin={(u:any)=>{ if(u){ setCurrentUser(u); setSession({user:u}); } else { supabase.auth.getSession().then(({data}) => { setSession(data.session); try{ setCurrentUser(JSON.parse(localStorage.getItem('zircon_currentUser')||'null')) }catch{} }); } }} />;
  const role = currentUser?.role || 'مدير';
  const allMenu = [
    { id:'dashboard', label:'لوحة التحكم', icon: LayoutDashboard, roles:['مدير','طبيب','استقبال','محاسب'] },
    { id:'reception-card', label:'بطاقة المعاينة', icon: FileText, roles:['مدير','استقبال'] },
    { id:'session-booking', label:'حجز الجلسات', icon: Calendar, roles:['مدير','استقبال'] },
    { id:'treatments-bulk', label:'اضافة معالجات - 8 أعمدة', icon: FileSpreadsheet, roles:['مدير','طبيب'] },
    { id:'disease-log', label:'سجل الأمراض', icon: ClipboardList, roles:['مدير','طبيب','استقبال','محاسب'] },
    { id:'settings', label:'الاعدادات + المستخدمين', icon: SettingsIcon, roles:['مدير'] },
  ];
  const menu = allMenu.filter(m=> m.roles.includes(role));
  return (
    <div dir="rtl" className="min-h-screen bg-[#060a1a] text-white flex">
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={()=>setSidebarOpen(false)} />}
      <aside className={`fixed lg:static inset-y-0 right-0 z-50 w-64 border-l border-white/10 bg-[#0a1028] p-4 flex flex-col transition-transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between mb-8"><div className="flex items-center gap-3"><div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 grid place-items-center font-bold">Z</div><div><div className="font-bold">Zircon OS V2</div><div className="text-[10px] text-slate-400">Dental</div></div></div><button onClick={()=>setSidebarOpen(false)} className="lg:hidden text-slate-400"><X size={18}/></button></div>
        <nav className="space-y-1 flex-1 overflow-y-auto">
          {menu.map(m=>(<button key={m.id} onClick={()=>{ setPage(m.id); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 text-right p-3 rounded-xl text-sm transition ${page===m.id ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'hover:bg-white/5 text-slate-300'}`}><m.icon size={18}/> {m.label}</button>))}
        </nav>
        <div className="mt-auto space-y-2"><div className="rounded-xl bg-white/5 border border-white/10 p-3"><div className="flex items-center gap-2"><div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 grid place-items-center text-xs font-bold">{currentUser?.username?.[0]?.toUpperCase()||'م'}</div><div><div className="text-sm font-bold text-white">{currentUser?.username}</div><div className="text-[11px] text-slate-400">{role}</div></div></div></div><button onClick={() => { localStorage.removeItem('zircon_currentUser'); supabase.auth.signOut(); setCurrentUser(null); setSession(null); }} className="w-full flex items-center gap-2 text-red-400 p-3 text-sm hover:bg-red-500/10 rounded-xl"><LogOut size={18}/> خروج - {currentUser?.username}</button></div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-white/10 bg-[#0a1028]/50 backdrop-blur-xl flex items-center justify-between px-4"><button onClick={()=>setSidebarOpen(true)} className="lg:hidden text-white"><Menu size={20}/></button><div className="text-sm text-slate-400 hidden lg:block">مرحبا {currentUser?.username} - دورك: {role}</div><div className="flex items-center gap-3"><Bell size={18} className="text-slate-400"/><div className="h-8 w-8 rounded-full bg-blue-500/20 text-blue-300 grid place-items-center text-xs font-bold">{currentUser?.username?.[0]?.toUpperCase()||'م'}</div></div></header>
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {page==='dashboard' && (role==='استقبال' ? <ReceptionDashboard setPage={setPage} /> : role==='طبيب' ? <DoctorDashboard setPage={setPage} setActivePatient={setSelectedPatient} currentUser={currentUser} /> : <Dashboard setPage={setPage} />)}
          {page==='reception-card' && <ReceptionDashboard setPage={setPage} />}
          {page==='session-booking' && <SessionBookingPage />}
          {page==='treatments-bulk' && <TreatmentsBulk />}
          {page==='disease-log' && <DiseaseLog />}
          {page==='treatment-screen' && <TreatmentScreen activePatient={selectedPatient} setPage={setPage} />}
          {page==='settings' && <SettingsPage />}
          {page==='doctor-cards' && <div className={card + ' text-center py-10 text-slate-400'}>بطاقة المعاينة - البيانات من الاستقبال - ارجع للوحة الطبيب</div>}
          {page==='doctor-treatments-list' && <div className={card + ' text-center py-10 text-slate-400'}>قائمة المعالجات - تدار من الإعدادات</div>}
          {page==='medicines-list' && <div className={card + ' text-center py-10 text-slate-400'}>قائمة الأدوية</div>}
          {page==='doctor-appointments' && <SessionBookingPage />}
        </main>
      </div>
    </div>
  );
}
