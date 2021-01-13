const express = require('express');
const mongoose = require('mongoose');
const Event = require('../Models/Event')

const route = express.Router();

//show Post list
const index = (req,res,next)  => {
	Event.find().select({'participations':0}).populate("user",{"favorites": 0,"friends": 0})
	.then(response  => {
		res.json(response)
	})
	.catch(error  =>{
		res.json({
			message: "an error occured when displaying Events"
		})
	})
}

//show single Event
const show = (req,res,next)  => {
	Event.findOne({"_id":req.body.eventId}).populate("user",{"favorites": 0,"friends": 0})
	.then(event  => {
		var isLiked="0";
		for (var i = 0; i < event.participations.length; i++) {
			if (event.participations[i].user.toString()===req.body.userId.toString()) {
	            isLiked="1";
	        }
		}
		res.json({
			event:{
	        "_id": event._id,
	        "title": event.title,
	        "description": event.description,
	        "user": event.user,
	        "createdAt": event.createdAt,
	        "updatedAt": event.updatedAt,
	        "__v": event.__v
	    },
			isLiked:isLiked
		})
	})
	.catch(error  => {
		res.json({
			message: "an error occured when displaying single Event"
		})
	})
}

//detail single product
const getEventsByUser = (req,res,next)  => {
	Event.find({'user': req.body.userId}).populate("user",{"favorites": 0,"friends": 0})
	.then(events => {
		res.json(events)
	})
}

// add product to favorite
const addParticipation = (req, res) => {

    try {
    	
        Event.findOne({'_id': req.body.eventId}).populate("user",{"favorites": 0,"friends": 0}).exec(function (err, event) {
            if (err) {
            	
                return res.json({
                    status: 0,
                    message: ('Error find User ') + err
                });
            } else {
                try {
                	
                    var eventParticipations = [];
                    
                    eventParticipations = event.participations;
                    const participation = {
                        user: req.body.userId
                    };
                    eventParticipations.push(participation);

                    event.participations = eventParticipations;
                    event.save(function (err) {
	                    if (err) {
	                        console.log('error' + err)
	                    } else {
	                        res.status(200).send(JSON.stringify({
								message:'participation added succeffully'
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
const removeParticipation = (req, res) => {

    try {
        Event.findOne({'_id': req.body.eventId}).populate("user",{"favorites": 0,"friends": 0}).exec(function (err, event) {
            if (err) {
                return res.json({
                    status: 0,
                    message: ('Error find user ') + err
                });
            } else {
                try {
                    for (var i = 0; i < event.participations.length; i++) {
		                if(event.participations[i].user.toString()==req.body.userId)
		                {
		                    event.participations.splice(i,1);
		                }
            		}
                    event.save(function (err) {
                        if (err) {
                            console.log('error' + err)
                        } else {
                            res.status(200).send(JSON.stringify({
								message:'participation deleted succeffully'
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

//add Event
const store = (req,res,next) => {
	let event = new Event({
		title: req.body.title,
		description: req.body.description,
		user: req.body.user
	})
	event.save()
	.then(response => {
		res.json({
			message:"event Added Successfully"
		})
	})
	.catch(error  => {
		res.json({
			message: "an error occured when adding event"
		})
	})
}




//routes
route.get('/',index)
route.post('/id',show)
route.post('/add',store)
route.post('/getEventsByUser',getEventsByUser)
route.post('/addParticipation',addParticipation)
route.post('/removeParticipation',removeParticipation)

module.exports = route;