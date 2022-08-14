import * as tf from '@tensorflow/tfjs-node';

import {get_stock_data_from_fs} from "./toolsets/stock_util.js";
import {get_stock_data, predict} from "./toolsets/core_ai_v5.js";
import {get_model_results, visualiseGraphFromModelResults} from "./toolsets/display_chart_v5.js";


/*** variables ***/
const stock_name = 'aapl';
const _dir_to_read_file = `file://tf_models/${stock_name}/model.json`;
const stock_data = './datasets/aapl_price_latest.json';

const no_of_trading_days_in_a_year = 260; // no of trading days in a year
const no_of_trading_days_in_a_year_multiplier = 2; // no of years / batches to cover
const days_range = 5; // the number of days range to compute in


/*** program logic ***/
let extracted_stock_data = get_stock_data_from_fs(stock_data);
let stock_dataset = get_stock_data(extracted_stock_data, no_of_trading_days_in_a_year, days_range, no_of_trading_days_in_a_year_multiplier);


// 2. load the neural network model
const sample_model = tf.loadLayersModel(_dir_to_read_file);

// 3. train the model
sample_model
    .then((_model) => {
        try {
            console.log("successfully loaded model");
            console.log(_model.summary());
            return _model;
        } catch (e) {
            console.log("unable to load model");
            console.log(e);
        }
    })
    .then(async (_model) => {
        // validation dataset results
        console.log("perform prediction");
        const validation_data_result = await predict(
            _model,
            stock_dataset.validation.tensor_xs_list,
            stock_dataset.validation.raw_ys_list
        );
        // testing dataset results
        return validation_data_result;
    })
    .then((_predict) => {
        // format the model results prior to display results
        return get_model_results(stock_dataset, _predict);
    }).then((_predict_obj) => {
    // display graph results
    visualiseGraphFromModelResults(_predict_obj);
});
