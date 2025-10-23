module.exports = {
    mode: "production",
    // entry: {
    //     index: "./src/js/index.js",
    //     contacts: "./src/js/contact.js",
    // },
    output: {
        filename: "[name].bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/env"],
                    },
                },
            },
        ],
    },
};
