
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Search, Plus, Save, Edit3, Trash2, X, Calendar, DollarSign, User, Stethoscope, FileText, Settings, LayoutDashboard, Users, Activity, Bell, Menu } from 'lucide-react'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

const TODAY = new Date().toISOString().slice(0,10)

// ====== Types ======
type Doctor = { id:string, name:string, specialty?:string }
type TreatType = { id:string, name:string, price:number }
type BulkRow = { id:string, patientId:string, patientName:string, doctorId:string, doctorName:string, treatTypeId:string, treatName:string, teeth:number[], cost:number, date:string, status:string, notes:string }

const STATUS_OPTIONS = ['مخطط لها','قيد التنفيذ','مكتملة','ملغية']

// ====== Helpers ======
const useLocal = <T,>(key:string, def:T) => {
  const [v,setV] = useState<T>(()=>{
    try{ const s=localStorage.getItem(key); return s? JSON.parse(s): def }catch{ return def }
  })
  useEffect(()=>{ localStorage.setItem(key, JSON.stringify(v)) },[key,v])
  return [v,setV] as const
}

// ====== Searchable Select ======
function SearchSelect({ placeholder, options, value, onSelect, displayKey='name' }:{ placeholder:string, options:any[], value:string, onSelect:(o:any)=>void, displayKey?:string }){
  const [q,setQ]=useState(value)
  const [open,setOpen]=useState(false)
  const filtered = options.filter((o:any)=> (o[displayKey]||o).toLowerCase().includes(q.toLowerCase())).slice(0,8)
  useEffect(()=>setQ(value),[value])
  return (
    <div className="relative">
      <input value={q} onChange={e=>{ setQ(e.target.value); setOpen(true) }} onFocus={()=>setOpen(true)}
        placeholder={placeholder}
        className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 outline-none" />
      {open && q && (
        <div className="absolute z-50 mt-1 w-full rounded-xl bg-[#1e293b] border border-white/10 shadow-2xl max-h-48 overflow-auto">
          {filtered.length===0 ? <div className="p-3 text-xs text-slate-400">لا يوجد نتائج</div> :
            filtered.map((o:any,i:number)=><button key={i} onClick={()=>{ setQ(o[displayKey]||o); onSelect(o); setOpen(false) }} className="w-full text-right px-3 py-2 text-sm text-white hover:bg-white/10">{o[displayKey]||o} {o.price? `- ${o.price} ر.س`:''}</button>)
          }
        </div>
      )}
      {open && <div className="fixed inset-0 z-40" onClick={()=>setOpen(false)}></div>}
    </div>
  )
}

// ====== Jaw Modal ======
const TEETH_UPPER = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28]
const TEETH_LOWER = [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38]

function JawModal({ selected, onToggle, onClose, treatName, doctorName, cost }:{ selected:number[], onToggle:(n:number)=>void, onClose:()=>void, treatName:string, doctorName:string, cost:number }){
  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto" onClick={e=>e.stopPropagation()}>
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-white font-bold">مخطط الأسنان - اختر الأسنان</h3>
          <button onClick={onClose} className="p-2 rounded-lg bg-white/5 text-white hover:bg-white/10"><X size={18}/></button>
        </div>
        <div className="p-4 space-y-6">
          <div>
            <div className="text-xs text-slate-400 mb-2 text-center">الفك العلوي</div>
            <div className="grid grid-cols-8 gap-2">
              {TEETH_UPPER.map(n=>{
                const sel = selected.includes(n)
                return <button key={n} onClick={()=>onToggle(n)} className={`relative rounded-xl border p-2 flex flex-col items-center gap-1 transition ${sel ? 'bg-emerald-500/20 border-emerald-500/50 scale-105' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                  <span className="text-xl">🦷</span>
                  <span className={`text-[10px] font-bold ${sel?'text-emerald-300':'text-slate-300'}`}>{n}</span>
                  {sel && <div className="absolute inset-0 rounded-xl border-2 border-emerald-400 pointer-events-none"></div>}
                </button>
              })}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-2 text-center">الفك السفلي</div>
            <div className="grid grid-cols-8 gap-2">
              {TEETH_LOWER.map(n=>{
                const sel = selected.includes(n)
                return <button key={n} onClick={()=>onToggle(n)} className={`relative rounded-xl border p-2 flex flex-col items-center gap-1 transition ${sel ? 'bg-emerald-500/20 border-emerald-500/50 scale-105' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                  <span className="text-xl">🦷</span>
                  <span className={`text-[10px] font-bold ${sel?'text-emerald-300':'text-slate-300'}`}>{n}</span>
                  {sel && <div className="absolute inset-0 rounded-xl border-2 border-emerald-400 pointer-events-none"></div>}
                </button>
              })}
            </div>
          </div>

          {selected.length>0 && (
            <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
              <div className="p-3 text-sm font-bold text-white">المعالجات المحددة - {selected.length} سن</div>
              <div className="overflow-auto">
                <table className="w-full text-xs">
                  <thead className="bg-white/5 text-slate-400"><tr><th className="p-2 text-right">اسم المعالجة</th><th className="p-2 text-right">اسم الطبيب</th><th className="p-2 text-right">سعر المعالجة</th><th className="p-2 text-right">رقم السن</th></tr></thead>
                  <tbody>
                    {selected.map(num=><tr key={num} className="border-t border-white/5 text-white"><td className="p-2">{treatName||'-'}</td><td className="p-2">{doctorName||'-'}</td><td className="p-2">{cost||'-'} ر.س</td><td className="p-2 font-bold text-emerald-300">{num}</td></tr>)}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-white/10 flex justify-between items-center">
          <span className="text-xs text-slate-400">{selected.length} أسنان مختارة</span>
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-bold">تم - إغلاق و تفريغ نوع المعالجة</button>
        </div>
      </div>
    </div>
  )
}

// ====== Main App ======
export default function App(){
  const [page,setPage]=useState('dashboard')
  const [sidebar,setSidebar]=useState(false)
  const [patients,setPatients]=useState<any[]>([])
  const [treatments,setTreatments]=useState<any[]>([])
  const [doctors,setDoctors] = useLocal<Doctor[]>('zircon_doctors', [{id:'1',name:'د. أحمد الزير',specialty:'زراعة'},{id:'2',name:'د. مصطفى',specialty:'تقويم'}])
  const [treatTypes,setTreatTypes] = useLocal<TreatType[]>('zircon_treatTypes', [{id:'1',name:'حشوة تجميلية',price:500},{id:'2',name:'زراعة سن',price:3500},{id:'3',name:'تنظيف',price:200},{id:'4',name:'تقويم',price:5000},{id:'5',name:'خلع',price:300}])
  const [bulkRows,setBulkRows]=useLocal<BulkRow[]>('zircon_bulkRows', [])
  const [jawOpen,setJawOpen]=useState<string|null>(null) // rowId
  const [searchPatient,setSearchPatient]=useState('')

  // single add form (vertical as before)
  const [single,setSingle]=useState({ patientId:'', patientName:'', tooth:'', treatType:'', cost:500, status:'مخطط لها', notes:'', doctorId:'', doctorName:'' })
  const [settingsTab,setSettingsTab]=useState<'doctors'|'treatments'>('doctors')
  const [newDoc,setNewDoc]=useState({name:'',specialty:''})
  const [newTreat,setNewTreat]=useState({name:'',price:0})
  const [editDoctor,setEditDoctor]=useState<Doctor|null>(null)
  const [editTreat,setEditTreat]=useState<TreatType|null>(null)

  useEffect(()=>{
    if(!supabase) return
    supabase.from('patients').select('*').then(({data})=>{ if(data) setPatients(data) })
    supabase.from('treatments').select('*').then(({data})=>{ if(data) setTreatments(data) })
  },[])

  const filteredPatients = patients.filter(p=> (p.full_name||'').toLowerCase().includes(searchPatient.toLowerCase()))

  // Bulk functions
  const addBulkRow = ()=>{
    const id = Date.now().toString()
    setBulkRows([...bulkRows,{ id, patientId:'', patientName:'', doctorId:'', doctorName:'', treatTypeId:'', treatName:'', teeth:[], cost:0, date:TODAY, status:'مخطط لها', notes:'' }])
  }
  const updateRow = (id:string, patch:Partial<BulkRow>)=>{
    setBulkRows(bulkRows.map(r=> r.id===id ? {...r,...patch}: r))
  }
  const deleteRow = (id:string)=> setBulkRows(bulkRows.filter(r=>r.id!==id))

  const handleToothToggle = (rowId:string, tooth:number)=>{
    const row = bulkRows.find(r=>r.id===rowId)!
    const has = row.teeth.includes(tooth)
    const newTeeth = has ? row.teeth.filter(t=>t!==tooth) : [...row.teeth, tooth]
    updateRow(rowId,{ teeth:newTeeth })
  }

  const saveBulk = async()=>{
    // save to supabase treatments
    if(!supabase){ alert('تم حفظ '+bulkRows.length+' سجل محليا'); return }
    const payload = bulkRows.flatMap(r=> r.teeth.length ? r.teeth.map(t=>({ patient_id:r.patientId, treatment_type:r.treatName, tooth_number:t, cost:r.cost, status: r.status==='مكتملة'?'completed': r.status==='قيد التنفيذ'?'in_progress':'planned', description: r.notes, created_at: r.date })) : [{ patient_id:r.patientId, treatment_type:r.treatName, tooth_number: parseInt(r.teeth[0] as any)||null, cost:r.cost, status:'planned', description:r.notes }])
    const {error} = await supabase.from('treatments').insert(payload)
    if(error) alert('خطأ: '+error.message); else { alert('تم حفظ المعالجات في ملف المرضى'); setBulkRows([]) }
  }

  const card = "rounded-2xl bg-[#151e32]/80 border border-white/10 p-4 backdrop-blur"
  const btnPrimary = "px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-bold hover:opacity-90"
  const btnGhost = "px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10"

  return (
    <div className="min-h-screen bg-[#0a0f1f] text-white" dir="rtl">
      {/* header */}
      <header className="sticky top-0 z-30 bg-[#0a0f1f]/80 backdrop-blur border-b border-white/10 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={()=>setSidebar(!sidebar)} className="p-2 rounded-lg bg-white/5"><Menu size={18}/></button>
          <div className="w-9 h-9 rounded-full bg-[#1a2744] flex items-center justify-center font-bold">م</div>
          <Bell size={20} className="text-slate-400"/>
        </div>
        <div className="text-sm text-slate-400 hidden md:block">Zircon OS V2</div>
      </header>

      {/* sidebar */}
      {sidebar && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-[#0f172a] border-l border-white/10 p-4 space-y-2">
            <button onClick={()=>{setSidebar(false);setPage('dashboard')}} className="w-full text-right px-3 py-2.5 rounded-xl hover:bg-white/10 flex gap-2"><LayoutDashboard size={18}/> لوحة التحكم</button>
            <button onClick={()=>{setSidebar(false);setPage('patients')}} className="w-full text-right px-3 py-2.5 rounded-xl hover:bg-white/10 flex gap-2"><Users size={18}/> المرضى</button>
            <button onClick={()=>{setSidebar(false);setPage('add-treatment')}} className="w-full text-right px-3 py-2.5 rounded-xl hover:bg-white/10 flex gap-2"><Plus size={18}/> إضافة معالجة</button>
            <div className="border-t border-white/10 my-2"></div>
            <div className="text-xs text-slate-400 px-3 py-1">سجل الأمراض</div>
            <button onClick={()=>{setSidebar(false);setPage('bulk')}} className="w-full text-right px-3 py-2.5 rounded-xl bg-violet-600/20 text-violet-300 border border-violet-500/20 flex gap-2"><FileText size={18}/> سجل المعالجات - الجدول التفاعلي 8 أعمدة</button>
            <button onClick={()=>{setSidebar(false);setPage('medical-file')}} className="w-full text-right px-3 py-2.5 rounded-xl hover:bg-white/10 flex gap-2"><Activity size={18}/> الملف الطبي</button>
            <button onClick={()=>{setSidebar(false);setPage('invoices')}} className="w-full text-right px-3 py-2.5 rounded-xl hover:bg-white/10 flex gap-2"><DollarSign size={18}/> سند حساب</button>
            <div className="border-t border-white/10 my-2"></div>
            <button onClick={()=>{setSidebar(false);setPage('settings')}} className="w-full text-right px-3 py-2.5 rounded-xl hover:bg-white/10 flex gap-2"><Settings size={18}/> الإعدادات</button>
          </div>
          <div className="flex-1 bg-black/50" onClick={()=>setSidebar(false)}></div>
        </div>
      )}

      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        {page==='dashboard' && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">مرحباً د. مصطفى 👋</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className={card}><div className="text-2xl font-bold">{patients.length}</div><div className="text-xs text-slate-400">المرضى</div></div>
              <div className={card}><div className="text-2xl font-bold text-emerald-400">{bulkRows.length}</div><div className="text-xs text-slate-400">سجلات معلقة</div></div>
              <div className={card}><div className="text-2xl font-bold text-blue-400">{doctors.length}</div><div className="text-xs text-slate-400">الأطباء</div></div>
              <div className={card}><div className="text-2xl font-bold text-amber-400">{treatTypes.length}</div><div className="text-xs text-slate-400">أنواع المعالجات</div></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <button onClick={()=>setPage('bulk')} className="rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 p-6 text-right"><div className="font-bold text-lg">سجل المعالجات - الجدول التفاعلي 8 أعمدة</div><div className="text-sm opacity-80 mt-1">بحث مريض + طبيب + نوع + أسنان تفاعلية + تكلفة تلقائية</div></button>
              <button onClick={()=>setPage('add-treatment')} className="rounded-2xl bg-white/5 border border-white/10 p-6 text-right"><div className="font-bold">إضافة معالجة (طولي)</div><div className="text-sm text-slate-400 mt-1">النموذج القديم المحسن</div></button>
            </div>
          </div>
        )}

        {/* ===== Vertical Add Treatment (old style improved) ===== */}
        {page==='add-treatment' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold">إضافة معالجة جديدة</h1>
              <button onClick={()=>setPage('bulk')} className={btnGhost}>الجدول التفاعلي 8 أعمدة</button>
            </div>
            <div className={card + " max-w-2xl mx-auto space-y-4"}>
              <div>
                <label className="text-xs text-slate-400">المريض *</label>
                <SearchSelect placeholder="بحث مريض..." options={patients.map(p=>({id:p.id,name:p.full_name}))} value={single.patientName} onSelect={o=>setSingle({...single,patientId:o.id,patientName:o.name})} />
              </div>
              <div>
                <label className="text-xs text-slate-400">الطبيب *</label>
                <SearchSelect placeholder="بحث طبيب..." options={doctors} value={single.doctorName} onSelect={o=>setSingle({...single,doctorId:o.id,doctorName:o.name})} />
              </div>
              <div>
                <label className="text-xs text-slate-400">نوع المعالجة *</label>
                <SearchSelect placeholder="بحث معالجة..." options={treatTypes} value={single.treatType} onSelect={o=>setSingle({...single,treatType:o.name,cost:o.price})} />
              </div>
              <div>
                <label className="text-xs text-slate-400">رقم السن (اضغط الفكين) 🦷</label>
                <div className="flex gap-2">
                  <input value={single.tooth} onChange={e=>setSingle({...single,tooth:e.target.value})} placeholder="مثال: 11 أو 6" className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm"/>
                  <button onClick={()=>setJawOpen('single')} className="px-3 rounded-xl bg-white/5 border border-white/10"><img src="/jaw.png" className="w-10 h-10 object-contain" alt="jaw"/></button>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400">التكلفة (ر.س) - تعبأ تلقائيا</label>
                <input value={single.cost} onChange={e=>setSingle({...single,cost:parseInt(e.target.value)||0})} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm" />
              </div>
              <div>
                <label className="text-xs text-slate-400">الحالة</label>
                <select value={single.status} onChange={e=>setSingle({...single,status:e.target.value})} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm">
                  {STATUS_OPTIONS.map(s=><option key={s} className="bg-[#0f172a]">{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400">ملاحظات</label>
                <textarea value={single.notes} onChange={e=>setSingle({...single,notes:e.target.value})} placeholder="تفاصيل المعالجة..." className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm min-h-[80px]"></textarea>
              </div>
              <div className="flex gap-3">
                <button onClick={()=>setPage('dashboard')} className={btnGhost}>إلغاء</button>
                <button onClick={async()=>{
                  if(!single.patientId) { alert('اختر المريض'); return }
                  if(supabase) await supabase.from('treatments').insert({ patient_id:single.patientId, treatment_type:single.treatType, tooth_number: parseInt(single.tooth)||null, cost:single.cost, status:'planned', description:single.notes })
                  alert('تم حفظ المعالجة في ملف المريض'); setPage('patients')
                }} className={btnPrimary + " flex-1 flex items-center justify-center gap-2"}><Save size={16}/> حفظ المعالجة</button>
              </div>
            </div>
          </div>
        )}

        {/* ===== Bulk 8 columns ===== */}
        {page==='bulk' && (
          <div>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
              <h1 className="text-xl font-bold">سجل المعالجات - الجدول التفاعلي 8 أعمدة</h1>
              <div className="flex gap-2">
                <button onClick={addBulkRow} className={btnGhost + " flex items-center gap-1"}><Plus size={14}/> + صف</button>
                <button onClick={saveBulk} className={btnPrimary + " flex items-center gap-2"}><Save size={16}/> حفظ المعالجات</button>
              </div>
            </div>

            <div className="rounded-2xl bg-[#151e32]/80 border border-white/10 overflow-auto">
              <table className="w-full min-w-[1200px] text-sm">
                <thead className="bg-white/[0.03] text-slate-300 text-xs">
                  <tr>
                    <th className="p-3 text-right w-[180px]">1 اسم المريض</th>
                    <th className="p-3 text-right w-[160px]">2 الطبيب</th>
                    <th className="p-3 text-right w-[160px]">3 نوع المعالجة</th>
                    <th className="p-3 text-right w-[140px]">4 رقم الأسنان 🦷</th>
                    <th className="p-3 text-right w-[120px]">5 التكلفة</th>
                    <th className="p-3 text-right w-[140px]">6 التاريخ</th>
                    <th className="p-3 text-right w-[120px]">7 الحالة</th>
                    <th className="p-3 text-right w-[160px]">8 ملاحظات</th>
                    <th className="p-3 w-[60px]"></th>
                  </tr>
                </thead>
                <tbody>
                  {bulkRows.length===0 && <tr><td colSpan={9} className="p-8 text-center text-slate-500">اضغط + صف لبدء إضافة معالجات - جميع الحقول تفاعلية مع بحث</td></tr>}
                  {bulkRows.map(row=>{
                    const isJawOpen = jawOpen===row.id
                    return (
                    <tr key={row.id} className="border-t border-white/5">
                      <td className="p-2"><SearchSelect placeholder="بحث مريض..." options={patients.map(p=>({id:p.id,name:p.full_name}))} value={row.patientName} onSelect={o=>updateRow(row.id,{patientId:o.id,patientName:o.name})} /></td>
                      <td className="p-2"><SearchSelect placeholder="بحث طبيب..." options={doctors} value={row.doctorName} onSelect={o=>updateRow(row.id,{doctorId:o.id,doctorName:o.name})} /></td>
                      <td className="p-2"><SearchSelect placeholder="بحث معالجة..." options={treatTypes} value={row.treatName} onSelect={o=>updateRow(row.id,{treatTypeId:o.id,treatName:o.name,cost:o.price})} /></td>
                      <td className="p-2">
                        <button onClick={()=>setJawOpen(row.id)} className="w-full rounded-xl bg-black border border-white/10 px-2 py-1.5 flex items-center justify-between gap-2">
                          <span className="text-xs truncate">{row.teeth.length? row.teeth.join(',') : 'الفكين'}</span>
                          <img src="/jaw.png" className="w-8 h-8 object-contain" alt="jaw"/>
                        </button>
                        {isJawOpen && <JawModal selected={row.teeth} onToggle={n=>handleToothToggle(row.id,n)} onClose={()=>{ setJawOpen(null); updateRow(row.id,{treatName:'',treatTypeId:'',cost:0}) }} treatName={row.treatName} doctorName={row.doctorName} cost={row.cost} />}
                      </td>
                      <td className="p-2"><input value={row.cost||''} onChange={e=>updateRow(row.id,{cost:parseInt(e.target.value)||0})} placeholder="تلقائي" className="w-full rounded-xl bg-white/5 border border-white/10 px-2 py-2 text-xs"/></td>
                      <td className="p-2"><input type="date" value={row.date} onChange={e=>updateRow(row.id,{date:e.target.value})} className="w-full rounded-xl bg-white/5 border border-white/10 px-2 py-2 text-xs"/></td>
                      <td className="p-2"><select value={row.status} onChange={e=>updateRow(row.id,{status:e.target.value})} className="w-full rounded-xl bg-white/5 border border-white/10 px-2 py-2 text-xs"><option className="bg-[#0f172a]">مخطط لها</option><option className="bg-[#0f172a]">مكتملة</option><option className="bg-[#0f172a]">قيد التنفيذ</option></select></td>
                      <td className="p-2"><input value={row.notes} onChange={e=>updateRow(row.id,{notes:e.target.value})} placeholder="ملاحظة" className="w-full rounded-xl bg-white/5 border border-white/10 px-2 py-2 text-xs"/></td>
                      <td className="p-2"><button onClick={()=>deleteRow(row.id)} className="p-1.5 rounded-lg bg-red-500/20 text-red-300"><Trash2 size={14}/></button></td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>

            {bulkRows.length>0 && (
              <div className="mt-4 rounded-2xl bg-white/5 border border-white/10 p-3">
                <div className="text-xs text-slate-400 mb-2">معاينة حفظ في ملف المريض - {bulkRows.reduce((a,r)=>a+r.teeth.length,0)} معالجة</div>
                <div className="overflow-auto">
                  <table className="w-full text-xs">
                    <thead className="text-slate-400"><tr><th className="p-2 text-right">اسم المعالجة</th><th className="p-2 text-right">اسم الطبيب</th><th className="p-2 text-right">سعر المعالجة</th><th className="p-2 text-right">رقم السن</th></tr></thead>
                    <tbody>{bulkRows.flatMap(r=> r.teeth.map(t=><tr key={r.id+'-'+t} className="border-t border-white/5 text-white"><td className="p-2">{r.treatName}</td><td className="p-2">{r.doctorName}</td><td className="p-2">{r.cost} ر.س</td><td className="p-2 text-emerald-300">{t}</td></tr>))}</tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {page==='settings' && (
          <div>
            <h1 className="text-xl font-bold mb-4">الإعدادات - Zircon OS V2</h1>
            <div className={card}><div className="text-xs text-slate-400">البريد: mustafa@dental.os</div><div className="text-xs text-slate-500 mt-1">الإصدار V2 - الوضع الليلي</div></div>
            <div className="flex gap-2 mt-4 border-b border-white/10">
              <button onClick={()=>setSettingsTab('doctors')} className={`px-4 py-2 text-sm border-b-2 ${settingsTab==='doctors'?'border-blue-500 text-white':'border-transparent text-slate-400'}`}>إدارة الأطباء (طبيب)</button>
              <button onClick={()=>setSettingsTab('treatments')} className={`px-4 py-2 text-sm border-b-2 ${settingsTab==='treatments'?'border-blue-500 text-white':'border-transparent text-slate-400'}`}>إدارة المعالجات (معالجة)</button>
            </div>

            {settingsTab==='doctors' && (
              <div className="mt-4 space-y-3">
                <div className={card + " flex gap-2"}>
                  <input value={newDoc.name} onChange={e=>setNewDoc({...newDoc,name:e.target.value})} placeholder="اسم الطبيب" className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm"/>
                  <input value={newDoc.specialty} onChange={e=>setNewDoc({...newDoc,specialty:e.target.value})} placeholder="تخصص (اختياري)" className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm"/>
                  <button onClick={()=>{ if(!newDoc.name) return; setDoctors([...doctors,{id:Date.now().toString(),...newDoc}]); setNewDoc({name:'',specialty:''}) }} className={btnPrimary}>إضافة</button>
                </div>
                <div className="relative"><Search size={14} className="absolute right-3 top-3 text-slate-500"/><input placeholder="بحث سريع..." className="w-full rounded-xl bg-white/5 border border-white/10 pr-8 px-3 py-2 text-sm"/></div>
                <div className="grid gap-2">{doctors.map(d=><div key={d.id} className={card + " flex justify-between items-center"}><div><div className="font-medium">{d.name}</div><div className="text-xs text-slate-400">{d.specialty}</div></div><div className="flex gap-1"><button onClick={()=>setEditDoctor(d)} className="p-2 rounded-lg bg-white/5"><Edit3 size={14}/></button><button onClick={()=>setDoctors(doctors.filter(x=>x.id!==d.id))} className="p-2 rounded-lg bg-red-500/20 text-red-300"><Trash2 size={14}/></button></div></div>)}</div>
              </div>
            )}

            {settingsTab==='treatments' && (
              <div className="mt-4 space-y-3">
                <div className={card + " flex gap-2"}>
                  <input value={newTreat.name} onChange={e=>setNewTreat({...newTreat,name:e.target.value})} placeholder="اسم المعالجة" className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm"/>
                  <input type="number" value={newTreat.price||''} onChange={e=>setNewTreat({...newTreat,price:parseInt(e.target.value)||0})} placeholder="سعر المعالجة - ضروري" className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm"/>
                  <button onClick={()=>{ if(!newTreat.name) return; setTreatTypes([...treatTypes,{id:Date.now().toString(),...newTreat}]); setNewTreat({name:'',price:0}) }} className={btnPrimary}>إضافة</button>
                </div>
                <div className={card}><div className="overflow-auto"><table className="w-full text-sm"><thead className="text-slate-400 text-xs"><tr><th className="p-2 text-right">اسم المعالجة</th><th className="p-2 text-right">السعر</th><th className="p-2"></th></tr></thead><tbody>{treatTypes.map(t=><tr key={t.id} className="border-t border-white/5"><td className="p-2">{t.name}</td><td className="p-2">{t.price} ر.س</td><td className="p-2 flex gap-1 justify-end"><button onClick={()=>setEditTreat(t)} className="p-1.5 rounded bg-white/5"><Edit3 size={12}/></button><button onClick={()=>setTreatTypes(treatTypes.filter(x=>x.id!==t.id))} className="p-1.5 rounded bg-red-500/20 text-red-300"><Trash2 size={12}/></button></td></tr>)}</tbody></table></div></div>
              </div>
            )}

            {(editDoctor||editTreat) && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={()=>{setEditDoctor(null);setEditTreat(null)}}>
                <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-4 w-full max-w-md" onClick={e=>e.stopPropagation()}>
                  <h3 className="font-bold mb-3">تعديل</h3>
                  {editDoctor && <div className="space-y-2"><input value={editDoctor.name} onChange={e=>setEditDoctor({...editDoctor,name:e.target.value})} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm"/><input value={editDoctor.specialty||''} onChange={e=>setEditDoctor({...editDoctor,specialty:e.target.value})} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm"/><div className="flex gap-2"><button onClick={()=>{setDoctors(doctors.map(d=>d.id===editDoctor.id?editDoctor:d));setEditDoctor(null)}} className={btnPrimary}>حفظ</button><button onClick={()=>setEditDoctor(null)} className={btnGhost}>إلغاء</button></div></div>}
                  {editTreat && <div className="space-y-2"><input value={editTreat.name} onChange={e=>setEditTreat({...editTreat,name:e.target.value})} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm"/><input type="number" value={editTreat.price} onChange={e=>setEditTreat({...editTreat,price:parseInt(e.target.value)||0})} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm"/><div className="flex gap-2"><button onClick={()=>{setTreatTypes(treatTypes.map(t=>t.id===editTreat.id?editTreat:t));setEditTreat(null)}} className={btnPrimary}>حفظ</button><button onClick={()=>setEditTreat(null)} className={btnGhost}>إلغاء</button><button onClick={()=>{setTreatTypes(treatTypes.filter(t=>t.id!==editTreat.id));setEditTreat(null)}} className="px-3 py-2 rounded-xl bg-red-600 text-white text-sm">حذف نهائي</button></div></div>}
                </div>
              </div>
            )}
          </div>
        )}

        {(page==='medical-file'||page==='invoices'||page==='patients') && (
          <div className={card}><h2 className="font-bold mb-2">{page==='patients'?'سجل المرضى': page==='medical-file'?'الملف الطبي':'سند حساب'}</h2><p className="text-sm text-slate-400">هذا التبويب تحت سجل الأمراض - سيتم تطويره حسب الحاجة. البيانات الحالية: {treatments.length} معالجة.</p></div>
        )}
      </main>

      {/* single jaw modal */}
      {jawOpen==='single' && <JawModal selected={single.tooth? [parseInt(single.tooth)].filter(Boolean) as number[] : []} onToggle={n=>setSingle({...single,tooth:n.toString()})} onClose={()=>setJawOpen(null)} treatName={single.treatType} doctorName={single.doctorName} cost={single.cost} />}
    </div>
  )
}
