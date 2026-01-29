'use client';

import { useRouter } from 'next/navigation';
import {
  Calendar,
  MapPin,
  IndianRupee,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  Route,
} from 'lucide-react';

/* ---------------- Types ---------------- */

export interface MindMapDraft {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  partners: number;
  startingPosition: {
    address: string;
    lat: number;
    lng: number;
  };
  budget: {
    fuelAmount: number;
    foodAmount: number;
    totalApproximateBudget: number;
  };
  routeMetrics: {
    totalDistance: number;
    fuelCost: number;
    days: number;
  };
  timeAllocation: {
    drivingHoursAllocatedPerDay: number;
    estimatedActualDrivingTimeInVehicle: string;
    timeForFoodAndActivities: string;
  };
  aiInsights: {
    feasibilityStatus: string;
    feasibilityDetails: string;
    dailyTravelDistanceReality: string;
    dailyTravelDistanceDetails: string;
    budgetReliability: string;
    budgetReliabilityDetails: string;
    risks: string[];
    improvements: string[];
  };
  plan: {
    id: number;
    name: string;
    lat: number;
    lng: number;
  }[][];
}

interface Props {
  draft: MindMapDraft;
  onModify?: () => void;
  onAccept?: () => void;
  isEditMode?: boolean;
}

/* ---------------- Component ---------------- */

export default function MindMapDraftReview({
  draft,
  onModify,
  isEditMode,
  onAccept,
}: Props) {
  const router = useRouter();
  if (!onAccept) return (
    <h1>his</h1>
  )
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 rounded-full">
            <Sparkles className="text-emerald-600" size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Review Your Trip Draft
            </h1>
            <p className="text-gray-500">
              Generated plan • Status:{' '}
              <span className="font-semibold text-orange-600">Draft</span>
            </p>
          </div>
        </div>

        {/* OVERVIEW */}
        <section className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Calendar size={18} /> Trip Overview
          </h2>

          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Title</p>
              <p className="font-medium">{draft.title}</p>
            </div>
            <div>
              <p className="text-gray-500">Date</p>
              <p className="font-medium">
                {new Date(draft.startDate).toDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Partners</p>
              <p className="font-medium">{draft.partners}</p>
            </div>
          </div>
        </section>

        {/* START LOCATION */}
        <section className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <MapPin size={18} /> Starting Location
          </h2>
          <p className="text-gray-700 text-sm">
            {draft.startingPosition.address}
          </p>
        </section>

        {/* ROUTE */}
        <section className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Route size={18} /> Planned Route
          </h2>

          {draft.plan.map((day, index) => (
            <div key={index} className="mb-4">
              <p className="font-medium text-gray-800 mb-2">
                Day {index + 1}
              </p>
              <div className="space-y-2">
                {day.map(place => (
                  <div
                    key={place.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 border rounded-lg"
                  >
                    <MapPin size={14} className="text-emerald-600" />
                    <span className="text-sm">{place.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* BUDGET */}
        <section className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <IndianRupee size={18} /> Budget Summary
          </h2>

          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Fuel</p>
              <p className="font-medium">
                ₹ {draft.budget.fuelAmount.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Food</p>
              <p className="font-medium">₹ {draft.budget.foodAmount}</p>
            </div>
            <div>
              <p className="text-gray-500">Total</p>
              <p className="font-bold text-emerald-600">
                ₹ {draft.budget.totalApproximateBudget.toFixed(2)}
              </p>
            </div>
          </div>
        </section>

        {/* AI INSIGHTS */}
        <section className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Sparkles size={18} /> AI Insights
          </h2>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="font-semibold text-yellow-800">
              Feasibility: {draft.aiInsights.feasibilityStatus}
            </p>
            <p className="text-sm text-yellow-700 mt-1">
              {draft.aiInsights.feasibilityDetails}
            </p>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="font-semibold text-blue-800">
              Budget Reliability: {draft.aiInsights.budgetReliability}
            </p>
            <p className="text-sm text-blue-700 mt-1">
              {draft.aiInsights.budgetReliabilityDetails}
            </p>
          </div>

          <div>
            <p className="font-semibold text-red-700 mb-2 flex items-center gap-2">
              <AlertTriangle size={16} /> Risks
            </p>
            <ul className="list-disc ml-5 text-sm space-y-1">
              {draft.aiInsights.risks.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold text-emerald-700 mb-2 flex items-center gap-2">
              <CheckCircle size={16} /> Suggestions
            </p>
            <ul className="list-disc ml-5 text-sm space-y-1">
              {draft.aiInsights.improvements.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => (onModify ? onModify() : router.push('/mind-map'))}
            className="px-6 py-3 rounded-xl border hover:bg-gray-100"
          >
            Keep as Draft
          </button>

          {isEditMode ? (
            <button
              onClick={() => onAccept()}
              className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 flex items-center gap-2"
            >
              <CheckCircle size={18} />
              Edit & Save Mind-Map
            </button>
          ) : (
            <button
              onClick={() => onAccept()}
              className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 flex items-center gap-2"
            >
              <CheckCircle size={18} />
              Accept & Save Mind-Map
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
