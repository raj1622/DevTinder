const express=require("express");

const app=express();

app.get("/user", (req, res)=>{
    res.send({"firstName": "Akshay", "lastName": " Saini"});
});

app.post("/user", (req, res)=>{
    //saving data to db
    console.log("Saved data to database");
    res.send("Data successfully saved");
});

app.use("/test", (req, res)=>{
    res.send("Hello from test");
});

app.listen(3000, ()=>{
    console.log("Server listening on port 3000");
});