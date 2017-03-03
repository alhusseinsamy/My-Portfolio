// require dependincies 
var express = require('express');
var router = express.Router();
var projectController = require('./controllers/projectController');
//var expressValidator = require('express-validator');
var User = require('./models/User');
var Portfolio = require('./models/Portfolio');
var Project = require('./models/Project');
//var models = require('./models/Project');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer  = require('multer')
var upload = multer({ dest: 'public/uploads/' })
var path = require('path');
var A=require('./models/test');
var fs = require('fs');
var Image = require('./models/Image');
var multiparty = require('multiparty');
var names =[];
var imgpaths=[];










router.get('/test',function(req,res){
	//document.getElementById("sss"); 
	res.render('test');
})

router.post('/test1', upload.any(), function(req, res, next){
	//var x=req.files
	//console.log(req.files[0].path);
	var str = String(req.files[0].path);
	var x= str.replace('public', '');
	//console.log(x);

	res.render('test1',{path:x});
	var a = new A;
    a.img.data = fs.readFileSync(req.files[0].path);
    a.img.contentType = 'image/jpeg';
    a.save(function (err, a) {
if (err) throw err;
})
})



// add routes
router.get('/', function(req, res){
        res.render('loginpage');
    });

router.get('/client', function(req, res){
           Portfolio.find(function(err, portfolios){
            
            if(err)
                res.send(err.message);
            else{ 
            	var names=[];
            	var imgpaths=[];
            	
            	//var titles=[];



            	
            	
            	for(var i=0; i<portfolios.length; i++){
            		names.push(portfolios[i].name);
            		var str = portfolios[i].imgPath;
					var x= str.replace('public', '');

            		imgpaths.push(x);
            		
                    
            	}
            	Project.find(function(err,projects){
            		var titles = [[]];
            		var urls = [[]];
            		if(err)
            			res.send(err.message);
            		else{
            			for(var j=0; j<portfolios.length; j++){
            				var array =[];
            				var array1=[];
            				for(var k=0; k<projects.length; k++){
            					if (array.length<2){
            					if(projects[k].username == portfolios[j].username){
                                  array.push(projects[k].title);
                                  array1.push(projects[k].URL);
            					}
            				}
            				}
            				titles.push(array);
            				urls.push(array1);
            				

            			}
            			titles.splice(0,1);
            			urls.splice(0,1);
            			console.log(urls);
            			res.render('client', {portfolios, projects, paths:imgpaths, names: names, titles: titles, urls:urls});
            		}
            	})

            	

            }
                
        })
       
        })

    

router.get('/registrationpage', notensureAuthenticated, function(req, res){
        res.render('registrationpage');
    });

router.get('/logintry', notensureAuthenticated, function(req, res){
        res.render('logintry');
    });

router.post('/register', function(req,res){
	var username = req.body.username;
	var password = req.body.password;
	
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	var errors = req.validationErrors();
	if(errors){
		res.render('registrationpage', {
			errors: errors});

	}else{
//res.render('afterlogin');
	var newUser = new User({
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

res.redirect('/');
   console.log(newUser);
	}
	

})

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			//req.flash('success_msg', 'You are now logged in');
   			return done(null, user);
   			//res.send(500, {error: 'You are now logged in'});
   			//req.flash('success_msg', 'You are now logged in');
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/logged', failureRedirect:'/logintry', successFlash: 'You are now logged in!', failureFlash: true}),
  function(req, res) {
  	//res.send(500, {error: 'You are now logged in'});
  	//req.flash('success_msg', 'You are now logged in');
  	//req.session['success_msg'] = 'User added successfully';
  	//res.send({ succ: 'json' });
    res.redirect('/logged');

  }
  );

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/');
});

router.get('/logged', ensureAuthenticated, projectController.getAllProjects);

router.get('/createportfolio', ensureAuthenticated, function(req,res){
	
    Portfolio.findPortfolioByUsername(req.user.username, function(err, portfolios){
   	if(err) throw err;
   	console.log("=================")
   	console.log(portfolios);
   	//console.log(projects);
   	if(portfolios.length >= 1){
   		req.flash('error_msg','You already have a portfolio you cannot create one');
   		res.redirect('/portfoliocreated');
   	}else{
   		res.render('createportfolio');
   	}
   	
   })
	
});

//router.get('/portfoliocreated', function(req,res){

//})



router.get('/portfoliocreated', ensureAuthenticated, function(req,res){

	/*Image.findImageByUsername(req.user.username, function(err, images){
		if(err) throw err;
		for(int i=0; i<images.length; i++){

		}
		
	})*/

  Portfolio.findPortfolioByUsername(req.user.username, function(err, portfolios){
  	if(err) throw (err);
  	if(portfolios.length == 0){
  		req.flash('error_msg','You did not create a portfolio yet');
   		res.redirect('/logged');
  	}else{
  		  Project.getProjectByUsername(req.user.username, function(err, projects){
   	if(err) throw err;
   	//console.log(projects);
   	Portfolio.findPortfolioByUsername(req.user.username, function(err, portfolios){
   	if(err) throw err;
   	var str = portfolios[0].imgPath;
	var x= str.replace('public', '');
	//console.log(x);
   	Image.findImageByUsername(req.user.username, function(err, images){
        if(err) throw err;
        var arrayOfPaths = [];
        for(var i=0; i<images.length; i++){
        	var strings = images[i].imgPath;
        	var paths= strings.replace('public', '');
        	arrayOfPaths.push(paths);

        

        }
        console.log(arrayOfPaths);
        res.render('portfoliocreated',{y: arrayOfPaths, projects: projects, images: images, path: x, name: portfolios[0].name, username: req.user.username});
        
    })
    
   	
   })

	
   })

  	}
  })





//res.render('portfoliocreated',{projects:projects, path: x, name: portfolios[0].name, username: req.user.username});
 
 
	


})

router.post('/portfoliocreated', upload.any(), function(req, res) {
  

  


  
  
  if(req.body.URL != ""){
  		var thename= req.body.name;
  		var theusername = req.user.username;
  		var theURL = req.body.URL;
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('URL', 'URL is required').notEmpty();
  var errors = req.validationErrors();
  if(errors){
		res.render('createportfolio', {
			errors: errors});

	}else{
		var newProject = new Project({
		title: req.body.title,
		URL: req.body.URL,
		username: req.user.username,
	})	
	Project.createProject1(newProject, function(err, project){
			if(err) throw err;
			//console.log(project);
		});	
	Project.getProjectByUsername(req.user.username, function(err, projects){
   	if(err) throw err;
   	//console.log(projects);
   	//res.redirect('/portfoliocreated');
   })
	var newPortfolio = new Portfolio({
			username: req.user.username,
			name: req.body.name,
			
		});
    newPortfolio.img.data = fs.readFileSync(req.files[0].path);
    newPortfolio.img.contentType = 'image/jpeg';
    newPortfolio.imgPath = req.files[0].path;


	}

  }else{
  		var newImage = new Image();
	newImage.img.data = fs.readFileSync(req.files[0].path);
    newImage.img.contentType = 'image/jpeg';
    newImage.imgPath = req.files[0].path;
    newImage.title=req.body.title;
    newImage.username=req.user.username;
    Image.createImage(newImage, function(err, image){
			if(err) throw err;
			
		});
    var newPortfolio = new Portfolio({
			username: req.user.username,
			name: req.body.name,
			
		});
    newPortfolio.img.data = fs.readFileSync(req.files[1].path);
    newPortfolio.img.contentType = 'image/jpeg';
    newPortfolio.imgPath = req.files[1].path;
  }
  
		//console.log('ksks')

  

		
	

		
  Portfolio.createPortfolio(newPortfolio, function(err, portfolio){
			if(err) throw err;
			console.log(portfolio);
		});
  req.flash('success_msg','Your portfolio has been created!');

res.redirect('/portfoliocreated')

  

    
   
  //console.log(req.body.love);

});


router.get('/addnewproject', ensureAuthenticated, function(req,res){

  Project.getProjectByUsername(req.user.username, function(err, projects){
   	if(err) throw err;
   	//console.log(projects);
   	res.render('portfoliocreated',{projects});
   })


})

router.post('/addnewproject', upload.any(), function(req,res){
	

    //console.log(req.body.title);
	if(req.body.URL != ""){
	console.log(req.body.title);
	var newProject = new Project({
		title: req.body.title,
		URL: req.body.URL,
		username: req.user.username,
	})	
	Project.createProject1(newProject, function(err, project){
			if(err) throw err;
			//console.log(project);
		});	
	Project.getProjectByUsername(req.user.username, function(err, projects){
   	if(err) throw err;
   	//console.log(projects);
   	//res.redirect('/portfoliocreated');
   })

}else{
	//console.log(req.files);
	var newImage = new Image();
	newImage.img.data = fs.readFileSync(req.files[0].path);
    newImage.img.contentType = 'image/jpeg';
    newImage.imgPath = req.files[0].path;
    newImage.title=req.body.title;
    newImage.username=req.user.username;
    Image.createImage(newImage, function(err, image){
			if(err) throw err;
			
		});
    
}

res.redirect('/portfoliocreated');

}



)








function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/');
	}
}

function notensureAuthenticated(req, res, next){
	if(!req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are already logged in');
		res.redirect('/logged');
	}
}






/*router.post('/succesfulregistration', function(req, res){
	req.checkBody('username', 'Enter').notEmpty();
	req.checkBody('password', 'Enter').notEmpty();
	console.log('succesful');
	res.render('afterlogin');
});*/




//router.post('/project', projectController.createProject);

// export router

module.exports = router;