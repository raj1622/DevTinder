const mongoose=require('mongoose');
const validator=require('validator');

const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:15,
    },
    lastName:{
        type:String,
        minLength:3,
        maxLength:15,
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        minLength:5,
        maxLength:50,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Emial not valid");
            }
        },
    },
    password:{
        type:String,
        required:true,
        minLength:5,
        maxLength:50,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a String Password");
            }
        }
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        validate(value){
            if(!['male', 'female', 'others'].includes(value.toLowerCase())){
                throw new Error("Gender field is not valid");
            }
        },
    },
    photoUrl:{
        type:String,
        default:"https://media.istockphoto.com/id/610003972/vector/vector-businessman-black-silhouette-isolated.jpg?s=612x612&w=0&k=20&c=Iu6j0zFZBkswfq8VLVW8XmTLLxTLM63bfvI6uXdkacM=",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("PhotoUrl not valid");
            }
        }

    },
    about:{
        type:String,
        default:"This is about Section",
        maxLength:30,
    },
    skills:{
        type:[String]
    },
}, {
    timestamps:true,
});

const User=mongoose.model("User", userSchema);

module.exports={
    User
}