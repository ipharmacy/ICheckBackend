const express = require('express');
const mongoose = require('mongoose');
const Product = require('../Models/Product')
const User = require('../Models/User')
//require('../Models/User');
const route = express.Router();



//show product list
const index = (req,res,next)  => {
	try 
	{
	    Product.find().populate('reviews.user',{"favorites": 0}).exec(function (err, product) {
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

//show trending product list
const trending = (req,res,next)  => {
	try 
	{
	    Product.find().sort('-rate').populate('reviews.user',{"favorites": 0}).exec(function (err, product) {
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

	Product.findById(prodId).populate('reviews.user',{"favorites": 0}).exec(function (err, product) {
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


//detail single product
const detail = (req,res,next)  => {
	let prodId = req.body.prodId

	var connectedUser;
	User.findOne({'_id': req.body.userId})
	.then(user => {
		connectedUser = user
	})

	Product.findById(prodId).populate('reviews.user',{"favorites": 0}).exec(function (err, product) {
	        if (err) {
	            return res.json({
	            status: 0,
	            message: ('an error occured when displaying single product ' + err)
	            });
	        }
	        else {
	            //res.json(product);
	            var isLiked="0";
	            
	            for (var i = 0; i < connectedUser.favorites.length; i++) {
	            	if (connectedUser.favorites[i].product.toString()===product._id.toString()) {
	            		isLiked="1";
	            	}
	            }

	            res.json({
					product:product,
					isLiked:isLiked
				})
	        }
	    });
}

//add product
const store = (req,res,next) => {
	let product = new Product({
		name: req.body.name,
		description: req.body.description,
		image: [],
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



//search all collections
const search = (req,res,next)  => {

	var searchResult=[]

	Product.find({ name: { $regex: req.body.searchString, $options: "i" } })
	.then(products => {
		if (products.length==0) {
			console.log("no products found");
		} else {
			for (var i = 0; i < products.length; i++) {
				if (i==0) {
					const element = {
		            photo: "",
		            name: "Products",
		            description: "",
		            type:"filter"
	        		};
	        		searchResult.push(element);
	        	}
	        	const element = {
		            photo: products[i].image[0],
		            name: products[i].name,
		            description: products[i].description,
		            type:"product"
	        	};
	        	searchResult.push(element);
				
			}
			
		}
	})

	User.find({ firstName: { $regex: req.body.searchString, $options: "i" } })
	.then(users => {
		if (users.length==0) {
			console.log("no users found");
		} else {
			for (var j = 0; j < users.length; j++) {
				if (j==0) {
					const element = {
		            photo: "",
		            name: "Users",
		            description: "",
		            type:"filter"
	        	};
	        	searchResult.push(element);
				}
				const element = {
		            photo: users[j].avatar,
		            name: users[j].firstName+" "+users[j].lastName,
		            description: users[j].email,
		            type:"user"
		        	};
		        searchResult.push(element);

			  	
			}
		}
		res.json(searchResult)
		
		
		
	})

	//res.json(searchResult)

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
                        var getRate = parseFloat(req.body.rate)
                        const review = {
                            review: req.body.review,
                            user: req.body.userId,
                            rate: getRate
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


// delete Review from Product

const removeReview = (req, res) => {

    try {

        Product.findOne({'_id': req.body.prodId}).exec(function (err, product) {
            if (err) {
            	
                return res.json({
                    status: 0,
                    message: ('Error find product ') + err
                });
            } else {
                try {
                    for (var i = 0; i < product.reviews.length; i++) {
		                if(product.reviews[i]._id==req.body.reviewId)
		                {
		                    product.reviews.splice(i,1);
		                }
            		}
                    product.save(function (err) {
                        if (err) {
                            console.log('error' + err)
                        } else {
                            res.status(200).send(JSON.stringify({
								message:'review deleted succeffully'
							}))
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


// get reviews by product

const getProductReviews = (req, res) => {

    try {
        Product.findOne({'_id': req.body.prodId}).populate('reviews.user',{"favorites": 0}).exec(function (err, product) {
            if (err) {
                return res.json({
                    status: 0,
                    message: ('Error find product ') + err
                });
            } else {
                try {
                    res.json(product.reviews);
                    
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
route.get('/trending',trending)
route.post('/id',show)
route.post('/detail',detail)
route.post('/search',search)
route.post('/add',store)
//route.post('/update',update)
route.post('/delete',destroy)

//Reviews routes
route.post('/addReview', addReview);
route.post('/removeReview', removeReview);
route.post('/getProductReviews', getProductReviews);



module.exports = route;