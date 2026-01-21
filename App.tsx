import { useEffect, useState, useMemo } from 'react';
// Importación de Firebase (Asegúrate que la ruta sea correcta según tu estructura)
import { db } from './src/firebase'; 
import { collection, getDocs } from 'firebase/firestore'; 
import { Course, WorkshopSession } from './types';

// ✅ CORRECCIÓN AQUÍ: Importaciones sin llaves { } porque son export default
import Header from './components/Header';
import Workshops from './components/Workshops';
import Footer from './components/Footer';
import CourseCard from './components/CourseCard';

import { CATEGORIES, COURSES as FALLBACK_COURSES, WORKSHOP_SCHEDULE as FALLBACK_WORKSHOPS } from './constants';

const App: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [workshops, setWorkshops] = useState<WorkshopSession[]>([]);
  const [loading, setLoading] = useState(true); 
  
  // Estados de UI
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Carga de datos
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

  // Lógica de Filtros
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesCategory = selectedCategory === 'all' || 
                              course.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [courses, selectedCategory, searchQuery]);

  // Navegación simple (Placeholder para que el Header funcione)
  const [activeView, setActiveView] = useState<'catalog' | 'workshops' | 'admin' | 'details'>('catalog');
  const handleNavigate = (view: 'catalog' | 'workshops' | 'admin' | 'details') => {
    setActiveView(view);
    // Aquí podrías agregar lógica para scrollear a la sección correspondiente
    if (view === 'workshops') {
        document.getElementById('workshops-section')?.scrollIntoView({ behavior: 'smooth' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando PILARES...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        activeView={activeView} 
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Sección de Filtros (Solo visible en vista catálogo) */}
        {activeView === 'catalog' && (
            <>
                <div className="mb-8 space-y-4">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        <button 
                            onClick={() => setSelectedCategory('all')}
                            className={`px-4 py-2 rounded-full transition-colors ${selectedCategory === 'all' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                        >
                            Todos
                        </button>
                        {CATEGORIES.map(cat => (
                            <button 
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${selectedCategory === cat.name ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Cursos Disponibles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map(course => (
                            <CourseCard 
                                key={course.id} 
                                course={course} 
                                onSelect={(c) => console.log("Curso seleccionado:", c)}
                            />
                        ))}
                    </div>
                    {filteredCourses.length === 0 && (
                        <div className="text-center py-10 bg-white rounded-lg border border-dashed border-gray-300">
                            <p className="text-gray-500">No se encontraron cursos con esos filtros.</p>
                        </div>
                    )}
                </section>
            </>
        )}

        {/* Sección de Talleres */}
        <div id="workshops-section" className={activeView === 'workshops' ? 'block' : 'mt-12'}>
            {(activeView === 'workshops' || activeView === 'catalog') && (
                <Workshops />
            )}
        </div>
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;