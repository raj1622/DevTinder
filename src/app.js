const express=require("express");
const app=express();
const {connectDB}=require("./config/database")
const {User}= require("./models/user");
const {validateSignUpData}= require("./utils/validation");
const bcrypt= require("bcrypt");
const cookieParser= require("cookie-parser");
const jwt= require("jsonwebtoken");
const {userAuth}= require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async(req, res)=>{
    try{
        
        const {firstName, lastName, emailId, password}= req.body;

        //validation of data
        validateSignUpData(req);

        //encrypt the password
        const passwordHash= await bcrypt.hash(password, 10);

        //creating a new instance of user model
        const user=new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        await user.save();
        res.send("Data saved successsfully");
    }catch(err){
        res.status(400).send("ERROR : "+ err.message);
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

app.patch("/user/:userId", async(req, res)=>{
    const userId=req.params?.userId;
    const data=req.body;
    try{
        const ALLOWED_UPDATES=["userId", "photoUrl", "about","gender", "age", "skills", "password"];
        const isAllowed= Object.keys(data).every((k)=> ALLOWED_UPDATES.includes(k));
        if(!isAllowed){
            throw new Error("Update not allowed");
        }
        if(data?.skills?.length>10){
            throw new Error("Skills cannot be more than 10");
        }
        const user=await User.findByIdAndUpdate({_id: userId}, data, {runValidators:true});
        res.send("Data updated successfully");
    }catch(err){
        res.status(400).send("Something went wrong "+ err.message);
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

app.post("/login", async(req, res)=>{  
    try{
        const{emailId, password}=req.body;
        const user=await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid Credentials");
        }
        
        const isPasswordValid= await user.validatePassword(password);
        if(isPasswordValid){
            const token= await user.getJWT();
            res.cookie("token", token, {expires: new Date(Date.now() + 24*3600000*7)});
            res.send("User logged in successfully");
        }else{
            throw new Error("Invalid Credentials");
        }
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});

app.get("/profile", userAuth ,async(req,res)=>{
    try{
        const user= req.user;
        res.send(user);
    }catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
});

app.post("/sendConnectionRequest",userAuth ,async(req, res)=>{
    const user=req.user;
    console.log("Connection request sent successfully");
    res.send(user.firstName + " is sending a request");
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


