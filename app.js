require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

const { body, validationResult, header, query } = require('express-validator');
const { saveImage, getImages } = require('./utils/controller');



// Express middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//  POST route to add Image
app.post('/addImage', [
    header('Content-Type', "Please set the Content-Type header to application/json").exists(),
    body('url', "Invalid or empty url").isURL().bail(),
    body('name', "Name is required").exists(),
    body('type', "Invalid or empty mime type").isMimeType(),
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

    else {
        // Save it to DB
        saveImage(req.body)
            .then((data) => res.json(data))
            .catch((error) => res.json({ created: false, error: error }));
    }
});

// GET route to return Image Array
app.get('/getImages', [
    query('nameString', "nameString is required").exists()
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

    else {
        getImages(req.query)
            .then(docs => res.json(docs))
            .catch(error => res.status(503).json({ error: error.message }));
    }
})


app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));