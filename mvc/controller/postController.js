import postModel from "../model/postModel.js";
import cloudinary from '../../config/cloudnary.js';
import userModel from "../model/userModel.js";
export const getAllPosts = async(req,res)=>{
try {
    const allposts = await postModel.find()
    console.log(allposts)
    if(allposts.length>0){
res.json({
    message:"All Posts",
    success:true,
    staus:200,
    data:allposts
})
    }else{
        res.send("There is no post avaiable at the moment")
    }
} catch (error) {
    console.log(error)
}
}


export const getPostByID = async (req, res) => {
    const {id}= req.params
    try {
        const singlePost = await postModel.findById(id)
  if(singlePost){
      res.json({
          message: "All Posts",
          success: true,
          staus: 200,
          data: singlePost
      })
  }else{
    res.send("This post is no more")
  }
    } catch (error) {
        console.log(error)
    }
}

export const createPost = async (req, res) => {
    const { caption, tags } = req.body;
    const photo = req.files.photo;
    const user = req?.user;
    try {
        const photoResult = await cloudinary.uploader.upload(photo.tempFilePath);
        if (photoResult.url) {
            const newPost = new postModel({
                caption: caption || "",
                photo: photoResult.url,
                user: user._id,
                tags: Array.isArray(tags) && tags.length > 0 ? tags : [],
            });

            const savePost = await newPost.save();
            // Update user's posts field

        const updatedUser =  await userModel.findByIdAndUpdate(user._id, { $push: { post: savePost._id } });
  const userResponse =  await updatedUser.save();
  console.log(userResponse);
            res.json({
                message: "Post created successfully.....",
                success: true,
                status: 201,
                data: savePost,
            });
        } else {
            res.send("Error while uploading image");
            console.log("Error while uploading image");
        }
    } catch (error) {
        console.log(error);
    }
};




export const likePost = async (req, res) => {
    const { postId } = req.params;
    const user = req.user;

    try {
        const post = await postModel.findById(postId);

        // Check if the post is already liked by the user
        if (post.likedBy.includes(user._id)) {
            // Unlike the post
            const unlikedPost = await postModel.findByIdAndUpdate(
                postId,
                {
                    $pull: { likedBy: user._id },
                    $inc: { likes: -1 },
                },
                { new: true } // To return the updated post
            );

            console.log(unlikedPost);
            res.json({
                message: "Post unliked successfully...",
                success: true,
                status: 200,
                data: unlikedPost,
            });
        } else {
            // Like the post
            const likedPost = await postModel.findByIdAndUpdate(
                postId,
                {
                    $push: { likedBy: user._id },
                    $inc: { likes: 1 },
                },
                { new: true } // To return the updated post
            );

            console.log(likedPost);
            res.json({
                message: "Post liked successfully...",
                success: true,
                status: 200,
                data: likedPost,
            });
        }
    } catch (error) {
        console.log(error);
    }
};



export const commentOnPost = async(req,res)=>{
    const { postId } = req.params;
    const { comment } = req.body;
    const user = req.user;

    try {
        const commentedPost = await postModel.findByIdAndUpdate(
            postId,
            {
                $push: { comments: { comment, commentByUser: user._id } },
            },
            { new: true } // To return the updated post
        );

        console.log(commentedPost);
        res.json({
            message: "Comment added successfully...",
            success: true,
            status: 200,
            data: commentedPost,
        });
    } catch (error) {
        console.log(error);
    }



}






export const sharePost = async(req,res)=>{

    const { postId } = req.params;
    const user = req.user;

try {
    
const sharedPost = await postModel.findByIdAndUpdate(postId,{
    $push:{sharedBy:user._id},
    $inc:{shares:1}
},
{new:true}
)

console.log(sharedPost)
res.json({
    message: "post shared added successfully...",
    success: true,
    status: 200,
    data: sharedPost,
})
} catch (error) {
    console.log(error)
}
}

export const savePost = async(req,res)=>{


    const { postId } = req.params;
    const user = req.user;

    try {
        const post = await postModel.findById(postId);

        // Check if the post is already liked by the user
        if (post.sharedBy.includes(user._id)) {
            // unsave the post
            const unSavedPost = await postModel.findByIdAndUpdate(
                postId,
                {
                    $pull: { savedBy: user._id },
                    $inc: { totalSaves: -1 },
                },
                { new: true } // To return the updated post
            );

            console.log(unSavedPost);
            res.json({
                message: "Post removed from saved list successfully...",
                success: true,
                status: 200,
                data: unSavedPost,
            });
        } else {
            // save the post
            const savedPost = await postModel.findByIdAndUpdate(
                postId,
                {
                    $push: { savedBy: user._id },
                    $inc: { totalSaves: 1 },
                },
                { new: true } // To return the updated post
            );

            console.log(savedPost);
            res.json({
                message: "Post saved successfully...",
                success: true,
                status: 200,
                data: savedPost,
            });
        }
    } catch (error) {
        console.log(error);
    }



}







export const deletePost = async (req, res) => {
    const {id} = req.params
    try {



 const deletedPost = await postModel.findByIdAndDelete(id)
res.json({
    message:"post deleted succesfully..",
    success:true,
    status:200,
    data: deletedPost
})

    } catch (error) {
        console.log(error)
    }
}

