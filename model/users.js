
const  mongoose  = require("mongoose");
const  {Schema}  = require("mongoose");

const usersSchema = new Schema({
name:{
    required:true,
    type:String
},
email:{
    type:String,
    required:true,
    unique:true
},
password:{
    required:true,
    type:String
}
})
const Uesr = mongoose.model('users',usersSchema);
Uesr.createIndexes();

module.exports = Uesr
