
import { generateAccessToken,generateRefreshToken} from "../utils/generateTokens";
import User from "../models/User";
import jwt from 'jsonwebtoken';

export const refreshTokenController= async (req,res)=>{

    const {refreshToken} =req.body;
    if(!refreshToken){
        return res.status(401).json({success:false,message:"refresh token missing"})
    }
    try {
           const decoded =jwt.verify(refreshToken,process.env.REFRESH_SECRET);

           const user= await User.findById(decoded.id);

           if(!user || user.refreshToken !==refreshToken){
             return res.status(403).json({
                message: "Invalid refresh token",
              });
           }

           // rotation 
           const newAccessToken =generateAccessToken(user._id);
           const newRefreshToken =generateRefreshToken(user._id);

           user.refreshToken=newRefreshToken;
           await user.save()

           return res.json({
            accessToken:newAccessToken,
            refreshToken :newRefreshToken,
           });

    } catch (error) {
        return res.status(403).json({
            message: "Token expired or invalid",
          });
    }

}