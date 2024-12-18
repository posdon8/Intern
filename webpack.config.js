const { model } = require('mongoose');



const path = require('path');

module.exports = {
  mode: 'development', // hoặc 'production' nếu bạn đang build cho môi trường production
  resolve: {
    fallback: {
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("util/"),
      "url": require.resolve("url/"),
      "zlib": require.resolve("browserify-zlib"),
      "assert": require.resolve("assert/")
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Áp dụng cho các tệp .js và .jsx
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/, // Áp dụng cho các tệp .css
        use: ['style-loader', 'css-loader'] // Sử dụng style-loader và css-loader
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css'] // Cho phép Webpack xử lý các tệp .js, .jsx và .css
  }
};
