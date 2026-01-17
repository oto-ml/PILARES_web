
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CourseCard from './components/CourseCard';
import CourseDetail from './components/CourseDetail';
import Workshops from './components/Workshops';
import AdminPanel from './components/AdminPanel';
import { COURSES, CATEGORIES, WORKSHOP_SCHEDULE } from './constants';
import { Course, WorkshopSession } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'catalog' | 'workshops' | 'admin' | 'details'>('catalog');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // State management for courses and workshops
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [workshops, setWorkshops] = useState<WorkshopSession[]>(WORKSHOP_SCHEDULE);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string | null>('Cultura');
  const [globalSearch, setGlobalSearch] = useState('');
  const [instructorSearch, setInstructorSearch] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sortBy, setSortBy] = useState('Más Populares');

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const categoryMatch = !selectedCategory || course.category === selectedCategory;
      const globalMatch = !globalSearch || 
        course.title.toLowerCase().includes(globalSearch.toLowerCase()) || 
        course.description.toLowerCase().includes(globalSearch.toLowerCase());
      const instructorMatch = !instructorSearch || 
        course.instructor.toLowerCase().includes(instructorSearch.toLowerCase());

      return categoryMatch && globalMatch && instructorMatch;
    });
  }, [courses, selectedCategory, globalSearch, instructorSearch]);

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setActiveView('details');
  };

  const handleNavigate = (view: 'catalog' | 'workshops' | 'admin' | 'details') => {
    setActiveView(view);
    if (view !== 'details') setSelectedCourse(null);
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setGlobalSearch('');
    setInstructorSearch('');
  };

  return (
    <div className="min-h-screen flex flex-col text-[#171213]">
      <Header 
        activeView={activeView} 
        onNavigate={handleNavigate} 
        searchQuery={globalSearch}
        onSearchChange={setGlobalSearch}
      />
      
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 md:px-10 lg:px-40 py-8">
        {activeView === 'catalog' && (
          <>
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 mb-6 text-sm">
              <a onClick={() => handleNavigate('catalog')} className="text-[#85666e] hover:text-primary cursor-pointer">Inicio</a>
              <span className="material-symbols-outlined text-xs text-[#85666e]">chevron_right</span>
              <span className="text-primary font-bold">Catálogo de Cursos</span>
            </nav>

            {/* Page Heading */}
            <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6 animate-in slide-in-from-bottom-2 duration-500">
              <div className="max-w-2xl">
                <h1 className="text-[#171213] text-4xl md:text-5xl font-black font-serif leading-tight mb-4">Programas Educativos</h1>
                <p className="text-[#85666e] text-lg font-normal leading-relaxed">
                  Refina tu oficio y expande tus horizontes a través de nuestras series seleccionadas. Impartido por maestros de la industria y artesanos locales.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${showAdvanced ? 'bg-primary text-white shadow-lg' : 'bg-card-cream border border-accent-gold/20 text-primary'}`}
                >
                  <span className="material-symbols-outlined text-lg">tune</span>
                  Búsqueda Avanzada
                </button>
                <div className="flex items-center gap-3 bg-card-cream p-2 rounded-lg border border-accent-gold/20">
                  <p className="text-sm font-medium px-2">Ordenar por:</p>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent border-none text-sm font-bold text-primary focus:ring-0 cursor-pointer"
                  >
                    <option>Más Populares</option>
                    <option>Novedades</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
              <aside className="w-full lg:w-72 flex-shrink-0 space-y-8 animate-in slide-in-from-left-4 duration-500">
                {/* Categories */}
                <div>
                  <h3 className="font-serif text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent-gold text-lg">category</span>
                    Categorías
                  </h3>
                  <div className="space-y-1">
                    {CATEGORIES.map(cat => {
                      const isActive = selectedCategory === cat.name;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.name)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group ${
                            isActive 
                            ? 'bg-primary text-white shadow-md' 
                            : 'hover:bg-card-cream text-[#171213]'
                          }`}
                        >
                          <span className="flex items-center gap-3 font-medium">
                            <span className={`material-symbols-outlined text-lg ${isActive ? 'text-white' : 'text-accent-gold group-hover:text-primary'}`}>
                              {cat.icon}
                            </span> 
                            {cat.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Advanced Filters Panel inside Sidebar */}
                {showAdvanced && (
                  <div className="pt-6 border-t border-[#e4dcde] space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <h3 className="font-serif text-xl font-bold text-primary flex items-center gap-2">
                      <span className="material-symbols-outlined text-accent-gold text-lg">manage_search</span>
                      Filtros Avanzados
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Instructor Search */}
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-[#85666e]">Instructor</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-accent-gold text-sm">person</span>
                          <input 
                            type="text" 
                            className="w-full bg-[#f4f1f1] border-none rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-accent-gold"
                            placeholder="Nombre del maestro..."
                            value={instructorSearch}
                            onChange={(e) => setInstructorSearch(e.target.value)}
                          />
                        </div>
                      </div>

                      <button 
                        onClick={resetFilters}
                        className="w-full py-2 text-xs font-bold text-[#85666e] border border-[#e4dcde] rounded-lg hover:bg-[#f4f1f1] transition-colors"
                      >
                        Limpiar todos los filtros
                      </button>
                    </div>
                  </div>
                )}
              </aside>

              <div className="flex-1 animate-in fade-in duration-700">
                <div className="mb-4 flex items-center justify-between text-sm text-[#85666e]">
                  <p>Mostrando <span className="font-bold text-primary">{filteredCourses.length}</span> resultados</p>
                  {(globalSearch || instructorSearch) && (
                    <button onClick={resetFilters} className="text-xs font-bold text-accent-gold hover:underline flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">close</span> Quitar filtros
                    </button>
                  )}
                </div>

                {filteredCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredCourses.map(course => (
                      <CourseCard key={course.id} course={course} onSelect={handleCourseSelect} />
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center bg-card-cream/50 rounded-2xl border border-dashed border-accent-gold/20">
                    <span className="material-symbols-outlined text-6xl text-accent-gold mb-4 opacity-50">search_off</span>
                    <p className="text-lg text-[#85666e]">No se encontraron cursos que coincidan con tu búsqueda.</p>
                    <button 
                      onClick={resetFilters}
                      className="mt-4 text-primary font-bold hover:underline"
                    >
                      Restablecer búsqueda
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeView === 'workshops' && <Workshops />}
        
        {activeView === 'details' && selectedCourse && (
          <CourseDetail course={selectedCourse} onBack={() => handleNavigate('catalog')} />
        )}

        {activeView === 'admin' && (
          <AdminPanel 
            courses={courses} 
            workshops={workshops} 
            onUpdateCourses={setCourses} 
            onUpdateWorkshops={setWorkshops} 
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
