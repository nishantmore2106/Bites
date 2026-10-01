import { MenuItem, TestimonialItem, IngredientLayer } from './types';

const sandwichImage = '/image copy 17.png';
const parathaImage = '/image copy 18.png';
const hotDogImage = '/image copy 16.png';

export const MENU_ITEMS: MenuItem[] = [

  // =========================================================
  // 1–10
  // =========================================================

  {
    id: 'aloo-mutter-special-grill',
    name: 'Aloo Mutter — Special Grill',
    category: 'Special Grill',
    price: 180,
    priceLabel: '₹180',
    description: 'A flavorful grill prepared with spiced aloo and mutter, toasted with our signature filling.',
    image: sandwichImage,
    badge: 'Special',
  },

  {
    id: 'aloo-mutter-3-layer-jumbo-grill',
    name: 'Aloo Mutter — 3 Layers Jumbo Grill',
    category: '3 Layers Jumbo Grill',
    price: 230,
    priceLabel: '₹230',
    description: 'A generous three-layer jumbo grill packed with spicy aloo and mutter filling.',
    image: sandwichImage,
    badge: 'Jumbo',
  },

  {
    id: 'apple-juice',
    name: 'Apple Juice',
    category: 'Juice',
    price: 180,
    priceLabel: '₹180',
    description: 'Refreshing apple juice with a naturally fruity and smooth taste.',
    image: sandwichImage,
  },

  {
    id: 'bites-bombay-special-paratha',
    name: 'Bites Bombay Special Paratha',
    category: 'Stuff Bun Paratha',
    price: 200,
    priceLabel: '₹200',
    description: 'Our signature stuffed paratha prepared with a special Bites Bombay filling.',
    image: parathaImage,
    badge: 'Signature',
  },

  {
    id: 'bites-bombay-special-pizza',
    name: 'Bites Bombay Special Pizza',
    category: 'Pizza',
    price: 250,
    priceLabel: '₹250 / ₹300',
    description: 'Loaded Bombay-style special pizza with a generous combination of flavorful toppings.',
    image: sandwichImage,
    badge: 'Special',
  },

  {
    id: 'bites-special-burger',
    name: 'Bites Special Burger',
    category: 'Burger',
    price: 150,
    priceLabel: '₹150',
    description: 'Our special Bites burger layered with a flavorful patty, sauces and fresh toppings.',
    image: sandwichImage,
    badge: 'Special',
  },

  {
    id: 'bites-special-frankie',
    name: 'Bites Special Frankie',
    category: 'Frankie',
    price: 170,
    priceLabel: '₹170',
    description: 'A flavorful Frankie roll filled with our special Bites-style stuffing and sauces.',
    image: sandwichImage,
    badge: 'Special',
  },

  {
    id: 'bites-special-hot-dog',
    name: 'Bites Special Hot Dog',
    category: 'Hot Dog',
    price: 170,
    priceLabel: '₹170',
    description: 'A loaded vegetarian hot dog finished with our special sauces and toppings.',
    image: hotDogImage,
    badge: 'Special',
  },

  {
    id: 'bites-special-khulcha',
    name: 'Bites Special Khulcha',
    category: 'Stuff Grill Khulcha',
    price: 220,
    priceLabel: '₹220',
    description: 'A rich stuffed khulcha prepared with the signature Bites Bombay filling.',
    image: parathaImage,
    badge: 'Special',
  },

  {
    id: 'bites-special-3-layer-jumbo-grill',
    name: 'Bites Special — 3 Layers Jumbo Grill',
    category: '3 Layers Jumbo Grill',
    price: 350,
    priceLabel: '₹350',
    description: 'A massive three-layer jumbo grill loaded with the signature Bites special filling.',
    image: sandwichImage,
    badge: 'Jumbo',
  },

  // =========================================================
  // 11–20
  // =========================================================

  {
    id: 'black-grapes',
    name: 'Black Grapes',
    category: 'Juice',
    price: 150,
    priceLabel: '₹150',
    description: 'A refreshing black grape beverage with a rich fruity flavor.',
    image: sandwichImage,
  },

  {
    id: 'bombay-sandwich',
    name: 'Bombay Sandwich',
    category: 'Sandwich',
    price: 150,
    priceLabel: '₹150',
    description: 'The classic Bombay street-style sandwich prepared with vegetables, chutney and butter.',
    image: sandwichImage,
    badge: 'Classic',
  },

  {
    id: 'bombay-toasted-sandwich',
    name: 'Bombay Toasted Sandwich',
    category: 'Grill Sandwich',
    price: 150,
    priceLabel: '₹150',
    description: 'The classic Bombay sandwich toasted until golden and crisp.',
    image: sandwichImage,
  },

  {
    id: 'bread-butter',
    name: 'Bread Butter',
    category: 'Extras',
    price: 120,
    priceLabel: '₹120',
    description: 'Simple toasted bread served with a generous layer of butter.',
    image: sandwichImage,
  },

  {
    id: 'bread-butter-jam',
    name: 'Bread Butter Jam',
    category: 'Extras',
    price: 120,
    priceLabel: '₹120',
    description: 'Classic bread paired with creamy butter and sweet jam.',
    image: sandwichImage,
  },

  {
    id: 'bread-butter-toasted',
    name: 'Bread Butter Toasted',
    category: 'Grill Sandwich',
    price: 140,
    priceLabel: '₹140',
    description: 'Crispy toasted bread generously spread with butter.',
    image: sandwichImage,
  },

  {
    id: 'brown-bread-extra',
    name: 'Brown Bread Extra',
    category: 'Extras',
    price: 20,
    priceLabel: '₹20',
    description: 'Extra brown bread added to your order.',
    image: sandwichImage,
  },

  {
    id: 'cheese',
    name: 'Cheese',
    category: 'Extras',
    price: 40,
    priceLabel: '₹40',
    description: 'Extra cheese portion for adding a rich cheesy finish to your meal.',
    image: sandwichImage,
  },

  {
    id: 'cheese-and-corn-pizza',
    name: 'Cheese And Corn Pizza',
    category: 'Pizza',
    price: 200,
    priceLabel: '₹200 / ₹230',
    description: 'Cheesy pizza topped with sweet corn for a creamy and flavorful bite.',
    image: sandwichImage,
  },

  {
    id: 'cheese-chilli-corn',
    name: 'Cheese Chilli Corn',
    category: 'Special Grill',
    price: 200,
    priceLabel: '₹200',
    description: 'A delicious combination of creamy cheese, corn and spicy chilli.',
    image: sandwichImage,
  },

  // =========================================================
  // 21–30
  // =========================================================

  {
    id: 'cheese-chilli-garlic-bread',
    name: 'Cheese Chilli Garlic Bread',
    category: 'Garlic Bread',
    price: 170,
    priceLabel: '₹170',
    description: 'Garlic bread topped with melted cheese and a spicy chilli kick.',
    image: sandwichImage,
  },

  {
    id: 'cheese-chilli-grill',
    name: 'Cheese Chilli Grill',
    category: 'Grill Sandwich',
    price: 200,
    priceLabel: '₹200',
    description: 'A grilled sandwich loaded with cheese and spicy chilli flavors.',
    image: sandwichImage,
  },

  {
    id: 'cheese-chutni-grill',
    name: 'Cheese Chutni Grill',
    category: 'Grill Sandwich',
    price: 190,
    priceLabel: '₹190',
    description: 'Grilled sandwich combining creamy cheese with fresh green chutney.',
    image: sandwichImage,
  },

  {
    id: 'cheese-chutni-paratha',
    name: 'Cheese Chutni Paratha',
    category: 'Stuff Bun Paratha',
    price: 180,
    priceLabel: '₹180',
    description: 'Stuffed paratha combining melted cheese and flavorful chutney.',
    image: parathaImage,
  },

  {
    id: 'cheese-chutni-sandwich',
    name: 'Cheese Chutni Sandwich',
    category: 'Sandwich',
    price: 170,
    priceLabel: '₹170',
    description: 'Classic sandwich filled with creamy cheese and fresh chutney.',
    image: sandwichImage,
  },

  {
    id: 'cheese-creamy-burger',
    name: 'Cheese Creamy Burger',
    category: 'Burger',
    price: 120,
    priceLabel: '₹120',
    description: 'A creamy vegetarian burger finished with melted cheese and rich sauces.',
    image: sandwichImage,
  },

  {
    id: 'cheese-french-fries',
    name: 'Cheese French Fries',
    category: 'French Fries',
    price: 200,
    priceLabel: '₹200',
    description: 'Crispy French fries generously topped with creamy melted cheese.',
    image: sandwichImage,
  },

  {
    id: 'cheese-garlic-bread',
    name: 'Cheese Garlic Bread',
    category: 'Garlic Bread',
    price: 150,
    priceLabel: '₹150',
    description: 'Oven-toasted garlic bread covered with melted cheese.',
    image: sandwichImage,
  },

  {
    id: 'cheese-jam-grill',
    name: 'Cheese Jam Grill',
    category: 'Grill Sandwich',
    price: 190,
    priceLabel: '₹190',
    description: 'A unique grilled combination of creamy cheese and sweet jam.',
    image: sandwichImage,
  },

  {
    id: 'cheese-jam-sandwich',
    name: 'Cheese Jam Sandwich',
    category: 'Sandwich',
    price: 170,
    priceLabel: '₹170',
    description: 'A sweet and creamy sandwich pairing cheese with jam.',
    image: sandwichImage,
  },

  // =========================================================
  // 31–40
  // =========================================================

  {
    id: 'cheese-mayo-french-fries',
    name: 'Cheese Mayo French Fries',
    category: 'French Fries',
    price: 200,
    priceLabel: '₹200',
    description: 'Crispy fries topped with creamy mayonnaise and melted cheese.',
    image: sandwichImage,
  },

  {
    id: 'cheese-paneer-tandoori-burger',
    name: 'Cheese Paneer Tandoori Burger',
    category: 'Burger',
    price: 140,
    priceLabel: '₹140',
    description: 'A vegetarian burger featuring paneer, tandoori flavors and melted cheese.',
    image: sandwichImage,
  },

  {
    id: 'cheese-roll',
    name: 'Cheese Roll',
    category: 'Extras',
    price: 150,
    priceLabel: '₹150',
    description: 'A warm roll filled with rich and creamy cheese.',
    image: sandwichImage,
  },

  {
    id: 'cheese-tomato-khulcha',
    name: 'Cheese Tomato Khulcha',
    category: 'Stuff Grill Khulcha',
    price: 140,
    priceLabel: '₹140',
    description: 'Stuffed khulcha combining tangy tomato with melted cheese.',
    image: parathaImage,
  },

  {
    id: 'cheese-wafer',
    name: 'Cheese Wafer',
    category: 'Extras',
    price: 180,
    priceLabel: '₹180',
    description: 'Crispy wafer served with a rich cheesy accompaniment.',
    image: sandwichImage,
  },

  {
    id: 'chatni-butter',
    name: 'Chatni Butter',
    category: 'Extras',
    price: 120,
    priceLabel: '₹120',
    description: 'A simple combination of butter and flavorful green chutney.',
    image: sandwichImage,
  },

  {
    id: 'chatni-butter-toasted',
    name: 'Chatni Butter Toasted',
    category: 'Grill Sandwich',
    price: 140,
    priceLabel: '₹140',
    description: 'Toasted bread layered with butter and flavorful chutney.',
    image: sandwichImage,
  },

  {
    id: 'chatpata-paratha',
    name: 'Chatpata Paratha',
    category: 'Stuff Bun Paratha',
    price: 180,
    priceLabel: '₹180',
    description: 'A spicy and flavorful stuffed paratha with a chatpata twist.',
    image: parathaImage,
  },

  {
    id: 'chilli-cheese-burger',
    name: 'Chilli Cheese Burger',
    category: 'Burger',
    price: 120,
    priceLabel: '₹120',
    description: 'Vegetarian burger with creamy cheese and a spicy chilli kick.',
    image: sandwichImage,
  },

  {
    id: 'chilli-cheese-frankie',
    name: 'Chilli Cheese Frankie',
    category: 'Frankie',
    price: 120,
    priceLabel: '₹120',
    description: 'A warm Frankie roll filled with spicy chilli and melted cheese.',
    image: sandwichImage,
  },

  // =========================================================
  // 41–50
  // =========================================================

  {
    id: 'chilli-cheese-grill-jumbo',
    name: 'Chilli Cheese Grill — Jumbo',
    category: '3 Layers Jumbo Grill',
    price: 250,
    priceLabel: '₹250',
    description: 'A jumbo grilled sandwich loaded with spicy chilli and creamy cheese.',
    image: sandwichImage,
    badge: 'Jumbo',
  },

  {
    id: 'chilli-veg-hot-dog',
    name: 'Chilli Veg Hot Dog',
    category: 'Hot Dog',
    price: 100,
    priceLabel: '₹100',
    description: 'Vegetarian hot dog with a flavorful spicy chilli filling.',
    image: hotDogImage,
  },

  {
    id: 'chocolate-cheese-paratha',
    name: 'Chocolate Cheese Paratha',
    category: 'Stuff Bun Paratha',
    price: 180,
    priceLabel: '₹180',
    description: 'A sweet and indulgent paratha combining chocolate and creamy cheese.',
    image: parathaImage,
  },

  {
    id: 'chocolate-grill-sandwich',
    name: 'Chocolate Grill Sandwich',
    category: 'Grill Sandwich',
    price: 190,
    priceLabel: '₹190',
    description: 'A warm grilled sandwich filled with rich chocolate.',
    image: sandwichImage,
  },

  {
    id: 'chocolate-sandwich',
    name: 'Chocolate Sandwich',
    category: 'Sandwich',
    price: 180,
    priceLabel: '₹180',
    description: 'A sweet sandwich filled with rich and indulgent chocolate.',
    image: sandwichImage,
  },

  {
    id: 'club-bombay-sandwich-3-layer',
    name: 'Club Bombay Sandwich — 3 Layer',
    category: '3 Layers Jumbo Grill',
    price: 250,
    priceLabel: '₹250',
    description: 'A three-layer Bombay-style sandwich packed with classic flavorful fillings.',
    image: sandwichImage,
    badge: '3 Layer',
  },

  {
    id: 'club-bombay-sandwich-jumbo',
    name: 'Club Bombay Sandwich — Jumbo',
    category: '3 Layers Jumbo Grill',
    price: 300,
    priceLabel: '₹300',
    description: 'A generous jumbo Club Bombay sandwich with multiple layers of filling.',
    image: sandwichImage,
    badge: 'Jumbo',
  },

  {
    id: 'cold-drinks',
    name: 'Cold Drinks',
    category: 'Beverages',
    price: 0,
    priceLabel: '—',
    description: 'Refreshing chilled soft drinks. Please check availability and current pricing.',
    image: sandwichImage,
  },

  {
    id: 'corn-cheese-hot-dog',
    name: 'Corn Cheese Hot Dog',
    category: 'Hot Dog',
    price: 130,
    priceLabel: '₹130',
    description: 'Vegetarian hot dog filled with sweet corn and creamy cheese.',
    image: hotDogImage,
  },

  {
    id: 'extra-dips',
    name: 'Extra Dips',
    category: 'Extras',
    price: 20,
    priceLabel: '₹20',
    description: 'Extra dip portion to pair with your favourite Bites items.',
    image: sandwichImage,
  },

  // =========================================================
  // 51–60
  // =========================================================

  {
    id: 'extra-wafer',
    name: 'Extra Wafer',
    category: 'Extras',
    price: 50,
    priceLabel: '₹50',
    description: 'Extra crispy wafer portion.',
    image: sandwichImage,
  },

  {
    id: 'french-fries',
    name: 'French Fries',
    category: 'French Fries',
    price: 150,
    priceLabel: '₹150',
    description: 'Crispy golden French fries served hot and fresh.',
    image: sandwichImage,
  },

  {
    id: 'fresh-sweet-lime',
    name: 'Fresh Sweet Lime',
    category: 'Juice',
    price: 130,
    priceLabel: '₹130',
    description: 'Refreshing sweet lime beverage prepared for a fresh citrus taste.',
    image: sandwichImage,
  },

  {
    id: 'ganna-jamuna',
    name: 'Ganna-Jamuna',
    category: 'Juice',
    price: 150,
    priceLabel: '₹150',
    description: 'A refreshing traditional-style fruit and sugarcane beverage.',
    image: sandwichImage,
  },

  {
    id: 'grill-sandwich',
    name: 'Grill Sandwich',
    category: 'Grill Sandwich',
    price: 150,
    priceLabel: '₹150',
    description: 'A classic toasted and grilled sandwich with a crisp golden finish.',
    image: sandwichImage,
  },

  {
    id: 'guava-juice',
    name: 'Guava Juice',
    category: 'Juice',
    price: 180,
    priceLabel: '₹180',
    description: 'Fruity guava beverage with a refreshing tropical taste.',
    image: sandwichImage,
  },

  {
    id: 'hot-spicy-margherita-pizza',
    name: 'Hot & Spicy Margherita Pizza',
    category: 'Pizza',
    price: 200,
    priceLabel: '₹200 / ₹250',
    description: 'A spicy take on the classic Margherita pizza with a flavorful kick.',
    image: sandwichImage,
    badge: 'Spicy',
  },

  {
    id: 'italian-cheese-burger',
    name: 'Italian Cheese Burger',
    category: 'Burger',
    price: 120,
    priceLabel: '₹120',
    description: 'Vegetarian burger with Italian-inspired flavors and melted cheese.',
    image: sandwichImage,
  },

  {
    id: 'italian-cheese-frankie',
    name: 'Italian Cheese Frankie',
    category: 'Frankie',
    price: 120,
    priceLabel: '₹120',
    description: 'Frankie roll combining Italian-style seasoning with creamy cheese.',
    image: sandwichImage,
  },

  {
    id: 'italian-cheese-pizza',
    name: 'Italian Cheese Pizza',
    category: 'Pizza',
    price: 220,
    priceLabel: '₹220 / ₹270',
    description: 'Cheesy pizza inspired by Italian flavours and classic toppings.',
    image: sandwichImage,
  },

  // =========================================================
  // 61–70
  // =========================================================

  {
    id: 'jalapeno-corn',
    name: 'Jalapeno Corn',
    category: 'Special Grill',
    price: 230,
    priceLabel: '₹230',
    description: 'A flavorful combination of spicy jalapeno and sweet corn with creamy richness.',
    image: sandwichImage,
  },

  {
    id: 'jalapeno-corn-grill-jumbo',
    name: 'Jalapeno Corn Grill — Jumbo',
    category: '3 Layers Jumbo Grill',
    price: 250,
    priceLabel: '₹250',
    description: 'A jumbo grilled sandwich packed with jalapeno, corn and creamy filling.',
    image: sandwichImage,
    badge: 'Jumbo',
  },

  {
    id: 'jain-veg-cheese-sandwich',
    name: 'Jain Veg Cheese Sandwich',
    category: 'Jain / Swaminarayan',
    price: 140,
    priceLabel: '₹140',
    description: 'Vegetarian cheese sandwich prepared in a Jain-friendly style.',
    image: sandwichImage,
    badge: 'Jain',
  },

  {
    id: 'jain-veg-sandwich',
    name: 'Jain Veg Sandwich',
    category: 'Jain / Swaminarayan',
    price: 120,
    priceLabel: '₹120',
    description: 'A Jain-friendly vegetarian sandwich prepared with suitable ingredients.',
    image: sandwichImage,
    badge: 'Jain',
  },

  {
    id: 'jam-butter-toasted',
    name: 'Jam Butter Toasted',
    category: 'Grill Sandwich',
    price: 140,
    priceLabel: '₹140',
    description: 'Toasted bread layered with sweet jam and creamy butter.',
    image: sandwichImage,
  },

  {
    id: 'kolhapuri-cheese-grill-jumbo',
    name: 'Kolhapuri Cheese Grill — Jumbo',
    category: '3 Layers Jumbo Grill',
    price: 250,
    priceLabel: '₹250',
    description: 'A jumbo grilled sandwich combining spicy Kolhapuri flavours with cheese.',
    image: sandwichImage,
    badge: 'Jumbo',
  },

  {
    id: 'kolhapuri-grill',
    name: 'Kolhapuri Grill',
    category: 'Grill Sandwich',
    price: 210,
    priceLabel: '₹210',
    description: 'A grilled sandwich featuring bold and spicy Kolhapuri flavours.',
    image: sandwichImage,
  },

  {
    id: 'margarita-pizza',
    name: 'Margarita Pizza',
    category: 'Pizza',
    price: 200,
    priceLabel: '₹200 / ₹250',
    description: 'A classic cheesy Margherita-style pizza with a simple, comforting flavour.',
    image: sandwichImage,
  },

  {
    id: 'mayo',
    name: 'Mayo',
    category: 'Extras',
    price: 20,
    priceLabel: '₹20',
    description: 'Extra creamy mayonnaise portion.',
    image: sandwichImage,
  },

  {
    id: 'mayo-cheese-chatni-hot-dog',
    name: 'Mayo Cheese Chatni Hot Dog',
    category: 'Hot Dog',
    price: 150,
    priceLabel: '₹150',
    description: 'Vegetarian hot dog layered with mayo, cheese and flavorful chutney.',
    image: hotDogImage,
  },

  // =========================================================
  // 71–80
  // =========================================================

  {
    id: 'mayo-french-fries',
    name: 'Mayo French Fries',
    category: 'French Fries',
    price: 170,
    priceLabel: '₹170',
    description: 'Crispy fries topped generously with creamy mayonnaise.',
    image: sandwichImage,
  },

  {
    id: 'mayo-grill',
    name: 'Mayo Grill',
    category: 'Grill Sandwich',
    price: 200,
    priceLabel: '₹200',
    description: 'A creamy grilled sandwich featuring rich mayonnaise and signature fillings.',
    image: sandwichImage,
  },

  {
    id: 'mexican-cheese-pizza',
    name: 'Mexican Cheese Pizza',
    category: 'Pizza',
    price: 220,
    priceLabel: '₹220 / ₹270',
    description: 'Cheesy pizza inspired by Mexican flavours with a bold and spicy profile.',
    image: sandwichImage,
  },

  {
    id: 'mix-fruit-juice',
    name: 'Mix Fruit Juice',
    category: 'Juice',
    price: 180,
    priceLabel: '₹180',
    description: 'A refreshing mixed-fruit beverage combining fruity seasonal flavours.',
    image: sandwichImage,
  },

  {
    id: 'mushroom-cheese-khulcha',
    name: 'Mushroom Cheese Khulcha',
    category: 'Stuff Grill Khulcha',
    price: 180,
    priceLabel: '₹180',
    description: 'Stuffed khulcha filled with mushrooms and creamy cheese.',
    image: parathaImage,
  },

  {
    id: 'mushroom-mayo-grill',
    name: 'Mushroom Mayo Grill',
    category: 'Grill Sandwich',
    price: 230,
    priceLabel: '₹230',
    description: 'A rich grilled sandwich combining mushrooms with creamy mayonnaise.',
    image: sandwichImage,
  },

  {
    id: 'mushroom-paratha',
    name: 'Mushroom Paratha',
    category: 'Stuff Bun Paratha',
    price: 180,
    priceLabel: '₹180',
    description: 'Stuffed paratha filled with savory mushroom filling.',
    image: parathaImage,
  },

  {
    id: 'orange-juice',
    name: 'Orange Juice',
    category: 'Juice',
    price: 130,
    priceLabel: '₹130',
    description: 'Refreshing citrus orange beverage with a bright fruity taste.',
    image: sandwichImage,
  },

  {
    id: 'paneer-chatpata-pizza',
    name: 'Paneer Chatpata Pizza',
    category: 'Pizza',
    price: 230,
    priceLabel: '₹230 / ₹280',
    description: 'Pizza topped with paneer and bold chatpata flavours.',
    image: sandwichImage,
    badge: 'Popular',
  },

  {
    id: 'paneer-frankie',
    name: 'Paneer Frankie',
    category: 'Frankie',
    price: 150,
    priceLabel: '₹150',
    description: 'Spiced paneer wrapped inside a warm Frankie roll.',
    image: sandwichImage,
  },

  // =========================================================
  // 81–90
  // =========================================================

  {
    id: 'paneer-masala-grill-sandwich',
    name: 'Paneer Masala Grill Sandwich',
    category: 'Grill Sandwich',
    price: 210,
    priceLabel: '₹210',
    description: 'Grilled sandwich packed with spiced paneer masala filling.',
    image: sandwichImage,
  },

  {
    id: 'paneer-mushroom-mayo-grill-3-layer',
    name: 'Paneer Mushroom Mayo Grill — 3 Layers',
    category: '3 Layers Jumbo Grill',
    price: 280,
    priceLabel: '₹280',
    description: 'Three layers of grilled sandwich packed with paneer, mushroom and creamy mayo.',
    image: sandwichImage,
    badge: '3 Layer',
  },

  {
    id: 'paneer-pudina-grill',
    name: 'Paneer Pudina Grill',
    category: 'Grill Sandwich',
    price: 200,
    priceLabel: '₹200',
    description: 'Grilled sandwich combining paneer with refreshing mint flavours.',
    image: sandwichImage,
  },

  {
    id: 'paneer-pudina-khulcha',
    name: 'Paneer Pudina Khulcha',
    category: 'Stuff Grill Khulcha',
    price: 150,
    priceLabel: '₹150',
    description: 'Stuffed khulcha filled with paneer and refreshing pudina flavours.',
    image: parathaImage,
  },

  {
    id: 'paneer-stuff-burger',
    name: 'Paneer Stuff Burger',
    category: 'Burger',
    price: 130,
    priceLabel: '₹130',
    description: 'A vegetarian burger generously stuffed with flavorful paneer filling.',
    image: sandwichImage,
  },

  {
    id: 'paneer-tandoori-cheese-garlic-bread',
    name: 'Paneer Tandoori Cheese Garlic Bread',
    category: 'Garlic Bread',
    price: 190,
    priceLabel: '₹190',
    description: 'Garlic bread loaded with tandoori paneer and melted cheese.',
    image: sandwichImage,
  },

  {
    id: 'paneer-tandoori-frankie',
    name: 'Paneer Tandoori Frankie',
    category: 'Frankie',
    price: 150,
    priceLabel: '₹150',
    description: 'Tandoori-style paneer wrapped inside a warm and flavorful Frankie.',
    image: sandwichImage,
  },

  {
    id: 'paneer-mushroom-thy-grill-jumbo',
    name: 'Paneer Mushroom Thy Grill — Jumbo',
    category: '3 Layers Jumbo Grill',
    price: 250,
    priceLabel: '₹250',
    description: 'A jumbo grill packed with paneer, mushroom and flavorful seasoning.',
    image: sandwichImage,
    badge: 'Jumbo',
  },

  {
    id: 'peri-peri-cheese-frankie',
    name: 'Peri Peri Cheese Frankie',
    category: 'Frankie',
    price: 140,
    priceLabel: '₹140',
    description: 'Frankie roll combining creamy cheese with bold peri peri seasoning.',
    image: sandwichImage,
  },

  {
    id: 'peri-peri-french-fries',
    name: 'Peri Peri French Fries',
    category: 'French Fries',
    price: 200,
    priceLabel: '₹200',
    description: 'Crispy French fries tossed with bold and spicy peri peri seasoning.',
    image: sandwichImage,
  },

  // =========================================================
  // 91–100
  // =========================================================

  {
    id: 'pineapple-juice',
    name: 'Pineapple Juice',
    category: 'Juice',
    price: 130,
    priceLabel: '₹130',
    description: 'Refreshing pineapple beverage with a naturally tropical flavour.',
    image: sandwichImage,
  },

  {
    id: 'plain-cheese-grill-sandwich',
    name: 'Plain Cheese Grill Sandwich',
    category: 'Grill Sandwich',
    price: 190,
    priceLabel: '₹190',
    description: 'A simple grilled sandwich generously filled with melted cheese.',
    image: sandwichImage,
  },

  {
    id: 'plain-cheese-paratha',
    name: 'Plain Cheese Paratha',
    category: 'Stuff Bun Paratha',
    price: 180,
    priceLabel: '₹180',
    description: 'Warm stuffed paratha filled with creamy melted cheese.',
    image: parathaImage,
  },

  {
    id: 'plain-cheese-sandwich',
    name: 'Plain Cheese Sandwich',
    category: 'Sandwich',
    price: 170,
    priceLabel: '₹170',
    description: 'A simple and satisfying sandwich filled with melted cheese.',
    image: sandwichImage,
  },

  {
    id: 'samosa-veg-cheese-grill-sandwich',
    name: 'Samosa Veg Cheese Grill Sandwich',
    category: 'Grill Sandwich',
    price: 170,
    priceLabel: '₹170',
    description: 'A grilled sandwich combining samosa-style vegetable filling with cheese.',
    image: sandwichImage,
  },

  {
    id: 'samosa-veg-cheese-sandwich',
    name: 'Samosa Veg Cheese Sandwich',
    category: 'Sandwich',
    price: 140,
    priceLabel: '₹140',
    description: 'Vegetable samosa filling paired with creamy cheese inside a sandwich.',
    image: sandwichImage,
  },

  {
    id: 'samosa-veg-grill-sandwich',
    name: 'Samosa Veg Grill Sandwich',
    category: 'Grill Sandwich',
    price: 150,
    priceLabel: '₹150',
    description: 'Classic samosa-inspired vegetable filling served in a toasted grill sandwich.',
    image: sandwichImage,
  },

  {
    id: 'samosa-veg-sandwich',
    name: 'Samosa Veg Sandwich',
    category: 'Sandwich',
    price: 120,
    priceLabel: '₹120',
    description: 'A sandwich filled with flavorful samosa-style vegetable filling.',
    image: sandwichImage,
  },

  {
    id: 'special-mayo-grill-jumbo',
    name: 'Special Mayo Grill — Jumbo',
    category: '3 Layers Jumbo Grill',
    price: 250,
    priceLabel: '₹250',
    description: 'A jumbo grilled sandwich loaded with creamy mayo and signature fillings.',
    image: sandwichImage,
    badge: 'Jumbo',
  },

  {
    id: 'tandoori',
    name: 'Tandoori',
    category: 'Extras',
    price: 30,
    priceLabel: '₹30',
    description: 'Tandoori-style sauce or seasoning portion.',
    image: sandwichImage,
  },

  // =========================================================
  // 101–110
  // =========================================================

  {
    id: 'tandoori-cheese-hot-dog',
    name: 'Tandoori Cheese Hot Dog',
    category: 'Hot Dog',
    price: 150,
    priceLabel: '₹150',
    description: 'Vegetarian hot dog combining tandoori flavours with creamy melted cheese.',
    image: hotDogImage,
  },

  {
    id: 'tandoori-cheese-khulcha',
    name: 'Tandoori Cheese Khulcha',
    category: 'Stuff Grill Khulcha',
    price: 200,
    priceLabel: '₹200',
    description: 'Stuffed khulcha featuring bold tandoori seasoning and melted cheese.',
    image: parathaImage,
  },

  {
    id: 'tandoori-paneer-grill',
    name: 'Tandoori Paneer Grill',
    category: 'Special Grill',
    price: 210,
    priceLabel: '₹210',
    description: 'Grilled sandwich packed with flavorful tandoori paneer.',
    image: sandwichImage,
    badge: 'Special',
  },

  {
    id: 'tandoori-paneer-grill-jumbo',
    name: 'Tandoori Paneer Grill — Jumbo',
    category: '3 Layers Jumbo Grill',
    price: 300,
    priceLabel: '₹300',
    description: 'A jumbo grilled sandwich loaded with tandoori paneer and rich flavours.',
    image: sandwichImage,
    badge: 'Jumbo',
  },

  {
    id: 'tandoori-paneer-paratha',
    name: 'Tandoori Paneer Paratha',
    category: 'Stuff Bun Paratha',
    price: 200,
    priceLabel: '₹200',
    description: 'Stuffed paratha filled with flavorful tandoori paneer.',
    image: parathaImage,
  },

  {
    id: 'tandoori-paneer-pizza',
    name: 'Tandoori Paneer Pizza',
    category: 'Pizza',
    price: 230,
    priceLabel: '₹230 / ₹280',
    description: 'Pizza topped with flavorful tandoori paneer and cheesy goodness.',
    image: sandwichImage,
  },

  {
    id: 'tandoori-paneer-frankie',
    name: 'Tandoori Paneer Frankie',
    category: 'Frankie',
    price: 150,
    priceLabel: '₹150',
    description: 'Tandoori paneer wrapped in a warm Frankie roll with flavorful sauces.',
    image: sandwichImage,
  },

  {
    id: 'tandoori-veg-hot-dog',
    name: 'Tandoori Veg Hot Dog',
    category: 'Hot Dog',
    price: 120,
    priceLabel: '₹120',
    description: 'Vegetarian hot dog filled with bold tandoori-style flavours.',
    image: hotDogImage,
  },

  {
    id: 'thousand',
    name: 'Thousand',
    category: 'Extras',
    price: 30,
    priceLabel: '₹30',
    description: 'Thousand Island-style sauce portion.',
    image: sandwichImage,
  },

  {
    id: 'veg-burger',
    name: 'Veg Burger',
    category: 'Burger',
    price: 100,
    priceLabel: '₹100',
    description: 'Classic vegetarian burger with a flavorful veg patty and fresh toppings.',
    image: sandwichImage,
  },

  // =========================================================
  // 111–120
  // =========================================================

  {
    id: 'veg-cheese-burger',
    name: 'Veg Cheese Burger',
    category: 'Burger',
    price: 120,
    priceLabel: '₹120',
    description: 'Classic vegetarian burger topped with creamy melted cheese.',
    image: sandwichImage,
  },

  {
    id: 'veg-cheese-hot-dog',
    name: 'Veg Cheese Hot Dog',
    category: 'Hot Dog',
    price: 120,
    priceLabel: '₹120',
    description: 'Vegetarian hot dog topped with melted cheese and flavorful sauces.',
    image: hotDogImage,
  },

  {
    id: 'veg-cheese-italian-hot-dog',
    name: 'Veg Cheese Italian Hot Dog',
    category: 'Hot Dog',
    price: 120,
    priceLabel: '₹120',
    description: 'Vegetarian hot dog combining Italian-inspired seasoning with cheese.',
    image: hotDogImage,
  },

  {
    id: 'veg-cheese-jain-sandwich',
    name: 'Veg Cheese Jain Sandwich',
    category: 'Jain / Swaminarayan',
    price: 140,
    priceLabel: '₹140',
    description: 'Vegetarian cheese sandwich prepared in a Jain-friendly style.',
    image: sandwichImage,
    badge: 'Jain',
  },

  {
    id: 'veg-cheese-paratha',
    name: 'Veg Cheese Paratha',
    category: 'Stuff Bun Paratha',
    price: 180,
    priceLabel: '₹180',
    description: 'Stuffed paratha filled with vegetables and melted cheese.',
    image: parathaImage,
  },

  {
    id: 'veg-cheese-pudina-khulcha',
    name: 'Veg Cheese Pudina Khulcha',
    category: 'Stuff Grill Khulcha',
    price: 140,
    priceLabel: '₹140',
    description: 'Stuffed khulcha combining vegetables, cheese and refreshing mint.',
    image: parathaImage,
  },

  {
    id: 'veg-cheese-sandwich',
    name: 'Veg Cheese Sandwich',
    category: 'Sandwich',
    price: 130,
    priceLabel: '₹130',
    description: 'A comforting vegetarian sandwich filled with fresh vegetables and melted cheese.',
    image: sandwichImage,
  },

  {
    id: 'veg-cheese-swaminarayan-sandwich',
    name: 'Veg Cheese Swaminarayan Sandwich',
    category: 'Jain / Swaminarayan',
    price: 140,
    priceLabel: '₹140',
    description: 'Vegetarian cheese sandwich prepared in a Swaminarayan-friendly style.',
    image: sandwichImage,
    badge: 'Swaminarayan',
  },

  {
    id: 'veg-frankie',
    name: 'Veg Frankie',
    category: 'Frankie',
    price: 100,
    priceLabel: '₹100',
    description: 'Classic vegetarian Frankie filled with flavorful spiced vegetables.',
    image: sandwichImage,
  },

  {
    id: 'veg-hot-dog',
    name: 'Veg Hot Dog',
    category: 'Hot Dog',
    price: 100,
    priceLabel: '₹100',
    description: 'Classic vegetarian hot dog served with flavorful sauces.',
    image: hotDogImage,
  },

  // =========================================================
  // 121–125
  // =========================================================

  {
    id: 'veg-italian-hot-dog',
    name: 'Veg Italian Hot Dog',
    category: 'Hot Dog',
    price: 100,
    priceLabel: '₹100',
    description: 'Vegetarian hot dog prepared with Italian-inspired flavours and sauces.',
    image: hotDogImage,
  },

  {
    id: 'veg-sandwich',
    name: 'Veg Sandwich',
    category: 'Sandwich',
    price: 110,
    priceLabel: '₹110',
    description: 'Classic vegetarian sandwich made with fresh vegetables and flavorful chutney.',
    image: sandwichImage,
  },

  {
    id: 'veg-swaminarayan-sandwich',
    name: 'Veg Swaminarayan Sandwich',
    category: 'Jain / Swaminarayan',
    price: 120,
    priceLabel: '₹120',
    description: 'Vegetarian sandwich prepared in a Swaminarayan-friendly style.',
    image: sandwichImage,
    badge: 'Swaminarayan',
  },

  {
    id: 'veg-thousand-garlic-bread',
    name: 'Veg Thousand Garlic Bread',
    category: 'Garlic Bread',
    price: 170,
    priceLabel: '₹170',
    description: 'Garlic bread prepared with vegetarian toppings and creamy Thousand Island-style sauce.',
    image: sandwichImage,
  },

  {
    id: 'water',
    name: 'Water',
    category: 'Beverages',
    price: 0,
    priceLabel: '—',
    description: 'Packaged drinking water. Price as listed by the outlet.',
    image: sandwichImage,
  },
];
















export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 1,
    author: "Kashmira Sangani",
    reviewsCount: 11,
    followersCount: 0,
    rating: 5,
    type: "DINING",
    date: "1 month ago",
    highlights: ["POSITIVE"],
    quote: "Best quality n quantity ..."
  },

  {
    id: 2,
    author: "Vinita Patel",
    reviewsCount: 5,
    followersCount: 0,
    rating: 5,
    type: "DINING",
    date: "1 month ago",
    highlights: ["POSITIVE", "margarita pizza"],
    quote:
      "Dining at Bombay sandwich was an absolute delight from start to finish! Every dish we tried was bursting with flavor and cooked to perfection. I especially recommend the margarita pizza it was a true standout. The service was warm, ..."
  },

  {
    id: 3,
    author: "VMM",
    reviewsCount: 5,
    followersCount: 0,
    rating: 4,
    type: "DINING",
    date: "3 months ago",
    highlights: ["POSITIVE"],
    quote: ""
  },

  {
    id: 4,
    author: "Jenil Kotiya",
    reviewsCount: 2,
    followersCount: 0,
    rating: 5,
    type: "DINING",
    date: "3 months ago",
    highlights: ["POSITIVE"],
    quote: ""
  },

  {
    id: 5,
    author: "Reviewer name not visible",
    reviewsCount: 0,
    followersCount: 0,
    rating: 5,
    type: "DINING",
    date: "3 months ago",
    highlights: ["POSITIVE", "sandwiches", "vibe", "parking"],
    quote:
      "It is a good place to visit, you'll get good sandwiches and vibe is also good. Parking: There are too many but, this one has orange board and it is in basement ..."
  },

  {
    id: 6,
    author: "Jitu More",
    reviewsCount: 4,
    followersCount: 0,
    rating: 5,
    type: "DINING",
    date: "4 months ago",
    highlights: ["POSITIVE"],
    quote: ""
  },

  {
    id: 7,
    author: "Pushpa Parmar",
    reviewsCount: 1,
    followersCount: 0,
    rating: 5,
    type: "DINING",
    date: "4 months ago",
    highlights: ["POSITIVE"],
    quote: ""
  },

  {
    id: 8,
    author: "Akshay Ghela",
    reviewsCount: 18,
    followersCount: 0,
    rating: 4,
    type: "DINING",
    date: "8 months ago",
    highlights: ["POSITIVE"],
    quote: ""
  }
];






