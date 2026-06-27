import { MindMapRequest } from "../../core/DTO/user/Request/mindMap";
import { IUserMindMapService } from "../../core/interface/serivice/user/IUser.mindMap.service";
import { IBaseValidator } from "../../core/interface/validator/IBasic.validator";
import { inject, injectable } from "inversify";
import { IAuthRepository } from "../../core/interface/repositorie/User/IAuth.Repository";
import { BADREQUEST, DataNotFoundError, DataUpdatingError } from "../../utils/resAndErrors";
import { buildOptimizedRoute, splitIntoDays, PlaceNode, } from "../../utils/tripPlanner/index";
import { IMindMapRepository } from "../../core/interface/repositorie/User/IMindMap.repository";
import { MindMapResDTO } from "../../core/DTO/user/Response/mindMap.res";
import { validateTripPlan } from "../../services/Ai.service";
import { IUserMapper } from "../../core/interface/mapper/IUserMapper";

@injectable()
export class UserMindMapService implements IUserMindMapService {

  constructor(
    @inject('IBaseValidator') private readonly _baseValidator: IBaseValidator,
    @inject('IAuthRepository') private readonly _userAuth: IAuthRepository,
    @inject('IMindMapRepository') private readonly _mindMapRepo: IMindMapRepository,
    @inject('IUserMapper') private readonly _userMapper : IUserMapper,
  ) { }

  async createMap(data: MindMapRequest, userId: string): Promise<MindMapResDTO> {
    await this._baseValidator.idValidator(userId);
    await this._baseValidator.MindMapValidation(data)

    const user = await this._userAuth.findById(userId);
    if (!user) throw new DataNotFoundError();
    
    const days = (new Date(data.endDate).getDate() - new Date(data.startDate).getDate()) + 1
    if (days <= 0) throw new BADREQUEST();
    
    let startLat, startLng;
    const loca = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(data.startPlace)}&key=${process.env.GOOGLE_MAPS_API_KEY}`);
    const startLoca = await loca.json();
    if (startLoca.status == 'OK') {
      const location = startLoca.results[0].geometry.location;
      startLat = location.lat;
      startLng = location.lng;
    } else throw new DataNotFoundError();
    
    const places: PlaceNode[] = data.places.map(p => ({
      id: p.id,
      name: p.name,
      lat: p.lat,
      lng: p.lng
    }))
    
    const { route, totalDistance } = buildOptimizedRoute(startLat, startLng, places);
    const dayWaysSplit = splitIntoDays<PlaceNode>(route, days)
    const fuelCost = ((totalDistance / Number(data.milage)) * 100)
    
    const pad = (n: number) => n.toString().padStart(2, '0');
    const count = (await this._mindMapRepo.countDocuments({}) + 1).toString().padStart(6, '0')
    const date = new Date()
    const orderId = `ORD-${pad(date.getDate())}${pad(date.getMonth() + 1)}${date.getFullYear()}-${count}`
    
    console.log('llss')
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
    
    const MindMap = {
      orderId,
      title: data.title,
      startDate: data.startDate,
      endDate: data.endDate,
      userId,
      places: data.places,
      startingPosition: {
        address: data.startPlace,
        lat: Number(startLat),
        lng: Number(startLng)
      },
      partners: Number(data.member),
      plan: dayWaysSplit,
      budget: aiResult.budget,
      timeAllocation: aiResult.timeAllocation,
      routeMetrics: {
        totalDistance,
        fuelCost,
        days
      },
      aiInsights: {
        feasibilityStatus: aiResult.tripValidationSummary.feasibilityStatus,
        feasibilityDetails: aiResult.tripValidationSummary.feasibilityDetails,
        dailyTravelDistanceReality: aiResult.tripValidationSummary.dailyTravelDistanceReality,
        dailyTravelDistanceDetails: aiResult.tripValidationSummary.dailyTravelDistanceDetails,
        budgetReliability: aiResult.tripValidationSummary.budgetReliability,
        budgetReliabilityDetails: aiResult.tripValidationSummary.budgetReliabilityDetails,
        risks: aiResult.tripValidationSummary.risks,
        improvements: aiResult.tripValidationSummary.improvements,
      }
    }
    let mindMap

    console.log(data)
    if (!data.id) {
      mindMap = await this._mindMapRepo.create(MindMap)
    } else {
      mindMap = await this._mindMapRepo.update(data.id, { ...MindMap, orderId: data.orderId })
    }
    console.log('kissiki')
    if (!mindMap) throw new DataNotFoundError();
    return await this._userMapper.toMindMapRes(mindMap)
  }

  async getMaps(page: number, userId: string): Promise<{ data: MindMapResDTO[], page: number, total: number, totalPages: number }> {
    const limit = 6;
    const maps = await this._mindMapRepo.findMapsWithPagination(userId, page, limit);
    if (!maps) throw new DataNotFoundError()
    const data = {
      data: await Promise.all(
        maps.data.map(map => this._userMapper.toMindMapRes(map))
      ),
      page: page,
      total: maps.total,
      totalPages: maps.totalPages
    }
    return data
  }

  async getMap(mapId: string): Promise<MindMapResDTO> {
    await this._baseValidator.idValidator(mapId);
    const map = await this._mindMapRepo.findById(mapId);
    if (!map) throw new DataNotFoundError();
    return await this._userMapper.toMindMapRes(map)
  }

  async confirmMap(mapId: string): Promise<MindMapResDTO> {
    await this._baseValidator.idValidator(mapId);
    const map = await this._mindMapRepo.findById(mapId);

    if (!map) throw new DataNotFoundError();
    if (map.status !== 'Draft') throw new BADREQUEST();

    map.status = 'Confirm'
    const updated = await this._mindMapRepo.update(mapId, { status: 'Confirm' })
    if (!updated) throw new DataUpdatingError();
    console.log('updated:', updated)

    return await this._userMapper.toMindMapRes(updated)
  }
}
