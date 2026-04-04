import app from '../backend/src/app.js'
import {configDotenv} from 'dotenv';
import { connectDB } from './src/config/db.js';


 configDotenv();
 connectDB();

 const PORT =process.env.PORT || 4000

 app.listen(PORT,()=>{
    console.log(`server listen on http://localhost:${PORT}`)
 }
)



