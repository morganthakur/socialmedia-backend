import mongoose from "mongoose";



const connnectDB = async (mongo_url) => {
    try {
        await mongoose.connect(mongo_url)
        console.log("Database connected succesfully............")


    } catch (error) {
        console.log(error)
    }
}



export default connnectDB