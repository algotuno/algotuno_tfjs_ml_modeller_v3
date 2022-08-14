function mse(predict, actual) {
    let error = 0;
    for (let i = 0; i < predict.length; i++) {
        error += Math.pow((actual[i] - predict[i]), 2);
    }
    return error / predict.length;
}

function calculate_mse_between_historical_and_forecast_price(
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
    const mse_entity = {
        'mse_1': 0,
        'mse_7': 0,
        'mse_30': 0,
    };
    switch (testing_ab) {
        // using base 0, for verify forecast price
        case 1:
            const [lastItem] = p_historical_price.slice(-1);
            const h_price = lastItem / 1; // add divide by 20 to nerf the model results

            // push for day 1 prediction
            p_historical_price.push(h_price);
            p_predict_price.push(day1);

            let mse_1 = mse(p_predict_price, p_historical_price);
            mse_entity.mse_1 = mse_1;

            // push for day 7 prediction
            p_historical_price.push(h_price);
            p_predict_price.push(day7);

            let mse_7 = mse(p_predict_price, p_historical_price);
            mse_entity.mse_7 = mse_7;

            // push for day 30 prediction
            p_historical_price.push(h_price);
            p_predict_price.push(day30);

            let mse_30 = mse(p_predict_price, p_historical_price);
            mse_entity.mse_30 = mse_30;

            return mse_entity;
        // using base 1, for verify forecast price by rounding up 0 to 1
        case 2:
            return mse_entity;
        // using last price, for verify forecast price by using the last value
        case 3:
            return mse_entity;
    }
}


export {
    calculate_mse_between_historical_and_forecast_price,
}