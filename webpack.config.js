var webpack = require('webpack')
module.exports = {
    // entry: "./components/testComponent.js",
        entry: "./APP.js",
    output: {
        path: __dirname,
        // filename: "bundle.js"
        filename: "APP_bundle.js"
    },
    module: {
        rules: [
          {
            test: /\.css$/,
            loader: "style-loader!css-loader"
          },
          {
            test:/\.(woff2?|woff|eot|svg|jpg|png|ttf|jpeg|otf)(\?.*)?$/,
            loader:'url-loader'
          },
          {
            test:/\.js$/,
            loader:"babel-loader",
            exclude:/node_modules/,
            query:{
              presets:['es2015','react',"stage-0"]
            }
          }
        ]
      }
      // ,
      //  plugins: [
      //   new webpack.optimize.UglifyJsPlugin({
      //     compress: {
      //       warnings: false
      //     }
      //   })
      // ]
};