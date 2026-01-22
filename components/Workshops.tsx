import React, { useState, useMemo } from 'react';
import { WorkshopSession } from '../types';

interface WorkshopsProps {
  sessions: WorkshopSession[];
}

const Workshops: React.FC<WorkshopsProps> = ({ sessions }) => {
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'weekly' | 'list'>('weekly');

  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8:00 a 20:00
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  // Filtrado seguro
  const filteredWorkshops = useMemo(() => {
    const currentSessions = sessions || [];
    if (!filterCategory) return currentSessions;
    return currentSessions.filter(w => w.category === filterCategory);
  }, [filterCategory, sessions]);

  // Ordenamiento para lista
  const sortedWorkshopsForList = useMemo(() => {
    return [...filteredWorkshops].sort((a, b) => a.day - b.day || a.hour - b.hour);
  }, [filteredWorkshops]);

  // Función auxiliar para colores en la vista de lista (Table)
  const getBadgeStyle = (cat: string) => {
    if (cat === 'Cultura') return 'bg-purple-100 text-purple-700';
    if (cat === 'Ciberescuela') return 'bg-blue-100 text-blue-700';
    if (cat === 'Ponte Pila') return 'bg-orange-100 text-orange-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Encabezado */}
      <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="inline-block bg-accent-gold/20 text-accent-gold text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">
              Todas las actividades son 100% Gratuitas
            </div>
          </div>
          <h1 className="font-serif text-5xl font-black text-primary">Horario Semanal</h1>
          <p className="max-w-xl text-lg text-[#85666e]">
            Abierto de 10:00 AM a 8:00 PM. Gestiona tu aprendizaje de forma gratuita.
          </p>
        </div>
      </div>

      {/* Filtros Visuales */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#e4dcde] pb-6">
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setFilterCategory(null)} className={`px-5 py-2 rounded-full text-sm font-bold border transition-colors ${!filterCategory ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Todas</button>
          <button onClick={() => setFilterCategory('Cultura')} className={`px-5 py-2 rounded-full text-sm font-bold border transition-colors ${filterCategory === 'Cultura' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-purple-700 border-purple-200 hover:bg-purple-50'}`}>Cultura</button>
          <button onClick={() => setFilterCategory('Ciberescuela')} className={`px-5 py-2 rounded-full text-sm font-bold border transition-colors ${filterCategory === 'Ciberescuela' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'}`}>Ciberescuela</button>
          <button onClick={() => setFilterCategory('Ponte Pila')} className={`px-5 py-2 rounded-full text-sm font-bold border transition-colors ${filterCategory === 'Ponte Pila' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-orange-600 border-orange-200 hover:bg-orange-50'}`}>Ponte Pila</button>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button onClick={() => setViewMode('weekly')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'weekly' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}>Semanal</button>
          <button onClick={() => setViewMode('list')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}>Lista</button>
        </div>
      </div>

      {viewMode === 'weekly' ? (
        /* VISTA CALENDARIO */
        <div className="overflow-x-auto rounded-2xl border bg-white shadow-xl">
          <div className="min-w-[1000px]">
            {/* Header Días */}
            <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b bg-gray-50 sticky top-0 z-10">
              <div className="py-4"></div>
              {days.map((day) => (
                <div key={day} className="py-4 text-center border-l font-bold text-primary">{day}</div>
              ))}
            </div>

            {/* Grid Horas */}
            <div>
              {hours.map((hour) => (
                <div key={hour} className="grid grid-cols-[80px_repeat(7,1fr)] border-b min-h-[100px]">
                  <div className="py-8 text-center text-xs font-bold text-gray-400 border-r flex items-center justify-center bg-gray-50/50">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                  
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const dayWorkshops = filteredWorkshops.filter(w => w.day === dayIndex && w.hour === hour);
                    return (
                      <div key={dayIndex} className="p-1 border-l flex flex-col gap-1 hover:bg-gray-50/30 transition-colors">
                        {dayWorkshops.map(workshop => (
                          <WorkshopItem 
                            key={workshop.id}
                            {...workshop}
                            time={workshop.timeString}
                          />
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* VISTA LISTA */
        <div className="bg-white rounded-2xl border shadow-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-500">Día</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-500">Horario</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-500">Actividad</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-500">Categoría</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sortedWorkshopsForList.map((workshop) => (
                <tr key={workshop.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-primary">{dayNames[workshop.day]}</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">{workshop.timeString}</td>
                  <td className="px-6 py-4 font-serif font-bold text-gray-800">{workshop.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getBadgeStyle(workshop.category)}`}>
                        {workshop.category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// --- COMPONENTE INDIVIDUAL (CARD) ---
interface WorkshopItemProps {
  category: string;
  title: string;
  time: string;
  seats?: string;
}

const WorkshopItem: React.FC<WorkshopItemProps> = ({ category, title, time, seats }) => {
  
  // ✅ AQUÍ ESTÁ EL DEBUG: Mapeamos la categoría a estilos visuales específicos
  const getCategoryStyles = (cat: string) => {
    switch (cat) {
      case 'Cultura':
        return {
          container: "border-purple-300 bg-purple-50 hover:bg-purple-100",
          text: "text-purple-900",
          badge: "text-purple-700 bg-purple-200/50"
        };
      case 'Ciberescuela':
        return {
          container: "border-blue-300 bg-blue-50 hover:bg-blue-100",
          text: "text-blue-900",
          badge: "text-blue-700 bg-blue-200/50"
        };
      case 'Ponte Pila':
        return {
          container: "border-orange-300 bg-orange-50 hover:bg-orange-100",
          text: "text-orange-900",
          badge: "text-orange-700 bg-orange-200/50"
        };
      default:
        // Estilo por defecto (Cursos destacados o no clasificados)
        return {
          container: "border-gray-200 bg-white hover:shadow-md",
          text: "text-gray-800",
          badge: "text-gray-600 bg-gray-100"
        };
    }
  };

  const styles = getCategoryStyles(category);

  return (
    <div className={`w-full rounded-lg border-l-4 p-2 shadow-sm transition-all cursor-pointer flex flex-col h-full ${styles.container}`}>
      <div className="flex justify-between items-start mb-1">
        <p className={`text-[9px] font-black uppercase tracking-wider opacity-70 ${styles.text}`}>{category}</p>
        <div className="text-[7px] font-bold text-yellow-600 bg-yellow-100 px-1 rounded border border-yellow-200">GRATIS</div>
      </div>
      
      {/* Título que crece sin cortarse */}
      <h4 className={`font-serif text-[11px] font-bold leading-snug break-words ${styles.text}`}>
        {title}
      </h4>
      
      <div className="flex items-center gap-1 mt-2">
        <span className={`material-symbols-outlined text-[10px] opacity-60 ${styles.text}`}>schedule</span>
        <p className={`text-[9px] font-medium opacity-80 ${styles.text}`}>{time}</p>
      </div>
    </div>
  );
}

export default Workshops;