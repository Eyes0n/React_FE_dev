const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  modules: {
    rules: [
      {
        test: /\.((c|sa|sc)ss)$/i,
        use: [
          // Add exports of a module as style to DOM
          { loader: 'style-loader' },

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
        test: /\.m?js$/,
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
  plugins: [],
};
