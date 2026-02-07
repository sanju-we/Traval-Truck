"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelAuthRepository = void 0;
const baseRepository_1 = require("../../repositories/baseRepository");
const Hotel_1 = require("../../models/Hotel");
class HotelAuthRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(Hotel_1.Hotel);
    }
    async updateHotelPasswordById(id, hashedPassword) {
        await this.update(id, { password: hashedPassword });
    }
    async findByIdAndUpdateAction(id, action, field, reason) {
        if (reason != '') {
            await Hotel_1.Hotel.findByIdAndUpdate(id, { reason: reason });
        }
        await Hotel_1.Hotel.findByIdAndUpdate(id, { [field]: action });
    }
    async findAllWithpagination(query, limit, page) {
        const skip = (page - 1) * limit;
        const filter = {};
        if (query.search) {
            filter['$or'] = [
                { companyName: { $regex: query.search, $options: 'i' } },
                { email: { $regex: query.search, $options: 'i' } },
            ];
        }
        if (query.status) {
            if (query.status === 'Activity') {
                filter.isApproved = true;
            }
            else if (query.status === 'Blocked') {
                filter.isRestricted = true;
            }
            else if (query.status === 'Pending') {
                filter.isApproved = false;
                filter.isRestricted = false;
            }
        }
        const data = await Hotel_1.Hotel.find(filter).skip(skip).limit(limit).exec();
        const total = await Hotel_1.Hotel.countDocuments(filter).exec();
        const totalPages = Math.ceil(total / limit);
        return { data, total, totalPages };
    }
}
exports.HotelAuthRepository = HotelAuthRepository;
