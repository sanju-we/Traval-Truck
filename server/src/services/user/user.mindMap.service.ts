import { MindMapRequest } from "../../core/DTO/user/Request/mindMap.js";
import { IUserMindMapService } from "../../core/interface/serivice/user/IUser.mindMap.service.js";
import { IBaseValidator } from "../../core/interface/validator/IBasic.validator.js";
import { inject, injectable } from "inversify";
import { IAuthRepository } from "../../core/interface/repositorie/User/IAuth.Repository.js";
import { DataNotFoundError } from "../../utils/resAndErrors.js";
import { buildOptimizedRoute, splitIntoDays, PlaceNode, } from "../../utils/tripPlanner/index.js";
import { IMindMapRepository } from "../../core/interface/repositorie/User/IMindMap.repository.js";
import { MindMapResDTO, toMindMapRes } from "../../core/DTO/user/Response/mindMap.res.js";

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

    const route = buildOptimizedRoute(startLat, startLng, places);
    const dayWaysSplit = splitIntoDays<PlaceNode>(route, days)

    const pad = (n: number) => n.toString().padStart(2, '0');
    const count = (await this._mindMapRepo.countDocuments() + 1).toString().padStart(6, '0')
    const date = new Date()
    const orderId = `ORD-${pad(date.getDate())}${pad(date.getMonth() + 1)}${date.getFullYear()}-${count}`

    const newMindMap = {
      orderId,
      title: data.title,
      startDate: data.startDate,
      endDate: data.endDate,
      places: data.places,
      startingPosition: data.startingPostition,
      userId: userId,
      plan: dayWaysSplit
    }
    const mindMap = await this._mindMapRepo.create(newMindMap)
    return toMindMapRes(mindMap)
  }
}

// {
//   title: 'Trip-01',
//   startDate: '2026-01-03',
//   startPlace: 'KINFRA Tehcno Industrial Park, 747- R, Kakkanchery, MALAPPURAM, Kerala 673634, India',
//   endDate: '2026-01-04',
//   places: [
//     {
//       id: 1767366149834,
//       name: 'Kozhikode',
//       address: 'Kozhikode, Kerala, India',
//       lat: 11.2488425,
//       lng: 75.78392099999999,
//       description: 'locality',
//       timePreference: 'any',
//       selected: true,
//       placeId: 'ChIJR0c9VjhZpjsRq-wyykEGFTI'
//     },
//     {
//       id: 1767366164814,
//       name: 'Kovalam Beach',
//       address: 'Kovalam Beach, Kerala 695521, India',
//       lat: 8.3837841,
//       lng: 76.98041760000001,
//       description: 'neighborhood',
//       timePreference: 'any',
//       selected: true,
//       placeId: 'ChIJ17_bmbulBTsRtakQ3EdZQco'
//     }
//   ]
// }