const adminAuth= (req, res, next)=>{
    console.log("Hi I am in admin auth");
    const token="xyz";
    const isAuthenticated= token==="xyz";
    if(!isAuthenticated){
        res.status(401).send("Not Authorized");
    }else{
        next();
    }
}

module.exports={
    adminAuth,
}