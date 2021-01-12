const express = require('express');
const mongoose = require('mongoose');
const Event = require('../Models/Event')

const route = express.Router();

//show Post list
const index = (req,res,next)  => {
	Event.find().populate("user",{"favorites": 0,"friends": 0})
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
	let eventId = req.body.eventId
	Event.findById(eventId).populate("user",{"favorites": 0,"friends": 0})
	.then(response  => {
		res.json(response)
	})
	.catch(error  => {
		res.json({
			message: "an error occured when displaying single Event"
		})
	})
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

module.exports = route;