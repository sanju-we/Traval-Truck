"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPublicId = exports.deleteImage = exports.multipleUploads = exports.singleUpload = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const streamifier_1 = __importDefault(require("streamifier"));
const logger_1 = require("./logger");
const resAndErrors_1 = require("./resAndErrors");
const singleUpload = (file, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.default.uploader.upload_stream({ folder: folder }, (error, result) => {
            if (error)
                reject(error);
            else if (result)
                resolve(result.secure_url);
        });
        streamifier_1.default.createReadStream(file.buffer).pipe(uploadStream);
    });
};
exports.singleUpload = singleUpload;
const multipleUploads = async (files, folder) => {
    const urls = [];
    for (const file of files) {
        const url = await (0, exports.singleUpload)(file, folder);
        urls.push(url);
    }
    return urls;
};
exports.multipleUploads = multipleUploads;
const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary_1.default.uploader.destroy(publicId);
        logger_1.logger.error(`result = ${JSON.stringify(result)}`);
        if (result.result !== 'ok') {
            throw new resAndErrors_1.Files_Missing();
        }
        return result;
    }
    catch (error) {
        logger_1.logger.error('Error deleting image from Cloudinary:', error);
        throw new Error('Error deleting image from Cloudinary');
    }
};
exports.deleteImage = deleteImage;
const extractPublicId = (url) => {
    const regex = /\/v\d+\/(.+?)(?:\.\w{3,4})$/;
    const match = url.match(regex);
    return match ? match[1] : '';
};
exports.extractPublicId = extractPublicId;
