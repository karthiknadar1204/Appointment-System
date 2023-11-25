const mongoose=require('mongoose');
const colors=require('colors');

const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('connected to mongo db');
        
    } catch (error) {
        console.log('mongo db server issue');
        
    }
}

module.exports=connectDB;
