const express = require('express');
const mongoose = require('mongoose');
const Message = require('../Models/Message')
const User = require('../Models/User')
const route = express.Router();

   
//show messages list
const getMessages = (req,res,next)  => {
	try 
	{
	    Message.findOne({'sender':req.body.senderId,'receiver':req.body.connectedId}).exec(function (err, messages) {
	        if (err) {
	            return res.json({
	            message: ('error get messages ' + err)
	            });
	        }
	        else {
	        	if (messages==null) {
	        		res.json([]);
	        	} else {
	        		res.json(messages);
	        	}
	            
	        }
	    });

	} catch (err) {
	    console.log(err);
	    res.json({
	        message: '500 Internal Server Error'
	    })

	}
}

//add product
const addMessage = (req,res,next) => {
	let message = new Message({
		sender: req.body.sender,
		receiver: req.body.receiver,
		type: req.body.type,
		message: req.body.message
	})
	message.save()
	.then(response => {
		res.json({
			message:"message Added Successfully"
		})
	})
	.catch(error  => {
		res.json({
			message: "an error occured when adding message"
		})
	})
}

route.post('/getMessages', getMessages);
route.post('/addMessage', addMessage);



module.exports = route;