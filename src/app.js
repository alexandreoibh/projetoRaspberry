const express = require('express');
require('./config/database');
require('dotenv').config({ quiet: true });


const csvImportService = require('./services/importService');
const movieRoutes = require('./routes/movieRoute');
const app = express();
const port = process.env.PORT || 3000;
global.appLoading = true;

app.use('/api/v1/movies', movieRoutes);

if (process.env.NODE_ENV !== "test") {
    process.nextTick(() => {
        csvImportService.executeService()
            .then(() => global.appLoading = false)
            .catch(() => global.appLoading = false);
    });
}
module.exports = app;