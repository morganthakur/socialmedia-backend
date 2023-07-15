import app from "./index.js";




const port = process.env.PORT







  const server = app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port} `)
  })