export interface Place {
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

export interface MindMapTrip {
  id:string;
  title: string;
  orderId:string;
  startDate?: string;
  days: number;
  places: Place[];
  coverImage?: string;
  status: 'Draft' | 'Planned' | 'Booked';
}

export interface EditPlace {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface StartingPosition {
  address: string;
  lat: number;
  lng: number;
}

export interface AIInsights {
  feasibilityStatus: string;
  feasibilityDetails: string;
  dailyTravelDistanceReality: string;
  dailyTravelDistanceDetails: string;
  budgetReliability: string;
  budgetReliabilityDetails: string;
  risks: string[];
  improvements: string[];
}

export interface Budget {
  fuelAmount: number;
  foodAmount: number;
  totalApproximateBudget: number;
}

export interface TimeAllocation {
  drivingHoursAllocatedPerDay: number;
  estimatedActualDrivingTimeInVehicle: string;
  timeForFoodAndActivities: string;
}

export interface RouteMetrics {
  totalDistance: number;
  fuelCost: number;
  days: number;
}

export interface PlanLocation {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

export interface MindMapData {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  places: MindMapPlace[];
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

export interface MindMapPlace {
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

export interface PlaceSuggestion {
  description: string;
  place_id: string;
}

export interface RecommendedPlace {
  name: string;
  description: string;
  placeId: string;
  lat: number;
  lng: number;
}

export interface StartingLocation {
  name: string;
  address: string;
  lat: number;
  lng: number;
  placeId?: string;
}