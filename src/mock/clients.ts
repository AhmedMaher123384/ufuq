import avatar1 from '../assets/malak.webp';
import avatar2 from '../assets/malak.webp';
import avatar3 from '../assets/malak.webp';
import avatar4 from '../assets/malak.webp';
import avatar5 from '../assets/malak.webp';

export interface MockClient {
  id: number;
  logo: string;
  website?: string;
  name_ar?: string;
  name_en?: string;
}

export const mockClients: MockClient[] = [
  { id: 1, logo: avatar1, website: 'https://client1.com', name_ar: 'عميل 1', name_en: 'Client 1' },
  { id: 2, logo: avatar2, website: 'https://client2.com', name_ar: 'عميل 2', name_en: 'Client 2' },
  { id: 3, logo: avatar3, website: 'https://client3.com', name_ar: 'عميل 3', name_en: 'Client 3' },
  { id: 4, logo: avatar4, website: 'https://client4.com', name_ar: 'عميل 4', name_en: 'Client 4' },
  { id: 5, logo: avatar5, website: 'https://client5.com', name_ar: 'عميل 5', name_en: 'Client 5' },
  { id: 6, logo: avatar1, website: 'https://client6.com', name_ar: 'عميل 6', name_en: 'Client 6' },
  { id: 7, logo: avatar2, website: 'https://client7.com', name_ar: 'عميل 7', name_en: 'Client 7' },
  { id: 8, logo: avatar3, website: 'https://client8.com', name_ar: 'عميل 8', name_en: 'Client 8' },
  { id: 9, logo: avatar4, website: 'https://client9.com', name_ar: 'عميل 9', name_en: 'Client 9' },
  { id: 10, logo: avatar5, website: 'https://client10.com', name_ar: 'عميل 10', name_en: 'Client 10' },
];