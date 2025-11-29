import React, { useState, useEffect, useRef } from 'react';
import { Send, Mail, User, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactSection: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });

  const formRef = useRef<HTMLDivElement | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (formRef.current) observer.observe(formRef.current);

    return () => {
      if (formRef.current) observer.unobserve(formRef.current);
    };
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // هنا ممكن تضيف إرسال لـ backend أو EmailJS أو غيره
  };

  return (
    <section data-section="contact" className="py-20 md:py-32 bg-gradient-to-b from-[#16161b] via-[#1a1a20] to-[#16161b] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8F93A5] rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#6c7081] rounded-full blur-[120px] animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#8F93A5]"></div>
            <span className="text-[#8F93A5] text-sm font-medium tracking-[0.3em] uppercase">
              {t('home.contact.contact_us_now')}
            </span>
            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#8F93A5]"></div>
          </div>

          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight">
            LET'S{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8F93A5] via-[#a8abbe] to-[#8F93A5] bg-[length:200%_auto] animate-gradient">
              Talk Business 
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto font-light">
            {t('home.contact.subtitle')}
          </p>
        </div>

        {/* Form Container */}
        <div 
          ref={formRef}
          className="opacity-0 translate-y-8"
        >
          <div className="relative group">
            {/* Glowing Border Effect */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-[#8F93A5] via-[#6c7081] to-[#8F93A5] rounded-3xl opacity-50 blur-sm group-hover:opacity-75 transition-opacity duration-500"></div>
            
            {/* Form Card */}
            <div className="relative bg-[#1c1c24] rounded-3xl p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Name Field */}
                <div className="relative">
                  <label className="block text-white/70 text-sm font-medium mb-3 text-right">
                    {t('home.contact.name_placeholder')}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-[#25252f] border-2 border-[#2a2a35] rounded-2xl px-5 py-4 pr-12
                                 text-white placeholder-white/30 text-right
                                 focus:border-[#8F93A5] focus:bg-[#2a2a35] outline-none
                                 transition-all duration-300"
                      placeholder="أدخل اسمك"
                    />
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                      focusedField === 'name' ? 'text-[#8F93A5]' : 'text-white/30'
                    }`} />
                  </div>
                </div>

                {/* Email Field */}
                <div className="relative">
                  <label className="block text-white/70 text-sm font-medium mb-3 text-right">
                    {t('home.contact.email_placeholder')}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-[#25252f] border-2 border-[#2a2a35] rounded-2xl px-5 py-4 pr-12
                                 text-white placeholder-white/30 text-right
                                 focus:border-[#8F93A5] focus:bg-[#2a2a35] outline-none
                                 transition-all duration-300"
                      placeholder="example@email.com"
                    />
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                      focusedField === 'email' ? 'text-[#8F93A5]' : 'text-white/30'
                    }`} />
                  </div>
                </div>
              </div>

              {/* Message Field */}
              <div className="relative mb-8">
                <label className="block text-white/70 text-sm font-medium mb-3 text-right">
                  {t('home.contact.message_placeholder')}
                </label>
                <div className="relative">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    rows={6}
                    className="w-full bg-[#25252f] border-2 border-[#2a2a35] rounded-2xl px-5 py-4 pr-12
                               text-white placeholder-white/30 text-right resize-none
                               focus:border-[#8F93A5] focus:bg-[#2a2a35] outline-none
                               transition-all duration-300"
                    placeholder="اكتب رسالتك هنا..."
                  />
                  <MessageSquare className={`absolute left-4 top-6 w-5 h-5 transition-colors duration-300 ${
                    focusedField === 'message' ? 'text-[#8F93A5]' : 'text-white/30'
                  }`} />
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full relative group/btn overflow-hidden bg-gradient-to-r from-[#8F93A5] to-[#6c7081] 
                           text-white font-bold py-5 px-8 rounded-2xl
                           transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                           shadow-lg shadow-[#8F93A5]/20 hover:shadow-2xl hover:shadow-[#8F93A5]/40"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#6c7081] to-[#8F93A5] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-3">
                  <span className="text-lg tracking-wide">
                    {t('home.contact.send_button')}
                  </span>
                  <Send className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-slide-up {
          animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default ContactSection;