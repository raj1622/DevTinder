const express=require("express");
const app=express();
const {connectDB}=require("./config/database")
const {User}= require("./models/user");

app.use(express.json());

app.post("/signup", async(req, res)=>{

     const user=User(req.body);
     try{
         await user.save();
         res.send("Data saved successsfully");
     }catch(err){
         res.staus(400).send("Error saving user to databse"+ err.message);
     }
});

app.get("/user", async(req, res)=>{
    const userEmail=req.body.emailId;
    try{
        const users=await User.find({emailId: userEmail});
        res.send(users);
    }catch(err){
        res.status(400).send("Something went wrong");
    }
});

app.get("/feed", async(req, res)=>{
    try{
        const users=await User.find({});
        if(users.length===0){
            res.send("No users found");
        }else{
            res.send(users);    
        }
        
    }catch(err){
        res.status(400).send("Something went wrong");
    }
});


connectDB()
    .then(()=>{
        console.log("Successully conencted to the db");
        app.listen(3000, ()=>{
            console.log("Server listening on port 3000");
        });

    })
    .catch((err)=>{
        console.error("database connection failed");
    })


