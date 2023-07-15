import mongoose from "mongoose";



const storySchema = new mongoose.Schema({
    photo: {
        type: String,
       
    },
    caption:{
        type:String
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:"user"
    },
    views:{
        type:Number
    }
}, {
    timestamps: true
})


const storyModel = mongoose.model('story',storySchema)

export default storyModel;