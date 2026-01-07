import { MindMapRequest } from "../../core/DTO/user/Request/mindMap.js";
import { IUserMindMapService } from "../../core/interface/serivice/user/IUser.mindMap.service.js";
import { IBaseValidator } from "../../core/interface/validator/IBasic.validator.js";
import { inject, injectable } from "inversify";
import { IAuthRepository } from "../../core/interface/repositorie/User/IAuth.Repository.js";
import { BADREQUEST, DataNotFoundError } from "../../utils/resAndErrors.js";
import { buildOptimizedRoute, splitIntoDays, PlaceNode, getDistanceInKm, } from "../../utils/tripPlanner/index.js";
import { IMindMapRepository } from "../../core/interface/repositorie/User/IMindMap.repository.js";
import { MindMapResDTO, toMindMapRes } from "../../core/DTO/user/Response/mindMap.res.js";
import { validateTripPlan } from "../../services/Ai.service.js";

@injectable()
export class UserMindMapService implements IUserMindMapService {

  constructor(
    @inject('IBaseValidator') private readonly _baseValidator: IBaseValidator,
    @inject('IAuthRepository') private readonly _userAuth: IAuthRepository,
    @inject('IMindMapRepository') private readonly _mindMapRepo: IMindMapRepository,
  ) { }

  async createMap(data: MindMapRequest, userId: string): Promise<MindMapResDTO> {
    await this._baseValidator.idValidator(userId);
    // create a validator for the mind map

    const user = await this._userAuth.findById(userId);
    if (!user) throw new DataNotFoundError();

    const days = (new Date(data.endDate).getDate() - new Date(data.startDate).getDate()) + 1
    if (days <= 0) throw new BADREQUEST();

    // start Date Lat and Lng find
    let startLat, startLng;
    const loca = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(data.startPlace)}&key=${process.env.GOOGLE_MAPS_API_KEY}`);
    const startLoca = await loca.json();
    if (startLoca.status == 'OK') {
      const location = startLoca.results[0].geometry.location;
      startLat = location.lat,
        startLng = location.lng
    } else throw new DataNotFoundError();

    const places: PlaceNode[] = data.places.map(p => ({
      id: p.id,
      name: p.name,
      lat: p.lat,
      lng: p.lng
    }))

    // const distance = getDistanceInKm()
    const { route, totalDistance } = buildOptimizedRoute(startLat, startLng, places);
    const dayWaysSplit = splitIntoDays<PlaceNode>(route, days)

    const fuelCost = ((totalDistance / Number(data.milage)) * 100)

    const pad = (n: number) => n.toString().padStart(2, '0');
    const count = (await this._mindMapRepo.countDocuments() + 1).toString().padStart(6, '0')
    const date = new Date()
    const orderId = `ORD-${pad(date.getDate())}${pad(date.getMonth() + 1)}${date.getFullYear()}-${count}`

    const aiValidationPayload = {
      route,
      totalDistanceKm: totalDistance,
      daysAvailable: days,
      drivingHoursPerDay: 6,

      vehicle: {
        type: data.vehicle,
        mileage: data.milage
      },

      fuelCost,
      people: Number(data.member),
      hotelClass: data.hotelTyep,
      foodPreference: data.food,
      estimatedFoodCost: Number(data.foodAmount)
    };
    const aiResult = await validateTripPlan(aiValidationPayload)
    // if (aiResult.tripFeasibility.status !== "feasible") {
    //   throw new Error(
    //     `Trip not feasible: ${aiResult.tripFeasibility.reason}`
    //   );
    // }

    const MindMap = {
      orderId,
      title: data.title,
      startDate: data.startDate,
      endDate: data.endDate,
      userId,
      places:data.places,
      startingPosition: {
        address: data.startPlace,
        lat: Number(startLat),
        lng: Number(startLng)
      },
      partners:Number(data.member),
      plan: dayWaysSplit,
      budget:aiResult.budget,
      timeAllocation:aiResult.timeAllocation,
      routeMetrics: {
        totalDistance,
        fuelCost,
        days
      },
      aiInsights: {
        feasibilityStatus:aiResult.tripValidationSummary.feasibilityStatus,
        feasibilityDetails:aiResult.tripValidationSummary.feasibilityDetails,
        dailyTravelDistanceReality:aiResult.tripValidationSummary.dailyTravelDistanceReality,
        dailyTravelDistanceDetails:aiResult.tripValidationSummary.dailyTravelDistanceDetails,
        budgetReliability:aiResult.tripValidationSummary.budgetReliability,
        budgetReliabilityDetails:aiResult.tripValidationSummary.budgetReliabilityDetails,
        risks:aiResult.tripValidationSummary.risks,
        improvements:aiResult.tripValidationSummary.improvements,
      }
    }

    const mindMap = await this._mindMapRepo.create(MindMap)
    console.log(mindMap)
    return toMindMapRes(mindMap)
  }

  async getMaps(page: number, userId: string): Promise<{ data: MindMapResDTO[], page: number }> {
    const maps = await this._mindMapRepo.findMapsWithPagination(userId, page);
    if (!maps) throw new DataNotFoundError()
    const data = {
      data: maps,
      page: page
    }
    return data
  }
}

// {
//   tripValidationSummary: {
//     feasibilityStatus: 'Highly Feasible',
//     feasibilityDetails: 'The trip involves a total estimated driving time of approximately 4 hours 13 minutes for the entire route, which is well within the allocated 6 hours for driving on a single day. This leaves ample time for activities, meals, and unforeseen delays, making the trip easily achievable within the given timeframe.',
//     dailyTravelDistanceReality: 'Realistic',
//     dailyTravelDistanceDetails: 'The total distance of 168.73 km for a single day is a moderate and highly realistic travel distance, especially for bike travel. It does not demand excessive driving time or rush.',
//     budgetReliability: 'Reliable',
//     budgetReliabilityDetails: 'The estimated fuel cost (241.04) and food cost (1500) for two people on a day trip are reasonable. However, the budget does not include potential costs for activities, entry fees, or miscellaneous expenses, which could impact overall spending.',    
//     risks: [
//       'No budget allocated for activities, entry fees, or miscellaneous expenses.',
//       'Bike travel is weather-dependent; sudden changes in weather could impact travel comfort and safety.',
//       'Road conditions, especially towards Wayanad, might be winding or hilly, potentially slowing down actual travel more than estimated.',
//       'Limited flexibility for unexpected delays or extended stays at any location due to the single-day timeframe.'
//     ],
//     improvements: [
//       'Allocate a separate budget for activities, entry fees, and parking charges.',
//       'Include a small buffer for miscellaneous expenses or emergencies.',
//       'Check the weather forecast before the trip, especially for bike travel.',
//       'Ensure the bike is serviced and in good condition, and consider carrying a basic repair kit.'
//     ]
//   },
//   tripDetails: {
//     route: [ [Object], [Object], [Object], [Object] ],
//     totalDistanceKm: 168.73,
//     daysAvailable: 1,
//     peopleTraveling: 2,
//     vehicleType: 'bike',
//     vehicleMileageKmpl: 70,
//     foodPreference: 'non-veg'
//   },
//   budget: {
//     fuelAmount: 241.04,
//     foodAmount: 1500,
//     totalApproximateBudget: 1741.04
//   },
//   timeAllocation: {
//     drivingHoursAllocatedPerDay: 6,
//     estimatedActualDrivingTimeInVehicle: '4 hours 13 minutes',        
//     timeForFoodAndActivities: 'Approximately 2 hours for meals and short breaks, leaving about 8 hours for dedicated activities and sightseeing.'
//   }
// }