const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    metaData: String
})

ImageSchema.plugin(mongoosePaginate);

ImageSchema.statics.createImage = function (ImageObj) {
    return new Promise((resolve, reject) => {
        let image = new ImageModel({
            "url": ImageObj.url,
            "name": ImageObj.name,
            "type": ImageObj.type
        });

        image.save(function (err, data) {
            if (err) reject(err);
            console.log("Imaged saved", data);
            resolve(true);
        });
    })
}

ImageSchema.statics.getImages = async function (ImageOptions) {
    return ImageModel.paginate(
        {
            name: { $regex: ImageOptions.nameString, $options: 'i' }
        },
        {
            select: "-__v",
            offset: ImageOptions.offset,
            limit: ImageOptions.limit,
            sort: "name"
        });
}

const ImageModel = mongoose.model("Image", ImageSchema);

module.exports.ImageModel = ImageModel;
