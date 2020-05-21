const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env, argv) => {
  const PRODUCTION = argv.mode === 'production';
  return {
    context: path.join(__dirname, './src'),
    entry: {
      matrix: './js/components/matrix.js',
      style: "./sass/build/style.scss",
      main: './js/main.js',
    },

    output: {
      // __dirnameは webpack.config.js があるディレクトリの絶対パス
      path: path.join(__dirname, './dist/'),
      // 出力ファイル名
      // [name]はentryがハッシュの場合、keyで置換される
      filename: 'js/[name].bundle.js'
    },

    resolve: {
      extensions: ['.js'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
      }
    },
    optimization: {
      splitChunks: {
        name: 'vendor',
        chunks: 'initial',
      }
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                url: false,
                sourceMap: !PRODUCTION
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true, //ソースマップを有効
                plugins:
                  argv.mode === 'production'
                    ? [
                      require('autoprefixer')({
                        grid: true,
                        "browsers": [
                          "> 1%",
                          "IE 11"
                        ]
                      }),
                      require('cssnano')({
                        autoprefixer: false
                      })
                    ]
                    : [],
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: !PRODUCTION
              }
            }
          ]
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          // Babel のオプションを指定する
          options: {
            presets:
              argv.mode === 'production'
                ? [
                  '@babel/preset-env'
                ]
                : [],
          }
        },
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'styles/[name].css',
      }),

    ]
  }
};