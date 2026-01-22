import React, { useState } from 'react';
import { db } from '../src/firebase'; 
import { doc, setDoc, deleteDoc, collection, writeBatch } from 'firebase/firestore';
import { Course, WorkshopSession } from '../types';
import { COURSES, WORKSHOP_SCHEDULE } from '../constants';

// Helper para formatear hora decimal a string
const formatTimeRange = (startHour: number, duration: number) => {
    const end = startHour + duration;
    const format = (h: number) => {
        const hour = Math.floor(h);
        const minutes = (h - hour) * 60;
        return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };
    return `${format(startHour)} - ${format(end)}`;
};

const AdminPanel: React.FC<AdminPanelProps> = ({ courses, onUpdateCourses, workshops, onUpdateWorkshops }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'courses' | 'workshops'>('courses');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [currentCourse, setCurrentCourse] = useState<Partial<Course>>({});
  const [currentWorkshop, setCurrentWorkshop] = useState<Partial<WorkshopSession>>({});

  // Estados para creación simultánea en horario
  const [addToSchedule, setAddToSchedule] = useState(false);
  const [scheduleEntries, setScheduleEntries] = useState<{day: number, hour: number, duration: number}[]>([{day: 0, hour: 10, duration: 2}]);

  // --- LOGICA DE COLORES ---
  const getCategoryBadgeStyle = (category: string = '') => {
    const cat = category.toLowerCase();
    if (cat.includes('cultura')) return 'bg-purple-100 text-purple-700 border-purple-200';
    if (cat.includes('ciber')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (cat.includes('pila') || cat.includes('deport')) return 'bg-orange-100 text-orange-700 border-orange-200';
    if (cat.includes('oficio')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'pilares2026') setIsAuthenticated(true);
    else alert("Contraseña incorrecta");
  };

  const handleInitialLoad = async () => {
    if (!confirm("¿Restaurar BD con datos de prueba?")) return;
    setSaving(true);
    try {
        const batch = writeBatch(db);
        COURSES.forEach(c => batch.set(doc(db, "courses", c.id), c));
        WORKSHOP_SCHEDULE.forEach(w => batch.set(doc(db, "workshops", w.id), w));
        await batch.commit();
        window.location.reload();
    } catch (e) { alert("Error: " + e); }
    setSaving(false);
  };

  // Guardar Cursos
  const saveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const batch = writeBatch(db);
      
      // 1. Guardar Curso
      const courseId = currentCourse.id || doc(collection(db, "courses")).id;
      const category = currentCourse.category || 'Cultura';
      const courseData = { ...currentCourse, id: courseId, category, price: 0 } as Course;
      batch.set(doc(db, "courses", courseId), courseData);

      // 2. (Opcional) Guardar Taller en Horario
      const createdWorkshops: WorkshopSession[] = [];
      if (addToSchedule && !currentCourse.id) { // Solo al crear uno nuevo para evitar duplicados al editar
        scheduleEntries.forEach(entry => {
          const workshopId = doc(collection(db, "workshops")).id;
          const newWorkshop: WorkshopSession = {
            id: workshopId,
            title: currentCourse.title || 'Curso',
            category: category as any,
            day: entry.day,
            hour: entry.hour,
            timeString: formatTimeRange(entry.hour, entry.duration),
          };
          batch.set(doc(db, "workshops", workshopId), newWorkshop);
          createdWorkshops.push(newWorkshop);
        });
      }

      await batch.commit();

      // Actualizar estado local
      onUpdateCourses(currentCourse.id ? courses.map(c => c.id === courseId ? courseData : c) : [...courses, courseData]);
      if (createdWorkshops.length > 0) {
        onUpdateWorkshops([...workshops, ...createdWorkshops]);
        alert(`¡Curso y ${createdWorkshops.length} horario(s) creados exitosamente!`);
      }

      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("Error al guardar");
    }
    setSaving(false);
  };

  // Guardar Talleres
  const saveWorkshop = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const id = currentWorkshop.id || doc(collection(db, "workshops")).id;
    const start = currentWorkshop.hour || 10;
    const data = { 
        ...currentWorkshop, id, 
        // Fix: Ensure category is set
        category: currentWorkshop.category || 'Cultura',
        timeString: currentWorkshop.timeString || `${start}:00 - ${start+2}:00` 
    } as WorkshopSession;
    await setDoc(doc(db, "workshops", id), data);
    onUpdateWorkshops(currentWorkshop.id ? workshops.map(w => w.id === id ? data : w) : [...workshops, data]);
    setIsEditing(false);
    setSaving(false);
  };

  const deleteItem = async (id: string, type: 'courses' | 'workshops') => {
    if (!confirm("¿Borrar elemento permanentemente?")) return;
    await deleteDoc(doc(db, type, id));
    if (type === 'courses') onUpdateCourses(courses.filter(c => c.id !== id));
    else onUpdateWorkshops(workshops.filter(w => w.id !== id));
  };

  if (!isAuthenticated) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white p-8 rounded shadow border border-gray-100">
        <div className="bg-primary/5 p-4 rounded-full mb-4"><span className="material-symbols-outlined text-4xl text-primary">admin_panel_settings</span></div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Acceso Administrativo</h2>
        <form onSubmit={handleLogin} className="flex gap-2">
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="border p-2 rounded w-64" placeholder="Contraseña (pilares2026)"/>
            <button className="bg-primary text-white px-4 py-2 rounded font-bold shadow hover:bg-[#801b34] transition-colors">Entrar</button>
        </form>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg min-h-screen border border-gray-100">
      {/* HEADER */}
      <div className="flex justify-between mb-8 border-b pb-4 items-center">
        <div>
            <h2 className="text-3xl font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">dashboard</span> Panel Admin
            </h2>
            <p className="text-gray-500 text-sm mt-1">Gestiona cursos y horarios en tiempo real</p>
        </div>
        <div className="flex gap-3">
            <button onClick={handleInitialLoad} className="bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-yellow-200 transition-colors border border-yellow-200">
                ⚠️ Restaurar BD
            </button>
            <button onClick={() => setIsAuthenticated(false)} className="text-gray-500 hover:text-primary transition-colors text-sm font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-lg">logout</span> Salir
            </button>
        </div>
      </div>

      {/* PESTAÑAS */}
      <div className="flex gap-6 mb-6">
        <button 
            onClick={() => setActiveTab('courses')}
            className={`text-lg font-bold pb-2 px-2 transition-all flex items-center gap-2 ${activeTab === 'courses' ? 'text-primary border-b-4 border-primary' : 'text-gray-400 hover:text-gray-600'}`}
        >
            <span className="material-symbols-outlined">school</span> Catálogo de Cursos
        </button>
        <button 
            onClick={() => setActiveTab('workshops')}
            className={`text-lg font-bold pb-2 px-2 transition-all flex items-center gap-2 ${activeTab === 'workshops' ? 'text-primary border-b-4 border-primary' : 'text-gray-400 hover:text-gray-600'}`}
        >
            <span className="material-symbols-outlined">calendar_month</span> Horario General
        </button>
      </div>

      <button onClick={() => { setActiveTab(activeTab); setIsEditing(true); setCurrentCourse({}); setCurrentWorkshop({}); setAddToSchedule(false); setScheduleEntries([{day: 0, hour: 10, duration: 2}]); }} 
        className="bg-green-600 text-white px-6 py-3 rounded-lg mb-6 flex items-center gap-2 shadow-md hover:bg-green-700 transition-all transform hover:scale-[1.02] font-bold">
        <span className="material-symbols-outlined">add_circle</span> 
        Nuevo {activeTab === 'courses' ? 'Curso' : 'Taller'}
      </button>

      {/* TABLA CURSOS */}
      {activeTab === 'courses' ? (
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-left bg-white">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold tracking-wider">
                    <tr><th className="p-4">Título</th><th className="p-4">Instructor</th><th className="p-4">Categoría</th><th className="p-4 text-right">Acciones</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {courses.map(c => (
                        <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 font-bold text-gray-800">{c.title}</td>
                            <td className="p-4 text-gray-600">{c.instructor}</td>
                            <td className="p-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getCategoryBadgeStyle(c.category)}`}>
                                    {c.category}
                                </span>
                            </td>
                            <td className="p-4 flex justify-end gap-2">
                                <button onClick={()=>{setCurrentCourse(c); setIsEditing(true)}} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar"><span className="material-symbols-outlined">edit</span></button>
                                <button onClick={()=>deleteItem(c.id, 'courses')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar"><span className="material-symbols-outlined">delete</span></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      ) : (
        /* TABLA TALLERES */
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-left bg-white">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold tracking-wider">
                    <tr><th className="p-4">Día</th><th className="p-4">Horario</th><th className="p-4">Actividad</th><th className="p-4">Categoría</th><th className="p-4 text-right">Acciones</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {[...workshops].sort((a,b)=>a.day-b.day || a.hour-b.hour).map(w => (
                        <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 font-bold text-primary">{['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'][w.day]}</td>
                            <td className="p-4 text-sm text-gray-600 font-mono">{w.timeString}</td>
                            <td className="p-4 font-medium">{w.title}</td>
                            <td className="p-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getCategoryBadgeStyle(w.category)}`}>
                                    {w.category}
                                </span>
                            </td>
                            <td className="p-4 flex justify-end gap-2">
                                <button onClick={()=>{setCurrentWorkshop(w); setIsEditing(true)}} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><span className="material-symbols-outlined">edit</span></button>
                                <button onClick={()=>deleteItem(w.id, 'workshops')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><span className="material-symbols-outlined">delete</span></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}

      {/* MODAL UNIVERSAL */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
                <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                        {activeTab === 'courses' 
                            ? (currentCourse.id ? <><span className="material-symbols-outlined">edit</span> Editar Curso</> : <><span className="material-symbols-outlined">add_circle</span> Nuevo Curso</>) 
                            : (currentWorkshop.id ? <><span className="material-symbols-outlined">edit</span> Editar Taller</> : <><span className="material-symbols-outlined">add_circle</span> Nuevo Taller</>)
                        }
                    </h3>
                    <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <span className="material-symbols-outlined text-2xl">close</span>
                    </button>
                </div>

                <div className="p-8">
                    {activeTab === 'courses' ? (
                        <form onSubmit={saveCourse} className="space-y-5">
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-sm text-blue-800 mb-2 flex items-start gap-2">
                                <span className="material-symbols-outlined text-lg">info</span>
                                <p><strong>Nota:</strong> Los cursos creados aquí aparecen en el <strong>Catálogo</strong>. Para que aparezcan en el <strong>Horario General</strong>, debes crear también un registro en la pestaña de <strong>Horario General</strong> (Talleres).</p>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Título del Curso</label>
                                <input className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="Ej: Pintura al Óleo" required value={currentCourse.title || ''} onChange={e=>setCurrentCourse({...currentCourse, title: e.target.value})} />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Instructor</label>
                                    <input className="w-full border border-gray-300 p-3 rounded-lg" placeholder="Nombre completo" required value={currentCourse.instructor || ''} onChange={e=>setCurrentCourse({...currentCourse, instructor: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Categoría</label>
                                    <select 
                                        className={`w-full border border-gray-300 p-3 rounded-lg font-bold ${getCategoryBadgeStyle(currentCourse.category)}`} // ✨ COLOR DINÁMICO AQUÍ
                                        value={currentCourse.category || 'Cultura'} 
                                        onChange={e=>setCurrentCourse({...currentCourse, category: e.target.value})}
                                    >
                                        <option value="Cultura">Cultura (Morado)</option>
                                        <option value="Ciberescuela">Ciberescuela (Azul)</option>
                                        <option value="Ponte Pila">Ponte Pila (Naranja)</option>
                                        <option value="Oficios">Oficios (Verde)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Horario (Texto)</label>
                                <input className="w-full border border-gray-300 p-3 rounded-lg" placeholder="Ej: Lunes y Miércoles 16:00 - 18:00" value={currentCourse.schedule || ''} onChange={e=>setCurrentCourse({...currentCourse, schedule: e.target.value})} />
                            </div>

                            {/* OPCION DE AGREGAR AL HORARIO AUTOMATICAMENTE */}
                            {!currentCourse.id && ( // Solo mostrar al crear nuevo
                                <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <input 
                                            type="checkbox" 
                                            id="addToSchedule" 
                                            checked={addToSchedule} 
                                            onChange={e => setAddToSchedule(e.target.checked)} 
                                            className="w-5 h-5 text-primary rounded focus:ring-primary"
                                        />
                                        <label htmlFor="addToSchedule" className="font-bold text-gray-800 cursor-pointer select-none">
                                            Agregar automáticamente al Horario General
                                        </label>
                                    </div>
                                    
                                    {addToSchedule && (
                                        <div className="space-y-3 mt-3 animate-in fade-in slide-in-from-top-2">
                                            {scheduleEntries.map((entry, index) => (
                                                <div key={index} className="flex gap-2 items-end">
                                                    <div className="flex-1">
                                                        <label className="block text-xs font-bold text-gray-600 mb-1">Día {index + 1}</label>
                                                        <select 
                                                            className="w-full border border-gray-300 p-2 rounded-lg text-sm" 
                                                            value={entry.day} 
                                                            onChange={e => {
                                                                const newEntries = [...scheduleEntries];
                                                                newEntries[index].day = Number(e.target.value);
                                                                setScheduleEntries(newEntries);
                                                            }}
                                                        >
                                                            {['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'].map((d,i)=><option key={i} value={i}>{d}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="flex-1 min-w-[120px]">
                                                        <label className="block text-xs font-bold text-gray-600 mb-1">Hora Inicio</label>
                                                        <select 
                                                            className="w-full border border-gray-300 p-2 rounded-lg text-sm" 
                                                            value={entry.hour} 
                                                            onChange={e => {
                                                                const newEntries = [...scheduleEntries];
                                                                newEntries[index].hour = Number(e.target.value);
                                                                setScheduleEntries(newEntries);
                                                            }}
                                                        >
                                                            {Array.from({length: 13}, (_, i) => i + 8).map(h => (
                                                                <>
                                                                    <option key={h} value={h}>{h}:00</option>
                                                                    <option key={`${h}.5`} value={h + 0.5}>{h}:30</option>
                                                                </>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="flex-1 min-w-[100px]">
                                                        <label className="block text-xs font-bold text-gray-600 mb-1">Duración</label>
                                                        <select 
                                                            className="w-full border border-gray-300 p-2 rounded-lg text-sm" 
                                                            value={entry.duration} 
                                                            onChange={e => {
                                                                const newEntries = [...scheduleEntries];
                                                                newEntries[index].duration = Number(e.target.value);
                                                                setScheduleEntries(newEntries);
                                                            }}
                                                        >
                                                            <option value={1}>1.0 h</option>
                                                            <option value={1.5}>1.5 h</option>
                                                            <option value={2}>2.0 h</option>
                                                            <option value={2.5}>2.5 h</option>
                                                            <option value={3}>3.0 h</option>
                                                            <option value={4}>4.0 h</option>
                                                        </select>
                                                    </div>
                                                    {scheduleEntries.length > 1 && (
                                                        <button 
                                                            type="button" 
                                                            onClick={() => setScheduleEntries(scheduleEntries.filter((_, i) => i !== index))}
                                                            className="bg-red-50 text-red-500 p-2.5 rounded-lg hover:bg-red-100 transition-colors"
                                                            title="Eliminar horario"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">remove</span>
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            
                                            <button 
                                                type="button" 
                                                onClick={() => setScheduleEntries([...scheduleEntries, { day: 0, hour: 10, duration: 2 }])}
                                                className="w-full py-2 bg-orange-100 text-orange-700 font-bold rounded-lg text-sm hover:bg-orange-200 transition-colors flex items-center justify-center gap-1"
                                            >
                                                <span className="material-symbols-outlined text-sm">add_circle</span>
                                                Agregar otro día/horario
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
                                <textarea className="w-full border border-gray-300 p-3 rounded-lg h-24 resize-none" placeholder="Detalles del curso..." required value={currentCourse.description || ''} onChange={e=>setCurrentCourse({...currentCourse, description: e.target.value})} />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">URL de Imagen</label>
                                <input className="w-full border border-gray-300 p-3 rounded-lg text-sm text-gray-600" placeholder="https://..." value={currentCourse.image || ''} onChange={e=>setCurrentCourse({...currentCourse, image: e.target.value})} />
                            </div>
                            
                            <div className="pt-4 flex gap-3 justify-end">
                                <button type="button" onClick={()=>setIsEditing(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
                                <button className="px-5 py-2.5 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-[#801b34] transition-colors flex items-center gap-2">
                                    {saving ? 'Guardando...' : <><span className="material-symbols-outlined">save</span> Guardar Curso</>}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={saveWorkshop} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre de la Actividad</label>
                                <input className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="Ej: Asesoría de Tareas" required value={currentWorkshop.title || ''} onChange={e=>setCurrentWorkshop({...currentWorkshop, title: e.target.value})} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Categoría</label>
                                    <select 
                                        className={`w-full border border-gray-300 p-3 rounded-lg font-bold ${getCategoryBadgeStyle(currentWorkshop.category)}`} // ✨ COLOR DINÁMICO AQUÍ
                                        value={currentWorkshop.category || 'Cultura'} 
                                        onChange={e=>setCurrentWorkshop({...currentWorkshop, category: e.target.value as any})}
                                    >
                                        <option value="Cultura">Cultura</option>
                                        <option value="Ciberescuela">Ciberescuela</option>
                                        <option value="Ponte Pila">Ponte Pila</option>
                                        <option value="Destacado">Destacado</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Día</label>
                                    <select className="w-full border border-gray-300 p-3 rounded-lg bg-white" value={currentWorkshop.day || 0} onChange={e=>setCurrentWorkshop({...currentWorkshop, day: Number(e.target.value)})}>
                                        {['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'].map((d,i)=><option key={i} value={i}>{d}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Hora Inicio (Formato 24h)</label>
                                    <input type="number" min="8" max="20" className="w-full border border-gray-300 p-3 rounded-lg" value={currentWorkshop.hour || 10} onChange={e=>setCurrentWorkshop({...currentWorkshop, hour: Number(e.target.value)})} />
                                    <p className="text-xs text-gray-400 mt-1">Se usa para ordenar la lista.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Texto del Horario</label>
                                    <input className="w-full border border-gray-300 p-3 rounded-lg" placeholder="Ej: 10:00 - 12:30" value={currentWorkshop.timeString || ''} onChange={e=>setCurrentWorkshop({...currentWorkshop, timeString: e.target.value})} />
                                </div>
                            </div>
                            
                            <div className="pt-4 flex gap-3 justify-end">
                                <button type="button" onClick={()=>setIsEditing(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
                                <button className="px-5 py-2.5 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-[#801b34] transition-colors flex items-center gap-2">
                                    {saving ? 'Guardando...' : <><span className="material-symbols-outlined">save</span> Guardar Taller</>}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;