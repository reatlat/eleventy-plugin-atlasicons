import eleventyPluginAtlasicons from "../.eleventy.js";

export default function (eleventyConfig) {
    eleventyConfig.addPlugin(eleventyPluginAtlasicons, {
        size: 24,
        debug: true,
        color: "blue"
    });
};
