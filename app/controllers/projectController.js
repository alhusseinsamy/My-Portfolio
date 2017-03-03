let Project = require('../models/Project');

let projectController = {
    
    getAllProjects:function(req, res){
        
        Project.find(function(err, projects){
            
            if(err)
                res.send(err.message);
            else
                res.render('loggedin', {projects,
                'success_msg': req.flash('success') 
                });
            //console.log(projects);
            //console.log(req.body);
        })

    },

    createProject:function(req, res){
        let project = new Project(req.body);

        project.save(function(err, project){
            if(err){
                res.send(err.message)
                console.log(err);
            }
            else{

                console.log(project);
                res.redirect('/');
            }
        })
    }

    /*loginpage:function(req, res){
        res.render('loginpage');
    }*/
}

module.exports = projectController;