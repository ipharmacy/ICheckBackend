const express = require('express');
const mongoose = require('mongoose');
const Product = require('../Models/Product')

const route = express.Router();

//show product list
const index = (req,res,next)  => {
	Product.find()
	.then(response  => {
		res.json(response)
	})
	.catch(error  =>{
		res.json({
			message: "an error occured when displaying products"
		})
	})
}

//show single product
const show = (req,res,next)  => {
	let prodId = req.body.prodId
	Product.findById(prodId)
	.then(response  => {
		res.json(response)
	})
	.catch(error  => {
		res.json({
			message: "an error occured when displaying single product"
		})
	})
}

//add product
const store = (req,res,next) => {
	let product = new Product({
		name: req.body.name,
		description: req.body.description,
		image: req.body.image,
		brand: req.body.brand,
		category: req.body.category,
		address: req.body.address,
		available: req.body.available,
		rate: req.body.rate
	})
	product.save()
	.then(response => {
		res.json({
			message:"Product Added Successfully"
		})
	})
	.catch(error  => {
		res.json({
			message: "an error occured when adding product"
		})
	})
}

//update product
const update = (req,res,next) => {
	let prodId = req.body.prodId

	let updatedProd = {
		name: req.body.name,
		description: req.body.description,
		image: req.body.image,
		brand: req.body.brand,
		category: req.body.category,
		address: req.body.address,
		available: req.body.available,
		rate: req.body.rate
	}

	Product.findByIdAndUpdate(prodId,{$set: updatedProd})
	.then(() => {
		res.json({
			message: "product updated successfully"
		})
	})
	.catch(error => {
		res.json({
			message: "an error occured when updating product"
		})
	})
}

//delete product
const destroy = (req,res,next) => {
	let prodId = req.body.prodId
	Product.findByIdAndRemove(prodId)
	.then(() => {
		res.json({
			message:"product deleted successfully"
		})
	})
	.catch(error =>{
		res.json({
			message:"an error occured when deleting product"
		})
	})
}

//routes
route.get('/',index)
route.post('/id',show)
route.post('/add',store)
route.post('/update',update)
route.post('/delete',destroy)

module.exports = route;