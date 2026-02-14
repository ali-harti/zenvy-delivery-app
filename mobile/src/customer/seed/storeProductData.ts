// Realistic Moroccan Store & Product Data
export type StoreType = "Restaurants" | "Groceries" | "Pharmacy" | "Flowers";

export type ProductTab = "Popular" | "Menu" | "Offers";

export interface Product {
    id: string;
    name: string;
    desc: string;
    price: number;
    image: string;
    storeId: string;
    tabs: ProductTab[]; // Which tabs this product appears in
}

export interface Store {
    id: string;
    name: string;
    category: StoreType;
    rating: number;
    eta: string;
    deliveryFee: number;
    city: string;
    image: string;
    heroImage: string;
    description: string;
}

// STORES
export const MOROCCAN_STORES: Store[] = [
    {
        id: "s1",
        name: "Burger Joint",
        category: "Restaurants",
        rating: 4.8,
        eta: "20–30 min",
        deliveryFee: 29.9,
        city: "Casablanca",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
        heroImage: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=1600&q=80",
        description: "American-style burgers, fries, and shakes",
    },
    {
        id: "s2",
        name: "Marché Frais",
        category: "Groceries",
        rating: 4.6,
        eta: "15–25 min",
        deliveryFee: 19.9,
        city: "Rabat",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
        heroImage: "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?auto=format&fit=crop&w=1600&q=80",
        description: "Fresh fruits, vegetables, dairy & essentials",
    },
    {
        id: "s3",
        name: "Pharmacie Atlas",
        category: "Pharmacy",
        rating: 4.9,
        eta: "10–20 min",
        deliveryFee: 9.9,
        city: "Marrakech",
        image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=1200&q=80",
        heroImage: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=1600&q=80",
        description: "Medications, health products & wellness items",
    },
    {
        id: "s4",
        name: "Bloom Flowers",
        category: "Flowers",
        rating: 4.7,
        eta: "25–35 min",
        deliveryFee: 39.9,
        city: "Tanger",
        image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=80",
        heroImage: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1600&q=80",
        description: "Fresh flowers, bouquets & gift arrangements",
    },
    {
        id: "s5",
        name: "Pizzeria Napoli",
        category: "Restaurants",
        rating: 4.5,
        eta: "30–40 min",
        deliveryFee: 24.9,
        city: "Casablanca",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
        heroImage: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=1600&q=80",
        description: "Authentic Italian pizza and pasta",
    },
    {
        id: "s6",
        name: "Café Mogador",
        category: "Restaurants",
        rating: 4.4,
        eta: "15–25 min",
        deliveryFee: 1.99,
        city: "Rabat",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
        heroImage: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1600&q=80",
        description: "Moroccan coffee, pastries & breakfast",
    },
];

// PRODUCTS BY STORE
export const STORE_PRODUCTS: Record<string, Product[]> = {
    // Burger Joint Casa (s1)
    s1: [
        {
            id: "p1_1",
            name: "Classic Cheeseburger",
            desc: "Beef patty, cheddar, lettuce, tomato, pickles",
            price: 95,
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
            storeId: "s1",
            tabs: ["Popular", "Menu"],
        },
        {
            id: "p1_2",
            name: "Crispy Fries",
            desc: "Golden crispy french fries",
            price: 35,
            image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80",
            storeId: "s1",
            tabs: ["Popular", "Menu"],
        },
        {
            id: "p1_3",
            name: "Double Bacon Burger",
            desc: "Double beef, crispy bacon, cheese, BBQ sauce",
            price: 129.9,
            image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=800&q=80",
            storeId: "s1",
            tabs: ["Popular", "Menu"],
        },
        {
            id: "p1_4",
            name: "Chicken Nuggets",
            desc: "8 piece crispy chicken nuggets",
            price: 69.9,
            image: "https://images.unsplash.com/photo-1619894991209-e9ee8f3b01d4?auto=format&fit=crop&w=800&q=80",
            storeId: "s1",
            tabs: ["Menu"],
        },
        {
            id: "p1_5",
            name: "Combo Meal Deal",
            desc: "Burger + Fries + Drink - Save 20%",
            price: 119.9,
            image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=800&q=80",
            storeId: "s1",
            tabs: ["Offers"],
        },
    ],

    // Marché Frais Rabat (s2)
    s2: [
        {
            id: "p2_1",
            name: "Fresh Strawberries",
            desc: "500g premium strawberries",
            price: 49.9,
            image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80",
            storeId: "s2",
            tabs: ["Popular", "Menu"],
        },
        {
            id: "p2_2",
            name: "Organic Tomatoes",
            desc: "1kg fresh organic tomatoes",
            price: 29.9,
            image: "https://images.unsplash.com/photo-1546470427-227a8c9c2804?auto=format&fit=crop&w=800&q=80",
            storeId: "s2",
            tabs: ["Popular", "Menu"],
        },
        {
            id: "p2_3",
            name: "Fresh Milk",
            desc: "1L whole milk",
            price: 19.9,
            image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80",
            storeId: "s2",
            tabs: ["Menu"],
        },
        {
            id: "p2_4",
            name: "Mixed Salad",
            desc: "Pre-washed mixed greens 250g",
            price: 34.9,
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
            storeId: "s2",
            tabs: ["Menu"],
        },
        {
            id: "p2_5",
            name: "Weekly Bundle",
            desc: "5 items for the price of 4",
            price: 149.9,
            image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80",
            storeId: "s2",
            tabs: ["Offers"],
        },
    ],

    // Pharmacie Atlas (s3)
    s3: [
        {
            id: "p3_1",
            name: "Pain Relief",
            desc: "Paracetamol 500mg - 20 tablets",
            price: 39.9,
            image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80",
            storeId: "s3",
            tabs: ["Popular", "Menu"],
        },
        {
            id: "p3_2",
            name: "Vitamin C",
            desc: "1000mg effervescent tablets",
            price: 89.9,
            image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
            storeId: "s3",
            tabs: ["Popular", "Menu"],
        },
        {
            id: "p3_3",
            name: "Face Masks",
            desc: "Disposable surgical masks - 50 pack",
            price: 129.9,
            image: "https://images.unsplash.com/photo-1585559604959-6388fe69c8a3?auto=format&fit=crop&w=800&q=80",
            storeId: "s3",
            tabs: ["Menu"],
        },
        {
            id: "p3_4",
            name: "Hand Sanitizer",
            desc: "500ml antibacterial gel",
            price: 59.9,
            image: "https://images.unsplash.com/photo-1612852098516-55d01c75769a?auto=format&fit=crop&w=800&q=80",
            storeId: "s3",
            tabs: ["Menu"],
        },
        {
            id: "p3_5",
            name: "Wellness Pack",
            desc: "Vitamins bundle - 15% off",
            price: 249.9,
            image: "https://images.unsplash.com/photo-1542736667-069246bdbc6d?auto=format&fit=crop&w=800&q=80",
            storeId: "s3",
            tabs: ["Offers"],
        },
    ],

    // Bloom Tanger (s4)
    s4: [
        {
            id: "p4_1",
            name: "Rose Bouquet",
            desc: "12 premium red roses",
            price: 299.9,
            image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80",
            storeId: "s4",
            tabs: ["Popular", "Menu"],
        },
        {
            id: "p4_2",
            name: "Mixed Wildflowers",
            desc: "Seasonal wildflower arrangement",
            price: 199.9,
            image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80",
            storeId: "s4",
            tabs: ["Popular", "Menu"],
        },
        {
            id: "p4_3",
            name: "Orchid Plant",
            desc: "Premium potted orchid",
            price: 349.9,
            image: "https://images.unsplash.com/photo-1615715616181-6164a7f14c19?auto=format&fit=crop&w=800&q=80",
            storeId: "s4",
            tabs: ["Menu"],
        },
        {
            id: "p4_4",
            name: "Tulip Bunch",
            desc: "20 fresh tulips",
            price: 249.9,
            image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=800&q=80",
            storeId: "s4",
            tabs: ["Menu"],
        },
        {
            id: "p4_5",
            name: "Anniversary Special",
            desc: "Roses + Chocolates - 25% off",
            price: 399.9,
            image: "https://images.unsplash.com/photo-1606800052052-f2c18e281f4e?auto=format&fit=crop&w=800&q=80",
            storeId: "s4",
            tabs: ["Offers"],
        },
    ],

    // Pizzeria Napoli (s5)
    s5: [
        {
            id: "p5_1",
            name: "Margherita Pizza",
            desc: "Tomato sauce, mozzarella, fresh basil",
            price: 119.9,
            image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
            storeId: "s5",
            tabs: ["Popular", "Menu"],
        },
        {
            id: "p5_2",
            name: "Pepperoni Pizza",
            desc: "Tomato, mozzarella, spicy pepperoni",
            price: 139.9,
            image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
            storeId: "s5",
            tabs: ["Popular", "Menu"],
        },
        {
            id: "p5_3",
            name: "Spaghetti Carbonara",
            desc: "Creamy sauce, bacon, parmesan",
            price: 109.9,
            image: "https://images.unsplash.com/photo-1588013273468-315fd88ea34c?auto=format&fit=crop&w=800&q=80",
            storeId: "s5",
            tabs: ["Menu"],
        },
        {
            id: "p5_4",
            name: "Lasagna",
            desc: "Beef ragù, béchamel, cheese",
            price: 129.9,
            image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=800&q=80",
            storeId: "s5",
            tabs: ["Menu"],
        },
        {
            id: "p5_5",
            name: "2 Pizza Deal",
            desc: "Any 2 pizzas - Save 30%",
            price: 199.9,
            image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
            storeId: "s5",
            tabs: ["Offers"],
        },
    ],

    // Café Mogador (s6)
    s6: [
        {
            id: "p6_1",
            name: "Moroccan Coffee",
            desc: "Traditional spiced coffee",
            price: 29.9,
            image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
            storeId: "s6",
            tabs: ["Popular", "Menu"],
        },
        {
            id: "p6_2",
            name: "Croissant",
            desc: "Fresh buttery croissant",
            price: 19.9,
            image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
            storeId: "s6",
            tabs: ["Popular", "Menu"],
        },
        {
            id: "p6_3",
            name: "Mint Tea",
            desc: "Traditional Moroccan mint tea",
            price: 24.9,
            image: "https://images.unsplash.com/photo-1597318130355-db71a1b937e6?auto=format&fit=crop&w=800&q=80",
            storeId: "s6",
            tabs: ["Menu"],
        },
        {
            id: "p6_4",
            name: "Baghrir",
            desc: "Moroccan pancakes with honey",
            price: 49.9,
            image: "https://images.unsplash.com/photo-1554520735-0a6b8b6ce8b7?auto=format&fit=crop&w=800&q=80",
            storeId: "s6",
            tabs: ["Menu"],
        },
        {
            id: "p6_5",
            name: "Breakfast Combo",
            desc: "Coffee + Croissant - 20% off",
            price: 39.9,
            image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
            storeId: "s6",
            tabs: ["Offers"],
        },
    ],
};
