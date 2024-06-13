const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcryptjs = require("bcryptjs")
const { blogsmodel } = require("./models/blogs.js")
const jwt = require("jsonwebtoken")

const app = express()
app.use(cors())
app.use(express.json())
mongoose.connect("mongodb+srv://marywinchakkunny:marywinchakkunny2001@cluster0.nuf6v.mongodb.net/blogsdb?retryWrites=true&w=majority&appName=Cluster0")

const generateHashedPassword = async (password) => {
    const Salt = await bcryptjs.genSalt(10)
    return bcryptjs.hash(password, Salt)
}
app.post("/SignUp", async (req, res) => {

    let input = req.body
    let hashedpassword = await generateHashedPassword(input.password)
    console.log(hashedpassword)
    input.password = hashedpassword
    let blogs = new blogsmodel(input)
    blogs.save()
    res.json({ "status": "success" })

})
app.post("/signin", async (req, res) => {
    let input = req.body
    blogsmodel.find({ "email": req.body.email }).then(
        (response) => {
            if (response.length > 0) {
                let dbpassword = response[0].password

                console.log(dbpassword)
                bcryptjs.compare(input.password, dbpassword, (error, isMatch) => {
                    if (isMatch) {
                        jwt.sign({ email: input.emailid}, "blogs-app", { expiresIn: "1d" },(error, token)=> {
                            if(error) {
                                res.json({ "status": "unable to create token" })
                            }else{
                                res.json({ "status": "success", "userId": response[0]._id, "token": token })
                            }

                        })


                    } else {
                        res.json({ "status": "incorrect" })
                    }
                })
            } else {
                res.json({ "status": "user doest not exist" })
            }

        }
    ).catch()

})

app.post("/view",(req,res)=>{
    let token =req.headers["token"]
    jwt.verify(token,"blogs-app",(error,decoded)=>{
        if (error){
            res.json({"status":"Unauthorised access"})
        }else{
            if(decoded){
                blogsmodel.find().then(
                  (response)=>{
                    res.json(response)
                  }  
                ).catch()
            }
        }
    })
    blogsmodel.find().then(
        (response)=>{
            res.json(response)
        }
    )
})


app.listen(8081, () => {
    console.log("Server started")
})