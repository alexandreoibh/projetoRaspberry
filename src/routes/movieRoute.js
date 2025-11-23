const express = require('express');
const moviesRouter = express.Router();
const movieController = require('../app/controllers/movieController');
const auth = require("../middlewares/auth");

//get
moviesRouter.get('/',auth, movieController.getMovies);
moviesRouter.get('/goldenAwards', auth, movieController.getAwardsInterval);

//post

//put

//delete



module.exports = moviesRouter;