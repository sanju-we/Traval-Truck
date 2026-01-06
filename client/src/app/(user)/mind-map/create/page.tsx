'use client';
import { LoadScript } from '@react-google-maps/api';
import { useState } from 'react';
import MapSection from '@/components/Map/Map';
import toast from 'react-hot-toast';
import { USER_API_METHODS } from '@/services/APIs/user.api.service';
import { useRouter } from 'next/navigation';

interface Place {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  description: string;
  dayPreference?: number;
  timePreference?: 'morning' | 'afternoon' | 'evening' | 'any';
  selected: boolean;
  placeId: string;
}

interface PlaceSuggestion {
  description: string;
  place_id: string;
}

interface RecommendedPlace {
  name: string;
  description: string;
  placeId: string;
  lat: number;
  lng: number;
}

interface StartingLocation {
  name: string;
  address: string;
  lat: number;
  lng: number;
  placeId?: string;
}

const libraries: Array<"places"> = ["places"];

// Icons
const MapPinIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>);
const SparklesIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"></path><path d="M19 12l.75 2.25L22 15l-2.25.75L19 18l-.75-2.25L16 15l2.25-.75L19 12z"></path></svg>);
const ClockIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>);
const CalendarIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>);
const PlusIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>);
const TrashIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>);
const SearchIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>);
const HomeIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>);
const NavigationIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>);

export default function CreateMindMapPage() {
  const router = useRouter();
  const googeApi = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [member,setMember] = useState('');
  const [vehicle, setVehicle] = useState('car');
  const [milage, setMilage] = useState('');
  const [food,setFood] = useState('veg');
  const [foodAmount, setFoodAmount] = useState('');
  const [room, setRoom] = useState('5 star');
  const [startingPlaceInput, setStartingPlaceInput] = useState('');
  const [startingLocation, setStartingLocation] = useState<StartingLocation | null>(null);
  const [startingSuggestions, setStartingSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [placeInput, setPlaceInput] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [recommendedPlaces, setRecommendedPlaces] = useState<RecommendedPlace[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 10.8505, lng: 76.2711 });

  const tomorrow = new Date();
  const formattedTomorrow = tomorrow.toISOString().split('T')[0];

  const getTotalDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const fetchStartingPlaceSuggestion = (input: string) => {
    if (!input || !window.google) { setStartingSuggestions([]); return; }
    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions({ input }, (predictions, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
        setStartingSuggestions(predictions.map((p) => ({ description: p.description, place_id: p.place_id })));
      } else { setStartingSuggestions([]); }
    });
  };

  const handleStartingPlaceSelect = (placeSuggestion: PlaceSuggestion) => {
    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    service.getDetails({ placeId: placeSuggestion.place_id }, (details) => {
      if (!details?.geometry?.location) return;
      const lat = details.geometry.location.lat();
      const lng = details.geometry.location.lng();
      setStartingLocation({ name: details.name || placeSuggestion.description, address: details.formatted_address || placeSuggestion.description, lat, lng, placeId: placeSuggestion.place_id });
      setMapCenter({ lat, lng });
      setStartingPlaceInput('');
      setStartingSuggestions([]);
      toast.success('Starting location set!');
    });
  };

  const userCurrentPlace = () => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported'); return; }
    setIsLoadingLocation(true);
    toast.loading('Getting location...');
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      try {
        const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googeApi}`);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          setStartingLocation({ name: result.formatted_address.split(',')[0], address: result.formatted_address, lat, lng, placeId: result.place_id });
          setMapCenter({ lat, lng });
          toast.dismiss();
          toast.success('Current location set!');
        }
      } catch (error) {
        toast.dismiss();
        toast.error('Failed to get location');
      } finally { setIsLoadingLocation(false); }
    }, () => { setIsLoadingLocation(false); toast.dismiss(); toast.error('Failed to get location'); });
  };

  const fetchPlaceSuggestion = (input: string) => {
    if (!input || !window.google) { setSuggestions([]); return; }
    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions({ input }, (predictions, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
        setSuggestions(predictions.map((p) => ({ description: p.description, place_id: p.place_id })));
      } else { setSuggestions([]); }
    });
  };

  const handlePlaceSelect = (placeSuggestion: PlaceSuggestion) => {
    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    service.getDetails({ placeId: placeSuggestion.place_id }, (details) => {
      if (!details?.geometry?.location) return;
      const lat = details.geometry.location.lat();
      const lng = details.geometry.location.lng();
      setPlaces((prev) => [...prev, { id: Date.now(), name: details.name || placeSuggestion.description, address: details.formatted_address || placeSuggestion.description, lat, lng, description: details.types?.[0]?.replace(/_/g, ' ') || 'Destination', timePreference: 'any', selected: false, placeId: placeSuggestion.place_id }]);
      setMapCenter({ lat, lng });
      setPlaceInput('');
      setSuggestions([]);
      fetchNearbyPlaces(lat, lng, placeSuggestion.place_id);
    });
  };

  const fetchNearbyPlaces = (lat: number, lng: number, excludePlaceId: string) => {
    if (!window.google) return;
    setIsLoadingRecommendations(true);
    setShowRecommendations(true);
    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    service.nearbySearch({ location: new google.maps.LatLng(lat, lng), radius: 5000, type: 'tourist_attraction' }, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setRecommendedPlaces(results.filter(p => p.place_id !== excludePlaceId).slice(0, 4).map(p => ({ name: p.name || 'Place', description: p.types?.[0]?.replace(/_/g, ' ') || 'Attraction', placeId: p.place_id || '', lat: p.geometry?.location?.lat() || 0, lng: p.geometry?.location?.lng() || 0 })));
      }
      setIsLoadingRecommendations(false);
    });
  };

  const addRecommendedPlace = (rec: RecommendedPlace) => setPlaces([...places, { id: Date.now(), name: rec.name, address: `Near ${places[places.length - 1]?.name || 'location'}`, lat: rec.lat, lng: rec.lng, description: rec.description, timePreference: 'any', selected: false, placeId: rec.placeId }]);
  const removePlace = (id: number) => setPlaces(places.filter(p => p.id !== id));
  const togglePlaceSelection = (id: number) => setPlaces(places.map(p => p.id === id ? { ...p, selected: !p.selected } : p));
  const updatePlaceDay = (id: number, day: number) => setPlaces(places.map(p => p.id === id ? { ...p, dayPreference: day } : p));
  const updatePlaceTime = (id: number, time: 'morning' | 'afternoon' | 'evening' | 'any') => setPlaces(places.map(p => p.id === id ? { ...p, timePreference: time } : p));

  const generateTrip = async () => {
    const selectedPlaces = places.filter(p => p.selected);
    if (!startingLocation) { toast.error('Set starting location!'); return; }
    if (selectedPlaces.length === 0) { toast.error('Select at least one place!'); return; }
    if (!title || !startDate || !endDate) { toast.error('Fill in all details!'); return; }
    console.log(startingLocation)
    const data = await USER_API_METHODS.generateMap({ title, startDate, endDate, startPlace:startingLocation.address, places: selectedPlaces, vehicle, milage, food, foodAmount, room, member });
    if (data.success) { toast.success('Mind-Map created!'); router.push('/mind-map'); }
  };

  const totalDays = getTotalDays();

  // Replace the return statement in the main component with this:

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} libraries={libraries}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

          {/* Trip Header */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-800 mb-6">
              <span className="text-emerald-600"><SparklesIcon /></span>
              Create Your Trip Mind-Map
            </h1>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trip Title</label>
                <input placeholder="e.g., Kerala Adventure 2025" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input type="date" value={startDate} min={formattedTomorrow} onChange={(e) => setStartDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select members</label>
                <input type="number" min={0} max={5} placeholder='Select members 1-5' value={member} onChange={(e)=>setMember(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Choose the Travel Method</label>
                <select name="vehicle" id="vehicleId" value={vehicle} onChange={(e)=>setVehicle(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none">
                  <option disabled>Select a option</option>
                  <option value="car">Cars</option>
                  <option value="bike">Bike</option>
                  <option value="traveller">Traveller</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle milage</label>
                <input type="number" min={10} max={100} value={milage} onChange={(e)=> setMilage(e.target.value)} placeholder='eg. 65' className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Food preference</label>
                <select name="food" id="foodId" value={food} onChange={(e) => setFood(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none">
                  <option disabled>Select a option</option>
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non-Veg</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimate amount for food</label>
                <input type="number" min={100} max={50000} value={foodAmount} onChange={(e)=>setFoodAmount(e.target.value)} placeholder='eg. 1500' className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Room preference</label>
                <select name="room" id="roomId" value={room} onChange={(e)=>setRoom(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none">
                  <option disabled>Select a option</option>
                  <option value="5 star">5 star</option>
                  <option value="4 star">4 star</option>
                  <option value="3 star">3 star</option>
                  <option value="2&1 star">below 3 star</option>
                </select>
              </div>
            </div>
            {totalDays > 0 && (
              <div className="mt-4 text-center">
                <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
                  <CalendarIcon />
                  {totalDays} {totalDays === 1 ? 'Day' : 'Days'} Trip
                </span>
              </div>
            )}
          </div>

          {/* Main Section */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Panel */}
            <div className="space-y-6">

              {/* Starting Location */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-lg border border-blue-200">
                <label className="text-sm font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <HomeIcon />
                  Starting Location (Required)
                </label>
                {startingLocation ? (
                  <div className="bg-white p-4 rounded-lg border-2 border-blue-400 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-blue-600 font-semibold text-lg">🏠</span>
                          <h4 className="font-semibold text-gray-800">{startingLocation.name}</h4>
                        </div>
                        <p className="text-xs text-gray-600 ml-7">{startingLocation.address}</p>
                      </div>
                      <button onClick={() => setStartingLocation(null)} className="text-red-500 hover:text-red-700 transition ml-2 p-1">
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <input placeholder="Search for your starting point..." value={startingPlaceInput} onChange={(e) => { setStartingPlaceInput(e.target.value); fetchStartingPlaceSuggestion(e.target.value); }} className="w-full border border-blue-300 rounded-lg pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white" />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"><SearchIcon /></div>
                    </div>
                    {startingSuggestions.length > 0 && (
                      <div className="border border-blue-200 rounded-lg mt-2 bg-white shadow-lg max-h-60 overflow-y-auto">
                        {startingSuggestions.map((s) => (
                          <button key={s.place_id} onClick={() => handleStartingPlaceSelect(s)} className="block w-full text-left px-4 py-3 hover:bg-blue-50 text-sm border-b border-gray-100 last:border-b-0 transition">
                            <span className="flex items-center gap-2 text-gray-800"><MapPinIcon />{s.description}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    <button onClick={userCurrentPlace} disabled={isLoadingLocation} className="w-full mt-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                      {isLoadingLocation ? (<><div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>Getting Location...</>) : (<><NavigationIcon />Use My Current Location</>)}
                    </button>
                  </>
                )}
              </div>

              {/* Search Places */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-3">Search Places to Visit</label>
                <div className="relative">
                  <input placeholder="Search for destinations..." value={placeInput} onChange={(e) => { setPlaceInput(e.target.value); fetchPlaceSuggestion(e.target.value); }} className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></div>
                </div>
                {suggestions.length > 0 && (
                  <div className="border border-gray-200 rounded-lg mt-2 bg-white shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((s) => (
                      <button key={s.place_id} onClick={() => handlePlaceSelect(s)} className="block w-full text-left px-4 py-3 hover:bg-emerald-50 text-sm border-b border-gray-100 last:border-b-0 transition">
                        <span className="flex items-center gap-2"><MapPinIcon />{s.description}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Places */}
              {places.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800">
                    <span className="text-emerald-600"><MapPinIcon /></span>
                    Your Places ({places.filter(p => p.selected).length} selected)
                  </h3>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {places.map((place, index) => (
                      <div key={place.id} className={`border-2 rounded-xl p-4 transition-all ${place.selected ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-xs font-bold text-gray-700">{index + 1}</span>
                              <input type="checkbox" checked={place.selected} onChange={() => togglePlaceSelection(place.id)} className="w-5 h-5 rounded border-gray-300 cursor-pointer" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">{place.name}</h4>
                              <p className="text-xs text-gray-500 mt-1">{place.address}</p>
                            </div>
                          </div>
                          <button onClick={() => removePlace(place.id)} className="text-red-500 hover:text-red-700 transition p-1"><TrashIcon /></button>
                        </div>
                        {place.selected && totalDays > 0 && (
                          <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-200">
                            <div>
                              <label className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1"><CalendarIcon />Day Preference</label>
                              <select value={place.dayPreference || ''} onChange={(e) => updatePlaceDay(place.id, Number(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                                <option value="">Auto-assign</option>
                                {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => (<option key={day} value={day}>Day {day}</option>))}
                              </select>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1"><ClockIcon />Time Preference</label>
                              <select value={place.timePreference} onChange={(e) => updatePlaceTime(place.id, e.target.value as any)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                                <option value="any">Any Time</option>
                                <option value="morning">Morning</option>
                                <option value="afternoon">Afternoon</option>
                                <option value="evening">Evening</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {showRecommendations && (
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-2xl shadow-lg border border-purple-200">
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-purple-900">
                    <span className="text-purple-600"><SparklesIcon /></span>
                    Recommended Nearby Places
                  </h4>
                  {isLoadingRecommendations ? (
                    <div className="text-center py-4">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-200 border-t-purple-600"></div>
                      <p className="text-sm text-purple-700 mt-2">Finding attractions...</p>
                    </div>
                  ) : recommendedPlaces.length > 0 ? (
                    <div className="space-y-2">
                      {recommendedPlaces.map((rec, i) => (
                        <div key={i} className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition">
                          <div>
                            <p className="font-medium text-gray-800">{rec.name}</p>
                            <p className="text-xs text-gray-600 capitalize">{rec.description}</p>
                          </div>
                          <button onClick={() => addRecommendedPlace(rec)} className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 ml-4">
                            <PlusIcon />Add
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-purple-700 text-center py-4">No nearby attractions found</p>
                  )}
                </div>
              )}

              {/* Trip Summary */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="font-bold text-lg mb-4 text-gray-800">Trip Summary</h3>
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Starting Point:</span>
                    <span className={`font-semibold ${startingLocation ? 'text-blue-600' : 'text-red-600'}`}>
                      {startingLocation ? '✓ Set' : '✗ Not Set'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Places:</span>
                    <span className="font-semibold">{places.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Selected Places:</span>
                    <span className="font-semibold text-emerald-600">{places.filter(p => p.selected).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trip Duration:</span>
                    <span className="font-semibold">{totalDays > 0 ? `${totalDays} days` : 'Not set'}</span>
                  </div>
                </div>
                <button onClick={generateTrip} className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-4 rounded-xl font-bold hover:from-emerald-700 hover:to-blue-700 transition flex items-center justify-center gap-2 shadow-lg">
                  <SparklesIcon />Generate Mind-Map
                </button>
                <p className="text-xs text-center text-gray-500 mt-2">AI will optimize your itinerary</p>
              </div>
            </div>

            {/* Right Panel - Map */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-6">
                <MapSection mapCenter={mapCenter} places={places} startingLocation={startingLocation} />
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Set your starting location first</li>
                  <li>• Search and select places to visit</li>
                  <li>• Set day/time preferences (optional)</li>
                  <li>• Blue pin = starting point</li>
                  <li>• AI optimizes your route automatically</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LoadScript>
  );
}