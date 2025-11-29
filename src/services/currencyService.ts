// خدمة تحويل العملات مع أسعار الصرف اللحظية
// Currency conversion service with real-time exchange rates

export interface ExchangeRates {
  USD: number; // دولار أمريكي (للتحويل من API)
  EGP: number; // جنيه مصري  
  AED: number; // درهم إماراتي
  SAR: number; // ريال سعودي (العملة الأساسية = 1)
}

export interface CurrencyInfo {
  code: string;
  name: string;
  nameAr: string;
  symbol: string;
  flag: string;
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyInfo> = {
  SAR: {
    code: 'SAR',
    name: 'Saudi Riyal',
    nameAr: 'ريال سعودي',
    symbol: 'ر.س',
    flag: '🇸🇦'
  },
  USD: {
    code: 'USD',
    name: 'US Dollar',
    nameAr: 'دولار أمريكي',
    symbol: '$',
    flag: '🇺🇸'
  },
  EGP: {
    code: 'EGP', 
    name: 'Egyptian Pound',
    nameAr: 'جنيه مصري',
    symbol: 'ج.م',
    flag: '🇪🇬'
  },
  AED: {
    code: 'AED',
    name: 'UAE Dirham', 
    nameAr: 'درهم إماراتي',
    symbol: 'د.إ',
    flag: '🇦🇪'
  }
};

class CurrencyService {
  private static instance: CurrencyService;
  private exchangeRates: ExchangeRates | null = null;
  private lastUpdate: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 دقائق
  // مزوّدات متعددة لتفادي مشاكل TLS/الحجب
  private readonly PROVIDERS: string[] = [
    'https://open.er-api.com/v6/latest/SAR',
    'https://api.exchangerate-api.com/v4/latest/SAR',
    'https://api.exchangerate.host/latest?base=SAR'
  ];

  private constructor() {}

  public static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService();
    }
    return CurrencyService.instance;
  }

  // جلب أسعار الصرف اللحظية
  public async fetchExchangeRates(): Promise<ExchangeRates> {
    const now = Date.now();
    
    // استخدام البيانات المخزنة مؤقتاً إذا كانت حديثة
    if (this.exchangeRates && (now - this.lastUpdate) < this.CACHE_DURATION) {
      return this.exchangeRates;
    }

    try {
      // محاولة المزودين بالتتابع لتجاوز أي مشاكل شبكات/شهادات
      for (const url of this.PROVIDERS) {
        try {
          const response = await fetch(url, { cache: 'no-store' });
          if (!response.ok) {
            throw new Error(`HTTP ${response.status} from ${url}`);
          }
          const data = await response.json();
          const rates = this.extractRates(data);
          if (!rates) {
            throw new Error(`Invalid response format from ${url}`);
          }

          this.exchangeRates = {
            USD: rates.USD ?? 0.2667,
            EGP: rates.EGP ?? 8.30,
            AED: rates.AED ?? 0.9789,
            SAR: 1
          };

          this.lastUpdate = now;
          localStorage.setItem('exchangeRates', JSON.stringify({
            rates: this.exchangeRates,
            timestamp: now
          }));
          return this.exchangeRates;
        } catch (providerErr) {
          // استمر إلى المزود التالي
          console.warn(`فشل مزوّد أسعار الصرف: ${url}`, providerErr);
          continue;
        }
      }

      // جميع المزودين فشلوا
      throw new Error('All exchange rate providers failed');
    } catch (error) {
      console.warn('فشل في جلب أسعار الصرف اللحظية، استخدام البيانات المحفوظة:', error);
      
      // محاولة استخدام البيانات المحفوظة
      const cached = localStorage.getItem('exchangeRates');
      if (cached) {
        try {
          const parsedCache = JSON.parse(cached);
          const cacheAge = now - parsedCache.timestamp;
          
          // استخدام البيانات المحفوظة إذا كانت أقل من ساعة
          if (cacheAge < 60 * 60 * 1000) {
            this.exchangeRates = parsedCache.rates;
            return this.exchangeRates!;
          }
        } catch (parseError) {
          console.warn('فشل في تحليل البيانات المحفوظة:', parseError);
        }
      }
      
      // استخدام أسعار افتراضية كحل أخير
      this.exchangeRates = {
        USD: 0.2667, // 1 SAR = 0.2667 USD (محدث)
        EGP: 8.30, // 1 SAR = 8.30 EGP (محدث)
        AED: 0.9789, // 1 SAR = 0.9789 AED (محدث)
        SAR: 1     // العملة الأساسية
      };
      
      return this.exchangeRates;
    }
  }

  // تطبيع الاستجابة من مزودات مختلفة إلى شكل ExchangeRates جزئي
  private extractRates(data: any): Partial<ExchangeRates> | null {
    try {
      if (data && typeof data === 'object') {
        // open.er-api.com: { result: 'success', base_code: 'SAR', rates: {...} }
        if (data.base_code === 'SAR' && data.rates) {
          return {
            USD: data.rates.USD,
            EGP: data.rates.EGP,
            AED: data.rates.AED,
            SAR: 1
          };
        }
        // exchangerate-api.com أو exchangerate.host: { base: 'SAR', rates: {...} } أو بدون base
        if (data.rates && typeof data.rates === 'object') {
          return {
            USD: data.rates.USD,
            EGP: data.rates.EGP,
            AED: data.rates.AED,
            SAR: 1
          };
        }
      }
    } catch (_) {
      // تجاهل أي أخطاء في التطبيع
    }
    return null;
  }

  // تحويل مبلغ من الريال السعودي إلى العملة المحددة
  public async convertFromSAR(amount: number, toCurrency: string): Promise<number> {
    const rates = await this.fetchExchangeRates();
    
    switch (toCurrency) {
      case 'SAR':
        return amount; // نفس العملة
      case 'EGP':
        return amount * rates.EGP;
      case 'AED':
        return amount * rates.AED;
      case 'USD':
        return amount * rates.USD;
      default:
        throw new Error(`العملة غير مدعومة: ${toCurrency}`);
    }
  }

  // تحويل مبلغ من عملة إلى أخرى
  public async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    const rates = await this.fetchExchangeRates();
    
    // تحويل إلى الريال السعودي أولاً
    let sarAmount = amount;
    if (fromCurrency !== 'SAR') {
      switch (fromCurrency) {
        case 'USD':
          sarAmount = amount / rates.USD;
          break;
        case 'EGP':
          sarAmount = amount / rates.EGP;
          break;
        case 'AED':
          sarAmount = amount / rates.AED;
          break;
        default:
          throw new Error(`العملة غير مدعومة: ${fromCurrency}`);
      }
    }
    
    // ثم تحويل من الريال إلى العملة المطلوبة
    return this.convertFromSAR(sarAmount, toCurrency);
  }

  // تنسيق المبلغ حسب العملة
  public formatCurrency(amount: number, currency: string, locale: string = 'ar-SA'): string {
    const currencyInfo = SUPPORTED_CURRENCIES[currency];
    if (!currencyInfo) {
      return amount.toFixed(2);
    }

    const formattedAmount = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);

    return `${formattedAmount} ${currencyInfo.symbol}`;
  }

  // الحصول على معلومات العملة
  public getCurrencyInfo(currency: string): CurrencyInfo | null {
    return SUPPORTED_CURRENCIES[currency] || null;
  }

  // الحصول على قائمة العملات المدعومة
  public getSupportedCurrencies(): CurrencyInfo[] {
    return Object.values(SUPPORTED_CURRENCIES);
  }

  // تحديث أسعار الصرف يدوياً
  public async refreshRates(): Promise<ExchangeRates> {
    this.lastUpdate = 0; // إعادة تعيين وقت آخر تحديث
    return this.fetchExchangeRates();
  }
}

export default CurrencyService.getInstance();