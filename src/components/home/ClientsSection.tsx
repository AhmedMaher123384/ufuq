import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTranslation } from 'react-i18next';
import { mockClients } from '../../mock/clients';

const ClientsSection: React.FC = () => {
  const { t } = useTranslation();

  // تكرار العملاء عشان الحركة تبقى سلسة 100%
  const duplicatedClients = [...mockClients, ...mockClients];

  const settings = {
    dots: false,
    infinite: true,
    speed: 22000,
    slidesToShow: 5, // 👈 5 في الديسكتوب
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    pauseOnHover: true,
    pauseOnFocus: false,
    arrows: false,
    rtl: document.dir === "rtl",
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3, // 👈 3 في التابلت والموبايل
        },
      },
    ],
  };

  return (
    <section
      data-section="clients"
      className="py-20 bg-[#16161b] overflow-hidden relative"
    >
      <div className="container mx-auto px-4 sm:px-6">
     {/* العنوان – صغير جدًا على الموبايل، ومناسب على الديسكتوب */}
<div className="text-center mb-10 md:mb-14">
  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
    <span
      style={{
        background: 'linear-gradient(90deg, #8F93A5 0%, #6c7081 30%, #8F93A5 60%, #6c7081 100%)',
        backgroundSize: '200% auto',
        animation: 'shimmer 3s linear infinite',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      } as React.CSSProperties}
    >
      {t('clients.subtitle')}
    </span>
  </h2>
</div>


        {/* الكاروسيل */}
        <div className="relative">
          <Slider {...settings}>
            {duplicatedClients.map((client, index) => (
              <div key={`${client.id}-${index}`} className="px-2 sm:px-3 md:px-4">
                <a
                  href={client.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block flex items-center justify-center group"
                >
                  <img
                    src={client.logo}
                    alt={`${t('clients.client')} ${client.id} ${t('clients.logo')}`}
                    loading="lazy"
                    className="h-6 sm:h-8 md:h-12 lg:h-16 xl:h-20 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out filter drop-shadow-md group-hover:drop-shadow-lg"
                  />
                </a>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Keyframes مطلوبة للتأثيرات (مضمونة حتى لو مش موجودة في ملف تاني) */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.9; }
        }
      `}</style>
    </section>
  );
};

export default ClientsSection;