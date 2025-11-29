export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  categories: string[];
  createdAt: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
}

export const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: "أفضل 10 استراتيجيات للتسويق الرقمي في 2024 | Top 10 Digital Marketing Strategies for 2024",
    slug: "best-digital-marketing-strategies-2024",
    excerpt: "اكتشف أحدث استراتيجيات التسويق الرقمي التي ستساعدك على النمو وزيادة المبيعات في عام 2024. | Discover the latest digital marketing strategies that will help you grow and increase sales in 2024.",
    content: `
      <h2>مقدمة عن التسويق الرقمي | Introduction to Digital Marketing</h2>
      <p>في عالم الأعمال المتغير بسرعة، أصبح التسويق الرقمي ضرورة حتمية لأي شركة تسعى للنجاح والنمو المستدام. | In the rapidly changing business world, digital marketing has become essential for any company seeking success and sustainable growth.</p>
      
      <h3>1. تحسين محركات البحث (SEO) | Search Engine Optimization</h3>
      <p>SEO هو أساس أي استراتيجية تسويق رقمي ناجحة. تأكد من تحسين موقعك لمحركات البحث من خلال: | SEO is the foundation of any successful digital marketing strategy. Make sure to optimize your website for search engines through:</p>
      <ul>
        <li>استخدام الكلمات المفتاحية المناسبة | Using appropriate keywords</li>
        <li>تحسين سرعة الموقع | Improving website speed</li>
        <li>إنشاء محتوى عالي الجودة | Creating high-quality content</li>
      </ul>

      <h3>2. التسويق عبر وسائل التواصل الاجتماعي | Social Media Marketing</h3>
      <p>استخدم منصات التواصل الاجتماعي للوصول إلى جمهورك المستهدف بفعالية. | Use social media platforms to effectively reach your target audience.</p>

      <h3>3. التسويق بالمحتوى | Content Marketing</h3>
      <p>أنشئ محتوى قيم ومفيد لجذب العملاء المحتملين وبناء علاقات طويلة الأمد. | Create valuable and useful content to attract potential customers and build long-term relationships.</p>

      <h2>الخلاصة | Conclusion</h2>
      <p>بتطبيق هذه الاستراتيجيات، ستتمكن من تحقيق نتائج مذهلة في تسويق عملك الرقمي. | By implementing these strategies, you will be able to achieve amazing results in your digital marketing business.</p>
    `,
    featuredImage: "/images/blog/digital-marketing-2024.jpg",
    author: "أحمد محمود",
    categories: ["تسويق رقمي", "استراتيجيات", "2024"],
    createdAt: "2024-01-15T00:00:00Z",
    metaTitle: "أفضل 10 استراتيجيات للتسويق الرقمي في 2024 | UfuqDigital",
    metaDescription: "اكتشف أحدث استراتيجيات التسويق الرقمي التي ستساعدك على النمو وزيادة المبيعات في عام 2024.",
    keywords: "تسويق رقمي, استراتيجيات تسويق, SEO, سوشيال ميديا, محتوى تسويقي"
  },
  {
    id: 2,
    title: "كيفية تصميم موقع ويب احترافي من الصفر | How to Design a Professional Website from Scratch",
    slug: "how-to-design-professional-website",
    excerpt: "دليل شامل خطوة بخطوة لتصميم موقع ويب احترافي يجذب الزوار ويحقق أهدافك التجارية. | A comprehensive step-by-step guide to designing a professional website that attracts visitors and achieves your business goals.",
    content: `
      <h2>مراحل تصميم الموقع | Website Design Stages</h2>
      <p>تصميم موقع ويب احترافي يتطلب التخطيط الجيد والتنفيذ الدقيق. | Designing a professional website requires good planning and precise execution.</p>
      
      <h3>1. التخطيط والبحث | Planning and Research</h3>
      <p>ابدأ بتحديد أهدافك وجمهورك المستهدف ثم قم ببحث شامل عن المنافسين. | Start by defining your goals and target audience, then conduct comprehensive research on competitors.</p>

      <h3>2. تصميم wireframes | Wireframe Design</h3>
      <p>ارسم مخططات أولية لترتيب العناصر في صفحاتك المختلفة. | Draw initial layouts for arranging elements on your different pages.</p>

      <h3>3. اختيار الألوان والخطوط | Choosing Colors and Fonts</h3>
      <p>اختر لوحة ألوان متناسقة وخطوط واضحة تناسب هوية علامتك التجارية. | Choose harmonious color palettes and clear fonts that suit your brand identity.</p>

      <h2>أدوات التصميم الم recomendedة | Recommended Design Tools</h2>
      <p>استخدم أدوات مثل Figma أو Adobe XD لتصميم واجهات المستخدم. | Use tools like Figma or Adobe XD to design user interfaces.</p>
    `,
    featuredImage: "/images/blog/website-design.jpg",
    author: "سارة علي",
    categories: ["تصميم ويب", "تطوير", "UI/UX"],
    createdAt: "2024-02-20T00:00:00Z",
    metaTitle: "كيفية تصميم موقع ويب احترافي من الصفر | UfuqDigital",
    metaDescription: "دليل شامل خطوة بخطوة لتصميم موقع ويب احترافي يجذب الزوار ويحقق أهدافك التجارية."
  },
  {
    id: 3,
    title: "أهمية SEO في بناء علامتك التجارية | Importance of SEO in Brand Building",
    slug: "importance-of-seo-brand-building",
    excerpt: "تعرف على كيفية استخدام SEO لبناء علامة تجارية قوية وزيادة الوعي بعلامتك التجارية. | Learn how to use SEO to build a strong brand and increase brand awareness.",
    content: `
      <h2>SEO والعلامة التجارية | SEO and Branding</h2>
      <p>SEO ليس فقط عن الترتيب في نتائج البحث، بل هو أداة قوية لبناء علامتك التجارية. | SEO is not just about search rankings, it's a powerful tool for building your brand.</p>
      
      <h3>بناء الثقة والمصداقية | Building Trust and Credibility</h3>
      <p>الظهور في نتائج البحث الأولى يعزز من ثقة العملاء في علامتك التجارية. | Appearing in top search results enhances customer trust in your brand.</p>

      <h3>زيادة الوعي بالعلامة | Increasing Brand Awareness</h3>
      <p>كلما ظهرت أكثر في نتائج البحث، زادت فرصة أن يتذكرك العملاء المحتملون. | The more you appear in search results, the more likely potential customers will remember you.</p>

      <h3>استهداف الجمهور المناسب | Targeting the Right Audience</h3>
      <p>من خلال الكلمات المفتاحية المناسبة، يمكنك الوصول إلى العملاء الذين يبحثون عن حلولك. | Through appropriate keywords, you can reach customers who are searching for your solutions.</p>
    `,
    featuredImage: "/images/blog/seo-branding.jpg",
    author: "محمد حسن",
    categories: ["SEO", "علامة تجارية", "تسويق"],
    createdAt: "2024-03-10T00:00:00Z"
  },
  {
    id: 4,
    title: "دليل المبتدئين للإعلانات المدفوعة على Google | Beginner's Guide to Google Ads",
    slug: "beginners-guide-google-ads",
    excerpt: "تعلم أساسيات إنشاء وإدارة حملات إعلانية ناجحة على Google Ads مع نصائح عملية. | Learn the basics of creating and managing successful advertising campaigns on Google Ads with practical tips.",
    content: `
      <h2>ماهي Google Ads؟ | What is Google Ads?</h2>
      <p>Google Ads هو نظام إعلاني يسمح لك بعرض إعلاناتك في نتائج بحث Google. | Google Ads is an advertising system that allows you to display your ads in Google search results.</p>
      
      <h3>إعداد الحساب | Account Setup</h3>
      <p>ابدأ بإنشاء حساب Google Ads وربطه بموقعك الإلكتروني. | Start by creating a Google Ads account and linking it to your website.</p>

      <h3>اختيار الكلمات المفتاحية | Keyword Selection</h3>
      <p>استخدام أداة Keyword Planner لاختيار الكلمات المفتاحية المناسبة. | Use the Keyword Planner tool to select appropriate keywords.</p>

      <h3>كتابة نصوص الإعلانات | Writing Ad Copy</h3>
      <p>أنشئ نصوص إعلانية جذابة وواضحة تحث المستخدمين على النقر. | Create attractive and clear ad copy that encourages users to click.</p>
    `,
    featuredImage: "/images/blog/google-ads.jpg",
    author: "ليلى أحمد",
    categories: ["إعلانات", "Google Ads", "PPC"],
    createdAt: "2024-04-05T00:00:00Z"
  },
  {
    id: 5,
    title: "كيفية قياس نجاح حملاتك التسويقية | How to Measure Marketing Campaign Success",
    slug: "measuring-marketing-campaign-success",
    excerpt: "تعرف على المقاييس والأدوات الهامة لقياس أداء حملاتك التسويقية وتحسين النتائج. | Learn about the important metrics and tools to measure your marketing campaign performance and improve results.",
    content: `
      <h2>مقاييس النجاح | Success Metrics</h2>
      <p>قياس نجاح حملاتك التسويقية أمر ضروري لتحسين أدائك وتحقيق أفضل النتائج. | Measuring marketing campaign success is essential to improve your performance and achieve better results.</p>
      
      <h3>نسبة التحويل (Conversion Rate) | Conversion Rate</h3>
      <p>نسبة الزوار الذين يقومون بالإجراء المطلوب منهم. | The percentage of visitors who take the desired action.</p>

      <h3>عائد الاستثمار (ROI) | Return on Investment</h3>
      <p>مقدار الربح الذي تحققه مقابل كل دولار تنفقه على التسويق. | The amount of profit you make for every dollar you spend on marketing.</p>

      <h3>تكلفة الحصول على العميل (CAC) | Customer Acquisition Cost</h3>
      <p>المبلغ الذي تنفقه للحصول على عميل جديد. | The amount you spend to acquire a new customer.</p>
    `,
    featuredImage: "/images/blog/marketing-metrics.jpg",
    author: "خالد مصطفى | Khaled Mostafa",
    categories: ["تحليلات | Analytics", "قياس الأداء | Performance", "ROI"],
    createdAt: "2024-05-20T00:00:00Z"
  },
  {
    id: 6,
    title: "أفضل الممارسات لتصميم تجربة المستخدم (UX) | UX Design Best Practices",
    slug: "ux-design-best-practices",
    excerpt: "تعلم أفضل الممارسات لتصميم تجربة مستخدم ممتازة تزيد من رضا العملاء والمبيعات. | Learn best practices for designing excellent user experience that increases customer satisfaction and sales.",
    content: `
      <h2>ماهي تجربة المستخدم؟ | What is User Experience?</h2>
      <p>تجربة المستخدم هي انطباع المستخدم عن تفاعله مع منتجك أو خدمتك. | User experience is the user's impression of their interaction with your product or service.</p>
      
      <h3>البساطة والوضوح | Simplicity and Clarity</h3>
      <p>اجعل تصميمك بسيطًا وواضحًا حتى يتمكن المستخدم من تحقيق أهدافه بسهولة. | Keep your design simple and clear so users can achieve their goals easily.</p>

      <h3>الاستجابة والسرعة | Responsiveness and Speed</h3>
      <p>تأكد أن موقعك سريع ومتجاوب مع جميع الأجهزة. | Make sure your website is fast and responsive on all devices.</p>

      <h3>الوصولية | Accessibility</h3>
      <p>صمم لجميع المستخدمين بما في ذلك ذوي الإعاقة. | Design for all users including those with disabilities.</p>
    `,
    featuredImage: "/images/blog/ux-design.jpg",
    author: "نورا سامي | Nora Samy",
    categories: ["UX", "تصميم | Design", "مستخدم | User"],
    createdAt: "2024-06-15T00:00:00Z"
  },
  {
    id: 7,
    title: "استراتيجيات المحتوى التسويقي الفعالة | Effective Content Marketing Strategies",
    slug: "effective-content-marketing-strategies",
    excerpt: "اكتشف استراتيجيات إنشاء محتوى تسويقي جذاب يجذب العملاء ويزيد من المبيعات. | Discover strategies for creating engaging marketing content that attracts customers and increases sales.",
    content: `
      <h2>قوة المحتوى التسويقي | The Power of Marketing Content</h2>
      <p>المحتوى التسويقي هو وسيلتك للتواصل مع جمهورك وبناء علاقات طويلة الأمد. | Marketing content is your way to communicate with your audience and build long-term relationships.</p>
      
      <h3>فهم جمهورك | Understanding Your Audience</h3>
      <p>قبل إنشاء المحتوى، فهم احتياجات جمهورك ومشاكلهم. | Before creating content, understand your audience's needs and problems.</p>

      <h3>إنشاء قيمة حقيقية | Creating Real Value</h3>
      <p>قدم محتوى مفيد وحلول حقيقية لمشاكل جمهورك. | Provide useful content and real solutions to your audience's problems.</p>

      <h3>الاستمرارية والانتظام | Consistency and Continuity</h3>
      <p>كون منتظمًا في نشر المحتوى وبناء حضور مستمر. | Be consistent in publishing content and building a continuous presence.</p>
    `,
    featuredImage: "/images/blog/content-marketing.jpg",
    author: "ياسمين خالد",
    categories: ["محتوى تسويقي", "استراتيجيات", "تسويق"],
    createdAt: "2024-07-10T00:00:00Z"
  },
  {
    id: 8,
    title: "تحديات التسويق الرقمي وكيفية التغلب عليها",
    slug: "digital-marketing-challenges-solutions",
    excerpt: "تعرف على أهم التحديات التي تواجه المسوقين الرقميين وكيفية التغلب عليها بفعالية.",
    content: `
      <h2>تحديات التسويق الرقمي</h2>
      <p>يواجه المسوقون الرقميون العديد من التحديات في بيئة تتغير باستمرار.</p>
      
      <h3>تغيير الخوارزميات</h3>
      <p>تغييرات خوارزميات Google ووسائل التواصل الاجتماعي تؤثر على وصول المحتوى.</p>

      <h3>زيادة المنافسة</h3>
      <p>زيادة عدد الشركات التي تستخدم التسويق الرقمي يجعل التميز أكثر صعوبة.</p>

      <h3>خصوصية البيانات</h3>
      <p>قوانين الخصوصية الجديدة تحد من إمكانية جمع واستخدام البيانات.</p>

      <h2>الحلول المقترحة</h2>
      <p>التكيف مع التغييرات والتركيز على بناء علاقات حقيقية مع العملاء.</p>
    `,
    featuredImage: "/images/blog/marketing-challenges.jpg",
    author: "طارق إبراهيم",
    categories: ["تحديات", "حلول", "تسويق رقمي"],
    createdAt: "2024-08-05T00:00:00Z"
  }
];