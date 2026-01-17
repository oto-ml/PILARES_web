import React, { useState } from 'react';
import { Course, WorkshopSession } from '../types';

interface AdminPanelProps {
  courses: Course[];
  workshops: WorkshopSession[];
  onUpdateCourses: (courses: Course[]) => void;
  onUpdateWorkshops: (workshops: WorkshopSession[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ courses, workshops, onUpdateCourses, onUpdateWorkshops }) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'workshops'>('courses');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course>>({});
  const [isWorkshopModalOpen, setIsWorkshopModalOpen] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<Partial<WorkshopSession>>({});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded credentials for demo purposes
    if (loginUser === 'admin' && loginPass === 'pilares2024') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Credenciales incorrectas');
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setIsCourseModalOpen(true);
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      onUpdateCourses(courses.filter(c => c.id !== id));
    }
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse.id) {
      onUpdateCourses(courses.map(c => c.id === editingCourse.id ? { ...c, ...editingCourse } as Course : c));
    } else {
      const newCourse = {
        ...editingCourse,
        id: Math.random().toString(36).substr(2, 9),
        price: 0
      } as Course;
      onUpdateCourses([...courses, newCourse]);
    }
    setIsCourseModalOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingCourse({ ...editingCourse, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditWorkshop = (session: WorkshopSession) => {
    setEditingWorkshop(session);
    setIsWorkshopModalOpen(true);
  };

  const handleDeleteWorkshop = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta sesión del horario?')) {
      onUpdateWorkshops(workshops.filter(w => w.id !== id));
    }
  };

  const handleSaveWorkshop = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingWorkshop.id) {
      onUpdateWorkshops(workshops.map(w => w.id === editingWorkshop.id ? { ...w, ...editingWorkshop } as WorkshopSession : w));
    } else {
      const newSession = {
        ...editingWorkshop,
        id: Math.random().toString(36).substr(2, 9),
      } as WorkshopSession;
      onUpdateWorkshops([...workshops, newSession]);
    }
    setIsWorkshopModalOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-in zoom-in-95 duration-500">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-[#e4dcde]">
          <div className="text-center mb-8">
            <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              <span className="material-symbols-outlined text-3xl">lock</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#171213]">Acceso Restringido</h2>
            <p className="text-[#85666e] text-sm mt-2">Introduce tus credenciales de administrador para continuar.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#171213] mb-2">Usuario</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#85666e]">person</span>
                <input 
                  type="text" 
                  value={loginUser}
                  onChange={e => setLoginUser(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e4dcde] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#171213] mb-2">Contraseña</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#85666e]">key</span>
                <input 
                  type="password" 
                  value={loginPass}
                  onChange={e => setLoginPass(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e4dcde] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {loginError && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>
                {loginError}
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-[#801b34] transition-colors shadow-lg shadow-primary/20"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-4xl font-black text-primary">Panel de Control</h1>
          <p className="text-[#85666e]">Gestión administrativa de PILARES Mártires del 10 de junio</p>
        </div>
        <div className="flex gap-2 bg-[#f4f1f1] p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('courses')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'courses' ? 'bg-white text-primary shadow-sm' : 'text-[#85666e] hover:text-primary'}`}
          >
            Cursos
          </button>
          <button 
            onClick={() => setActiveTab('workshops')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'workshops' ? 'bg-white text-primary shadow-sm' : 'text-[#85666e] hover:text-primary'}`}
          >
            Horario
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e4dcde] shadow-xl overflow-hidden">
        {activeTab === 'courses' ? (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-[#171213]">Catálogo de Cursos</h2>
              <button 
                onClick={() => {
                  setEditingCourse({});
                  setIsCourseModalOpen(true);
                }}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#801b34] transition-colors"
              >
                <span className="material-symbols-outlined text-lg">add_circle</span>
                Nuevo Curso
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#e4dcde] text-[10px] font-black uppercase tracking-widest text-[#85666e]">
                    <th className="px-4 py-3">Curso</th>
                    <th className="px-4 py-3">Categoría</th>
                    <th className="px-4 py-3">Instructor</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f4f1f1]">
                  {courses.map(course => (
                    <tr key={course.id} className="group hover:bg-card-cream transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img src={course.image} className="size-10 rounded-lg object-cover" />
                          <span className="font-bold text-[#171213]">{course.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="bg-primary/5 text-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                          {course.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-[#85666e]">{course.instructor}</td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEditCourse(course)}
                            className="p-2 text-[#85666e] hover:text-primary transition-colors"
                          >
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteCourse(course.id)}
                            className="p-2 text-[#85666e] hover:text-red-600 transition-colors"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-[#171213]">Sesiones de Talleres</h2>
              <button 
                onClick={() => {
                  setEditingWorkshop({});
                  setIsWorkshopModalOpen(true);
                }}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#801b34] transition-colors"
              >
                <span className="material-symbols-outlined text-lg">add_circle</span>
                Añadir Sesión
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#e4dcde] text-[10px] font-black uppercase tracking-widest text-[#85666e]">
                    <th className="px-4 py-3">Día</th>
                    <th className="px-4 py-3">Hora</th>
                    <th className="px-4 py-3">Taller</th>
                    <th className="px-4 py-3">Categoría</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f4f1f1]">
                  {workshops.sort((a,b) => a.day - b.day || a.hour - b.hour).map(workshop => {
                    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
                    return (
                      <tr key={workshop.id} className="group hover:bg-card-cream transition-colors">
                        <td className="px-4 py-4 font-bold text-[#171213]">{days[workshop.day]}</td>
                        <td className="px-4 py-4 text-sm text-[#85666e]">{workshop.hour}:00</td>
                        <td className="px-4 py-4 text-sm font-medium text-[#171213]">{workshop.title}</td>
                        <td className="px-4 py-4">
                          <span className="bg-accent-gold/10 text-accent-gold px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                            {workshop.category}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleEditWorkshop(workshop)}
                              className="p-2 text-[#85666e] hover:text-primary transition-colors"
                            >
                              <span className="material-symbols-outlined">edit</span>
                            </button>
                            <button 
                              onClick={() => handleDeleteWorkshop(workshop.id)}
                              className="p-2 text-[#85666e] hover:text-red-600 transition-colors"
                            >
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-full bg-primary flex items-center justify-center text-white">
            <span className="material-symbols-outlined">security</span>
          </div>
          <div>
            <h4 className="font-bold text-primary">Seguridad del Panel</h4>
            <p className="text-xs text-[#85666e]">Los cambios realizados aquí se reflejarán inmediatamente en la vista pública de los usuarios.</p>
          </div>
        </div>
        <button className="text-primary font-bold text-sm border-b border-primary border-dashed">Descargar Respaldo</button>
      </div>

      {/* Course Modal */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-2xl font-bold text-[#171213] mb-4">
              {editingCourse.id ? 'Editar Curso' : 'Nuevo Curso'}
            </h3>
            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#85666e] mb-1">Título</label>
                <input 
                  type="text" 
                  value={editingCourse.title || ''} 
                  onChange={e => setEditingCourse({...editingCourse, title: e.target.value})}
                  className="w-full rounded-lg border-[#e4dcde] focus:border-primary focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#85666e] mb-1">Instructor</label>
                <input 
                  type="text" 
                  value={editingCourse.instructor || ''} 
                  onChange={e => setEditingCourse({...editingCourse, instructor: e.target.value})}
                  className="w-full rounded-lg border-[#e4dcde] focus:border-primary focus:ring-primary"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#85666e] mb-1">Categoría</label>
                  <select 
                    value={editingCourse.category || 'Cultura'} 
                    onChange={e => setEditingCourse({...editingCourse, category: e.target.value})}
                    className="w-full rounded-lg border-[#e4dcde] focus:border-primary focus:ring-primary"
                  >
                    <option value="Cultura">Cultura</option>
                    <option value="Ciberescuela">Ciberescuela</option>
                    <option value="Ponte Pila">Ponte Pila</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#85666e] mb-1">Horario</label>
                  <input 
                    type="text"
                    placeholder="Ej: Lunes y Miércoles 16:00 - 18:00"
                    value={editingCourse.schedule || ''} 
                    onChange={e => setEditingCourse({...editingCourse, schedule: e.target.value})}
                    className="w-full rounded-lg border-[#e4dcde] focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#85666e] mb-1">Imagen del Curso</label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer bg-[#f4f1f1] hover:bg-[#e4dcde] text-[#85666e] px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                       <span className="material-symbols-outlined">upload_file</span>
                       Subir Imagen
                       <input 
                         type="file" 
                         accept="image/*"
                         className="hidden"
                         onChange={handleImageUpload}
                       />
                    </label>
                    <span className="text-xs text-[#85666e] italic">o pega una URL abajo</span>
                  </div>

                  <input 
                    type="text" 
                    placeholder="https://..."
                    value={editingCourse.image || ''} 
                    onChange={e => setEditingCourse({...editingCourse, image: e.target.value})}
                    className="w-full rounded-lg border-[#e4dcde] focus:border-primary focus:ring-primary text-sm"
                  />
                  
                  {editingCourse.image && (
                    <div className="mt-2 h-32 w-full rounded-lg overflow-hidden border border-[#e4dcde] relative bg-gray-50">
                      <img src={editingCourse.image} alt="Vista previa" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#85666e] mb-1">Descripción</label>
                <textarea 
                  value={editingCourse.description || ''} 
                  onChange={e => setEditingCourse({...editingCourse, description: e.target.value})}
                  className="w-full rounded-lg border-[#e4dcde] focus:border-primary focus:ring-primary"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="px-4 py-2 text-[#85666e] font-bold hover:bg-[#f4f1f1] rounded-lg"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-[#801b34]"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Workshop Modal */}
      {isWorkshopModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-2xl font-bold text-[#171213] mb-4">
              {editingWorkshop.id ? 'Editar Sesión' : 'Nueva Sesión'}
            </h3>
            <form onSubmit={handleSaveWorkshop} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#85666e] mb-1">Actividad / Taller</label>
                <input 
                  type="text" 
                  value={editingWorkshop.title || ''} 
                  onChange={e => setEditingWorkshop({...editingWorkshop, title: e.target.value})}
                  className="w-full rounded-lg border-[#e4dcde] focus:border-primary focus:ring-primary"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#85666e] mb-1">Día</label>
                  <select 
                    value={editingWorkshop.day ?? 0}
                    onChange={e => setEditingWorkshop({...editingWorkshop, day: parseInt(e.target.value)})}
                    className="w-full rounded-lg border-[#e4dcde] focus:border-primary focus:ring-primary"
                  >
                    <option value={0}>Lunes</option>
                    <option value={1}>Martes</option>
                    <option value={2}>Miércoles</option>
                    <option value={3}>Jueves</option>
                    <option value={4}>Viernes</option>
                    <option value={5}>Sábado</option>
                    <option value={6}>Domingo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#85666e] mb-1">Hora Inicio (24h)</label>
                  <input 
                    type="number" 
                    min={8} 
                    max={20}
                    value={editingWorkshop.hour ?? 8}
                    onChange={e => setEditingWorkshop({...editingWorkshop, hour: parseInt(e.target.value)})}
                    className="w-full rounded-lg border-[#e4dcde] focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#85666e] mb-1">Categoría</label>
                  <select 
                    value={editingWorkshop.category || 'Cultura'}
                    onChange={e => setEditingWorkshop({...editingWorkshop, category: e.target.value as any})}
                    className="w-full rounded-lg border-[#e4dcde] focus:border-primary focus:ring-primary"
                  >
                    <option value="Cultura">Cultura</option>
                    <option value="Ciberescuela">Ciberescuela</option>
                    <option value="Ponte Pila">Ponte Pila</option>
                    <option value="Destacado">Destacado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#85666e] mb-1">Texto Horario</label>
                  <input 
                    type="text" 
                    placeholder="Ej: 10:00 - 12:00"
                    value={editingWorkshop.timeString || ''}
                    onChange={e => setEditingWorkshop({...editingWorkshop, timeString: e.target.value})}
                    className="w-full rounded-lg border-[#e4dcde] focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#85666e] mb-1">Estilo Tarjeta</label>
                <select 
                  value={editingWorkshop.type || 'primary'}
                  onChange={e => setEditingWorkshop({...editingWorkshop, type: e.target.value as any})}
                  className="w-full rounded-lg border-[#e4dcde] focus:border-primary focus:ring-primary"
                >
                  <option value="primary">Rojo (Primary)</option>
                  <option value="muted">Gris (Muted)</option>
                  <option value="gold">Dorado (Gold)</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsWorkshopModalOpen(false)}
                  className="px-4 py-2 text-[#85666e] font-bold hover:bg-[#f4f1f1] rounded-lg"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-[#801b34]"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
