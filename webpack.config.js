/**
 * Webpack位置文件
 * - 不区分发布环境/dev环境
 * @author Meng
 * @date 2016-07-14
 */

const webpack = require('webpack')
const path    = require('path')

module.exports = {
    // 如果这里不使用path.resolve会出现`wenpack`可以运行但是`node server`运行失败的情况,
    // 因为npm相对路径发生变化
    // @NOTE 使用绝对地址来避免潜在问题
    entry: {
        Engine: [path.resolve("./src/Engine.js"), 'webpack-hot-middleware/client?reload=true'], // 热重载中间件
        joint: [path.resolve("./src/demos/joint/index.js"), 'webpack-hot-middleware/client?reload=true'],
        test: [path.resolve("./src/demos/test/test.js"), 'webpack-hot-middleware/client?reload=true'],
        spring: [path.resolve("./src/demos/spring/index.js"), 'webpack-hot-middleware/client?reload=true'],
    },
    output: {
        path: path.resolve("./build"),
        publicPath: "/demo", // 为使内网可访问, 不指明host
        filename: "[name].js", // 存在多个入口是这里需要用变量 [name].js
    },
    resolve: { // 路径解析说明明
        root: path.resolve('src'),
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js'],
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel'
            }
        ]
    },
    devtool: "inline-source-map",
    watch: true,
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(), // 热重载
        new webpack.NoErrorsPlugin(), // 出错时不发布
        // new webpack.optimize.CommonsChunkPlugin('Engine', 'Enigne.js')
    ]

}
