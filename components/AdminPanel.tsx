import React, { useState } from 'react';
// Asegúrate de que esta ruta coincida con tu estructura. 
// Si 'components' y 'src' están en la raíz, esto es correcto:
import { db } from '../src/firebase'; 
import { doc, setDoc, deleteDoc, collection } from 'firebase/firestore';
import { Course } from '../types';

interface AdminPanelProps {
  courses: Course[];
  onUpdateCourses: (courses: Course[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ courses, onUpdateCourses }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Partial<Course>>({});

  // Función para abrir el modal en modo CREAR o EDITAR
  const openModal = (course?: Course) => {
    if (course) {
      setCurrentCourse(course);
    } else {
      // Valores por defecto para nuevo curso
      setCurrentCourse({
        title: '',
        instructor: '',
        category: 'Cultura',
        description: '',
        image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19', // Imagen default
        price: 0,
        schedule: 'Horario por definir'
      });
    }
    setIsEditing(true);
  };

  // Guardar en Firebase (Crear o Actualizar)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCourse.title) return;

    // Generar ID si es nuevo, o usar el existente
    const courseId = currentCourse.id || doc(collection(db, "courses")).id;
    
    const courseToSave: Course = {
      ...(currentCourse as Course),
      id: courseId,
      price: 0 // Forzamos gratuidad
    };

    try {
      await setDoc(doc(db, "courses", courseId), courseToSave);
      
      // Actualizar estado local para feedback inmediato
      if (currentCourse.id) {
        onUpdateCourses(courses.map(c => c.id === courseId ? courseToSave : c));
      } else {
        onUpdateCourses([...courses, courseToSave]);
      }
      
      setIsEditing(false);
      alert("Curso guardado correctamente");
    } catch (error) {
      console.error("Error guardando:", error);
      alert("Error al guardar en la nube");
    }
  };

  // Eliminar de Firebase
  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que quieres borrar este curso?")) return;

    try {
      await deleteDoc(doc(db, "courses", id));
      onUpdateCourses(courses.filter(c => c.id !== id));
    } catch (error) {
      console.error("Error borrando:", error);
      alert("Error al eliminar");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Panel de Administración</h2>
        <button 
          onClick={() => openModal()}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span> Nuevo Curso
        </button>
      </div>

      {/* Tabla de Cursos */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3">Título</th>
              <th className="p-3">Instructor</th>
              <th className="p-3">Categoría</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{course.title}</td>
                <td className="p-3 text-sm">{course.instructor}</td>
                <td className="p-3">
                  <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full">
                    {course.category}
                  </span>
                </td>
                <td className="p-3 flex justify-end gap-2">
                  <button 
                    onClick={() => openModal(course)}
                    className="text-blue-600 hover:bg-blue-50 p-1 rounded"
                    title="Editar"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(course.id)}
                    className="text-red-600 hover:bg-red-50 p-1 rounded"
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

      {/* Modal de Edición */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-xl font-bold mb-4">
              {currentCourse.id ? 'Editar Curso' : 'Nuevo Curso'}
            </h3>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Título</label>
                <input 
                  type="text" 
                  required
                  className="w-full border p-2 rounded"
                  value={currentCourse.title || ''}
                  onChange={e => setCurrentCourse({...currentCourse, title: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Instructor</label>
                  <input 
                    type="text" 
                    required
                    className="w-full border p-2 rounded"
                    value={currentCourse.instructor || ''}
                    onChange={e => setCurrentCourse({...currentCourse, instructor: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Categoría</label>
                  <select 
                    className="w-full border p-2 rounded"
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
                <label className="block text-sm font-bold mb-1">Descripción</label>
                <textarea 
                  required
                  className="w-full border p-2 rounded h-24"
                  value={currentCourse.description || ''}
                  onChange={e => setCurrentCourse({...currentCourse, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">URL de Imagen</label>
                <input 
                  type="text" 
                  className="w-full border p-2 rounded text-sm"
                  placeholder="https://..."
                  value={currentCourse.image || ''}
                  onChange={e => setCurrentCourse({...currentCourse, image: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-primary text-white bg-blue-600 hover:bg-blue-700 rounded font-bold"
                >
                  Guardar Curso
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