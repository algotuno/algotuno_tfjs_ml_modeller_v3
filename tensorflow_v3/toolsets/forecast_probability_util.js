function meanAbsolutePercentageError(forecast, actual) {
    const n = forecast.length;
    if (actual.length !== n) throw new Error("forceast and actual must be same length"); // <-- what to do here?
    let sum = 0;
    for (let i = 0; i < n; i++) {
        sum += Math.abs((actual[i] - forecast[i]) / actual[i]);
        // console.log(sum);
    }
    return sum * 100 / n;
}

let mape_v2 = (forecast, actual) => {
    if (actual.length !== forecast.length) {
        throw Error("both arrays is not of same length");
    }

    const abs_percentage_of_err_list = [];
    for (let i = 0; i < actual.length; i++) {
        const first_item_array = actual[i];
        const second_item_array = forecast[i];

        const abs_deviation = Math.abs(first_item_array - second_item_array);
        const absolute_percentage_of_err = parseFloat(((abs_deviation / first_item_array) * 100).toFixed(2));
        abs_percentage_of_err_list.push(absolute_percentage_of_err);
    }

    function getSum(total, num) {
        return total + Math.round(num);
    }


    const total_abs_percentage_of_err = abs_percentage_of_err_list.reduce(getSum, 0);
    const mape_result = (total_abs_percentage_of_err / actual.length) / 100;
    return {
        "x": actual,
        "y": forecast,
        "abs_percentage_of_err_list": abs_percentage_of_err_list,
        "abs_percentage_of_err_total": total_abs_percentage_of_err,
        "mape": mape_result,
    };
}


function rebase_to_one_list(_my_list) {
    /* this function is used to make the value in the list if the value is lesser than 1, to return 1
    otherwise return the current value it is at
     */
    return _my_list.map(my_int => {
        if (my_int >= 1) {
            return my_int;
        } else {
            return 1;
        }
    })
}

function rebase_to_one(_my_int) {
    if (_my_int >= 1) {
        return parseFloat(_my_int.toFixed(2));
    } else {
        return 1;
    }
}


function calculate_mape_between_historical_and_forecast_price(
    _historical_price,
    _predict_price,
    _forecast_price) {
    /***
     _historical_price: -> the test dataset to test compare against
     _predict_price -> the price list output received from inserting the validation dataset into the program
     _forecast_price -> the price list output received from inserting the _prediction dataset into the program
     to obtain the 1, 7 , 30 days forecast price
     ***/
    if (_historical_price.length !== _predict_price.length) {
        throw new Error("historical price epoch and predict price epoch is not the same!");
    }
    if (_forecast_price.length !== 3) {
        throw new Error("forecast price is insufficent. need to have 1, 7 , 30 days prediction.");
    }

    // historical price & predict price will have 51 epochs (array length length: 51)
    const p_historical_price = _historical_price.map(obj => obj[0]); // get all the historical price
    const p_predict_price = _predict_price.map(obj => obj[0]);

    // extract all the values from the forecast price
    const day1 = _forecast_price[0]['price'];
    const day7 = _forecast_price[1]['price'];
    const day30 = _forecast_price[2]['price'];

    const testing_ab = 1;
    const mape_entity = {
        'mape_1': 0,
        'mape_7': 0,
        'mape_30': 0,
    };
    switch (testing_ab) {
        // using base 0, for verify forecast price
        case 1:
            const [lastItem] = p_historical_price.slice(-1);
            const h_price = lastItem / 2; // add divide by 20 to nerf the model results

            // push for day 1 prediction
            p_historical_price.push(h_price);
            p_predict_price.push(day1);

            let mape_1 = meanAbsolutePercentageError(p_predict_price, p_historical_price);
            mape_1 = rebase_to_one(100 - mape_1);
            mape_entity.mape_1 = mape_1;

            // push for day 7 prediction
            p_historical_price.push(h_price);
            p_predict_price.push(day7);

            let mape_7 = meanAbsolutePercentageError(p_predict_price, p_historical_price);
            mape_7 = rebase_to_one(100 - mape_7);
            mape_entity.mape_7 = mape_7;

            // push for day 30 prediction
            p_historical_price.push(h_price);
            p_predict_price.push(day30);

            let mape_30 = meanAbsolutePercentageError(p_predict_price, p_historical_price);
            mape_30 = rebase_to_one(100 - mape_30);
            mape_entity.mape_30 = mape_30;

            return mape_entity;
        // using base 1, for verify forecast price by rounding up 0 to 1
        case 2:
            return mape_entity;
        // using last price, for verify forecast price by using the last value
        case 3:
            return mape_entity;
    }
}

export {
    calculate_mape_between_historical_and_forecast_price,
    rebase_to_one
}