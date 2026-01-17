
import React from 'react';
import { Course } from '../types';

interface CourseDetailProps {
  course: Course;
  onBack: () => void;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course, onBack }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-[#85666e] hover:text-primary font-bold text-sm mb-8 transition-colors group"
      >
        <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
        Volver al Catálogo
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-accent-gold/20">
          <img 
            src={course.image} 
            alt={course.title} 
            className="w-full h-[400px] lg:h-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              {course.category}
            </span>
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl font-black text-[#171213] mb-4 leading-tight">
            {course.title}
          </h1>
          
          <p className="text-xl italic text-primary font-medium mb-8">
            Impartido por {course.instructor}
          </p>

          <div className="prose prose-stone mb-10">
            <p className="text-[#85666e] text-lg leading-relaxed">
              {course.description}
            </p>
            <div className="mt-6 p-4 bg-card-cream rounded-xl border border-accent-gold/10">
              <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined">info</span>
                ¿Qué aprenderás?
              </h4>
              <p className="text-sm text-[#85666e]">
                Este taller está diseñado para profundizar en las técnicas esenciales de {course.category.toLowerCase()}. 
                No se requieren materiales previos, todo es proporcionado por el centro PILARES de forma gratuita y abierta a la comunidad.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 bg-white border border-[#e4dcde] rounded-xl flex items-center gap-4">
              <span className="material-symbols-outlined text-primary text-3xl">calendar_month</span>
              <div>
                <p className="text-[10px] uppercase font-bold text-[#85666e]">Horario Sugerido</p>
                <p className="font-bold text-[#171213]">{course.schedule}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-primary/5 border-l-4 border-primary rounded-r-xl">
            <p className="text-sm text-primary font-bold">
              Información de inscripción:
            </p>
            <p className="text-sm text-[#85666e]">
              Acude directamente a nuestras instalaciones de 10:00 AM a 8:00 PM con tu número de folio PILARES para confirmar tu lugar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
