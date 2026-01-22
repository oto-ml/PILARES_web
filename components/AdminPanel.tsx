import React, { useState } from 'react';
import { db } from '../src/firebase'; 
import { doc, setDoc, deleteDoc, collection, writeBatch } from 'firebase/firestore';
import { Course, WorkshopSession } from '../types';
import { COURSES, WORKSHOP_SCHEDULE } from '../constants';

interface AdminPanelProps {
  courses: Course[];
  onUpdateCourses: (c: Course[]) => void;
  workshops: WorkshopSession[];
  onUpdateWorkshops: (w: WorkshopSession[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ courses, onUpdateCourses, workshops, onUpdateWorkshops }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'courses' | 'workshops'>('courses');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [currentCourse, setCurrentCourse] = useState<Partial<Course>>({});
  const [currentWorkshop, setCurrentWorkshop] = useState<Partial<WorkshopSession>>({});

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
    const id = currentCourse.id || doc(collection(db, "courses")).id;
    const data = { ...currentCourse, id, price: 0 } as Course;
    await setDoc(doc(db, "courses", id), data);
    onUpdateCourses(currentCourse.id ? courses.map(c => c.id === id ? data : c) : [...courses, data]);
    setIsEditing(false);
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
        timeString: currentWorkshop.timeString || `${start}:00 - ${start+2}:00` 
    } as WorkshopSession;
    await setDoc(doc(db, "workshops", id), data);
    onUpdateWorkshops(currentWorkshop.id ? workshops.map(w => w.id === id ? data : w) : [...workshops, data]);
    setIsEditing(false);
    setSaving(false);
  };

  const deleteItem = async (id: string, type: 'courses' | 'workshops') => {
    if (!confirm("¿Borrar?")) return;
    await deleteDoc(doc(db, type, id));
    if (type === 'courses') onUpdateCourses(courses.filter(c => c.id !== id));
    else onUpdateWorkshops(workshops.filter(w => w.id !== id));
  };

  if (!isAuthenticated) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white p-8 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>
        <form onSubmit={handleLogin}><input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="border p-2 rounded" placeholder="Contraseña"/><button className="ml-2 bg-primary text-white p-2 rounded">Entrar</button></form>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded shadow min-h-screen">
      <div className="flex justify-between mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-primary">Panel Admin</h2>
        <div className="flex gap-2">
            <button onClick={handleInitialLoad} className="bg-yellow-500 text-white px-3 py-1 rounded text-xs">Restaurar BD</button>
            <button onClick={() => setIsAuthenticated(false)} className="text-sm underline">Salir</button>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <button onClick={() => setActiveTab('courses')} className={`font-bold pb-2 ${activeTab === 'courses' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}>Cursos</button>
        <button onClick={() => setActiveTab('workshops')} className={`font-bold pb-2 ${activeTab === 'workshops' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}>Horario</button>
      </div>

      <button onClick={() => { setActiveTab(activeTab); setIsEditing(true); setCurrentCourse({}); setCurrentWorkshop({}); }} className="bg-green-600 text-white px-4 py-2 rounded mb-4">
        + Nuevo {activeTab === 'courses' ? 'Curso' : 'Taller'}
      </button>

      {activeTab === 'courses' ? (
        <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-gray-50"><th>Título</th><th>Instructor</th><th>Acciones</th></tr></thead><tbody>
        {courses.map(c => <tr key={c.id} className="border-b"><td className="p-3 font-bold">{c.title}</td><td className="p-3">{c.instructor}</td><td className="p-3"><button onClick={()=>{setCurrentCourse(c); setIsEditing(true)}} className="text-blue-600 mr-2">Edit</button><button onClick={()=>deleteItem(c.id, 'courses')} className="text-red-600">Borrar</button></td></tr>)}
        </tbody></table></div>
      ) : (
        <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-gray-50"><th>Día</th><th>Hora</th><th>Actividad</th><th>Acciones</th></tr></thead><tbody>
        {[...workshops].sort((a,b)=>a.day-b.day || a.hour-b.hour).map(w => <tr key={w.id} className="border-b"><td className="p-3 font-bold">{['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'][w.day]}</td><td className="p-3">{w.timeString}</td><td className="p-3">{w.title}</td><td className="p-3"><button onClick={()=>{setCurrentWorkshop(w); setIsEditing(true)}} className="text-blue-600 mr-2">Edit</button><button onClick={()=>deleteItem(w.id, 'workshops')} className="text-red-600">Borrar</button></td></tr>)}
        </tbody></table></div>
      )}

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h3 className="font-bold text-xl mb-4">{activeTab === 'courses' ? 'Curso' : 'Taller'}</h3>
                {activeTab === 'courses' ? (
                    <form onSubmit={saveCourse} className="space-y-3">
                        <input className="w-full border p-2" placeholder="Título" required value={currentCourse.title || ''} onChange={e=>setCurrentCourse({...currentCourse, title: e.target.value})} />
                        <input className="w-full border p-2" placeholder="Instructor" required value={currentCourse.instructor || ''} onChange={e=>setCurrentCourse({...currentCourse, instructor: e.target.value})} />
                        <select className="w-full border p-2" value={currentCourse.category} onChange={e=>setCurrentCourse({...currentCourse, category: e.target.value})}><option>Cultura</option><option>Ciberescuela</option><option>Ponte Pila</option></select>
                        <input className="w-full border p-2" placeholder="Horario Texto" value={currentCourse.schedule || ''} onChange={e=>setCurrentCourse({...currentCourse, schedule: e.target.value})} />
                        <textarea className="w-full border p-2" placeholder="Descripción" required value={currentCourse.description || ''} onChange={e=>setCurrentCourse({...currentCourse, description: e.target.value})} />
                        <input className="w-full border p-2" placeholder="URL Imagen" value={currentCourse.image || ''} onChange={e=>setCurrentCourse({...currentCourse, image: e.target.value})} />
                        <div className="flex gap-2 justify-end mt-4"><button type="button" onClick={()=>setIsEditing(false)} className="px-4 py-2 border rounded">Cancelar</button><button className="px-4 py-2 bg-primary text-white rounded">Guardar</button></div>
                    </form>
                ) : (
                    <form onSubmit={saveWorkshop} className="space-y-3">
                        <input className="w-full border p-2" placeholder="Actividad" required value={currentWorkshop.title || ''} onChange={e=>setCurrentWorkshop({...currentWorkshop, title: e.target.value})} />
                        <div className="grid grid-cols-2 gap-2">
                            <select className="border p-2" value={currentWorkshop.day || 0} onChange={e=>setCurrentWorkshop({...currentWorkshop, day: Number(e.target.value)})}>{['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map((d,i)=><option key={i} value={i}>{d}</option>)}</select>
                            <input type="number" className="border p-2" placeholder="Hora (8-20)" value={currentWorkshop.hour || 10} onChange={e=>setCurrentWorkshop({...currentWorkshop, hour: Number(e.target.value)})} />
                        </div>
                        <input className="w-full border p-2" placeholder="Texto Hora (Ej: 10:00 - 12:00)" value={currentWorkshop.timeString || ''} onChange={e=>setCurrentWorkshop({...currentWorkshop, timeString: e.target.value})} />
                        <select className="w-full border p-2" value={currentWorkshop.category} onChange={e=>setCurrentWorkshop({...currentWorkshop, category: e.target.value as any})}><option>Cultura</option><option>Ciberescuela</option><option>Ponte Pila</option></select>
                        <div className="flex gap-2 justify-end mt-4"><button type="button" onClick={()=>setIsEditing(false)} className="px-4 py-2 border rounded">Cancelar</button><button className="px-4 py-2 bg-primary text-white rounded">Guardar</button></div>
                    </form>
                )}
            </div>
        </div>
      )}
    </div>
  );
};
export default AdminPanel;