import React, { useState } from 'react';
import { db } from '../src/firebase'; 
import { doc, setDoc, deleteDoc, collection, writeBatch } from 'firebase/firestore';
import { Course } from '../types';

interface AdminPanelProps {
  courses: Course[];
  onUpdateCourses: (courses: Course[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ courses, onUpdateCourses }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Partial<Course>>({});
  const [saving, setSaving] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'pilares2026') {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Contraseña incorrecta');
    }
  };

  const openModal = (course?: Course) => {
    if (course) {
      setCurrentCourse(course);
    } else {
      setCurrentCourse({
        title: '',
        instructor: '',
        category: 'Cultura',
        description: '',
        image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19',
        price: 0,
        schedule: 'Lunes a Viernes 10:00 - 12:00' // Valor por defecto sugerido
      });
    }
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCourse.title) return;
    setSaving(true);

    try {
      const courseId = currentCourse.id || doc(collection(db, "courses")).id;
      
      const courseToSave: Course = {
        id: courseId,
        title: currentCourse.title || '',
        instructor: currentCourse.instructor || '',
        category: currentCourse.category || 'Cultura',
        description: currentCourse.description || '',
        image: currentCourse.image || '',
        price: 0,
        // ✅ AHORA SÍ GUARDAMOS EL HORARIO
        schedule: currentCourse.schedule || 'Horario por definir'
      };

      await setDoc(doc(db, "courses", courseId), courseToSave);
      
      if (currentCourse.id) {
        onUpdateCourses(courses.map(c => c.id === courseId ? courseToSave : c));
      } else {
        onUpdateCourses([...courses, courseToSave]);
      }
      
      setIsEditing(false);
      alert("✅ Guardado exitosamente");
    } catch (error) {
      console.error("Error guardando:", error);
      alert("❌ Error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que quieres borrar este curso?")) return;
    try {
      await deleteDoc(doc(db, "courses", id));
      onUpdateCourses(courses.filter(c => c.id !== id));
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <form onSubmit={handleLogin} className="w-full max-w-xs flex flex-col gap-4">
          <input type="password" placeholder="Contraseña" className="border p-3 rounded" value={password} onChange={(e) => setPassword(e.target.value)} />
          {errorMsg && <p className="text-red-500 text-sm font-bold">{errorMsg}</p>}
          <button type="submit" className="bg-primary text-white font-bold py-3 rounded">Entrar</button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg min-h-screen">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h2 className="text-2xl font-bold text-primary">Gestión de Cursos</h2>
        <div className="flex gap-2">
            <button onClick={() => setIsAuthenticated(false)} className="px-4 py-2 border rounded">Salir</button>
            <button onClick={() => openModal()} className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
                <span className="material-symbols-outlined">add</span> Nuevo
            </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Curso</th>
              <th className="p-4">Instructor</th>
              <th className="p-4">Horario</th> {/* Nueva columna */}
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">No hay cursos. Crea uno nuevo.</td></tr>
            ) : (
                courses.map(c => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-bold">{c.title}</td>
                    <td className="p-4">{c.instructor}</td>
                    <td className="p-4 text-sm text-gray-600">{c.schedule}</td>
                    <td className="p-4 flex justify-end gap-2">
                    <button onClick={() => openModal(c)} className="text-blue-600 p-2"><span className="material-symbols-outlined">edit</span></button>
                    <button onClick={() => handleDelete(c.id)} className="text-red-600 p-2"><span className="material-symbols-outlined">delete</span></button>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
                <h3 className="text-xl font-bold">{currentCourse.id ? 'Editar' : 'Crear'} Curso</h3>
                <button onClick={() => setIsEditing(false)}><span className="material-symbols-outlined">close</span></button>
            </div>
            
            <div className="p-6 overflow-y-auto">
                <form id="courseForm" onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">Título</label>
                        <input className="w-full border p-2 rounded" required value={currentCourse.title || ''} onChange={e => setCurrentCourse({...currentCourse, title: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-1">Instructor</label>
                            <input className="w-full border p-2 rounded" required value={currentCourse.instructor || ''} onChange={e => setCurrentCourse({...currentCourse, instructor: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Categoría</label>
                            <select className="w-full border p-2 rounded bg-white" value={currentCourse.category || 'Cultura'} onChange={e => setCurrentCourse({...currentCourse, category: e.target.value})}>
                                <option value="Cultura">Cultura</option>
                                <option value="Ciberescuela">Ciberescuela</option>
                                <option value="Ponte Pila">Ponte Pila</option>
                                <option value="Oficios">Oficios</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* ✅ CAMPO DE HORARIO AGREGADO */}
                    <div>
                        <label className="block text-sm font-bold mb-1">Horario (Días y Horas)</label>
                        <input 
                            className="w-full border p-2 rounded" 
                            required 
                            placeholder="Ej: Lunes y Miércoles 16:00 - 18:00"
                            value={currentCourse.schedule || ''} 
                            onChange={e => setCurrentCourse({...currentCourse, schedule: e.target.value})} 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1">Descripción</label>
                        <textarea className="w-full border p-2 rounded h-24" required value={currentCourse.description || ''} onChange={e => setCurrentCourse({...currentCourse, description: e.target.value})} />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1">URL Imagen</label>
                        <input className="w-full border p-2 rounded" placeholder="https://..." value={currentCourse.image || ''} onChange={e => setCurrentCourse({...currentCourse, image: e.target.value})} />
                    </div>
                </form>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded">Cancelar</button>
                <button type="submit" form="courseForm" className="px-4 py-2 bg-primary text-white rounded font-bold">
                    {saving ? 'Guardando...' : 'Guardar'}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;