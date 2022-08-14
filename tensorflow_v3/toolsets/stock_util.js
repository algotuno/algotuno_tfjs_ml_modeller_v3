import fs from "fs";
import path from "path";


function get_stock_data_from_fs(_dir) {
    /*
    1. read the stock data from File system
    2. extract the relevant data from the stock data
     */
    function read_json_file(_dir) {
        /*
        used to get the stock data from the file system
         */
        let _raw_data = fs.readFileSync(_dir);
        return JSON.parse(_raw_data);
    }

    return read_json_file(_dir);
}

function get_file_from_fs(_dir) {
    return fs.createReadStream(_dir);
}

const getDirectories = srcPath =>
    fs.readdirSync(srcPath).filter(file => fs.statSync(path.join(srcPath, file)).isDirectory());

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export {get_stock_data_from_fs, get_file_from_fs, getDirectories, sleep};