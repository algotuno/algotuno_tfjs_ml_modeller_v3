import fetch from "node-fetch";
import {sleep} from "./stock_util.js";


/* this api gets all the stock names stored in the server */
async function get_stock_list() {
    return await fetch("https://algotuno-web3.vercel.app/api/stock/get_all_stocks").then(res => {
        // .map(stock_obj => stock_obj['tickerSymbol'].lower)
        return res.json().then(res => res.result.map(x => x['tickerSymbol']));
    });
}

/* this api gets all the stock price list stored in the server */
async function get_price_list_for_stock(stock_name) {
    let stockName = stock_name.toUpperCase();
    const body = {
        "ticker_symbol": stockName,
        "start_date": "",
        "end_date": "",
        "sort": "asc"
    };

    return await fetch("https://algotuno-web3.vercel.app/api/stock/get_hsp", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
    }).then(async res => {
        const result = await res.json();
        const obj = {
            'stock_name' : stockName,
            'stock_list' : result.results,
        };
        return obj;
    }).catch(err => {
        throw `${err}`;
    });
}

/* this api calls the function `get_price_list_for_stock` many times in order to achieve its goal  */
async function get_price_list_for_many_stocks(_list_of_stocks) {
    let result_list = [];
    for (const stock_name of _list_of_stocks) {
        await sleep(500);
        const result = await get_price_list_for_stock(stock_name);
        result_list.push(result);
    }
    return result_list;
}


export {
    get_stock_list,
    get_price_list_for_stock,
    get_price_list_for_many_stocks,
};