let generator = require('string-generator-js');
const options = { length: 5 }

function randomString() {
    return generator.generate(options);
}

function getNow() {
    const d = new Date();

    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
}



module.exports = { randomString, getNow }