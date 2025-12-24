const fs = require('fs');
const path = require('path');
const { parseHTML } = require('linkedom');

const atlasIcons = JSON.parse(fs.readFileSync(path.join(__dirname, 'icons.json'), 'utf8'));

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

        // Support string as second arg for extra classes (Liquid compatibility)
        if (typeof attributes === 'string') {
            attributes = { class: `${globalAttributes.class} ${attributes}` };
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

        // safely get SVG content
        const svgContent = fs.readFileSync(
            path.join(__dirname, `./atlas-icons/${attributes.category}/${iconName}.svg`),
            "utf8"
        ).trim();

        const { document } = parseHTML(svgContent);

        // Remove stroke-width attributes
        document.querySelectorAll('[stroke-width]').forEach(el => el.removeAttribute('stroke-width'));

        const styleEl = document.querySelector('style');
        let styles = styleEl?.textContent;

        if (styles) {
            const parsedStyles = styles.split('}').filter(Boolean).map(style => {
                const styleObject = {};
                const styleArray = style.split('{').filter(Boolean);
                styleArray[0].split(',').forEach(selector => {
                    styleObject[selector] = styleArray[1];
                });
                return styleObject;
            });

            // merge styles if class is the same
            const mergedStyles = {};
            parsedStyles.forEach(style => {
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
                        styleArray[1] = attributes.strokeWidth;
                    }
                    styleObject[styleArray[0]] = styleArray[1];
                });
                mergedStyles[key] = styleObject;
            });

            // for each mergedStyles key, apply to matching elements
            Object.keys(mergedStyles).forEach(key => {
                document.querySelectorAll(key).forEach(el => {
                    const styleObject = mergedStyles[key];
                    Object.keys(styleObject).forEach(styleKey => {
                        el.setAttribute(styleKey, styleObject[styleKey]);
                    });
                });
            });
        }

        // Remove defs
        document.querySelectorAll('defs').forEach(el => el.remove());

        // cleanup SVG
        document.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
        document.querySelectorAll('[class]').forEach(el => el.removeAttribute('class'));
        document.querySelectorAll('[data-name]').forEach(el => el.removeAttribute('data-name'));
        document.querySelectorAll('[stroke]').forEach(el => el.setAttribute('stroke', attributes.color));
        document.querySelectorAll('[fill]:not([fill="none"])').forEach(el => el.setAttribute('fill', attributes.color));

        const svg = document.querySelector('svg');

        svg.setAttribute('stroke-width', attributes.strokeWidth);

        if (attributes.class) {
            const existingClass = svg.getAttribute('class') || '';
            svg.setAttribute('class', existingClass ? `${existingClass} ${attributes.class}` : attributes.class);
        }

        if (attributes.debug || attributes.dataIconAttributes) {
            svg.setAttribute('data-icon-category', attributes.category);
            svg.setAttribute('data-icon-name', iconName);
        }

        if (attributes.size) {
            svg.setAttribute('width', attributes.size);
            svg.setAttribute('height', attributes.size);
        }

        if (attributes.style) {
            svg.setAttribute('style', attributes.style);
        }

        // Remove the icon from the accessibility tree
        svg.setAttribute('aria-hidden', 'true');

        return svg.outerHTML.trim();
    };

    eleventyConfig.addShortcode("atlas", shortcodeHandler);
    eleventyConfig.addShortcode("atlasicon", shortcodeHandler);

};
