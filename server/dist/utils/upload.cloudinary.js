import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';
export const singleUpload = (file, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ folder: folder }, (error, result) => {
            if (error)
                reject(error);
            else if (result)
                resolve(result.secure_url);
        });
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
};
export const multipleUploads = async (files, folder) => {
    const urls = []; 
    for (const file of files) {
        const url = await singleUpload(file, folder);
        urls.push(url);
    }
    return urls;
};
export const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log(`result = ${JSON.stringify(result)}`);
        if (result.result !== 'ok') {
            throw new Error('Failed to delete image from Cloudinary');
        }
        return result;
    }
    catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw new Error('Error deleting image from Cloudinary');
    }
};
export const extractPublicId = (url) => {
    const regex = /\/v\d+\/(.+?)(?:\.\w{3,4})$/;
    const match = url.match(regex);
    return match ? match[1] : '';
};
