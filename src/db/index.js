import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

const connectDB = async ()=>{
    try{
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Mongo DB Connected Succefully || Db Host : ${connectionInstance.connection.host}`)

    }catch(error){
        console.log("Mongo DB Connection failed ", error)
        process.exit(1);
    }
}

export default connectDB