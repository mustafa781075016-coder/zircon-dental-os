import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  LayoutDashboard, Users, Calendar, LogOut, Menu, Bell, X,
  Stethoscope, Syringe, Receipt, FileText, Settings as SettingsIcon,
  Plus, Search, Mail, Lock, Loader2, ArrowRight, Save, Trash2, Edit3,
  MessageCircle, Clock, DollarSign, UserPlus, ClipboardList, HeartPulse, FileSpreadsheet,
  Megaphone, TrendingUp, Target, BarChart3, RefreshCw, Check, Printer as PrinterIcon, Filter,
  Building2, Clock4, Upload as UploadIcon, Image as ImageIcon
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

function Login({ onLogin }: { onLogin: (user:any)=>void }) {
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
      if(found){ localStorage.setItem('zircon_currentUser', JSON.stringify(found)); setLoading(false); onLogin(found); return; }
    }catch{}
    if(username==='admin' && password==='123456'){
      const adminUser = { id:'1', username:'admin', password:'123456', role:'مدير' };
      localStorage.setItem('zircon_currentUser', JSON.stringify(adminUser));
      setLoading(false); onLogin(adminUser); return;
    }
    setLoading(false);
    setErr('بيانات الدخول غير صحيحة');
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
            <label className={label}>اسم المستخدم</label>
            <div className="relative"><Users size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" /><input value={username} onChange={e=>setUsername(e.target.value)} required dir="ltr" className={inp + ' pr-10'}/></div>
          </div>
          <div>
            <label className={label}>كلمة المرور</label>
            <div className="relative"><Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" /><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required dir="ltr" className={inp + ' pr-10'}/></div>
          </div>
          {err && <div className="rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3">{err}</div>}
          <button type="submit" disabled={loading} className={btn}>{loading && <Loader2 className="animate-spin" size={18}/>} دخول</button>
          <div className="text-center text-[11px] text-slate-500 mt-2"><div>المدير: admin / 123456</div></div>
        </form>
      </div>
    </div>
  );
}

/* ====== TEETH CHART ====== */
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
        <path d={path} fill={has ? '#10b981' : 'rgba(255,255,255,0.04)'} stroke={has ? '#10b981' : 'rgba(255,255,255,0.25)'} strokeWidth="1.6" />
        <text x="25" y={isMolar ? "34" : "30"} textAnchor="middle" dominantBaseline="middle" fontSize={isMolar ? "20" : "22"} fontWeight="800" fill={has ? 'white' : color} className="select-none">{shortNum}</text>
      </svg>
      <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[8px] font-bold text-slate-500/70">{num}</span>
    </button>
  );
}

function ToothChart({ implants, onToothClick, selectedTeeth }: { implants: any[], onToothClick: (n:number)=>void, selectedTeeth?: number[] }) {
  const implanted = new Set(implants.map((i:any)=>i.tooth_number));
  const selectedSet = new Set(selectedTeeth || []);
  const Arch = ({ teeth, isUpper }: { teeth: number[], isUpper: boolean }) => (
    <div className="relative w-full h-[440px] md:h-[480px] mx-auto max-w-[420px]">
      <div className={`absolute left-1/2 -translate-x-1/2 w-[92%] h-[92%] border border-white/10 rounded-[50%] pointer-events-none ${isUpper ? 'top-[4%] rounded-b-none border-b-0' : 'bottom-[4%] rounded-t-none border-t-0'}`} />
      {teeth.map((n, idx) => {
        const angle = (isUpper ? 180 : 0) + 180 * (idx / (teeth.length - 1));
        const rad = (angle * Math.PI) / 180;
        const x = 50 + 43 * Math.cos(rad);
        const y = (isUpper ? 80 : 20) + 54 * Math.sin(rad);
        const isSelected = selectedSet.has(n);
        return (
          <div key={n} style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }} className="absolute w-[44px] h-[52px] md:w-[48px] md:h-[56px]">
            <div className={isSelected ? 'ring-4 ring-blue-400 rounded-lg' : ''}>
              <ToothShape num={n} has={implanted.has(n)} onClick={() => onToothClick(n)} />
            </div>
          </div>
        );
      })}
    </div>
  );
  return (
    <div className={card + ' !p-3 md:!p-5'}>
      <h3 className="font-semibold text-white text-sm md:text-base mb-3">مخطط الأسنان</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-2"><div className="text-center text-[11px] text-slate-400 mb-1">الفك العلوي</div><Arch teeth={TEETH_UPPER} isUpper={true} /></div>
        <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-2"><div className="text-center text-[11px] text-slate-400 mb-1">الفك السفلي</div><Arch teeth={TEETH_LOWER} isUpper={false} /></div>
      </div>
    </div>
  );
}

function SearchSelect({ placeholder, options, value, onSelect, displayKey='name' }:{ placeholder:string, options:any[], value:string, onSelect:(o:any)=>void, displayKey?:string }){
  const [q,setQ]=useState(value);
  const [open,setOpen]=useState(false);
  const filtered = options.filter((o:any)=>((o[displayKey] || o.name || o.full_name || '') as any).toString().toLowerCase().includes(q.toLowerCase())).slice(0,8);
  useEffect(()=>setQ(value),[value]);
  return (
    <div className="relative">
      <input value={q} onChange={e=>{ setQ(e.target.value); setOpen(true) }} onFocus={()=>setOpen(true)} placeholder={placeholder} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 outline-none"/>
      {open && (<>
        <div className="fixed inset-0 z-40" onClick={()=>setOpen(false)}></div>
        <div className="absolute z-50 mt-1 w-full rounded-xl bg-[#0f172a] border border-white/10 shadow-2xl max-h-48 overflow-auto">
          {filtered.length===0 ? <div className="p-3 text-xs text-slate-400">لا يوجد نتائج</div> :
            filtered.map((o:any,i:number)=>{ const lbl = o[displayKey] || o.name || o.full_name; return <button key={i} onClick={()=>{ setQ(lbl); onSelect(o); setOpen(false) }} className="w-full text-right px-3 py-2 text-xs text-white hover:bg-white/10 flex justify-between"><span>{lbl}</span>{o.price? <span className="text-emerald-400">{o.price} ر.س</span>: null}</button> })
          }
        </div>
      </>)}
    </div>
  );
}

function JawModalBulk({ selected, onToggle, onClose, treatName, doctorName, cost }: any) {
  const Cell = ({ fdi }: { fdi: number }) => {
    const palmer = fdi % 10;
    const sel = selected.includes(fdi);
    const cmap: any = { 1:'#ef4444', 2:'#f59e0b', 3:'#10b981', 4:'#3b82f6', 5:'#8b5cf6', 6:'#ec4899', 7:'#84cc16', 8:'#65a30d' };
    return (
      <button onClick={() => onToggle(fdi)} className={`relative rounded-lg border-2 aspect-square flex items-center justify-center transition-all ${sel ? 'bg-emerald-500 border-emerald-300 scale-105' : 'bg-white/5 border-white/15 hover:bg-white/10'}`}>
        <span className="text-lg md:text-2xl font-black" style={{ color: sel ? 'white' : cmap[palmer] }}>{palmer}</span>
        <span className={`absolute top-0.5 right-1 text-[7px] ${sel ? 'text-white/80' : 'text-slate-500'}`}>{fdi}</span>
      </button>
    );
  };
  const upperRight = [18,17,16,15,14,13,12,11]; const upperLeft = [21,22,23,24,25,26,27,28];
  const lowerRight = [48,47,46,45,44,43,42,41]; const lowerLeft = [31,32,33,34,35,36,37,38];
  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-2 md:p-4" onClick={onClose}>
      <div className="bg-[#0a1028] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="p-3 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#0a1028] z-20">
          <h3 className="text-white font-bold text-sm">اختر الأسنان</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-white/10 text-white"><X size={16}/></button>
        </div>
        <div className="p-3 md:p-5 space-y-3">
          <div><div className="text-center text-[11px] text-slate-400 mb-2">الفك العلوي</div>
            <div className="flex items-center justify-center gap-1"><div className="grid grid-cols-8 gap-1 flex-1">{upperRight.map(fdi => <Cell key={fdi} fdi={fdi} />)}</div><div className="w-[2px] h-10 bg-red-500 rounded"></div><div className="grid grid-cols-8 gap-1 flex-1">{upperLeft.map(fdi => <Cell key={fdi} fdi={fdi} />)}</div></div>
          </div>
          <div className="h-[2px] bg-red-500 w-full rounded"></div>
          <div><div className="text-center text-[11px] text-slate-400 mb-2">الفك السفلي</div>
            <div className="flex items-center justify-center gap-1"><div className="grid grid-cols-8 gap-1 flex-1">{lowerRight.map(fdi => <Cell key={fdi} fdi={fdi} />)}</div><div className="w-[2px] h-10 bg-red-500 rounded"></div><div className="grid grid-cols-8 gap-1 flex-1">{lowerLeft.map(fdi => <Cell key={fdi} fdi={fdi} />)}</div></div>
          </div>
          {selected.length > 0 && (
            <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden mt-4">
              <div className="p-2.5 text-xs font-bold text-white flex justify-between border-b border-white/10"><span>🦷 {selected.length} أسنان</span><span className="text-emerald-400">{cost} ر.س</span></div>
            </div>
          )}
        </div>
        <div className="p-3 border-t border-white/10 flex justify-between items-center sticky bottom-0 bg-[#0a1028]">
          <span className="text-[11px] text-slate-400">{selected.length} أسنان</span>
          <button onClick={onClose} className="px-6 py-2 rounded-xl bg-gradient-to-l from-violet-600 to-blue-600 text-white text-sm font-bold">تم</button>
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

  useEffect(()=>{ (async()=>{
    setLoading(true);
    const [p,d,t] = await Promise.all([
      supabase.from('patients').select('id, full_name').order('full_name').limit(100),
      supabase.from('doctors').select('*').order('created_at'),
      supabase.from('treatment_definitions').select('*').order('created_at'),
    ]);
    setPatientsList(p.data||[]); setDoctors(d.data||[]); setTreatTypes(t.data||[]); setLoading(false);
  })(); },[]);

  function addRow(){
    if(!form.patientName || !form.doctorName || !form.treatName || form.teeth.length===0){ alert('أكمل الحقول'); return; }
    const rows = form.teeth.map((toothNum:any)=>({ id: Date.now().toString()+Math.random(), patientId: form.patientId, patientName: form.patientName, doctorId: form.doctorId, doctorName: form.doctorName, treatTypeId: form.treatTypeId, treatName: form.treatName, tooth: toothNum, teeth: form.teeth, cost: form.cost, date: form.date, status: form.status, notes: form.notes }));
    setBulkRows([...rows, ...bulkRows]);
    setForm({ ...form, treatTypeId:'', treatName:'', cost:0, teeth:[], notes:'' }); setJawOpen(false);
  }

  async function saveAll(){
    if(bulkRows.length===0){ alert('لا يوجد معالجات'); return; }
    const grouped:any = {};
    bulkRows.forEach((r:any)=>{ const key = `${r.patientId}_${r.treatName}_${r.date}`; if(!grouped[key]) grouped[key] = { ...r, teeth:[r.tooth] }; else grouped[key].teeth.push(r.tooth); });
    const payload = Object.values(grouped).map((g:any)=>({ patient_id: g.patientId || null, tooth_number: g.teeth[0], treatment_type: g.treatName, doctor_name: g.doctorName, cost: g.cost, status: g.status === 'تمت' ? 'completed' : g.status === 'قيد التنفيذ' ? 'in_progress' : 'planned', description: `أسنان: ${g.teeth.join(', ')}`, treatment_date: g.date }));
    const { error } = await supabase.from('treatments').insert(payload);
    if(error){ alert('خطأ: ' + error.message); return; }
    alert(`تم حفظ ${payload.length} معالجة`); setBulkRows([]);
  }

  const filteredRows = bulkRows.filter((r:any)=> r.patientName.includes(search) || r.doctorName.includes(search) || r.treatName.includes(search));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-xl font-bold text-white">إضافة معالجات</h2>
        <div className="flex gap-2">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث..." className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs w-40 text-white"/>
          <button onClick={saveAll} className={btnSm}><Save size={16}/> حفظ ({bulkRows.length})</button>
        </div>
      </div>
      {loading ? <div className={card + ' text-center text-slate-400'}>جاري التحميل...</div> : (
        <div className={card + ' !p-4'}>
          <div className="grid grid-cols-1 md:grid-cols-8 gap-3">
            <div><label className={label}>المريض</label><SearchSelect placeholder="ابحث" options={patientsList} value={form.patientName} onSelect={(o:any)=>setForm({...form, patientId:o.id, patientName:o.full_name})} displayKey="full_name"/></div>
            <div><label className={label}>الطبيب</label><SearchSelect placeholder="ابحث" options={doctors} value={form.doctorName} onSelect={(o:any)=>setForm({...form, doctorId:o.id, doctorName:o.name})}/></div>
            <div><label className={label}>المعالجة</label><SearchSelect placeholder="ابحث" options={treatTypes} value={form.treatName} onSelect={(o:any)=>setForm({...form, treatTypeId:o.id, treatName:o.name, cost:o.price})}/></div>
            <div><label className={label}>الأسنان</label><button onClick={()=>setJawOpen(true)} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-xs text-white">🦷 {form.teeth.length>0? `${form.teeth.length}`:'اختر'}</button></div>
            <div><label className={label}>التكلفة</label><input value={form.cost} readOnly className={inp + ' !bg-emerald-500/10 !text-emerald-300'}/></div>
            <div><label className={label}>التاريخ</label><input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} className={inp}/></div>
            <div><label className={label}>الحالة</label><select value={form.status} onChange={e=>setForm({...form, status:e.target.value})} className={inp}><option>مخطط لها</option><option>تمت</option><option>قيد التنفيذ</option></select></div>
            <div><label className={label}>ملاحظات</label><input value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} className={inp}/></div>
          </div>
          <div className="mt-3"><button onClick={addRow} className={btnSm}><Plus size={16}/> إضافة</button></div>
        </div>
      )}
      <div className={card + ' !p-0 overflow-hidden'}>
        <div className="overflow-auto">
          <table className="w-full text-sm min-w-[1000px]">
            <thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-3 py-3">المريض</th><th className="text-right px-3 py-3">الطبيب</th><th className="text-right px-3 py-3">المعالجة</th><th className="text-right px-3 py-3">السن</th><th className="text-right px-3 py-3">التكلفة</th><th className="text-right px-3 py-3">التاريخ</th><th className="text-right px-3 py-3">الحالة</th><th></th></tr></thead>
            <tbody className="divide-y divide-white/5">
              {filteredRows.length===0? <tr><td colSpan={8} className="p-6 text-center text-slate-500">لا يوجد سجلات</td></tr>:
              filteredRows.map((r:any)=><tr key={r.id} className="hover:bg-white/5">
                <td className="px-3 py-2 text-white">{r.patientName}</td>
                <td className="px-3 py-2 text-slate-300">{r.doctorName}</td>
                <td className="px-3 py-2 text-slate-300">{r.treatName}</td>
                <td className="px-3 py-2"><span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs">🦷 {r.tooth}</span></td>
                <td className="px-3 py-2 text-emerald-400">{r.cost}</td>
                <td className="px-3 py-2 text-slate-400 text-xs">{fmtDate(r.date)}</td>
                <td className="px-3 py-2"><span className="text-xs px-2 py-1 rounded bg-white/10 text-white">{r.status}</span></td>
                <td className="px-3 py-2"><button onClick={()=>setBulkRows(bulkRows.filter((x:any)=>x.id!==r.id))} className="text-red-400"><Trash2 size={14}/></button></td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </div>
      {jawOpen && <JawModalBulk selected={form.teeth} onToggle={(n)=>{ const has=form.teeth.includes(n); setForm({...form, teeth: has? form.teeth.filter((x:any)=>x!==n): [...form.teeth,n] }) }} onClose={()=>setJawOpen(false)} treatName={form.treatName} doctorName={form.doctorName} cost={form.cost} />}
    </div>
  );
}

function DiseaseLog(){
  const [activeSub, setActiveSub] = useState('treatments');
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const loadRecords = useCallback(async()=>{ setLoading(true); const { data, error } = await supabase.from('treatments').select('*, patient:patients(full_name)').order('created_at', {ascending:false}).limit(500); if(!error && data) setRecords(data); else setRecords([]); setLoading(false); },[]);
  useEffect(()=>{ loadRecords(); },[loadRecords]);
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center"><h2 className="text-xl font-bold text-white">سجل الأمراض</h2><button onClick={loadRecords} className={btnGhost}><Loader2 size={14} className={loading?'animate-spin':''}/> تحديث</button></div>
      <div className={card + ' !p-0 overflow-hidden'}>
        <div className="p-4 font-bold text-white">سجل المعالجات - {records.length}</div>
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
    </div>
  );
}
/* ============ RECEPTION SETTINGS ============ */
const LS_RECEPTION_SETTINGS = 'zircon.receptionSettings.v1';
const DEFAULT_RECEPTION_SETTINGS = {
  workStart: '00:00', workEnd: '23:59',
  clinicName: 'مركز زركون CAD CAM لتحميل وتقويم وزراعة الأسنان',
  logo: '', phone1: '770605604', phone2: '', phone3: '',
  address: 'صنعاء - الدائري الغربي - حولة ٢٠', examFee: 1000, officeName: '',
};

function ReceptionSettings(){
  const [settings, setSettings] = useState<any>(() => {
    try { return { ...DEFAULT_RECEPTION_SETTINGS, ...JSON.parse(localStorage.getItem(LS_RECEPTION_SETTINGS) || '{}') }; }
    catch { return DEFAULT_RECEPTION_SETTINGS; }
  });
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<any>(null);
  function update(key: string, value: any) { setSettings({ ...settings, [key]: value }); }
  function save() { localStorage.setItem(LS_RECEPTION_SETTINGS, JSON.stringify(settings)); setSaved(true); setTimeout(() => setSaved(false), 2500); }
  function reset() { if (!confirm('إعادة الإعدادات للافتراضي؟')) return; setSettings(DEFAULT_RECEPTION_SETTINGS); localStorage.setItem(LS_RECEPTION_SETTINGS, JSON.stringify(DEFAULT_RECEPTION_SETTINGS)); alert('تمت الاستعادة'); }
  function uploadLogo(e: any) { const file = e.target.files?.[0]; if (!file) return; if (file.size > 1024 * 1024) { alert('حجم الشعار كبير'); return; } const reader = new FileReader(); reader.onload = (ev: any) => update('logo', ev.target.result); reader.readAsDataURL(file); }
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h2 className="text-xl font-bold text-white flex items-center gap-2"><SettingsIcon size={22} className="text-blue-400"/> إعدادات الاستقبال</h2><p className="text-slate-400 text-xs mt-1">إعدادات العيادة العامة وتوقيت الدوام</p></div>
        <div className="flex gap-2">
          <button onClick={reset} className={btnGhost}>↺ استعادة</button>
          <button onClick={save} className={btnSm}>{saved ? <Check size={16}/> : <Save size={16}/>}{saved ? 'تم الحفظ' : 'حفظ'}</button>
        </div>
      </div>
      <div className={card}>
        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Clock4 size={18} className="text-amber-400"/> توقيت الدوام</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className={label}>بداية الدوام</label><input type="time" value={settings.workStart} onChange={e => update('workStart', e.target.value)} className={inp} /></div>
          <div><label className={label}>نهاية الدوام</label><input type="time" value={settings.workEnd} onChange={e => update('workEnd', e.target.value)} className={inp} /></div>
        </div>
      </div>
      <div className={card}>
        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Building2 size={18} className="text-blue-400"/> إعدادات العيادة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2"><label className={label}>اسم العيادة</label><input value={settings.clinicName} onChange={e => update('clinicName', e.target.value)} className={inp} /></div>
          <div className="md:col-span-2">
            <label className={label}>شعار العيادة</label>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="h-24 w-24 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 grid place-items-center overflow-hidden">
                {settings.logo ? <img src={settings.logo} alt="logo" className="w-full h-full object-contain" /> : <ImageIcon size={32} className="text-slate-500" />}
              </div>
              <div className="space-y-2">
                <input ref={fileRef} type="file" accept="image/*" onChange={uploadLogo} className="hidden" />
                <button onClick={() => fileRef.current?.click()} className={btnSm}><UploadIcon size={16}/> رفع شعار</button>
                {settings.logo && <button onClick={() => update('logo', '')} className="text-xs text-red-400 block">حذف الشعار</button>}
                <p className="text-[10px] text-slate-500">PNG/JPG - أقل من 1 ميجا</p>
              </div>
            </div>
          </div>
          <div><label className={label}>التلفون 1</label><input value={settings.phone1} onChange={e => update('phone1', e.target.value)} className={inp} dir="ltr" /></div>
          <div><label className={label}>التلفون 2</label><input value={settings.phone2} onChange={e => update('phone2', e.target.value)} className={inp} dir="ltr" /></div>
          <div><label className={label}>التلفون 3</label><input value={settings.phone3} onChange={e => update('phone3', e.target.value)} className={inp} dir="ltr" /></div>
          <div><label className={label}>اسم المكتب</label><input value={settings.officeName} onChange={e => update('officeName', e.target.value)} className={inp} /></div>
          <div className="md:col-span-2"><label className={label}>العنوان</label><input value={settings.address} onChange={e => update('address', e.target.value)} className={inp} /></div>
          <div><label className={label}>سعر المعاينة</label><input type="number" value={settings.examFee} onChange={e => update('examFee', Number(e.target.value) || 0)} className={inp} /></div>
        </div>
      </div>
      <div className={card}>
        <h3 className="font-bold text-white mb-4">معاينة البطاقة</h3>
        <div className="rounded-2xl border-2 border-white/20 p-5 text-center bg-white text-black max-w-sm mx-auto">
          {settings.logo && <img src={settings.logo} alt="logo" className="h-16 mx-auto mb-2 object-contain" />}
          <h4 className="font-bold text-lg">{settings.clinicName}</h4>
          <p className="text-xs mt-1">{settings.address}</p>
          <p className="text-xs" dir="ltr">📞 {settings.phone1}{settings.phone2 ? ` / ${settings.phone2}` : ''}{settings.phone3 ? ` / ${settings.phone3}` : ''}</p>
          <div className="my-3 text-3xl font-black text-blue-600">#—</div>
          <p className="text-xs">سعر المعاينة: {settings.examFee} ريال</p>
          <hr className="my-2" />
          <p className="text-[10px]">الدوام من {settings.workStart} إلى {settings.workEnd}</p>
        </div>
      </div>
      <div className="flex justify-end"><button onClick={save} className={btnSm + ' !px-8 !py-3'}>{saved ? <Check size={18}/> : <Save size={18}/>}{saved ? 'تم الحفظ' : 'حفظ'}</button></div>
    </div>
  );
}

/* ============ RECEPTION DASHBOARD ============ */
function ReceptionDashboard({ setPage }: any) {
  const [searchName, setSearchName] = useState('');
  const [searchCard, setSearchCard] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [cards, setCards] = useState<any[]>(() => { try { return JSON.parse(localStorage.getItem('zircon_visitCards') || '[]'); } catch { return []; } });
  const [doctors, setDoctors] = useState<any[]>([]);
  const [recSettings, setRecSettings] = useState<any>(DEFAULT_RECEPTION_SETTINGS);
  const [editingCard, setEditingCard] = useState<any>(null);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [showWaiting, setShowWaiting] = useState(false);
  const [showDaily, setShowDaily] = useState(false);
  const [printCopies, setPrintCopies] = useState(1);
  const [form, setForm] = useState({ name: '', age: '', gender: 'ذكر', phone: '', doctor: '', paymentMethod: '2 - نقد', transferType: '', currency: '101 - ريال يمني', regDate: TODAY, freeRenew: false });

  useEffect(() => { localStorage.setItem('zircon_visitCards', JSON.stringify(cards)); }, [cards]);
  useEffect(() => {
    try { setDoctors(JSON.parse(localStorage.getItem('zircon_doctors') || '[]')); } catch {}
    try { setRecSettings({ ...DEFAULT_RECEPTION_SETTINGS, ...JSON.parse(localStorage.getItem(LS_RECEPTION_SETTINGS) || '{}') }); } catch {}
  }, []);

  function generateCardNumber() { const maxNum = cards.reduce((m: any, c: any) => Math.max(m, parseInt(c.cardNumber) || 5700), 5700); return (maxNum + 1).toString(); }
  function clearSearch() { setSearchName(''); setSearchCard(''); setSearchPhone(''); }
  function newCard() { setEditingCard(null); setForm({ name: '', age: '', gender: 'ذكر', phone: '', doctor: '', paymentMethod: '2 - نقد', transferType: '', currency: '101 - ريال يمني', regDate: TODAY, freeRenew: false }); }
  function editCard(c: any) { setEditingCard(c); setForm({ ...c, freeRenew: c.freeRenew || false }); }
  function pushUndo() { setUndoStack([...undoStack, JSON.parse(JSON.stringify(cards))]); }
  function saveCard() {
    if (!form.name.trim() || !form.phone.trim()) { alert('الاسم والجوال مطلوبان'); return; }
    pushUndo();
    if (editingCard) { setCards(cards.map((c: any) => c.cardNumber === editingCard.cardNumber ? { ...form, cardNumber: editingCard.cardNumber, createdAt: editingCard.createdAt, completed: editingCard.completed } : c)); alert('تم تعديل البيانات'); setEditingCard(null); }
    else { const newNum = generateCardNumber(); const newCard = { ...form, cardNumber: newNum, createdAt: new Date().toISOString(), completed: false }; setCards([newCard, ...cards]); alert(`✓ تم حفظ الحالة\nرقم بطاقة المعاينة: ${newNum}`); newCard(); }
  }
  function undo() { if (undoStack.length === 0) { alert('لا يوجد عمليات'); return; } setCards(undoStack[undoStack.length - 1]); setUndoStack(undoStack.slice(0, -1)); alert('تم التراجع'); }
  function renewCard(c: any, isFree: boolean = false) { if (!confirm(`تجديد المعاينة للمريض "${c.name}"؟`)) return; pushUndo(); setCards(cards.map((x: any) => x.cardNumber === c.cardNumber ? { ...x, lastRenew: new Date().toISOString(), completed: false, freeRenew: isFree } : x)); alert('تم تجديد المعاينة'); }
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
      <div className="flex items-center gap-3"><button onClick={() => setShowWaiting(false)} className="text-slate-400"><ArrowRight size={20}/></button><h2 className="text-xl font-bold text-white">قائمة الانتظار - {waitingCount}</h2></div>
      <div className={card + ' !p-0 overflow-hidden'}>
        <table className="w-full text-sm"><thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-3">#</th><th className="text-right px-4 py-3">رقم البطاقة</th><th className="text-right px-4 py-3">الاسم</th><th className="text-right px-4 py-3">الطبيب</th><th className="text-right px-4 py-3">التسجيل</th></tr></thead>
          <tbody className="divide-y divide-white/5">{cards.filter((c: any) => !c.completed).sort((a: any, b: any) => (a.createdAt || '').localeCompare(b.createdAt || '')).map((c: any, i: number) => (<tr key={c.cardNumber} className="hover:bg-white/5"><td className="px-4 py-2 text-white font-bold">#{i + 1}</td><td className="px-4 py-2 font-mono text-blue-300 text-xs" dir="ltr">#{c.cardNumber}</td><td className="px-4 py-2 text-white">{c.name}</td><td className="px-4 py-2 text-slate-300">{c.doctor || '—'}</td><td className="px-4 py-2 text-slate-400 text-xs">{fmtDateTime(c.createdAt)}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );

  if (showDaily) return (
    <div className="space-y-4">
      <div className="flex items-center gap-3"><button onClick={() => setShowDaily(false)} className="text-slate-400"><ArrowRight size={20}/></button><h2 className="text-xl font-bold text-white">اليومية - {TODAY}</h2></div>
      <div className="grid grid-cols-3 gap-3">
        <div className={card}><div className="text-xs text-slate-400">حالات اليوم</div><div className="text-2xl font-bold text-white mt-1">{todayCount}</div></div>
        <div className={card}><div className="text-xs text-slate-400">مكتملة</div><div className="text-2xl font-bold text-emerald-400 mt-1">{cards.filter((c: any) => c.completed && (c.createdAt || '').slice(0, 10) === TODAY).length}</div></div>
        <div className={card}><div className="text-xs text-slate-400">قيد المعالجة</div><div className="text-2xl font-bold text-amber-400 mt-1">{cards.filter((c: any) => !c.completed && (c.createdAt || '').slice(0, 10) === TODAY).length}</div></div>
      </div>
      <div className={card + ' !p-0 overflow-hidden'}>
        <table className="w-f
