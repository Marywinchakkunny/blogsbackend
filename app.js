const express  =require("express")
const mongoose=require("mongoose")
const cors =require("cors")
const bcryptjs = require("bcryptjs")
const {blogsmodel}=require("./models/blogs.js")

const app=express()
app.use(cors())
app.use(express.json())
mongoose.connect("mongodb+srv://marywinchakkunny:marywinchakkunny2001@cluster0.nuf6v.mongodb.net/blogsdb?retryWrites=true&w=majority&appName=Cluster0")

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