import React, { useState } from 'react';
import { db } from '../src/firebase'; 
import { doc, setDoc, deleteDoc, collection, writeBatch } from 'firebase/firestore';
import { Course, WorkshopSession } from '../types';
import { COURSES, WORKSHOP_SCHEDULE } from '../constants';

interface AdminPanelProps {
  courses: Course[];
  onUpdateCourses: (courses: Course[]) => void;
  // ✅ Nuevas props para talleres
  workshops: WorkshopSession[];
  onUpdateWorkshops: (workshops: WorkshopSession[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ courses, onUpdateCourses, workshops, onUpdateWorkshops }) => {
  // --- AUTH ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState<'courses' | 'workshops'>('courses');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // --- DATA STATE ---
  const [currentCourse, setCurrentCourse] = useState<Partial<Course>>({});
  const [currentWorkshop, setCurrentWorkshop] = useState<Partial<WorkshopSession>>({});

  // Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'pilares2026') setIsAuthenticated(true);
    else alert('Contraseña incorrecta');
  };

  // --- CARGA INICIAL (SEED) ---
  const handleInitialLoad = async () => {
    if (!window.confirm("⚠️ Esto borrará la BD actual y cargará los datos de prueba. ¿Continuar?")) return;
    setSaving(true);
    try {
        const batch = writeBatch(db);
        
        // Borrar datos viejos (opcional, pero recomendado para seed)
        // Nota: Firestore no permite borrar colecciones enteras fácilmente desde web client, 
        // así que aquí solo sobrescribimos/creamos los del archivo constants.
        
        COURSES.forEach(c => batch.set(doc(db, "courses", c.id), c));
        WORKSHOP_SCHEDULE.forEach(w => batch.set(doc(db, "workshops", w.id), w));

        await batch.commit();
        alert("✅ BD Restaurada. Recargando...");
        window.location.reload();
    } catch (e) {
        alert("Error: " + e);
    } finally {
        setSaving(false);
    }
  };

  // ================= CRUD CURSOS =================
  const openCourseModal = (course?: Course) => {
    setCurrentCourse(course || {
        title: '', instructor: '', category: 'Cultura', 
        description: '', image: '', price: 0, schedule: 'Por definir'
    });
    setIsEditing(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCourse.title) return;
    setSaving(true);
    try {
        const id = currentCourse.id || doc(collection(db, "courses")).id;
        const toSave = { ...currentCourse, id, price: 0 } as Course;
        
        await setDoc(doc(db, "courses", id), toSave);
        
        const newList = currentCourse.id 
            ? courses.map(c => c.id === id ? toSave : c)
            : [...courses, toSave];
        onUpdateCourses(newList);
        setIsEditing(false);
    } catch (error) { console.error(error); alert("Error al guardar"); }
    setSaving(false);
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("¿Borrar curso?")) return;
    await deleteDoc(doc(db, "courses", id));
    onUpdateCourses(courses.filter(c => c.id !== id));
  };

  // ================= CRUD TALLERES (NUEVO) =================
  const openWorkshopModal = (workshop?: WorkshopSession) => {
    setCurrentWorkshop(workshop || {
        title: '', day: 0, hour: 10, category: 'Cultura', 
        type: 'primary', seats: '', timeString: '10:00 - 12:00'
    });
    setIsEditing(true);
  };

  const handleSaveWorkshop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWorkshop.title) return;
    setSaving(true);
    try {
        const id = currentWorkshop.id || doc(collection(db, "workshops")).id;
        
        // Calcular timeString automáticamente si no se puso manual
        const start = currentWorkshop.hour || 10;
        const end = start + 2; // Asumimos 2 horas por defecto
        const autoTimeString = `${start}:00 - ${end}:00`;

        const toSave = { 
            ...currentWorkshop, 
            id,
            timeString: currentWorkshop.timeString || autoTimeString
        } as WorkshopSession;
        
        await setDoc(doc(db, "workshops", id), toSave);
        
        const newList = currentWorkshop.id 
            ? workshops.map(w => w.id === id ? toSave : w)
            : [...workshops, toSave];
        onUpdateWorkshops(newList);
        setIsEditing(false);
    } catch (error) { console.error(error); alert("Error al guardar taller"); }
    setSaving(false);
  };

  const handleDeleteWorkshop = async (id: string) => {
    if (!confirm("¿Borrar taller del horario?")) return;
    await deleteDoc(doc(db, "workshops", id));
    onUpdateWorkshops(workshops.filter(w => w.id !== id));
  };

  // Días para el select
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  if (!isAuthenticated) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input type="password" className="border p-2 rounded" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Contraseña"/>
            <button className="bg-primary text-white p-2 rounded">Entrar</button>
        </form>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg min-h-screen">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h2 className="text-2xl font-bold text-primary">Panel de Administración</h2>
        <div className="flex gap-2">
            <button onClick={handleInitialLoad} disabled={saving} className="bg-yellow-500 text-white px-3 py-1 rounded text-xs font-bold">
                {saving ? '...' : 'Restaurar BD'}
            </button>
            <button onClick={() => setIsAuthenticated(false)} className="text-gray-500 underline text-sm">Salir</button>
        </div>
      </div>

      {/* PESTAÑAS */}
      <div className="flex gap-4 mb-6 border-b">
        <button 
            onClick={() => setActiveTab('courses')}
            className={`pb-2 px-4 font-bold ${activeTab === 'courses' ? 'border-b-4 border-primary text-primary' : 'text-gray-400'}`}
        >
            Cursos (Catálogo)
        </button>
        <button 
            onClick={() => setActiveTab('workshops')}
            className={`pb-2 px-4 font-bold ${activeTab === 'workshops' ? 'border-b-4 border-primary text-primary' : 'text-gray-400'}`}
        >
            Horario General
        </button>
      </div>

      {/* VISTA DE CURSOS */}
      {activeTab === 'courses' && (
        <>
            <button onClick={() => openCourseModal()} className="bg-green-600 text-white px-4 py-2 rounded mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">add</span> Nuevo Curso
            </button>
            <div className="overflow-x-auto border rounded">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr><th>Título</th><th>Instructor</th><th>Horario</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                        {courses.map(c => (
                            <tr key={c.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-bold">{c.title}</td>
                                <td className="p-3">{c.instructor}</td>
                                <td className="p-3 text-sm">{c.schedule}</td>
                                <td className="p-3 flex gap-2">
                                    <button onClick={() => openCourseModal(c)} className="text-blue-600 material-symbols-outlined">edit</button>
                                    <button onClick={() => handleDeleteCourse(c.id)} className="text-red-600 material-symbols-outlined">delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
      )}

      {/* VISTA DE TALLERES (NUEVO) */}
      {activeTab === 'workshops' && (
        <>
            <button onClick={() => openWorkshopModal()} className="bg-green-600 text-white px-4 py-2 rounded mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">add</span> Agregar al Horario
            </button>
            <div className="overflow-x-auto border rounded">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr><th>Día</th><th>Hora</th><th>Actividad</th><th>Categoría</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                        {/* Ordenar por día y hora */}
                        {[...workshops].sort((a,b) => (a.day - b.day) || (a.hour - b.hour)).map(w => (
                            <tr key={w.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 text-sm font-bold text-primary">{days[w.day]}</td>
                                <td className="p-3 text-sm">{w.timeString}</td>
                                <td className="p-3 font-medium">{w.title}</td>
                                <td className="p-3"><span className="text-xs bg-gray-100 px-2 py-1 rounded">{w.category}</span></td>
                                <td className="p-3 flex gap-2">
                                    <button onClick={() => openWorkshopModal(w)} className="text-blue-600 material-symbols-outlined">edit</button>
                                    <button onClick={() => handleDeleteWorkshop(w.id)} className="text-red-600 material-symbols-outlined">delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
      )}

      {/* MODAL UNIVERSAL (Sirve para cursos y talleres) */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between mb-4">
                    <h3 className="font-bold text-xl">
                        {activeTab === 'courses' ? (currentCourse.id ? 'Editar Curso' : 'Nuevo Curso') : (currentWorkshop.id ? 'Editar Taller' : 'Nuevo Taller')}
                    </h3>
                    <button onClick={() => setIsEditing(false)} className="material-symbols-outlined">close</button>
                </div>

                {/* FORMULARIO DE CURSOS */}
                {activeTab === 'courses' ? (
                    <form onSubmit={handleSaveCourse} className="space-y-3">
                        <input className="w-full border p-2 rounded" placeholder="Título" required value={currentCourse.title} onChange={e=>setCurrentCourse({...currentCourse, title: e.target.value})} />
                        <input className="w-full border p-2 rounded" placeholder="Instructor" required value={currentCourse.instructor} onChange={e=>setCurrentCourse({...currentCourse, instructor: e.target.value})} />
                        <div className="grid grid-cols-2 gap-2">
                            <select className="border p-2 rounded" value={currentCourse.category} onChange={e=>setCurrentCourse({...currentCourse, category: e.target.value})}>
                                <option>Cultura</option><option>Ciberescuela</option><option>Ponte Pila</option><option>Oficios</option>
                            </select>
                            <input className="border p-2 rounded" placeholder="Horario Texto" value={currentCourse.schedule} onChange={e=>setCurrentCourse({...currentCourse, schedule: e.target.value})} />
                        </div>
                        <textarea className="w-full border p-2 rounded h-20" placeholder="Descripción" required value={currentCourse.description} onChange={e=>setCurrentCourse({...currentCourse, description: e.target.value})} />
                        <input className="w-full border p-2 rounded" placeholder="URL Imagen" value={currentCourse.image} onChange={e=>setCurrentCourse({...currentCourse, image: e.target.value})} />
                        
                        <button type="submit" className="w-full bg-primary text-white font-bold py-2 rounded mt-2">{saving ? 'Guardando...' : 'Guardar Curso'}</button>
                    </form>
                ) : (
                /* FORMULARIO DE TALLERES */
                    <form onSubmit={handleSaveWorkshop} className="space-y-3">
                        <input className="w-full border p-2 rounded" placeholder="Nombre del Taller" required value={currentWorkshop.title} onChange={e=>setCurrentWorkshop({...currentWorkshop, title: e.target.value})} />
                        
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs font-bold">Día</label>
                                <select className="w-full border p-2 rounded" value={currentWorkshop.day} onChange={e=>setCurrentWorkshop({...currentWorkshop, day: Number(e.target.value)})}>
                                    {days.map((d, i) => <option key={d} value={i}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold">Hora Inicio (24h)</label>
                                <input type="number" min="8" max="20" className="w-full border p-2 rounded" value={currentWorkshop.hour} onChange={e=>setCurrentWorkshop({...currentWorkshop, hour: Number(e.target.value)})} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs font-bold">Categoría</label>
                                <select className="w-full border p-2 rounded" value={currentWorkshop.category} 
                                    onChange={e=>setCurrentWorkshop({...currentWorkshop, category: e.target.value as any})}>
                                    <option value="Cultura">Cultura</option>
                                    <option value="Ciberescuela">Ciberescuela</option>
                                    <option value="Ponte Pila">Ponte Pila</option>
                                    <option value="Destacado">Destacado</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold">Estilo Visual</label>
                                <select className="w-full border p-2 rounded" value={currentWorkshop.type || 'primary'} 
                                    onChange={e=>setCurrentWorkshop({...currentWorkshop, type: e.target.value as any})}>
                                    <option value="primary">Estándar (Crema)</option>
                                    <option value="muted">Discreto (Gris)</option>
                                    <option value="gold">Destacado (Dorado)</option>
                                </select>
                            </div>
                        </div>

                        <input className="w-full border p-2 rounded" placeholder="Texto de Hora (Ej: 10:00 - 11:30)" value={currentWorkshop.timeString} onChange={e=>setCurrentWorkshop({...currentWorkshop, timeString: e.target.value})} />
                        <input className="w-full border p-2 rounded" placeholder="Cupo (Opcional, Ej: '3 LUGARES')" value={currentWorkshop.seats} onChange={e=>setCurrentWorkshop({...currentWorkshop, seats: e.target.value})} />

                        <button type="submit" className="w-full bg-primary text-white font-bold py-2 rounded mt-2">{saving ? 'Guardando...' : 'Guardar Taller'}</button>
                    </form>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;