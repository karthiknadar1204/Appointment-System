const express=require('express');
const colors=require('colors');
const morgan=require('morgan');
const dotenv=require('dotenv');
const connectDB = require('./config/db');
const userRouter = require('./routes/userRoutes');
const adminRouter=require('./routes/adminRoutes');
const doctorRouter = require('./routes/doctorRoutes');

dotenv.config()

const app=express();

connectDB();

app.use(express.json());
app.use(morgan('dev'));

//routes
app.use('/api/v1/user',userRouter);//->domain/api/v1/user/ (either functions in userRoutes file)
app.use("/api/v1/admin", adminRouter);
app.use('/api/v1/doctor',doctorRouter);


const port=process.env.PORT || 8080


app.listen(port,()=>{
    console.log(`server is running on port ${port} in ${process.env.DEV_MODE}`)
})
