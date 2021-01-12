const express = require('express');
const mongoose = require('mongoose');
const Post = require('../Models/Post')

const route = express.Router();

//show Post list
const index = (req,res,next)  => {
	Post.find().populate("user",{"favorites": 0,"friends": 0})
	.then(response  => {
		res.json(response)
	})
	.catch(error  =>{
		res.json({
			message: "an error occured when displaying Posts"
		})
	})
}

//show single Post
const show = (req,res,next)  => {
	let categoryId = req.body.postId
	Post.findById(categoryId).populate("user",{"favorites": 0,"friends": 0})
	.then(response  => {
		res.json(response)
	})
	.catch(error  => {
		res.json({
			message: "an error occured when displaying single Post"
		})
	})
}

//add Post
const store = (req,res,next) => {
	let post = new Post({
		title: req.body.title,
		description: req.body.description,
		user: req.body.user
	})
	post.save()
	.then(response => {
		res.json({
			message:"post Added Successfully"
		})
	})
	.catch(error  => {
		res.json({
			message: "an error occured when adding post"
		})
	})
}




//routes
route.get('/',index)
route.post('/id',show)
route.post('/add',store)

module.exports = route;