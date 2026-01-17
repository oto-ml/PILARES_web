
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t-4 border-accent-gold bg-primary py-12 px-4 md:px-10 lg:px-40">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-white/90">
        <div>
          <h4 className="font-serif text-2xl font-bold mb-6">PILARES Mártires del 10 de junio</h4>
          <p className="text-sm leading-relaxed text-white/70 italic">Preservando el pasado, enseñando el futuro. Desde 1924.</p>
        </div>
        <div>
          <h5 className="font-bold text-accent-gold uppercase tracking-widest text-xs mb-6">Contáctanos</h5>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">location_on</span> 
              1204 Academy Row, Old Town
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">mail</span> 
              info@pilaresmartires.edu.mx
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">phone</span> 
              (555) 012-3456
            </li>
          </ul>
        </div>
        <div className="flex flex-col md:items-end justify-center">
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/20 w-full md:w-auto">
            <p className="text-xs uppercase tracking-widest font-bold text-accent-gold mb-2">Boletín</p>
            <div className="flex">
              <input 
                className="bg-white/10 border-none rounded-l text-sm focus:ring-accent-gold placeholder-white/40 w-full" 
                placeholder="Correo Electrónico" 
                type="text"
              />
              <button className="bg-accent-gold px-4 py-2 rounded-r font-bold text-primary hover:bg-white transition-colors">Unirse</button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-white/10 text-center text-xs text-white/40">
        © 2024 PILARES Mártires del 10 de junio. Todos los derechos reservados. Excelencia Educativa Profesional.
      </div>
    </footer>
  );
};

export default Footer;
