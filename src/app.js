const express=require("express");

const app=express();

app.use("/test", (req, res)=>{
    res.send("Hello from server");
});

app.use("/", (req, res)=>{
    res.send("Hello from dashboard");
})



app.listen(3000, ()=>{
    console.log("Server listening on port 3000");
});