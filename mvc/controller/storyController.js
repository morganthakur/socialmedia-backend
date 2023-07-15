import storyModel from "../model/storyModel.js"
import cloudinary from "../../config/cloudnary.js"


export const getAllStories = async(req,res)=>{
try {
    
const story = await storyModel.find()
res.json({
    message: "Your story here",
    success: true,
    status: 200,
    data: story,
})


} catch (error) {
    console.log(error)
}
}


export const getStoryById = async (req, res) => {
    const {id} = req.params
try {
    const story = await storyModel.findById(id)
    res.json({
        message: "Your story here",
        success: true,
        status: 200,
        data: story,
    })
} catch (error) {
    console.log(error)
}
}

export const createStory = async (req, res) => {
    const { caption } = req.params;
    const photo = req.files.photo;
    const user = req.user;

    try {
        let photoUrl = null;
        if (photo) {
            const photoResult = await cloudinary.uploader.upload(photo.tempFilePath);
            photoUrl = photoResult.url;
        }

        const newStory = new storyModel({
            photo: photoUrl,
            caption: caption,
            user: user._id,
        });

        const storyResponse = await newStory.save();

        res.json({
            message: "Your story created successfully...",
            success: true,
            status: 200,
            data: storyResponse,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to create story.",
            success: false,
            status: 500,
            error: error.message,
        });
    }
};





export const deleteStory = async (req, res) => {
    const { id } = req.params
    try {
        const story = await storyModel.findByIdAndDelete(id)
        res.json({
            message: "Story deleted succesfully....",
            success: true,
            status: 200,
            data: story,
        })
    } catch (error) {
        console.log(error)
    }
}