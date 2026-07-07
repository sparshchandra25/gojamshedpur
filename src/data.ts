import { Pro, Category, Review, NeighborhoodInfo } from './types';

export const JAMSHEDPUR_NEIGHBORHOODS = [
  'Sakchi',
  'Bistupur',
  'Telco',
  'Mango',
  'Kadma',
  'Golmuri',
  'Sonari',
  'Baridih'
];

export const NEIGHBORHOOD_INFOS: NeighborhoodInfo[] = [
  {
    id: 'jubilee-park',
    name: 'Jubilee Park',
    description: 'North Jamshedpur coverage',
    iconName: 'tree'
  },
  {
    id: 'tata-steel-township',
    name: 'Tata Steel Township',
    description: 'Heritage zone operations',
    iconName: 'factory'
  },
  {
    id: 'dalma-hills',
    name: 'Dalma Hills',
    description: 'West zone coverage',
    iconName: 'mountain'
  },
  {
    id: 'bistupur-market',
    name: 'Bistupur Market',
    description: 'Central business zone',
    iconName: 'shop'
  }
];

export const CATEGORIES: Category[] = [
  {
    id: 'maintenance',
    name: 'Maintenance',
    description: 'Plumbing, electrical, carpentry, and appliance repairs by certified local technicians.',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop', // plumber working
    popularTags: ['Plumber', 'Electrician', 'Carpenter', '+12 more'],
    startingPrice: 299,
    label: 'Most Booked',
    iconName: 'wrench'
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    description: 'Deep cleaning, sofa & mattress cleaning, bathroom sanitization and move-in/out services.',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop', // cleaners
    popularTags: ['Deep Clean', 'Sofa', 'Bathroom', '+8 more'],
    startingPrice: 499,
    iconName: 'spray'
  },
  {
    id: 'home-improvement',
    name: 'Home Improvement',
    description: 'Painting, tiling, false ceiling, waterproofing and complete renovation services.',
    imageUrl: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=600&auto=format&fit=crop', // painted walls/room
    popularTags: ['Painting', 'Tiling', 'Waterproof', '+15 more'],
    startingPrice: 799,
    label: 'New',
    iconName: 'hammer'
  }
];

export const QUICK_SERVICES = [
  { name: 'AC Repair', icon: 'snowflake' },
  { name: 'Pest Control', icon: 'shield' },
  { name: 'Security', icon: 'lock' },
  { name: 'Furniture', icon: 'sofa' },
  { name: 'Water Tank', icon: 'droplet' },
  { name: 'Electrician', icon: 'sun' }
];

export const VERIFIED_PROS: Pro[] = [
  {
    id: 'rajan-kumar',
    name: 'Rajan Kumar',
    category: 'Electrician',
    rating: 4.9,
    reviewsCount: 143,
    verified: true,
    neighborhood: 'Bistupur',
    experience: 8,
    bio: 'Specializes in wiring, MCB repairs and inverter installations across Jamshedpur households.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    startingPrice: 350,
    phone: '+91 94313 58124'
  },
  {
    id: 'priya-sharma',
    name: 'Priya Sharma',
    category: 'Deep Cleaning',
    rating: 4.8,
    reviewsCount: 98,
    verified: true,
    neighborhood: 'Sakchi',
    experience: 5,
    bio: 'Expert in post-construction cleaning, bathroom sanitization and full apartment deep cleans.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    startingPrice: 699,
    phone: '+91 82104 39712'
  },
  {
    id: 'mahesh-yadav',
    name: 'Mahesh Yadav',
    category: 'Plumber',
    rating: 5.0,
    reviewsCount: 217,
    verified: true,
    neighborhood: 'Telco',
    experience: 12,
    bio: 'Senior plumber handling overhead tank, pipeline repair, bathroom fitting and water heater.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    startingPrice: 400,
    phone: '+91 70042 15309'
  },
  {
    id: 'anita-devi',
    name: 'Anita Devi',
    category: 'AC Specialist',
    rating: 4.7,
    reviewsCount: 76,
    verified: true,
    neighborhood: 'Kadma',
    experience: 6,
    bio: 'Certified AC technician for split, window and cassette units — service, gas refill and repair.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    startingPrice: 499,
    phone: '+91 95461 88234'
  },
  // Extra pros for robust searching/filtering
  {
    id: 'anil-singh',
    name: 'Anil Singh',
    category: 'Pest Control',
    rating: 4.9,
    reviewsCount: 112,
    verified: true,
    neighborhood: 'Mango',
    experience: 9,
    bio: 'Eco-friendly pest eradication, termite control and sanitization with warranty.',
    avatarUrl: 'https://images.unsplash.com/photo-1621574539437-4b7cb63120b8?q=80&w=200&auto=format&fit=crop',
    startingPrice: 599,
    phone: '+91 62045 12978'
  },
  {
    id: 'rajesh-mahanty',
    name: 'Rajesh Mahanty',
    category: 'Painter',
    rating: 4.8,
    reviewsCount: 184,
    verified: true,
    neighborhood: 'Sakchi',
    experience: 10,
    bio: 'Royal emulsion finishing, texture walls, and exterior waterproof painting expert.',
    avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=200&auto=format&fit=crop',
    startingPrice: 799,
    phone: '+91 91234 56789'
  },
  {
    id: 'sanjay-tudu',
    name: 'Sanjay Tudu',
    category: 'Carpenter',
    rating: 4.6,
    reviewsCount: 64,
    verified: true,
    neighborhood: 'Bistupur',
    experience: 7,
    bio: 'Furniture assembly, cabinet repairs, modular kitchen setups, and door latch fixes.',
    avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&auto=format&fit=crop',
    startingPrice: 399,
    phone: '+91 88775 54433'
  },
  {
    id: 'amrit-water',
    name: 'Amrit Singh (Water Tank Delivery)',
    category: 'Water Tank Delivery',
    rating: 4.9,
    reviewsCount: 198,
    verified: true,
    neighborhood: 'Mango',
    experience: 12,
    bio: 'Reliable drinking & utility water tank delivery across Jamshedpur. Quick tank refilling with high quality ground water.',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop',
    startingPrice: 500,
    phone: '+91 93041 22904'
  },
  {
    id: 'subhash-water',
    name: 'Subhash Mahato (Water Tank Supplies)',
    category: 'Water Tank Delivery',
    rating: 4.7,
    reviewsCount: 112,
    verified: true,
    neighborhood: 'Telco',
    experience: 8,
    bio: 'Emergency water delivery & routine overhead tank refilling with 1000L to 5000L capacity tankers.',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop',
    startingPrice: 650,
    phone: '+91 79031 84651'
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'review-1',
    stars: 5,
    text: '“Booked an electrician through Go Jamshedpur for my new flat in adarsh nagar. came right on time , just need help with a little in increasing repairmen”',
    author: 'Neha Agarwal',
    neighborhood: 'Bistupur, Jamshedpur',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
  },
  {
    id: 'review-2',
    stars: 5,
    text: '“Finally, ek aisa aap jisme local trusted repair wale mill rahe ha! i needed help in Telco Colony at 9 PM. He was there within 40 minutes. Truly local, truly reliable.”',
    author: 'Sumit kumar',
    neighborhood: 'Telco Colony, Jamshedpur',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop',
    isHighlighted: true
  },
  {
    id: 'review-3',
    stars: 5,
    text: '“Used Go Jamshedpur for AC service before summer. Priced fairly, no hidden charges. The invoice came digitally. Something this polished for our city — about time!”',
    author: 'Rekha Mishra',
    neighborhood: 'Mango, Jamshedpur',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop'
  }
];
