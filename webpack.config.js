const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports =
{
    resolve: {
      extensions: ['', '.js', '.jsx'],
    },
    devtool: 'source-map',
    module:
    {
        rules:[
            {
                test: /\.html$/,
                use: [{loader: "html-loader", options: {minimize: true}}]
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {loader: "babel-loader"}
            },
            {
                test: /\.(css|scss)$/,
                use: [ 'style-loader', 
                {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    esModule: false,
                  },
                }, 
                    {
                      loader: 'css-loader'
                    },
                    { loader: 'postcss-loader', options: {
                      postcssOptions: {
                        plugins: ["autoprefixer"]
                      },
                    },},
                    'sass-loader']
            },

            {
              test: /\.(svg|png|jpe?g)/i,
              type: 'asset/resource'
            },
            {
              test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
              type: 'asset/resource'
            },
        ]
    },
    
    plugins:[
        new HtmlWebPackPlugin({
            template: "public/index.html",
            filename: "./index.html"
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ]
};