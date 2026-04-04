
import mongoose from "mongoose";

const userSchecma = new mongoose.Schema({
    fullname:{
        type:String,
        required: true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
   password:{
    type:String,
    default:"",
    minlength: 6,
   },

   refreshToken :{
    type:String,
    default:null,
   },

   isOnline:{
    type:Boolean,
    default:false,
   },
},{timestamps:true});

const User =mongoose.model('user',userSchecma);

export default User;