const express = require('express');
const moviesRouter = express.Router();
const movieController = require('../app/controllers/movieController');

//get
moviesRouter.get('/', movieController.getMovies);
moviesRouter.get('/goldenAwards', movieController.getAwardsInterval);

//post

//put

//delete



module.exports = moviesRouter;