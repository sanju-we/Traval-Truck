'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Loader2,
  MapPin,
  Calendar,
  Users,
  IndianRupee,
  Route,
  Fuel,
  Clock,
  ArrowLeft,
  Globe,
  Lock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Target,
  BarChart3,
  Navigation,
  Compass,
  Utensils,
  Timer,
  Activity,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { USER_API_METHODS } from '@/services/APIs/user.api.service';
import RouteMap from '@/components/user/MindMapRoutes';

interface Place {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface StartingPosition {
  address: string;
  lat: number;
  lng: number;
}

interface AIInsights {
  feasibilityStatus: string;
  feasibilityDetails: string;
  dailyTravelDistanceReality: string;
  dailyTravelDistanceDetails: string;
  budgetReliability: string;
  budgetReliabilityDetails: string;
  risks: string[];
  improvements: string[];
}

interface Budget {
  fuelAmount: number;
  foodAmount: number;
  totalApproximateBudget: number;
}

interface TimeAllocation {
  drivingHoursAllocatedPerDay: number;
  estimatedActualDrivingTimeInVehicle: string;
  timeForFoodAndActivities: string;
}

interface RouteMetrics {
  totalDistance: number;
  fuelCost: number;
  days: number;
}

interface PlanLocation {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

interface MindMapData {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  places: Place[];
  startingPosition: StartingPosition;
  partners: number;
  budget: Budget;
  routeMetrics: RouteMetrics;
  aiInsights: AIInsights;
  timeAllocation: TimeAllocation;
  userId: string;
  orderId: string;
  status: 'Draft' | 'Ongoing' | 'Completed';
  plan: PlanLocation[][];
  tripProgress: string[];
  isPublic: boolean;
  createdAt: string;
  updateAt: string;
}

export default function MindMapDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [mindMap, setMindMap] = useState<MindMapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(0);

  const id = typeof params.id === 'string' ? params.id : params.id?.[0];

  useEffect(() => {
    if (id) fetchMindMapDetails(id);
  }, [id]);

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
          <Loader2 className="animate-spin w-12 h-12 text-blue-500" />
          <p className="text-gray-600 font-medium">Invalid URL</p>
        </div>
      </div>
    );
  }

  const fetchMindMapDetails = async (mindMapId: string) => {
    try {

      const data = await USER_API_METHODS.MindMapDetails(id)

      if (data.success) {
        setMindMap(data.data);
        console.log(data.data)
      } else {
        toast.error('Failed to load mind map details');
      }
    } catch (error) {
      console.error('Error fetching mind map:', error);
      toast.error('An error occurred while loading the mind map');
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
          <Loader2 className="animate-spin w-12 h-12 text-blue-500" />
          <p className="text-gray-600 font-medium">Loading mind map...</p>
        </div>
      </div>
    );
  }
  console.log(mindMap)
  if (!mindMap) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Compass className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">Mind map not found</h3>
          <p className="text-gray-500 mt-2">The mind map you're looking for doesn't exist</p>
          <button
            onClick={() => router.back()}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  const handleSubmit = async () => {
    const data = await USER_API_METHODS.submitTheMindmap(mindMap.id)
    if (data.success) {
      toast.success('Mind Map confirmed')
      setMindMap(data.data)
    }
  }
  const handleEdit = async () => {
    router.push(`/mind-map/edit/${mindMap.id}`)
  }

  const tripDuration = Math.ceil(
    (new Date(mindMap.endDate).getDate() - new Date(mindMap.startDate).getDate())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'Ongoing':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Completed':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Feasible':
      case 'Reliable':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Challenging':
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Unrealistic':
      case 'Unreliable':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <h1 className="text-3xl font-bold text-gray-800">{mindMap.title}</h1>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                      mindMap.status
                    )}`}
                  >
                    {mindMap.status}
                  </span>
                  {mindMap.isPublic ? (
                    <span className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                      <Globe size={14} />
                      Public
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-200">
                      <Lock size={14} />
                      Private
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm">Order ID: {mindMap.orderId}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <Calendar className="text-blue-600 mb-2" size={24} />
                <p className="text-xs text-blue-700 font-medium mb-1">Duration</p>
                <p className="text-2xl font-bold text-blue-900">{tripDuration + 1} days</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <MapPin className="text-purple-600 mb-2" size={24} />
                <p className="text-xs text-purple-700 font-medium mb-1">Destinations</p>
                <p className="text-2xl font-bold text-purple-900">{mindMap.places.length}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <IndianRupee className="text-green-600 mb-2" size={24} />
                <p className="text-xs text-green-700 font-medium mb-1">Total Budget</p>
                <p className="text-2xl font-bold text-green-900">
                  ₹{mindMap.budget?.totalApproximateBudget?.toFixed(2).toLocaleString() || 0}
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                <Users className="text-orange-600 mb-2" size={24} />
                <p className="text-xs text-orange-700 font-medium mb-1">Travelers</p>
                <p className="text-2xl font-bold text-orange-900">{mindMap.partners}</p>
              </div>
            </div>
          </div>
        </div>

        {mindMap && (
          <RouteMap
            title={mindMap.title}
            status={mindMap.status}
            startingPosition={mindMap.startingPosition}
            places={mindMap.places}
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
          />
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Trip Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Navigation className="text-blue-600" size={28} />
                Trip Information
              </h2>

              <div className="space-y-6">
                {/* Dates */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Start Date</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(mindMap.startDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">End Date</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(mindMap.endDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {/* Starting Position */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-blue-700 font-medium mb-1">Starting Point</p>
                      <p className="text-gray-800 font-semibold">{mindMap.startingPosition.address}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {mindMap.startingPosition.lat.toFixed(6)}, {mindMap.startingPosition.lng.toFixed(6)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Breakdown */}
            {mindMap.budget && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <IndianRupee className="text-green-600" size={28} />
                  Budget Breakdown
                </h2>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Fuel className="text-blue-600 mb-2" size={24} />
                    <p className="text-sm text-blue-700 font-medium mb-1">Fuel Cost</p>
                    <p className="text-2xl font-bold text-blue-900">
                      ₹{mindMap.budget.fuelAmount?.toFixed(2).toLocaleString() || 0}
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <Utensils className="text-orange-600 mb-2" size={24} />
                    <p className="text-sm text-orange-700 font-medium mb-1">Food Budget</p>
                    <p className="text-2xl font-bold text-orange-900">
                      ₹{mindMap.budget.foodAmount?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <TrendingUp className="text-green-600 mb-2" size={24} />
                    <p className="text-sm text-green-700 font-medium mb-1">Total Budget</p>
                    <p className="text-2xl font-bold text-green-900">
                      ₹{mindMap.budget.totalApproximateBudget?.toFixed(2).toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Route Metrics */}
            {mindMap.routeMetrics && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Route className="text-purple-600" size={28} />
                  Route Metrics
                </h2>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <Route className="text-purple-600 mb-2" size={24} />
                    <p className="text-sm text-purple-700 font-medium mb-1">Total Distance</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {mindMap.routeMetrics.totalDistance.toFixed(2)} km
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <Fuel className="text-orange-600 mb-2" size={24} />
                    <p className="text-sm text-orange-700 font-medium mb-1">Fuel Cost</p>
                    <p className="text-2xl font-bold text-orange-900">
                      ₹{mindMap.routeMetrics.fuelCost?.toFixed(2).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Clock className="text-blue-600 mb-2" size={24} />
                    <p className="text-sm text-blue-700 font-medium mb-1">Travel Days</p>
                    <p className="text-2xl font-bold text-blue-900">{mindMap.routeMetrics.days}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Time Allocation */}
            {mindMap.timeAllocation && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Timer className="text-indigo-600" size={28} />
                  Time Allocation
                </h2>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <Clock className="text-indigo-600 mb-2" size={24} />
                    <p className="text-sm text-indigo-700 font-medium mb-1">Driving Hours/Day</p>
                    <p className="text-2xl font-bold text-indigo-900">
                      {mindMap.timeAllocation.drivingHoursAllocatedPerDay}h
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Navigation className="text-blue-600 mb-2" size={24} />
                    <p className="text-sm text-blue-700 font-medium mb-1">Actual Driving Time</p>
                    <p className="text-lg font-bold text-blue-900">
                      {mindMap.timeAllocation.estimatedActualDrivingTimeInVehicle}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <Activity className="text-green-600 mb-2" size={24} />
                    <p className="text-sm text-green-700 font-medium mb-1">Food & Activities</p>
                    <p className="text-lg font-bold text-green-900">
                      {mindMap.timeAllocation.timeForFoodAndActivities}
                    </p>
                  </div>
                </div>
              </div>
            )}


          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Destinations List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="text-blue-600" size={22} />
                All Destinations ({mindMap.places.length})
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {mindMap.places.map((place, idx) => (
                  <div
                    key={place.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate">{place.name}</p>
                        <p className="text-xs text-gray-600 truncate">{place.address}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trip Progress */}
            {mindMap.tripProgress && mindMap.tripProgress.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="text-green-600" size={22} />
                  Trip Progress
                </h3>
                <div className="space-y-2">
                  {mindMap.tripProgress.map((milestone, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="text-green-600 flex-shrink-0" size={16} />
                      <span>{milestone}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Metadata</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-400 mb-1">Created</p>
                  <p className="font-medium">
                    {new Date(mindMap.createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 mb-1">Last Updated</p>
                  <p className="font-medium">
                    {new Date(mindMap.updateAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 mb-1">Visibility</p>
                  <p className="font-medium">
                    {mindMap.isPublic ? 'Public' : 'Private'}
                  </p>
                </div>

                {/* <div>
                  <p className="text-gray-400 mb-1">Owner</p>
                  <p className="font-medium truncate">{mindMap.userId}</p>
                </div> */}
              </div>
            </div>
          </div>
        </div><br />
        {/* Day-by-Day Plan */}
        {mindMap.plan && mindMap.plan.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Calendar className="text-blue-600" size={28} />
              Day-by-Day Itinerary
            </h2>

            {/* Day Selector */}
            <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
              {mindMap.plan.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDay(idx)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition ${selectedDay === idx
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Day {idx + 1}
                </button>
              ))}
            </div>

            {/* Selected Day Locations */}
            <div className="space-y-4">
              {mindMap.plan[selectedDay]?.map((location, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{location.name}</h4>
                    <p className="text-xs text-gray-500">
                      {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </p>
                  </div>
                  <MapPin className="text-blue-600 flex-shrink-0" size={20} />
                </div>
              ))}
            </div>
          </div>
        )}
        <br />
        {/* AI Insights */}
        {mindMap.aiInsights && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <BarChart3 className="text-purple-600" size={28} />
              AI-Powered Insights
            </h2>

            <div className="space-y-6">
              {/* Feasibility */}
              {mindMap.aiInsights.feasibilityStatus && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-green-900">Feasibility Analysis</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(mindMap.aiInsights.feasibilityStatus)}`}>
                          {mindMap.aiInsights.feasibilityStatus}
                        </span>
                      </div>
                      <p className="text-sm text-green-800">{mindMap.aiInsights.feasibilityDetails}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Daily Travel Distance Reality */}
              {mindMap.aiInsights.dailyTravelDistanceReality && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3 mb-3">
                    <Target className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-blue-900">Daily Travel Reality</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(mindMap.aiInsights.dailyTravelDistanceReality)}`}>
                          {mindMap.aiInsights.dailyTravelDistanceReality}
                        </span>
                      </div>
                      <p className="text-sm text-blue-800">{mindMap.aiInsights.dailyTravelDistanceDetails}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Budget Reliability */}
              {mindMap.aiInsights.budgetReliability && (
                <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
                  <div className="flex items-start gap-3 mb-3">
                    <TrendingUp className="text-purple-600 mt-1 flex-shrink-0" size={20} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-purple-900">Budget Reliability</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(mindMap.aiInsights.budgetReliability)}`}>
                          {mindMap.aiInsights.budgetReliability}
                        </span>
                      </div>
                      <p className="text-sm text-purple-800">{mindMap.aiInsights.budgetReliabilityDetails}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Risks */}
              {mindMap.aiInsights.risks && mindMap.aiInsights.risks.length > 0 && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="text-red-600 mt-1 flex-shrink-0" size={20} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-red-900 mb-2">Potential Risks</h3>
                      <ul className="space-y-1">
                        {mindMap.aiInsights.risks.map((risk, idx) => (
                          <li key={idx} className="text-sm text-red-800">• {risk}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Improvements */}
              {mindMap.aiInsights.improvements && mindMap.aiInsights.improvements.length > 0 && (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="text-yellow-600 mt-1 flex-shrink-0" size={20} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-yellow-900 mb-2">Suggested Improvements</h3>
                      <ul className="space-y-1">
                        {mindMap.aiInsights.improvements.map((improvement, idx) => (
                          <li key={idx} className="text-sm text-yellow-800">• {improvement}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <br />
        {mindMap.status == 'Draft' && (
          <div>
            <button onClick={handleSubmit} className="px-6 py-3 w-full justify-center rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 flex items-center gap-2">
              Save Draft
            </button> <br />
            <button onClick={handleEdit} className="px-6 py-3  w-full justify-center rounded-xl border hover:bg-gray-100">
              Edit Draft
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
