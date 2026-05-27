


interface FoodItem {
    id: string;
    name: string;
    price: number;
    category: 'veg' | 'non-veg' | 'dessert' | 'beverage';
    description: string;
    image: string;
    spicyLevel?: 1 | 2 | 3;
}

interface PlaceReview {
    author_name: string;
    rating: number;
    text: string;
    relative_time_description: string;
}

interface Restaurant {
    id: string;
    name: string;
    rating: number;
    totalReviews: number;
    address: string;
    phone: string;
    logo: string;
    image: string;
    cuisines: string[];
    lat: number;
    lng: number;
    deliveryTime: string;
    priceLevel: 1 | 2 | 3 | 4;
    hasVegOnly: boolean;
    menu: FoodItem[];
    website?: string;
    openingHours?: string[];
    reviews?: PlaceReview[];
}

export type { FoodItem, PlaceReview, Restaurant }