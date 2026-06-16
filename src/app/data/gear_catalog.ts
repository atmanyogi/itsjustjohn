export interface GearProduct {
  id: string;
  title: string;
  type: 'gear';
  price: number;
  description: string;
  images: string[];
  options: {
    sizes: string[];
    colors: string[];
  };
}

export const GEAR_CATALOG: GearProduct[] = [
  {
    id: 'sentient-tee-001',
    title: 'Sentient Tee',
    type: 'gear',
    price: 20.00,
    description: 'Premium organic cotton tee featuring the signature Sentient branding. Soft, breathable, and built for creators.',
    images: ['/teejar.png'],
    options: {
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      colors: ['Black', 'White', 'Charcoal']
    }
  },
  {
    id: 'cloud-hoodie-001',
    title: 'Cloud Hoodie',
    type: 'gear',
    price: 40.00,
    description: 'Heavyweight fleece hoodie designed for deep work sessions and late night coding. Maximum comfort.',
    images: ['/teejar.png'],
    options: {
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'Navy', 'Heather Grey']
    }
  }
];
