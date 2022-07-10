const mongoose=require("mongoose")
const connectDt=async()=>{
    let conn=await mongoose.connect(process.env.MONGO_URI);
    if(conn){
        console.log("connected to database");
    }
    else{
        console.log("refused to connect to the database");
    }
}
connectDt();