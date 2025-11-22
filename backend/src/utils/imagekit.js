import ImageKit from "imagekit";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const imagekit = new ImageKit({
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGE_KIT_URL
});

const uploadOnImageKit = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await imagekit.upload({
            file: fs.readFileSync(localFilePath), // required
            fileName: `ringmaster_${Date.now()}`, // required
        });

        // file has been uploaded successfull
        // console.log("file is uploaded on imagekit ", response.url);
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

export { uploadOnImageKit };
