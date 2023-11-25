const express=require('express')
const authMiddleWare=require('../middlewares/authMiddleware');
const { getDoctorInfoController, updateProfileController, getDoctorByIdController, doctorAppointmentsController, updateStatusController } = require('../controllers/doctorController');
const doctorRouter=express.Router();

doctorRouter.post('/getDoctorInfo',authMiddleWare,getDoctorInfoController);

doctorRouter.post('/updateProfile',authMiddleWare,updateProfileController);

doctorRouter.post('/getDoctorById',authMiddleWare,getDoctorByIdController);

doctorRouter.get('/doctor-appointments',authMiddleWare,doctorAppointmentsController);

doctorRouter.post('/update-status',authMiddleWare,updateStatusController);


module.exports=doctorRouter



