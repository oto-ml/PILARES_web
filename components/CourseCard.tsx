
import React from 'react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onSelect: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect }) => {
  return (
    <div className="bg-card-cream rounded-xl overflow-hidden border border-accent-gold/10 hover:shadow-xl transition-all duration-300 flex flex-col group h-full">
      <div className="relative h-56 overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 mix-blend-multiply transition-opacity group-hover:opacity-0"></div>
        <img 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          src={course.image} 
          alt={course.title} 
        />
        <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded text-[10px] font-bold text-primary uppercase tracking-widest border border-accent-gold/30 shadow-sm">
          {course.category}
        </div>
        <div className="absolute bottom-4 right-4 bg-accent-gold text-white px-3 py-1 rounded font-bold shadow-lg text-xs">
          GRATUITO
        </div>
      </div>
      <div className="p-6 flex flex-1 flex-col">
        <h3 className="font-serif text-2xl font-bold text-[#171213] mb-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="text-sm font-semibold text-primary mb-4 italic">con {course.instructor}</p>
        <p className="text-[#85666e] text-sm leading-relaxed mb-6 line-clamp-3">
          {course.description}
        </p>
        <div className="mt-auto flex items-center justify-end">
          <button 
            onClick={() => onSelect(course)}
            className="bg-primary hover:bg-[#801b34] text-white px-5 py-2.5 rounded-lg font-bold text-sm tracking-wide transition-all transform active:scale-95 flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            Saber Más <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
