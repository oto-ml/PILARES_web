import React from 'react';

interface FooterProps {
  onNavigate: (view: 'catalog' | 'workshops' | 'admin' | 'details') => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleAdminAccess = (e: React.MouseEvent) => {
    // Triple click to enter admin (hidden feature)
    if (e.detail === 3) {
      onNavigate('admin');
    }
  };

  return (
    <footer className="mt-20 border-t-4 border-accent-gold bg-primary py-12 px-4 md:px-10 lg:px-40">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-white/90">
        <div onClick={handleAdminAccess} className="cursor-default select-none" title="© Pilares">
          <h4 className="font-serif text-2xl font-bold mb-6">PILARES Mártires del 10 de junio</h4>
        </div>
        <div>
          <h5 className="font-bold text-accent-gold uppercase tracking-widest text-xs mb-6">Ubicación</h5>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-lg mt-1">location_on</span> 
              <span>EJE 4 SUR AVENIDA PLUTARCO ELIAS CALLES Y EJE 3 ORIENTE AZUCAR (BAJO PUENTE)S/N 1 , GRANJAS MEXICO Iztacalco</span>
            </li>
          </ul>
        </div>
        <div className="flex flex-col md:items-end justify-center">
          <div className="w-full md:w-auto rounded-lg overflow-hidden shadow-lg border-2 border-accent-gold/30">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3763.3295743664403!2d-99.11640532573968!3d19.398161041781666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ffc3a38daea9%3A0xf24029e3d2df2eb0!2sPILARES%20Coyuya!5e0!3m2!1ses-419!2smx!4v1768642484948!5m2!1ses-419!2smx" 
              width="100%" 
              height="200" 
              className="border-0"
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de PILARES"
            ></iframe>
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
