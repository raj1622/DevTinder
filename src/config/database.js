const mongoose= require('mongoose');

const connectDB= async ()=>{
    await mongoose.connect("mongodb+srv://aryanraj1622:otQLY223OIPUGTO3@namastenode.q4fis.mongodb.net/devTinder");
}

module.exports={connectDB};



