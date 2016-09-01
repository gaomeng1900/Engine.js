/**
 * webpackp-dev-server
 * @author Meng
 * @date 2016-07-14
 */

const express = require('express')
const webpack = require('webpack')
const path = require('path')

// create normal express app
const app = express()

// create a webpack conpiter
const config   = require('./webpack.config')
const compiler = webpack(config)

// set dev_option
var devOption = {
    // noInfo: true,
    publicPath: config.output.publicPath, // 静态文件位置
    stats: { colors: true }, // 进度输出
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
}

// use webpack middleware with compiter & dev_option
app.use(require('webpack-dev-middleware')(compiler, devOption))
app.use(require('webpack-hot-middleware')(compiler))

// compit jade & route '/'to index.html
app.get('/:demoName', (req, res)=>{
    console.log('visiting demo: ', req.params.demoName)
    res.sendFile((path.join(__dirname, 'src/demos/' + req.params.demoName + '/index.html')))
})


// listen
app.listen(3444, '0.0.0.0', (err)=>{
    if (err) {
        console.log(err)
        return
    }
    else {
        console.log('Listening @ http://localhost:3444')
    }
})
