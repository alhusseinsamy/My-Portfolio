var mongoose = require('mongoose');


var imageSchema = mongoose.Schema({
    title:{
        type:String,
        required:false, 
        unique:false
    },
    img: { data: Buffer, contentType: String },
    imgPath: String,
    username:{
        type:String,
        required:true, 
        unique:false
    }

})

var Image = mongoose.model("image", imageSchema);
module.exports = Image;
module.exports.createImage = function(newImage, callback){
    newImage.save(callback);
}
module.exports.findImageByUsername =  function(username, callback){
    var query = {username: username};
    Image.find(query, callback);
} 


