// components/CourseDetail.tsx
import React from 'react';
import { Course } from '../types';

interface CourseDetailProps {
  course: Course;
  onClose: () => void;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Imagen de Cabecera */}
        <div className="relative h-64 shrink-0">
          <img 
            src={course.image} 
            alt={course.title} 
            className="w-full h-full object-cover"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition-colors backdrop-blur-md"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <div className="absolute bottom-4 left-4">
            <span className="bg-accent-gold text-white px-3 py-1 rounded-lg font-bold text-sm shadow-sm">
              {course.category}
            </span>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-8 overflow-y-auto">
          <h2 className="text-3xl font-serif font-bold text-primary mb-2">{course.title}</h2>
          <p className="text-gray-500 font-medium mb-6 text-lg">Impartido por: <span className="text-gray-800">{course.instructor}</span></p>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <span className="material-symbols-outlined text-2xl">calendar_month</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Horario</h4>
                <p className="text-gray-700 font-medium text-lg">
                  {course.schedule || "Horario por definir en sede"}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 text-lg mb-2">Acerca del curso</h4>
              <p className="text-gray-600 leading-relaxed text-lg">
                {course.description}
              </p>
            </div>

            <div className="bg-accent-gold/10 p-4 rounded-xl border border-accent-gold/20">
              <p className="text-accent-gold font-bold flex items-center gap-2">
                <span className="material-symbols-outlined">verified</span>
                Este curso es 100% Gratuito
              </p>
            </div>
          </div>
        </div>

        {/* Footer del Modal */}
        <div className="p-6 border-t bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-primary hover:bg-[#801b34] text-white px-6 py-3 rounded-xl font-bold transition-transform active:scale-95 shadow-lg shadow-primary/20"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;