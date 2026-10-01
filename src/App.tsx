import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  LayoutDashboard, Users, Calendar, LogOut, Menu, Bell, X,
  Stethoscope, Syringe, Receipt, Image as ImageIcon,
  FileText, Settings as SettingsIcon, Plus, Search, Mail, Lock,
  Loader2, ArrowRight, Save, Trash2, Edit3, Upload, Download, Printer,
} from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const btn = 'w-full rounded-lg bg-gradient-to-l from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-semibold py-3 transition disabled:opacity-60 flex items-center justify-center gap-2';
const btnSm = 'rounded-lg bg-gradient-to-l from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-semibold px-4 py-2 text-sm transition disabled:opacity-60 flex items-center gap-2';
const btnGhost = 'rounded-lg bg-white/5 hover:bg-white/10 text-white px-4 py-2 text-sm transition';
const inp = 'w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60';
const card = 'rounded-xl border border-white/10 bg-white/[.03] backdrop-blur-xl p-5';
const label = 'block text-xs text-slate-400 mb-1.5';

function fmtDate(d) {
  if (!d) return '—';
  try { return new Intl.DateTimeFormat('ar-EG-u-nu-latn', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(d)); } catch { return '—'; }
}
function fmtDateTime(d) {
  if (!d) return '—';
  try { return new Intl.DateTimeFormat('ar-EG-u-nu-latn', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d)); } catch { return '—'; }
}
function money(n, c = 'SAR') {
  if (n == null) return '—';
  return `${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${c}`;
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
  const [recent, setRecent] = useState([]);
  const [appts, setAppts] = useState([]);
  useEffect(() => {
    (async () => {
      const start = new Date(); start.setHours(0,0,0,0);
      const end = new Date(); end.setHours(23,59,59,999);
      const mStart = new Date(); mStart.setDate(1); mStart.setHours(0,0,0,0);
      const [p, a, s, i] = await Promise.all([
        supabase.from('patients').select('*', { count: 'exact', head: true }),
        supabase.from('appointments').select('*', { count: 'exact', head: true }).gte('scheduled_start', start.toISOString()).lte('scheduled_start', end.toISOString()),
        supabase.from('surgeries').select('*', { count: 'exact', head: true }).gte('created_at', mStart.toISOString()),
        supabase.from('implants').select('*', { count: 'exact', head: true }).gte('created_at', mStart.toISOString()),
      ]);
      setStats({ patients: p.count || 0, today: a.count || 0, surgeries: s.count || 0, implants: i.count || 0 });
      const { data: rp } = await supabase.from('patients').select('*').order('created_at', { ascending: false }).limit(5);
      setRecent(rp || []);
      const { data: ta } = await supabase.from('appointments').select('*, patient:patients(full_name)').gte('scheduled_start', start.toISOString()).lte('scheduled_start', end.toISOString()).order('scheduled_start');
      setAppts(ta || []);
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
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setPage('patient-new')} className={btnSm}><Plus size={16}/> مريض</button>
          <button onClick={() => setPage('appointment-new')} className={btnSm}><Plus size={16}/> موعد</button>
          <button onClick={() => setPage('surgery-new')} className={btnSm}><Plus size={16}/> جراحة</button>
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
            <button onClick={() => setPage('patients')} className="text-xs text-blue-400">عرض الكل</button>
          </div>
          {recent.length === 0 ? <p className="text-sm text-slate-500">لا يوجد مرضى بعد</p> : (
            <div className="space-y-2">
              {recent.map((p) => (
                <div key={p.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                  <div className="h-9 w-9 rounded-full bg-blue-500/20 text-blue-300 grid place-items-center text-sm font-semibold">{p.full_name?.charAt(0) || '؟'}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">{p.full_name}</div>
                    <div className="text-xs text-slate-400" dir="ltr">{p.patient_code} · {p.phone}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={card}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">مواعيد اليوم</h3>
            <button onClick={() => setPage('appointments')} className="text-xs text-blue-400">عرض الكل</button>
          </div>
          {appts.length === 0 ? <p className="text-sm text-slate-500">لا توجد مواعيد اليوم</p> : (
            <div className="space-y-2">
              {appts.map((a) => (
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

/* ============ PATIENTS ============ */
function Patients({ setPage, setEditItem }) {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    let q = supabase.from('patients').select('*').order('created_at', { ascending: false }).limit(100);
    if (search) q = q.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%,patient_code.ilike.%${search}%`);
    const { data } = await q;
    setList(data || []); setLoading(false);
  }
  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [search]);
  async function del(id) {
    if (!confirm('حذف المريض؟')) return;
    await supabase.from('patients').delete().eq('id', id); load();
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث..." className={inp + ' pr-10'} />
        </div>
        <button onClick={() => { setEditItem(null); setPage('patient-new'); }} className={btnSm}><Plus size={16}/> مريض جديد</button>
      </div>
      <div className={card + ' !p-0 overflow-hidden'}>
        {loading ? <div className="p-8 text-center text-slate-400">جاري التحميل...</div> :
         list.length === 0 ? <div className="p-8 text-center text-slate-400">لا يوجد مرضى</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-slate-400 text-xs">
                <tr>
                  <th className="text-right px-4 py-3">رقم</th>
                  <th className="text-right px-4 py-3">الاسم</th>
                  <th className="text-right px-4 py-3">الجوال</th>
                  <th className="text-right px-4 py-3">الجنس</th>
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
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => { setEditItem(p); setPage('patient-new'); }} className="text-blue-400"><Edit3 size={16}/></button>
                        <button onClick={() => del(p.id)} className="text-red-400"><Trash2 size={16}/></button>
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

function PatientForm({ patient, onSave, onCancel }) {
  const isEdit = !!patient?.id;
  const [form, setForm] = useState({
    full_name: patient?.full_name || '', phone: patient?.phone || '',
    alternate_phone: patient?.alternate_phone || '', email: patient?.email || '',
    gender: patient?.gender || '', date_of_birth: patient?.date_of_birth || '',
    blood_type: patient?.blood_type || '', national_id: patient?.national_id || '',
    address: patient?.address || '', medical_alerts: patient?.medical_alerts || '',
    emergency_contact_name: patient?.emergency_contact_name || '',
    emergency_contact_phone: patient?.emergency_contact_phone || '',
    notes: patient?.notes || '',
  });
  const [err, setErr] = useState(''); const [loading, setLoading] = useState(false);
  async function submit(e) {
    e.preventDefault(); setErr('');
    if (!form.full_name.trim() || !form.phone.trim()) { setErr('الاسم والجوال مطلوبان'); return; }
    setLoading(true);
    const payload = { ...form, full_name: form.full_name.trim(), phone: form.phone.trim(), gender: form.gender || null };
    Object.keys(payload).forEach((k) => { if (payload[k] === '') payload[k] = null; });
    let res = isEdit ? await supabase.from('patients').update(payload).eq('id', patient.id) : await supabase.from('patients').insert(payload);
    setLoading(false);
    if (res.error) { setErr(res.error.message); return; }
    onSave();
  }
  return (
    <form onSubmit={submit} className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onCancel} className="text-slate-400"><ArrowRight size={20}/></button>
        <h2 className="text-xl font-bold text-white">{isEdit ? 'تعديل المريض' : 'إضافة مريض جديد'}</h2>
      </div>
      <div className={card}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label><span className={label}>الاسم *</span><input className={inp} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required /></label>
          <label><span className={label}>الجوال *</span><input className={inp} dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></label>
          <label><span className={label}>جوال بديل</span><input className={inp} dir="ltr" value={form.alternate_phone} onChange={(e) => setForm({ ...form, alternate_phone: e.target.value })} /></label>
          <label><span className={label}>البريد</span><input className={inp} dir="ltr" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label><span className={label}>الجنس</span>
            <select className={inp} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option value="">—</option><option value="male">ذكر</option><option value="female">أنثى</option>
            </select></label>
          <label><span className={label}>تاريخ الميلاد</span><input className={inp} type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} /></label>
          <label><span className={label}>الرقم القومي</span><input className={inp} dir="ltr" value={form.national_id} onChange={(e) => setForm({ ...form, national_id: e.target.value })} /></label>
          <label><span className={label}>فصيلة الدم</span>
            <select className={inp} value={form.blood_type} onChange={(e) => setForm({ ...form, blood_type: e.target.value })}>
              <option value="">—</option>
              {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((b) => <option key={b}>{b}</option>)}
            </select></label>
          <label className="md:col-span-2"><span className={label}>العنوان</span><input className={inp} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label>
          <label><span className={label}>جهة الطوارئ</span><input className={inp} value={form.emergency_contact_name} onChange={(e) => setForm({ ...form, emergency_contact_name: e.target.value })} /></label>
          <label><span className={label}>هاتف الطوارئ</span><input className={inp} dir="ltr" value={form.emergency_contact_phone} onChange={(e) => setForm({ ...form, emergency_contact_phone: e.target.value })} /></label>
          <label className="md:col-span-2"><span className={label}>تنبيهات طبية</span><textarea className={inp} rows={2} value={form.medical_alerts} onChange={(e) => setForm({ ...form, medical_alerts: e.target.value })} /></label>
          <label className="md:col-span-2"><span className={label}>ملاحظات</span><textarea className={inp} rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
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

/* ============ APPOINTMENTS ============ */
const APPT_STATUS = {
  scheduled: ['مجدول', 'bg-slate-500/20 text-slate-300'],
  confirmed: ['مؤكد', 'bg-blue-500/20 text-blue-300'],
  arrived: ['وصل', 'bg-cyan-500/20 text-cyan-300'],
  in_progress: ['جاري', 'bg-amber-500/20 text-amber-300'],
  completed: ['مكتمل', 'bg-emerald-500/20 text-emerald-300'],
  cancelled: ['ملغى', 'bg-red-500/20 text-red-300'],
  no_show: ['لم يحضر', 'bg-red-900/30 text-red-200'],
};
const APPT_TYPE = {
  consultation: 'استشارة', implant_surgery: 'جراحة زراعة', follow_up: 'متابعة',
  suture_removal: 'فك غرز', implant_loading: 'تركيب زرعة', crown_fitting: 'تركيب تاج',
  hygiene: 'تنظيف', emergency: 'طارئ', other: 'أخرى',
};

function Appointments({ setPage }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  async function load() {
    setLoading(true);
    let q = supabase.from('appointments').select('*, patient:patients(full_name)').order('scheduled_start', { ascending: false }).limit(100);
    if (filterStatus) q = q.eq('status', filterStatus);
    const { data } = await q; setList(data || []); setLoading(false);
  }
  useEffect(() => { load(); }, [filterStatus]);
  async function updateStatus(id, status) { await supabase.from('appointments').update({ status }).eq('id', id); load(); }
  async function del(id) { if (!confirm('حذف الموعد؟')) return; await supabase.from('appointments').delete().eq('id', id); load(); }
  const NEXT = { scheduled: 'confirmed', confirmed: 'arrived', arrived: 'in_progress', in_progress: 'completed' };
  const NEXT_LBL = { scheduled: 'تأكيد', confirmed: 'حضور', arrived: 'بدء', in_progress: 'إكمال' };
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={inp + ' !w-auto'}>
          <option value="">كل الحالات</option>
          {Object.entries(APPT_STATUS).map(([k, v]) => <option key={k} value={k}>{v[0]}</option>)}
        </select>
        <div className="flex-1" />
        <button onClick={() => setPage('appointment-new')} className={btnSm}><Plus size={16}/> موعد جديد</button>
      </div>
      <div className={card + ' !p-0 overflow-hidden'}>
        {loading ? <div className="p-8 text-center text-slate-400">جاري التحميل...</div> :
         list.length === 0 ? <div className="p-8 text-center text-slate-400">لا توجد مواعيد</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-slate-400 text-xs">
                <tr>
                  <th className="text-right px-4 py-3">التاريخ</th>
                  <th className="text-right px-4 py-3">المريض</th>
                  <th className="text-right px-4 py-3">النوع</th>
                  <th className="text-right px-4 py-3">الحالة</th>
                  <th className="text-right px-4 py-3">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {list.map((a) => {
                  const st = APPT_STATUS[a.status] || APPT_STATUS.scheduled;
                  const next = NEXT[a.status];
                  return (
                    <tr key={a.id} className="hover:bg-white/5">
                      <td className="px-4 py-3 text-slate-300 text-xs">{fmtDateTime(a.scheduled_start)}</td>
                      <td className="px-4 py-3 text-white">{a.patient?.full_name || '—'}</td>
                      <td className="px-4 py-3 text-slate-300 text-xs">{APPT_TYPE[a.appointment_type]}</td>
                      <td className="px-4 py-3">
                        <span className={'text-[11px] px-2 py-1 rounded-md border border-white/10 ' + st[1]}>{st[0]}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 items-center flex-wrap">
                          {next && <button onClick={() => updateStatus(a.id, next)} className="text-[11px] px-2 py-1 rounded bg-emerald-500/20 text-emerald-300">{NEXT_LBL[a.status]}</button>}
                          {a.status !== 'cancelled' && a.status !== 'completed' && (
                            <button onClick={() => updateStatus(a.id, 'cancelled')} className="text-[11px] px-2 py-1 rounded bg-red-500/20 text-red-300">إلغاء</button>
                          )}
                          <button onClick={() => del(a.id)} className="text-red-400"><Trash2 size={14}/></button>
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

function AppointmentForm({ onSave, onCancel }) {
  const [patients, setPatients] = useState([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [patientId, setPatientId] = useState('');
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
      const { data } = await q; setPatients(data || []);
    })();
  }, [patientSearch]);
  async function submit(e) {
    e.preventDefault(); setErr('');
    if (!patientId) { setErr('يرجى اختيار المريض'); return; }
    setLoading(true);
    const start = new Date(`${date}T${time}`);
    const end = new Date(start.getTime() + duration * 60000);
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from('appointments').insert({
      patient_id: patientId, doctor_id: u?.user?.id || null,
      appointment_type: type, status: 'scheduled',
      scheduled_start: start.toISOString(), scheduled_end: end.toISOString(),
      duration_minutes: duration, chief_complaint: complaint || null, notes: notes || null,
    });
    setLoading(false);
    if (error) { setErr(error.message); return; }
    onSave();
  }
  return (
    <form onSubmit={submit} className="space-y-5 max-w-2xl">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onCancel} className="text-slate-400"><ArrowRight size={20}/></button>
        <h2 className="text-xl font-bold text-white">حجز موعد جديد</h2>
      </div>
      <div className={card + ' space-y-4'}>
        <div>
          <label className={label}>المريض *</label>
          {patientId ? (
            <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-2.5">
              <span className="flex-1 text-sm text-white">{patients.find((p) => p.id === patientId)?.full_name || 'محدد'}</span>
              <button type="button" onClick={() => setPatientId('')} className="text-xs text-slate-400">تغيير</button>
            </div>
          ) : (
            <>
              <div className="relative">
                <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={patientSearch} onChange={(e) => setPatientSearch(e.target.value)} placeholder="ابحث..." className={inp + ' pr-10'} />
              </div>
              <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-white/10 bg-white/[.02] divide-y divide-white/5">
                {patients.map((p) => (
                  <button type="button" key={p.id} onClick={() => { setPatientId(p.id); setPatientSearch(''); }} className="w-full text-right px-3 py-2 hover:bg-white/5 text-sm text-white">
                    <div>{p.full_name}</div>
                    <div className="text-xs text-slate-400" dir="ltr">{p.patient_code} · {p.phone}</div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <label><span className={label}>النوع *</span>
          <select className={inp} value={type} onChange={(e) => setType(e.target.value)}>
            {Object.entries(APPT_TYPE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select></label>
        <div className="grid grid-cols-2 gap-4">
          <label><span className={label}>التاريخ *</span><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inp} /></label>
          <label><span className={label}>الوقت *</span><input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inp} /></label>
        </div>
        <label><span className={label}>المدة</span>
          <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className={inp}>
            {[15, 30, 45, 60, 90].map((d) => <option key={d} value={d}>{d} دقيقة</option>)}
          </select></label>
        <label><span className={label}>الشكوى الرئيسية</span><textarea rows={2} className={inp} value={complaint} onChange={(e) => setComplaint(e.target.value)} /></label>
        <label><span className={label}>ملاحظات</span><textarea rows={2} className={inp} value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
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

/* ============ SURGERIES ============ */
const SURG_TYPE = {
  single_implant: 'زرعة واحدة', multiple_implants: 'زرعات متعددة', full_arch: 'قوس كامل',
  bone_graft: 'طعم عظمي', sinus_lift: 'رفع جيب', extraction: 'خلع',
  implant_loading: 'تركيب زرعة', other: 'أخرى',
};
const SURG_STATUS = {
  planned: ['مخطط', 'bg-slate-500/20 text-slate-300'],
  scheduled: ['مجدول', 'bg-blue-500/20 text-blue-300'],
  in_progress: ['جاري', 'bg-amber-500/20 text-amber-300'],
  completed: ['مكتمل', 'bg-emerald-500/20 text-emerald-300'],
  cancelled: ['ملغى', 'bg-red-500/20 text-red-300'],
  postponed: ['مؤجل', 'bg-purple-500/20 text-purple-300'],
};

function Surgeries({ setPage, setEditItem }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  async function load() {
    setLoading(true);
    let q = supabase.from('surgeries').select('*, patient:patients(full_name)').order('created_at', { ascending: false }).limit(100);
    if (filterStatus) q = q.eq('status', filterStatus);
    const { data } = await q; setList(data || []); setLoading(false);
  }
  useEffect(() => { load(); }, [filterStatus]);
  async function del(id) { if (!confirm('حذف الجراحة؟')) return; await supabase.from('surgeries').delete().eq('id', id); load(); }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={inp + ' !w-auto'}>
          <option value="">كل الحالات</option>
          {Object.entries(SURG_STATUS).map(([k, v]) => <option key={k} value={k}>{v[0]}</option>)}
        </select>
        <div className="flex-1" />
        <button onClick={() => { setEditItem(null); setPage('surgery-new'); }} className={btnSm}><Plus size={16}/> جراحة جديدة</button>
      </div>
      <div className={card + ' !p-0 overflow-hidden'}>
        {loading ? <div className="p-8 text-center text-slate-400">جاري التحميل...</div> :
         list.length === 0 ? <div className="p-8 text-center text-slate-400">لا توجد جراحات</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-slate-400 text-xs">
                <tr>
                  <th className="text-right px-4 py-3">التاريخ</th>
                  <th className="text-right px-4 py-3">المريض</th>
                  <th className="text-right px-4 py-3">النوع</th>
                  <th className="text-right px-4 py-3">الحالة</th>
                  <th className="text-right px-4 py-3">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {list.map((s) => {
                  const st = SURG_STATUS[s.status] || SURG_STATUS.planned;
                  return (
                    <tr key={s.id} className="hover:bg-white/5">
                      <td className="px-4 py-3 text-slate-300 text-xs">{fmtDate(s.scheduled_date || s.created_at)}</td>
                      <td className="px-4 py-3 text-white">{s.patient?.full_name || '—'}</td>
                      <td className="px-4 py-3 text-slate-300 text-xs">{SURG_TYPE[s.surgery_type]}</td>
                      <td className="px-4 py-3">
                        <span className={'text-[11px] px-2 py-1 rounded-md border border-white/10 ' + st[1]}>{st[0]}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 items-center">
                          <button onClick={() => { setEditItem(s); setPage('surgery-detail'); }} className="text-blue-400 text-xs">عرض</button>
                          <button onClick={() => del(s.id)} className="text-red-400"><Trash2 size={14}/></button>
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

function SurgeryForm({ onSave, onCancel }) {
  const [patients, setPatients] = useState([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [patientId, setPatientId] = useState('');
  const [type, setType] = useState('single_implant');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState('10:00');
  const [anesthesia, setAnesthesia] = useState('');
  const [preOp, setPreOp] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      let q = supabase.from('patients').select('id, full_name, patient_code').eq('is_active', true).limit(30);
      if (patientSearch) q = q.or(`full_name.ilike.%${patientSearch}%,patient_code.ilike.%${patientSearch}%`);
      const { data } = await q; setPatients(data || []);
    })();
  }, [patientSearch]);
  async function submit(e) {
    e.preventDefault(); setErr('');
    if (!patientId) { setErr('يرجى اختيار المريض'); return; }
    setLoading(true);
    const scheduled = date && time ? new Date(`${date}T${time}`).toISOString() : null;
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from('surgeries').insert({
      patient_id: patientId, doctor_id: u?.user?.id || null,
      surgery_type: type, status: 'planned',
      scheduled_date: scheduled, anesthesia_type: anesthesia || null,
      pre_op_notes: preOp || null,
    });
    setLoading(false);
    if (error) { setErr(error.message); return; }
    onSave();
  }
  return (
    <form onSubmit={submit} className="space-y-5 max-w-2xl">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onCancel} className="text-slate-400"><ArrowRight size={20}/></button>
        <h2 className="text-xl font-bold text-white">جراحة جديدة</h2>
      </div>
      <div className={card + ' space-y-4'}>
        <div>
          <label className={label}>المريض *</label>
          {patientId ? (
            <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-2.5">
              <span className="flex-1 text-sm text-white">{patients.find((p) => p.id === patientId)?.full_name || 'محدد'}</span>
              <button type="button" onClick={() => setPatientId('')} className="text-xs text-slate-400">تغيير</button>
            </div>
          ) : (
            <>
              <div className="relative">
                <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={patientSearch} onChange={(e) => setPatientSearch(e.target.value)} placeholder="ابحث..." className={inp + ' pr-10'} />
              </div>
              <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-white/10 bg-white/[.02] divide-y divide-white/5">
                {patients.map((p) => (
                  <button type="button" key={p.id} onClick={() => { setPatientId(p.id); setPatientSearch(''); }} className="w-full text-right px-3 py-2 hover:bg-white/5 text-sm text-white">
                    <div>{p.full_name}</div>
                    <div className="text-xs text-slate-400">{p.patient_code}</div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <label><span className={label}>نوع الجراحة *</span>
          <select className={inp} value={type} onChange={(e) => setType(e.target.value)}>
            {Object.entries(SURG_TYPE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select></label>
        <div className="grid grid-cols-2 gap-4">
          <label><span className={label}>التاريخ</span><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inp} /></label>
          <label><span className={label}>الوقت</span><input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inp} /></label>
        </div>
        <label><span className={label}>نوع التخدير</span><input className={inp} value={anesthesia} onChange={(e) => setAnesthesia(e.target.value)} placeholder="موضعي / عام" /></label>
        <label><span className={label}>ملاحظات ما قبل العملية</span><textarea rows={3} className={inp} value={preOp} onChange={(e) => setPreOp(e.target.value)} /></label>
      </div>
      {err && <div className="rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3">{err}</div>}
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className={btnSm + ' !px-6 !py-2.5'}>
          {loading ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>}
          إنشاء الجراحة
        </button>
        <button type="button" onClick={onCancel} className={btnGhost}>إلغاء</button>
      </div>
    </form>
  );
}

function SurgeryDetail({ surgery, onBack }) {
  const [data, setData] = useState(surgery);
  const [implants, setImplants] = useState([]);
  const [showImplantModal, setShowImplantModal] = useState(false);
  const [tab, setTab] = useState('overview');

  async function load() {
    const { data: s } = await supabase.from('surgeries').select('*, patient:patients(full_name)').eq('id', surgery.id).single();
    setData(s);
    const { data: imp } = await supabase.from('implants').select('*').eq('surgery_id', surgery.id);
    setImplants(imp || []);
  }
  useEffect(() => { load(); }, []);

  async function updateStatus(patch) {
    await supabase.from('surgeries').update(patch).eq('id', surgery.id);
    load();
  }
  async function delImplant(id) {
    if (!confirm('حذف الزرعة؟')) return;
    await supabase.from('implants').delete().eq('id', id); load();
  }

  const st = SURG_STATUS[data?.status] || SURG_STATUS.planned;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-slate-400"><ArrowRight size={20}/></button>
        <h2 className="text-xl font-bold text-white">تفاصيل الجراحة</h2>
      </div>
      <div className={card}>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div>
            <div className="text-white font-semibold">{data?.patient?.full_name}</div>
            <div className="text-xs text-slate-400 mt-0.5">{SURG_TYPE[data?.surgery_type]} · {fmtDate(data?.scheduled_date)}</div>
          </div>
          <span className={'text-xs px-3 py-1.5 rounded-md border border-white/10 ' + st[1]}>{st[0]}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(data?.status === 'planned' || data?.status === 'scheduled') && (
            <button onClick={() => updateStatus({ status: 'in_progress', started_at: new Date().toISOString() })} className="rounded-lg bg-amber-500/80 hover:bg-amber-500 px-4 py-2 text-sm font-semibold text-white">بدء الجراحة</button>
          )}
          {data?.status === 'in_progress' && (
            <button onClick={() => updateStatus({ status: 'completed', completed_at: new Date().toISOString() })} className="rounded-lg bg-emerald-500/80 hover:bg-emerald-500 px-4 py-2 text-sm font-semibold text-white">إنهاء</button>
          )}
          <button onClick={() => updateStatus({ status: 'postponed' })} className="rounded-lg bg-purple-500/20 text-purple-300 px-4 py-2 text-sm">تأجيل</button>
          <button onClick={() => updateStatus({ status: 'cancelled' })} className="rounded-lg bg-red-500/10 text-red-400 px-4 py-2 text-sm">إلغاء</button>
        </div>
      </div>

      <div className="border-b border-white/10">
        <div className="flex gap-1">
          <button onClick={() => setTab('overview')} className={'px-4 py-2.5 text-sm border-b-2 ' + (tab === 'overview' ? 'border-blue-500 text-white' : 'border-transparent text-slate-400')}>نظرة عامة</button>
          <button onClick={() => setTab('implants')} className={'px-4 py-2.5 text-sm border-b-2 ' + (tab === 'implants' ? 'border-blue-500 text-white' : 'border-transparent text-slate-400')}>الزرعات ({implants.length})</button>
        </div>
      </div>

      {tab === 'overview' && (
        <div className={card + ' grid sm:grid-cols-2 gap-4 text-sm'}>
          <div><div className="text-xs text-slate-400">المريض</div><div className="text-white mt-1">{data?.patient?.full_name || '—'}</div></div>
          <div><div className="text-xs text-slate-400">النوع</div><div className="text-white mt-1">{SURG_TYPE[data?.surgery_type]}</div></div>
          <div><div className="text-xs text-slate-400">التاريخ</div><div className="text-white mt-1">{fmtDateTime(data?.scheduled_date)}</div></div>
          <div><div className="text-xs text-slate-400">التخدير</div><div className="text-white mt-1">{data?.anesthesia_type || '—'}</div></div>
          {data?.pre_op_notes && <div className="sm:col-span-2"><div className="text-xs text-slate-400">قبل العملية</div><div className="text-white mt-1">{data.pre_op_notes}</div></div>}
        </div>
      )}

      {tab === 'implants' && (
        <div className="space-y-4">
          <button onClick={() => setShowImplantModal(true)} className={btnSm}><Plus size={16}/> إضافة زرعة</button>
          {implants.length === 0 ? (
            <div className={card + ' text-center text-slate-400'}>لا توجد زرعات مسجلة</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {implants.map((im) => (
                <div key={im.id} className={card}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-3xl font-bold text-emerald-400" dir="ltr">{im.tooth_number}</div>
                    <button onClick={() => delImplant(im.id)} className="text-red-400"><Trash2 size={14}/></button>
                  </div>
                  <div className="text-sm text-white">{im.brand || '—'} {im.model && `· ${im.model}`}</div>
                  <div className="text-xs text-slate-300 mt-1" dir="ltr">{im.diameter_mm || '—'} × {im.length_mm || '—'} mm</div>
                  <div className="text-xs text-amber-300 mt-1" dir="ltr">Torque: {im.torque_ncm || '—'} N·cm</div>
                  <div className="text-xs text-slate-400 mt-1">كثافة: {im.bone_density || '—'}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showImplantModal && (
        <ImplantModal
          surgeryId={surgery.id}
          patientId={data?.patient_id}
          onClose={() => setShowImplantModal(false)}
          onSave={() => { setShowImplantModal(false); load(); }}
        />
      )}
    </div>
  );
}

/* ============ IMPLANT MODAL ============ */
function ImplantModal({ surgeryId, patientId, onClose, onSave }) {
  const [form, setForm] = useState({
    tooth_number: 11, brand: '', brand_other: '', model: '',
    diameter_mm: '', length_mm: '', torque_ncm: '', bone_density: '',
    graft_type: '', graft_volume_cc: '', membrane_type: '',
    insertion_depth_mm: '', healing_notes: '',
  });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const ALL_TEETH = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28,48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];
  const BRANDS = { straumann: 'Straumann', nobel_biocare: 'Nobel Biocare', dentsply: 'Dentsply', zimmer: 'Zimmer', mega_gen: 'Mega Gen', osstem: 'Osstem', other: 'أخرى' };
  const DENSITY = ['D1', 'D2', 'D3', 'D4'];

  function quadrantOf(t) {
    if (t >= 11 && t <= 18) return 1;
    if (t >= 21 && t <= 28) return 2;
    if (t >= 31 && t <= 38) return 3;
    return 4;
  }

  async function submit(e) {
    e.preventDefault(); setErr(''); setLoading(true);
    const { error } = await supabase.from('implants').insert({
      patient_id: patientId, surgery_id: surgeryId,
      tooth_number: form.tooth_number, quadrant: quadrantOf(form.tooth_number),
      status: 'placed',
      brand: form.brand || null, brand_other: form.brand === 'other' ? form.brand_other : null,
      model: form.model || null,
      diameter_mm: form.diameter_mm ? Number(form.diameter_mm) : null,
      length_mm: form.length_mm ? Number(form.length_mm) : null,
      torque_ncm: form.torque_ncm ? Number(form.torque_ncm) : null,
      bone_density: form.bone_density || null,
      graft_type: form.graft_type || null,
      graft_volume_cc: form.graft_volume_cc ? Number(form.graft_volume_cc) : null,
      membrane_type: form.membrane_type || null,
      insertion_depth_mm: form.insertion_depth_mm ? Number(form.insertion_depth_mm) : null,
      healing_notes: form.healing_notes || null,
      placed_at: new Date().toISOString(),
    });
    if (!error) {
      await supabase.from('tooth_chart').update({ current_state: 'implant' }).eq('patient_id', patientId).eq('tooth_number', form.tooth_number);
    }
    setLoading(false);
    if (error) { setErr(error.message); return; }
    onSave();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-xl border border-white/10 bg-[#0b1733] my-8">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <h3 className="text-white font-semibold">إضافة زرعة</h3>
          <button onClick={onClose} className="text-slate-400"><X size={18}/></button>
        </div>
        <form onSubmit={submit} className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          <label><span className={label}>السن *</span>
            <select className={inp} value={form.tooth_number} onChange={(e) => setForm({ ...form, tooth_number: Number(e.target.value) })}>
              {ALL_TEETH.map((n) => <option key={n} value={n}>{n}</option>)}
            </select></label>
          <label><span className={label}>الماركة</span>
            <select className={inp} value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })}>
              <option value="">—</option>
              {Object.entries(BRANDS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select></label>
          {form.brand === 'other' && (
            <label><span className={label}>اسم الماركة</span><input className={inp} value={form.brand_other} onChange={(e) => setForm({ ...form, brand_other: e.target.value })} /></label>
          )}
          <label><span className={label}>الموديل</span><input className={inp} value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} /></label>
          <label><span className={label}>القطر (mm)</span><input type="number" step="0.1" className={inp} value={form.diameter_mm} onChange={(e) => setForm({ ...form, diameter_mm: e.target.value })} /></label>
          <label><span className={label}>الطول (mm)</span><input type="number" step="0.1" className={inp} value={form.length_mm} onChange={(e) => setForm({ ...form, length_mm: e.target.value })} /></label>
          <label><span className={label}>العزم (N·cm)</span><input type="number" step="0.1" className={inp + ' border-amber-500/40'} value={form.torque_ncm} onChange={(e) => setForm({ ...form, torque_ncm: e.target.value })} /></label>
          <label><span className={label}>كثافة العظم</span>
            <select className={inp} value={form.bone_density} onChange={(e) => setForm({ ...form, bone_density: e.target.value })}>
              <option value="">—</option>
              {DENSITY.map((d) => <option key={d}>{d}</option>)}
            </select></label>
          <label><span className={label}>نوع الطعم</span><input className={inp} value={form.graft_type} onChange={(e) => setForm({ ...form, graft_type: e.target.value })} /></label>
          <label><span className={label}>حجم الطعم (cc)</span><input type="number" step="0.01" className={inp} value={form.graft_volume_cc} onChange={(e) => setForm({ ...form, graft_volume_cc: e.target.value })} /></label>
          <label><span className={label}>نوع الغشاء</span><input className={inp} value={form.membrane_type} onChange={(e) => setForm({ ...form, membrane_type: e.target.value })} /></label>
          <label><span className={label}>عمق الإدخال (mm)</span><input type="number" step="0.1" className={inp} value={form.insertion_depth_mm} onChange={(e) => setForm({ ...form, insertion_depth_mm: e.target.value })} /></label>
          <label className="md:col-span-2"><span className={label}>ملاحظات الشفاء</span><textarea rows={2} className={inp} value={form.healing_notes} onChange={(e) => setForm({ ...form, healing_notes: e.target.value })} /></label>
          {err && <div className="md:col-span-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3">{err}</div>}
          <div className="md:col-span-2 flex justify-end gap-2 pt-2 border-t border-white/10">
            <button type="button" onClick={onClose} className={btnGhost}>إلغاء</button>
            <button type="submit" disabled={loading} className={btnSm + ' !px-5'}>
              {loading && <Loader2 className="animate-spin" size={16}/>} حفظ الزرعة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============ IMPLANTS LIST ============ */
function Implants({ onBack }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('implants').select('*, patient:patients(full_name)').order('created_at', { ascending: false }).limit(100);
      setList(data || []); setLoading(false);
    })();
  }, []);
  return (
    <div className="space-y-4">
      <div className={card + ' !p-0 overflow-hidden'}>
        {loading ? <div className="p-8 text-center text-slate-400">جاري التحميل...</div> :
         list.length === 0 ? <div className="p-8 text-center text-slate-400">لا توجد زرعات</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-slate-400 text-xs">
                <tr>
                  <th className="text-right px-4 py-3">التاريخ</th>
                  <th className="text-right px-4 py-3">المريض</th>
                  <th className="text-right px-4 py-3">السن</th>
                  <th className="text-right px-4 py-3">الماركة</th>
                  <th className="text-right px-4 py-3">المقاس</th>
                  <th className="text-right px-4 py-3">العزم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {list.map((im) => (
                  <tr key={im.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 text-slate-300 text-xs">{fmtDate(im.placed_at || im.created_at)}</td>
                    <td className="px-4 py-3 text-white">{im.patient?.full_name || '—'}</td>
                    <td className="px-4 py-3 text-emerald-300 font-bold" dir="ltr">{im.tooth_number}</td>
                    <td className="px-4 py-3 text-slate-300 text-xs">{im.brand || '—'}</td>
                    <td className="px-4 py-3 text-slate-300 text-xs" dir="ltr">{im.diameter_mm || '—'} × {im.length_mm || '—'}</td>
                    <td className="px-4 py-3 text-amber-300 text-xs" dir="ltr">{im.torque_ncm || '—'}</td>
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

/* ============ INVOICES ============ */
function Invoices({ setPage, setEditItem }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    const { data } = await supabase.from('invoices').select('*, patient:patients(full_name)').order('created_at', { ascending: false }).limit(100);
    setList(data || []); setLoading(false);
  }
  useEffect(() => { load(); }, []);
  async function del(id) {
    if (!confirm('حذف الفاتورة؟')) return;
    await supabase.from('invoice_items').delete().eq('invoice_id', id);
    await supabase.from('payments').delete().eq('invoice_id', id);
    await supabase.from('invoices').delete().eq('id', id);
    load();
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1" />
        <button onClick={() => { setEditItem(null); setPage('invoice-new'); }} className={btnSm}><Plus size={16}/> فاتورة جديدة</button>
      </div>
      <div className={card + ' !p-0 overflow-hidden'}>
        {loading ? <div className="p-8 text-center text-slate-400">جاري التحميل...</div> :
         list.length === 0 ? <div className="p-8 text-center text-slate-400">لا توجد فواتير</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-slate-400 text-xs">
                <tr>
                  <th className="text-right px-4 py-3">رقم</th>
                  <th className="text-right px-4 py-3">المريض</th>
                  <th className="text-right px-4 py-3">الإجمالي</th>
                  <th className="text-right px-4 py-3">المدفوع</th>
                  <th className="text-right px-4 py-3">المتبقي</th>
                  <th className="text-right px-4 py-3">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {list.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 font-mono text-blue-300 text-xs" dir="ltr">{inv.invoice_number}</td>
                    <td className="px-4 py-3 text-white">{inv.patient?.full_name || '—'}</td>
                    <td className="px-4 py-3 text-white text-xs" dir="ltr">{money(inv.total_amount, inv.currency)}</td>
                    <td className="px-4 py-3 text-emerald-300 text-xs" dir="ltr">{money(inv.paid_amount, inv.currency)}</td>
                    <td className="px-4 py-3 text-red-300 text-xs" dir="ltr">{money(inv.balance_amount, inv.currency)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => { setEditItem(inv); setPage('invoice-detail'); }} className="text-blue-400 text-xs">عرض</button>
                        <button onClick={() => del(inv.id)} className="text-red-400"><Trash2 size={14}/></button>
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

function InvoiceForm({ onSave, onCancel }) {
  const [patients, setPatients] = useState([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [patientId, setPatientId] = useState('');
  const [items, setItems] = useState([{ description: '', quantity: '1', unit_price: '' }]);
  const [discount, setDiscount] = useState('');
  const [tax, setTax] = useState('');
  const [currency, setCurrency] = useState('SAR');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      let q = supabase.from('patients').select('id, full_name, patient_code').limit(30);
      if (patientSearch) q = q.or(`full_name.ilike.%${patientSearch}%,patient_code.ilike.%${patientSearch}%`);
      const { data } = await q; setPatients(data || []);
    })();
  }, [patientSearch]);
  const subtotal = items.reduce((s, it) => s + (Number(it.quantity) || 0) * (Number(it.unit_price) || 0), 0);
  const disc = Number(discount) || 0;
  const taxN = Number(tax) || 0;
  const total = Math.max(0, subtotal - disc + taxN);
  async function submit(e) {
    e.preventDefault(); setErr('');
    if (!patientId) { setErr('يرجى اختيار المريض'); return; }
    const valid = items.filter((it) => it.description.trim() && Number(it.unit_price) >= 0);
    if (valid.length === 0) { setErr('أضف بنداً واحداً على الأقل'); return; }
    setLoading(true);
    const { data: inv, error: ierr } = await supabase.from('invoices').insert({
      patient_id: patientId, status: 'issued', issue_date: new Date().toISOString().slice(0, 10),
      subtotal, discount_amount: disc, tax_amount: taxN, total_amount: total, currency,
    }).select().single();
    if (ierr) { setLoading(false); setErr(ierr.message); return; }
    const { error: lerr } = await supabase.from('invoice_items').insert(
      valid.map((it) => ({
        invoice_id: inv.id, description: it.description.trim(),
        quantity: Number(it.quantity) || 1, unit_price: Number(it.unit_price) || 0, discount_amount: 0,
      }))
    );
    setLoading(false);
    if (lerr) { setErr(lerr.message); return; }
    onSave();
  }
  return (
    <form onSubmit={submit} className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onCancel} className="text-slate-400"><ArrowRight size={20}/></button>
        <h2 className="text-xl font-bold text-white">فاتورة جديدة</h2>
      </div>
      <div className={card + ' space-y-4'}>
        <div>
          <label className={label}>المريض *</label>
          {patientId ? (
            <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-2.5">
              <span className="flex-1 text-sm text-white">{patients.find((p) => p.id === patientId)?.full_name}</span>
              <button type="button" onClick={() => setPatientId('')} className="text-xs text-slate-400">تغيير</button>
            </div>
          ) : (
            <>
              <div className="relative">
                <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={patientSearch} onChange={(e) => setPatientSearch(e.target.value)} placeholder="ابحث..." className={inp + ' pr-10'} />
              </div>
              <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-white/10 bg-white/[.02] divide-y divide-white/5">
                {patients.map((p) => (
                  <button type="button" key={p.id} onClick={() => { setPatientId(p.id); setPatientSearch(''); }} className="w-full text-right px-3 py-2 hover:bg-white/5 text-sm text-white">
                    <div>{p.full_name}</div><div className="text-xs text-slate-400">{p.patient_code}</div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <div className={card + ' space-y-3'}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white text-sm">البنود</h3>
          <button type="button" onClick={() => setItems([...items, { description: '', quantity: '1', unit_price: '' }])} className="text-xs text-blue-400 flex items-center gap-1"><Plus size={14}/> بند</button>
        </div>
        {items.map((it, i) => (
          <div key={i} className="grid grid-cols-12 gap-2">
            <input className={inp + ' col-span-6'} placeholder="الوصف" value={it.description} onChange={(e) => { const a = [...items]; a[i].description = e.target.value; setItems(a); }} />
            <input className={inp + ' col-span-2'} type="number" placeholder="كمية" value={it.quantity} onChange={(e) => { const a = [...items]; a[i].quantity = e.target.value; setItems(a); }} />
            <input className={inp + ' col-span-3'} type="number" step="0.01" placeholder="سعر" value={it.unit_price} onChange={(e) => { const a = [...items]; a[i].unit_price = e.target.value; setItems(a); }} />
            <button type="button" onClick={() => setItems(items.filter((_, x) => x !== i))} className="col-span-1 rounded-lg bg-red-500/10 text-red-400 grid place-items-center"><Trash2 size={14}/></button>
          </div>
        ))}
      </div>
      <div className={card + ' space-y-3'}>
        <div className="grid grid-cols-3 gap-3">
          <label><span className={label}>خصم</span><input type="number" step="0.01" className={inp} value={discount} onChange={(e) => setDiscount(e.target.value)} /></label>
          <label><span className={label}>ضريبة</span><input type="number" step="0.01" className={inp} value={tax} onChange={(e) => setTax(e.target.value)} /></label>
          <label><span className={label}>عملة</span>
            <select className={inp} value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option>SAR</option><option>AED</option><option>EGP</option><option>USD</option>
            </select></label>
        </div>
        <div className="border-t border-white/10 pt-3 space-y-1.5 text-sm">
          <div className="flex justify-between text-slate-300"><span>المجموع</span><span dir="ltr">{money(subtotal, currency)}</span></div>
          <div className="flex justify-between text-slate-300"><span>الخصم</span><span dir="ltr">{money(-disc, currency)}</span></div>
          <div className="flex justify-between text-slate-300"><span>الضريبة</span><span dir="ltr">{money(taxN, currency)}</span></div>
          <div className="flex justify-between text-white font-bold"><span>الإجمالي</span><span dir="ltr">{money(total, currency)}</span></div>
        </div>
      </div>
      {err && <div className="rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3">{err}</div>}
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className={btnSm + ' !px-6 !py-2.5'}>
          {loading && <Loader2 className="animate-spin" size={16}/>} إنشاء الفاتورة
        </button>
        <button type="button" onClick={onCancel} className={btnGhost}>إلغاء</button>
      </div>
    </form>
  );
}

function InvoiceDetail({ invoice, onBack }) {
  const [data, setData] = useState(invoice);
  const [items, setItems] = useState([]);
  const [payments, setPayments] = useState([]);
  const [showPay, setShowPay] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('cash');
  async function load() {
    const { data: inv } = await supabase.from('invoices').select('*, patient:patients(full_name)').eq('id', invoice.id).single();
    setData(inv);
    const { data: it } = await supabase.from('invoice_items').select('*').eq('invoice_id', invoice.id);
    setItems(it || []);
    const { data: p } = await supabase.from('payments').select('*').eq('invoice_id', invoice.id).order('payment_date', { ascending: false });
    setPayments(p || []);
  }
  useEffect(() => { load(); }, []);
  async function addPayment() {
    const amt = Number(payAmount);
    if (!amt || amt <= 0) return;
    await supabase.from('payments').insert({ invoice_id: invoice.id, amount: amt, method: payMethod, payment_date: new Date().toISOString() });
    setShowPay(false); setPayAmount(''); load();
  }
  const cur = data?.currency || 'SAR';
  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-slate-400"><ArrowRight size={20}/></button>
        <h2 className="text-xl font-bold text-white">فاتورة {data?.invoice_number}</h2>
      </div>
      <div className={card}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm text-slate-400">المريض</div>
            <div className="text-white font-semibold mt-1">{data?.patient?.full_name}</div>
          </div>
          <button onClick={() => window.print()} className="rounded-lg bg-white/5 hover:bg-white/10 p-2"><Printer size={16}/></button>
        </div>
      </div>
      <div className={card}>
        <h3 className="font-semibold text-white mb-3 text-sm">البنود</h3>
        <table className="w-full text-sm">
          <thead className="text-slate-400 text-xs border-b border-white/10">
            <tr><th className="text-right py-2">الوصف</th><th className="text-right py-2">كمية</th><th className="text-right py-2">سعر</th><th className="text-right py-2">إجمالي</th></tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((it) => (
              <tr key={it.id}>
                <td className="py-2 text-white">{it.description}</td>
                <td className="py-2 text-slate-300" dir="ltr">{it.quantity}</td>
                <td className="py-2 text-slate-300" dir="ltr">{money(it.unit_price, cur)}</td>
                <td className="py-2 text-white" dir="ltr">{money(it.line_total, cur)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-white/10 mt-3 pt-3 space-y-1.5 text-sm max-w-xs mr-auto">
          <div className="flex justify-between text-slate-300"><span>المجموع</span><span dir="ltr">{money(data?.subtotal, cur)}</span></div>
          {data?.discount_amount > 0 && <div className="flex justify-between text-slate-300"><span>خصم</span><span dir="ltr">{money(-data.discount_amount, cur)}</span></div>}
          {data?.tax_amount > 0 && <div className="flex justify-between text-slate-300"><span>ضريبة</span><span dir="ltr">{money(data.tax_amount, cur)}</span></div>}
          <div className="flex justify-between text-white font-bold"><span>الإجمالي</span><span dir="ltr">{money(data?.total_amount, cur)}</span></div>
          <div className="flex justify-between text-emerald-300"><span>مدفوع</span><span dir="ltr">{money(data?.paid_amount, cur)}</span></div>
          <div className="flex justify-between text-red-300 font-bold"><span>متبقي</span><span dir="ltr">{money(data?.balance_amount, cur)}</span></div>
        </div>
      </div>
      <div className={card}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white text-sm">المدفوعات</h3>
          {data?.balance_amount > 0 && <button onClick={() => setShowPay(true)} className="text-xs text-blue-400 flex items-center gap-1"><Plus size={14}/> دفعة</button>}
        </div>
        {payments.length === 0 ? <p className="text-sm text-slate-500">لا دفعات</p> : (
          <ul className="divide-y divide-white/5">
            {payments.map((p) => (
              <li key={p.id} className="py-2 flex justify-between text-sm">
                <span className="text-white" dir="ltr">{money(p.amount, cur)}</span>
                <span className="text-xs text-slate-400">{fmtDate(p.payment_date)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {showPay && (
        <div className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4">
          <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#0b1733] p-5 space-y-3">
            <h3 className="text-white font-semibold">تسجيل دفعة</h3>
            <label><span className={label}>المبلغ</span><input type="number" step="0.01" className={inp} value={payAmount} onChange={(e) => setPayAmount(e.target.value)} /></label>
            <label><span className={label}>الطريقة</span>
              <select className={inp} value={payMethod} onChange={(e) => setPayMethod(e.target.value)}>
                <option value="cash">نقداً</option><option value="card">بطاقة</option>
                <option value="bank_transfer">تحويل</option><option value="other">أخرى</option>
              </select></label>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowPay(false)} className={btnGhost}>إلغاء</button>
              <button onClick={addPayment} className={btnSm}>حفظ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============ MEDIA ============ */
function Media() {
  const [patients, setPatients] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientId, setPatientId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [category, setCategory] = useState('xray_panoramic');
  const [file, setFile] = useState(null);

  async function load() {
    setLoading(true);
    const { data: p } = await supabase.from('patients').select('id, full_name, patient_code').order('full_name');
    setPatients(p || []);
    let q = supabase.from('files').select('*, patient:patients(full_name)').order('created_at', { ascending: false }).limit(100);
    if (patientId) q = q.eq('patient_id', patientId);
    const { data: f } = await q;
    setFiles(f || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, [patientId]);

  async function upload() {
    if (!file || !patientId) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${patientId}/${Date.now()}.${ext}`;
    const { error: uerr } = await supabase.storage.from('patient-files').upload(path, file);
    if (!uerr) {
      await supabase.from('files').insert({
        patient_id: patientId, category, file_name: file.name, file_path: path,
        file_size: file.size, mime_type: file.type, title: file.name,
      });
    }
    setUploading(false);
    setShowUpload(false); setFile(null); load();
  }

  async function del(f) {
    if (!confirm('حذف الملف؟')) return;
    await supabase.storage.from('patient-files').remove([f.file_path]);
    await supabase.from('files').delete().eq('id', f.id);
    load();
  }

  const CATS = {
    xray_panoramic: 'أشعة بانورامية', xray_periapical: 'أشعة ذروية', xray_cbct: 'CBCT',
    photo_clinical: 'صورة سريرية', photo_before: 'قبل', photo_after: 'بعد',
    consent: 'إقرار', document: 'مستند', lab_report: 'تقرير مختبر', invoice: 'فاتورة', other: 'أخرى',
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <select value={patientId} onChange={(e) => setPatientId(e.target.value)} className={inp + ' !w-auto'}>
          <option value="">كل المرضى</option>
          {patients.map((p) => <option key={p.id} value={p.id}>{p.full_name}</option>)}
        </select>
        <div className="flex-1" />
        <button onClick={() => setShowUpload(true)} disabled={!patientId} className={btnSm}><Upload size={16}/> رفع ملف</button>
      </div>
      {files.length === 0 ? (
        <div className={card + ' text-center text-slate-400'}>لا توجد ملفات</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((f) => {
            const { data } = supabase.storage.from('patient-files').getPublicUrl(f.file_path);
            const url = data?.publicUrl;
            const isImg = f.mime_type?.startsWith('image/');
            return (
              <div key={f.id} className={card + ' !p-0 overflow-hidden'}>
                <a href={url} target="_blank" rel="noreferrer" className="aspect-video bg-black/30 grid place-items-center">
                  {isImg ? <img src={url} alt="" className="w-full h-full object-cover" /> : <FileText size={40} className="text-slate-500" />}
                </a>
                <div className="p-3">
                  <div className="text-sm text-white truncate">{f.title || f.file_name}</div>
                  <div className="text-xs text-slate-400 mt-1">{CATS[f.category]}</div>
                  <div className="flex justify-end mt-2">
                    <button onClick={() => del(f)} className="text-red-400"><Trash2 size={14}/></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {showUpload && (
        <div className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4">
          <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#0b1733] p-5 space-y-3">
            <h3 className="text-white font-semibold">رفع ملف</h3>
            <label><span className={label}>النوع</span>
              <select className={inp} value={category} onChange={(e) => setCategory(e.target.value)}>
                {Object.entries(CATS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select></label>
            <label><span className={label}>الملف</span>
              <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white" /></label>
            {uploading && <div className="text-xs text-blue-300">جاري الرفع...</div>}
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowUpload(false)} className={btnGhost}>إلغاء</button>
              <button onClick={upload} disabled={!file || uploading} className={btnSm}>رفع</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============ REPORTS ============ */
function Reports() {
  const [stats, setStats] = useState({ patients: 0, appts: 0, surg: 0, imp: 0 });
  useEffect(() => {
    (async () => {
      const [p, a, s, i] = await Promise.all([
        supabase.from('patients').select('*', { count: 'exact', head: true }),
        supabase.from('appointments').select('*', { count: 'exact', head: true }),
        supabase.from('surgeries').select('*', { count: 'exact', head: true }),
        supabase.from('implants').select('*', { count: 'exact', head: true }),
      ]);
      setStats({ patients: p.count || 0, appts: a.count || 0, surg: s.count || 0, imp: i.count || 0 });
    })();
  }, []);
  const Stat = ({ label, value, tone }) => (
    <div className={card}>
      <div className="text-2xl font-bold" style={{ color: tone }}>{value}</div>
      <div className="text-sm text-slate-400 mt-1">{label}</div>
    </div>
  );
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="إجمالي المرضى" value={stats.patients} tone="#93c5fd" />
        <Stat label="إجمالي المواعيد" value={stats.appts} tone="#86efac" />
        <Stat label="إجمالي الجراحات" value={stats.surg} tone="#d8b4fe" />
        <Stat label="إجمالي الزرعات" value={stats.imp} tone="#fcd34d" />
      </div>
      <div className={card}>
        <p className="text-sm text-slate-400">التقارير المتقدمة قادمة قريباً</p>
      </div>
    </div>
  );
}

/* ============ SETTINGS ============ */
function Settings({ profile }) {
  const [name, setName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  async function save() {
    setLoading(true);
    await supabase.from('profiles').update({ full_name: name, phone: phone || null }).eq('id', profile.id);
    setLoading(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  }
  return (
    <div className={card + ' space-y-4 max-w-xl'}>
      <h3 className="font-semibold text-white">الملف الشخصي</h3>
      <label><span className={label}>الاسم</span><input className={inp} value={name} onChange={(e) => setName(e.target.value)} /></label>
      <label><span className={label}>البريد</span><input className={inp} value={profile?.email || ''} disabled /></label>
      <label><span className={label}>الهاتف</span><input className={inp} dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
      <label><span className={label}>الدور</span><input className={inp} value={profile?.role === 'admin' ? 'مدير' : profile?.role === 'doctor' ? 'طبيب' : 'مساعد'} disabled /></label>
      <div className="flex items-center gap-3">
        <button onClick={save} disabled={loading} className={btnSm}>{loading ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>} حفظ</button>
        {saved && <span className="text-sm text-emerald-400">تم الحفظ</span>}
      </div>
    </div>
  );
}

/* ============ MAIN APP ============ */
export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    let m = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!m) return;
      setSession(data.session);
      if (data.session?.user) {
        const { data: p } = await supabase.from('profiles').select('*').eq('id', data.session.user.id).single();
        if (p && !p.is_active) { await supabase.auth.signOut(); setSession(null); }
        else setProfile(p);
      }
      setLoading(false);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, s) => {
      setSession(s);
      if (s?.user) {
        const { data: p } = await supabase.from('profiles').select('*').eq('id', s.user.id).single();
        setProfile(p);
      } else setProfile(null);
    });
    return () => { m = false; sub.subscription.unsubscribe(); };
  }, []);

  async function logout() { await supabase.auth.signOut(); setProfile(null); setSession(null); }

  if (loading) return <div dir="rtl" className="min-h-screen grid place-items-center text-slate-400">جاري التحميل...</div>;
  if (!session) return <Login onLogin={() => {}} />;

  const nav = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'patients', label: 'المرضى', icon: Users },
    { id: 'appointments', label: 'المواعيد', icon: Calendar },
    { id: 'surgeries', label: 'الجراحات', icon: Stethoscope },
    { id: 'implants', label: 'الزرعات', icon: Syringe },
    { id: 'media', label: 'الأرشيف', icon: ImageIcon },
    { id: 'invoices', label: 'الفواتير', icon: Receipt },
    { id: 'reports', label: 'التقارير', icon: FileText },
    { id: 'settings', label: 'الإعدادات', icon: SettingsIcon },
  ];
  const current = nav.find((n) => page === n.id || page.startsWith(n.id));

  const titles = {
    'patient-new': 'مريض جديد', 'appointment-new': 'موعد جديد',
    'surgery-new': 'جراحة جديدة', 'surgery-detail': 'تفاصيل الجراحة',
    'invoice-new': 'فاتورة جديدة', 'invoice-detail': 'تفاصيل الفاتورة',
  };

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
          <button className="lg:hidden text-slate-400" onClick={() => setSidebarOpen(false)}><X size={20}/></button>
        </div>
        <nav className="p-4 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
          {nav.map((item) => {
            const Icon = item.icon;
            const active = page === item.id || page.startsWith(item.id);
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
          <button className="lg:hidden text-slate-300" onClick={() => setSidebarOpen(true)}><Menu size={22}/></button>
          <h1 className="text-base lg:text-lg font-semibold text-white">{titles[page] || current?.label}</h1>
          <div className="flex-1" />
          <button className="h-10 w-10 grid place-items-center rounded-lg hover:bg-white/5 text-slate-300"><Bell size={19}/></button>
          <div className="hidden md:block text-right">
            <div className="text-sm font-medium text-white leading-none">{profile?.full_name || 'مستخدم'}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{profile?.role === 'admin' ? 'مدير' : profile?.role === 'doctor' ? 'طبيب' : 'مساعد'}</div>
          </div>
          <button onClick={logout} className="h-10 w-10 grid place-items-center rounded-lg hover:bg-red-500/10 text-red-400"><LogOut size={18}/></button>
        </header>
        <main className="p-4 lg:p-6">
          {page === 'dashboard' && <Dashboard profile={profile} setPage={setPage} />}
          {page === 'patients' && <Patients setPage={setPage} setEditItem={setEditItem} />}
          {page === 'patient-new' && <PatientForm patient={editItem} onSave={() => { setEditItem(null); setPage('patients'); }} onCancel={() => { setEditItem(null); setPage('patients'); }} />}
          {page === 'appointments' && <Appointments setPage={setPage} />}
          {page === 'appointment-new' && <AppointmentForm onSave={() => setPage('appointments')} onCancel={() => setPage('appointments')} />}
          {page === 'surgeries' && <Surgeries setPage={setPage} setEditItem={setEditItem} />}
          {page === 'surgery-new' && <SurgeryForm onSave={() => setPage('surgeries')} onCancel={() => setPage('surgeries')} />}
          {page === 'surgery-detail' && editItem && <SurgeryDetail surgery={editItem} onBack={() => { setEditItem(null); setPage('surgeries'); }} />}
          {page === 'implants' && <Implants onBack={() => setPage('dashboard')} />}
          {page === 'invoices' && <Invoices setPage={setPage} setEditItem={setEditItem} />}
          {page === 'invoice-new' && <InvoiceForm onSave={() => setPage('invoices')} onCancel={() => setPage('invoices')} />}
          {page === 'invoice-detail' && editItem && <InvoiceDetail invoice={editItem} onBack={() => { setEditItem(null); setPage('invoices'); }} />}
          {page === 'media' && <Media />}
          {page === 'reports' && <Reports />}
          {page === 'settings' && <Settings profile={profile} />}
        </main>
      </div>
    </div>
  );
}
