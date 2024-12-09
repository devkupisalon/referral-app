import logger from '../../../logs/logger.js';
import { get_all_data } from '../../utils/google/sheets.js';
import { Metrics } from '../../config/models.js';
import { constants } from "../../config/constants.js";
import { get_iso_date } from '../../utils/common/helper.js';
import { get_ratings } from './rating_generator.js';

const module = import.meta.filename;

const {
    REFERRAL_SPREADSHEET_ID,
    USERS,
    REF_LINKS_LOGS,
    REFERRALS,
    BONUS_LOGS,
    BONUS_SPENT
} = constants;

/**
 * RESULT OBJECT
 * 
 * @returns {object}
 * @returns {
 *    sheetname: {
 *       headers_obj: { i: el... },
 *       obj_values: {
 *          index: { i: row_data... }
 *     }
 *   }
 * }
 */
const get_data_for_metrics = async (all = false) => {
    try {
        const RANGES = [
            all ? USERS : '',
            REF_LINKS_LOGS,
            REFERRALS,
            all ? BONUS_LOGS : '',
            all ? BONUS_SPENT : ''
        ].filter(Boolean);
        const tabels_data_obj = await get_all_data(REFERRAL_SPREADSHEET_ID, RANGES);
        return tabels_data_obj;
    } catch (error) {
        logger.error(`Error in get_data_for_metrics: ${error}`, { module });
    }
};

const filter_objs_by_timestamp = (timestamp, uid, tabels_data_obj) => {
    const { date_form, date_to } = timestamp;
    const filtered_tables_data_obj = Object.entries(tabels_data_obj)
        .reduce((acc, [k, v]) => {
            const table_obj = Object.entries(v).reduce((acc, [k, { id, timestamp }]) => {
                const between_dates =
                    get_iso_date(date_form) >= get_iso_date(timestamp) &&
                    get_iso_date(date_to) <= get_iso_date(timestamp);
                if (between_dates && id === uid) acc[k] = v;
                return acc;
            }, {});
            acc[k] = table_obj;
            return acc;
        }, {});
    return filtered_tables_data_obj;
};

/**
 * RESULT OBJECT
 * 
 * @returns {object}
 * @returns {
 *      date_from,
 *      date_to,
 *      num_orders,
 *      sum_orders,
 *      avg_sum_orders,
 *      num_payment_orders,
 *      sum_payment_orders,
 *      marginality,
 * }
 */
const collect_data_by_tabels = (filtered_data_objs, id) => {
    const collected_data_obj = Object.entries(filtered_data_objs)
        .reduce((acc, [k, v]) => {
            acc[k] = collected_data_obj[k]
                .reduce((acc, { ref_link, }) => {

                    return acc
                }, {});
            return acc;
        }, {});
    return collected_data_obj;
};

/** MIDDLEWARE */
const prepare_metrics_data = async (data) => {
    const { timestamp, id } = data;
    const { ref_links_logs, referrals, bonus_logs, bonus_spent } = await get_data_for_metrics();
    const objs = filter_objs_by_timestamp(timestamp, id, { ref_links_logs, referrals });
    const metrics = collect_data_by_tabels(objs, id);
    const ratings = get_ratings(id, { bonus_logs, bonus_spent });
    return { metrics, ratings };
};

/**
 * RESULT OBJECT
 * 
 * @returns {object}
 * @returns {
 *    id,
 *    metrics: {
 *      date_from,
 *      date_to,
 *      num_orders,
 *      sum_orders,
 *      avg_sum_orders,
 *      num_payment_orders,
 *      sum_payment_orders,
 *      marginality,
 *      sum_bonus,
 *      bonus_history,
 *      user_rating,
 *      top_10_results
 *    }
 * }
 */
const calculate_user_detailed_statistic = async (data) => {
    try {
        const { metrics,
            ratings: {
                rating: {
                    user_rating,
                    top_10_results },
                history: {
                    sum_bonus,
                    bonus_history } } } = prepare_metrics_data(data);

        logger.success(`Metrics succcesfully calculated`, { module });

        return {
            id: data.id, metrics: {
                ...metrics,
                sum_bonus,
                bonus_history,
                user_rating,
                top_10_results
            }
        };
    } catch (erorr) {
        logger.error(`Error in calculate_user_detailed_statistic: ${error}`, { module });
    }
};

/**
 * RESULT OBJECT
 * 
 * @returns {object}
 * @returns {
 *    click,
 *    registration,
 *    order,
 *    payment_order_sum
 * }
 */
const calculate_ref_link_statistic = (data, REF_LINK, ID) => {
    try {
        const result = Object.values(data).reduce((acc,
            { ref_link, id, click, registration, order, payment_order_sum }) => {
            if (ref_link === REF_LINK && id === ID) {
                acc.click = (acc.click || 0) + click;
                acc.registration = (acc.registration || 0) + registration;
                acc.order = (acc.order || 0) + order;
                acc.payment_order_sum = (acc.payment_order_sum || 0) + payment_order_sum;
            }
            return acc;
        }, {});
        if (Object.keys(result).length > 0) {
            logger.success(`Satistic for ref_link ${REF_LINK} calculated successfully`, { module });
        }
        return result;
    } catch (error) {
        logger.error(`Error in calculate_ref_link_statistic`, { module });
    }
};

export {
    calculate_user_detailed_statistic,
    calculate_ref_link_statistic
};