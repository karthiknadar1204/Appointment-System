const userModel=require('../models/userModels');
const doctorModel=require('../models/doctorModel');
const appointmentModel=require('../models/appointmentModel');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const moment = require("moment");

const registerController=async(req,res)=>{
    try {
        const existingUser=await userModel.findOne({email:req.body.email});
        if(existingUser){
            return res.status(200).send({message:"user already exists", success:false})
        }
        const password=req.body.password;
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        req.body.password=hashedPassword;
        const newUser=new userModel(req.body);
        await newUser.save();
        res.status(200).send({message:"user registered successfully",success:true})
    } catch (error) {
        console.log(error);
        res.status(500).send({success:false,message:`${error.message}`})
    }
}


const loginController=async(req,res)=>{
    try {
        const user = await userModel.findOne({ email:req.body.email });
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
          return res.status(200).send({ message: 'Invalid credentials', success: false });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: '1d',
        });
        res.status(200).send({ message: 'Login success', success: true, token });
      } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
      }     
}


const authController=async(req,res)=>{
  try {
    const user=await userModel.findById({_id:req.body.userId})
    user.password=undefined;
    if(!user){
      return res.status(200).send({
        message:'user not found',
        success:false
      })
    }else{
      res.status(200).send({
        success:true,
        data:user
      })
    }
  } catch (error) {
    res.status(500).send({
      message:'auth error',
      success:false,
      error
    })
  }
}

const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await doctorModel({ ...req.body, status: 'pending' });
    const savedDoctor = await newDoctor.save();

    const adminUser = await userModel.findOne({ isAdmin: true });

    let notification = adminUser.notification || [];
    notification.push({
      type: 'apply-doctor-request',
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for the position of doctor`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: '/admin/doctors'
      } 
    });

    await userModel.findByIdAndUpdate(adminUser, { notification });
    res.status(201).send({
      success: true,
      message: 'Doctor account has applied successfully'
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Error while applying for Doctor'
    });
  }
}

const getAllNotificationController=async(req,res)=>{
  try {
    const user=await userModel.findOne({_id:req.body.userId})
    const seennotification=user.seenNotification;
    const notification=user.notification;
    seennotification.push(...notification);
    user.notification=[];
    user.seenNotification=notification;
    const updateUser=await user.save();
    res.status(200).send({
      success:true,
      message:"all notifications marked as read",
      data:updateUser
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message:'Error in notification',
      success:false,
      error
    })
  }
}

const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seenNotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications Deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "unable to delete all notifications",
      error,
    });
  }
};

const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Docots Lists Fetched Successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Errro WHile Fetching DOcotr",
    });
  }
};

const bookAppointmentController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();
    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
    user.notification.push({
      type: "New-appointment-request",
      message: `A nEw Appointment Request from ${req.body.userInfo.name}`,
      onCLickPath: "/user/appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Book successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Booking Appointment",
    });
  }
};

const bookingAvailabilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await appointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not Availibale at this time",
        success: true,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Appointments available",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Booking",
    });
  }
};

const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });
    res.status(200).send({
      success: true,
      message: "Users Appointments Fetch SUccessfully",
      data: appointments,
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In User Appointments",
    });
  }
};



module.exports=
{loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController
};