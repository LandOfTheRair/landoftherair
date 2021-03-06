
console.info('Building Macicon icon list...');

const fs = require('fs');

const dir2 = `${__dirname}/../src/assets/generated`;
if (!fs.existsSync(dir2)){
  fs.mkdirSync(dir2);
}

const files = fs.readdirSync(`${__dirname}/../src/assets/macicons`);
const realNames = files.map(x => x.split('.')[0]);
fs.writeFileSync(`${__dirname}/../src/assets/generated/macicons.json`, JSON.stringify({ macroNames: realNames }));
