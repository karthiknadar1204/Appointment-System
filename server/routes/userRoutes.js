const express=require('express');
const { registerController, 
    loginController,
     authController, 
     applyDoctorController, 
     getAllNotificationController, 
     deleteAllNotificationController,
     getAllDoctorsController,
     bookAppointmentController,
     bookingAvailabilityController,
     userAppointmentsController
    } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const userRouter=express.Router();

userRouter.post('/register',registerController);

userRouter.post('/login',loginController);

userRouter.post('/getUserData',authMiddleware,authController); 

userRouter.post('/apply-doctor',authMiddleware,applyDoctorController);

userRouter.post('/get-all-notification',authMiddleware,getAllNotificationController);

userRouter.post('/delete-all-notification',authMiddleware,deleteAllNotificationController);

userRouter.get('/getAllDoctors',authMiddleware,getAllDoctorsController);

userRouter.post('/book-appointment',authMiddleware,bookAppointmentController);

userRouter.post("/booking-availability",authMiddleware,bookingAvailabilityController);

userRouter.get('/user-appointments',authMiddleware,userAppointmentsController);
  

module.exports=userRouter;
