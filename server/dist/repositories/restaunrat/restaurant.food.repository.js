import { BaseRepository } from "../../repositories/baseRepository.js";
import Foods from "../../models/Foods.js";
export class RestaurantFoodRepository extends BaseRepository {
    constructor() {
        super(Foods);
    }
}
