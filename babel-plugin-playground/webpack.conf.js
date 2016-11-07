// run webpack --config webpack.conf.js  --watch
module.exports = {
    entry: {
        playground: ["./playground.js"]
    },
    output: {
        path: "./",
        filename: "playground-dist.js"
    },
    module: {
        loaders: [
        {
            test: /\.json$/,
            loader: "json"
        }]
    },
    node: {
        fs: 'empty',
        module: 'empty',
        net: 'empty'
    },
    plugins: []
}
