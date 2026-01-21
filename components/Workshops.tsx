import React, { useState, useMemo } from 'react';
// Eliminamos la importación de WORKSHOP_SCHEDULE de constants porque ya no la usamos
import { WorkshopSession } from '../types';

// Definimos que este componente espera recibir una lista de sesiones (props)
interface WorkshopsProps {
  sessions: WorkshopSession[];
}

const Workshops: React.FC<WorkshopsProps> = ({ sessions }) => {
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'weekly' | 'list'>('weekly');

  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8:00 a 20:00
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  // USAMOS "sessions" (la prop que viene de la BD) EN LUGAR DE LA CONSTANTE ESTÁTICA
  const filteredWorkshops = useMemo(() => {
    // Si sessions viene vacío o undefined, evitamos errores devolviendo array vacío
    const currentSessions = sessions || [];
    
    if (!filterCategory) return currentSessions;
    return currentSessions.filter(w => w.category === filterCategory);
  }, [filterCategory, sessions]);

  const sortedWorkshopsForList = useMemo(() => {
    return [...filteredWorkshops].sort((a, b) => a.day - b.day || a.hour - b.hour);
  }, [filteredWorkshops]);

  return (
    <div className="animate-in fade-in duration-500">
      {/* Page Heading */}
      <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="inline-block bg-accent-gold/20 text-accent-gold text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">
              Todas las actividades son 100% Gratuitas
            </div>
          </div>
          <h1 className="font-serif text-5xl font-black text-primary">Horario Semanal</h1>
          <p className="max-w-xl text-lg text-[#85666e]">
            Abierto de 10:00 AM a 8:00 PM. Gestiona tu aprendizaje de forma gratuita en nuestras instalaciones.
          </p>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#e4dcde] pb-6">
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setFilterCategory(null)}
            className={`flex h-10 items-center gap-2 rounded-full border px-5 text-sm font-bold transition-all ${!filterCategory ? 'bg-primary border-primary text-white shadow-md' : 'border-primary/20 bg-primary/5 text-primary hover:bg-primary/10'}`}
          >
            Todas las Categorías
          </button>
          <button 
            onClick={() => setFilterCategory('Cultura')}
            className={`flex h-10 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-all ${filterCategory === 'Cultura' ? 'bg-primary border-primary text-white shadow-md' : 'border-[#e4dcde] bg-white text-[#85666e] hover:bg-card-cream'}`}
          >
            Cultura <span className={`material-symbols-outlined text-lg ${filterCategory === 'Cultura' ? 'text-white' : 'text-accent-gold'}`}>palette</span>
          </button>
          <button 
            onClick={() => setFilterCategory('Ciberescuela')}
            className={`flex h-10 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-all ${filterCategory === 'Ciberescuela' ? 'bg-primary border-primary text-white shadow-md' : 'border-[#e4dcde] bg-white text-[#85666e] hover:bg-card-cream'}`}
          >
            Ciberescuela <span className={`material-symbols-outlined text-lg ${filterCategory === 'Ciberescuela' ? 'text-white' : 'text-accent-gold'}`}>terminal</span>
          </button>
          <button 
            onClick={() => setFilterCategory('Ponte Pila')}
            className={`flex h-10 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-all ${filterCategory === 'Ponte Pila' ? 'bg-primary border-primary text-white shadow-md' : 'border-[#e4dcde] bg-white text-[#85666e] hover:bg-card-cream'}`}
          >
            Ponte Pila <span className={`material-symbols-outlined text-lg ${filterCategory === 'Ponte Pila' ? 'text-white' : 'text-accent-gold'}`}>fitness_center</span>
          </button>
        </div>
        <div className="inline-flex h-12 w-64 items-center rounded-xl bg-[#f4f1f1] p-1">
          <button 
            onClick={() => setViewMode('weekly')}
            className={`flex h-full flex-1 items-center justify-center rounded-lg text-sm font-bold transition-all ${viewMode === 'weekly' ? 'bg-white text-primary shadow-sm' : 'text-[#85666e]'}`}
          >
            <span className="material-symbols-outlined text-xl mr-2">calendar_view_week</span> Semanal
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`flex h-full flex-1 items-center justify-center rounded-lg text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-[#85666e]'}`}
          >
            <span className="material-symbols-outlined text-xl mr-2">view_list</span> Lista
          </button>
        </div>
      </div>

      {viewMode === 'weekly' ? (
        /* Calendar Grid View */
        <div className="overflow-x-auto rounded-2xl border border-[#e4dcde] bg-white shadow-xl animate-in fade-in zoom-in-95 duration-300">
          <div className="min-w-[1000px]">
            {/* Header Days */}
            <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-[#e4dcde] bg-[#fdfcf8]/50 sticky top-0 z-10">
              <div className="py-4"></div>
              {days.map((day, i) => (
                <div key={day} className="py-4 text-center border-l border-[#f4f1f1] first:border-l-0">
                  <span className={`font-serif font-bold ${i === 0 ? 'text-primary' : 'text-[#171213]'}`}>{day}</span>
                </div>
              ))}
            </div>

            {/* Time Slots Content */}
            <div className="relative">
              {hours.map((hour) => (
                <div key={hour} className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-[#f4f1f1] last:border-b-0 min-h-[100px]">
                  <div className="py-8 text-center text-xs font-bold text-[#85666e]/50 border-r border-[#f4f1f1] flex items-center justify-center">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                  
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const dayWorkshops = filteredWorkshops.filter(w => w.day === dayIndex && w.hour === hour);
                    return (
                      <div key={dayIndex} className="p-1 border-l border-[#f4f1f1] flex flex-col gap-1 overflow-hidden group/cell relative min-h-[100px]">
                        {dayWorkshops.map(workshop => (
                          <WorkshopItem 
                            key={workshop.id}
                            category={workshop.category}
                            title={workshop.title}
                            time={workshop.timeString}
                            type={workshop.type}
                            seats={workshop.seats}
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
        /* List View */
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {sortedWorkshopsForList.length > 0 ? (
            <div className="bg-white rounded-2xl border border-[#e4dcde] shadow-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-[#fdfcf8] border-b border-[#e4dcde]">
                  <tr className="text-[10px] font-black uppercase tracking-widest text-[#85666e]">
                    <th className="px-6 py-4">Día</th>
                    <th className="px-6 py-4">Horario</th>
                    <th className="px-6 py-4">Taller</th>
                    <th className="px-6 py-4">Categoría</th>
                    <th className="px-6 py-4 text-right">Cupo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f4f1f1]">
                  {sortedWorkshopsForList.map((workshop) => (
                    <tr key={workshop.id} className="hover:bg-card-cream transition-colors group">
                      <td className="px-6 py-4 font-bold text-primary">{dayNames[workshop.day]}</td>
                      <td className="px-6 py-4 text-sm text-[#85666e]">{workshop.timeString}</td>
                      <td className="px-6 py-4">
                        <span className="font-serif font-bold text-[#171213]">{workshop.title}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block bg-primary/5 text-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                          {workshop.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {workshop.seats ? (
                          <span className="text-[10px] font-black text-accent-gold bg-accent-gold/10 px-2 py-1 rounded">{workshop.seats}</span>
                        ) : (
                          <span className="text-[10px] font-medium text-[#85666e]">Abierto</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-[#e4dcde]">
              <span className="material-symbols-outlined text-6xl text-accent-gold/30 mb-4">calendar_today</span>
              <p className="text-lg text-[#85666e]">No hay talleres programados para esta categoría.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface WorkshopItemProps {
  category: string;
  title: string;
  time: string;
  type?: 'primary' | 'muted' | 'gold';
  seats?: string;
}

const WorkshopItem: React.FC<WorkshopItemProps> = ({ category, title, time, type = 'primary', seats }) => {
  const baseClasses = "w-full rounded-lg border-l-4 p-2 shadow-sm hover:translate-y-[-1px] hover:shadow-md transition-all cursor-pointer flex flex-col z-1";
  
  const typeStyles = {
    primary: "border-primary bg-card-cream",
    muted: "border-[#85666e]/40 bg-[#f4f1f1]",
    gold: "border-accent-gold bg-accent-gold/5"
  };

  const textColors = {
    primary: "text-primary",
    muted: "text-[#85666e]",
    gold: "text-accent-gold"
  };

  return (
    <div className={`${baseClasses} ${typeStyles[type]}`}>
      <div className="flex justify-between items-start">
        <p className={`text-[8px] font-black uppercase tracking-wider ${textColors[type]}`}>{category}</p>
        <div className="text-[7px] font-bold text-accent-gold bg-accent-gold/10 px-1 rounded">GRATIS</div>
      </div>
      <h4 className="font-serif text-[11px] font-bold text-[#171213] leading-tight mt-0.5 line-clamp-1">{title}</h4>
      <div className="flex items-center gap-1 mt-1">
        <span className="material-symbols-outlined text-[10px] text-[#85666e]">schedule</span>
        <p className="text-[9px] text-[#85666e] font-medium">{time}</p>
      </div>
      {seats && (
        <div className="mt-1 inline-block rounded-full bg-primary/10 px-1.5 py-0.5 text-[7px] font-black text-primary uppercase self-start">{seats}</div>
      )}
    </div>
  );
}

export default Workshops;