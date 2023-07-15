import express from 'express';
import { getAllPosts, getPostByID,deletePost,createPost,likePost,commentOnPost,
    savePost,sharePost
} from '../controller/postController.js';
import { checkUserAuth } from '../../middlewares/auth.js';




const router = express.Router()


router.get('/posts',checkUserAuth,getAllPosts)
router.get('/post/:id', checkUserAuth, getPostByID)
router.post('/post', checkUserAuth, createPost)
router.put('/post/like/:postId', checkUserAuth, likePost)
router.put('/post/comment/:postId', checkUserAuth, commentOnPost)
router.put('/post/share/:postId', checkUserAuth, sharePost)
router.put('/post/save/:postId', checkUserAuth, savePost)
router.delete('/post/delete/:id', checkUserAuth, deletePost)


export default router