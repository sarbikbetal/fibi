require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5500;
const mongoose = require('mongoose');

const { body, validationResult, header, query } = require('express-validator');

//DB models
const { ImageModel } = require("./models/Image");


// Express middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to mongoDB
mongoose.connect(process.env.MONGO_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("MongoDB Connection failed", err));


//  POST route to add Image
app.post('/addImage', [
    header('Content-Type', "Please set the Content-Type header to application/json").exists(),
    body('url', "Invalid or empty url").isURL().bail(),
    body('name', "Name is required").exists(),
    body('type', "Invalid or empty mime type").isMimeType(),
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

    else {
        let { name, url, type } = req.body;
        ImageModel.createImage({ name, url, type }).then((done) => {
            res.json({ created: done });
        }).catch((error) => {
            res.json({ created: false, error: error });
        });
    }

});

// GET route to return Image Array
app.get('/getImages', [
    query('nameString', "nameString is required").exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    } else {
        try {
            let options = {
                nameString: req.query.nameString,
                limit: req.query.limit || 10,
                offset: req.query.offset || 0
            }

            let result = await ImageModel.getImages(options);
            res.json(result.docs);
        } catch (error) {
            res.status(503).json({ error: error.message });
        }
    }
})


app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));