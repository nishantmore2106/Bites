export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  badge?: string;
  calories?: string;
}

export interface TestimonialItem {
  id: number;
  quote: string;
  author: string;
  rating: number;
  reviewsCount?: number;
  followersCount?: number;
  type?: string;
  date?: string;
  highlights?: string[];
  role?: string;
  image?: string;
  location?: string;
}

export interface IngredientLayer {
  id: string;
  name: string;
  subtext: string;
  origin: string;
  rotation: number;
  offsetX: number;
  image: string;
  alt: string;
}
