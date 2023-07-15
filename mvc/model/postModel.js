import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        photo: {
            type: String,
            required: true,
        },
        caption: {
            type: String,
            maxlength: 500,
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "user",
        },
        comments: [
            {
                comment: {
                    type: String,
                },
                commentByUser: {
                    type: mongoose.Types.ObjectId,
                    ref: "user",
                },
            },
        ],
        likes: {
            type: Number,
            default: 0,
        },
        likedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
        ],
        shares: {
            type: Number,
            default: 0,
        },
        sharedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
        ],
        totalSaves:{
            type: Number,
            default: 0,
        },
        savedBy:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        }],
        tags: [
            {
                type: mongoose.Types.ObjectId,
                ref: "user",
            },
        ],
        location: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Add indexes if needed
postSchema.index({ user: 1 });

// Define virtual properties if needed
postSchema.virtual("formattedTimestamp").get(function () {
    return this.createdAt.toISOString(); // Example formatting, adjust as needed
});

const postModel = mongoose.model("post", postSchema);

export default postModel;
