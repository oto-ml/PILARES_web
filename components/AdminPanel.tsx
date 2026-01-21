// components/AdminPanel.tsx
import { db } from '../src/firebase';
import { doc, setDoc, deleteDoc, collection } from 'firebase/firestore';

// ... dentro de tu componente ...

  // EJEMPLO: Modificar handleSaveCourse
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Si no tiene ID (es nuevo), creamos uno nuevo con una referencia de documento
    const courseId = editingCourse.id || doc(collection(db, "courses")).id;
    
    const courseToSave = {
        ...editingCourse,
        id: courseId,
        price: 0 // Asegurar valores por defecto
    };

    try {
        // Guardar en Firestore (esto funciona para crear Y para editar)
        await setDoc(doc(db, "courses", courseId), courseToSave);
        
        // Actualizar el estado local para que se vea inmediato
        if (editingCourse.id) {
            onUpdateCourses(courses.map(c => c.id === courseId ? courseToSave as Course : c));
        } else {
            onUpdateCourses([...courses, courseToSave as Course]);
        }
        
        setIsCourseModalOpen(false);
        alert("Curso guardado en la nube correctamente");
    } catch (error) {
        console.error("Error guardando:", error);
        alert("Hubo un error al guardar");
    }
  };

  // EJEMPLO: Modificar handleDeleteCourse
  const handleDeleteCourse = async (id: string) => {
    if (confirm('¿Estás seguro?')) {
        try {
            await deleteDoc(doc(db, "courses", id));
            onUpdateCourses(courses.filter(c => c.id !== id));
        } catch (error) {
            console.error("Error borrando:", error);
        }
    }
  };