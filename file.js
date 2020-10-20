const fs = require('fs');
const obj = {
    read(path, callback, encoding = 'utf-8') {
        fs.readFile(path, encoding, callback);
    },
    write(path, data, callback) {
        fs.writeFile(path, data, callback);
    }
}

module.exports = obj;