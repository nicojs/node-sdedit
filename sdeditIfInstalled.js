const fs = require('fs');
const path = require('path');

if (!fs.existsSync(path.resolve(__dirname, 'tsconfig.json'))) {
    require(path.resolve(__dirname, 'bin', 'sdedit'));
} else {
    console.log('skipping update');
}