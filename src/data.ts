import { MenuItem, TestimonialItem, IngredientLayer } from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'bombay-sandwich',
    name: 'Bombay Sandwich',
    category: 'Sandwich',
    price: 150,
    description: 'The classic street food staple with butter, green chutney, and fresh sliced vegetables.',
    image: '/image copy 17.png',
    badge: 'Classic'
  },
  {
    id: 'veg-cheese-sandwich',
    name: 'Veg Cheese Sandwich',
    category: 'Sandwich',
    price: 130,
    description: 'A comforting blend of fresh vegetables and melted cheese.',
    image: '/image copy 17.png'
  },
  {
    id: 'chocolate-sandwich',
    name: 'Chocolate Sandwich',
    category: 'Sandwich',
    price: 180,
    description: 'A sweet indulgence filled with rich chocolate.',
    image: '/image copy 17.png'
  },
  {
    id: 'veg-cheese-jain',
    name: 'Veg Cheese Jain Sandwich',
    category: 'Jain/Swaminarayan',
    price: 140,
    description: 'Prepared strictly without onion or garlic.',
    image: '/image copy 17.png'
  },
  {
    id: 'bombay-toasted',
    name: 'Bombay Toasted Sandwich',
    category: 'Grill Sandwich',
    price: 150,
    description: 'Our classic Bombay sandwich, perfectly toasted to a golden crisp.',
    image: '/image copy 17.png'
  },
  {
    id: 'samosa-veg-cheese-grill',
    name: 'Samosa Veg Cheese Grill',
    category: 'Grill Sandwich',
    price: 170,
    description: 'Crispy samosa filling pressed with veggies and cheese.',
    image: '/image copy 17.png',
    badge: 'Popular'
  },
  {
    id: 'tandoori-paneer-grill',
    name: 'Tandoori Paneer Grill',
    category: 'Special Grill',
    price: 210,
    description: 'Onion, capsicum, cheese, and spiced tandoori paneer.',
    image: '/image copy 17.png'
  },
  {
    id: 'jalapeno-corn-grill',
    name: 'Jalapeno Corn Grill',
    category: 'Special Grill',
    price: 230,
    description: 'Jalapeno, corn, mayo, and cheese.',
    image: '/image copy 17.png'
  },
  {
    id: 'club-bombay-sandwich',
    name: 'Club Bombay Sandwich',
    category: '3 Layers Jumbo Grill',
    price: 250,
    description: '3 layers of cucumber, tomato, potato, cheese, and mayo.',
    image: '/image copy 17.png',
    badge: 'Jumbo'
  },
  {
    id: 'veg-cheese-paratha',
    name: 'Veg Cheese Paratha',
    category: 'Stuff Bun Paratha',
    price: 180,
    description: 'Soft bun paratha stuffed with fresh veggies and cheese.',
    image: '/image copy 18.png'
  },
  {
    id: 'bites-bombay-special-paratha',
    name: 'Bites Bombay Special Paratha',
    category: 'Stuff Bun Paratha',
    price: 200,
    description: 'Our signature paratha packed with special fillings.',
    image: '/image copy 18.png',
    badge: 'Signature'
  },
  {
    id: 'veg-cheese-pizza',
    name: 'Veg Cheese Pizza',
    category: 'Pizza',
    price: 150,
    description: 'Classic cheese pizza topped with fresh vegetables (6 inch).',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=85'
  },
  {
    id: 'bites-special-pizza',
    name: 'Bites Bombay Special Pizza',
    category: 'Pizza',
    price: 250,
    description: 'Our loaded special pizza with all the premium toppings.',
    image: 'https://images.unsplash.com/photo-1593504049359-74330189a345?auto=format&fit=crop&w=800&q=85',
    badge: 'Special'
  },
  {
    id: 'cheese-creamy-burger',
    name: 'Cheese Creamy Burger',
    category: 'Burger',
    price: 120,
    description: 'A rich and creamy veg burger dripping with cheese.',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=85'
  },
  {
    id: 'cheese-mayo-fries',
    name: 'Cheese Mayo French Fries',
    category: 'French Fries',
    price: 200,
    description: 'Crispy fries generously topped with cheese and mayo.',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=85'
  },
  {
    id: 'veg-cheese-hot-dog',
    name: 'Veg Cheese Hot Dog',
    category: 'Hot Dog',
    price: 120,
    description: 'A classic vegetarian hot dog with melted cheese.',
    image: '/image copy 16.png'
  },
  {
    id: 'paneer-frankie',
    name: 'Paneer Frankie',
    category: 'Frankie',
    price: 150,
    description: 'Spiced paneer wrapped in a warm, flaky flatbread.',
    image: 'https://images.unsplash.com/photo-1626804475297-41609ea0aa8eb?auto=format&fit=crop&w=800&q=85'
  },
  {
    id: 'cheese-garlic-bread',
    name: 'Cheese Garlic Bread',
    category: 'Garlic Bread',
    price: 150,
    description: 'Oven-toasted garlic bread smothered in melted cheese.',
    image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=800&q=85'
  },
  {
    id: 'mix-fruit-juice',
    name: 'Mix Fruit Juice',
    category: 'Juice & Beverages',
    price: 180,
    description: 'Freshly squeezed seasonal mixed fruits.',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=85'
  }
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 1,
    author: "Pratyush Panda",
    reviewsCount: 0,
    followersCount: 56,
    rating: 4,
    type: "DINING",
    date: "Feb 02, 2020",
    highlights: ["POSITIVE", "samosa", "veg cheese", "veg grilled"],
    quote: "Veg cheese sandwich was good, veg grilled sandwich was okayish and samosa sandwich was great. All order came on time except samosa sandwich which took around 20 mins. Suggest this place as it has a proper sitting at the same rates"
  },
  {
    id: 2,
    author: "Kaushal Mehta",
    reviewsCount: 0,
    followersCount: 2428,
    rating: 4,
    type: "DINING",
    date: "Oct 07, 2018",
    quote: "Recently been to Vadodara and wanted to have some quick bites.. Thought to have some sandwiches and selected this outlet for same.. Bombay Sandwich Bites is in business since long and almost every local person would be advocate to same.. Talking about ambience, nothing extra ordinary as it is simple and sober shop serving to the city and service is also pretty decent..."
  }
];

export const INGREDIENT_LAYERS: IngredientLayer[] = [
  {
    id: 'top-bun',
    name: 'Golden Sesame Brioche Bun (Crown)',
    subtext: 'Freshly baked daily with French butter and toasted sesame seeds',
    origin: 'Artisanal Bakery',
    rotation: -4,
    offsetX: -8,
    image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&w=600&q=80',
    alt: 'Toasted sesame brioche top bun'
  },
  {
    id: 'melted-cheese',
    name: 'Aged Wisconsin Sharp Cheddar Melt',
    subtext: '18-month aged cheddar melted to velvety golden perfection',
    origin: 'Wisconsin Dairy',
    rotation: 5,
    offsetX: 12,
    image: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?auto=format&fit=crop&w=600&q=80',
    alt: 'Melted golden cheddar cheese slice'
  },
  {
    id: 'vine-tomatoes',
    name: 'Sun-Ripened Heirloom Tomato Slices',
    subtext: 'Hand-sliced thick juicy vine tomatoes with natural sweetness',
    origin: 'Organic Valley Farms',
    rotation: -3,
    offsetX: -14,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    alt: 'Fresh sliced red heirloom tomatoes'
  },
  {
    id: 'red-onions',
    name: 'Crisp Shaved Purple Onions',
    subtext: 'Lightly macerated in red wine vinegar for bright tang',
    origin: 'Pacific Coast Farms',
    rotation: 6,
    offsetX: 16,
    image: 'https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?auto=format&fit=crop&w=600&q=80',
    alt: 'Crisp purple sliced onion rings'
  },
  {
    id: 'smoked-bacon',
    name: 'Applewood Thick-Cut Smoked Bacon',
    subtext: 'Hardwood smoked for 12 hours and glazed with brown sugar',
    origin: 'Smokehouse Reserve',
    rotation: -5,
    offsetX: -10,
    image: 'https://images.unsplash.com/photo-1528607929212-2636ec44253e?auto=format&fit=crop&w=600&q=80',
    alt: 'Crispy sizzling smoked bacon strips'
  },
  {
    id: 'smash-patty',
    name: 'Prime Grass-Fed Angus Smash Beef',
    subtext: 'Seared on 500°F cast iron for maximum lacy crisp crust & juices',
    origin: 'Black Angus Farms',
    rotation: 3,
    offsetX: 8,
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80',
    alt: 'Grilled prime seared beef patty'
  },
  {
    id: 'crisp-lettuce',
    name: 'Farm-Fresh Crisp Green Leaf Lettuce',
    subtext: 'Crisp, hydro-cooled ruffled green leaf harvested each morning',
    origin: 'Hydroponic Greens',
    rotation: -4,
    offsetX: -6,
    image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=600&q=80',
    alt: 'Fresh green leaf lettuce'
  },
  {
    id: 'bottom-bun',
    name: 'Toasted Brioche Base (Heel)',
    subtext: 'Griddle-toasted in clarified garlic butter to seal every drop of flavor',
    origin: 'Artisanal Bakery',
    rotation: 2,
    offsetX: 4,
    image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&w=600&q=80',
    alt: 'Toasted brioche bottom bun'
  }
];
