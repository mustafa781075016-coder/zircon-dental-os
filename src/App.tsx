import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  LayoutDashboard, Users, Calendar, LogOut, Menu, Bell, X,
  Stethoscope, Syringe, Receipt, FileText, Settings as SettingsIcon,
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

const TEETH_UPPER = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28];
const TEETH_LOWER = [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];

function ToothChart({ implants, onToothClick }: { implants: any[], onToothClick: (n:number)=>void }) {
  const implanted = new Set(implants.map((i:any)=>i.tooth_number));
  return (
    <div className={card}>
      <h3 className="font-semibold text-white mb-4">مخطط الاسنان - اضغط على السن لاضافة زرعة</h3>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-1.5 justify-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
          {TEETH_UPPER.map(n=>{
            const has = implanted.has(n);
            return <button key={n} onClick={()=>onToothClick(n)} className={`h-10 w-8 rounded-lg border text-xs font-bold ${has? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}>{n}</button>
          })}
        </div>
        <div className="flex flex-wrap gap-1.5 justify-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
          {TEETH_LOWER.map(n=>{
            const has = implanted.has(n);
            return <button key={n} onClick={()=>onToothClick(n)} className={`h-10 w-8 rounded-lg border text-xs font-bold ${has? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}>{n}</button>
          })}
        </div>
      </div>
    </div>
  )
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
            {todayAppts.length===0? <p className="text-sm text-slate-500">لا توجد مواعيد اليوم</p> :
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
            {upcomingFollowups.length===0? <p className="text-sm text-slate-500">لا توجد متابعات قادمة</p> :
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
      <div className={card + '!p-0 overflow-hidden'}>
        {loading? <div className="p-8 text-center text-slate-400">جاري التحميل...</div> :
         list.length === 0? <div className="p-8 text-center text-slate-400">لا يوجد مرضى</div> : (
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
  const isEdit =!!patient?.id;
  const [form, setForm] = useState({
    full_name: patient?.full_name || '', phone: patient?.phone || '', medical_alerts: patient?.medical_alerts || '', notes: patient?.notes || '',
    gender: patient?.gender || '', date_of_birth: patient?.date_of_birth || '',
  });
  const [err, setErr] = useState(''); const [loading, setLoading] = useState(false);
  async function submit(e: any) {
    e.preventDefault(); setErr('');
    if (!form.full_name.trim() ||!form.phone.trim()) { setErr('الاسم والجوال مطلوبان'); return; }
    setLoading(true);
    const payload: any = { full_name: form.full_name.trim(), phone: form.phone.trim(), gender: form.gender || null, date_of_birth: form.date_of_birth || null, medical_alerts: form.medical_alerts || null, notes: form.notes || null };
    let res = isEdit? await supabase.from('patients').update(payload).eq('id', patient.id) : await supabase.from('patients').insert(payload);
    setLoading(false);
    if (res.error) { setErr(res.error.message); return; }
    onSave();
  }
  return (
    <form onSubmit={submit} className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-3"><button type="button" onClick={onCancel} className="text-slate-400"><ArrowRight size={20}/></button><h2 className="text-xl font-bold text-white">{isEdit? 'تعديل المريض' : 'اضافة مريض جديد'}</h2></div>
      <div className={card}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label><span className={label}>الاسم *</span><input className={inp} value={form.full_name} onChange={(e) => setForm({...form, full_name: e.target.value })} required /></label>
          <label><span className={label}>الجوال *</span><input className={inp} dir="ltr" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value })} required /></label>
          <label><span className={label}>الجنس</span><select className={inp} value={form.gender} onChange={(e) => setForm({...form, gender: e.target.value })}><option value="">—</option><option value="male">ذكر</option><option value="female">انثى</option></select></label>
          <label><span className={label}>تاريخ الميلاد</span><input className={inp} type="date" value={form.date_of_birth} onChange={(e) => setForm({...form, date_of_birth: e.target.value })} /></label>
          <label className="md:col-span-2"><span className={label}>تنبيهات طبية</span><textarea className={inp} rows={2} value={form.medical_alerts} onChange={(e) => setForm({...form, medical_alerts: e.target.value })} /></label>
        </div>
      </div>
      {err && <div className="rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3">{err}</div>}
      <div className="flex gap-3"><button type="submit" disabled={loading} className={btnSm + '!px-6!py-2.5'}>{loading? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>} حفظ</button><button type="button" onClick={onCancel} className={btnGhost}>الغاء</button></div>
    </form>
  );
}
function PatientDetail({ patient, onBack, setPage, setEditItem }: any) {
  const [tab, setTab] = useState('overview');
  const [surgeries, setSurgeries] = useState<any[]>([]);
  const [implants, setImplants] = useState<any[]>([]);
  const [followups, setFollowups] = useState<any[]>([]);
  const [showImplantModal, setShowImplantModal] = useState(false);
  const [selectedTooth, setSelectedTooth] = useState<number>(11);
  const load = useCallback(async()=>{
    const [s, i, f] = await Promise.all([
      supabase.from('surgeries').select('*').eq('patient_id', patient.id).order('created_at',{ascending:false}),
      supabase.from('implants').select('*').eq('patient_id', patient.id).order('created_at',{ascending:false}),
      supabase.from('follow_ups').select('*').eq('patient_id', patient.id).order('scheduled_date'),
    ]);
    setSurgeries(s.data||[]); setImplants(i.data||[]); setFollowups(f.data||[]);
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
        <a href={`https://wa.me/${patient.phone?.replace(/\D/g,'')}`} target="_blank" className={btnSm + '!bg-emerald-600'}><MessageCircle size={16}/> واتساب</a>
        <button onClick={()=>{ setEditItem(patient); setPage('patient-new'); }} className={btnGhost}><Edit3 size={16}/> تعديل</button>
      </div>
      <div className="border-b border-white/10 overflow-x-auto"><div className="flex gap-1 min-w-max">
        {[{id:'overview', label:'نظرة عامة'},{id:'chart', label:`مخطط الاسنان (${implants.length})`},{id:'surgeries', label:`الجراحات (${surgeries.length})`},{id:'followups', label:`المتابعات (${followups.length})`}].map(t=><button key={t.id} onClick={() => setTab(t.id)} className={'px-4 py-2.5 text-sm border-b-2 whitespace-nowrap ' + (tab === t.id? 'border-blue-500 text-white' : 'border-transparent text-slate-400')}>{t.label}</button>)}
      </div></div>
      {tab==='overview' && <div className={card}><div className="grid grid-cols-3 gap-3 text-center"><div className="rounded-xl bg-white/5 p-3"><div className="text-xl font-bold text-white">{surgeries.length}</div><div className="text-xs text-slate-400">جراحات</div></div><div className="rounded-xl bg-white/5 p-3"><div className="text-xl font-bold text-emerald-400">{implants.length}</div><div className="text-xs text-slate-400">زرعات</div></div><div className="rounded-xl bg-white/5 p-3"><div className="text-xl font-bold text-amber-400">{followups.length}</div><div className="text-xs text-slate-400">متابعات</div></div></div></div>}
      {tab==='chart' && <div className="space-y-4"><ToothChart implants={implants} onToothClick={handleToothClick}/><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{implants.map((im:any)=><div key={im.id} className={card}><div className="flex justify-between"><span className="text-2xl font-bold text-emerald-400">{im.tooth_number}</span><span className="text-xs px-2 py-1 rounded bg-emerald-500/20 text-emerald-300">{im.status}</span></div><div className="text-sm text-white mt-1">{im.brand}</div><div className="text-xs text-slate-400 mt-1" dir="ltr">{im.diameter_mm} x {im.length_mm} mm | Torque {im.torque_ncm} Ncm</div></div>)}</div></div>}
      {tab==='surgeries' && <div className="space-y-3">{surgeries.map((s:any)=><div key={s.id} className={card + ' flex justify-between items-center'}><div><div className="text-white font-medium">{s.surgery_type} - {fmtDate(s.scheduled_date)}</div><div className="text-xs text-slate-400">{s.status}</div></div></div>)}</div>}
      {tab==='followups' && <div className="space-y-3">
        <button onClick={async()=>{
          if (surgeries.length===0) { alert('انشئ جراحة اولا'); return; }
          const base = new Date(surgeries[0].scheduled_date || new Date());
          const dates = [{type:'فك غرز', days:7},{type:'متابعة التئام', days:14},{type:'كشف اندماج العظم', days:90},{type:'موعد التركيب', days:180}];
          for (const d of dates) { const dt = new Date(base); dt.setDate(dt.getDate()+d.days); await supabase.from('follow_ups').insert({ patient_id: patient.id, surgery_id: surgeries[0].id, follow_type: d.type, scheduled_date: dt.toISOString().slice(0,10), status:'scheduled' }); }
          load();
        }} className={btnSm}><Plus size={16}/> انشاء متابعات تلقائية</button>
        {followups.map((f:any)=><div key={f.id} className={card + ' flex justify-between items-center'}><div><div className="text-white">{f.follow_type}</div><div className="text-xs text-slate-400">{fmtDate(f.scheduled_date)}</div></div><span className={`text-xs px-2 py-1 rounded ${f.status==='completed'? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>{f.status}</span></div>)}
      </div>}
      {showImplantModal && <ImplantModal surgeryId={surgeries[0]?.id} patientId={patient.id} initialTooth={selectedTooth} onClose={()=>setShowImplantModal(false)} onSave={()=>{ setShowImplantModal(false); load(); }} />}
    </div>
  );
}

function Surgeries({ setPage, setSelectedPatient }: any) {
  const [list, setList] = useState<any[]>([]);
  useEffect(()=>{ (async()=>{ const {data}=await supabase.from('surgeries').select('*, patient:patients(full_name)').order('created_at',{ascending:false}).limit(100); setList(data||[]); })(); },[]);
  return <div className="space-y-4"><div className="flex justify-between"><h2 className="text-xl font-bold text-white">الجراحات</h2><button onClick={()=>setPage('surgery-new')} className={btnSm}><Plus size={16}/> جراحة جديدة</button></div><div className={card + '!p-0 overflow-hidden'}><table className="w-full text-sm"><thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-3">التاريخ</th><th className="text-right px-4 py-3">المريض</th><th className="text-right px-4 py-3">النوع</th></tr></thead><tbody className="divide-y divide-white/5">{list.map((s:any)=><tr key={s.id} className="hover:bg-white/5"><td className="px-4 py-3 text-slate-300 text-xs">{fmtDate(s.scheduled_date)}</td><td className="px-4 py-3 text-white"><button onClick={()=>{ setSelectedPatient(s.patient); setPage('patient-detail'); }} className="text-blue-400">{s.patient?.full_name}</button></td><td className="px-4 py-3 text-slate-300 text-xs">{s.surgery_type}</td></tr>)}</tbody></table></div></div>;
}

function Appointments({ setPage }: any) {
  const [list, setList] = useState<any[]>([]);
  useEffect(()=>{ (async()=>{ const {data}=await supabase.from('appointments').select('*, patient:patients(full_name)').order('scheduled_start',{ascending:false}).limit(100); setList(data||[]); })(); },[]);
  return <div className="space-y-4"><div className="flex justify-between"><h2 className="text-xl font-bold text-white">المواعيد</h2><button onClick={()=>setPage('appointment-new')} className={btnSm}><Plus size={16}/> موعد جديد</button></div><div className={card + '!p-0 overflow-hidden'}><table className="w-full text-sm"><thead className="bg-white/5 text-slate-400 text-xs"><tr><th className="text-right px-4 py-3">التاريخ</th><th className="text-right px-4 py-3">المريض</th><th className="text-right px-4 py-3">النوع</th></tr></thead><tbody className="divide-y divide-white/5">{list.map((a:any)=><tr key={a.id} className="hover:bg-white/5"><td className="px-4 py-3 text-slate-300 text-xs">{fmtDateTime(a.scheduled_start)}</td><td className="px-4 py-3 text-white">{a.patient?.full_name}</td><td className="px-4 py-3 text-slate-300 text-xs">{a.appointment_type}</td></tr>)}</tbody></table></div></div>;
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
    { id:'appointments', label:'المواعيد', icon: Calendar },
    { id:'surgeries', label:'الجراحات', icon: Stethoscope },
    { id:'implants', label:'الزرعات', icon: Syringe },
    { id:'reports', label:'التقارير', icon: FileText },
    { id:'settings', label:'الاعدادات', icon: SettingsIcon },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-[#060a1a] text-white flex">
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={()=>setSidebarOpen(false)} />}
      <aside className={`fixed lg:static inset-y-0 right-0 z-50 w-64 border-l border-white/10 bg-[#0a1028] p-4 flex flex-col transition-transform ${sidebarOpen? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3"><div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 grid place-items-center font-bold">Z</div><div><div className="font-bold">Zircon</div><div className="text-[10px] text-slate-400">Dental OS V2</div></div></div>
          <button onClick={()=>setSidebarOpen(false)} className="lg:hidden text-slate-400"><X size={18}/></button>
        </div>
        <nav className="space-y-1 flex-1 overflow-y-auto">
          {menu.map(m=>(
            <button key={m.id} onClick={()=>{ setPage(m.id); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 text-right p-3 rounded-xl text-sm transition ${page===m.id? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'hover:bg-white/5 text-slate-300'}`}>
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
