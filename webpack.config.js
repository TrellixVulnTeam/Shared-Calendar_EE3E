const path = require("path");

module.exports = {
    // 建置模式
    // development ( 有助於 debug )
    // production ( 不易於 debug )
    mode: "development", 
    // 程式入口
    entry: "./src/index.js", 
    // 程式輸出
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist")
    }, 
    // DevServer 設定
    devServer: {
        // 伺服器的根目錄資料夾
        static: "./dist",  // static: "./dist" or contentBase: "./dist"
        historyApiFallback: true
    }, 
    // 模組載入規則
    module: {
        rules: [
            // CSS 樣式表
            {
                test: /\.css$/i, // 正規表示式 ( Regular Expression )
                use: ["style-loader", "css-loader"] // 順序不能寫錯
            }, 
            // SCSS 樣式表
            {
                test: /\.scss$/i, // 正規表示式 ( Regular Expression )
                use: ["style-loader", "css-loader", "sass-loader"] // 順序不能寫錯
            }, 
            // Babel 
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }, 
};