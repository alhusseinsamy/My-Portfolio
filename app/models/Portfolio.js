var mongoose = require('mongoose');
var portfolioSchema = mongoose.Schema({
    username:{
        type:String,
        required:true, 
        unique:false
    },
     name:{
        type:String,
        required:true, 
        unique:false
    },
     img: { data: Buffer, contentType: String },
     imgPath: String

    
})

var Portfolio = mongoose.model("portfolio", portfolioSchema);

module.exports = Portfolio;
module.exports.createPortfolio = function(newPortfolio, callback){
    newPortfolio.save(callback);

}

module.exports.findPortfolioByUsername =  function(username, callback){
    var query = {username: username};
    Portfolio.find(query, callback);
} 

module.exports.findPortfolioByUsername1 =  function(projects, callback){

    for(var i =0; i<projects.length; i++){
       var query = {username: projects[i].username}; 
       Portfolio.findOne(query, callback);
    }
}

/*module.exports.getAllPortfolios = function(req, res){
        
        Portfolio.find(function(err, portfolios){
            
            if(err)
                res.send(err.message);
            else
                res.render('loggedin', {projects,
                'success_msg': req.flash('success') 
                });
            //console.log(projects);
            //console.log(req.body);
        })

    },  */  
    
    
 
