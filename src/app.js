const express = require('express');
require('./config/database');

const csvImportService = require('./services/importService');
const movieRoutes = require('./routes/movieRoute');
const app = express();
const port = 3000;
global.appLoading = true;

app.use('/api/v1/movies', movieRoutes);


app.listen(port, () => {
    console.log(`Service OnLine Port ${port}`);
  
    process.nextTick(() => {
        csvImportService.executeService()
            .then(() => global.appLoading = false)
            .catch(() => global.appLoading = false);
    });
   
});
