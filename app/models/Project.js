var mongoose = require('mongoose');


var projectSchema = mongoose.Schema({
    title:{
        type:String,
        required:false, 
        unique:false
    },
    URL:String,
    username:{
          type:String,
        required:false, 
        unique:false
    }
})






var Project = mongoose.model("project", projectSchema);
module.exports = Project;


module.exports.createProject1 = function(newProject, callback){
    newProject.save(callback);
}

module.exports.getProjectByUsername = function(username, callback){
    var query = {username: username};
    Project.find(query, callback);
}


















//module.exports.createPortfolio = function(){

//}