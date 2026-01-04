import ImageKit from "imagekit";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// Initialize ImageKit only if credentials are provided
let imagekit = null;
const hasImageKitConfig = process.env.IMAGE_KIT_PUBLIC_KEY &&
    process.env.IMAGE_KIT_PRIVATE_KEY &&
    process.env.IMAGE_KIT_URL;

if (hasImageKitConfig) {
    imagekit = new ImageKit({
        publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
        privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGE_KIT_URL
    });
} else {
    console.warn('ImageKit not configured - image uploads will be disabled');
}

const uploadOnImageKit = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Return null if ImageKit is not configured
        if (!imagekit) {
            console.warn('ImageKit not configured - skipping upload');
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }
            return null;
        }

        const response = await imagekit.upload({
            file: fs.readFileSync(localFilePath),
            fileName: `ringmaster_${Date.now()}`,
        });

        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
}

export { uploadOnImageKit };
