import express from 'express'
import { createStory, getAllStories, getStoryById,deleteStory } from '../controller/storyController.js'
import { checkUserAuth } from '../../middlewares/auth.js';


const router = express.Router()

router.get('/stories', checkUserAuth, getAllStories)
router.get('/story/:id', checkUserAuth, getStoryById)
router.post('/story', checkUserAuth, createStory)
router.delete('/story/:id', checkUserAuth, deleteStory)



export default router

