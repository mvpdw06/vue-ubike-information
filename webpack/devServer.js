import path from "path";
import webpack from "webpack";
import webpackDevServer from "webpack-dev-server";
import config from "./webpack.config.babel";

const HOST = "localhost";
const PORT = 9000;

const server = new webpackDevServer(webpack(config), {
  contentBase: path.join(__dirname, "../output"),
  publicPath: config.output.publicPath,
  historyApiFallback: true,
  hot: true,
  inline: true,
  stats: {
    chunks: false,
    colors: true
  }
});

server.listen(PORT, HOST, err => {
  if (err) console.log(`Error: ${err}`);
  else console.log(`Server is running on ${HOST}:${PORT}`);
});
