const path = require('path');

module.exports = {
    entry: {
        app:'./index.js'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: "app.bundle.js"
    },
    devtool: 'source-map',
    devServer:{
        contentBase: 'build'
    },
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query:{
                presets:['env','es2015']
            }
        }]
    }
};