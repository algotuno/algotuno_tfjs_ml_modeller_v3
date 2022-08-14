import FormData from 'form-data';
import fetch from "node-fetch";
import {get_file_from_fs} from "./stock_util.js";

async function upload_model(_stock_name,_file_model,_file_weights) {
    try {
        const form = new FormData();
        form.append('model', _file_model);
        form.append('weights', _file_weights);

        //  make api call here
        await fetch(`http://algotunotfjsv3.azurewebsites.net/azure_mgt/upload_blob/${_stock_name}`, {
            method: 'POST',
            body: form,
        });
        return {
            "message": `success uploading to folder: ${_stock_name}`
        }
    } catch (err) {
        return new Error(err.message);
    }
}

export {
    upload_model
}