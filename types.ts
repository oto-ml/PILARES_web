
export interface Course {
  id: string;
  title: string;
  instructor: string;
  category: string;
  price: number;
  description: string;
  image: string;
  schedule: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface WorkshopSession {
  id: string;
  day: number; // 0 (Lun) a 6 (Dom)
  hour: number; // 8 a 20
  title: string;
  category: 'Cultura' | 'Ciberescuela' | 'Ponte Pila' | 'Destacado';
  timeString: string;
  type?: 'primary' | 'muted' | 'gold';
  seats?: string;
}
