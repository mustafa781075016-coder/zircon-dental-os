import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  LayoutDashboard, Users, Calendar, LogOut, Menu, Bell, X,
  Stethoscope, Syringe, Plus, Search, Mail, Lock, Loader2,
} from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const btn = 'w-full rounded-lg bg-gradient-to-l from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 transition disabled:opacity-60 flex items-center justify-center gap-2';
const inp = 'w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60';
const card = 'rounded-xl border border-white/10 bg-white/[.03] backdrop-blur-xl p-5';

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

/* ---------- LOGIN ---------- */
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
            <label className="block text-sm text-slate-300 mb-2">البريد الإلكتروني</label>
            <div className="relative">
              <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required dir="ltr"
                className={inp + ' pr-10'} placeholder="you@clinic.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-2">كلمة المرور</label>
            <div className="relative">
              <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required dir="ltr"
                className={inp + ' pr-10'} placeholder="••••••••" />
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

/* ---------- DASHBOARD ---------- */
function Dashboard({ profile }) {
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

      const { data: ta } = await supabase.from('appointments')
        .select('*, patient:patients(full_name)')
        .gte('scheduled_start', start.toISOString())
        .lte('scheduled_start', end.toISOString())
        .order('scheduled_start');
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
      <div>
        <h2 className="text-2xl font-bold text-white">مرحبًا، {profile?.full_name || 'دكتور'}</h2>
        <p className="text-slate-400 mt-1 text-sm">نظرة عامة على نشاط العيادة</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Users} label="إجمالي المرضى" value={stats.patients} tone="bg-blue-500/20 text-blue-300" />
        <Stat icon={Calendar} label="مواعيد اليوم" value={stats.today} tone="bg-emerald-500/20 text-emerald-300" />
        <Stat icon={Stethoscope} label="الجراحات هذا الشهر" value={stats.surgeries} tone="bg-purple-500/20 text-purple-300" />
        <Stat icon={Syringe} label="الزرعات هذا الشهر" value={stats.implants} tone="bg-amber-500/20 text-amber-300" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className={card}>
          <h3 className="font-semibold text-white mb-4">أحدث المرضى</h3>
          {recentPatients.length === 0 ? (
            <p className="text-sm text-slate-500">لا يوجد مرضى بعد</p>
          ) : (
            <div className="space-y-2">
              {recentPatients.map((p) => (
                <div key={p.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                  <div className="h-9 w-9 rounded-full bg-blue-500/20 text-blue-300 grid place-items-center text-sm font-semibold">
                    {p.full_name?.charAt(0) || '؟'}
                  </div>
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
          <h3 className="font-semibold text-white mb-4">مواعيد اليوم</h3>
          {todayAppts.length === 0 ? (
            <p className="text-sm text-slate-500">لا توجد مواعيد اليوم</p>
          ) : (
            <div className="space-y-2">
              {todayAppts.map((a) => (
                <div key={a.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                  <div className="text-sm font-semibold text-blue-300 w-16" dir="ltr">
                    {new Date(a.scheduled_start).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </div>
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

/* ---------- PATIENTS ---------- */
function Patients() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(async () => {
      let q = supabase.from('patients').select('*').order('created_at', { ascending: false }).limit(50);
      if (search) q = q.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%,patient_code.ilike.%${search}%`);
      const { data } = await q;
      setList(data || []);
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم، الجوال، رقم المريض" className={inp + ' pr-10'} />
        </div>
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

/* ---------- APPOINTMENTS ---------- */
function Appointments() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('appointments')
        .select('*, patient:patients(full_name)')
        .order('scheduled_start', { ascending: false })
        .limit(50);
      setList(data || []);
      setLoading(false);
    })();
  }, []);

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

  return (
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
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {list.map((a) => {
                const st = statusMap[a.status] || statusMap.scheduled;
                return (
                  <tr key={a.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 text-slate-300 text-xs">{fmtDateTime(a.scheduled_start)}</td>
                    <td className="px-4 py-3 text-white">{a.patient?.full_name || '—'}</td>
                    <td className="px-4 py-3 text-slate-300">{typeMap[a.appointment_type] || a.appointment_type}</td>
                    <td className="px-4 py-3">
                      <span className={'text-[11px] px-2 py-1 rounded-md border border-white/10 ' + st[1]}>{st[0]}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ---------- MAIN APP ---------- */
export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen grid place-items-center text-slate-400">جاري التحميل...</div>
    );
  }

  if (!session) return <Login onLogin={() => {}} />;

  const nav = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'patients', label: 'المرضى', icon: Users },
    { id: 'appointments', label: 'المواعيد', icon: Calendar },
  ];
  const current = nav.find((n) => n.id === page);

  return (
    <div dir="rtl" className="min-h-screen">
      {/* Sidebar */}
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
            const active = page === item.id;
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

      {/* Main */}
      <div className="lg:mr-72">
        <header className="sticky top-0 z-20 h-16 border-b border-white/10 bg-[#0b1733]/80 backdrop-blur-xl flex items-center px-4 lg:px-6 gap-3">
          <button className="lg:hidden text-slate-300" onClick={() => setSidebarOpen(true)}><Menu size={22} /></button>
          <h1 className="text-base lg:text-lg font-semibold text-white">{current?.label}</h1>
          <div className="flex-1" />
          <button className="h-10 w-10 grid place-items-center rounded-lg hover:bg-white/5 text-slate-300"><Bell size={19} /></button>
          <div className="hidden md:block text-right">
            <div className="text-sm font-medium text-white leading-none">{profile?.full_name || 'مستخدم'}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {profile?.role === 'admin' ? 'مدير' : profile?.role === 'doctor' ? 'طبيب' : 'مساعد'}
            </div>
          </div>
          <button onClick={logout} className="h-10 w-10 grid place-items-center rounded-lg hover:bg-red-500/10 text-red-400">
            <LogOut size={18} />
          </button>
        </header>
        <main className="p-4 lg:p-6">
          {page === 'dashboard' && <Dashboard profile={profile} />}
          {page === 'patients' && <Patients />}
          {page === 'appointments' && <Appointments />}
        </main>
      </div>
    </div>
  );
      }
