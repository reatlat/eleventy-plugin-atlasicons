const eleventyPluginAtlasicons = require("../.eleventy.js");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(eleventyPluginAtlasicons, {
        size: 24,
        debug: true,
        color: "blue"
    });
};