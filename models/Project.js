const mongoose=require("mongoose")
const projectSchema=new mongoose.Schema({
    name:{
        type:String
    },
    description:{
        type:String
    },
    status:{
      type:String,
      enum:["Not started","In progress","Completed"]
    },
    clientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Client"
    }
})
module.exports.projectSchema=mongoose.model("Project",projectSchema);