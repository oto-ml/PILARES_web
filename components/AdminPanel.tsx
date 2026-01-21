import React, { useState, useEffect } from 'react';
import { db } from '../src/firebase'; 
import { doc, setDoc, deleteDoc, collection } from 'firebase/firestore';
import { Course } from '../types';

interface AdminPanelProps {
  courses: Course[];
  onUpdateCourses: (courses: Course[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ courses, onUpdateCourses }) => {
  // --- ESTADO DE AUTENTICACIÓN ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // --- ESTADO DEL CRUD ---
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Partial<Course>>({});
  const [saving, setSaving] = useState(false);

  // Función simple de Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // ⚠️ CONTRASEÑA: Puedes cambiar "pilares2026" por lo que quieras
    if (password === 'pilares2026') {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Contraseña incorrecta');
    }
  };

  // Función para abrir el modal
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
        schedule: 'Horario por definir'
      });
    }
    setIsEditing(true);
  };

  // Guardar en Firebase
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCourse.title) return;
    setSaving(true);

    try {
      // 1. Definir ID
      const courseId = currentCourse.id || doc(collection(db, "courses")).id;
      
      // 2. Preparar objeto asegurando que no haya undefined
      const courseToSave: Course = {
        id: courseId,
        title: currentCourse.title || '',
        instructor: currentCourse.instructor || '',
        category: currentCourse.category || 'Cultura',
        description: currentCourse.description || '',
        image: currentCourse.image || '',
        price: 0,
        schedule: currentCourse.schedule || 'Por definir'
      };

      // 3. Escribir en Firestore
      await setDoc(doc(db, "courses", courseId), courseToSave);
      
      // 4. Actualizar estado local (para ver cambios sin recargar)
      if (currentCourse.id) {
        // Editar
        onUpdateCourses(courses.map(c => c.id === courseId ? courseToSave : c));
      } else {
        // Crear nuevo
        onUpdateCourses([...courses, courseToSave]);
      }
      
      setIsEditing(false);
      alert("✅ Curso guardado correctamente en la nube.");
    } catch (error) {
      console.error("Error guardando:", error);
      alert("❌ Error al guardar. Verifica tu conexión o permisos.");
    } finally {
      setSaving(false);
    }
  };

  // Eliminar
  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que quieres borrar este curso?")) return;

    try {
      await deleteDoc(doc(db, "courses", id));
      onUpdateCourses(courses.filter(c => c.id !== id));
      alert("Curso eliminado.");
    } catch (error) {
      console.error("Error borrando:", error);
      alert("Error al eliminar.");
    }
  };

  // --- RENDER: VISTA DE LOGIN ---
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <span className="material-symbols-outlined text-6xl text-primary mb-4">lock</span>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Acceso Administrativo</h2>
        <form onSubmit={handleLogin} className="w-full max-w-xs flex flex-col gap-4">
          <input
            type="password"
            placeholder="Contraseña de Administrador"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          {errorMsg && <p className="text-red-500 text-sm text-center font-bold">{errorMsg}</p>}
          <button 
            type="submit"
            className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-[#801b34] transition-colors"
          >
            Entrar
          </button>
        </form>
        <p className="mt-4 text-xs text-gray-400">Contraseña demo: pilares2026</p>
      </div>
    );
  }

  // --- RENDER: PANEL DE ADMIN (Si está autenticado) ---
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg min-h-screen animate-in fade-in">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <div>
          <h2 className="text-2xl font-bold text-primary">Gestión de Cursos</h2>
          <p className="text-sm text-gray-500">Editando base de datos en tiempo real</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={() => setIsAuthenticated(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded border"
            >
                Cerrar Sesión
            </button>
            <button 
                onClick={() => openModal()}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2 shadow-md"
            >
                <span className="material-symbols-outlined">add</span> Nuevo Curso
            </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 font-bold text-gray-700 border-b">Curso</th>
              <th className="p-4 font-bold text-gray-700 border-b">Instructor</th>
              <th className="p-4 font-bold text-gray-700 border-b">Categoría</th>
              <th className="p-4 font-bold text-gray-700 border-b text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {courses.map(course => (
              <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                    <div className="font-bold text-gray-900">{course.title}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{course.description}</div>
                </td>
                <td className="p-4 text-sm text-gray-600">{course.instructor}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-bold
                    ${course.category === 'Cultura' ? 'bg-purple-100 text-purple-700' : 
                      course.category === 'Ciberescuela' ? 'bg-blue-100 text-blue-700' : 
                      'bg-orange-100 text-orange-700'}`}
                  >
                    {course.category}
                  </span>
                </td>
                <td className="p-4 flex justify-end gap-2">
                  <button 
                    onClick={() => openModal(course)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(course.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL FLOTANTE */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">
                {currentCourse.id ? 'Editar Curso' : 'Crear Nuevo Curso'}
                </h3>
                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
                <form id="courseForm" onSubmit={handleSave} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold mb-1 text-gray-700">Título del Curso</label>
                    <input 
                    type="text" 
                    required
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={currentCourse.title || ''}
                    onChange={e => setCurrentCourse({...currentCourse, title: e.target.value})}
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-bold mb-1 text-gray-700">Instructor</label>
                    <input 
                        type="text" 
                        required
                        className="w-full border border-gray-300 p-2.5 rounded-lg"
                        value={currentCourse.instructor || ''}
                        onChange={e => setCurrentCourse({...currentCourse, instructor: e.target.value})}
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-bold mb-1 text-gray-700">Categoría</label>
                    <select 
                        className="w-full border border-gray-300 p-2.5 rounded-lg bg-white"
                        value={currentCourse.category || 'Cultura'}
                        onChange={e => setCurrentCourse({...currentCourse, category: e.target.value})}
                    >
                        <option value="Cultura">Cultura</option>
                        <option value="Ciberescuela">Ciberescuela</option>
                        <option value="Ponte Pila">Ponte Pila</option>
                        <option value="Oficios">Oficios</option>
                    </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-1 text-gray-700">Descripción</label>
                    <textarea 
                    required
                    className="w-full border border-gray-300 p-2.5 rounded-lg h-24 resize-none"
                    value={currentCourse.description || ''}
                    onChange={e => setCurrentCourse({...currentCourse, description: e.target.value})}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-1 text-gray-700">URL de Imagen</label>
                    <input 
                    type="text" 
                    className="w-full border border-gray-300 p-2.5 rounded-lg text-sm text-gray-600"
                    placeholder="https://..."
                    value={currentCourse.image || ''}
                    onChange={e => setCurrentCourse({...currentCourse, image: e.target.value})}
                    />
                    {currentCourse.image && (
                        <div className="mt-2 h-32 w-full bg-gray-100 rounded-lg overflow-hidden">
                            <img src={currentCourse.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>
                </form>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 text-gray-700 hover:bg-gray-200 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  form="courseForm"
                  disabled={saving}
                  className="px-5 py-2.5 bg-primary text-white hover:bg-[#801b34] rounded-lg font-bold shadow-lg disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? 'Guardando...' : 'Guardar Curso'}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;