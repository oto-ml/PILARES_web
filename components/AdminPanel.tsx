
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

  const deleteCourse = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      onUpdateCourses(courses.filter(c => c.id !== id));
    }
  };

  const deleteWorkshop = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta sesión del horario?')) {
      onUpdateWorkshops(workshops.filter(w => w.id !== id));
    }
  };

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
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#801b34] transition-colors">
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
                          <button className="p-2 text-[#85666e] hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button 
                            onClick={() => deleteCourse(course.id)}
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
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#801b34] transition-colors">
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
                            <button className="p-2 text-[#85666e] hover:text-primary transition-colors">
                              <span className="material-symbols-outlined">edit</span>
                            </button>
                            <button 
                              onClick={() => deleteWorkshop(workshop.id)}
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
    </div>
  );
};

export default AdminPanel;
