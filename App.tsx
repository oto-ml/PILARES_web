import { useEffect, useState, useMemo } from 'react';
import { db } from './src/firebase'; 
import { collection, getDocs } from 'firebase/firestore'; 
import { Course, WorkshopSession } from './types';

import Header from './components/Header';
import Workshops from './components/Workshops';
import Footer from './components/Footer';
import CourseCard from './components/CourseCard';
import AdminPanel from './components/AdminPanel';
import CourseDetail from './components/CourseDetail';
import { CATEGORIES } from './constants';

const App: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [workshops, setWorkshops] = useState<WorkshopSession[]>([]);
  const [loading, setLoading] = useState(true); 
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'catalog' | 'workshops' | 'admin' | 'details'>('catalog');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const coursesSnap = await getDocs(collection(db, "courses"));
        setCourses(coursesSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Course[]);
        
        const workshopsSnap = await getDocs(collection(db, "workshops"));
        setWorkshops(workshopsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as WorkshopSession[]);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const catMatch = selectedCategory === 'all' || c.category === selectedCategory;
      const searchMatch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
      return catMatch && searchMatch;
    });
  }, [courses, selectedCategory, searchQuery]);

  const handleNavigate = (view: any) => {
    setActiveView(view);
    if (view === 'workshops') {
        setTimeout(() => document.getElementById('workshops-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeView={activeView} onNavigate={handleNavigate} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <main className="container mx-auto px-4 py-8">
        {activeView === 'admin' && (
            <AdminPanel 
                courses={courses} onUpdateCourses={setCourses}
                workshops={workshops} onUpdateWorkshops={setWorkshops}
            />
        )}

        {activeView === 'catalog' && (
            <>
                <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
                    <button onClick={() => setSelectedCategory('all')} className={`px-4 py-2 rounded-full ${selectedCategory === 'all' ? 'bg-primary text-white' : 'bg-white'}`}>Todos</button>
                    {CATEGORIES.map(cat => (
                        <button key={cat.id} onClick={() => setSelectedCategory(cat.name)} className={`px-4 py-2 rounded-full whitespace-nowrap ${selectedCategory === cat.name ? 'bg-primary text-white' : 'bg-white'}`}>{cat.name}</button>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {filteredCourses.map(course => (
                        <CourseCard key={course.id} course={course} onSelect={setSelectedCourse} />
                    ))}
                </div>
            </>
        )}

        <div id="workshops-section" className={activeView === 'workshops' ? 'block' : 'mt-12'}>
            {(activeView === 'workshops' || activeView === 'catalog') && (
                <Workshops sessions={workshops} />
            )}
        </div>
      </main>

      {selectedCourse && <CourseDetail course={selectedCourse} onClose={() => setSelectedCourse(null)} />}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};
export default App;