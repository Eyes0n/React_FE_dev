const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// It will search for CSS assets during the Webpack build and will optimize \ minimize the CSS
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const TerserPlugin = require('terser-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode,
  entry: {
    main: './src/index.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'inline-source-map',
  devServer: {
    // Enable webpack's Hot Module Replacement feature
    hot: true,

    // show only compiler errors
    overlay: true,

    stats: 'errors-only',

    // Proxying some URLs can be useful when you have a separate API backend development server and you want to send API requests on the same domain.
    proxy: {
      '/api': 'http://localhost:8081',
    },

    // When using the HTML5 History API, the index.html page will likely have to be served in place of any 404 responses.
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.((c|sa|sc)ss)$/i,
        use: [
          // Add exports of a module as style to DOM
          {
            loader:
              process.env.NODE_ENV === 'production'
                ? MiniCssExtractPlugin.loader
                : 'style-loader',
          },

          // Loads CSS file with resolved imports and returns CSS code
          { loader: 'css-loader' },

          // Loads and compiles a SASS/SCSS file
          { loader: 'sass-loader' },
        ],
      },
      // {
      //   test: /\.(png|jpe?g|gif)$/i,
      //   loader: "file-loader",
      //   options: {
      //     name: "[path][name].[ext]",
      //   },
      // },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: '[path][name].[ext]',
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `빌드 날짜: ${new Date().toLocaleString()}`,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      templateParameters: {
        env: process.env.NODE_ENV === 'development' ? '(개발용)' : '',
      },
      minify:
        process.env.NODE_ENV === 'production'
          ? {
              collapseWhitespace: true, // 빈칸 제거
              removeComments: true, // 주석 제거
            }
          : false,
      hash: process.env.NODE_ENV === 'production',
    }),
    process.env.NODE_ENV === 'production' &&
      new MiniCssExtractPlugin({ filename: '[name].css' }),
    new CleanWebpackPlugin(),
  ].filter(Boolean),
  optimization: {
    minimizer:
      mode === 'production'
        ? [
            // css파일 압축
            new OptimizeCSSAssetsPlugin(),

            // js 난독화 & debugger 구문 제거 plugin
            new TerserPlugin({
              terserOptions: {
                compress: {
                  drop_console: true, // 콘솔 로그 제거
                },
              },
            }),
          ]
        : [],

    splitChunks: {
      // include all types of chunks
      chunks: 'all',
    },
  },
};
