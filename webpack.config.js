import { pathConfig } from "./path.config.js"

export const config = {
    mode: process.env.NODE_ENV,
    devtool: "source-map",
    entry: {
        index: `./${pathConfig.src.js}`
    },
    output: {
        filename: pathConfig.dist.js.filename
    }
}