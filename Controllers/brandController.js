/*const express = require('express');
const mongoose = require('mongoose');
const Brand = require('../Models/Brand')

const route = express.Router();

//show Brand list
const index = (req,res,next)  => {
	Brand.find()
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
	let brandId = req.body.brandId
	Brand.findById(brandId)
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
	let brand = new Brand({
		name: req.body.name,
		description: req.body.description,
		image: req.body.image,
		products: []
	})
	brand.save()
	.then(response => {
		res.json({
			message:"brand Added Successfully"
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

module.exports = route;*/