import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsPath = path.join(__dirname, './atlas-icons');

const icons = {};

const _data = [];

fs.readdirSync(iconsPath).forEach(file => {
    const iconName = file.split('.')[0];
    if (iconName)
        icons[iconName] = [];
});

const readIcons = (type) => {
    fs.readdirSync(path.join(iconsPath, type)).forEach(file => {
        const iconName = file.split('.')[0];
        if (iconName) {
            icons[type].push(iconName);
            _data.push(iconName);
        }
    });
}

Object.keys(icons).forEach(key => {
    readIcons(key);
});

fs.writeFileSync(path.join(__dirname, '/icons.json'), JSON.stringify(icons, null, 2));
fs.writeFileSync(path.join(__dirname, '/demo/_data/icons.json'), JSON.stringify(_data, null, 2));

console.log('icons.json created');
