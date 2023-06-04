require('express-async-errors');
require('dotenv/config')

const migrationRun = require('./database/sqlite/migrations')
const AppError = require('./utils/AppError');

const express = require('express');
const app = express();
const routes = require('./routers/index');
const uploadsConfig = require('./configs/upload')
const cors = require('cors');
const PORT = process.env.PORT || 8080

app.use(express.json());
app.use(cors());

app.use(routes);

migrationRun();

app.use('/files', express.static(uploadsConfig.UPLOADS_FOLDER));

app.use((error, req, res, next)=>{
    if(error instanceof AppError){
        return res.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    }

    console.error(error.message)

    return res.status(500).json({
        status: "error",
        message: 'internal server error'
    });
})

app.listen(PORT, ()=>{
    console.log(`server is running at port ${PORT}`);
});