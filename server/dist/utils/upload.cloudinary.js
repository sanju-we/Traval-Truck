import cloudinary from "../config/cloudinary.js";
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
    for (let file of files) {
        const url = await singleUpload(file, folder);
        urls.push(url);
    }
    return urls;
};
