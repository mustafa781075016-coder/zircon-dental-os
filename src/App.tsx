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

function ToothChart({ implants, onToothClick }: { implants: any[], onToothClick: (n:number)=>void }) {
  const implanted = new Set(implants.map((i:any)=>i.tooth_number));
  const Arch = ({ teeth, isUpper }: { teeth: number[], isUpper: boolean }) => (
    <div className="relative w-full h-[440px] md:h-[480px] mx-auto max-w-[420px]">
      <div className={`absolute left-1/2 -translate-x-1/2 w-[92%] h-[92%] border border-white/10 rounded-[50%] pointer-events-none ${isUpper ? 'top-[4%] rounded-b-none border-b-0' : 'bottom-[4%] rounded-t-none border-t-0'}`} />
      {teeth.map((n, idx) => {
        const angle = (isUpper ? 180 : 0) + 180 * (idx / (teeth.length - 1));
        const rad = (angle * Math.PI) / 180;
        const x = 50 + 43 * Math.cos(rad);
        const y = (isUpper ? 80 : 20) + 54 * Math.sin(rad);
        return (
          <div key={n} style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }} className="absolute w-[44px] h-[52px] md:w-[48px] md:h-[56px]">
            <ToothShape num={n} has={implanted.has(n)} onClick={() => onToothClick(n)} />
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
      <div className="flex gap-2 border-b border-white/10">
        {[{id:'treatments',label:'سجل المعالجات'},{id:'medical',label:'الملف الطبي'},{id:'finance',label:'سند حساب'}].map(t=><button key={t.id} onClick={()=>setActiveSub(t.id)} className={`px-4 py-2 text-sm border-b-2 ${activeSub===t.id?'border-blue-500 text-white':'border-transparent text-slate-400'}`}>{t.label}</button>)}
      </div>
      {loading ? <div className={card + ' text-center text-slate-400'}>جاري التحميل...</div> : (
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
  function sendSMS(c: any) { alert(`سيتم إرسال SMS إلى ${c.phone}\n\nرقم بطاقتك: #${c.cardNumber}\n${recSettings.clinicName}`); }

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
        <table className="w-full text-sm"><thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-3">رقم البطاقة</th><th className="text-right px-4 py-3">الاسم</th><th className="text-right px-4 py-3">الطبيب</th><th className="text-right px-4 py-3">الدفع</th><th className="text-right px-4 py-3">التاريخ</th></tr></thead>
          <tbody className="divide-y divide-white/5">{cards.filter((c: any) => (c.createdAt || '').slice(0, 10) === TODAY).map((c: any) => (<tr key={c.cardNumber} className="hover:bg-white/5"><td className="px-4 py-2 font-mono text-blue-300 text-xs" dir="ltr">#{c.cardNumber}</td><td className="px-4 py-2 text-white">{c.name}</td><td className="px-4 py-2 text-slate-300">{c.doctor || '—'}</td><td className="px-4 py-2 text-slate-300 text-xs">{c.paymentMethod}</td><td className="px-4 py-2 text-slate-400 text-xs">{fmtDateTime(c.createdAt)}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className={card}><div className="text-xs text-slate-400">حالات اليوم</div><div className="text-2xl font-bold text-white mt-1">{todayCount}</div></div>
        <div className={card}><div className="text-xs text-slate-400">قائمة الانتظار</div><div className="text-2xl font-bold text-amber-400 mt-1">{waitingCount}</div></div>
        <div className={card}><div className="text-xs text-slate-400">إجمالي الحالات</div><div className="text-2xl font-bold text-blue-400 mt-1">{cards.length}</div></div>
        <div className={card}><div className="text-xs text-slate-400">التاريخ</div><div className="text-sm font-bold text-white mt-1" dir="ltr">{new Date().toLocaleDateString('en-GB')}</div></div>
      </div>

      <div className={card}>
        <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Search size={18} className="text-blue-400"/> البحث عن حالة</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <input placeholder="اسم المريض" value={searchName} onChange={e => setSearchName(e.target.value)} className={inp} />
          <input placeholder="رقم بطاقة المعاينة" value={searchCard} onChange={e => setSearchCard(e.target.value)} className={inp} />
          <input placeholder="رقم الجوال" value={searchPhone} onChange={e => setSearchPhone(e.target.value)} className={inp} dir="ltr" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => {}} className={btnSm}><Search size={16}/> بحث</button>
          <button onClick={clearSearch} className={btnGhost}>مسح البحث</button>
          <button onClick={newCard} className={btnSm + ' !bg-emerald-600 hover:!bg-emerald-500'}><Plus size={16}/> إضافة حالة جديدة</button>
        </div>
      </div>

      <div className={card}>
        <h3 className="font-bold text-white mb-3 flex items-center gap-2">{editingCard ? <><Edit3 size={18} className="text-amber-400"/> تعديل حالة - #{editingCard.cardNumber}</> : <><Plus size={18} className="text-emerald-400"/> بيانات حالة جديدة</>}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div><label className={label}>اسم المريض *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inp} /></div>
          <div><label className={label}>العمر</label><input type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} className={inp} /></div>
          <div><label className={label}>النوع</label><select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className={inp}><option>ذكر</option><option>أنثى</option></select></div>
          <div><label className={label}>رقم التلفون *</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={inp} dir="ltr" /></div>
          <div><label className={label}>الطبيب المعالج</label><select value={form.doctor} onChange={e => setForm({ ...form, doctor: e.target.value })} className={inp}><option value="">اختر الطبيب</option>{doctors.map((d: any) => <option key={d.id} value={d.name}>{d.name}</option>)}</select></div>
          <div><label className={label}>طريقة الدفع</label><select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })} className={inp}><option>1 - آجل</option><option>2 - نقد</option></select></div>
          <div><label className={label}>نوع الحوالة</label><select value={form.transferType} onChange={e => setForm({ ...form, transferType: e.target.value })} className={inp}><option value="">—</option><option>حوالة بنكية</option><option>كاش</option><option>شيك</option></select></div>
          <div><label className={label}>العملة</label><select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} className={inp}><option>101 - ريال يمني</option><option>102 - ريال سعودي</option><option>103 - دولار</option></select></div>
          <div><label className={label}>تاريخ التسجيل</label><input type="date" value={form.regDate} onChange={e => setForm({ ...form, regDate: e.target.value })} className={inp} /></div>
        </div>
        <div className="mt-3 flex items-center gap-4 flex-wrap">
          <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer"><input type="checkbox" checked={form.freeRenew} onChange={e => setForm({ ...form, freeRenew: e.target.checked })} className="w-4 h-4" />تجديد مجاني</label>
          <label className="flex items-center gap-2 text-sm text-slate-300">النسخ:<select value={printCopies} onChange={e => setPrintCopies(Number(e.target.value))} className="rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-xs text-white"><option value={1}>كرت</option><option value={2}>كرتين</option></select></label>
        </div>
        <div className="mt-4 flex gap-2 flex-wrap">
          <button onClick={saveCard} className={btnSm + ' !px-6'}><Save size={16}/> حفظ بيانات حالة</button>
          {editingCard && <button onClick={() => printCard(editingCard)} className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold px-4 py-2.5 text-sm flex items-center gap-2"><PrinterIcon size={16}/> كرت معاينة</button>}
          {editingCard && <button onClick={() => openWhatsApp(editingCard)} className={btnSm + ' !bg-emerald-600 hover:!bg-emerald-500'}><MessageCircle size={16}/> واتساب</button>}
          {editingCard && <button onClick={() => sendSMS(editingCard)} className={btnGhost}>📱 SMS</button>}
          <button onClick={undo} disabled={undoStack.length === 0} className={btnGhost + ' disabled:opacity-40'}>↶ التراجع</button>
          <button onClick={() => setShowDaily(true)} className={btnGhost}>📊 اليومية</button>
          <button onClick={() => setShowWaiting(true)} className={btnGhost}>⏳ الانتظار ({waitingCount})</button>
          {editingCard && <button onClick={() => renewCard(editingCard, form.freeRenew)} className="rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold px-4 py-2.5 text-sm flex items-center gap-2"><RefreshCw size={16}/> تجديد</button>}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        <Filter size={14} className="text-slate-500"/><span className="text-xs text-slate-400">فلتر:</span>
        <button onClick={() => setFilter('all')} className={'px-3 py-1.5 rounded-lg text-xs transition ' + (filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-300')}>الكل ({cards.length})</button>
        <button onClick={() => setFilter('incomplete')} className={'px-3 py-1.5 rounded-lg text-xs transition ' + (filter === 'incomplete' ? 'bg-amber-600 text-white' : 'bg-white/5 text-slate-300')}>لم يكمل ({cards.filter((c: any) => !c.completed).length})</button>
        <button onClick={() => setFilter('completed')} className={'px-3 py-1.5 rounded-lg text-xs transition ' + (filter === 'completed' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-300')}>أكمل ({cards.filter((c: any) => c.completed).length})</button>
      </div>

      <div className={card + ' !p-0 overflow-hidden'}>
        <div className="p-3 border-b border-white/10"><h3 className="font-bold text-white text-sm">سجل الحالات - {filtered.length}</h3></div>
        <div className="overflow-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-3 py-3">البطاقة</th><th className="text-right px-3 py-3">الاسم</th><th className="text-right px-3 py-3">العمر</th><th className="text-right px-3 py-3">النوع</th><th className="text-right px-3 py-3">الجوال</th><th className="text-right px-3 py-3">الطبيب</th><th className="text-right px-3 py-3">التسجيل</th><th className="text-right px-3 py-3">الحالة</th><th className="text-right px-3 py-3">إجراءات</th></tr></thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? <tr><td colSpan={9} className="p-6 text-center text-slate-500">لا توجد حالات</td></tr> :
                filtered.map((c: any) => (<tr key={c.cardNumber} className="hover:bg-white/5">
                  <td className="px-3 py-2 font-mono text-blue-300 text-xs" dir="ltr">#{c.cardNumber}</td>
                  <td className="px-3 py-2 text-white">{c.name}</td>
                  <td className="px-3 py-2 text-slate-300">{c.age || '—'}</td>
                  <td className="px-3 py-2 text-slate-300">{c.gender}</td>
                  <td className="px-3 py-2 text-slate-300" dir="ltr">{c.phone}</td>
                  <td className="px-3 py-2 text-slate-300 text-xs">{c.doctor || '—'}</td>
                  <td className="px-3 py-2 text-slate-400 text-xs" dir="ltr">{fmtDateTime(c.createdAt)}</td>
                  <td className="px-3 py-2"><button onClick={() => toggleCompleted(c)} className={'text-xs px-2 py-1 rounded ' + (c.completed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300')}>{c.completed ? '✓ مكتمل' : '⏳ جاري'}</button></td>
                  <td className="px-3 py-2"><div className="flex gap-1 flex-wrap">
                    <button onClick={() => editCard(c)} className="p-1.5 rounded hover:bg-blue-500/20 text-blue-400"><Edit3 size={14}/></button>
                    <button onClick={() => printCard(c)} className="p-1.5 rounded hover:bg-purple-500/20 text-purple-400"><PrinterIcon size={14}/></button>
                    <button onClick={() => openWhatsApp(c)} className="p-1.5 rounded hover:bg-emerald-500/20 text-emerald-400"><MessageCircle size={14}/></button>
                    <button onClick={() => renewCard(c, false)} className="p-1.5 rounded hover:bg-amber-500/20 text-amber-400"><RefreshCw size={14}/></button>
                    <button onClick={() => setPage('session-booking')} className="p-1.5 rounded hover:bg-cyan-500/20 text-cyan-400"><Calendar size={14}/></button>
                  </div></td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ============ SESSION BOOKING ============ */
function SessionBooking({ setPage }: any) {
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>(() => { try { return JSON.parse(localStorage.getItem('zircon_sessions') || '[]'); } catch { return []; } });
  const [form, setForm] = useState({ patientName: '', doctor: '', date: TODAY });
  const [selectedSession, setSelectedSession] = useState<any>(null);
  useEffect(() => { localStorage.setItem('zircon_sessions', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { try { setPatients(JSON.parse(localStorage.getItem('zircon_visitCards') || '[]')); } catch {} try { setDoctors(JSON.parse(localStorage.getItem('zircon_doctors') || '[]')); } catch {} }, []);
  function bookSession() {
    if (!form.patientName || !form.doctor || !form.date) { alert('أكمل الحقول'); return; }
    const patient = patients.find((p: any) => p.name === form.patientName);
    if (sessions.find((s: any) => s.patientName === form.patientName && s.doctor === form.doctor && s.date === form.date)) { alert('يوجد حجز مسبق'); return; }
    setSessions([...sessions, { id: Date.now().toString(), patientName: form.patientName, cardNumber: patient?.cardNumber || '', doctor: form.doctor, date: form.date, createdAt: new Date().toISOString() }]);
    setForm({ ...form, patientName: '' }); alert('✓ تم حجز الجلسة');
  }
  function removeSession() { if (!selectedSession) { alert('اختر حجزاً أولاً'); return; } if (!confirm(`حذف حجز "${selectedSession.patientName}"؟`)) return; setSessions(sessions.filter((s: any) => s.id !== selectedSession.id)); setSelectedSession(null); }
  const daySessions = sessions.filter((s: any) => s.date === form.date && (!form.doctor || s.doctor === form.doctor));
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3"><button onClick={() => setPage('dashboard')} className="text-slate-400"><ArrowRight size={20}/></button><h2 className="text-xl font-bold text-white">حجز الجلسات</h2></div>
      <div className={card}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div><label className={label}>اسم المريض</label><select value={form.patientName} onChange={e => setForm({ ...form, patientName: e.target.value })} className={inp}><option value="">اختر المريض</option>{patients.map((p: any) => <option key={p.cardNumber} value={p.name}>{p.name} - #{p.cardNumber}</option>)}</select></div>
          <div><label className={label}>الطبيب</label><select value={form.doctor} onChange={e => setForm({ ...form, doctor: e.target.value })} className={inp}><option value="">اختر</option>{doctors.map((d: any) => <option key={d.id} value={d.name}>{d.name}</option>)}</select></div>
          <div><label className={label}>التاريخ</label><input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className={inp} /></div>
        </div>
        <div className="mt-4 flex gap-2 flex-wrap">
          <button onClick={bookSession} className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-2.5 text-sm flex items-center gap-2"><Check size={18}/> حجز جلسة</button>
          <button onClick={removeSession} className="rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-2.5 text-sm flex items-center gap-2"><X size={18}/> إزالة الحجز</button>
        </div>
      </div>
      <div className={card + ' !p-0 overflow-hidden'}>
        <div className="p-3 border-b border-white/10"><h3 className="font-bold text-white text-sm">حجوزات {form.date} ({daySessions.length})</h3></div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-3">البطاقة</th><th className="text-right px-4 py-3">الاسم</th><th className="text-right px-4 py-3">الطبيب</th><th className="text-right px-4 py-3">الوقت</th><th></th></tr></thead>
            <tbody className="divide-y divide-white/5">
              {daySessions.length === 0 ? <tr><td colSpan={5} className="p-6 text-center text-slate-500">لا توجد حجوزات</td></tr> :
                daySessions.map((s: any) => (<tr key={s.id} onClick={() => setSelectedSession(s)} className={'cursor-pointer ' + (selectedSession?.id === s.id ? 'bg-blue-500/10' : 'hover:bg-white/5')}>
                  <td className="px-4 py-2 font-mono text-blue-300 text-xs" dir="ltr">#{s.cardNumber}</td>
                  <td className="px-4 py-2 text-white">{s.patientName}</td>
                  <td className="px-4 py-2 text-slate-300">{s.doctor}</td>
                  <td className="px-4 py-2 text-slate-400 text-xs" dir="ltr">{new Date(s.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="px-4 py-2">{selectedSession?.id === s.id && <span className="text-xs text-blue-400 font-bold">✓ محدد</span>}</td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
/* ============ DASHBOARD ============ */
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
  const Stat = ({ icon: Icon, lbl, value, tone }: any) => (
    <div className={card}><div className={'h-10 w-10 rounded-xl grid place-items-center mb-3 ' + tone}><Icon size={20} /></div><div className="text-2xl font-bold text-white">{value}</div><div className="text-sm text-slate-400 mt-1">{lbl}</div></div>
  );
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h2 className="text-2xl font-bold text-white">لوحة تحكم الزراعة</h2><p className="text-slate-400 mt-1 text-sm">متابعة حالات زراعة الاسنان</p></div>
        <div className="flex gap-2 flex-wrap"><button onClick={() => setPage('patient-new')} className={btnSm}><Plus size={16}/> مريض</button><button onClick={() => setPage('appointment-new')} className={btnSm}><Plus size={16}/> موعد</button><button onClick={() => setPage('surgery-new')} className={btnSm}><Plus size={16}/> جراحة</button></div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Stat icon={Users} lbl="اجمالي المرضى" value={stats.patients} tone="bg-blue-500/20 text-blue-300" />
        <Stat icon={Calendar} lbl="مواعيد اليوم" value={stats.today} tone="bg-emerald-500/20 text-emerald-300" />
        <Stat icon={Clock} lbl="متابعات قادمة" value={stats.followups} tone="bg-amber-500/20 text-amber-300" />
        <Stat icon={Stethoscope} lbl="الجراحات هذا الشهر" value={stats.surgeries} tone="bg-purple-500/20 text-purple-300" />
        <Stat icon={Syringe} lbl="اجمالي الزرعات" value={stats.implants} tone="bg-cyan-500/20 text-cyan-300" />
        <Stat icon={DollarSign} lbl="مبالغ غير مدفوعة" value={`${stats.unpaid.toLocaleString()} ر.س`} tone="bg-red-500/20 text-red-300" />
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className={card}><h3 className="font-semibold text-white mb-4">احدث المرضى</h3><div className="space-y-2">{recent.map((p:any) => (<div key={p.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0"><div className="h-9 w-9 rounded-full bg-blue-500/20 text-blue-300 grid place-items-center text-sm font-semibold">{p.full_name?.charAt(0)}</div><div className="flex-1 min-w-0"><div className="text-sm text-white truncate">{p.full_name}</div><div className="text-xs text-slate-400" dir="ltr">{p.patient_code}</div></div><a href={`https://wa.me/${p.phone?.replace(/\D/g,'')}`} target="_blank" className="text-emerald-400"><MessageCircle size={16}/></a></div>))}</div></div>
        <div className={card}><h3 className="font-semibold text-white mb-4">مواعيد اليوم</h3><div className="space-y-2">{todayAppts.length===0 ? <p className="text-sm text-slate-500">لا توجد مواعيد</p> : todayAppts.map((a:any) => (<div key={a.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0"><div className="text-sm font-semibold text-blue-300 w-14" dir="ltr">{new Date(a.scheduled_start).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div><div className="flex-1 text-sm text-white truncate">{a.patient?.full_name}</div></div>))}</div></div>
        <div className={card + ' border-amber-500/20'}><h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Clock size={16} className="text-amber-400"/> متابعات</h3><div className="space-y-2">{upcomingFollowups.length===0 ? <p className="text-sm text-slate-500">لا توجد</p> : upcomingFollowups.map((f:any) => (<div key={f.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0"><div className="flex-1 min-w-0"><div className="text-sm text-white truncate">{f.patient?.full_name}</div><div className="text-xs text-slate-400">{f.follow_type} - {fmtDate(f.scheduled_date)}</div></div><a href={`https://wa.me/${f.patient?.phone?.replace(/\D/g,'')}`} target="_blank" className="h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-300 grid place-items-center"><MessageCircle size={14}/></a></div>))}</div></div>
      </div>
    </div>
  );
}

/* ============ PATIENTS ============ */
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
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-3">الكود</th><th className="text-right px-4 py-3">الاسم</th><th className="text-right px-4 py-3">الجوال</th><th className="text-right px-4 py-3">اجراءات</th></tr></thead>
            <tbody className="divide-y divide-white/5">
              {list.map((p:any) => (<tr key={p.id} className="hover:bg-white/5">
                <td className="px-4 py-3 font-mono text-blue-300 text-xs" dir="ltr">{p.patient_code}</td>
                <td className="px-4 py-3 text-white font-medium"><button onClick={()=>{ setSelectedPatient(p); setPage('patient-detail'); }} className="hover:text-blue-400">{p.full_name}</button></td>
                <td className="px-4 py-3 text-slate-300" dir="ltr">{p.phone}</td>
                <td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => { setEditItem(p); setPage('patient-new'); }} className="text-blue-400"><Edit3 size={16}/></button><button onClick={() => del(p.id)} className="text-red-400"><Trash2 size={16}/></button></div></td>
              </tr>))}
            </tbody>
          </table></div>
        )}
      </div>
    </div>
  );
}

function PatientForm({ patient, onSave, onCancel }: any) {
  const isEdit = !!patient?.id;
  const [form, setForm] = useState({ full_name: patient?.full_name || '', phone: patient?.phone || '', medical_alerts: patient?.medical_alerts || '', notes: patient?.notes || '', gender: patient?.gender || '', date_of_birth: patient?.date_of_birth || '' });
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
      <div className={card}><div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label><span className={label}>الاسم *</span><input className={inp} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required /></label>
        <label><span className={label}>الجوال *</span><input className={inp} dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></label>
        <label><span className={label}>الجنس</span><select className={inp} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}><option value="">—</option><option value="male">ذكر</option><option value="female">انثى</option></select></label>
        <label><span className={label}>تاريخ الميلاد</span><input className={inp} type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} /></label>
        <label className="md:col-span-2"><span className={label}>تنبيهات طبية</span><textarea className={inp} rows={2} value={form.medical_alerts} onChange={(e) => setForm({ ...form, medical_alerts: e.target.value })} /></label>
      </div></div>
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
  function handleToothClick(tooth: number) { setSelectedTooth(tooth); if (surgeries.length===0) { alert('انشئ جراحة اولا'); return; } setShowImplantModal(true); }
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
          {[{id:'overview', label:'نظرة عامة'},{id:'chart', label:`مخطط (${implants.length})`},{id:'treatments', label:`معالجات (${treatments.length})`},{id:'surgeries', label:`جراحات (${surgeries.length})`},{id:'followups', label:`متابعات (${followups.length})`}].map(t=><button key={t.id} onClick={() => setTab(t.id)} className={'px-4 py-2.5 text-sm border-b-2 whitespace-nowrap ' + (tab === t.id ? 'border-blue-500 text-white' : 'border-transparent text-slate-400')}>{t.label}</button>)}
        </div>
      </div>
      {tab==='overview' && <div className={card}><div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-white/5 p-3"><div className="text-xl font-bold text-white">{surgeries.length}</div><div className="text-xs text-slate-400">جراحات</div></div>
        <div className="rounded-xl bg-white/5 p-3"><div className="text-xl font-bold text-emerald-400">{implants.length}</div><div className="text-xs text-slate-400">زرعات</div></div>
        <div className="rounded-xl bg-white/5 p-3"><div className="text-xl font-bold text-amber-400">{followups.length}</div><div className="text-xs text-slate-400">متابعات</div></div>
      </div></div>}
      {tab==='chart' && <div className="space-y-4">
        <ToothChart implants={implants} onToothClick={handleToothClick}/>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{implants.map((im:any)=><div key={im.id} className={card}><div className="flex justify-between"><span className="text-2xl font-bold text-emerald-400">{im.tooth_number}</span><span className="text-xs px-2 py-1 rounded bg-emerald-500/20 text-emerald-300">{im.status}</span></div><div className="text-sm text-white mt-1">{im.brand}</div><div className="text-xs text-slate-400 mt-1" dir="ltr">{im.diameter_mm} x {im.length_mm} mm</div></div>)}</div>
      </div>}
      {tab==='treatments' && <div className={card + ' !p-0 overflow-hidden'}>
        <div className="p-4 font-bold text-white">سجل المعالجات - {treatments.length}</div>
        <div className="overflow-auto"><table className="w-full text-sm">
          <thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-3">المعالجة</th><th className="text-right px-4 py-3">الطبيب</th><th className="text-right px-4 py-3">السعر</th><th className="text-right px-4 py-3">السن</th><th className="text-right px-4 py-3">الحالة</th></tr></thead>
          <tbody className="divide-y divide-white/5">{treatments.length===0 ? <tr><td colSpan={5} className="p-6 text-center text-slate-500">لا توجد معالجات</td></tr> :
            treatments.map((tr:any)=><tr key={tr.id} className="hover:bg-white/5"><td className="px-4 py-2 text-white">{tr.treatment_type}</td><td className="px-4 py-2 text-slate-300">{tr.doctor_name||'—'}</td><td className="px-4 py-2 text-emerald-400">{tr.cost} ر.س</td><td className="px-4 py-2 text-emerald-300">🦷 {tr.tooth_number}</td><td className="px-4 py-2"><span className={`text-xs px-2 py-1 rounded ${tr.status==='completed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>{tr.status}</span></td></tr>)}
          </tbody>
        </table></div>
      </div>}
      {tab==='surgeries' && <div className="space-y-3">{surgeries.map((s:any)=><div key={s.id} className={card + ' flex justify-between items-center'}><div><div className="text-white font-medium">{s.surgery_type} - {fmtDate(s.scheduled_date)}</div><div className="text-xs text-slate-400">{s.status}</div></div></div>)}</div>}
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

/* ============ SURGERIES ============ */
function Surgeries({ setPage, setSelectedPatient }: any) {
  const [list, setList] = useState<any[]>([]);
  useEffect(()=>{ (async()=>{ const {data}=await supabase.from('surgeries').select('*, patient:patients(full_name)').order('created_at',{ascending:false}).limit(100); setList(data||[]); })(); },[]);
  return (
    <div className="space-y-4">
      <div className="flex justify-between"><h2 className="text-xl font-bold text-white">الجراحات</h2><button onClick={()=>setPage('surgery-new')} className={btnSm}><Plus size={16}/> جراحة جديدة</button></div>
      <div className={card + ' !p-0 overflow-hidden'}>
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-3">التاريخ</th><th className="text-right px-4 py-3">المريض</th><th className="text-right px-4 py-3">النوع</th></tr></thead>
          <tbody className="divide-y divide-white/5">
            {list.map((s:any)=><tr key={s.id} className="hover:bg-white/5"><td className="px-4 py-3 text-slate-300 text-xs">{fmtDate(s.scheduled_date)}</td><td className="px-4 py-3 text-white"><button onClick={()=>{ setSelectedPatient(s.patient); setPage('patient-detail'); }} className="text-blue-400">{s.patient?.full_name}</button></td><td className="px-4 py-3 text-slate-300 text-xs">{s.surgery_type}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============ APPOINTMENTS ============ */
function Appointments({ setPage }: any) {
  const [list, setList] = useState<any[]>([]);
  useEffect(()=>{ (async()=>{ const {data}=await supabase.from('appointments').select('*, patient:patients(full_name)').order('scheduled_start',{ascending:false}).limit(100); setList(data||[]); })(); },[]);
  return (
    <div className="space-y-4">
      <div className="flex justify-between"><h2 className="text-xl font-bold text-white">المواعيد</h2><button onClick={()=>setPage('appointment-new')} className={btnSm}><Plus size={16}/> موعد جديد</button></div>
      <div className={card + ' !p-0 overflow-hidden'}>
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-3">التاريخ</th><th className="text-right px-4 py-3">المريض</th><th className="text-right px-4 py-3">النوع</th></tr></thead>
          <tbody className="divide-y divide-white/5">
            {list.map((a:any)=><tr key={a.id} className="hover:bg-white/5"><td className="px-4 py-3 text-slate-300 text-xs">{fmtDateTime(a.scheduled_start)}</td><td className="px-4 py-3 text-white">{a.patient?.full_name}</td><td className="px-4 py-3 text-slate-300 text-xs">{a.appointment_type}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AppointmentForm({ onSave, onCancel }: any) {
  const [patients, setPatients] = useState<any[]>([]);
  const [patientId, setPatientId] = useState('');
  const [type, setType] = useState('consultation');
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [time, setTime] = useState('10:00');
  useEffect(()=>{ supabase.from('patients').select('id, full_name').limit(50).then(({data})=>setPatients(data||[])); },[]);
  async function submit(e:any){
    e.preventDefault(); const start=new Date(`${date}T${time}`);
    const {data:u}=await supabase.auth.getUser();
    await supabase.from('appointments').insert({ patient_id: patientId, doctor_id: u?.user?.id, appointment_type: type, status:'scheduled', scheduled_start: start.toISOString(), duration_minutes:30 });
    onSave();
  }
  return (
    <form onSubmit={submit} className="space-y-4 max-w-xl">
      <h2 className="text-xl font-bold text-white">حجز موعد جديد</h2>
      <div className={card + ' space-y-4'}>
        <label><span className={label}>المريض *</span><select className={inp} value={patientId} onChange={e=>setPatientId(e.target.value)} required><option value="">اختر مريض</option>{patients.map((p:any)=><option key={p.id} value={p.id}>{p.full_name}</option>)}</select></label>
        <label><span className={label}>النوع</span><select className={inp} value={type} onChange={e=>setType(e.target.value)}><option value="consultation">استشارة</option><option value="implant_surgery">جراحة زراعة</option><option value="follow_up">متابعة</option></select></label>
        <div className="grid grid-cols-2 gap-4">
          <label><span className={label}>التاريخ</span><input type="date" value={date} onChange={e=>setDate(e.target.value)} className={inp}/></label>
          <label><span className={label}>الوقت</span><input type="time" value={time} onChange={e=>setTime(e.target.value)} className={inp}/></label>
        </div>
      </div>
      <div className="flex gap-2"><button type="submit" className={btnSm}>حفظ الموعد</button><button type="button" onClick={onCancel} className={btnGhost}>الغاء</button></div>
    </form>
  );
}

/* ============ SURGERY FORM ============ */
function SurgeryForm({ onSave, onCancel }: any) {
  const [patients, setPatients] = useState<any[]>([]);
  const [patientId, setPatientId] = useState('');
  const [type, setType] = useState('single_implant');
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  useEffect(()=>{ supabase.from('patients').select('id, full_name').limit(50).then(({data})=>setPatients(data||[])); },[]);
  async function submit(e:any){
    e.preventDefault(); const {data:u}=await supabase.auth.getUser();
    const {error}=await supabase.from('surgeries').insert({ patient_id: patientId, doctor_id: u?.user?.id, surgery_type: type, status:'planned', scheduled_date: new Date(date).toISOString() });
    if(error){ alert(error.message); return; }
    onSave();
  }
  return (
    <form onSubmit={submit} className="space-y-4 max-w-xl">
      <h2 className="text-xl font-bold text-white">جراحة جديدة</h2>
      <div className={card + ' space-y-4'}>
        <label><span className={label}>المريض *</span><select className={inp} value={patientId} onChange={e=>setPatientId(e.target.value)} required><option value="">اختر مريض</option>{patients.map((p:any)=><option key={p.id} value={p.id}>{p.full_name}</option>)}</select></label>
        <label><span className={label}>نوع الجراحة</span><select className={inp} value={type} onChange={e=>setType(e.target.value)}><option value="single_implant">زرعة واحدة</option><option value="multiple_implants">زرعات متعددة</option><option value="full_arch">قوس كامل</option></select></label>
        <label><span className={label}>التاريخ</span><input type="date" value={date} onChange={e=>setDate(e.target.value)} className={inp}/></label>
      </div>
      <div className="flex gap-2"><button type="submit" className={btnSm}>انشاء الجراحة</button><button type="button" onClick={onCancel} className={btnGhost}>الغاء</button></div>
    </form>
  );
}

/* ============ IMPLANT MODAL ============ */
function ImplantModal({ surgeryId, patientId, initialTooth, onClose, onSave }: any) {
  const [form, setForm] = useState({ tooth_number: initialTooth||11, brand: 'Straumann', diameter_mm: '4.1', length_mm: '10', torque_ncm: '35', bone_density: 'D2' });
  const [loading, setLoading] = useState(false);
  async function submit(e:any){
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.from('implants').insert({ patient_id: patientId, surgery_id: surgeryId, tooth_number: form.tooth_number, status:'placed', brand: form.brand, diameter_mm: Number(form.diameter_mm), length_mm: Number(form.length_mm), torque_ncm: Number(form.torque_ncm), bone_density: form.bone_density, placed_at: new Date().toISOString() });
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

/* ============ IMPLANTS LIST ============ */
function Implants() {
  const [list, setList] = useState<any[]>([]);
  useEffect(()=>{ supabase.from('implants').select('*, patient:patients(full_name)').order('created_at',{ascending:false}).limit(100).then(({data})=>setList(data||[])); },[]);
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">سجل الزرعات - {list.length}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((im:any)=><div key={im.id} className={card}><div className="text-2xl font-bold text-emerald-400">{im.tooth_number}</div><div className="text-white text-sm">{im.patient?.full_name}</div><div className="text-xs text-slate-400">{im.brand} - {im.diameter_mm}x{im.length_mm}mm</div></div>)}
      </div>
    </div>
  );
}

/* ============ REPORTS ============ */
function Reports() {
  const [stats, setStats] = useState({ patients:0, surgeries:0, implants:0, treatments:0 });
  useEffect(()=>{ (async()=>{
    const [p,s,i,t]=await Promise.all([
      supabase.from('patients').select('*',{count:'exact', head:true}),
      supabase.from('surgeries').select('*',{count:'exact', head:true}),
      supabase.from('implants').select('*',{count:'exact', head:true}),
      supabase.from('treatments').select('*',{count:'exact', head:true}),
    ]);
    setStats({ patients: p.count||0, surgeries: s.count||0, implants: i.count||0, treatments: t.count||0 });
  })(); },[]);
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">التقارير</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className={card}><div className="text-2xl font-bold text-white">{stats.patients}</div><div className="text-sm text-slate-400">المرضى</div></div>
        <div className={card}><div className="text-2xl font-bold text-purple-400">{stats.surgeries}</div><div className="text-sm text-slate-400">الجراحات</div></div>
        <div className={card}><div className="text-2xl font-bold text-emerald-400">{stats.implants}</div><div className="text-sm text-slate-400">الزرعات</div></div>
        <div className={card}><div className="text-2xl font-bold text-blue-400">{stats.treatments}</div><div className="text-sm text-slate-400">المعالجات</div></div>
      </div>
    </div>
  );
}
/* ============ MARKETING ============ */
const LS_CAMPAIGNS = 'zircon.marketing.campaigns.v2';
const LS_LEADS = 'zircon.marketing.leads.v2';

function loadLS(key: string, def: any = []): any {
  try { return JSON.parse(localStorage.getItem(key) || 'null') || def; } catch { return def; }
}
function saveLS(key: string, val: any) { localStorage.setItem(key, JSON.stringify(val)); }

const LEAD_SOURCES = [
  { id: 'facebook', label: 'فيسبوك', color: 'bg-blue-500/20 text-blue-300', icon: '📘' },
  { id: 'instagram', label: 'إنستغرام', color: 'bg-pink-500/20 text-pink-300', icon: '📸' },
  { id: 'tiktok', label: 'تيك توك', color: 'bg-slate-500/20 text-slate-200', icon: '🎵' },
  { id: 'snapchat', label: 'سناب شات', color: 'bg-yellow-500/20 text-yellow-300', icon: '👻' },
  { id: 'google', label: 'جوجل', color: 'bg-amber-500/20 text-amber-300', icon: '🔍' },
  { id: 'whatsapp', label: 'واتساب', color: 'bg-emerald-500/20 text-emerald-300', icon: '💬' },
  { id: 'referral', label: 'توصية', color: 'bg-purple-500/20 text-purple-300', icon: '🤝' },
  { id: 'walk_in', label: 'زيارة مباشرة', color: 'bg-cyan-500/20 text-cyan-300', icon: '🚶' },
  { id: 'phone', label: 'اتصال هاتفي', color: 'bg-indigo-500/20 text-indigo-300', icon: '📞' },
  { id: 'other', label: 'أخرى', color: 'bg-slate-500/20 text-slate-300', icon: '📌' },
];

const CAMPAIGN_STATUS: Record<string, [string, string]> = {
  active: ['نشطة', 'bg-emerald-500/20 text-emerald-300'],
  paused: ['متوقفة', 'bg-amber-500/20 text-amber-300'],
  completed: ['منتهية', 'bg-blue-500/20 text-blue-300'],
  draft: ['مسودة', 'bg-slate-500/20 text-slate-300'],
};

const LEAD_STATUS: Record<string, [string, string]> = {
  new: ['جديد', 'bg-blue-500/20 text-blue-300'],
  contacted: ['تم التواصل', 'bg-amber-500/20 text-amber-300'],
  booked: ['حجز موعد', 'bg-purple-500/20 text-purple-300'],
  converted: ['تحوّل لمريض', 'bg-emerald-500/20 text-emerald-300'],
  lost: ['فقد', 'bg-red-500/20 text-red-300'],
};

function Marketing() {
  const [campaigns, setCampaigns] = useState<any[]>(() => loadLS(LS_CAMPAIGNS));
  const [leads, setLeads] = useState<any[]>(() => loadLS(LS_LEADS));
  const [tab, setTab] = useState('overview');
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [editCampaign, setEditCampaign] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [p, surg, imp] = await Promise.all([
        supabase.from('patients').select('id, full_name, phone, created_at').order('created_at', { ascending: false }).limit(500),
        supabase.from('surgeries').select('id, created_at'),
        supabase.from('implants').select('id, created_at'),
      ]);
      setPatients(p.data || []);
      const now = new Date();
      const mStart = new Date(now.getFullYear(), now.getMonth(), 1);
      setStats([
        { label: 'مرضى هذا الشهر', value: (p.data || []).filter((x: any) => new Date(x.created_at) >= mStart).length },
        { label: 'جراحات هذا الشهر', value: (surg.data || []).filter((x: any) => new Date(x.created_at) >= mStart).length },
        { label: 'زرعات هذا الشهر', value: (imp.data || []).filter((x: any) => new Date(x.created_at) >= mStart).length },
      ]);
      setLoading(false);
    })();
  }, []);

  function persistCampaigns(next: any[]) { setCampaigns(next); saveLS(LS_CAMPAIGNS, next); }
  function persistLeads(next: any[]) { setLeads(next); saveLS(LS_LEADS, next); }
  function addOrUpdateCampaign(c: any) { if (c.id) persistCampaigns(campaigns.map((x: any) => (x.id === c.id ? c : x))); else persistCampaigns([{ ...c, id: crypto.randomUUID(), created_at: new Date().toISOString() }, ...campaigns]); setShowCampaignModal(false); setEditCampaign(null); }
  function delCampaign(id: string) { if (!confirm('حذف الحملة؟')) return; persistCampaigns(campaigns.filter((x: any) => x.id !== id)); }
  function addLead(l: any) { persistLeads([{ ...l, id: crypto.randomUUID(), created_at: new Date().toISOString() }, ...leads]); setShowLeadModal(false); }
  function delLead(id: string) { if (!confirm('حذف العميل؟')) return; persistLeads(leads.filter((x: any) => x.id !== id)); }
  function updateLeadStatus(id: string, status: string) { persistLeads(leads.map((l: any) => (l.id === id ? { ...l, status } : l))); }

  const totalBudget = campaigns.reduce((s, c) => s + (Number(c.budget) || 0), 0);
  const totalSpent = campaigns.reduce((s, c) => s + (Number(c.spent) || 0), 0);
  const activeCampaigns = campaigns.filter((c) => c.status === 'active').length;
  const convertedLeads = leads.filter((l) => l.status === 'converted').length;
  const conversionRate = leads.length > 0 ? Math.round((convertedLeads / leads.length) * 100) : 0;

  const Stat = ({ icon: Icon, lbl, value, tone, sub }: any) => (
    <div className={card}><div className={'h-10 w-10 rounded-xl grid place-items-center mb-3 ' + tone}><Icon size={20} /></div><div className="text-2xl font-bold text-white">{value}</div><div className="text-sm text-slate-400 mt-1">{lbl}</div>{sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}</div>
  );

  return (
    <div className="space-y-5">
      <div><h2 className="text-xl font-bold text-white flex items-center gap-2"><Megaphone size={22} className="text-blue-400"/> إدارة التسويق</h2><p className="text-slate-400 text-xs mt-1">إدارة الحملات والعملاء المحتملين</p></div>
      <div className="border-b border-white/10 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {[{ id: 'overview', label: 'نظرة عامة' }, { id: 'campaigns', label: `الحملات (${campaigns.length})` }, { id: 'leads', label: `عملاء (${leads.length})` }, { id: 'sources', label: 'المصادر' }, { id: 'funnel', label: 'قمع التحويل' }].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={'px-4 py-2.5 text-sm whitespace-nowrap border-b-2 transition ' + (tab === t.id ? 'border-blue-500 text-white' : 'border-transparent text-slate-400 hover:text-white')}>{t.label}</button>
          ))}
        </div>
      </div>
      {tab === 'overview' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat icon={Megaphone} lbl="الحملات النشطة" value={activeCampaigns} tone="bg-blue-500/20 text-blue-300" sub={`من ${campaigns.length}`} />
            <Stat icon={Users} lbl="العملاء المحتملون" value={leads.length} tone="bg-emerald-500/20 text-emerald-300" />
            <Stat icon={Target} lbl="معدل التحويل" value={`${conversionRate}%`} tone="bg-amber-500/20 text-amber-300" sub={`${convertedLeads} متحوّل`} />
            <Stat icon={DollarSign} lbl="الميزانية المتبقية" value={`${(totalBudget - totalSpent).toLocaleString()} ر.س`} tone="bg-purple-500/20 text-purple-300" />
          </div>
          <div className="grid lg:grid-cols-2 gap-5">
            <div className={card}><h3 className="font-semibold text-white mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-emerald-400"/> أداء العيادة</h3>
              {loading ? <p className="text-sm text-slate-500">جاري التحميل...</p> : (<div className="space-y-3">{stats.map((s, i) => (<div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0"><span className="text-sm text-slate-300">{s.label}</span><span className="text-lg font-bold text-white" dir="ltr">{s.value}</span></div>))}</div>)}
            </div>
            <div className={card}><h3 className="font-semibold text-white mb-4">آخر الحملات</h3>
              {campaigns.length === 0 ? <p className="text-sm text-slate-500">لا توجد حملات</p> : (<div className="space-y-2">{campaigns.slice(0, 5).map((c: any) => { const st = CAMPAIGN_STATUS[c.status] || CAMPAIGN_STATUS.draft; return (<div key={c.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0"><div className="flex-1 min-w-0"><div className="text-sm text-white truncate">{c.name}</div><div className="text-xs text-slate-400 mt-0.5">{c.channel || '—'} · {fmtDate(c.start_date)}</div></div><span className={'text-[10px] px-2 py-0.5 rounded border border-white/10 ' + st[1]}>{st[0]}</span></div>); })}</div>)}
            </div>
          </div>
        </div>
      )}
      {tab === 'campaigns' && (
        <div className="space-y-4">
          <div className="flex justify-end"><button onClick={() => { setEditCampaign(null); setShowCampaignModal(true); }} className={btnSm}><Plus size={16}/> حملة جديدة</button></div>
          <div className={card + ' !p-0 overflow-hidden'}>
            {campaigns.length === 0 ? <div className="p-8 text-center text-slate-400">لا توجد حملات</div> : (
              <div className="overflow-auto"><table className="w-full text-sm min-w-[700px]">
                <thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-3">الاسم</th><th className="text-right px-4 py-3">القناة</th><th className="text-right px-4 py-3">الميزانية</th><th className="text-right px-4 py-3">المصروف</th><th className="text-right px-4 py-3">المتبقي</th><th className="text-right px-4 py-3">الحالة</th><th className="text-right px-4 py-3">إجراءات</th></tr></thead>
                <tbody className="divide-y divide-white/5">
                  {campaigns.map((c: any) => { const st = CAMPAIGN_STATUS[c.status] || CAMPAIGN_STATUS.draft; const remaining = (Number(c.budget) || 0) - (Number(c.spent) || 0); return (<tr key={c.id} className="hover:bg-white/5"><td className="px-4 py-3 text-white">{c.name}</td><td className="px-4 py-3 text-slate-300 text-xs">{c.channel || '—'}</td><td className="px-4 py-3 text-slate-300 text-xs" dir="ltr">{(Number(c.budget) || 0).toLocaleString()}</td><td className="px-4 py-3 text-amber-300 text-xs" dir="ltr">{(Number(c.spent) || 0).toLocaleString()}</td><td className={'px-4 py-3 text-xs ' + (remaining < 0 ? 'text-red-300' : 'text-emerald-300')} dir="ltr">{remaining.toLocaleString()}</td><td className="px-4 py-3"><span className={'text-[11px] px-2 py-1 rounded-md border border-white/10 ' + st[1]}>{st[0]}</span></td><td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => { setEditCampaign(c); setShowCampaignModal(true); }} className="text-blue-400"><Edit3 size={15}/></button><button onClick={() => delCampaign(c.id)} className="text-red-400"><Trash2 size={15}/></button></div></td></tr>); })}
                </tbody>
              </table></div>
            )}
          </div>
        </div>
      )}
      {tab === 'leads' && (
        <div className="space-y-4">
          <div className="flex justify-end"><button onClick={() => setShowLeadModal(true)} className={btnSm}><Plus size={16}/> عميل محتمل</button></div>
          <div className={card + ' !p-0 overflow-hidden'}>
            {leads.length === 0 ? <div className="p-8 text-center text-slate-400">لا يوجد عملاء</div> : (
              <div className="overflow-auto"><table className="w-full text-sm min-w-[800px]">
                <thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-3">الاسم</th><th className="text-right px-4 py-3">الجوال</th><th className="text-right px-4 py-3">المصدر</th><th className="text-right px-4 py-3">الحالة</th><th className="text-right px-4 py-3">ملاحظات</th><th className="text-right px-4 py-3">إجراءات</th></tr></thead>
                <tbody className="divide-y divide-white/5">
                  {leads.map((l: any) => { const src = LEAD_SOURCES.find((s) => s.id === l.source) || LEAD_SOURCES[LEAD_SOURCES.length - 1]; const st = LEAD_STATUS[l.status] || LEAD_STATUS.new; return (<tr key={l.id} className="hover:bg-white/5"><td className="px-4 py-3 text-white">{l.name}</td><td className="px-4 py-3 text-slate-300" dir="ltr"><div className="flex items-center gap-2"><span>{l.phone || '—'}</span>{l.phone && <a href={`https://wa.me/${l.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-400"><MessageCircle size={14}/></a>}</div></td><td className="px-4 py-3"><span className={'text-[11px] px-2 py-1 rounded ' + src.color}>{src.icon} {src.label}</span></td><td className="px-4 py-3"><select value={l.status || 'new'} onChange={(e) => updateLeadStatus(l.id, e.target.value)} className={'text-[11px] px-2 py-1 rounded border border-white/10 bg-transparent ' + st[1]}>{Object.entries(LEAD_STATUS).map(([k, v]) => <option key={k} value={k} className="bg-slate-800">{v[0]}</option>)}</select></td><td className="px-4 py-3 text-slate-400 text-xs max-w-[180px] truncate">{l.notes || '—'}</td><td className="px-4 py-3"><button onClick={() => delLead(l.id)} className="text-red-400"><Trash2 size={15}/></button></td></tr>); })}
                </tbody>
              </table></div>
            )}
          </div>
        </div>
      )}
      {tab === 'sources' && (
        <div className={card}><h3 className="font-semibold text-white mb-4 flex items-center gap-2"><BarChart3 size={18} className="text-blue-400"/> المصادر</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{LEAD_SOURCES.map((s) => { const leadCount = leads.filter((l: any) => l.source === s.id).length; return (<div key={s.id} className="rounded-xl border border-white/10 bg-white/[.02] p-4 flex items-center justify-between"><div className="flex items-center gap-3"><span className="text-2xl">{s.icon}</span><span className={'text-sm px-2 py-1 rounded ' + s.color}>{s.label}</span></div><div className="text-right"><div className="text-xl font-bold text-white" dir="ltr">{leadCount}</div><div className="text-[10px] text-slate-500">عميل</div></div></div>); })}</div>
        </div>
      )}
      {tab === 'funnel' && (
        <div className={card}><h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Target size={18} className="text-amber-400"/> قمع التحويل</h3>
          <div className="space-y-3">{[{ key: 'new', label: 'عملاء جدد', color: 'from-blue-500 to-blue-600' }, { key: 'contacted', label: 'تم التواصل', color: 'from-amber-500 to-amber-600' }, { key: 'booked', label: 'حجز موعد', color: 'from-purple-500 to-purple-600' }, { key: 'converted', label: 'تحوّلوا لمرضى', color: 'from-emerald-500 to-emerald-600' }, { key: 'lost', label: 'فقدوا', color: 'from-red-500 to-red-600' }].map((stage) => { const count = leads.filter((l: any) => (l.status || 'new') === stage.key).length; const pct = leads.length > 0 ? Math.round((count / leads.length) * 100) : 0; return (<div key={stage.key}><div className="flex justify-between text-xs mb-1.5"><span className="text-slate-300">{stage.label}</span><span className="text-white font-bold" dir="ltr">{count} ({pct}%)</span></div><div className="h-3 rounded-full bg-white/5 overflow-hidden"><div className={`h-full bg-gradient-to-l ${stage.color}`} style={{ width: `${pct}%` }} /></div></div>); })}</div>
        </div>
      )}
      {showCampaignModal && <CampaignModal campaign={editCampaign} onClose={() => { setShowCampaignModal(false); setEditCampaign(null); }} onSave={addOrUpdateCampaign} />}
      {showLeadModal && <LeadModal onClose={() => setShowLeadModal(false)} onSave={addLead} />}
    </div>
  );
}

function CampaignModal({ campaign, onClose, onSave }: any) {
  const [form, setForm] = useState({ name: campaign?.name || '', channel: campaign?.channel || '', budget: campaign?.budget || '', spent: campaign?.spent || '', status: campaign?.status || 'active', start_date: campaign?.start_date || new Date().toISOString().slice(0, 10), end_date: campaign?.end_date || '', notes: campaign?.notes || '' });
  const [err, setErr] = useState('');
  function submit(e: any) { e.preventDefault(); if (!form.name.trim()) { setErr('اسم الحملة مطلوب'); return; } onSave({ ...campaign, ...form }); }
  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md grid place-items-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a1028] my-8">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10"><h3 className="text-white font-semibold flex items-center gap-2"><Megaphone size={18} className="text-blue-400"/> {campaign ? 'تعديل' : 'حملة جديدة'}</h3><button onClick={onClose} className="text-slate-400"><X size={18}/></button></div>
        <form onSubmit={submit} className="p-5 space-y-4">
          <label><span className={label}>اسم الحملة *</span><input className={inp} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label><span className={label}>القناة</span><select className={inp} value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })}><option value="">—</option>{LEAD_SOURCES.map((s) => <option key={s.id} value={s.label}>{s.icon} {s.label}</option>)}</select></label>
          <div className="grid grid-cols-2 gap-3">
            <label><span className={label}>الميزانية</span><input type="number" className={inp} value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} /></label>
            <label><span className={label}>المصروف</span><input type="number" className={inp} value={form.spent} onChange={(e) => setForm({ ...form, spent: e.target.value })} /></label>
          </div>
          <label><span className={label}>الحالة</span><select className={inp} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{Object.entries(CAMPAIGN_STATUS).map(([k, v]) => <option key={k} value={k}>{v[0]}</option>)}</select></label>
          <div className="grid grid-cols-2 gap-3">
            <label><span className={label}>من</span><input type="date" className={inp} value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></label>
            <label><span className={label}>إلى</span><input type="date" className={inp} value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} /></label>
          </div>
          <label><span className={label}>ملاحظات</span><textarea rows={2} className={inp} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
          {err && <div className="rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3">{err}</div>}
          <div className="flex justify-end gap-2 pt-2 border-t border-white/10"><button type="button" onClick={onClose} className={btnGhost}>إلغاء</button><button type="submit" className={btnSm}><Save size={16}/> حفظ</button></div>
        </form>
      </div>
    </div>
  );
}

function LeadModal({ onClose, onSave }: any) {
  const [form, setForm] = useState({ name: '', phone: '', source: 'facebook', notes: '', status: 'new' });
  const [err, setErr] = useState('');
  function submit(e: any) { e.preventDefault(); if (!form.name.trim()) { setErr('الاسم مطلوب'); return; } onSave(form); }
  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md grid place-items-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a1028]">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10"><h3 className="text-white font-semibold">عميل محتمل جديد</h3><button onClick={onClose} className="text-slate-400"><X size={18}/></button></div>
        <form onSubmit={submit} className="p-5 space-y-4">
          <label><span className={label}>الاسم *</span><input className={inp} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label><span className={label}>الجوال</span><input className={inp} dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
          <label><span className={label}>المصدر</span><select className={inp} value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>{LEAD_SOURCES.map((s) => <option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}</select></label>
          <label><span className={label}>ملاحظات</span><textarea rows={2} className={inp} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
          {err && <div className="rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3">{err}</div>}
          <div className="flex justify-end gap-2 pt-2 border-t border-white/10"><button type="button" onClick={onClose} className={btnGhost}>إلغاء</button><button type="submit" className={btnSm}><Save size={16}/> حفظ</button></div>
        </form>
      </div>
    </div>
  );
}

/* ============ SETTINGS PAGE (main admin settings) ============ */
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
      <div className={card + ' !p-4'}><p className="text-slate-400 text-sm">البريد: mustafa781075016@gmail.com</p></div>
      <div className={card + ' !p-4'}>
        <div className="flex gap-2 border-b border-white/10 overflow-auto">
          <button onClick={()=>setSettingsTab('doctors')} className={`px-4 py-2 text-sm border-b-2 whitespace-nowrap ${settingsTab==='doctors'?'border-blue-500 text-white':'border-transparent text-slate-400'}`}>إدارة الأطباء</button>
          <button onClick={()=>setSettingsTab('treatments')} className={`px-4 py-2 text-sm border-b-2 whitespace-nowrap ${settingsTab==='treatments'?'border-blue-500 text-white':'border-transparent text-slate-400'}`}>إدارة المعالجات</button>
        </div>
        <div className="mt-3 flex">
          <button onClick={()=>setSettingsTab('users')} className={`w-full md:w-auto px-6 py-2.5 rounded-xl text-sm font-bold border flex items-center justify-center gap-2 ${settingsTab==='users'?'bg-gradient-to-l from-violet-600 to-blue-600 border-violet-500 text-white':'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}><UserPlus size={16}/> إضافة مستخدم</button>
        </div>
        {settingsTab==='doctors' && (
          <div className="mt-5 space-y-4">
            <div className="grid md:grid-cols-3 gap-3"><div><label className={label}>اسم الطبيب</label><input value={newDoc.name} onChange={e=>setNewDoc({...newDoc,name:e.target.value})} className={inp}/></div><div><label className={label}>التخصص</label><input value={newDoc.specialty} onChange={e=>setNewDoc({...newDoc,specialty:e.target.value})} className={inp}/></div><div className="flex items-end"><button onClick={()=>{ if(!newDoc.name) return; setDoctors([...doctors,{id:Date.now().toString(),...newDoc}]); setNewDoc({name:'',specialty:''}) }} className={btnSm}><Plus size={16}/> إضافة</button></div></div>
            <div className="space-y-2">{doctors.map((d:any)=><div key={d.id} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5"><span className="text-white text-sm">{d.name} - {d.specialty}</span><div className="flex gap-2"><button onClick={()=>setEditItem({type:'doc',data:d})} className="text-blue-400"><Edit3 size={14}/></button><button onClick={()=>setDoctors(doctors.filter((x:any)=>x.id!==d.id))} className="text-red-400"><Trash2 size={14}/></button></div></div>)}</div>
          </div>
        )}
        {settingsTab==='treatments' && (
          <div className="mt-5 space-y-4">
            <div className="grid md:grid-cols-3 gap-3"><div><label className={label}>اسم المعالجة</label><input value={newTreat.name} onChange={e=>setNewTreat({...newTreat,name:e.target.value})} className={inp}/></div><div><label className={label}>السعر</label><input type="number" value={newTreat.price} onChange={e=>setNewTreat({...newTreat,price:parseInt(e.target.value)||0})} className={inp}/></div><div className="flex items-end"><button onClick={()=>{ if(!newTreat.name) return; setTreatTypes([...treatTypes,{id:Date.now().toString(),...newTreat}]); setNewTreat({name:'',price:500}) }} className={btnSm}><Plus size={16}/> إضافة</button></div></div>
            <div className="space-y-2">{treatTypes.map((t:any)=><div key={t.id} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5"><span className="text-white text-sm">{t.name} - {t.price} ر.س</span><div className="flex gap-2"><button onClick={()=>setEditItem({type:'treat',data:t})} className="text-blue-400"><Edit3 size={14}/></button><button onClick={()=>setTreatTypes(treatTypes.filter((x:any)=>x.id!==t.id))} className="text-red-400"><Trash2 size={14}/></button></div></div>)}</div>
          </div>
        )}
        {settingsTab==='users' && (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl bg-white/[.02] border border-white/10 p-4 space-y-3"><div className="font-semibold text-white flex items-center gap-2"><UserPlus size={18}/> إضافة مستخدم</div><div className="grid md:grid-cols-3 gap-3"><div><label className={label}>اسم المستخدم *</label><input value={newUser.username} onChange={e=>setNewUser({...newUser,username:e.target.value})} className={inp}/></div><div><label className={label}>كلمة المرور *</label><input value={newUser.password} onChange={e=>setNewUser({...newUser,password:e.target.value})} type="password" className={inp}/></div><div><label className={label}>الدور</label><select value={newUser.role} onChange={e=>setNewUser({...newUser,role:e.target.value})} className={inp}><option>طبيب</option><option>مدير</option><option>استقبال</option><option>محاسب</option></select></div></div><button onClick={()=>{ if(!newUser.username||!newUser.password){ alert('ادخل البيانات'); return } setAppUsers([...appUsers,{id:Date.now().toString(),...newUser}]); setNewUser({username:'',password:'',role:'طبيب'}) }} className={btnSm}><Plus size={16}/> إضافة</button></div>
            <div className={card + ' !bg-white/[.02]'}><div className="flex justify-between items-center mb-3"><div className="font-bold flex items-center gap-2 text-white"><Users size={18}/> المستخدمون - {appUsers.length}</div><input value={userSearch} onChange={e=>setUserSearch(e.target.value)} placeholder="بحث..." className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs w-40 text-white"/></div><div className="overflow-auto"><table className="w-full text-sm"><thead className="text-slate-400 text-xs"><tr><th className="p-2 text-right">اسم المستخدم</th><th className="p-2 text-right">الدور</th><th className="p-2"></th></tr></thead><tbody>{appUsers.filter((u:any)=> u.username.toLowerCase().includes(userSearch.toLowerCase())).map((u:any)=><tr key={u.id} className="border-t border-white/5"><td className="p-3 text-white">{u.username}</td><td className="p-3"><span className="text-xs px-2 py-1 rounded bg-white/10 text-white">{u.role}</span></td><td className="p-3 flex gap-1 justify-end"><button onClick={()=>setEditItem({type:'user',data:u})} className="p-1.5 rounded bg-white/5 text-white"><Edit3 size={12}/></button><button onClick={()=>{ if(confirm('حذف؟')) setAppUsers(appUsers.filter((x:any)=>x.id!==u.id)) }} className="p-1.5 rounded bg-red-500/20 text-red-300"><Trash2 size={12}/></button></td></tr>)}</tbody></table></div></div>
          </div>
        )}
        {editItem && (<div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={()=>setEditItem(null)}><div className="bg-[#0f172a] border border-white/10 rounded-2xl p-4 w-full max-w-md" onClick={e=>e.stopPropagation()}><h3 className="font-bold mb-3 text-white">تعديل</h3>{editItem.type==='doc' && <div className="space-y-2"><input value={editItem.data.name} onChange={e=>setEditItem({...editItem,data:{...editItem.data,name:e.target.value}})} className={inp}/><input value={editItem.data.specialty||''} onChange={e=>setEditItem({...editItem,data:{...editItem.data,specialty:e.target.value}})} className={inp}/><div className="flex gap-2"><button onClick={()=>{setDoctors(doctors.map((d:any)=>d.id===editItem.data.id?editItem.data:d));setEditItem(null)}} className={btnSm}>حفظ</button><button onClick={()=>setEditItem(null)} className={btnGhost}>إلغاء</button></div></div>}{editItem.type==='treat' && <div className="space-y-2"><input value={editItem.data.name} onChange={e=>setEditItem({...editItem,data:{...editItem.data,name:e.target.value}})} className={inp}/><input type="number" value={editItem.data.price} onChange={e=>setEditItem({...editItem,data:{...editItem.data,price:parseInt(e.target.value)||0}})} className={inp}/><div className="flex gap-2"><button onClick={()=>{setTreatTypes(treatTypes.map((t:any)=>t.id===editItem.data.id?editItem.data:t));setEditItem(null)}} className={btnSm}>حفظ</button><button onClick={()=>setEditItem(null)} className={btnGhost}>إلغاء</button></div></div>}{editItem.type==='user' && <div className="space-y-2"><input value={editItem.data.username} onChange={e=>setEditItem({...editItem,data:{...editItem.data,username:e.target.value}})} className={inp}/><input value={editItem.data.password} onChange={e=>setEditItem({...editItem,data:{...editItem.data,password:e.target.value}})} className={inp}/><select value={editItem.data.role} onChange={e=>setEditItem({...editItem,data:{...editItem.data,role:e.target.value}})} className={inp}><option>طبيب</option><option>مدير</option><option>استقبال</option><option>محاسب</option></select><div className="flex gap-2"><button onClick={()=>{setAppUsers(appUsers.map((u:any)=>u.id===editItem.data.id?editItem.data:u));setEditItem(null)}} className={btnSm}>حفظ</button><button onClick={()=>setEditItem(null)} className={btnGhost}>إلغاء</button></div></div>}</div></div>)}
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

  if (!session && !currentUser) return <Login onLogin={(u:any)=>{
    if(u){ setCurrentUser(u); setSession({user:u}); } else {
      supabase.auth.getSession().then(({data}) => { setSession(data.session); try{ setCurrentUser(JSON.parse(localStorage.getItem('zircon_currentUser')||'null')) }catch{} });
    }
  }} />;

  const role = currentUser?.role || 'مدير';

  const allMenu = [
    { id:'dashboard', label:'لوحة التحكم', icon: LayoutDashboard, roles:['مدير','طبيب','استقبال','محاسب'] },
    { id:'reception-settings', label:'إعدادات الاستقبال', icon: SettingsIcon, roles:['استقبال','مدير'] },
    { id:'patients', label:'المرضى', icon: Users, roles:['مدير','طبيب','استقبال'] },
    { id:'treatments-bulk', label:'إضافة معالجات', icon: FileSpreadsheet, roles:['مدير','طبيب'] },
    { id:'appointments', label:'المواعيد', icon: Calendar, roles:['مدير','طبيب','استقبال'] },
    { id:'surgeries', label:'الجراحات', icon: Stethoscope, roles:['مدير','طبيب'] },
    { id:'implants', label:'الزرعات', icon: Syringe, roles:['مدير','طبيب'] },
    { id:'marketing', label:'إدارة التسويق', icon: Megaphone, roles:['مدير'] },
    { id:'disease-log', label:'سجل الأمراض', icon: ClipboardList, roles:['مدير','طبيب','استقبال','محاسب'] },
    { id:'reports', label:'التقارير', icon: FileText, roles:['مدير','محاسب'] },
    { id:'settings', label:'الإعدادات', icon: SettingsIcon, roles:['مدير'] },
  ];
  const menu = allMenu.filter(m=> m.roles.includes(role));

  return (
    <div dir="rtl" className="min-h-screen bg-[#060a1a] text-white flex">
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={()=>setSidebarOpen(false)} />}
      <aside className={`fixed lg:static inset-y-0 right-0 z-50 w-64 border-l border-white/10 bg-[#0a1028] p-4 flex flex-col transition-transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 grid place-items-center font-bold">Z</div>
            <div><div className="font-bold">Zircon</div><div className="text-[10px] text-slate-400">Dental OS V2</div></div>
          </div>
          <button onClick={()=>setSidebarOpen(false)} className="lg:hidden text-slate-400"><X size={18}/></button>
        </div>
        <nav className="space-y-1 flex-1 overflow-y-auto">
          {menu.map(m=>(
            <button key={m.id} onClick={()=>{ setPage(m.id); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 text-right p-3 rounded-xl text-sm transition ${page===m.id ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'hover:bg-white/5 text-slate-300'}`}>
              <m.icon size={18}/> {m.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto space-y-2">
          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 grid place-items-center text-xs font-bold">{currentUser?.username?.[0]?.toUpperCase()||'م'}</div>
              <div><div className="text-sm font-bold text-white">{currentUser?.username}</div><div className="text-[11px] text-slate-400">{role}</div></div>
            </div>
          </div>
          <button onClick={() => { localStorage.removeItem('zircon_currentUser'); supabase.auth.signOut(); setCurrentUser(null); setSession(null); }} className="w-full flex items-center gap-2 text-red-400 p-3 text-sm hover:bg-red-500/10 rounded-xl">
            <LogOut size={18}/> تسجيل خروج - {currentUser?.username}
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-white/10 bg-[#0a1028]/50 backdrop-blur-xl flex items-center justify-between px-4">
          <button onClick={()=>setSidebarOpen(true)} className="lg:hidden text-white"><Menu size={20}/></button>
          <div className="text-sm text-slate-400 hidden lg:block">مرحبا {currentUser?.username} - دورك: {role}</div>
          <div className="flex items-center gap-3">
            <Bell size={18} className="text-slate-400"/>
            <div className="h-8 w-8 rounded-full bg-blue-500/20 text-blue-300 grid place-items-center text-xs font-bold">{currentUser?.username?.[0]?.toUpperCase()||'م'}</div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {page==='dashboard' && (role === 'استقبال' ? <ReceptionDashboard setPage={setPage} /> : <Dashboard setPage={setPage} />)}
          {page==='reception-settings' && <ReceptionSettings />}
          {page==='session-booking' && <SessionBooking setPage={setPage} />}
          {page==='patients' && <Patients setPage={setPage} setEditItem={setEditItem} setSelectedPatient={setSelectedPatient} />}
          {page==='treatments-bulk' && <TreatmentsBulk />}
          {page==='patient-new' && <PatientForm patient={editItem} onSave={()=>setPage('patients')} onCancel={()=>setPage('patients')} />}
          {page==='patient-detail' && selectedPatient && <PatientDetail patient={selectedPatient} onBack={()=>setPage('patients')} setPage={setPage} setEditItem={setEditItem} />}
          {page==='appointments' && <Appointments setPage={setPage} />}
          {page==='appointment-new' && <AppointmentForm onSave={()=>setPage('appointments')} onCancel={()=>setPage('appointments')} />}
          {page==='surgeries' && <Surgeries setPage={setPage} setSelectedPatient={setSelectedPatient} />}
          {page==='surgery-new' && <SurgeryForm onSave={()=>setPage('surgeries')} onCancel={()=>setPage('surgeries')} />}
          {page==='implants' && <Implants />}
          {page==='marketing' && <Marketing />}
          {page==='disease-log' && <DiseaseLog />}
          {page==='reports' && <Reports />}
          {page==='settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}
