import { useEffect, useState, useMemo } from 'react';
// CORRECCIÓN 1: La ruta correcta debe incluir 'src' porque firebase.ts está dentro de esa carpeta
import { db } from './src/firebase'; 
import { collection, getDocs } from 'firebase/firestore'; 
import { Course, WorkshopSession } from './types';
import { Header } from './components/Header';
import { Workshops } from './components/Workshops';
import { Footer } from './components/Footer';
import { CourseCard } from './components/CourseCard';
import { CATEGORIES, COURSES as FALLBACK_COURSES, WORKSHOP_SCHEDULE as FALLBACK_WORKSHOPS } from './constants';

const App: React.FC = () => {
  // CORRECCIÓN 2: Eliminado el error de dedo "XH"
  const [courses, setCourses] = useState<Course[]>([]);
  const [workshops, setWorkshops] = useState<WorkshopSession[]>([]);
  const [loading, setLoading] = useState(true); 
  
  // Estados de UI
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Cargar cursos
        const coursesSnapshot = await getDocs(collection(db, "courses"));
        const coursesList = coursesSnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
        })) as Course[];
        
        // Cargar talleres
        const workshopsSnapshot = await getDocs(collection(db, "workshops"));
        const workshopsList = workshopsSnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
        })) as WorkshopSession[];

        setCourses(coursesList.length > 0 ? coursesList : FALLBACK_COURSES);
        setWorkshops(workshopsList.length > 0 ? workshopsList : FALLBACK_WORKSHOPS);

      } catch (error) {
        console.error("Error cargando datos:", error);
        setCourses(FALLBACK_COURSES);
        setWorkshops(FALLBACK_WORKSHOPS);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesCategory = selectedCategory === 'all' || 
                              course.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [courses, selectedCategory, searchQuery]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando PILARES...</div>;
  }

  // CORRECCIÓN 3: JSX completo sin marcadores "..."
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
            <input 
                type="text" 
                placeholder="Buscar curso o instructor..." 
                className="w-full p-2 border rounded"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex gap-2 overflow-x-auto pb-2">
                <button 
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-full ${selectedCategory === 'all' ? 'bg-primary text-white' : 'bg-white'}`}
                >
                    Todos
                </button>
                {CATEGORIES.map(cat => (
                    <button 
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`px-4 py-2 rounded-full whitespace-nowrap ${selectedCategory === cat.name ? 'bg-primary text-white' : 'bg-white'}`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>

        <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Cursos Disponibles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map(course => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
            {filteredCourses.length === 0 && (
                <p className="text-center text-gray-500 mt-10">No se encontraron cursos con esos filtros.</p>
            )}
        </section>

        <Workshops sessions={workshops} />
      </main>

      <Footer />
    </div>
  );
};

export default App;