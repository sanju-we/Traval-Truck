import { BaseRepository } from "../../repositories/baseRepository";
import Foods from "../../models/Foods";
import { toFoodDTO } from "../../core/DTO/restaurant/requestDTO";
export class RestaurantFoodRepository extends BaseRepository {
    constructor() {
        super(Foods);
    }
    async findAllFoodsWithPartners(page, lim, search) {
        const limit = lim || 6;
        const skip = (page - 1) * limit;
        const searchFilter = search
            ? { Name: { $regex: search, $options: 'i' } }
            : {};
        const [packages, total] = await Promise.all([
            // .populate('RestaurantId')
            Foods.find(searchFilter)
                .skip(skip)
                .limit(limit)
                .lean(),
            Foods.countDocuments()
        ]);
        // if (!packages.length) throw new Data_Creation_Error();
        return {
            data: packages.map(toFoodDTO),
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
}
