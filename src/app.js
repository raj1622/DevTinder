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
         res.status(400).send("Error saving user to databse"+ err.message);
     }
});

app.get("/user", async(req, res)=>{
    const userEmail=req.body.emailId;
    try{
        const user=await User.findOne({emailId: userEmail});
        if(!user){
            res.send("No user found");
        }else{
            res.send(user);
        }
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

app.delete("/user", async(req, res)=>{
    const userId=req.body.userId;
    try{
        const isExist=await User.findOne({_id: userId});
        if(!isExist){
            res.status(404).send("User does not exist");
        }else{
            const user=await User.findByIdAndDelete({_id:userId});
            res.send("User deleted Successfully");
        }
    }catch(err){
        res.status(400).send("Something went wrong"+ err.message);
    }
});

app.patch("/user", async(req, res)=>{
    const userId=req.body.userId;
    const data=req.body;
    try{
        const user=await User.findByIdAndUpdate({_id: userId}, data, {runValidators:true});
        res.send("Data updated successfully");
    }catch(err){
        res.status(400).send("Something went wrong");
    }
});

app.patch("/user/updateByEmail", async(req, res)=>{
    const emailId=req.body.emailId;
    const data=req.body;
    try{
        const user=await User.findOne({emailId:emailId});
        
        if(!user){
            res.send("No such user Exist");
        }else{
            const userId=user._id;
            await User.findByIdAndUpdate(userId, data, {runValidators:true}); 
            res.send("User updated Sucessfully");
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


