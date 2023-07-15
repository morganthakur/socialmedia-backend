import dotenv from 'dotenv'
import express from 'express'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import connnectDB from './db/dbConnection.js'
import storyRouter from './mvc/routes/storyRoutes.js'
import userRouter from './mvc/routes/userRoutes.js'
import postRouter from './mvc/routes/postRoutes.js'
dotenv.config()
const app = express()


app.use(fileUpload({
    useTempFiles: true
}))

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

connnectDB(process.env.MONGO_URL)

app.use('/api/auth',userRouter)
app.use('/api/v1',postRouter)
app.use('/api/v1',storyRouter)
















export default app
