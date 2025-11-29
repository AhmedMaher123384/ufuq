export interface PortfolioCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
}

export interface Portfolio {
  id: number;
  title: string;
  description: string;
  mainImage: string;
  projectUrl?: string;
  categoryId: number | null;
  status: string;
  createdAt: string;
  category?: {
    id: number;
    name: string;
    slug: string;
    description: string;
    color: string;
    icon: string;
  };
}

export const mockPortfolioCategories: PortfolioCategory[] = [
  {
    id: 1,
    name: "تصميم المواقع | Web Design",
    slug: "web-design",
    description: "تصميم مواقع إلكترونية احترافية ومتجاوبة | Professional and responsive website design",
    color: "#3B82F6",
    icon: "globe"
  },
  {
    id: 2,
    name: "تصميم التطبيقات | App Design",
    slug: "app-design",
    description: "تصميم واجهات تطبيقات موبايل مبتكرة | Innovative mobile app interface design",
    color: "#10B981",
    icon: "smartphone"
  },
  {
    id: 3,
    name: "الهوية البصرية | Visual Identity",
    slug: "branding",
    description: "تصميم شعارات وهوية بصرية متكاملة | Logo and comprehensive visual identity design",
    color: "#F59E0B",
    icon: "palette"
  },
  {
    id: 4,
    name: "التسويق الرقمي | Digital Marketing",
    slug: "digital-marketing",
    description: "حملات تسويق رقمية مبتكرة وفعالة | Innovative and effective digital marketing campaigns",
    color: "#EF4444",
    icon: "trending-up"
  }
];

export const mockPortfolios: Portfolio[] = [
  {
    id: 1,
    title: "منصة التجارة الإلكترونية الحديثة | Modern E-commerce Platform",
    description: "تصميم وتطوير منصة تجارة إلكترونية متكاملة مع نظام دفع آمن وإدارة مخزون متقدمة | Design and development of an integrated e-commerce platform with secure payment system and advanced inventory management",
    mainImage: "/images/portfolio/ecommerce-platform.jpg",
    projectUrl: "https://example-ecommerce.com",
    categoryId: 1,
    status: "published",
    createdAt: "2024-01-15T00:00:00Z",
    category: {
      id: 1,
      name: "تصميم المواقع | Web Design",
      slug: "web-design",
      description: "تصميم مواقع إلكترونية احترافية ومتجاوبة | Professional and responsive website design",
      color: "#3B82F6",
      icon: "globe"
    }
  },
  {
    id: 2,
    title: "تطبيق توصيل الطعام | Food Delivery App",
    description: "تطبيق جوال يربط بين المطاعم والعملاء مع نظام تتبع مباشر وإشعارات فورية | Mobile app connecting restaurants and customers with real-time tracking and instant notifications",
    mainImage: "/images/portfolio/food-delivery-app.jpg",
    projectUrl: "https://example-food.com",
    categoryId: 2,
    status: "published",
    createdAt: "2024-02-20T00:00:00Z",
    category: {
      id: 2,
      name: "تصميم التطبيقات | App Design",
      slug: "app-design",
      description: "تصميم واجهات تطبيقات موبايل مبتكرة | Innovative mobile app interface design",
      color: "#10B981",
      icon: "smartphone"
    }
  },
  {
    id: 3,
    title: "منصة تعليمية إلكترونية | E-Learning Platform",
    description: "منصة تعليمية متكاملة تتيح للمدرسين إنشاء الدورات التدريبية والطلاب متابعتها بسهولة | Comprehensive educational platform enabling instructors to create training courses and students to follow them easily",
    mainImage: "/images/portfolio/education-platform.jpg",
    projectUrl: "https://example-education.com",
    categoryId: 1,
    status: "published",
    createdAt: "2024-03-10T00:00:00Z",
    category: {
      id: 1,
      name: "تصميم المواقع | Web Design",
      slug: "web-design",
      description: "تصميم مواقع إلكترونية احترافية ومتجاوبة | Professional and responsive website design",
      color: "#3B82F6",
      icon: "globe"
    }
  },
  {
    id: 4,
    title: "هوية بصرية لشركة تقنية | Tech Company Visual Identity",
    description: "تصميم شعار وهوية بصرية متكاملة لشركة ناشئة في مجال التقنية | Logo and comprehensive visual identity design for a tech startup",
    mainImage: "/images/portfolio/tech-branding.jpg",
    projectUrl: "https://example-tech-brand.com",
    categoryId: 3,
    status: "published",
    createdAt: "2024-04-05T00:00:00Z",
    category: {
      id: 3,
      name: "الهوية البصرية | Visual Identity",
      slug: "branding",
      description: "تصميم شعارات وهوية بصرية متكاملة | Logo and comprehensive visual identity design",
      color: "#F59E0B",
      icon: "palette"
    }
  },
  {
    id: 5,
    title: "تطبيق إدارة المشاريع | Project Management App",
    description: "تطبيق احترافي لإدارة المشاريع والمهام يتيح للفرق التعاون بفعالية | Professional app for project and task management enabling teams to collaborate effectively",
    mainImage: "/images/portfolio/project-management-app.jpg",
    projectUrl: "https://example-pm.com",
    categoryId: 2,
    status: "published",
    createdAt: "2024-05-12T00:00:00Z",
    category: {
      id: 2,
      name: "تصميم التطبيقات | App Design",
      slug: "app-design",
      description: "تصميم واجهات تطبيقات موبايل مبتكرة | Innovative mobile app interface design",
      color: "#10B981",
      icon: "smartphone"
    }
  },
  {
    id: 6,
    title: "موقع شركة استشارات | Consulting Company Website",
    description: "موقع رسمي لشركة استشارات إدارية مع نظام حجز مواعيد وخدمات إلكترونية | Official website for a management consulting company with appointment booking and electronic services",
    mainImage: "/images/portfolio/consulting-website.jpg",
    projectUrl: "https://example-consulting.com",
    categoryId: 1,
    status: "published",
    createdAt: "2024-06-18T00:00:00Z",
    category: {
      id: 1,
      name: "تصميم المواقع | Web Design",
      slug: "web-design",
      description: "تصميم مواقع إلكترونية احترافية ومتجاوبة | Professional and responsive website design",
      color: "#3B82F6",
      icon: "globe"
    }
  }
];