const express=require('express');
const authMiddleware=require('../middlewares/authMiddleware');
const { getAllUsersController, getAllDoctorsController, changeAccountStatusController } = require('../controllers/adminController');


const adminRouter=express.Router();


adminRouter.get('/getAllUsers',authMiddleware,getAllUsersController)

adminRouter.get('/getAllDoctors',authMiddleware,getAllDoctorsController)

adminRouter.post('/changeAccountStatus',authMiddleware,changeAccountStatusController)

module.exports=adminRouter;
