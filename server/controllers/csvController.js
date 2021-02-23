const stream = require('stream');
//const await = require('await')
const fs = require('fs');
const path = require('path');

const db = require('../config/db.config.js');
const Persona = db.Persona;

const csv = require('fast-csv');
const Json2csvParser = require('json2csv').Parser;

/**
 * Upload  CSV file/ and Import data to MySQL/PostgreSQL database
 * @param {*} req 
 * @param {*} res 
 */
exports.uploadFile = (req, res) => {
    try{
        const personas= [];
        fs.createReadStream(__basedir + "/csvUploads/" + req.file.filename)
            .pipe(csv.parse({ headers: true }))
            .on('error', error => {
                console.error(error);
                throw error.message;
            })
            .on('data', row => {
                personas.push(row);
                console.log(row);
            })
            .on('end', () => {
                // Save personas to MySQL/PostgreSQL database
                Persona.bulkCreate(personas).then(() => {
                   
                    res.status(200).json({
                        status: "ok",
                        filename: req.file.originalname,
                        message: "Upload Successfully!",
                    });
                   
                });    
            });
    }catch(error){
    
        res.status(500).json({
            status: "fail",
            filename: req.file.originalname,
            error: "Upload Error! message = " + error.message
        });
    }
}


exports.downloadFile = (req, res) => {
    Persona.findAll({attributes: ['id', 'nombres', 'apellidos', 'edad', 'fechaIngreso', 'activo']}).then(objects => {
        const jsonPersonas = JSON.parse(JSON.stringify(objects));
        const csvFields = ['id', 'nombres', 'apellidos', 'edad', 'fechaIngreso', 'activo'];
        const json2csvParser = new Json2csvParser({ csvFields });
        const csvData = json2csvParser.parse(jsonPersonas);

        res.setHeader('Content-disposition', 'attachment; filename=personas.csv');
        res.set('Content-Type', 'text/csv');
        res.status(200).end(csvData);
    });
}