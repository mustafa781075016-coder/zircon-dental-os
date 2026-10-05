import { useEffect, useState, useCallback, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Users, Calendar, LogOut, Menu, Bell, X,
  Stethoscope, Syringe, Receipt, FileText,
  Plus, Search, Lock, Loader2, ArrowRight, Save, Trash2, Edit3,
  MessageCircle, Clock, DollarSign, HeartPulse
} from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
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
  return new Intl.DateTimeFormat('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}

// --- LOGIN ---
function Login({ onLogin }: { onLogin: (user:any)=>void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(e:any){
    e.preventDefault(); setErr(''); setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if(error){ setErr(error.message); return; }
    onLogin(data.user);
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
          <div><label className={label}>البريد الالكتروني</label><input value={email} onChange={e=>setEmail(e.target.value)} required dir="ltr" className={inp} placeholder="admin@clinic.com"/></div>
          <div><label className={label}>كلمة المرور</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required dir="ltr" className={inp}/></div>
          {err && <div className="rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3">{err}</div>}
          <button type="submit" disabled={loading} className={btn}>{loading && <Loader2 className="animate-spin" size={18}/>} دخول</button>
          <p className="text-[11px] text-slate-500 text-center">أنشئ أول مستخدم من لوحة Supabase &gt; Authentication</p>
        </form>
      </div>
    </div>
  );
}

const TEETH_UPPER = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28];
const TEETH_LOWER = [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];
const TOOTH_COLORS: any = { 1:'#e06a6a', 2:'#b78a4a', 3:'#2ea86a', 4:'#3a8ab5', 5:'#6b4c9a', 6:'#d16a8a', 7:'#a3b82a', 8:'#7a8a2e' };

function ToothChart({ implants, onToothClick }: { implants: any[], onToothClick: (n:number)=>void }) {
  const implanted = useMemo(() => new Set(implants.map((i:any)=>i.tooth_number)), [implants]);
  return (
    <div className={card + ' !p-3 md:!p-5'}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-white text-sm md:text-base">مخطط الأسنان - الترقيم 1-8</h3>
        <div className="flex gap-2 text-[9px] text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>مزروع</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white/20"></span>فارغ</span>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {[TEETH_UPPER, TEETH_LOWER].map((arch, archIndex) => (
          <div key={archIndex} className="rounded-2xl bg-white/[0.02] border border-white/5 p-3">
            <div className="text-center text-[11px] text-slate-400 mb-2 font-medium">{archIndex === 0? 'الفك العلوي' : 'الفك السفلي'}</div>
            <div className="grid grid-cols-8 gap-1.5">
              {arch.map(fdi => {
                const palmer = fdi % 10;
                const has = implanted.has(fdi);
                return (
                  <button key={fdi} onClick={()=>onToothClick(fdi)} className={`relative rounded-lg border-2 aspect-square flex flex-col items-center justify-center transition-all ${has? 'bg-emerald-500 border-emerald-300 shadow-lg shadow-emerald-500/30' : 'bg-white/5 border-white/15 hover:bg-white/10'}`}>
                    <span className="text-lg font-black leading-none" style={{color: has? 'white' : TOOTH_COLORS[palmer]}}>{palmer}</span>
                    <span className="text-[7px] text-slate-500 leading-none mt-1">{fdi}</span>
                    {has && <span className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-white text-emerald-600 flex items-center justify-center text-[8px] font-bold">✓</span>}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TreatmentsBulk({ onSaved }: { onSaved: ()=>void }){
  const [patientsList, setPatientsList] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [treatTypes, setTreatTypes] = useState<any[]>([]);
  const [bulkRows, setBulkRows] = useState<any[]>([]);
  const [form, setForm] = useState({ patientId:'', patientName:'', doctorId:'', doctorName:'', treatTypeId:'', treatName:'', teeth:[] as number[], cost:0, date:TODAY, status:'مخطط لها', notes:'' });
  const [jawOpen, setJawOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(()=>{
    (async()=>{
      const [p,d,t] = await Promise.all([
        supabase.from('patients').select('id, full_name').order('full_name').limit(100),
        supabase.from('doctors').select('*').order('created_at'),
        supabase.from('treatment_definitions').select('*').order('created_at'),
      ]);
      setPatientsList(p.data||[]); setDoctors(d.data||[]); setTreatTypes(t.data||[]);
    })();
  },[]);

  function addRow(){
    if(!form.patientId ||!form.treatName || form.teeth.length===0){ alert('أكمل المريض والمعالجة والأسنان'); return; }
    const rows = form.teeth.map((toothNum:any)=>({
      id: Date.now().toString()+Math.random()+toothNum, patientId: form.patientId, patientName: form.patientName,
      doctorId: form.doctorId, doctorName: form.doctorName, treatName: form.treatName,
      tooth: toothNum, cost: form.cost, date: form.date, status: form.status, notes: form.notes
    }));
    setBulkRows([...rows,...bulkRows]);
    setForm(f=> ({...f, teeth:[] }));
  }

  async function saveAll(){
    if(bulkRows.length===0) return;
    setSaving(true);
    const payload = bulkRows.map((r:any)=>({
      patient_id: r.patientId,
      tooth_number: r.tooth,
      treatment_type: r.treatName,
      doctor_name: r.doctorName,
      cost: r.cost,
      status: r.status === 'تمت'? 'completed' : r.status === 'قيد التنفيذ'? 'in_progress' : 'planned',
      description: r.notes||'',
      treatment_date: r.date,
    }));
    const { error } = await supabase.from('treatments').insert(payload);
    setSaving(false);
    if(error){ alert('خطأ: ' + error.message); return; }
    alert(`تم حفظ ${payload.length} معالجة - ستظهر في الملف الطبي وسند الحساب`);
    setBulkRows([]);
    onSaved();
  }

  return (
    <div className="space-y-4">
      <div className={card + ' !p-4'}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div><label className={label}>المريض</label><select value={form.patientId} onChange={e=>{ const p = patientsList.find(x=>x.id===e.target.value); setForm({...form, patientId:e.target.value, patientName:p?.full_name||''})}} className={inp}><option value="">اختر</option>{patientsList.map(p=><option key={p.id} value={p.id}>{p.full_name}</option>)}</select></div>
          <div><label className={label}>الطبيب</label><select value={form.doctorId} onChange={e=>{ const d = doctors.find(x=>x.id===e.target.value); setForm({...form, doctorId:e.target.value, doctorName:d?.name||''})}} className={inp}><option value="">اختر</option>{doctors.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
          <div><label className={label}>المعالجة</label><select value={form.treatTypeId} onChange={e=>{ const t = treatTypes.find(x=>x.id===e.target.value); setForm({...form, treatTypeId:e.target.value, treatName:t?.name||'', cost:t?.price||0})}} className={inp}><option value="">اختر</option>{treatTypes.map(t=><option key={t.id} value={t.id}>{t.name} - {t.price}</option>)}</select></div>
          <div><label className={label}>الأسنان 🦷</label><button onClick={()=>setJawOpen(true)} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-xs text-white hover:bg-white/10">{form.teeth.length>0? `${form.teeth.length} أسنان مختارة - ${form.teeth.join(',')}`:'اختر الأسنان'}</button></div>
        </div>
        <div className="mt-3 flex gap-2"><button onClick={addRow} className={btnSm}><Plus size={16}/> إضافة للسجل</button><button onClick={saveAll} disabled={saving} className={btnSm}>{saving? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>} حفظ الكل ({bulkRows.length})</button></div>
      </div>

      {jawOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={()=>setJawOpen(false)}>
          <div className="bg-[#0a1028] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto" onClick={e=>e.stopPropagation()}>
            <div className="p-3 border-b border-white/10 flex justify-between sticky top-0 bg-[#0a1028]"><h3 className="text-white font-bold">اختر الأسنان - أرقام 1-8</h3><button onClick={()=>setJawOpen(false)} className="p-1.5 rounded-lg bg-white/10 text-white"><X size={16}/></button></div>
            <div className="p-4 space-y-4">
              <div><div className="text-center text-xs text-slate-400 mb-2">الفك العلوي</div><div className="grid grid-cols-8 gap-2">{TEETH_UPPER.map(fdi => (<button key={fdi} onClick={()=> setForm({...form, teeth: form.teeth.includes(fdi)? form.teeth.filter(x=>x!==fdi) : [...form.teeth, fdi]})} className={`relative rounded-lg border-2 aspect-square flex items-center justify-center text-lg font-black ${form.teeth.includes(fdi)? 'bg-emerald-500 border-emerald-300 text-white' : 'bg-white/5 border-white/15 text-slate-300'}`}>{fdi%10}<span className="absolute top-0.5 right-1 text-[7px] text-slate-400">{fdi}</span></button>))}</div></div>
              <div className="h-0.5 bg-red-500/50"></div>
              <div><div className="text-center text-xs text-slate-400 mb-2">الفك السفلي</div><div className="grid grid-cols-8 gap-2">{TEETH_LOWER.map(fdi => (<button key={fdi} onClick={()=> setForm({...form, teeth: form.teeth.includes(fdi)? form.teeth.filter(x=>x!==fdi) : [...form.teeth, fdi]})} className={`relative rounded-lg border-2 aspect-square flex items-center justify-center text-lg font-black ${form.teeth.includes(fdi)? 'bg-emerald-500 border-emerald-300 text-white' : 'bg-white/5 border-white/15 text-slate-300'}`}>{fdi%10}<span className="absolute top-0.5 right-1 text-[7px] text-slate-400">{fdi}</span></button>))}</div></div>
            </div>
            <div className="p-3 border-t border-white/10 flex justify-between sticky bottom-0 bg-[#0a1028]"><span className="text-xs text-slate-400">{form.teeth.length} أسنان</span><button onClick={()=>setJawOpen(false)} className="px-6 py-2 rounded-xl bg-blue-600 text-white text-sm">تم</button></div>
          </div>
        </div>
      )}

      <div className={card + ' !p-0 overflow-hidden'}>
        <div className="overflow-auto">
        <table className="w-full text-sm"><thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-3 py-3">المريض</th><th className="text-right px-3 py-3">السن</th><th className="text-right px-3 py-3">المعالجة</th><th className="text-right px-3 py-3">الطبيب</th><th className="text-right px-3 py-3">السعر</th><th></th></tr></thead>
          <tbody>{bulkRows.length===0? <tr><td colSpan={6} className="p-6 text-center text-slate-500">لا يوجد سجلات - اختر أسنان واضغط إضافة</td></tr> : bulkRows.map((r:any)=><tr key={r.id} className="border-t border-white/5 hover:bg-white/5"><td className="px-3 py-2 text-white">{r.patientName}</td><td className="px-3 py-2"><span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs">🦷 {r.tooth}</span></td><td className="px-3 py-2 text-slate-300">{r.treatName}</td><td className="px-3 py-2 text-slate-400">{r.doctorName}</td><td className="px-3 py-2 text-emerald-400">{r.cost} ر.س</td><td className="px-3 py-2"><button onClick={()=>setBulkRows(bulkRows.filter(x=>x.id!==r.id))} className="text-red-400 hover:text-red-300"><Trash2 size={14}/></button></td></tr>)}</tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

// باقي الصفحات: Dashboard, Patients, etc تبقى كما هي - فقط استبدل TreatmentsBulk بهذه النسخة

export default function App(){
  const [user, setUser] = useState<any>(null);
  const [page, setPage] = useState('dashboard');
  const [refresh, setRefresh] = useState(0);

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{ if(data.session) setUser(data.session.user) });
  },[]);

  if(!user) return <Login onLogin={setUser} />;

  return (
    <div dir="rtl" className="min-h-screen bg-[#060a1a] text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Zircon OS - نسخة مصححة</h1>
        <button onClick={async()=>{ await supabase.auth.signOut(); setUser(null); }} className={btnGhost}><LogOut size={16}/> خروج</button>
      </div>
      <TreatmentsBulk onSaved={()=>setRefresh(r=>r+1)} />
      <div className="mt-6 text-xs text-slate-500">تم إصلاح: حفظ كل سن منفصل، وإزالة التشفير الضعيف، وتحسين مخطط الأسنان. انسخ باقي مكوناتك (Dashboard, Patients) من ملفك القديم إلى هذا الملف.</div>
    </div>
  );
}
