import { useEffect, useState, useMemo } from 'react';
// Importa la configuración de Firebase
import { db } from './src/firebase'; 
import { collection, getDocs } from 'firebase/firestore'; 
import { Course, WorkshopSession } from './types';

// Componentes (Importaciones sin llaves porque son export default)
import Header from './components/Header';
import Workshops from './components/Workshops';
import Footer from './components/Footer';
import CourseCard from './components/CourseCard';
import AdminPanel from './components/AdminPanel';
import CourseDetail from './components/CourseDetail';

// Constantes
import { CATEGORIES } from './constants';

const App: React.FC = () => {
  // --- ESTADOS DE DATOS ---
  const [courses, setCourses] = useState<Course[]>([]);
  const [workshops, setWorkshops] = useState<WorkshopSession[]>([]);
  const [loading, setLoading] = useState(true); 
  
  // --- ESTADOS DE UI ---
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'catalog' | 'workshops' | 'admin' | 'details'>('catalog');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // --- CARGA DE DATOS DESDE FIREBASE ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Obtener Cursos
        const coursesSnapshot = await getDocs(collection(db, "courses"));
        const coursesList = coursesSnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
        })) as Course[];
        
        // 2. Obtener Talleres (Horario)
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

  // --- LÓGICA DE FILTRADO (SOLO PARA CURSOS) ---
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesCategory = selectedCategory === 'all' || 
                              course.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [courses, selectedCategory, searchQuery]);

  // --- NAVEGACIÓN ---
  const handleNavigate = (view: 'catalog' | 'workshops' | 'admin' | 'details') => {
    setActiveView(view);
    if (view === 'workshops') {
        // Pequeño delay para asegurar que el componente se renderizó antes de scrollear
        setTimeout(() => document.getElementById('workshops-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
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
        
        {/* VISTA: PANEL DE ADMINISTRADOR */}
        {activeView === 'admin' && (
            <AdminPanel 
                courses={courses} 
                onUpdateCourses={setCourses}
                workshops={workshops}           // ✅ Pasamos los talleres al admin
                onUpdateWorkshops={setWorkshops} // ✅ Pasamos la función para actualizar talleres
            />
        )}

        {/* VISTA: CATÁLOGO DE CURSOS */}
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
                                onSelect={(c) => setSelectedCourse(c)}
                            />
                        ))}
                    </div>
                    {filteredCourses.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
                            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">folder_open</span>
                            <p className="text-gray-500 text-lg">No hay cursos disponibles actualmente.</p>
                        </div>
                    )}
                </section>
            </>
        )}

        {/* VISTA: TALLERES / HORARIO GENERAL */}
        {/* Se muestra si estamos en la vista 'workshops' O si estamos en 'catalog' (abajo de los cursos) */}
        <div id="workshops-section" className={activeView === 'workshops' ? 'block' : 'mt-12'}>
            {(activeView === 'workshops' || activeView === 'catalog') && (
                // ✅ AQUÍ ESTÁ EL CAMBIO CLAVE: Pasamos los datos reales 'sessions={workshops}'
                <Workshops sessions={workshops} />
            )}
        </div>
      </main>

      {/* MODAL DE DETALLE DEL CURSO */}
      {selectedCourse && (
        <CourseDetail 
            course={selectedCourse} 
            onClose={() => setSelectedCourse(null)} 
        />
      )}

      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;