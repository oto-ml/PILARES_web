
import { Course, Category, WorkshopSession } from './types';

export const CATEGORIES: Category[] = [
  { id: 'ciber', name: 'Ciberescuela', icon: 'terminal', count: 12 },
  { id: 'cultura', name: 'Cultura', icon: 'palette', count: 15 },
  { id: 'pontepila', name: 'Ponte Pila', icon: 'fitness_center', count: 10 },
];

export const WORKSHOP_SCHEDULE: WorkshopSession[] = [
  { id: 'w1', day: 0, hour: 8, title: 'Yoga Despertar', category: 'Ponte Pila', timeString: '08:00 - 09:30', type: 'primary' },
  { id: 'w2', day: 0, hour: 8, title: 'Inglés Técnico', category: 'Ciberescuela', timeString: '08:30 - 10:00', type: 'muted' },
  { id: 'w3', day: 0, hour: 16, title: 'Francés Nivel I', category: 'Cultura', timeString: '16:00 - 18:00', type: 'muted' },
  { id: 'w4', day: 0, hour: 16, title: 'Robótica', category: 'Ciberescuela', timeString: '16:00 - 17:30', type: 'primary' },
  { id: 'w5', day: 1, hour: 10, title: 'Cartonería', category: 'Cultura', timeString: '10:00 - 12:00', type: 'primary' },
  { id: 'w6', day: 1, hour: 10, title: 'Guitarra', category: 'Cultura', timeString: '10:00 - 11:30', type: 'gold' },
  { id: 'w7', day: 1, hour: 18, title: 'Defensa Personal', category: 'Ponte Pila', timeString: '18:00 - 19:30', type: 'primary' },
  { id: 'w8', day: 2, hour: 8, title: 'Apoyo Escolar', category: 'Ciberescuela', timeString: '08:00 - 10:00', type: 'muted' },
  { id: 'w9', day: 2, hour: 16, title: 'Alfarería', category: 'Cultura', timeString: '16:00 - 18:30', type: 'primary', seats: '3 LUGARES' },
  { id: 'w10', day: 3, hour: 12, title: 'Acuarelas', category: 'Cultura', timeString: '12:00 - 14:00', type: 'primary' },
  { id: 'w11', day: 3, hour: 14, title: 'Huertos Urbanos', category: 'Cultura', timeString: '14:00 - 16:00', type: 'gold' },
  { id: 'w12', day: 4, hour: 8, title: 'Zumba', category: 'Ponte Pila', timeString: '08:00 - 09:00', type: 'primary' },
  { id: 'w13', day: 4, hour: 12, title: 'Cocina Saludable', category: 'Destacado', timeString: '12:00 - 14:00', type: 'gold' },
  { id: 'w14', day: 4, hour: 16, title: 'Gala de Baile', category: 'Destacado', timeString: '16:30 - 19:00', type: 'gold' },
];

export const COURSES: Course[] = [
  {
    id: '1',
    title: 'Maestría en Retratos al Óleo',
    instructor: 'Dra. Elena Vance',
    category: 'Cultura',
    price: 0,
    description: 'Explora las técnicas atemporales de los maestros flamencos. Este curso cubre teoría del color, anatomía y veladuras. Todo el material incluido de forma gratuita.',
    image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800',
    schedule: 'Weekday Evenings'
  },
  {
    id: '2',
    title: 'Programación Web con Ruby',
    instructor: 'Julian Thorne',
    category: 'Ciberescuela',
    price: 0,
    description: 'Una introducción profesional a la arquitectura backend enfocada en código elegante, legible y lógica robusta. Acceso gratuito a laboratorios.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
    schedule: 'Weekend Mornings'
  },
  {
    id: '3',
    title: 'Yoga Hatha Avanzado',
    instructor: 'Sarah Chen',
    category: 'Ponte Pila',
    price: 0,
    description: 'Eleva tu práctica a través de la alineación consciente y el trabajo de respiración. Enfoque en flexibilidad y fuerza. Sin costo de inscripción.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    schedule: 'Intensive Workshops'
  },
  {
    id: '4',
    title: 'Ciencia del Suelo Orgánico',
    instructor: 'Marcus Bloom',
    category: 'Cultura',
    price: 0,
    description: 'Aprende los secretos de un huerto próspero entendiendo la compleja biología bajo tus pies. Incluye kit de prueba gratuito.',
    image: 'https://images.unsplash.com/photo-1416870230247-d0201fb95189?auto=format&fit=crop&q=80&w=800',
    schedule: 'Weekend Mornings'
  },
  {
    id: '5',
    title: 'Filosofía Griega Antigua',
    instructor: 'Dr. Arthur Sterling',
    category: 'Cultura',
    price: 0,
    description: 'Sumérgete en los cimientos del pensamiento occidental, desde Sócrates hasta Aristóteles. Ética y lógica. Cupo gratuito limitado.',
    image: 'https://images.unsplash.com/photo-1543269664-7eef42226a21?auto=format&fit=crop&q=80&w=800',
    schedule: 'Weekday Evenings'
  },
  {
    id: '6',
    title: 'Taller de Escritura Creativa',
    instructor: 'Maya Angelou Jr.',
    category: 'Cultura',
    price: 0,
    description: 'Desbloquea tu voz narrativa a través de ejercicios guiados, revisión por pares y crítica profesional. Programa gratuito PILARES.',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800',
    schedule: 'Intensive Workshops'
  }
];
