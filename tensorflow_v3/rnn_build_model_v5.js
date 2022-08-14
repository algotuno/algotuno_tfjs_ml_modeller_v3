import {get_stock_data_from_fs} from "./toolsets/stock_util.js";
import {get_stock_data, nn_model, predict, train_model} from "./toolsets/core_ai_v5.js";
import {get_model_results, visualiseGraphFromModelResults} from "./toolsets/display_chart_v5.js";

/*** variables ***/
const stock_name = 'amcr';
const stock_data = `./datasets/${stock_name}_price_latest.json`;
const _dir_to_save_file = `file://tf_models/${stock_name}`;


function run_build_model(_company_name, _stock_data, _save_dir_name) {
    const window = 4; // every 2 weeks (each whole no represent every week)
    const weeks_to_predict = 4; // how many weeks to predict into the future
    const epoch = 20_000; // no of times to train
    const display_training_output = true; // display logs on training output per epoch
    const display_model_summary = true;
    const visualise_graph_on_nodeplotlib = false;

    const no_of_trading_days_in_a_year = 260; // no of trading days in a year
    const no_of_trading_days_in_a_year_multiplier = 2; // no of years / batches to cover
    const days_range = 5; // the number of days range to compute in

    /*** program logic ***/
    let stock_dataset = get_stock_data(
        _stock_data,
        no_of_trading_days_in_a_year,
        days_range,
        no_of_trading_days_in_a_year_multiplier
    );

    // 2. setup the neural network model
    const sample_model = nn_model(
        stock_dataset.training.tensor_xs_list,
        stock_dataset.training.tensor_ys_list
    );

    // 3. train the model
    train_model(
        stock_dataset.training.tensor_xs_list,
        stock_dataset.training.tensor_ys_list,
        epoch,
        sample_model,
        display_training_output,
        _company_name,
    )
        .then((_training_output) => {
            // save model
            if (display_model_summary) {
                console.log(sample_model.summary());
            }
            sample_model.save(_save_dir_name);
            console.log("model saved successfully");

            return _training_output.loss_output;
        })
        .finally(() => {
            // console.log(stock_dataset.validation.raw_xs_list);
            predict(
                sample_model,
                stock_dataset.validation.tensor_xs_list,
                stock_dataset.validation.raw_ys_list,
            ).then(async (validation_data_result) => {
                // get the validation result
                return validation_data_result;
            }).then((_predict) => {
                // format the model results prior to display results
                return get_model_results(stock_dataset, _predict);
            }).then((_predict_obj) => {
                // display graph results
                if (visualise_graph_on_nodeplotlib) {
                    visualiseGraphFromModelResults(_predict_obj);
                }
            });
        });
}


if (false) {
    let extracted_stock_data = get_stock_data_from_fs(stock_data);
    run_build_model(stock_name, extracted_stock_data, _dir_to_save_file);
}


export {
    run_build_model,
}