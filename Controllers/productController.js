const express = require('express');
const mongoose = require('mongoose');
const Product = require('../Models/Product')
require('../Models/User');
const route = express.Router();




//show product list
const index = (req,res,next)  => {
	try 
	{

	    Product.find().populate('reviews.user').exec(function (err, product) {
	        if (err) {
	            return res.json({
	            status: 0,
	            message: ('error get product ' + err)
	            });
	        }
	        else {
	            res.json(product);
	        }
	    });
	    

	} catch (err) {
	    console.log(err);
	    res.json({
	        status: 0,
	        message: '500 Internal Server Error',
	        data: {}
	    })

	}
}



//show single product
const show = (req,res,next)  => {
	let prodId = req.body.prodId



	Product.findById(prodId).populate('reviews.user').exec(function (err, product) {
	        if (err) {
	            return res.json({
	            status: 0,
	            message: ('an error occured when displaying single product ' + err)
	            });
	        }
	        else {
	            res.json(product);
	        }
	    });


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
		rate: req.body.rate,
		reviews: []
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
/*const update = (req,res,next) => {
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
}*/

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








// -- Crud Review
// add Review to Product

const addReview = (req, res) => {

    try {
    	
        Product.findOne({'_id': req.body.prodId}).exec(function (err, product) {
            if (err) {
            	
                return res.json({
                    status: 0,
                    message: ('Error find product ') + err
                });
            } else {
                try {
                	
                    var reviewContent = [];
                    if (req.body.review) {
                        reviewContent = product.reviews;
                        const review = {
                            review: req.body.review,
                            user: req.body.userId,
                            rate: req.body.rate
                        };
                        reviewContent.push(review);
                        var globalRate = 0;

                        for (var i = 0; i < reviewContent.length; i++) {
                        	globalRate += reviewContent[i].rate;
                        }

                        var rateMoyenne = (globalRate/(reviewContent.length));
                        product.rate = rateMoyenne;
                        product.reviews = reviewContent;
                        product.save(function (err) {
                            if (err) {
                                console.log('error' + err)
                            } else {
                                res.status(200).send(JSON.stringify({
									message:'review added succeffully'
								}))
                            }
                        });
                    }
                } catch (err) {
                    console.log(err);
                    
                    res.status(500).send(JSON.stringify({
						status: 0,
                        message: '500 Internal Server Error',
                        data: {}
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






//routes
route.get('/',index)
route.post('/id',show)
route.post('/add',store)
//route.post('/update',update)
route.post('/delete',destroy)

//Comments routes
route.post('/addReview', addReview);


module.exports = route;