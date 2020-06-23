const fetch = require('node-fetch');
const fileType = require('file-type');

const extractMetadata = async (url) => {
    const response = await fetch(url);
    const buffer = await response.buffer();
    let size = Buffer.byteLength(buffer);
    let type = await fileType.fromBuffer(buffer);
    return { size, extType: type.ext, mime: type.mime };
}

module.exports = {
    extractMetadata: extractMetadata
}