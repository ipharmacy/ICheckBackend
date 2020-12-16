const express = require('express');
const mongoose = require('mongoose');
const User = require('../Models/User');

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

var multer, storage, path, crypto;
multer = require('multer')
path = require('path');
crypto = require('crypto');
var fs = require('fs');

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'help.fashionar@gmail.com',
    pass: 'esprit18'
  }
});

const route = express.Router();

const register = (req,res,next) => {
	bcrypt.hash(req.body.password,10,function(err,hashedPass) {
		console.log(req.body);
		if (err) {
			console.log('erreur password hash');
			res.json({
				error: err
			})
		}
		var verifemail = req.body.email

		User.findOne({$or: [{email:verifemail}]})
		.then(user => {
			if (user) {//user found
				res.status(201).send(JSON.stringify({
					message:'User exist'
				}))
			}else{//no user found
				let user = new User({
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					email: req.body.email,
					password: hashedPass,
					phone: "90057620",
					sexe: "homme",
					avatar:"default",
					verified:0,
					favorites:[]
				})
				user.save().then(user =>{
					res.status(200).send(JSON.stringify({
						message:'User Added Successfully!'
					}))
				})
				.catch(error => {
					res.json({
						message: "An error occured when adding user!"
					})
				})
			}//end else
		})//end then 
	})//end hash
}

const login = (req,res,next) => {
	var email = req.body.email
	var password = req.body.password

	User.findOne({$or: [{email:email},{phone:email}]})
	.then(user => {
		if (user) {
			bcrypt.compare(password,user.password,function(err,result) {
				if (err) {
					res.json({error:err})
				}
				if (result) {
					if (user.verified==0) {
						res.status(203).send(JSON.stringify({
						_id:"",
						firstName:"",
						lastName:"",
						email:"",
						password:"",
						phone:"",
						sexe:"",
						avatar:""
					}))
					} else {
						//let token = jwt.sign({firstName:user.firstName},'verySecretValue',{expiresIn: '1h'})
						res.status(200).send(JSON.stringify({
						_id:user._id,
						firstName:user.firstName,
						lastName:user.lastName,
						email:user.email,
						password:user.password,
						phone:user.phone,
						sexe:user.sexe,
						avatar:user.avatar
						}))
					}
				}else{	
					res.status(201).send(JSON.stringify({
						_id:"",
						firstName:"",
						lastName:"",
						email:"",
						password:"",
						phone:"",
						sexe:"",
						avatar:""
					}))
				}
			})
		}else{
			res.status(202).send(JSON.stringify({
				_id:"",
				firstName:"",
				lastName:"",
				email:"",
				password:"",
				phone:"",
				sexe:"",
				avatar:""
			}))
		}
	})
}

const index = (req,res,next)  => {
	User.find().populate([
        {
          path: 'favorites.product',
		  populate: {
		    path: 'reviews.user'
		  }
        },
      ])
	.then(response  => {
		res.json(response)
	})
	.catch(error  =>{
		res.json({
			message: "an error occured when displaying users"
		})
	})
}

const friends = (req,res,next)  => {
	//User.find().populate('favorites.product').populate('reviews.user')
	User.find().select({'favorites':0})
	.then(response  => {
		res.json(response)
	})
	.catch(error  =>{
		res.json({
			message: "an error occured when displaying users"
		})
	})
}

storage = multer.diskStorage({
    destination: './public/users/',
    filename: function(req, file, cb) {
      return crypto.pseudoRandomBytes(16, function(err, raw) {
        if (err) {
          return cb(err);
        }
       return cb(null, file.originalname);
      });
    }
  });

const updateAvatar = (req,res,next) =>{

	let updatedUser = {
		avatar: req.body.avatar
	}

	User.findOneAndUpdate({ email: req.body.email },{$set: updatedUser})
	.then(() => {
		res.json({
			message: "user updated successfully"
		})
	})
	.catch(error => {
		res.json({
			message: "an error occured when updating user"
		})
	})
}


const sendVerificationCode = (req,res,next) =>{

	var userMail = req.body.email
	var name = req.body.name
	var code = req.body.verificationCode
	var mailContent = `Almost done, `+name+` To complete your iCheck sign up, we just need to verify your email address: Please copy the code below to verify your account:`+code
		
	var mailOptions = {
		from: 'help.fashionar@gmail.com',
		to: userMail,
		subject: 'Confirm your iCheck account',
		text: mailContent
	};

	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
		  res.json({message: "error sending"})
		  console.log(error);
		} else {
		  res.json({message: 'sent'})
		}
	});
}

const verifyAccount = (req,res,next) => {

	let updatedUser = {
		verified: 1
	}

	User.findOneAndUpdate({ email: req.body.email },{$set: updatedUser})
	.then((user) => {
		res.json({
			_id:user._id,
			firstName:user.firstName,
			lastName:user.lastName,
			email:user.email,
			password:user.password,
			phone:user.phone,
			sexe:user.sexe,
			avatar:user.avatar
		})
	})
	.catch(error => {
		res.json({
			_id:"",
			firstName:"",
			lastName:"",
			email:"",
			password:"",
			phone:"",
			sexe:"",
			avatar:""
		})
	})
}




// -- Crud favorite

// get user favorites
const getFavorite = (req,res,next)  => {
	let userId = req.body.userId

	User.findById(userId).populate('favorites.product',{"reviews": 0}).exec(function (err, favorites) {
	        if (err) {
	            return res.json({
	            status: 0,
	            message: ('an error occured when displaying single favorites ' + err)
	            });
	        }
	        else {
	            res.json(favorites);
	        }
	    });
}

// add product to favorite
const addFavorite = (req, res) => {

    try {
    	
        User.findOne({'_id': req.body.userId}).exec(function (err, user) {
            if (err) {
            	
                return res.json({
                    status: 0,
                    message: ('Error find User ') + err
                });
            } else {
                try {
                	
                    var userFavorites = [];
                    
                    userFavorites = user.favorites;
                    const favorite = {
                        product: req.body.prodId
                    };
                    userFavorites.push(favorite);

                    user.favorites = userFavorites;
                    user.save(function (err) {
	                    if (err) {
	                        console.log('error' + err)
	                    } else {
	                        res.status(200).send(JSON.stringify({
								message:'favorite added succeffully'
							}))
	                    }
                    });
                    
                } catch (err) {
                    console.log(err);
                    
                    res.status(500).send(JSON.stringify({
                        message: '500 Internal Server Error'
					}))

                }
            }
        });

    } catch (err) {
        console.log(err);
        
        res.status(500).send(JSON.stringify({
            message: '500 Internal Server Error'
		}))

    }
}

// delete favorite
const removeFavorite = (req, res) => {

    try {
        User.findOne({'_id': req.body.userId}).exec(function (err, user) {
            if (err) {
                return res.json({
                    status: 0,
                    message: ('Error find user ') + err
                });
            } else {
                try {
                    for (var i = 0; i < user.favorites.length; i++) {
		                if(user.favorites[i].product==req.body.prodId)
		                {
		                    user.favorites.splice(i,1);
		                }
            		}
                    user.save(function (err) {
                        if (err) {
                            console.log('error' + err)
                        } else {
                            res.status(200).send(JSON.stringify({
								message:'favorite deleted succeffully'
							}))
                        }
                    });
                    
                } catch (err) {
                    console.log(err);
                    
                    res.status(500).send(JSON.stringify({
                        message: '500 Internal Server Error'
					}))

                }
            }
        });

    } catch (err) {
        console.log(err);
        
        res.status(500).send(JSON.stringify({
			status: 0,
            message: '500 Internal Server Error',
            data: {}
		}))

    }
}

//display uploads folder

const displayUploads = (req, res) => {
	var uploadFiles=[]
	const testFolder = './public/users/';
	fs.readdir(testFolder, (err, files) => {
	  files.forEach(file => {
	  	uploadFiles.push(file)
	  });
	  res.json(files)
	});
}







route.get('/',index)
route.get('/friends',friends)

//authentification
route.post('/login',login)
route.post('/register',register)
route.post('/sendVerificationCode',sendVerificationCode)
route.post('/verifyAccount',verifyAccount)
route.post('/updateAvatar/',updateAvatar)
route.post("/upload", multer({
    storage: storage
  }).single('upload'), function(req, res) {
	res.status(200).send(JSON.stringify({
		avatar: req.file.filename
	}))
  });

//Favorites routes
route.post('/getFavorite', getFavorite)
route.post('/addFavorite', addFavorite);
route.post('/removeFavorite', removeFavorite);

//uploads
route.get('/displayUploads',displayUploads)


module.exports = route;