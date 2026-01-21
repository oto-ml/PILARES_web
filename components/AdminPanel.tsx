import React, { useState } from 'react';
import { db } from '../src/firebase'; 
// Importamos writeBatch para hacer muchas escrituras juntas
import { doc, setDoc, deleteDoc, collection, writeBatch } from 'firebase/firestore';
import { Course } from '../types';

// IMPORTAR TUS DATOS FIJOS (Asegúrate que la ruta sea correcta)
import { COURSES, WORKSHOP_SCHEDULE } from '../constants';

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
    if (password === 'pilares2026') {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Contraseña incorrecta');
    }
  };

  // --- FUNCIÓN DE CARGA INICIAL (SEED) ---
  const handleInitialLoad = async () => {
    if (!window.confirm("⚠️ ¿ESTÁS SEGURO?\n\nEsto borrará o sobrescribirá los datos en la nube con los del archivo 'constants.ts'. Úsalo solo para inicializar.")) {
        return;
    }

    setSaving(true);
    try {
        const batch = writeBatch(db);

        // 1. Cargar Cursos
        COURSES.forEach((course) => {
            const ref = doc(db, "courses", course.id);
            batch.set(ref, course);
        });

        // 2. Cargar Talleres (Opcional, si quieres guardarlos también en BD)
        WORKSHOP_SCHEDULE.forEach((workshop) => {
            const ref = doc(db, "workshops", workshop.id);
            batch.set(ref, workshop);
        });

        await batch.commit();
        alert("✅ Base de datos inicializada correctamente.\nLa página se recargará.");
        window.location.reload();

    } catch (error) {
        console.error("Error en carga inicial:", error);
        alert("❌ Error subiendo datos: " + error);
    } finally {
        setSaving(false);
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

  // Guardar curso individual
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
        schedule: currentCourse.schedule || 'Por definir'
      };

      await setDoc(doc(db, "courses", courseId), courseToSave);
      
      if (currentCourse.id) {
        onUpdateCourses(courses.map(c => c.id === courseId ? courseToSave : c));
      } else {
        onUpdateCourses([...courses, courseToSave]);
      }
      
      setIsEditing(false);
      alert("Curso guardado correctamente");
    } catch (error) {
      console.error("Error guardando:", error);
      alert("Error al guardar: Revisa permisos en Firebase Console");
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
    } catch (error) {
      console.error("Error borrando:", error);
      alert("Error al eliminar");
    }
  };

  // VISTA LOGIN
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <span className="material-symbols-outlined text-6xl text-primary mb-4">lock</span>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Acceso Administrativo</h2>
        <form onSubmit={handleLogin} className="w-full max-w-xs flex flex-col gap-4">
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorMsg && <p className="text-red-500 text-sm text-center font-bold">{errorMsg}</p>}
          <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-[#801b34]">
            Entrar
          </button>
        </form>
        <p className="mt-4 text-xs text-gray-400">Pass: pilares2026</p>
      </div>
    );
  }

  // VISTA PANEL
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 pb-4 border-b gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary">Gestión de Cursos</h2>
        </div>
        
        <div className="flex flex-wrap gap-3 justify-end">
            {/* BOTÓN MÁGICO DE CARGA INICIAL */}
            <button 
                onClick={handleInitialLoad}
                disabled={saving}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 flex items-center gap-2 text-sm font-bold shadow-md"
                title="Usar esto solo si la base de datos está vacía"
            >
                <span className="material-symbols-outlined text-lg">cloud_upload</span> 
                {saving ? 'Cargando...' : 'Restaurar BD'}
            </button>

            <button 
                onClick={() => openModal()}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2 shadow-md"
            >
                <span className="material-symbols-outlined">add</span> Nuevo
            </button>
             <button 
                onClick={() => setIsAuthenticated(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded border"
            >
                Salir
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
            {courses.length === 0 ? (
                <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                        La base de datos parece vacía. <br/>
                        Presiona <b>"Restaurar BD"</b> arriba para cargar los datos iniciales.
                    </td>
                </tr>
            ) : (
                courses.map(course => (
                <tr key={course.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium">{course.title}</td>
                    <td className="p-4 text-sm text-gray-600">{course.instructor}</td>
                    <td className="p-4"><span className="text-xs bg-gray-100 px-2 py-1 rounded">{course.category}</span></td>
                    <td className="p-4 flex justify-end gap-2">
                    <button onClick={() => openModal(course)} className="text-blue-600 hover:bg-blue-50 p-2 rounded">
                        <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button onClick={() => handleDelete(course.id)} className="text-red-600 hover:bg-red-50 p-2 rounded">
                        <span className="material-symbols-outlined">delete</span>
                    </button>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL (Mismo código de antes) */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden p-6">
            <h3 className="text-xl font-bold mb-4">{currentCourse.id ? 'Editar' : 'Crear'} Curso</h3>
            <form onSubmit={handleSave} className="space-y-4">
                {/* Inputs del formulario... */}
                <div>
                    <label className="block text-sm font-bold mb-1">Título</label>
                    <input type="text" className="w-full border p-2 rounded" required
                        value={currentCourse.title || ''} 
                        onChange={e => setCurrentCourse({...currentCourse, title: e.target.value})} 
                    />
                </div>
                 <div>
                    <label className="block text-sm font-bold mb-1">Instructor</label>
                    <input type="text" className="w-full border p-2 rounded" required
                        value={currentCourse.instructor || ''} 
                        onChange={e => setCurrentCourse({...currentCourse, instructor: e.target.value})} 
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Descripción</label>
                    <textarea className="w-full border p-2 rounded h-20" required
                        value={currentCourse.description || ''} 
                        onChange={e => setCurrentCourse({...currentCourse, description: e.target.value})} 
                    />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded">Cancelar</button>
                    <button type="submit" className="px-4 py-2 bg-primary text-white rounded font-bold">Guardar</button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;