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
    if (aiResult.tripFeasibility.status !== "feasible") {
      throw new Error(
        `Trip not feasible: ${aiResult.tripFeasibility.reason}`
      );
    }

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
      routeMetrics: {
        totalDistance,
        fuelCost,
        days
      },
      aiInsights: {
        feasibility: aiResult.tripFeasibility,
        realism: aiResult.dailyTravelDistanceRealistic,
        budgetReliability: aiResult.budgetReliability,
        risks: aiResult.risks,
        improvements: aiResult.improvements,
        breakdown: aiResult.detailedBreakdown,
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
//   "route": [
//     {
//       "place": "Kozhikode",
//       "distanceToNextKm": 220
//     },
//     {
//       "place": "Mangalore",
//       "distanceToNextKm": 150
//     },
//     {
//       "place": "Udupi",
//       "distanceToNextKm": 280
//     }
//   ],
//   "totalDistanceKm": 650,
//   "daysAvailable": 3,
//   "drivingHoursPerDay": 6,
//   "vehicle": {
//     "type": "car",
//     "mileageKmpl": 16
//   },
//   "fuelCost": 4060,
//   "people": 2,
//   "hotelClass": "3star",
//   "estimatedHotelCost": 9000,
//   "foodPreference": "nonveg",
//   "estimatedFoodCost": 6000,
//   "additionalCosts": {
//     "localTransport": 1500,
//     "activities": 3000
//   }
// }


