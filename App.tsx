// App.tsx
import { useEffect, useState, useMemo } from 'react';
// Importa db y las funciones de firebase
import { db } from './firebase'; 
import { collection, getDocs } from 'firebase/firestore'; 

// ... importaciones anteriores ...

const App: React.FC = () => {
  // Inicializa con arrays vacíos para que no truene mientras carga
  const [courses, setCourses] = useState<Course[]>([]);
  const [workshops, setWorkshops] = useState<WorkshopSession[]>([]);
  const [loading,XH setProcessing] = useState(true); // Para mostrar un "Cargando..."

  // EFECTO PARA CARGAR DATOS DE LA BASE DE DATOS
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Cargar Cursos
        const coursesSnapshot = await getDocs(collection(db, "courses"));
        const coursesList = coursesSnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
        })) as Course[];
        
        // 2. Cargar Talleres
        const workshopsSnapshot = await getDocs(collection(db, "workshops"));
        const workshopsList = workshopsSnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
        })) as WorkshopSession[];

        setCourses(coursesList);
        setWorkshops(workshopsList);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ... resto de tu lógica de filtros ...
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando PILARES...</div>;

  return (
    // ... tu JSX normal ...
  );
};