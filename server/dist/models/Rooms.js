"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const RoomsSchema = new mongoose_1.Schema({
    RoomNumber: { type: Number },
    Name: { type: String },
    Description: { type: String },
    PricePerNight: { type: Number },
    Capacity: { type: Number },
    Facilities: [{ type: String, }],
    Images: [{ type: String, }],
    roomType: { type: String, enum: ['single', 'double', 'villa'] },
    Reviews: [{
            Comment: { type: String },
            CreatedAt: { type: Date },
            Name: { type: String },
            Rating: { type: String },
            UserId: { type: mongoose_1.Schema.Types.ObjectId },
        }],
    Rating: {
        Average: { type: Number },
        Count: { type: Number },
    },
    AvailableCount: { type: Number },
    Status: { type: String, enum: ['Available', 'Occupid', 'Maintance'] },
    CreatedAt: { type: Date },
    HotelId: { type: mongoose_1.Schema.Types.ObjectId },
    isBlocked: { type: Boolean, default: false }
});
const Rooms = mongoose_1.default.model('Rooms', RoomsSchema);
exports.default = Rooms;
