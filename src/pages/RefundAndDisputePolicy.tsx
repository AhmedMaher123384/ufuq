import React, { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, CheckCircle, FileText, AlertCircle, Scale, CreditCard, Timer, Mail, Phone } from 'lucide-react';

const RefundAndDisputePolicy: React.FC = () => {
  const { t } = useTranslation();

  const definitionsData = useMemo(
    () => [
      {
        label: t('refund_dispute_policy.definitions.agency'),
        text: t('refund_dispute_policy.definitions.agency_text'),
      },
      {
        label: t('refund_dispute_policy.definitions.client'),
        text: t('refund_dispute_policy.definitions.client_text'),
      },
      {
        label: t('refund_dispute_policy.definitions.services'),
        text: t('refund_dispute_policy.definitions.services_text'),
      },
    ],
    [t]
  );

  const cancellationData = useMemo(
    () => [
      t('refund_dispute_policy.cancellation.point1'),
      t('refund_dispute_policy.cancellation.point2'),
      t('refund_dispute_policy.cancellation.point3'),
      t('refund_dispute_policy.cancellation.point4'),
    ],
    [t]
  );

  const refundRulesData = useMemo(
    () => [
      t('refund_dispute_policy.refund_rules.point1'),
      t('refund_dispute_policy.refund_rules.point2'),
      t('refund_dispute_policy.refund_rules.point3'),
      t('refund_dispute_policy.refund_rules.point4'),
      t('refund_dispute_policy.refund_rules.point5'),
    ],
    [t]
  );

  const disputeData = useMemo(
    () => [
      t('refund_dispute_policy.dispute.point1'),
      t('refund_dispute_policy.dispute.point2'),
      t('refund_dispute_policy.dispute.point3'),
      t('refund_dispute_policy.dispute.point4'),
      t('refund_dispute_policy.dispute.point5'),
    ],
    [t]
  );

  const chargebackData = useMemo(
    () => [
      t('refund_dispute_policy.chargeback.point1'),
      t('refund_dispute_policy.chargeback.point2'),
      t('refund_dispute_policy.chargeback.point3'),
    ],
    [t]
  );

  const processingData = useMemo(
    () => [
      t('refund_dispute_policy.processing.point1'),
      t('refund_dispute_policy.processing.point2'),
      t('refund_dispute_policy.processing.point3'),
    ],
    [t]
  );

  const renderDefinitionItem = useCallback(
    (item: { label: string; text: string }, index: number) => (
      <div
        key={index}
        className="bg-[#7a7a7a]/15 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/10 hover:bg-[#7a7a7a]/25 transition-all duration-300 animate-slideInRight mobile-padding ultra-mobile-padding"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
          <span className="font-bold text-white text-sm sm:text-base flex-shrink-0">{item.label}</span>
          <span className="text-gray-100 text-sm sm:text-base leading-relaxed">{item.text}</span>
        </div>
      </div>
    ),
    []
  );

  const renderListItem = useCallback(
    (item: string, index: number) => (
      <div
        key={index}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 bg-[#7a7a7a]/15 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/10 hover:bg-[#7a7a7a]/25 transition-all duration-300 animate-slideInRight mobile-padding ultra-mobile-padding"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#7a7a7a] flex-shrink-0" />
        <span className="text-gray-100 text-sm sm:text-base leading-relaxed">{item}</span>
      </div>
    ),
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#16161b] via-[#202026] to-[#16161b] text-white" dir="rtl">
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
          .animate-slideInRight { animation: slideInRight 0.6s ease-out forwards; }
          .animate-scaleIn { animation: scaleIn 0.5s ease-out forwards; }
          .animate-float { animation: float 3s ease-in-out infinite; }
          .animate-pulse { animation: pulse 4s ease-in-out infinite; }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.25; }
            50% { transform: scale(1.2); opacity: 0.35; }
          }
          @media (max-width: 640px) {
            .mobile-text-responsive { font-size: 1.25rem !important; line-height: 1.75rem !important; }
            .mobile-padding { padding: 1rem !important; }
          }
          @media (max-width: 480px) {
            .ultra-mobile-text { font-size: 1.125rem !important; line-height: 1.625rem !important; }
            .ultra-mobile-padding { padding: 0.75rem !important; }
          }
        `}
      </style>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#7a7a7a]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#24a27b]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#7a7a7a]/10 to-[#24a27b]/10 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-fadeInUp">
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-[#24a27b] to-[#7a7a7a] bg-clip-text text-transparent mb-4 sm:mb-6 mobile-text-responsive ultra-mobile-text"
                style={{ textShadow: '0 0 20px rgba(36,162,123,0.5)' }}
              >
                {t('refund_dispute_policy.title')}
              </h1>
              <div className="flex items-center justify-center gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 mobile-text-responsive">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#7a7a7a]" />
                <span>{t('refund_dispute_policy.last_updated')}</span>
              </div>
              <p className="text-gray-100 text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto mobile-text-responsive ultra-mobile-text">
                {t('refund_dispute_policy.introduction')}
              </p>
            </div>

            <div className="mb-6 sm:mb-8 lg:mb-10 animate-fadeInUp">
              <h2
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#24a27b] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 mobile-text-responsive ultra-mobile-text"
                style={{ textShadow: '0 0 8px rgba(36,162,123,0.5)' }}
              >
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#7a7a7a] flex-shrink-0" />
                {t('refund_dispute_policy.definitions.title')}
              </h2>
              <div className="space-y-3 sm:space-y-4">{definitionsData.map(renderDefinitionItem)}</div>
            </div>

            <div className="mb-6 sm:mb-8 lg:mb-10 animate-fadeInUp">
              <h2
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#24a27b] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 mobile-text-responsive ultra-mobile-text"
                style={{ textShadow: '0 0 8px rgba(36,162,123,0.5)' }}
              >
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#7a7a7a] flex-shrink-0" />
                {t('refund_dispute_policy.cancellation.title')}
              </h2>
              <div className="space-y-3 sm:space-y-4">{cancellationData.map(renderListItem)}</div>
            </div>

            <div className="mb-6 sm:mb-8 lg:mb-10 animate-fadeInUp">
              <h2
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#24a27b] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 mobile-text-responsive ultra-mobile-text"
                style={{ textShadow: '0 0 8px rgba(36,162,123,0.5)' }}
              >
                <Scale className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#7a7a7a] flex-shrink-0" />
                {t('refund_dispute_policy.refund_rules.title')}
              </h2>
              <div className="space-y-3 sm:space-y-4">{refundRulesData.map(renderListItem)}</div>
            </div>

            <div className="mb-6 sm:mb-8 lg:mb-10 animate-fadeInUp">
              <h2
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#24a27b] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 mobile-text-responsive ultra-mobile-text"
                style={{ textShadow: '0 0 8px rgba(36,162,123,0.5)' }}
              >
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#7a7a7a] flex-shrink-0" />
                {t('refund_dispute_policy.dispute.title')}
              </h2>
              <div className="space-y-3 sm:space-y-4">{disputeData.map(renderListItem)}</div>
            </div>

            <div className="mb-6 sm:mb-8 lg:mb-10 animate-fadeInUp">
              <h2
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#24a27b] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 mobile-text-responsive ultra-mobile-text"
                style={{ textShadow: '0 0 8px rgba(36,162,123,0.5)' }}
              >
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#7a7a7a] flex-shrink-0" />
                {t('refund_dispute_policy.chargeback.title')}
              </h2>
              <div className="space-y-3 sm:space-y-4">{chargebackData.map(renderListItem)}</div>
            </div>

            <div className="mb-10 sm:mb-12 lg:mb-14 animate-fadeInUp">
              <h2
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#24a27b] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 mobile-text-responsive ultra-mobile-text"
                style={{ textShadow: '0 0 8px rgba(36,162,123,0.5)' }}
              >
                <Timer className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#7a7a7a] flex-shrink-0" />
                {t('refund_dispute_policy.processing.title')}
              </h2>
              <div className="space-y-3 sm:space-y-4">{processingData.map(renderListItem)}</div>
            </div>

            <div className="bg-[#7a7a7a]/10 border border-white/10 rounded-2xl p-4 sm:p-6 mb-8 sm:mb-10 animate-scaleIn">
              <h3 className="text-lg sm:text-xl font-bold text-[#24a27b] mb-3">{t('refund_dispute_policy.contact.title')}</h3>
              <p className="text-gray-100 text-sm sm:text-base leading-relaxed mb-4">{t('refund_dispute_policy.contact.description')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <a
                  href="mailto:info@ufuq-digital.com"
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4 sm:p-5 transition-all duration-300 hover:border-[#24a27b]/40 hover:bg-white/10 hover:-translate-y-0.5"
                  dir="ltr"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[#24a27b]/12 via-transparent to-transparent" />
                  <div className="relative flex items-start gap-3">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#24a27b]/15 border border-white/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-[#24a27b]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-semibold text-gray-100/90">
                        {t('refund_dispute_policy.contact.email_label')}
                      </div>
                      <div className="mt-1 text-sm sm:text-base font-bold text-white break-all">
                        info@ufuq-digital.com
                      </div>
                    </div>
                  </div>
                </a>

                <a
                  href="tel:++966535166370"
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4 sm:p-5 transition-all duration-300 hover:border-[#24a27b]/40 hover:bg-white/10 hover:-translate-y-0.5"
                  dir="ltr"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[#24a27b]/12 via-transparent to-transparent" />
                  <div className="relative flex items-start gap-3">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#24a27b]/15 border border-white/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[#24a27b]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-semibold text-gray-100/90">
                        {t('refund_dispute_policy.contact.phone_label')}
                      </div>
                      <div className="mt-1 text-sm sm:text-base font-bold text-white break-words">
                        +966535166370
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#24a27b] to-[#7a7a7a] hover:scale-[1.02] active:scale-[0.99] transition-transform text-white font-semibold"
              >
                {t('refund_dispute_policy.back_to_home')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundAndDisputePolicy;
