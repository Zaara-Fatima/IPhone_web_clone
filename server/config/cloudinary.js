import { v2 as cloudinary } from "cloudinary";

try {
    cloudinary.config({
   cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

console.log(" Connected SuccessFully ")
} catch (error) {
    console.error("Error Occured", error.message)
}


export default cloudinary