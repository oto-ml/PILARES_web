import React, { useState, useMemo } from 'react';
import { WorkshopSession } from '../types';

// Definimos que este componente espera recibir una lista de sesiones
interface WorkshopsProps {
  sessions: WorkshopSession[];
}

const Workshops: React.FC<WorkshopsProps> = ({ sessions }) => {
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'weekly' | 'list'>('weekly');

  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8:00 a 20:00
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  // Usamos la prop "sessions"
  const filteredWorkshops = useMemo(() => {
    const currentSessions = sessions || [];
    if (!filterCategory) return currentSessions;
    return currentSessions.filter(w => w.category === filterCategory);
  }, [filterCategory, sessions]);

  const sortedWorkshopsForList = useMemo(() => {
    return [...filteredWorkshops].sort((a, b) => a.day - b.day || a.hour - b.hour);
  }, [filteredWorkshops]);

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

      {/* Filtros */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#e4dcde] pb-6">
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setFilterCategory(null)} className={`px-5 py-2 rounded-full text-sm font-bold border ${!filterCategory ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}>Todas</button>
          <button onClick={() => setFilterCategory('Cultura')} className={`px-5 py-2 rounded-full text-sm font-bold border ${filterCategory === 'Cultura' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}>Cultura</button>
          <button onClick={() => setFilterCategory('Ciberescuela')} className={`px-5 py-2 rounded-full text-sm font-bold border ${filterCategory === 'Ciberescuela' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}>Ciberescuela</button>
          <button onClick={() => setFilterCategory('Ponte Pila')} className={`px-5 py-2 rounded-full text-sm font-bold border ${filterCategory === 'Ponte Pila' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}>Ponte Pila</button>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button onClick={() => setViewMode('weekly')} className={`px-4 py-2 rounded-lg text-sm font-bold ${viewMode === 'weekly' ? 'bg-white shadow' : 'text-gray-500'}`}>Semanal</button>
          <button onClick={() => setViewMode('list')} className={`px-4 py-2 rounded-lg text-sm font-bold ${viewMode === 'list' ? 'bg-white shadow' : 'text-gray-500'}`}>Lista</button>
        </div>
      </div>

      {viewMode === 'weekly' ? (
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
                  <div className="py-8 text-center text-xs font-bold text-gray-400 border-r flex items-center justify-center">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                  
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const dayWorkshops = filteredWorkshops.filter(w => w.day === dayIndex && w.hour === hour);
                    return (
                      <div key={dayIndex} className="p-1 border-l flex flex-col gap-1">
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
        /* Vista Lista */
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
                  <td className="px-6 py-4 text-sm">{workshop.timeString}</td>
                  <td className="px-6 py-4 font-serif font-bold">{workshop.title}</td>
                  <td className="px-6 py-4"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">{workshop.category}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// COMPONENTE ITEM CORREGIDO (Sin line-clamp)
interface WorkshopItemProps {
  category: string;
  title: string;
  time: string;
  type?: 'primary' | 'muted' | 'gold';
  seats?: string;
}

const WorkshopItem: React.FC<WorkshopItemProps> = ({ category, title, time, type = 'primary', seats }) => {
  const typeStyles = {
    primary: "border-primary bg-[#fdfbf7]",
    muted: "border-gray-400 bg-gray-100",
    gold: "border-yellow-500 bg-yellow-50"
  };

  return (
    <div className={`w-full rounded-lg border-l-4 p-2 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full ${typeStyles[type]}`}>
      <div className="flex justify-between items-start mb-1">
        <p className="text-[9px] font-black uppercase tracking-wider text-primary">{category}</p>
        <div className="text-[7px] font-bold text-yellow-600 bg-yellow-100 px-1 rounded">GRATIS</div>
      </div>
      
      {/* CORRECCIÓN: break-words y sin line-clamp */}
      <h4 className="font-serif text-[11px] font-bold text-gray-900 leading-snug break-words">
        {title}
      </h4>
      
      <div className="flex items-center gap-1 mt-2">
        <span className="material-symbols-outlined text-[10px] text-gray-500">schedule</span>
        <p className="text-[9px] text-gray-500 font-medium">{time}</p>
      </div>
    </div>
  );
}

export default Workshops;