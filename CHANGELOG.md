# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2025-12-24

### Changed

- **BREAKING**: Converted to ES modules (ESM) as the primary module format
- **BREAKING**: Replaced `cheerio` with `linkedom` for lighter SVG manipulation
- **BREAKING**: Moved `@11ty/eleventy` from dependencies to peerDependencies (requires `>=2.0.0`)
- Updated Node.js requirement to v24 in GitHub Actions workflow

### Added

- Dual ESM/CommonJS support via package.json exports
- CommonJS wrapper (`.eleventy.cjs`) for backwards compatibility with `require()`
- Liquid template support: string as second argument for extra classes (e.g., `{% atlas "icon-name" "extra-class" %}`)

### Migration Guide

**For ESM projects (recommended):**
```js
import eleventyPluginAtlasicons from 'eleventy-plugin-atlasicons';

export default function (eleventyConfig) {
    eleventyConfig.addPlugin(eleventyPluginAtlasicons);
};
```

**For CommonJS projects:**
```js
const eleventyPluginAtlasicons = require('eleventy-plugin-atlasicons');

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(eleventyPluginAtlasicons);
};
```

## [1.1.0] - 2024-04-21

- Added `aria-hidden` attribute to SVGs for accessibility
- Package version update

## [1.0.0] - Initial Release

- Initial release with atlas icons support
- Shortcodes: `{% atlas "icon-name" %}` and `{% atlasicon "icon-name" %}`
- Weight variants: thin, light, regular, medium, bold
- Customizable size, color, and styling options
