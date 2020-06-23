const mongoose = require('mongoose');
const Queue = require('bee-queue');

// Connect to mongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("MongoDB Connection failed", err));

//DB models
const {
    ImageModel
} = require("../models/Image");

const options = {
    getEvents: false,
    sendEvents: false,
    storeJobs: false,
    removeOnSuccess: true,
    removeOnFailure: true,
    redis: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        password: process.env.DB_PASS,
    },
}
// Metadata Extractor
const {
    extractMetadata
} = require("./metadata");

const metadataQueue = new Queue('metadata', options);

const saveImage = (ImageObject) => {
    let { name, url, type } = ImageObject;
    return new Promise((resolve, reject) => {
        ImageModel.createImage({ name, url, type }).then(async (doc) => {
            console.log(doc);
            await metadataQueue.createJob({ id: doc._id, url: doc.url }).save();
            resolve(doc);
        }).catch((err) => reject(err));
    });
}

const getImages = (query) => {
    let options = {
        nameString: query.nameString,
        limit: query.limit || 10,
        offset: query.offset || 0
    }
    return new Promise((resolve, reject) => {
        ImageModel.getImages(options)
            .then((result) => resolve(result.docs))
            .catch(error => reject(error));
    });
}



metadataQueue.process(3, async (job, done) => {
    try { // Try to extract metadata
        let metaData = await extractMetadata(job.data.url);
        await ImageModel.addMetadata(job.data.id, metaData);
        done();
    } catch (error) {
        console.log(error);
        done(error);
    }
});


module.exports = {
    saveImage: saveImage,
    getImages: getImages
}