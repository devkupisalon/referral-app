import moment from 'moment-timezone';
import { Array_Generator } from '../../generators/array_generator.js';
import { Monitor_Row } from '../google/enums.js';

const get_formatted_timestamp = (input_date) => {
    const date = input_date ? moment(input_date) : moment();
    const timeZone = 'Europe/Moscow';
    const date_and_time = date.tz(timeZone).format('DD.MM.YYYY HH:mm:ss');
    return date_and_time;
};

const get_formatted_date = (input_date) => {
    const date = input_date ? moment(input_date) : moment();
    const timeZone = 'Europe/Moscow';
    const date_and_time = date.tz(timeZone).format('DD.MM.YYYY');
    return date_and_time;
};

const get_iso_date = (date) => {
    return new Date(date).toISOString();
};

const objify = (data) => {
    const headers = data[0];
    return {
        obj_values: data.slice(1).reduce((acc, row, i) => {
            const obj = headers.reduce((obj, header, j) => {
                obj[header] = row[j];
                return obj;
            }, {});

            acc[i] = obj;
            return acc;
        }, {}), headers_obj: headers.reduce((acc, h, i) => {
            acc[i] = h;
            return acc;
        }, {})
    };
};

const get_column_number_by_value = (obj, value) => {
    for (const key in obj) {
        if (obj[key] === value) {
            return key + 1;
        }
    }
    return null;
};

const number_to_column = (n) => {
    if (n <= 0) n = 1;

    n -= 1;

    let ordA = "A".charCodeAt(0);
    let ordZ = "Z".charCodeAt(0);
    let len = ordZ - ordA + 1;

    let s = "";
    while (n >= 0) {
        s = String.fromCharCode((n % len) + ordA) + s;
        n = Math.floor(n / len) - 1;
    }
    return s;
};

const get_last_key = (obj) => {
    const keys = Object.keys(obj);
    return keys[keys.length - 1];
};

const get_row_by_link_and_user = (obj, ref_link, id) => {
    for (const key in obj) {
        if (obj[key].ref_link === ref_link &&
            obj[key].id === id) {
            return key;
        }
    }
    return null;
};

const get_values_for_monitor = (data) => {
    const {
        timestamp,
        type,
        ref_link,
        id,
        click,
        registr,
        order,
        order_sum,
        payment_order_sum } = data;
    const map = {
        click: [id, timestamp, ref_link, click],
        registr: [id, timestamp, ref_link, , registr],
        order: [id, timestamp, ref_link, , , order],
        order_sum: [id, timestamp, ref_link, , , , order_sum],
        payment_order_sum: [id, timestamp, ref_link, , , , , payment_order_sum]
    }
    const values = map[type];
    return [values];
};

const create_monitor_row = (uid, data) => {
    const source_array = [
        uid,
        ...Object.values(data)
    ];
    const generated_array = Array_Generator.generate_array(new Monitor_Row(), source_array);
    return generated_array;
};

export {
    number_to_column,
    get_column_number_by_value,
    get_values,
    objify,
    get_last_key,
    get_row_by_link_and_user,
    get_formatted_timestamp,
    get_formatted_date,
    get_iso_date,
    create_monitor_row
};