const express = require('express');
const mongoose = require('mongoose');
const Category = require('../Models/Category')

const route = express.Router();

//show Brand list
const index = (req,res,next)  => {
	Category.find()
	.then(response  => {
		res.json(response)
	})
	.catch(error  =>{
		res.json({
			message: "an error occured when displaying products"
		})
	})
}

//show single Brand
const show = (req,res,next)  => {
	let categoryId = req.body.categoryId
	Category.findById(categoryId)
	.then(response  => {
		res.json(response)
	})
	.catch(error  => {
		res.json({
			message: "an error occured when displaying single product"
		})
	})
}

//add Brand
const store = (req,res,next) => {
	let category = new Category({
		name: req.body.name,
		description: req.body.description,
		image: req.body.image
	})
	category.save()
	.then(response => {
		res.json({
			message:"category Added Successfully"
		})
	})
	.catch(error  => {
		res.json({
			message: "an error occured when adding product"
		})
	})
}




//routes
route.get('/',index)
route.post('/id',show)
route.post('/add',store)

module.exports = route;