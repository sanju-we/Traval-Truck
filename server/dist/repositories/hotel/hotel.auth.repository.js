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
}
exports.HotelAuthRepository = HotelAuthRepository;
