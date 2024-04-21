const atlasIcons = require('./icons.json');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

module.exports = (eleventyConfig, attributes = {}) => {

    const defaultAttributes = {
        class: `atlas-icon`,
        style: false,
        category: 'unknown',
        size: 24,
        weight: 'regular', // thin, light, regular, medium, bold
        color: 'currentColor',
        dataIconAttributes: false,
        debug: false,
    }

    const globalAttributes = { ...defaultAttributes, ...attributes };

    const shortcodeHandler = (iconName, attributes = {}) => {
        if (!iconName) {
            throw new Error(
                "[eleventy-plugin-atlasicons] the iconName must be specified"
            );
        }

        attributes = { ...globalAttributes, ...attributes };

        if (!Object.keys(atlasIcons).includes(attributes.category)) {
            // try to guess the attributes.category by iconName in atlasIcons
            const iconCategoryByIconName = Object.keys(atlasIcons).find(key => atlasIcons[key].includes(iconName));
            if (iconCategoryByIconName) {
                attributes.category = iconCategoryByIconName;
            } else {
                throw new Error(
                    `[eleventy-plugin-atlasicons] the attributes.category "${attributes.category}" does not exist`
                );
            }

        }

        if (!atlasIcons[attributes.category].includes(iconName)) {
            throw new Error(
                `[eleventy-plugin-atlasicons] the iconName "${iconName}" does not exist in the ${attributes.category} type`
            );
        }


        if (!attributes.strokeWidth) {
            switch (attributes.weight) {
                case 'thin':
                    attributes.strokeWidth = 0.5
                    break;
                case 'light':
                    attributes.strokeWidth = 1
                    break;
                case 'medium':
                    attributes.strokeWidth = 2
                    break;
                case 'bold':
                    attributes.strokeWidth = 2.5
                    break;
                case 'normal':
                case 'regular':
                default:
                    attributes.strokeWidth = 1.5
                    break;
            }
        }

        // safetly get SVG content
        const svgContent = fs.readFileSync(
            path.join(__dirname, `./atlas-icons/${attributes.category}/${iconName}.svg`),
            "utf8"
        ).trim();


        const $ = cheerio.load(svgContent, {
            xmlMode: true
        });

        $('[stroke-width]').removeAttr('stroke-width');

        let styles = $(`style`).html()

        if (styles) {
            styles = styles.split('}').filter(Boolean).map(style => {
                const styleObject = {};
                const styleArray = style.split('{').filter(Boolean);
                styleArray[0].split(',').forEach(selector => {
                    styleObject[selector] = styleArray[1];
                });
                return styleObject;
            });

            // merge styles if class is the same
            const mergedStyles = {};
            styles.forEach(style => {
                Object.keys(style).forEach(key => {
                    if (mergedStyles[key]) {
                        mergedStyles[key] = `${mergedStyles[key]}${style[key]}`;
                    } else {
                        mergedStyles[key] = style[key];
                    }
                });
            });

            // parse object values to object
            Object.keys(mergedStyles).forEach(key => {
                const styleObject = {};
                mergedStyles[key].split(';').filter(Boolean).forEach(style => {
                    const styleArray = style.split(':').filter(Boolean);
                    if (styleArray[0] === 'stroke') {
                        styleArray[1] = attributes.color;
                    }
                    if (styleArray[0] === 'stroke-width') {
                        styleArray[1] = attributes.strokeWidth; // Number(styleArray[1].replace('px', ''));
                    }
                    styleObject[styleArray[0]] = styleArray[1];
                });
                mergedStyles[key] = styleObject;
            });

            // for each mergedStyles key
            Object.keys(mergedStyles).forEach(key => {
                $(key).each((i, el) => {
                    const styleObject = mergedStyles[key];
                    Object.keys(styleObject).forEach(styleKey => {
                        $(el).attr(styleKey, styleObject[styleKey]);
                    });
                });
            });
        }

        $(`defs`).remove();

        // cleanup SVG
        $(`[id]`).removeAttr(`id`);
        $(`[class]`).removeAttr(`class`);
        $(`[data-name]`).removeAttr(`data-name`);
        $(`[stroke]`).attr(`stroke`, attributes.color);
        $(`[fill]:not([fill="none"])`).attr(`fill`, attributes.color);

        $(`svg`).attr(`stroke-width`, attributes.strokeWidth);

        if (attributes.class) {
            $(`svg`).addClass(attributes.class);
        }

        if (attributes.debug || attributes.dataIconAttributes) {
            $(`svg`).attr('data-icon-category', attributes.category);
            $(`svg`).attr('data-icon-name', iconName);
        }

        if (attributes.size) {
            $(`svg`).attr(`width`, attributes.size);
            $(`svg`).attr(`height`, attributes.size);
        }

        if (attributes.style) {
            $(`svg`).attr(`style`, attributes.style);
        }

        // Remove the icon from the accessibility tree. TY to @FlorianBoe
        $(`svg`).attr(`aria-hidden`, 'true');

        return $.html().trim();
    };

    eleventyConfig.addShortcode("atlas", shortcodeHandler);
    eleventyConfig.addShortcode("atlasicon", shortcodeHandler);

};
