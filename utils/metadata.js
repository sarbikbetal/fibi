const fetch = require('node-fetch');
const fileType = require('file-type');

const extractMetadata = (url) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(url);
            const buffer = await response.buffer();
            let size = Buffer.byteLength(buffer);
            let type = await fileType.fromBuffer(buffer);
            resolve({ size, extType: type.ext, mime: type.mime });
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    extractMetadata: extractMetadata
}