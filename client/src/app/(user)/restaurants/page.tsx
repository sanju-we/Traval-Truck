'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, MapPin, Star, Search, Phone, Clock, Compass, Navigation, SlidersHorizontal, ChevronRight, Info, X, Flame, Leaf, IndianRupee, Loader2, Globe, MessageSquare } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Header } from '@/components/user/header/page';
import { Footer } from '@/components/user/footer/page';
import TravelTruckLoading from '@/components/shared/TravelTruckLoading';
import { FoodItem, PlaceReview, Restaurant } from '@/types/user/restaurant';

type ExplorerCategory = 'Restaurants' | 'Cafes' | 'Stays' | 'Attractions';

const LIBRARIES: ("places" | "drawing" | "geometry" | "visualization")[] = ['places'];
const DEFAULT_CENTER = { lat: 9.9312, lng: 76.2673 };

const generateMenuForPlace = (name: string, category: ExplorerCategory, priceLevel: number): FoodItem[] => {
  const level = priceLevel || 2;
  const multiplier = level === 1 ? 0.6 : level === 2 ? 1.0 : level === 3 ? 1.5 : 2.2;

  if (category === 'Cafes') {
    return [
      { id: 'c1', name: 'Signature Cold Brew', price: Math.round(140 * multiplier), category: 'beverage', description: 'Slow-steeped organic coffee beans served over ice.', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400' },
      { id: 'c2', name: 'Almond Milk Flat White', price: Math.round(160 * multiplier), category: 'beverage', description: 'Espresso with velvety smooth steamed almond milk.', image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=400' },
      { id: 'c3', name: 'Classic Butter Croissant', price: Math.round(95 * multiplier), category: 'veg', description: 'Flaky, multi-layered French pastry baked fresh daily.', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400' },
      { id: 'c4', name: 'Blueberry Cheesecake Slice', price: Math.round(180 * multiplier), category: 'dessert', description: 'Creamy cold-set cheesecake with wild blueberry compote.', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400' },
    ];
  }

  if (category === 'Stays') {
    return [
      { id: 's1', name: 'Club Sandwich with Fries', price: Math.round(220 * multiplier), category: 'non-veg', description: 'Classic double-decker toasted sandwich with grilled chicken, egg, bacon, lettuce, and tomatoes.', image: 'https://images.unsplash.com/photo-1567234669013-216e987c2fb9?w=400' },
      { id: 's2', name: 'Paneer Tikka Roll', price: Math.round(180 * multiplier), category: 'veg', description: 'Tandoor-charred cottage cheese chunks wrapped in soft flatbread with mint chutney.', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400' },
      { id: 's3', name: 'Warm Walnut Brownie', price: Math.round(140 * multiplier), category: 'dessert', description: 'Fudgy chocolate brownie served with hot chocolate fudge sauce.', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400' }
    ];
  }

  if (category === 'Attractions') {
    return [
      { id: 'a1', name: 'Standard Entry Pass', price: Math.round(100 * multiplier), category: 'veg', description: 'Single entry ticket including standard park/palace access and digital guide map.', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400' },
      { id: 'a2', name: 'VIP Priority Walkthrough & Snack', price: Math.round(250 * multiplier), category: 'veg', description: 'Skip-the-line pass with premium guided group and complimentary mocktail.', image: 'https://images.unsplash.com/photo-1531050171654-7d6b379c5450?w=400' }
    ];
  }

  // Default: Restaurants
  const isSeafood = name.toLowerCase().includes('fish') || name.toLowerCase().includes('seafood') || name.toLowerCase().includes('coast') || name.toLowerCase().includes('curry');
  if (isSeafood) {
    return [
      { id: 'r1', name: 'Kerala Fish Curry', price: Math.round(290 * multiplier), category: 'non-veg', description: 'Local catch cooked in a spicy, sour gravy with raw mangoes, kokum, and coconut milk.', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400', spicyLevel: 3 },
      { id: 'r2', name: 'Ghee Rice & Chicken Fry', price: Math.round(240 * multiplier), category: 'non-veg', description: 'Aromatic ghee rice served with juicy, dry-spiced fried chicken joints.', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', spicyLevel: 2 },
      { id: 'r3', name: 'Coconut Fried Calamari', price: Math.round(220 * multiplier), category: 'non-veg', description: 'Crispy squid rings dusted in Malabar spices and tossed with fried coconut shavings.', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400', spicyLevel: 1 },
      { id: 'r4', name: 'Vegetable Kurma', price: Math.round(140 * multiplier), category: 'veg', description: 'Seasonal local vegetables simmered in a mild, sweet spiced coconut cashew gravy.', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400' }
    ];
  }

  return [
    { id: 'r1', name: 'Traditional Kerala Thali Platter', price: Math.round(180 * multiplier), category: 'veg', description: 'A wholesome meal with steamed rice, sambar, dal, vegetable side dishes, papad, curd, and sweet payasam.', image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=400' },
    { id: 'r2', name: 'Signature Spicy Tandoori Chicken', price: Math.round(280 * multiplier), category: 'non-veg', description: 'Half spring chicken marinated in spiced yogurt and fresh red chillies, charred beautifully in clay tandoor.', image: 'https://images.unsplash.com/photo-1598515214211-89d3e73ae83b?w=400', spicyLevel: 3 },
    { id: 'r3', name: 'Malabar Vegetable Dum Biryani', price: Math.round(180 * multiplier), category: 'veg', description: 'Layers of premium basmati rice and farm-fresh vegetables cooked on dum with aromatic spices.', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', spicyLevel: 2 },
    { id: 'r4', name: 'Pista Kulfi Ice Cream', price: Math.round(90 * multiplier), category: 'dessert', description: 'Rich, dense traditional Indian ice cream flavored with saffron, cardamoms, and slivered pistachios.', image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400' }
  ];
};

export default function RestaurantExplorer() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRest, setSelectedRest] = useState<Restaurant | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenuTab, setActiveMenuTab] = useState<'all' | 'veg' | 'non-veg'>('all');

  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [distances, setDistances] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<ExplorerCategory>('Restaurants');
  const [cuisineFilter, setCuisineFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const [vegOnlyFilter, setVegOnlyFilter] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(13);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: LIBRARIES,
  });

  const getDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
  }, []);

  const fetchNearbyPlaces = useCallback((coords: { lat: number, lng: number }, category: ExplorerCategory) => {
    if (!window.google || !coords) return;

    setLoading(true);
    const mapElement = mapRef.current || document.createElement('div');
    const service = new window.google.maps.places.PlacesService(mapElement);

    let searchType = 'restaurant';
    if (category === 'Cafes') searchType = 'cafe';
    if (category === 'Stays') searchType = 'lodging';
    if (category === 'Attractions') searchType = 'tourist_attraction';

    const request: google.maps.places.PlaceSearchRequest = {
      location: new window.google.maps.LatLng(coords.lat, coords.lng),
      radius: 5000,
      type: searchType
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        const formatted: Restaurant[] = results.map((place, idx) => {
          let photoUrl = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800';
          if (place.photos && place.photos.length > 0) {
            photoUrl = place.photos[0].getUrl({ maxWidth: 600 });
          }

          console.log('place that got ', place)

          const lat = place.geometry?.location?.lat() || coords.lat;
          const lng = place.geometry?.location?.lng() || coords.lng;

          const menu = generateMenuForPlace(place.name || '', category, place.price_level || 2);

          const isVegOnly = (place.name || '').toLowerCase().includes('veg') ||
            (place.name || '').toLowerCase().includes('vegetarian') ||
            (place.name || '').toLowerCase().includes('pure veg') ||
            (category === 'Cafes' && Math.random() > 0.5);

          return {
            id: place.place_id || `place_${idx}`,
            name: place.name || 'Unnamed Place',
            rating: place.rating || 4.2,
            totalReviews: place.user_ratings_total || 45,
            address: place.vicinity || 'Address not available',
            phone: '',
            logo: photoUrl,
            image: photoUrl,
            cuisines: place.types ? place.types.filter(t => t !== 'point_of_interest' && t !== 'establishment').map(t => t.replace('_', ' ')) : [category],
            lat: lat,
            lng: lng,
            deliveryTime: `${Math.floor(Math.random() * 20) + 15} mins`,
            priceLevel: (place.price_level as any) || (Math.floor(Math.random() * 3) + 1),
            hasVegOnly: isVegOnly,
            menu: menu
          };
        });

        const computedDistances: { [key: string]: string } = {};
        formatted.forEach(rest => {
          const dist = getDistance(coords.lat, coords.lng, rest.lat, rest.lng);
          computedDistances[rest.id] = `${dist} km`;
        });
        setDistances(prev => ({ ...prev, ...computedDistances }));

        formatted.sort((a, b) => {
          const distA = getDistance(coords.lat, coords.lng, a.lat, a.lng);
          const distB = getDistance(coords.lat, coords.lng, b.lat, b.lng);
          return distA - distB;
        });

        setRestaurants(formatted);
        setLoading(false);
      } else {
        console.warn("Places nearbySearch failed:", status);
        setRestaurants([]);
        setLoading(false);
      }
    });
  }, [getDistance]);

  const loadLivePlaceDetails = useCallback((placeId: string, restaurantItem: Restaurant) => {
    if (!window.google || !placeId) return;

    const mapElement = mapRef.current || document.createElement('div');
    const service = new window.google.maps.places.PlacesService(mapElement);

    const request = {
      placeId: placeId,
      fields: ['formatted_phone_number', 'website', 'opening_hours', 'reviews']
    };

    service.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
        setSelectedRest({
          ...restaurantItem,
          phone: place.formatted_phone_number || '',
          website: place.website || undefined,
          openingHours: place.opening_hours?.weekday_text || undefined,
          reviews: place.reviews ? place.reviews.map((r: any) => ({
            author_name: r.author_name,
            rating: r.rating,
            text: r.text,
            relative_time_description: r.relative_time_description
          })) : undefined
        });
      }
    });
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserCoords(coords);
        setMapCenter(coords);
        setMapZoom(14);
        setIsLocating(false);
        fetchNearbyPlaces(coords, activeTab);
      },
      (error) => {
        console.error("Error geolocating user:", error);
        setIsLocating(false);
        setUserCoords(DEFAULT_CENTER);
        setMapCenter(DEFAULT_CENTER);
        fetchNearbyPlaces(DEFAULT_CENTER, activeTab);
      }
    );
  }, [fetchNearbyPlaces, activeTab]);

  useEffect(() => {
    if (isLoaded) {
      if (userCoords) {
        fetchNearbyPlaces(userCoords, activeTab);
      } else {
        requestLocation();
      }
    }
  }, [isLoaded, activeTab, fetchNearbyPlaces, requestLocation]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onMapUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const filteredRestaurants = restaurants.filter(rest => {
    const matchesSearch = rest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rest.cuisines.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCuisine = cuisineFilter === 'All' || rest.cuisines.includes(cuisineFilter);
    const matchesPrice = priceFilter === 'All' ||
      (priceFilter === 'Budget' && rest.priceLevel <= 1) ||
      (priceFilter === 'Moderate' && (rest.priceLevel === 2 || rest.priceLevel === 3)) ||
      (priceFilter === 'Luxury' && rest.priceLevel >= 4);

    const matchesVeg = !vegOnlyFilter || rest.hasVegOnly || rest.menu.some(item => item.category === 'veg');

    return matchesSearch && matchesCuisine && matchesPrice && matchesVeg;
  });

  const getPriceRangeSymbol = (level: number) => {
    return '₹'.repeat(level);
  };

  const getPriceRangeValue = (level: number) => {
    if (level === 1) return "₹50 - ₹150";
    if (level === 2) return "₹150 - ₹300";
    if (level === 3) return "₹300 - ₹500";
    return "₹500+";
  };

  const cuisinesList = Array.from(
    new Set(restaurants.flatMap(rest => rest.cuisines))
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-500 selection:text-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 px-6 bg-gradient-to-b from-emerald-50/50 via-white to-white border-b border-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.08),rgba(255,255,255,0))]"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 text-sm font-medium mb-6 shadow-sm"
          >
            <Flame className="w-4 h-4 text-emerald-600 animate-pulse" />
            Live Google Places Explorer
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent"
          >
            Explore Nearby Stays & Bites
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600 max-w-2xl mx-auto mt-4 text-base md:text-lg"
          >
            Fetch live locations around you. Group by restaurants, cafes, hotels, or tourist attractions. Browse reviews, photos, coordinates, and exact menu price lists instantly.
          </motion.p>
        </div>
      </section>

      {/* Explorer Category Tabs */}
      <section className="max-w-7xl mx-auto px-6 pt-6 shrink-0">
        <div className="flex justify-center border-b border-slate-200">
          <div className="flex space-x-6 sm:space-x-8">
            {[
              { label: 'Restaurants', key: 'Restaurants', icon: <Utensils className="w-4 h-4" /> },
              { label: 'Cafes', key: 'Cafes', icon: <Leaf className="w-4 h-4" /> },
              { label: 'Stays & Hotels', key: 'Stays', icon: <Clock className="w-4 h-4" /> },
              { label: 'Attractions', key: 'Attractions', icon: <Compass className="w-4 h-4" /> },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key as ExplorerCategory);
                  setCuisineFilter('All');
                  setPriceFilter('All');
                }}
                className={`flex items-center gap-2 pb-4 text-sm font-bold border-b-2 transition-all ${activeTab === tab.key
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Controls & Search Bar */}
      <section className="max-w-7xl mx-auto px-6 py-6 border-b border-slate-100">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

          {/* Live Geolocation Button */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={requestLocation}
              disabled={isLocating}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/10 active:scale-95 transition-all disabled:opacity-50"
            >
              {isLocating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
              {isLocating ? "Syncing..." : "Sync Live Location"}
            </button>

            {userCoords && (
              <span className="text-xs bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-2 rounded-lg flex items-center gap-1 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                Location active
              </span>
            )}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder={`Search nearby ${activeTab.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm shadow-sm"
            />
          </div>

        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mr-2 uppercase tracking-wider">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filter By:
          </div>

          {/* Cuisine Selector */}
          <select
            value={cuisineFilter}
            onChange={(e) => setCuisineFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none shadow-sm"
          >
            <option value="All">All Types</option>
            {cuisinesList.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Price Selector */}
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none shadow-sm"
          >
            <option value="All">All Price Ranges</option>
            <option value="Budget">Budget (Under ₹150)</option>
            <option value="Moderate">Moderate (₹150 - ₹500)</option>
            <option value="Luxury">Luxury (₹500+)</option>
          </select>

          {/* Veg Only Toggle */}
          {activeTab !== 'Attractions' && (
            <button
              onClick={() => setVegOnlyFilter(!vegOnlyFilter)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all shadow-sm ${vegOnlyFilter
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-emerald-100/50'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-800 hover:border-slate-300'
                }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              Vegetarian Options
            </button>
          )}
        </div>
      </section>

      {/* Main Content Area: Split List & Sticky Map */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Restaurants Cards Grid/List */}
          <section className="lg:col-span-6 space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-emerald-600" />
              Nearby Places Found ({filteredRestaurants.length})
            </h2>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-2xl shadow-sm">
                <TravelTruckLoading />
                <p className="text-slate-500 text-sm font-semibold mt-4">Searching local Places API...</p>
              </div>
            ) : filteredRestaurants.length === 0 ? (
              <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm">
                <Info className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No {activeTab.toLowerCase()} found nearby.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCuisineFilter('All');
                    setPriceFilter('All');
                    setVegOnlyFilter(false);
                  }}
                  className="mt-4 px-4 py-2 text-xs font-bold text-emerald-600 hover:underline"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                {filteredRestaurants.map((rest, index) => {
                  const hasVeg = rest.menu.some(i => i.category === 'veg');
                  const hasNonVeg = rest.menu.some(i => i.category === 'non-veg');

                  return (
                    <motion.div
                      key={rest.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ y: -2 }}
                      className={`group relative overflow-hidden rounded-2xl bg-white border hover:border-emerald-500/30 transition-all duration-300 shadow-sm shadow-slate-100/50 ${activeMarker === rest.id ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-slate-100'
                        }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative w-full sm:w-48 h-40 overflow-hidden sm:rounded-l-2xl shrink-0">
                          <img
                            src={rest.image}
                            alt={rest.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

                          {/* Distance Badge */}
                          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-emerald-700 text-xs font-extrabold px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center gap-1 shadow-sm">
                            <Compass className="w-3.5 h-3.5 text-emerald-600 animate-spin-slow" />
                            {distances[rest.id] || "Calculating..."}
                          </div>
                        </div>

                        {/* Card Info Details */}
                        <div className="flex-1 p-5 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between">
                              <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-1">
                                {rest.name}
                              </h3>

                              {/* Rating */}
                              <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100 text-amber-600 font-bold text-xs">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                {rest.rating}
                              </div>
                            </div>

                            {/* Cuisines */}
                            <p className="text-xs text-slate-400 mt-1 font-semibold line-clamp-1 capitalize">
                              {rest.cuisines.join(' • ')}
                            </p>

                            {/* Address details */}
                            <div className="flex items-center gap-1 text-slate-500 text-xs mt-3">
                              <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span className="line-clamp-1">{rest.address}</span>
                            </div>

                            {/* Price range & Delivery */}
                            <div className="flex items-center gap-3 mt-3.5 text-xs text-slate-600">
                              <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                                <IndianRupee className="w-3 h-3 text-slate-400" />
                                <span>Cost: <strong>{getPriceRangeValue(rest.priceLevel)}</strong></span>
                              </div>
                              <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100 font-semibold">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>{rest.deliveryTime}</span>
                              </div>
                            </div>

                            {/* Veg / Non-Veg Indicator counts */}
                            <div className="flex items-center gap-2 mt-3.5">
                              {hasVeg && (
                                <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                  Veg Items
                                </span>
                              )}
                              {hasNonVeg && (
                                <span className="inline-flex items-center gap-1 bg-rose-50 border border-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                  Non-Veg
                                </span>
                              )}
                            </div>

                          </div>

                          {/* Action triggers */}
                          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">

                            {/* Zoom in map */}
                            <button
                              onClick={() => {
                                setMapCenter({ lat: rest.lat, lng: rest.lng });
                                setMapZoom(16);
                                setActiveMarker(rest.id);
                              }}
                              className="text-xs text-slate-400 hover:text-emerald-600 font-bold flex items-center gap-1 group/btn"
                            >
                              Show on Map
                              <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                            </button>

                            {/* Browse Menu */}
                            <button
                              onClick={() => {
                                setSelectedRest(rest);
                                loadLivePlaceDetails(rest.id, rest);
                                setActiveMenuTab('all');
                                setMenuOpen(true);
                              }}
                              className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 font-extrabold text-xs transition-all duration-300"
                            >
                              {activeTab === 'Attractions' ? 'View Details' : 'Browse Menu'}
                              <Utensils className="w-3.5 h-3.5" />
                            </button>

                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Right Column: Sticky Google Map */}
          <section className="lg:col-span-6 sticky top-24 rounded-3xl overflow-hidden border border-slate-100 shadow-2xl shadow-slate-100/50 h-[65vh] lg:h-[75vh]">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={mapCenter}
                zoom={mapZoom}
                onLoad={onMapLoad}
                onUnmount={onMapUnmount}
                options={{
                  styles: silverMapStyles, // Beautiful custom Light / Silver travel theme
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                  zoomControlOptions: { position: 3 }, // Right bottom
                }}
              >
                {/* User live location marker */}
                {userCoords && (
                  <Marker
                    position={userCoords}
                    icon={{
                      path: google.maps.SymbolPath.CIRCLE,
                      scale: 8,
                      fillColor: '#059669',
                      fillOpacity: 1,
                      strokeColor: '#FFFFFF',
                      strokeWeight: 2,
                    }}
                    title="Your Location"
                  />
                )}

                {/* Restaurant markers */}
                {filteredRestaurants.map(rest => (
                  <Marker
                    key={rest.id}
                    position={{ lat: rest.lat, lng: rest.lng }}
                    onClick={() => {
                      setActiveMarker(rest.id);
                      setMapCenter({ lat: rest.lat, lng: rest.lng });
                    }}
                    icon={{
                      url: activeTab === 'Cafes'
                        ? 'https://cdn-icons-png.flaticon.com/512/3054/3054889.png' // Cafe coffee cup
                        : activeTab === 'Stays'
                          ? 'https://cdn-icons-png.flaticon.com/512/3557/3557555.png' // Bed/Hotel
                          : activeTab === 'Attractions'
                            ? 'https://cdn-icons-png.flaticon.com/512/201/201623.png' // Camera/Attraction
                            : 'https://cdn-icons-png.flaticon.com/512/857/857681.png', // Food/Plate
                      scaledSize: new google.maps.Size(32, 32),
                    }}
                    animation={activeMarker === rest.id ? google.maps.Animation.BOUNCE : undefined}
                  />
                ))}

                {/* Info Window */}
                {activeMarker && (
                  (() => {
                    const activeRest = restaurants.find(r => r.id === activeMarker);
                    if (!activeRest) return null;
                    return (
                      <InfoWindow
                        position={{ lat: activeRest.lat, lng: activeRest.lng }}
                        onCloseClick={() => setActiveMarker(null)}
                      >
                        <div className="p-2 text-slate-900 max-w-xs font-sans">
                          <h4 className="font-extrabold text-sm">{activeRest.name}</h4>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{activeRest.address}</p>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                            <span className="text-xs font-bold text-emerald-600">{distances[activeRest.id] || ''}</span>
                            <button
                              onClick={() => {
                                setSelectedRest(activeRest);
                                loadLivePlaceDetails(activeRest.id, activeRest);
                                setActiveMenuTab('all');
                                setMenuOpen(true);
                              }}
                              className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded"
                            >
                              Browse Menu
                            </button>
                          </div>
                        </div>
                      </InfoWindow>
                    );
                  })()
                )}

              </GoogleMap>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
                <p className="text-slate-600 font-bold text-sm">Preparing Google Interactive Map...</p>
                <p className="text-slate-400 text-xs mt-1">Make sure you have an active internet connection</p>
              </div>
            )}
          </section>

        </div>
      </main>

      {/* Menu Modal / Slide-out Drawer */}
      <AnimatePresence>
        {menuOpen && selectedRest && (
          <>
            {/* Soft Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50"
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full sm:max-w-2xl bg-white border-l border-slate-100 shadow-2xl z-50 flex flex-col h-full text-slate-800"
            >

              {/* Drawer Header Banner */}
              <div className="relative h-48 w-full overflow-hidden shrink-0 bg-slate-900">
                <img
                  src={selectedRest.image}
                  alt={selectedRest.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/20"></div>

                {/* Close trigger */}
                <button
                  onClick={() => setMenuOpen(false)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 border border-slate-200 text-slate-700 hover:text-emerald-600 hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-md z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Restaurant basic info */}
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <h2 className="text-2xl font-black line-clamp-1">{selectedRest.name}</h2>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-200">
                    <span className="flex items-center gap-1 font-bold text-yellow-400 bg-black/45 px-2 py-0.5 rounded border border-white/10 backdrop-blur-xs">
                      <Star className="w-3 h-3 fill-current" />
                      {selectedRest.rating}
                    </span>
                    <span>•</span>
                    <span className="font-semibold capitalize">{selectedRest.cuisines.slice(0, 3).join(', ')}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-extrabold">{distances[selectedRest.id] || ''}</span>
                  </div>
                </div>
              </div>

              {/* Quick info strip */}
              <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 shrink-0 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-medium shadow-inner">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate max-w-[280px]">{selectedRest.address}</span>
                </div>
                <div className="flex items-center gap-4 font-bold">
                  {selectedRest.phone && (
                    <a href={`tel:${selectedRest.phone}`} className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {selectedRest.phone}
                    </a>
                  )}
                  {selectedRest.website && (
                    <a href={selectedRest.website} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5" />
                      Website
                    </a>
                  )}
                </div>
              </div>

              {/* Menu and Details Split Tabs */}
              <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50">

                {/* Menu items if not Attraction */}
                {activeTab !== 'Attractions' ? (
                  <>
                    <div className="px-6 py-4 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
                      <div className="flex gap-2">
                        {[
                          { label: 'All Items', key: 'all' },
                          { label: 'Veg Only', key: 'veg', icon: <Leaf className="w-3 h-3 inline text-emerald-600" /> },
                          { label: 'Non-Veg', key: 'non-veg', icon: <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block mr-1"></span> }
                        ].map(tab => (
                          <button
                            key={tab.key}
                            onClick={() => setActiveMenuTab(tab.key as any)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeMenuTab === tab.key
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-800'
                              }`}
                          >
                            {tab.icon} {tab.label}
                          </button>
                        ))}
                      </div>

                      <span className="text-xs text-slate-400 font-bold">
                        {selectedRest.menu.filter(i => activeMenuTab === 'all' || i.category === activeMenuTab).length} items
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                      {selectedRest.menu
                        .filter(item => activeMenuTab === 'all' || item.category === activeMenuTab)
                        .map(item => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.25 }}
                            className="p-4 rounded-xl bg-white border border-slate-100 hover:border-emerald-500/20 shadow-sm flex gap-4"
                          >
                            <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-slate-100 relative shadow-inner">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              {item.category === 'veg' ? (
                                <div className="absolute top-1 right-1 w-5 h-5 bg-white border border-emerald-500 p-0.5 rounded flex items-center justify-center shadow">
                                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                                </div>
                              ) : item.category === 'non-veg' ? (
                                <div className="absolute top-1 right-1 w-5 h-5 bg-white border border-rose-500 p-0.5 rounded flex items-center justify-center shadow">
                                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                                </div>
                              ) : null}
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex items-start justify-between">
                                  <h4 className="font-extrabold text-base text-slate-800 capitalize line-clamp-1">{item.name}</h4>
                                  <span className="text-sm font-black text-emerald-600 shrink-0 ml-2">₹{item.price}</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{item.description}</p>
                              </div>

                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-1">
                                  {item.spicyLevel && (
                                    <div className="flex items-center gap-0.5">
                                      {[...Array(3)].map((_, i) => (
                                        <Flame key={i} className={`w-3.5 h-3.5 ${i < (item.spicyLevel || 0) ? 'text-amber-500 fill-current' : 'text-slate-200'}`} />
                                      ))}
                                      <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase">Spicy</span>
                                    </div>
                                  )}
                                </div>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-colors shadow-sm">
                                  Order Now
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </>
                ) : (
                  // Attractions: Ticket & Admission passes
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    <div>
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Passes & Admission Tickets</h3>
                      <div className="space-y-3">
                        {selectedRest.menu.map(item => (
                          <div key={item.id} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm">
                            <div>
                              <h4 className="font-extrabold text-sm text-slate-800">{item.name}</h4>
                              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{item.description}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-black text-emerald-600">₹{item.price}</span>
                              <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm">
                                Book Pass
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Live Google Place Reviews & Hours */}
                {((selectedRest.reviews && selectedRest.reviews.length > 0) || selectedRest.openingHours) && (
                  <div className="bg-white border-t border-slate-150 p-6 shrink-0 max-h-[30%] overflow-y-auto shadow-[0_-5px_15px_rgba(0,0,0,0.02)] custom-scrollbar">

                    {/* Opening hours */}
                    {selectedRest.openingHours && (
                      <div className="mb-4">
                        <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Live Hours
                        </h4>
                        <div className="text-xs text-slate-600 space-y-0.5">
                          {selectedRest.openingHours.slice(0, 3).map((day, dIdx) => (
                            <div key={dIdx}>{day}</div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actual Google Reviews */}
                    {selectedRest.reviews && selectedRest.reviews.length > 0 && (
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                          Live Google Reviews
                        </h4>
                        <div className="space-y-3">
                          {selectedRest.reviews.slice(0, 2).map((rev, rIdx) => (
                            <div key={rIdx} className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-700">{rev.author_name}</span>
                                <div className="flex items-center gap-0.5 text-yellow-500 font-bold">
                                  <Star className="w-3 h-3 fill-current" />
                                  {rev.rating}
                                </div>
                              </div>
                              <p className="text-slate-500 mt-1 line-clamp-2 leading-relaxed">"{rev.text}"</p>
                              <span className="text-[10px] text-slate-400 block mt-1">{rev.relative_time_description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}

              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

// Sophisticated, clean light/silver map styling
const silverMapStyles = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#f5f5f5" }]
  },
  {
    "elementType": "labels.icon",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#616161" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#f5f5f5" }]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#bdbdbd" }]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [{ "color": "#eeeeee" }]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{ "color": "#e5e5e5" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9e9e9e" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{ "color": "#ffffff" }]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{ "color": "#dadada" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#616161" }]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9e9e9e" }]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [{ "color": "#e5e5e5" }]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [{ "color": "#eeeeee" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#c9c9c9" }]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9e9e9e" }]
  }
];
