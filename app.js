const express  =require("express")
const mongoose=require("mongoose")
const cors =require("cors")
const bcryptjs = require("bcryptjs")
const {blogsmodel}=require("./models/blogs.js")

const app=express()
app.use(cors())
app.use(express.json())
 

const generateHashedPassword =async(password)=>{
    const Salt = await bcryptjs.genSalt(10)
    return bcryptjs.hash(password,Salt)
}
app.post("/SignUp",async(req,res)=>{

    let input = req.body
    let hashedpassword = await generateHashedPassword(input.password)
    console.log(hashedpassword)
     input.password=hashedpassword
     let blogs = new blogsmodel(input)
      blogs.save()
    res.json({"status":"success"})
 
})




app.listen(8081,()=>{
    console.log("Server started")
})