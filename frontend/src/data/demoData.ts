export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  location?: string;
  avatar?: string;
  createdAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
  upvotes?: number;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  district?: string;
  city?: string;
  state?: string;
}

export interface SubCategory {
  id: string;
  name: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  subcategories: SubCategory[];
}

export interface Severity {
  id: string;
  name: string;
  level: number; // 1-5 scale
  color: string;
  description: string;
}

export interface Status {
  id: string;
  name: string;
  color: string;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  location: Location;
  author: User;
  category: Category;
  subcategory?: SubCategory;
  severity: Severity;
  status: Status;
  upvotes: number;
  upvotedBy: string[]; // User IDs who upvoted
  comments: Comment[];
  images: string[];
  thumbnails?: string[];
  isGeotagged: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Demo users
export const demoUsers: User[] = [
  {
    id: '1',
    username: 'john_doe',
    fullName: 'John Doe',
    email: 'john@example.com',
    location: 'Mumbai, Maharashtra',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=john',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2', 
    username: 'sarah_wilson',
    fullName: 'Sarah Wilson',
    email: 'sarah@example.com',
    location: 'Delhi, India',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=sarah',
    createdAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    username: 'mike_chen',
    fullName: 'Mike Chen',
    email: 'mike@example.com',
    location: 'Bangalore, Karnataka',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=mike',
    createdAt: new Date('2024-01-03'),
  },
];

// Categories with comprehensive subcategories
export const categories: Category[] = [
  {
    id: 'infrastructure',
    name: 'Infrastructure & Roads',
    icon: '🚧',
    color: '#f97316',
    subcategories: [
      { id: 'potholes', name: 'Potholes', description: 'Road surface damage' },
      { id: 'manholes', name: 'Damaged / missing manhole covers', description: 'Unsafe or missing covers' },
      { id: 'sidewalks', name: 'Broken sidewalks / pavements', description: 'Pedestrian walkway issues' },
      { id: 'construction', name: 'Illegal construction / encroachments', description: 'Unauthorized building activities' },
      { id: 'road-signs', name: 'Road signs or signals missing/damaged', description: 'Traffic infrastructure issues' }
    ]
  },
  {
    id: 'utilities',
    name: 'Utilities & Public Services',
    icon: '💡',
    color: '#eab308',
    subcategories: [
      { id: 'streetlights', name: 'Streetlight not working / flickering', description: 'Street lighting issues' },
      { id: 'electricity', name: 'Electricity pole damage', description: 'Power infrastructure damage' },
      { id: 'water-supply', name: 'Water supply leakage / pipe burst', description: 'Water infrastructure issues' },
      { id: 'sewage', name: 'Open drains / sewage overflow', description: 'Drainage system problems' }
    ]
  },
  {
    id: 'sanitation',
    name: 'Sanitation & Waste',
    icon: '🗑️',
    color: '#16a34a',
    subcategories: [
      { id: 'garbage', name: 'Overflowing garbage bins', description: 'Waste management issues' },
      { id: 'littering', name: 'Littering in public spaces', description: 'Public cleanliness concerns' },
      { id: 'dead-animals', name: 'Dead animal disposal', description: 'Animal carcass removal needed' },
      { id: 'illegal-dumping', name: 'Illegal dumping of waste', description: 'Unauthorized waste disposal' }
    ]
  },
  {
    id: 'environment',
    name: 'Environment & Public Spaces',
    icon: '🌳',
    color: '#059669',
    subcategories: [
      { id: 'fallen-trees', name: 'Fallen trees / branches blocking way', description: 'Tree-related obstructions' },
      { id: 'parks', name: 'Unmaintained parks or gardens', description: 'Public space maintenance' },
      { id: 'equipment', name: 'Broken benches / play equipment', description: 'Public facility repairs needed' },
      { id: 'water-bodies', name: 'Polluted water bodies (lake, river, pond)', description: 'Environmental contamination' }
    ]
  },
  {
    id: 'transport',
    name: 'Transport & Mobility',
    icon: '🚍',
    color: '#dc2626',
    subcategories: [
      { id: 'bus-stops', name: 'Broken or missing bus stops / shelters', description: 'Public transport infrastructure' },
      { id: 'transport-damage', name: 'Damaged public transport infrastructure', description: 'Transit system issues' },
      { id: 'parking', name: 'Illegal parking hotspots', description: 'Parking violations and congestion' },
      { id: 'crossings', name: 'Broken pedestrian crossings / zebra crossings', description: 'Pedestrian safety infrastructure' }
    ]
  },
  {
    id: 'safety',
    name: 'Safety & Law & Order',
    icon: '🏛️',
    color: '#7c2d12',
    subcategories: [
      { id: 'cctv', name: 'Broken CCTV cameras (if installed)', description: 'Security infrastructure damage' },
      { id: 'dark-areas', name: 'Unsafe/dark areas (request for lights)', description: 'Security lighting needed' },
      { id: 'vandalism', name: 'Vandalism / graffiti', description: 'Property damage and defacement' },
      { id: 'hazardous', name: 'Hazardous materials left in public spaces', description: 'Public safety hazards' }
    ]
  },
  {
    id: 'health',
    name: 'Health & Hygiene',
    icon: '🏥',
    color: '#be123c',
    subcategories: [
      { id: 'stagnant-water', name: 'Stagnant water (mosquito breeding)', description: 'Disease prevention concerns' },
      { id: 'toilets', name: 'Public toilet malfunction / unclean', description: 'Sanitation facility issues' },
      { id: 'health-hazards', name: 'Open sewage leading to health hazards', description: 'Public health risks' }
    ]
  },
  {
    id: 'governance',
    name: 'Governance & Community',
    icon: '📢',
    color: '#7c3aed',
    subcategories: [
      { id: 'noise', name: 'Noise complaints (construction, loudspeakers, etc.)', description: 'Noise pollution issues' },
      { id: 'encroachments', name: 'Encroachments on footpaths or public land', description: 'Illegal occupation of public spaces' },
      { id: 'vendors', name: 'Unlicensed vendors causing obstruction', description: 'Street vendor regulation issues' }
    ]
  }
];

// Severity levels
export const severities: Severity[] = [
  {
    id: 'low',
    name: 'Low',
    level: 1,
    color: '#22c55e',
    description: 'Minor issue, can wait for routine maintenance'
  },
  {
    id: 'moderate',
    name: 'Moderate',
    level: 2,
    color: '#84cc16',
    description: 'Noticeable issue, should be addressed within a few weeks'
  },
  {
    id: 'medium',
    name: 'Medium',
    level: 3,
    color: '#f59e0b',
    description: 'Important issue, needs attention within a week'
  },
  {
    id: 'high',
    name: 'High',
    level: 4,
    color: '#f97316',
    description: 'Serious issue, requires prompt action within 2-3 days'
  },
  {
    id: 'critical',
    name: 'Critical',
    level: 5,
    color: '#dc2626',
    description: 'Urgent issue, immediate action required for safety'
  }
];

// Status options
export const statuses: Status[] = [
  { id: 'open', name: 'Open', color: '#3b82f6' },
  { id: 'acknowledged', name: 'Acknowledged', color: '#8b5cf6' },
  { id: 'in-progress', name: 'In Progress', color: '#f59e0b' },
  { id: 'resolved', name: 'Resolved', color: '#22c55e' },
  { id: 'closed', name: 'Closed', color: '#6b7280' },
];

// Demo posts with enhanced structure
export const demoPosts: Post[] = [
  {
    id: '1',
    title: 'Broken Streetlight Creating Safety Hazard',
    description: 'The streetlight at the corner of Main Street and 5th Avenue has been out for over a week. The area becomes completely dark at night, making it dangerous for pedestrians and increasing the risk of accidents. Several residents have complained about feeling unsafe while walking in the evening.',
    location: {
      latitude: 19.0760,
      longitude: 72.8777,
      address: 'Main Street & 5th Avenue, Bandra West',
      district: 'Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra'
    },
    author: demoUsers[0],
    category: categories.find(c => c.id === 'utilities')!,
    subcategory: categories.find(c => c.id === 'utilities')!.subcategories.find(s => s.id === 'streetlights'),
    severity: severities.find(s => s.id === 'high')!,
    status: statuses.find(s => s.id === 'open')!,
    upvotes: 23,
    upvotedBy: ['2', '3'],
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center'],
    thumbnails: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop&crop=center'],
    isGeotagged: true,
    createdAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z'),
    comments: [
      {
        id: '1',
        content: 'I\'ve also noticed this issue. It\'s been making my evening walks unsafe. My elderly neighbors are particularly worried.',
        author: demoUsers[1],
        createdAt: new Date('2024-01-15T14:20:00Z'),
        updatedAt: new Date('2024-01-15T14:20:00Z'),
        upvotes: 5
      },
      {
        id: '2',
        content: 'I\'ll contact the city maintenance department about this. In the meantime, I\'ve reported it to the local police for increased patrolling.',
        author: demoUsers[2],
        createdAt: new Date('2024-01-15T16:45:00Z'),
        updatedAt: new Date('2024-01-15T16:45:00Z'),
        upvotes: 12
      }
    ]
  },
  {
    id: '2',
    title: 'Massive Pothole Damaging Vehicles',
    description: 'There\'s a huge pothole on Oak Street near the elementary school that has been growing larger each day. Multiple vehicles have been damaged, and it\'s becoming increasingly dangerous, especially during monsoon season when it fills with water and becomes invisible to drivers.',
    location: {
      latitude: 28.6139,
      longitude: 77.2090,
      address: 'Oak Street, near DPS School, Connaught Place',
      district: 'Connaught Place',
      city: 'New Delhi',
      state: 'Delhi'
    },
    author: demoUsers[1],
    category: categories.find(c => c.id === 'infrastructure')!,
    subcategory: categories.find(c => c.id === 'infrastructure')!.subcategories.find(s => s.id === 'potholes'),
    severity: severities.find(s => s.id === 'critical')!,
    status: statuses.find(s => s.id === 'in-progress')!,
    upvotes: 45,
    upvotedBy: ['1', '3'],
    images: ['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&crop=center'],
    thumbnails: ['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop&crop=center'],
    isGeotagged: true,
    createdAt: new Date('2024-01-14T09:15:00Z'),
    updatedAt: new Date('2024-01-16T11:00:00Z'),
    comments: [
      {
        id: '3',
        content: 'Update: The municipal corporation has acknowledged the issue and scheduled repairs for next week! They\'ve also placed warning cones around the pothole.',
        author: demoUsers[1],
        createdAt: new Date('2024-01-16T11:00:00Z'),
        updatedAt: new Date('2024-01-16T11:00:00Z'),
        upvotes: 18
      },
      {
        id: '4',
        content: 'My car\'s suspension got damaged because of this pothole. I\'m glad it\'s finally being addressed.',
        author: demoUsers[0],
        createdAt: new Date('2024-01-16T15:30:00Z'),
        updatedAt: new Date('2024-01-16T15:30:00Z'),
        upvotes: 8
      }
    ]
  },
  {
    id: '3',
    title: 'Playground Equipment Vandalized with Graffiti',
    description: 'The playground equipment at Central Park has been extensively vandalized with inappropriate graffiti. The swings, slides, and climbing structures are covered in paint that needs professional cleaning. Some sharp edges have been created that could be dangerous for children.',
    location: {
      latitude: 12.9716,
      longitude: 77.5946,
      address: 'Central Park, Cubbon Road, Bangalore',
      district: 'Cubbon Park Area',
      city: 'Bangalore',
      state: 'Karnataka'
    },
    author: demoUsers[2],
    category: categories.find(c => c.id === 'safety')!,
    subcategory: categories.find(c => c.id === 'safety')!.subcategories.find(s => s.id === 'vandalism'),
    severity: severities.find(s => s.id === 'medium')!,
    status: statuses.find(s => s.id === 'acknowledged')!,
    upvotes: 31,
    upvotedBy: ['1', '2'],
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=600&fit=crop&crop=center'
    ],
    thumbnails: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=200&fit=crop&crop=center'
    ],
    isGeotagged: false,
    createdAt: new Date('2024-01-13T16:45:00Z'),
    updatedAt: new Date('2024-01-13T16:45:00Z'),
    comments: [
      {
        id: '5',
        content: 'This is really disappointing. My kids love playing here. I hope they clean it up soon and maybe install some security cameras.',
        author: demoUsers[0],
        createdAt: new Date('2024-01-14T08:20:00Z'),
        updatedAt: new Date('2024-01-14T08:20:00Z'),
        upvotes: 15
      }
    ]
  },
  {
    id: '4',
    title: 'Overflowing Garbage Bins Attracting Pests',
    description: 'The garbage bins near the market area have been overflowing for days. The waste is spilling onto the streets, creating a foul smell and attracting rats, flies, and stray dogs. This is becoming a serious health hazard for the entire neighborhood.',
    location: {
      latitude: 19.0728,
      longitude: 72.8826,
      address: 'Hill Road Market, Bandra West, Mumbai',
      district: 'Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra'
    },
    author: demoUsers[0],
    category: categories.find(c => c.id === 'sanitation')!,
    subcategory: categories.find(c => c.id === 'sanitation')!.subcategories.find(s => s.id === 'garbage'),
    severity: severities.find(s => s.id === 'high')!,
    status: statuses.find(s => s.id === 'open')!,
    upvotes: 38,
    upvotedBy: ['2', '3'],
    images: ['https://images.unsplash.com/photo-1586803884030-df8dbf5fc86c?w=800&h=600&fit=crop&crop=center'],
    thumbnails: ['https://images.unsplash.com/photo-1586803884030-df8dbf5fc86c?w=300&h=200&fit=crop&crop=center'],
    isGeotagged: true,
    createdAt: new Date('2024-01-12T08:20:00Z'),
    updatedAt: new Date('2024-01-12T08:20:00Z'),
    comments: [
      {
        id: '6',
        content: 'The smell is unbearable, especially in this heat. I\'ve called the municipal helpline multiple times but no response yet.',
        author: demoUsers[2],
        createdAt: new Date('2024-01-12T15:30:00Z'),
        updatedAt: new Date('2024-01-12T15:30:00Z'),
        upvotes: 12
      },
      {
        id: '7',
        content: 'I saw rats near the children\'s play area because of this. This needs immediate attention from the health department.',
        author: demoUsers[1],
        createdAt: new Date('2024-01-13T09:45:00Z'),
        updatedAt: new Date('2024-01-13T09:45:00Z'),
        upvotes: 20
      }
    ]
  }
];

// Helper functions
export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(cat => cat.id === id);
};

export const getSubcategoryById = (categoryId: string, subcategoryId: string): SubCategory | undefined => {
  const category = getCategoryById(categoryId);
  return category?.subcategories.find(sub => sub.id === subcategoryId);
};

export const getSeverityById = (id: string): Severity | undefined => {
  return severities.find(sev => sev.id === id);
};

export const getStatusById = (id: string): Status | undefined => {
  return statuses.find(status => status.id === id);
};

// Default images for categories
export const getDefaultImageForCategory = (categoryId: string): string => {
  const defaultImages: Record<string, string> = {
    'infrastructure': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
    'utilities': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    'sanitation': 'https://images.unsplash.com/photo-1586803884030-df8dbf5fc86c?w=800&h=600&fit=crop',
    'environment': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
    'transport': 'https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?w=800&h=600&fit=crop',
    'safety': 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=600&fit=crop',
    'health': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
    'governance': 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop'
  };
  
  return defaultImages[categoryId] || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop';
};
