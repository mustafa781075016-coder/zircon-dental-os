
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Search, Plus, Save, Edit3, Trash2, X, Calendar, DollarSign, User, Stethoscope, FileText, Settings, LayoutDashboard, Users, Activity, Bell, Menu, Lock, UserPlus } from 'lucide-react'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null
const TODAY = new Date().toISOString().slice(0,10)

type Doctor = { id:string, name:string, specialty?:string }
type TreatType = { id:string, name:string, price:number }
type AppUser = { id:string, username:string, password:string, role?:string }
type BulkRow = { id:string, patientId:string, patientName:string, doctorId:string, doctorName:string, treatTypeId:string, treatName:string, teeth:number[], cost:number, date:string, status:string, notes:string }

const useLocal = <T,>(key:string, def:T) => {
  const [v,setV] = useState<T>(()=>{
    try{ const s=localStorage.getItem(key); return s? JSON.parse(s): def }catch{ return def }
  })
  useEffect(()=>{ localStorage.setItem(key, JSON.stringify(v)) },[key,v])
  return [v,setV] as const
}

function SearchSelect({ placeholder, options, value, onSelect }:{ placeholder:string, options:any[], value:string, onSelect:(o:any)=>void }){
  const [q,setQ]=useState(value)
  const [open,setOpen]=useState(false)
  const filtered = options.filter((o:any)=> (o.name||o).toLowerCase().includes(q.toLowerCase())).slice(0,8)
  useEffect(()=>setQ(value),[value])
  return (
    <div className="relative">
      <input value={q} onChange={e=>{ setQ(e.target.value); setOpen(true) }} onFocus={()=>setOpen(true)} placeholder={placeholder} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 outline-none" />
      {open && q && (
        <div className="absolute z-50 mt-1 w-full rounded-xl bg-[#1e293b] border border-white/10 shadow-2xl max-h-48 overflow-auto">
          {filtered.length===0 ? <div className="p-3 text-xs text-slate-400">لا يوجد نتائج</div> :
            filtered.map((o:any,i:number)=><button key={i} onClick={()=>{ setQ(o.name||o); onSelect(o); setOpen(false) }} className="w-full text-right px-3 py-2 text-sm text-white hover:bg-white/10">{o.name||o} {o.price? `- ${o.price} ر.س`:''}</button>)
          }
        </div>
      )}
      {open && <div className="fixed inset-0 z-40" onClick={()=>setOpen(false)}></div>}
    </div>
  )
}

const TEETH_UPPER = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28]
const TEETH_LOWER = [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38]

function JawModal({ selected, onToggle, onClose, treatName, doctorName, cost }:{ selected:number[], onToggle:(n:number)=>void, onClose:()=>void, treatName:string, doctorName:string, cost:number }){
  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto" onClick={e=>e.stopPropagation()}>
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-white font-bold">مخطط الأسنان - اختر الأسنان</h3>
          <button onClick={onClose} className="p-2 rounded-lg bg-white/5 text-white"><X size={18}/></button>
        </div>
        <div className="p-4 space-y-6">
          <div><div className="text-xs text-slate-400 mb-2 text-center">الفك العلوي</div><div className="grid grid-cols-8 gap-2">{TEETH_UPPER.map(n=>{ const sel=selected.includes(n); return <button key={n} onClick={()=>onToggle(n)} className={`relative rounded-xl border p-2 flex flex-col items-center gap-1 ${sel?'bg-emerald-500/20 border-emerald-500/50':'bg-white/5 border-white/10'}`}><span className="text-xl">🦷</span><span className="text-[10px] font-bold">{n}</span></button>})}</div></div>
          <div><div className="text-xs text-slate-400 mb-2 text-center">الفك السفلي</div><div className="grid grid-cols-8 gap-2">{TEETH_LOWER.map(n=>{ const sel=selected.includes(n); return <button key={n} onClick={()=>onToggle(n)} className={`relative rounded-xl border p-2 flex flex-col items-center gap-1 ${sel?'bg-emerald-500/20 border-emerald-500/50':'bg-white/5 border-white/10'}`}><span className="text-xl">🦷</span><span className="text-[10px] font-bold">{n}</span></button>})}</div></div>
          {selected.length>0 && <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden"><div className="p-3 text-sm font-bold">المعالجات - {selected.length} سن</div><table className="w-full text-xs"><thead className="bg-white/5 text-slate-400"><tr><th className="p-2 text-right">اسم المعالجة</th><th className="p-2 text-right">اسم الطبيب</th><th className="p-2 text-right">سعر</th><th className="p-2 text-right">رقم السن</th></tr></thead><tbody>{selected.map(num=><tr key={num} className="border-t border-white/5"><td className="p-2">{treatName||'-'}</td><td className="p-2">{doctorName||'-'}</td><td className="p-2">{cost} ر.س</td><td className="p-2 text-emerald-300 font-bold">{num}</td></tr>)}</tbody></table></div>}
        </div>
        <div className="p-4 border-t border-white/10 flex justify-between"><span className="text-xs text-slate-400">{selected.length} أسنان</span><button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-bold">تم - إغلاق وتفريغ نوع المعالجة</button></div>
      </div>
    </div>
  )
}

export default function App(){
  const [page,setPage]=useState('dashboard')
  const [sidebar,setSidebar]=useState(false)
  const [patients,setPatients]=useState<any[]>([])
  const [treatments,setTreatments]=useState<any[]>([])
  const [doctors,setDoctors] = useLocal<Doctor[]>('zircon_doctors', [{id:'1',name:'د. أحمد الشطبي',specialty:'زراعة'},{id:'2',name:'د. جلال الداعري',specialty:'تقويم'}])
  const [treatTypes,setTreatTypes] = useLocal<TreatType[]>('zircon_treatTypes', [{id:'1',name:'حشوة تجميلية',price:500},{id:'2',name:'زراعة سن',price:3500},{id:'3',name:'تنظيف',price:200}])
  const [appUsers,setAppUsers] = useLocal<AppUser[]>('zircon_appUsers', [{id:'1',username:'admin',password:'123456',role:'مدير'}])
  const [bulkRows,setBulkRows]=useLocal<BulkRow[]>('zircon_bulkRows', [])
  const [jawOpen,setJawOpen]=useState<string|null>(null)
  const [single,setSingle]=useState({ patientId:'', patientName:'', tooth:'', treatType:'', cost:500, status:'مخطط لها', notes:'', doctorId:'', doctorName:'' })
  const [settingsTab,setSettingsTab]=useState<'doctors'|'treatments'|'users'>('doctors')
  const [newDoc,setNewDoc]=useState({name:'',specialty:''})
  const [newTreat,setNewTreat]=useState({name:'',price:0})
  const [newUser,setNewUser]=useState({username:'',password:'',role:'طبيب'})
  const [editDoctor,setEditDoctor]=useState<Doctor|null>(null)
  const [editTreat,setEditTreat]=useState<TreatType|null>(null)
  const [editUser,setEditUser]=useState<AppUser|null>(null)
  const [userSearch,setUserSearch]=useState('')

  useEffect(()=>{
    if(!supabase) return
    supabase.from('patients').select('*').then(({data})=>{ if(data) setPatients(data) })
    supabase.from('treatments').select('*').then(({data})=>{ if(data) setTreatments(data) })
  },[])

  const addBulkRow = ()=>{ const id=Date.now().toString(); setBulkRows([...bulkRows,{ id, patientId:'', patientName:'', doctorId:'', doctorName:'', treatTypeId:'', treatName:'', teeth:[], cost:0, date:TODAY, status:'مخطط لها', notes:'' }]) }
  const updateRow = (id:string, patch:Partial<BulkRow>)=> setBulkRows(bulkRows.map(r=> r.id===id ? {...r,...patch}: r))
  const deleteRow = (id:string)=> setBulkRows(bulkRows.filter(r=>r.id!==id))
  const handleToothToggle = (rowId:string, tooth:number)=>{ const row=bulkRows.find(r=>r.id===rowId)!; const newTeeth=row.teeth.includes(tooth)? row.teeth.filter(t=>t!==tooth): [...row.teeth,tooth]; updateRow(rowId,{teeth:newTeeth}) }

  const saveBulk = async()=>{ if(!supabase){ alert('تم حفظ '+bulkRows.length+' سجل محليا'); return } const payload=bulkRows.flatMap(r=> r.teeth.map(t=>({ patient_id:r.patientId, treatment_type:r.treatName, tooth_number:t, cost:r.cost, status:'planned', description:r.notes }))); const {error}=await supabase.from('treatments').insert(payload); if(error) alert(error.message); else { alert('تم الحفظ في ملف المرضى'); setBulkRows([]) } }

  const card="rounded-2xl bg-[#151e32]/80 border border-white/10 p-4 backdrop-blur"
  const btnPrimary="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-bold"
  const btnGhost="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white"

  return (
    <div className="min-h-screen bg-[#0a0f1f] text-white" dir="rtl">
      <header className="sticky top-0 z-30 bg-[#0a0f1f]/80 backdrop-blur border-b border-white/10 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3"><button onClick={()=>setSidebar(!sidebar)} className="p-2 rounded-lg bg-white/5"><Menu size={18}/></button><div className="w-9 h-9 rounded-full bg-[#1a2744] flex items-center justify-center font-bold">م</div><Bell size={20} className="text-slate-400"/></div>
        <div className="text-sm text-slate-400">Zircon OS V2</div>
      </header>

      {sidebar && <div className="fixed inset-0 z-40 flex"><div className="w-64 bg-[#0f172a] border-l border-white/10 p-4 space-y-2">
        <button onClick={()=>{setSidebar(false);setPage('dashboard')}} className="w-full text-right px-3 py-2.5 rounded-xl hover:bg-white/10 flex gap-2"><LayoutDashboard size={18}/> لوحة التحكم</button>
        <button onClick={()=>{setSidebar(false);setPage('add-treatment')}} className="w-full text-right px-3 py-2.5 rounded-xl hover:bg-white/10 flex gap-2"><Plus size={18}/> إضافة معالجة</button>
        <div className="border-t border-white/10 my-2"></div><div className="text-xs text-slate-400 px-3">سجل الأمراض</div>
        <button onClick={()=>{setSidebar(false);setPage('bulk')}} className="w-full text-right px-3 py-2.5 rounded-xl bg-violet-600/20 text-violet-300 border border-violet-500/20 flex gap-2"><FileText size={18}/> سجل المعالجات 8 أعمدة</button>
        <button onClick={()=>{setSidebar(false);setPage('settings')}} className="w-full text-right px-3 py-2.5 rounded-xl hover:bg-white/10 flex gap-2"><Settings size={18}/> الإعدادات</button>
      </div><div className="flex-1 bg-black/50" onClick={()=>setSidebar(false)}></div></div>}

      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        {page==='dashboard' && <div className="space-y-4"><h1 className="text-2xl font-bold">مرحباً د. مصطفى 👋</h1><div className="grid grid-cols-2 md:grid-cols-4 gap-3"><div className={card}><div className="text-2xl font-bold">{patients.length}</div><div className="text-xs text-slate-400">المرضى</div></div><div className={card}><div className="text-2xl font-bold text-emerald-400">{bulkRows.length}</div><div className="text-xs text-slate-400">سجلات</div></div><div className={card}><div className="text-2xl font-bold text-blue-400">{doctors.length}</div><div className="text-xs text-slate-400">الأطباء</div></div><div className={card}><div className="text-2xl font-bold text-amber-400">{appUsers.length}</div><div className="text-xs text-slate-400">المستخدمين</div></div></div></div>}

        {page==='add-treatment' && (
          <div><div className="flex justify-between mb-4"><h1 className="text-xl font-bold">إضافة معالجة جديدة</h1><button onClick={()=>setPage('bulk')} className={btnGhost}>الجدول التفاعلي</button></div>
          <div className={card+" max-w-2xl mx-auto space-y-4"}>
            <div><label className="text-xs text-slate-400">المريض *</label><SearchSelect placeholder="بحث مريض..." options={patients.map(p=>({id:p.id,name:p.full_name}))} value={single.patientName} onSelect={o=>setSingle({...single,patientId:o.id,patientName:o.name})} /></div>
            <div><label className="text-xs text-slate-400">الطبيب *</label><SearchSelect placeholder="بحث طبيب..." options={doctors} value={single.doctorName} onSelect={o=>setSingle({...single,doctorId:o.id,doctorName:o.name})} /></div>
            <div><label className="text-xs text-slate-400">نوع المعالجة *</label><SearchSelect placeholder="بحث معالجة..." options={treatTypes} value={single.treatType} onSelect={o=>setSingle({...single,treatType:o.name,cost:o.price})} /></div>
            <div><label className="text-xs text-slate-400">رقم السن 🦷</label><div className="flex gap-2"><input value={single.tooth} onChange={e=>setSingle({...single,tooth:e.target.value})} placeholder="مثال: 11" className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm"/><button onClick={()=>setJawOpen('single')} className="px-3 rounded-xl bg-white/5 border border-white/10"><img src="/jaw.png" className="w-10 h-10 object-contain"/></button></div></div>
            <div><label className="text-xs text-slate-400">التكلفة - تلقائي</label><input value={single.cost} onChange={e=>setSingle({...single,cost:parseInt(e.target.value)||0})} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm"/></div>
            <div className="flex gap-3"><button onClick={()=>setPage('dashboard')} className={btnGhost}>إلغاء</button><button onClick={async()=>{ if(!single.patientId){ alert('اختر المريض'); return } if(supabase) await supabase.from('treatments').insert({ patient_id:single.patientId, treatment_type:single.treatType, tooth_number: parseInt(single.tooth)||null, cost:single.cost, status:'planned', description:single.notes }); alert('تم الحفظ'); }} className={btnPrimary+" flex-1 flex justify-center gap-2"}><Save size={16}/> حفظ المعالجة</button></div>
          </div></div>
        )}

        {page==='bulk' && (
          <div><div className="flex justify-between items-center mb-4 gap-3"><h1 className="text-xl font-bold">سجل المعالجات - 8 أعمدة</h1><div className="flex gap-2"><button onClick={addBulkRow} className={btnGhost}>+ صف</button><button onClick={saveBulk} className={btnPrimary}>حفظ المعالجات</button></div></div>
          <div className="rounded-2xl bg-[#151e32]/80 border border-white/10 overflow-auto"><table className="w-full min-w-[1200px] text-sm"><thead className="bg-white/[0.03] text-slate-300 text-xs"><tr><th className="p-3 text-right">1 اسم المريض</th><th className="p-3 text-right">2 الطبيب</th><th className="p-3 text-right">3 نوع المعالجة</th><th className="p-3 text-right">4 رقم الأسنان 🦷</th><th className="p-3 text-right">5 التكلفة</th><th className="p-3 text-right">6 التاريخ</th><th className="p-3 text-right">7 الحالة</th><th className="p-3 text-right">8 ملاحظات</th><th className="p-3"></th></tr></thead><tbody>{bulkRows.length===0 && <tr><td colSpan={9} className="p-8 text-center text-slate-500">اضغط + صف</td></tr>}{bulkRows.map(row=><tr key={row.id} className="border-t border-white/5"><td className="p-2"><SearchSelect placeholder="بحث مريض..." options={patients.map(p=>({id:p.id,name:p.full_name}))} value={row.patientName} onSelect={o=>updateRow(row.id,{patientId:o.id,patientName:o.name})} /></td><td className="p-2"><SearchSelect placeholder="بحث طبيب..." options={doctors} value={row.doctorName} onSelect={o=>updateRow(row.id,{doctorId:o.id,doctorName:o.name})} /></td><td className="p-2"><SearchSelect placeholder="بحث معالجة..." options={treatTypes} value={row.treatName} onSelect={o=>updateRow(row.id,{treatTypeId:o.id,treatName:o.name,cost:o.price})} /></td><td className="p-2"><button onClick={()=>setJawOpen(row.id)} className="w-full rounded-xl bg-black border border-white/10 px-2 py-1.5 flex justify-between"><span className="text-xs">{row.teeth.length? row.teeth.join(','):'الفكين'}</span><img src="/jaw.png" className="w-8 h-8"/></button>{jawOpen===row.id && <JawModal selected={row.teeth} onToggle={n=>handleToothToggle(row.id,n)} onClose={()=>{ setJawOpen(null); updateRow(row.id,{treatName:'',treatTypeId:'',cost:0}) }} treatName={row.treatName} doctorName={row.doctorName} cost={row.cost} />}</td><td className="p-2"><input value={row.cost||''} onChange={e=>updateRow(row.id,{cost:parseInt(e.target.value)||0})} placeholder="تلقائي" className="w-full rounded-xl bg-white/5 border border-white/10 px-2 py-2 text-xs"/></td><td className="p-2"><input type="date" value={row.date} onChange={e=>updateRow(row.id,{date:e.target.value})} className="w-full rounded-xl bg-white/5 border border-white/10 px-2 py-2 text-xs"/></td><td className="p-2"><select value={row.status} onChange={e=>updateRow(row.id,{status:e.target.value})} className="w-full rounded-xl bg-white/5 border border-white/10 px-2 py-2 text-xs"><option className="bg-[#0f172a]">مخطط لها</option><option className="bg-[#0f172a]">مكتملة</option></select></td><td className="p-2"><input value={row.notes} onChange={e=>updateRow(row.id,{notes:e.target.value})} className="w-full rounded-xl bg-white/5 border border-white/10 px-2 py-2 text-xs"/></td><td className="p-2"><button onClick={()=>deleteRow(row.id)} className="p-1.5 rounded bg-red-500/20 text-red-300"><Trash2 size={14}/></button></td></tr>)}</tbody></table></div></div>
        )}

        {page==='settings' && (
          <div><h1 className="text-xl font-bold mb-4">Zircon OS V2 - الإعدادات</h1><div className={card}><div className="text-xs text-slate-400">البريد: mustafa@dental.os</div><div className="text-xs text-slate-500 mt-1">الإصدار V2 - الوضع الليلي</div></div>
            <div className="mt-4 space-y-2">
              <div className="flex gap-2 border-b border-white/10 overflow-auto">
                <button onClick={()=>setSettingsTab('doctors')} className={`px-4 py-2 text-sm border-b-2 whitespace-nowrap ${settingsTab==='doctors'?'border-blue-500 text-white':'border-transparent text-slate-400'}`}>إدارة الأطباء (طبيب)</button>
                <button onClick={()=>setSettingsTab('treatments')} className={`px-4 py-2 text-sm border-b-2 whitespace-nowrap ${settingsTab==='treatments'?'border-blue-500 text-white':'border-transparent text-slate-400'}`}>إدارة المعالجات (معالجة)</button>
              </div>
              <div className="flex">
                <button onClick={()=>setSettingsTab('users')} className={`w-full md:w-auto px-6 py-2.5 rounded-xl text-sm font-bold border flex items-center justify-center gap-2 ${settingsTab==='users'?'bg-gradient-to-r from-violet-600 to-blue-600 border-violet-500 text-white':'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}><UserPlus size={16}/> إضافة مستخدم - اسم المستخدم وكلمة المرور وعرض المستخدمين</button>
              </div>
            </div>

            {settingsTab==='doctors' && (
              <div className="mt-4 space-y-3"><div className={card+" flex gap-2"}><input value={newDoc.name} onChange={e=>setNewDoc({...newDoc,name:e.target.value})} placeholder="اسم الطبيب" className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm"/><input value={newDoc.specialty} onChange={e=>setNewDoc({...newDoc,specialty:e.target.value})} placeholder="تخصص (اختياري)" className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm"/><button onClick={()=>{ if(!newDoc.name) return; setDoctors([...doctors,{id:Date.now().toString(),...newDoc}]); setNewDoc({name:'',specialty:''}) }} className={btnPrimary}>إضافة</button></div>
                <div className="grid gap-2">{doctors.map(d=><div key={d.id} className={card+" flex justify-between"}><div><div>{d.name}</div><div className="text-xs text-slate-400">{d.specialty}</div></div><div className="flex gap-1"><button onClick={()=>setEditDoctor(d)} className="p-2 rounded bg-white/5"><Edit3 size={14}/></button><button onClick={()=>setDoctors(doctors.filter(x=>x.id!==d.id))} className="p-2 rounded bg-red-500/20 text-red-300"><Trash2 size={14}/></button></div></div>)}</div></div>
            )}

            {settingsTab==='treatments' && (
              <div className="mt-4 space-y-3"><div className={card+" flex gap-2"}><input value={newTreat.name} onChange={e=>setNewTreat({...newTreat,name:e.target.value})} placeholder="اسم المعالجة" className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm"/><input type="number" value={newTreat.price||''} onChange={e=>setNewTreat({...newTreat,price:parseInt(e.target.value)||0})} placeholder="سعر المعالجة" className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm"/><button onClick={()=>{ if(!newTreat.name) return; setTreatTypes([...treatTypes,{id:Date.now().toString(),...newTreat}]); setNewTreat({name:'',price:0}) }} className={btnPrimary}>إضافة</button></div>
                <div className={card}><table className="w-full text-sm"><thead className="text-slate-400 text-xs"><tr><th className="p-2 text-right">اسم المعالجة</th><th className="p-2 text-right">السعر</th><th></th></tr></thead><tbody>{treatTypes.map(t=><tr key={t.id} className="border-t border-white/5"><td className="p-2">{t.name}</td><td className="p-2">{t.price} ر.س</td><td className="p-2 flex justify-end gap-1"><button onClick={()=>setEditTreat(t)} className="p-1.5 rounded bg-white/5"><Edit3 size={12}/></button><button onClick={()=>setTreatTypes(treatTypes.filter(x=>x.id!==t.id))} className="p-1.5 rounded bg-red-500/20 text-red-300"><Trash2 size={12}/></button></td></tr>)}</tbody></table></div></div>
            )}

            {settingsTab==='users' && (
              <div className="mt-4 space-y-4">
                <div className={card+" space-y-3"}>
                  <div className="flex items-center gap-2 font-bold"><UserPlus size={18} className="text-blue-400"/> إضافة مستخدم جديد</div>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div><label className="text-xs text-slate-400">اسم المستخدم *</label><input value={newUser.username} onChange={e=>setNewUser({...newUser,username:e.target.value})} placeholder="مثال: doctor1" className="w-full mt-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm"/></div>
                    <div><label className="text-xs text-slate-400">كلمة المرور *</label><input value={newUser.password} onChange={e=>setNewUser({...newUser,password:e.target.value})} placeholder="••••••" type="password" className="w-full mt-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm"/></div>
                    <div><label className="text-xs text-slate-400">الدور</label><select value={newUser.role} onChange={e=>setNewUser({...newUser,role:e.target.value})} className="w-full mt-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm"><option className="bg-[#0f172a]">طبيب</option><option className="bg-[#0f172a]">مدير</option><option className="bg-[#0f172a]">استقبال</option><option className="bg-[#0f172a]">محاسب</option></select></div>
                  </div>
                  <button onClick={()=>{ if(!newUser.username||!newUser.password){ alert('ادخل اسم المستخدم وكلمة المرور'); return } setAppUsers([...appUsers,{id:Date.now().toString(),...newUser}]); setNewUser({username:'',password:'',role:'طبيب'}) }} className={btnPrimary+" w-full md:w-auto flex items-center gap-2"}><Plus size={16}/> إضافة المستخدم</button>
                </div>

                <div className={card}>
                  <div className="flex justify-between items-center mb-3"><div className="font-bold flex items-center gap-2"><Users size={18}/> عرض المستخدمين - {appUsers.filter(u=> u.username.toLowerCase().includes(userSearch.toLowerCase())).length}</div>
                    <div className="relative"><Search size={14} className="absolute right-2 top-2.5 text-slate-500"/><input value={userSearch} onChange={e=>setUserSearch(e.target.value)} placeholder="بحث سريع..." className="pr-7 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs w-40"/></div>
                  </div>
                  <div className="overflow-auto"><table className="w-full text-sm"><thead className="text-slate-400 text-xs"><tr><th className="p-2 text-right">اسم المستخدم</th><th className="p-2 text-right">كلمة المرور</th><th className="p-2 text-right">الدور</th><th className="p-2"></th></tr></thead><tbody>{appUsers.filter(u=> u.username.toLowerCase().includes(userSearch.toLowerCase())).map(u=><tr key={u.id} className="border-t border-white/5 hover:bg-white/[0.02]"><td className="p-3 flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center text-xs">{u.username[0]}</div>{u.username}</td><td className="p-3 font-mono text-xs"><span className="flex items-center gap-1"><Lock size={12} className="text-slate-500"/>{'*'.repeat(u.password.length)}<span className="text-[10px] text-slate-500">({u.password.length})</span></span></td><td className="p-3"><span className="text-xs px-2 py-1 rounded bg-white/10">{u.role}</span></td><td className="p-3 flex gap-1 justify-end"><button onClick={()=>setEditUser(u)} className="p-1.5 rounded bg-white/5"><Edit3 size={12}/></button><button onClick={()=>{ if(confirm('حذف '+u.username+'؟')) setAppUsers(appUsers.filter(x=>x.id!==u.id)) }} className="p-1.5 rounded bg-red-500/20 text-red-300"><Trash2 size={12}/></button></td></tr>)}</tbody></table></div>
                </div>
              </div>
            )}

            {(editDoctor||editTreat||editUser) && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={()=>{setEditDoctor(null);setEditTreat(null);setEditUser(null)}}>
                <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-4 w-full max-w-md" onClick={e=>e.stopPropagation()}>
                  <h3 className="font-bold mb-3 flex items-center gap-2">{editUser?'تعديل مستخدم': editDoctor?'تعديل طبيب':'تعديل معالجة'}</h3>
                  {editDoctor && <div className="space-y-2"><input value={editDoctor.name} onChange={e=>setEditDoctor({...editDoctor,name:e.target.value})} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm"/><input value={editDoctor.specialty||''} onChange={e=>setEditDoctor({...editDoctor,specialty:e.target.value})} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm"/><div className="flex gap-2"><button onClick={()=>{setDoctors(doctors.map(d=>d.id===editDoctor.id?editDoctor:d));setEditDoctor(null)}} className={btnPrimary}>حفظ</button><button onClick={()=>setEditDoctor(null)} className={btnGhost}>إلغاء</button></div></div>}
                  {editTreat && <div className="space-y-2"><input value={editTreat.name} onChange={e=>setEditTreat({...editTreat,name:e.target.value})} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm"/><input type="number" value={editTreat.price} onChange={e=>setEditTreat({...editTreat,price:parseInt(e.target.value)||0})} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm"/><div className="flex gap-2"><button onClick={()=>{setTreatTypes(treatTypes.map(t=>t.id===editTreat.id?editTreat:t));setEditTreat(null)}} className={btnPrimary}>حفظ</button><button onClick={()=>setEditTreat(null)} className={btnGhost}>إلغاء</button></div></div>}
                  {editUser && <div className="space-y-2"><input value={editUser.username} onChange={e=>setEditUser({...editUser,username:e.target.value})} placeholder="اسم المستخدم" className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm"/><input value={editUser.password} onChange={e=>setEditUser({...editUser,password:e.target.value})} placeholder="كلمة المرور" className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm"/><select value={editUser.role} onChange={e=>setEditUser({...editUser,role:e.target.value})} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm"><option className="bg-[#0f172a]">طبيب</option><option className="bg-[#0f172a]">مدير</option><option className="bg-[#0f172a]">استقبال</option></select><div className="flex gap-2"><button onClick={()=>{setAppUsers(appUsers.map((u:any)=>u.id===editUser.id?editUser:u));setEditUser(null)}} className={btnPrimary}>حفظ</button><button onClick={()=>setEditUser(null)} className={btnGhost}>إلغاء</button><button onClick={()=>{setAppUsers(appUsers.filter((u:any)=>u.id!==editUser.id));setEditUser(null)}} className="px-3 py-2 rounded-xl bg-red-600 text-white text-sm">حذف</button></div></div>}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      {jawOpen==='single' && <JawModal selected={single.tooth? [parseInt(single.tooth)].filter(Boolean) as number[] : []} onToggle={n=>setSingle({...single,tooth:n.toString()})} onClose={()=>setJawOpen(null)} treatName={single.treatType} doctorName={single.doctorName} cost={single.cost} />}
    </div>
  )
}
