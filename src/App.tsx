import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  LayoutDashboard, Users, Calendar, LogOut, Menu, Bell, X,
  Stethoscope, Syringe, Plus, Search, Mail, Lock, Loader2,
  ArrowRight, Save, Trash2, Edit3,
} from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const btn = 'w-full rounded-lg bg-gradient-to-l from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 transition disabled:opacity-60 flex items-center justify-center gap-2';
const btnSm = 'rounded-lg bg-gradient-to-l from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-semibold px-4 py-2 text-sm transition disabled:opacity-60 flex items-center gap-2';
const btnGhost = 'rounded-lg bg-white/5 hover:bg-white/10 text-white px-4 py-2 text-sm transition';
const inp = 'w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60';
const card = 'rounded-xl border border-white/10 bg-white/[.03] backdrop-blur-xl p-5';
const label = 'block text-xs text-slate-400 mb-1.5';

function fmtDate(d) {
  if (!d) return '—';
  try {
    return new Intl.DateTimeFormat('ar-EG-u-nu-latn', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(d));
  } catch { return '—'; }
}
function fmtDateTime(d) {
  if (!d) return '—';
  try {
    return new Intl.DateTimeFormat('ar-EG-u-nu-latn', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d));
  } catch { return '—'; }
}

/* ============ LOGIN ============ */
function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr(''); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setErr('بيانات الدخول غير صحيحة'); return; }
    onLogin();
  }

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[.03] backdrop-blur-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 grid place-items-center text-2xl font-bold text-white mb-4 shadow-xl">Z</div>
          <h1 className="text-2xl font-bold text-white">تسجيل الدخول</h1>
          <p className="text-sm text-blue-300/70 mt-2">Zircon Dental Surgical OS</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className={label}>البريد الإلكتروني</label>
            <div className="relative">
              <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required dir="ltr" className={inp + ' pr-10'} placeholder="you@clinic.com" />
            </div>
          </div>
          <div>
            <label className={label}>كلمة المرور</label>
            <div className="relative">
              <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required dir="ltr" className={inp + ' pr-10'} placeholder="••••••••" />
            </div>
          </div>
          {err && <div className="rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3">{err}</div>}
          <button type="submit" disabled={loading} className={btn}>
            {loading && <Loader2 className="animate-spin" size={18} />} دخول
          </button>
        </form>
      </div>
    </div>
  );
}

/* ============ DASHBOARD ============ */
function Dashboard({ profile, setPage }) {
  const [stats, setStats] = useState({ patients: 0, today: 0, surgeries: 0, implants: 0 });
  const [recentPatients, setRecentPatients] = useState([]);
  const [todayAppts, setTodayAppts] = useState([]);

  useEffect(() => {
    (async () => {
      const start = new Date(); start.setHours(0,0,0,0);
      const end = new Date(); end.setHours(23,59,59,999);
      const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0,0,0,0);
      const [p, a, s, i] = await Promise.all([
        supabase.from('patients').select('*', { count: 'exact', head: true }),
        supabase.from('appointments').select('*', { count: 'exact', head: true }).gte('scheduled_start', start.toISOString()).lte('scheduled_start', end.toISOString()),
        supabase.from('surgeries').select('*', { count: 'exact', head: true }).gte('created_at', monthStart.toISOString()),
        supabase.from('implants').select('*', { count: 'exact', head: true }).gte('created_at', monthStart.toISOString()),
      ]);
      setStats({ patients: p.count || 0, today: a.count || 0, surgeries: s.count || 0, implants: i.count || 0 });
      const { data: rp } = await supabase.from('patients').select('*').order('created_at', { ascending: false }).limit(5);
      setRecentPatients(rp || []);
      const { data: ta } = await supabase.from('appointments').select('*, patient:patients(full_name)').gte('scheduled_start', start.toISOString()).lte('scheduled_start', end.toISOString()).order('scheduled_start');
      setTodayAppts(ta || []);
    })();
  }, []);

  const Stat = ({ icon: Icon, label, value, tone }) => (
    <div className={card}>
      <div className={'h-10 w-10 rounded-lg grid place-items-center mb-3 ' + tone}><Icon size={20} /></div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-slate-400 mt-1">{label}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">مرحبًا، {profile?.full_name || 'دكتور'}</h2>
          <p className="text-slate-400 mt-1 text-sm">نظرة عامة على نشاط العيادة</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setPage('patient-new')} className={btnSm}><Plus size={16}/> مريض جديد</button>
          <button onClick={() => setPage('appointment-new')} className={btnSm}><Plus size={16}/> موعد جديد</button>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Users} label="إجمالي المرضى" value={stats.patients} tone="bg-blue-500/20 text-blue-300" />
        <Stat icon={Calendar} label="مواعيد اليوم" value={stats.today} tone="bg-emerald-500/20 text-emerald-300" />
        <Stat icon={Stethoscope} label="الجراحات هذا الشهر" value={stats.surgeries} tone="bg-purple-500/20 text-purple-300" />
        <Stat icon={Syringe} label="الزرعات هذا الشهر" value={stats.implants} tone="bg-amber-500/20 text-amber-300" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className={card}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">أحدث المرضى</h3>
            <button onClick={() => setPage('patients')} className="text-xs text-blue-400 hover:text-blue-300">عرض الكل</button>
          </div>
          {recentPatients.length === 0 ? (
            <p className="text-sm text-slate-500">لا يوجد مرضى بعد</p>
          ) : (
            <div className="space-y-2">
              {recentPatients.map((p) => (
                <div key={p.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                  <div className="h-9 w-9 rounded-full bg-blue-500/20 text-blue-300 grid place-items-center text-sm font-semibold">{p.full_name?.charAt(0) || '؟'}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white font-medium truncate">{p.full_name}</div>
                    <div className="text-xs text-slate-400 mt-0.5" dir="ltr">{p.patient_code} · {p.phone}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={card}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">مواعيد اليوم</h3>
            <button onClick={() => setPage('appointments')} className="text-xs text-blue-400 hover:text-blue-300">عرض الكل</button>
          </div>
          {todayAppts.length === 0 ? (
            <p className="text-sm text-slate-500">لا توجد مواعيد اليوم</p>
          ) : (
            <div className="space-y-2">
              {todayAppts.map((a) => (
                <div key={a.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                  <div className="text-sm font-semibold text-blue-300 w-16" dir="ltr">{new Date(a.scheduled_start).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
                  <div className="flex-1 min-w-0 text-sm text-white truncate">{a.patient?.full_name || '—'}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============ PATIENTS LIST ============ */
function Patients({ setPage, setEditingPatient }) {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    let q = supabase.from('patients').select('*').order('created_at', { ascending: false }).limit(100);
    if (search) q = q.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%,patient_code.ilike.%${search}%`);
    const { data } = await q;
    setList(data || []);
    setLoading(false);
  }

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [search]);

  async function handleDelete(id) {
    if (!confirm('هل أنت متأكد من حذف المريض؟')) return;
    await supabase.from('patients').delete().eq('id', id);
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث بالاسم، الجوال، رقم المريض" className={inp + ' pr-10'} />
        </div>
        <button onClick={() => { setEditingPatient(null); setPage('patient-new'); }} className={btnSm}><Plus size={16}/> مريض جديد</button>
      </div>
      <div className={card + ' !p-0 overflow-hidden'}>
        {loading ? (
          <div className="p-8 text-center text-slate-400">جاري التحميل...</div>
        ) : list.length === 0 ? (
          <div className="p-8 text-center text-slate-400">لا يوجد مرضى</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-slate-400 text-xs">
                <tr>
                  <th className="text-right px-4 py-3">رقم المريض</th>
                  <th className="text-right px-4 py-3">الاسم</th>
                  <th className="text-right px-4 py-3">الجوال</th>
                  <th className="text-right px-4 py-3">الجنس</th>
                  <th className="text-right px-4 py-3">تاريخ الميلاد</th>
                  <th className="text-right px-4 py-3">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {list.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 font-mono text-blue-300 text-xs" dir="ltr">{p.patient_code}</td>
                    <td className="px-4 py-3 text-white">{p.full_name}</td>
                    <td className="px-4 py-3 text-slate-300" dir="ltr">{p.phone}</td>
                    <td className="px-4 py-3 text-slate-300">{p.gender === 'male' ? 'ذكر' : p.gender === 'female' ? 'أنثى' : '—'}</td>
                    <td className="px-4 py-3 text-slate-300">{fmtDate(p.date_of_birth)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingPatient(p); setPage('patient-new'); }} className="text-blue-400 hover:text-blue-300"><Edit3 size={16}/></button>
                        <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16}/></button>
                      </div>
                    </td>
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

/* ============ PATIENT FORM ============ */
function PatientForm({ patient, onSave, onCancel }) {
  const isEdit = !!patient?.id;
  const [form, setForm] = useState({
    full_name: patient?.full_name || '',
    phone: patient?.phone || '',
    alternate_phone: patient?.alternate_phone || '',
    email: patient?.email || '',
    gender: patient?.gender || '',
    date_of_birth: patient?.date_of_birth || '',
    blood_type: patient?.blood_type || '',
    national_id: patient?.national_id || '',
    address: patient?.address || '',
    medical_alerts: patient?.medical_alerts || '',
    emergency_contact_name: patient?.emergency_contact_name || '',
    emergency_contact_phone: patient?.emergency_contact_phone || '',
    notes: patient?.notes || '',
  });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr('');
    if (!form.full_name.trim() || !form.phone.trim()) { setErr('الاسم والجوال مطلوبان'); return; }
    setLoading(true);
    const payload = {
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
      alternate_phone: form.alternate_phone || null,
      email: form.email || null,
      gender: form.gender || null,
      date_of_birth: form.date_of_birth || null,
      blood_type: form.blood_type || null,
      national_id: form.national_id || null,
      address: form.address || null,
      medical_alerts: form.medical_alerts || null,
      emergency_contact_name: form.emergency_contact_name || null,
      emergency_contact_phone: form.emergency_contact_phone || null,
      notes: form.notes || null,
    };
    let res;
    if (isEdit) {
      res = await supabase.from('patients').update(payload).eq('id', patient.id);
    } else {
      res = await supabase.from('patients').insert(payload).select().single();
    }
    setLoading(false);
    if (res.error) { setErr(res.error.message); return; }
    onSave();
  }

  return (
    <form onSubmit={submit} className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onCancel} className="text-slate-400 hover:text-white"><ArrowRight size={20}/></button>
        <h2 className="text-xl font-bold text-white">{isEdit ? 'تعديل بيانات المريض' : 'إضافة مريض جديد'}</h2>
      </div>

      <div className={card}>
        <h3 className="font-semibold text-white mb-4">البيانات الأساسية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label><span className={label}>الاسم الكامل *</span>
            <input className={inp} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required /></label>
          <label><span className={label}>الجوال *</span>
            <input className={inp} dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></label>
          <label><span className={label}>جوال بديل</span>
            <input className={inp} dir="ltr" value={form.alternate_phone} onChange={(e) => setForm({ ...form, alternate_phone: e.target.value })} /></label>
          <label><span className={label}>البريد الإلكتروني</span>
            <input className={inp} dir="ltr" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label><span className={label}>الجنس</span>
            <select className={inp} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option value="">—</option>
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
            </select></label>
          <label><span className={label}>تاريخ الميلاد</span>
            <input className={inp} type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} /></label>
          <label><span className={label}>الرقم القومي</span>
            <input className={inp} dir="ltr" value={form.national_id} onChange={(e) => setForm({ ...form, national_id: e.target.value })} /></label>
          <label><span className={label}>فصيلة الدم</span>
            <select className={inp} value={form.blood_type} onChange={(e) => setForm({ ...form, blood_type: e.target.value })}>
              <option value="">—</option>
              {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((b) => <option key={b} value={b}>{b}</option>)}
            </select></label>
          <label className="md:col-span-2"><span className={label}>العنوان</span>
            <input className={inp} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label>
        </div>
      </div>

      <div className={card}>
        <h3 className="font-semibold text-white mb-4">البيانات الطبية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label><span className={label}>جهة الاتصال في الطوارئ</span>
            <input className={inp} value={form.emergency_contact_name} onChange={(e) => setForm({ ...form, emergency_contact_name: e.target.value })} /></label>
          <label><span className={label}>هاتف جهة الاتصال</span>
            <input className={inp} dir="ltr" value={form.emergency_contact_phone} onChange={(e) => setForm({ ...form, emergency_contact_phone: e.target.value })} /></label>
          <label className="md:col-span-2"><span className={label}>تنبيهات طبية مهمة</span>
            <textarea className={inp} rows={2} value={form.medical_alerts} onChange={(e) => setForm({ ...form, medical_alerts: e.target.value })} /></label>
          <label className="md:col-span-2"><span className={label}>ملاحظات</span>
            <textarea className={inp} rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
        </div>
      </div>

      {err && <div className="rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3">{err}</div>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className={btnSm + ' !px-6 !py-2.5'}>
          {loading ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>}
          {isEdit ? 'حفظ التعديلات' : 'حفظ المريض'}
        </button>
        <button type="button" onClick={onCancel} className={btnGhost}>إلغاء</button>
      </div>
    </form>
  );
}

/* ============ APPOINTMENTS LIST ============ */
function Appointments({ setPage }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  async function load() {
    setLoading(true);
    let q = supabase.from('appointments').select('*, patient:patients(full_name, patient_code)').order('scheduled_start', { ascending: false }).limit(100);
    if (filterStatus) q = q.eq('status', filterStatus);
    const { data } = await q;
    setList(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [filterStatus]);

  async function updateStatus(id, status) {
    await supabase.from('appointments').update({ status }).eq('id', id);
    load();
  }

  async function handleDelete(id) {
    if (!confirm('حذف الموعد؟')) return;
    await supabase.from('appointments').delete().eq('id', id);
    load();
  }

  const statusMap = {
    scheduled: ['مجدول', 'bg-slate-500/20 text-slate-300'],
    confirmed: ['مؤكد', 'bg-blue-500/20 text-blue-300'],
    arrived: ['وصل', 'bg-cyan-500/20 text-cyan-300'],
    in_progress: ['جاري', 'bg-amber-500/20 text-amber-300'],
    completed: ['مكتمل', 'bg-emerald-500/20 text-emerald-300'],
    cancelled: ['ملغى', 'bg-red-500/20 text-red-300'],
    no_show: ['لم يحضر', 'bg-red-900/30 text-red-200'],
  };
  const typeMap = {
    consultation: 'استشارة', implant_surgery: 'جراحة زراعة', follow_up: 'متابعة',
    suture_removal: 'فك غرز', implant_loading: 'تركيب زرعة', crown_fitting: 'تركيب تاج',
    hygiene: 'تنظيف', emergency: 'طارئ', other: 'أخرى',
  };

  const NEXT = { scheduled: 'confirmed', confirmed: 'arrived', arrived: 'in_progress', in_progress: 'completed' };
  const NEXT_LBL = { scheduled: 'تأكيد', confirmed: 'حضور', arrived: 'بدء', in_progress: 'إكمال' };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={inp + ' !w-auto'}>
          <option value="">كل الحالات</option>
          {Object.entries(statusMap).map(([k, v]) => <option key={k} value={k}>{v[0]}</option>)}
        </select>
        <div className="flex-1" />
        <button onClick={() => setPage('appointment-new')} className={btnSm}><Plus size={16}/> موعد جديد</button>
      </div>

      <div className={card + ' !p-0 overflow-hidden'}>
        {loading ? (
          <div className="p-8 text-center text-slate-400">جاري التحميل...</div>
        ) : list.length === 0 ? (
          <div className="p-8 text-center text-slate-400">لا توجد مواعيد</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-slate-400 text-xs">
                <tr>
                  <th className="text-right px-4 py-3">التاريخ والوقت</th>
                  <th className="text-right px-4 py-3">المريض</th>
                  <th className="text-right px-4 py-3">النوع</th>
                  <th className="text-right px-4 py-3">الحالة</th>
                  <th className="text-right px-4 py-3">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {list.map((a) => {
                  const st = statusMap[a.status] || statusMap.scheduled;
                  const next = NEXT[a.status];
                  return (
                    <tr key={a.id} className="hover:bg-white/5">
                      <td className="px-4 py-3 text-slate-300 text-xs">{fmtDateTime(a.scheduled_start)}</td>
                      <td className="px-4 py-3 text-white">{a.patient?.full_name || '—'}</td>
                      <td className="px-4 py-3 text-slate-300 text-xs">{typeMap[a.appointment_type] || a.appointment_type}</td>
                      <td className="px-4 py-3">
                        <span className={'text-[11px] px-2 py-1 rounded-md border border-white/10 ' + st[1]}>{st[0]}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 items-center">
                          {next && (
                            <button onClick={() => updateStatus(a.id, next)} className="text-[11px] px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30">
                              {NEXT_LBL[a.status]}
                            </button>
                          )}
                          {a.status !== 'cancelled' && a.status !== 'completed' && (
                            <button onClick={() => updateStatus(a.id, 'cancelled')} className="text-[11px] px-2 py-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30">إلغاء</button>
                          )}
                          <button onClick={() => handleDelete(a.id)} className="text-red-400 hover:text-red-300"><Trash2 size={14}/></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ APPOINTMENT FORM ============ */
function AppointmentForm({ onSave, onCancel, presetPatientId }) {
  const [patients, setPatients] = useState([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [patientId, setPatientId] = useState(presetPatientId || '');
  const [type, setType] = useState('consultation');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState('10:00');
  const [duration, setDuration] = useState(30);
  const [complaint, setComplaint] = useState('');
  const [notes, setNotes] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      let q = supabase.from('patients').select('id, full_name, patient_code, phone').eq('is_active', true).limit(30);
      if (patientSearch) q = q.or(`full_name.ilike.%${patientSearch}%,phone.ilike.%${patientSearch}%,patient_code.ilike.%${patientSearch}%`);
      const { data } = await q;
      setPatients(data || []);
    })();
  }, [patientSearch]);

  async function submit(e) {
    e.preventDefault();
    setErr('');
    if (!patientId) { setErr('يرجى اختيار المريض'); return; }
    setLoading(true);
    const start = new Date(`${date}T${time}`);
    const end = new Date(start.getTime() + duration * 60000);
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from('appointments').insert({
      patient_id: patientId,
      doctor_id: userData?.user?.id || null,
      appointment_type: type,
      status: 'scheduled',
      scheduled_start: start.toISOString(),
      scheduled_end: end.toISOString(),
      duration_minutes: duration,
      chief_complaint: complaint || null,
      notes: notes || null,
    });
    setLoading(false);
    if (error) { setErr(error.message); return; }
    onSave();
  }

  const types = {
    consultation: 'استشارة', implant_surgery: 'جراحة زراعة', follow_up: 'متابعة',
    suture_removal: 'فك غرز', implant_loading: 'تركيب زرعة', crown_fitting: 'تركيب تاج',
    hygiene: 'تنظيف', emergency: 'طارئ', other: 'أخرى',
  };

  return (
    <form onSubmit={submit} className="space-y-5 max-w-2xl">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onCancel} className="text-slate-400 hover:text-white"><ArrowRight size={20}/></button>
        <h2 className="text-xl font-bold text-white">حجز موعد جديد</h2>
      </div>

      <div className={card + ' space-y-4'}>
        <div>
          <label className={label}>المريض *</label>
          {patientId ? (
            <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-2.5">
              <span className="flex-1 text-sm text-white">{patients.find((p) => p.id === patientId)?.full_name || 'محدد'}</span>
              <button type="button" onClick={() => setPatientId('')} className="text-xs text-slate-400 hover:text-white">تغيير</button>
            </div>
          ) : (
            <>
              <div className="relative">
                <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={patientSearch} onChange={(e) => setPatientSearch(e.target.value)} placeholder="ابحث عن مريض..." className={inp + ' pr-10'} />
              </div>
              <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-white/10 bg-white/[.02] divide-y divide-white/5">
                {patients.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-slate-500">لا نتائج</div>
                ) : patients.map((p) => (
                  <button type="button" key={p.id} onClick={() => { setPatientId(p.id); setPatientSearch(''); }} className="w-full text-right px-3 py-2 hover:bg-white/5 text-sm text-white">
                    <div>{p.full_name}</div>
                    <div className="text-xs text-slate-400" dir="ltr">{p.patient_code} · {p.phone}</div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <label><span className={label}>نوع الموعد *</span>
          <select className={inp} value={type} onChange={(e) => setType(e.target.value)}>
            {Object.entries(types).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select></label>

        <div className="grid grid-cols-2 gap-4">
          <label><span className={label}>التاريخ *</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inp} /></label>
          <label><span className={label}>الوقت *</span>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inp} /></label>
        </div>

        <label><span className={label}>المدة</span>
          <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className={inp}>
            {[15, 30, 45, 60, 90].map((d) => <option key={d} value={d}>{d} دقيقة</option>)}
          </select></label>

        <label><span className={label}>الشكوى الرئيسية</span>
          <textarea rows={2} className={inp} value={complaint} onChange={(e) => setComplaint(e.target.value)} /></label>

        <label><span className={label}>ملاحظات</span>
          <textarea rows={2} className={inp} value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
      </div>

      {err && <div className="rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3">{err}</div>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className={btnSm + ' !px-6 !py-2.5'}>
          {loading ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>}
          حفظ الموعد
        </button>
        <button type="button" onClick={onCancel} className={btnGhost}>إلغاء</button>
      </div>
    </form>
  );
}

/* ============ MAIN APP ============ */
export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      if (data.session?.user) {
        const { data: p } = await supabase.from('profiles').select('*').eq('id', data.session.user.id).single();
        if (p && !p.is_active) {
          await supabase.auth.signOut();
          setSession(null);
        } else {
          setProfile(p);
        }
      }
      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, sess) => {
      setSession(sess);
      if (sess?.user) {
        const { data: p } = await supabase.from('profiles').select('*').eq('id', sess.user.id).single();
        setProfile(p);
      } else {
        setProfile(null);
      }
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    setProfile(null);
    setSession(null);
  }

  if (loading) return <div dir="rtl" className="min-h-screen grid place-items-center text-slate-400">جاري التحميل...</div>;
  if (!session) return <Login onLogin={() => {}} />;

  const nav = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'patients', label: 'المرضى', icon: Users },
    { id: 'appointments', label: 'المواعيد', icon: Calendar },
  ];
  const current = nav.find((n) => n.id === page) || nav.find((n) => page.startsWith(n.id));

  return (
    <div dir="rtl" className="min-h-screen">
      <aside className={'fixed inset-y-0 right-0 z-40 w-72 border-l border-white/10 bg-[#0b1733]/95 backdrop-blur-xl transition-transform lg:translate-x-0 ' + (sidebarOpen ? 'translate-x-0' : 'translate-x-full')}>
        <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-700 grid place-items-center font-bold text-white">Z</div>
            <div>
              <div className="text-lg font-bold text-white leading-none">Zircon</div>
              <div className="text-[10px] text-blue-300/70 mt-0.5">Dental Surgical OS</div>
            </div>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
        </div>
        <nav className="p-4 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = page === item.id || page.startsWith(item.id + '-');
            return (
              <button key={item.id} onClick={() => { setPage(item.id); setSidebarOpen(false); }}
                className={'w-full flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition text-right ' +
                  (active ? 'bg-gradient-to-l from-blue-600/30 to-indigo-700/10 text-white border border-blue-500/30' : 'text-slate-300/80 hover:text-white hover:bg-white/5')}>
                <Icon size={18} className={active ? 'text-blue-400' : ''} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="lg:mr-72">
        <header className="sticky top-0 z-20 h-16 border-b border-white/10 bg-[#0b1733]/80 backdrop-blur-xl flex items-center px-4 lg:px-6 gap-3">
          <button className="lg:hidden text-slate-300" onClick={() => setSidebarOpen(true)}><Menu size={22} /></button>
          <h1 className="text-base lg:text-lg font-semibold text-white">
            {page === 'patient-new' ? 'مريض جديد' : page === 'appointment-new' ? 'موعد جديد' : current?.label}
          </h1>
          <div className="flex-1" />
          <button className="h-10 w-10 grid place-items-center rounded-lg hover:bg-white/5 text-slate-300"><Bell size={19} /></button>
          <div className="hidden md:block text-right">
            <div className="text-sm font-medium text-white leading-none">{profile?.full_name || 'مستخدم'}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {profile?.role === 'admin' ? 'مدير' : profile?.role === 'doctor' ? 'طبيب' : 'مساعد'}
            </div>
          </div>
          <button onClick={logout} className="h-10 w-10 grid place-items-center rounded-lg hover:bg-red-500/10 text-red-400"><LogOut size={18} /></button>
        </header>
        <main className="p-4 lg:p-6">
          {page === 'dashboard' && <Dashboard profile={profile} setPage={setPage} />}
          {page === 'patients' && <Patients setPage={setPage} setEditingPatient={setEditingPatient} />}
          {page === 'patient-new' && (
            <PatientForm
              patient={editingPatient}
              onSave={() => { setEditingPatient(null); setPage('patients'); }}
              onCancel={() => { setEditingPatient(null); setPage('patients'); }}
            />
          )}
          {page === 'appointments' && <Appointments setPage={setPage} />}
          {page === 'appointment-new' && <AppointmentForm onSave={() => setPage('appointments')} onCancel={() => setPage('appointments')} />}
        </main>
      </div>
    </div>
  );
                                                       }
