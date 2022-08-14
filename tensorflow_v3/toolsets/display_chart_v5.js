import {plot} from "nodeplotlib";

function get_accuracy(_validation_dataset, _prediction_dataset) {
    /***
     *
     * we are going to skip the first data as we do not have the previous number to confirm the
     * prediction whether the price went up or down
     *
     * ***/
    const get_direction = (_prev, _curr) => {
        if (_curr > _prev) {
            return "UP";
        } else {
            return "DOWN";
        }
    };

    let score = 0;
    for (let index = 1; index < _validation_dataset.length; index++) {
        const prev_v_data = _validation_dataset[index - 1];
        const v_data = _validation_dataset[index];
        const v_direction = get_direction(prev_v_data, v_data);

        const prev_p_data = _prediction_dataset[index - 1];
        const p_data = _prediction_dataset[index];
        const p_direction = get_direction(prev_p_data, p_data);

        if (v_direction === p_direction) {
            score += 1;
        }
        //const p_data = _prediction_dataset[index];
    }

    // accuracy rate in percentage
    const in_percentage = parseFloat(((score / _validation_dataset.length) * 100).toFixed(2));
    const in_number = `${score} / ${_validation_dataset.length}`;
    return {
        "in_percentage": in_percentage,
        "in_number": in_number,
    }
}

function get_model_results(_stock_dataset, _predict) {
    function convert_to_x_and_y_axis(xs_list) {
        let x = [];
        let y = [];
        for (let i = 0; i < xs_list.length; i++) {
            let curr_item = xs_list[i];
            x.push(curr_item[1]);
            y.push(curr_item[0]);
        }

        return {
            'x-axis': x,
            'y-axis': y,
        };
    }

    function generate_plot_line(price_list, name) {
        let obj = convert_to_x_and_y_axis(price_list);
        return {x: obj['x-axis'], y: obj['y-axis'], type: 'plot', name: name};
    }

    console.log("### display result ###");
    // prepare data for output
    let _actual_result = generate_plot_line(_stock_dataset.training.raw_xs_list, "training");
    let _predict_result = generate_plot_line(_stock_dataset.training.raw_ys_list, "predict");
    let _validation_result = generate_plot_line(_stock_dataset.validation.raw_ys_list, "validation");
    let _ml_result = generate_plot_line(_predict, "ml result");
    // prepare data to calculate accuracy
    let _model_accuracy = get_accuracy(_stock_dataset.validation.raw_ys_list, _predict);

    return {
        'actual': _actual_result,
        'predict': _predict_result,
        'validation': _validation_result,
        'ml_result': _ml_result,
        'model_accuracy': _model_accuracy,
    };
}

function visualiseGraphFromModelResults(_predict_obj) {
    const actual_result = _predict_obj.actual;
    const predict_result = _predict_obj.predict;
    const validation_result = _predict_obj.validation;
    const ml_result = _predict_obj.ml_result;

    console.log(`model accuracy rate:  ${_predict_obj.model_accuracy.in_percentage}%`);
    console.log(`no of correctness:  ${_predict_obj.model_accuracy.in_number}`);
    plot([actual_result, predict_result]);
    plot([actual_result, validation_result, ml_result]);
}

export {
    get_accuracy,
    get_model_results,
    visualiseGraphFromModelResults,
}