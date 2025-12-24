# eleventy-plugin-atlasicons
[![npm](https://img.shields.io/npm/v/eleventy-plugin-atlasicons.svg)](https://npmjs.com/package/eleventy-plugin-atlasicons)
[![npm](https://img.shields.io/npm/dt/eleventy-plugin-atlasicons.svg)](https://npmjs.com/package/eleventy-plugin-atlasicons)
[![license](https://img.shields.io/npm/l/eleventy-plugin-atlasicons.svg)](https://npmjs.com/package/eleventy-plugin-atlasicons)

An Eleventy [shortcode](https://www.11ty.dev/docs/shortcodes/), allows [Atlas icons](https://atlasicons.vectopus.com/) to be embedded as inline svg into templates.

## Installation
Install the plugin from [npm](https://www.npmjs.com/package/eleventy-plugin-atlasicons):

```
npm install eleventy-plugin-atlasicons --save-dev
```


Add it to your [Eleventy Config](https://www.11ty.dev/docs/config/) file:

**ESM (recommended):**
```js
import eleventyPluginAtlasicons from 'eleventy-plugin-atlasicons';

export default function (eleventyConfig) {
    eleventyConfig.addPlugin(eleventyPluginAtlasicons);
};
```

**CommonJS:**
```js
const eleventyPluginAtlasicons = require('eleventy-plugin-atlasicons');

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(eleventyPluginAtlasicons);
};
```


Advanced usage:

```js
import eleventyPluginAtlasicons from 'eleventy-plugin-atlasicons';

export default function (eleventyConfig) {
    eleventyConfig.addPlugin(eleventyPluginAtlasicons, {
        class: `atlas-icon`,
        style: `display: inline-block;`,
        category: 'unknown',
        size: 24,
        weight: 'regular', // thin, light, regular, medium, bold
        strokeWidth: 2, // optional
        color: 'currentColor',
        dataIconAttributes: false,
        debug: false
    });
};
```


## What does it do?
The plugin turns [11ty shortcodes](https://www.11ty.dev/docs/shortcodes/) like this:

```nunjucks
{% atlas "like-thumbs-up-sticker" %}
```

or

```nunjucks
{% atlasicon "like-thumbs-up-sticker" %}
```

into HTML code like this:

```html
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 22.91 22.91" stroke-width="1.5" class="atlas-icon" data-icon-category="achievement" data-icon-name="like-thumbs-up-sticker">
    <g transform="translate(-0.545 -0.545)">
        <path d="M22.5,12c0,.9-1.1,1.64-1.32,2.46s.35,2.05-.08,2.79-1.77.85-2.38,1.47-.71,1.94-1.47,2.37-1.94-.14-2.79.09S12.89,22.5,12,22.5s-1.63-1.1-2.46-1.32-2,.35-2.79-.09-.85-1.76-1.47-2.37S3.34,18,2.9,17.25s.15-1.93-.08-2.79S1.5,12.9,1.5,12s1.1-1.64,1.32-2.46-.35-2,.08-2.79S4.66,5.9,5.28,5.28,6,3.34,6.75,2.9s1.93.15,2.79-.08S11.1,1.5,12,1.5s1.64,1.1,2.46,1.32,2-.35,2.79.08.85,1.76,1.47,2.38S20.66,6,21.1,6.75s-.15,1.93.08,2.79S22.5,11.1,22.5,12Z" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10"></path>
        <line y1="8.59" transform="translate(7.23 8.18)" fill="none" stroke="currentColor" stroke-miterlimit="10"></line>
        <path d="M7.16,14.86h1l1.91,1h4.4a1.7,1.7,0,0,0,1.65-1.29l.58-2.33a1.4,1.4,0,0,0,.05-.41h0a1.7,1.7,0,0,0-1.7-1.7H13l.67-1.34a2.65,2.65,0,0,0,.29-1.2h0a1.27,1.27,0,0,0-1.27-1.28h0a1.28,1.28,0,0,0-1,.51L9.14,10.09H7.23" fill="none" stroke="currentColor" stroke-miterlimit="10"></path>
    </g>
</svg>
```


## Custom Usage

```nunjucks
{% atlas "like-thumbs-up-sticker", {
    size: 64,
    class: "atlas-icon bg-currentColor",
    dataIconAttributes: true
} %}
```

You can also pass a string as the second argument for extra classes (useful in Liquid templates):

```liquid
{% atlas "like-thumbs-up-sticker" "extra-class another-class" %}
```


## Contributing
If you notice an issue, feel free to [open an issue](https://github.com/reatlat/eleventy-plugin-atlasicons/issues).

1. Fork this repo
2. Clone `git clone git@github.com:reatlat/eleventy-plugin-atlasicons.git`
3. Install dependencies `npm install`
4. Build `npm run build`
5. Serve locally `npm run dev`


## Icons License
The icons were created by Ramy Wafaa and are available under the [MIT license](ICONS-LICENSE).

## License
The code is available under the [MIT license](LICENSE).
