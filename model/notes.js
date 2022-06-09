const { default: mongoose } = require("mongoose");
const { Schema } = require("mongoose");


const Noteschema = new Schema({
    user : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'users'
    },
    title : {
        required : true,
        type : String
    },
    description : {
        required : true,
        type : String
    }, 
    tag : {
        type : String
    },
    date : {
        type : Date,
        default :Date.now
    }

});

module.exports = mongoose.model("notes",Noteschema);