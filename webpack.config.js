/* Very old Javascript Code
    can't Import
    can't export default
*/
/* Two Precautions
    Entry : Base File(pre-compile)

*/
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const BASE_PATH="./src/client/js/";

// Webpack read code reverse, such as backside to frontside.
module.exports={
    entry: {
        // main, videoPlayer = [name]
        main: BASE_PATH+"main.js",
        videoPlayer: BASE_PATH+"videoPlayer.js",
        videoRecorder: BASE_PATH+"videoRecorder.js",
        commentCraetor: BASE_PATH+"commentCraetor.js",
    },
    // mode: "development",
    // watch: true,
    plugins: [
        new MiniCssExtractPlugin({
                filename: "css/styles.css",
        }),
    ],
    output: {
        filename: "js/[name].js",
        path: path.resolve(__dirname, "assets"),
        clean: true,
    },
    // Extra Settings
    module: {
        rules: [
            // JS
            {
                test: /\.js$/,
                use: {
                    // loader settings : copy
                    loader: "babel-loader",
                    options: {
                        presets: [["@babel/preset-env", { targets: "defaults" }]],
                    },
                },
            },
            // CSS
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader,"css-loader","sass-loader"],
            },
        ],
    },
};