import logger from '../../logs/logger.js';
import { get_formatted_date } from '../../utils/common/helper.js';

const module = import.meta.filename;

/**
 * 
 * @return {object}
 * @returns {
 *    rating: {
 *       user_rating,
 *       top_10_results
 *    },
 *    history: {
 *       sum_bonus,
 *       bonus_history
 *    }
 * }
 */
const get_ratings = (id, data) => {
    try {
        const { bonus_logs, bonus_spent } = data;
        const history = calculate_bonus_statistic(bonus_logs, bonus_spent);
        const rating = get_leadership(bonus_logs, id);
        logger.success(`Rating successfullly calculated`, { module });
        return { history, rating };
    } catch (error) {
        logger.error(`Error in get_ratings: ${error}`, { module });
    }
};

const calculate_bonus_statistic = (bonus_get, bonus_spent) => {
    const sum_bonus = Object.values(bonus_get).reduce((acc, { bonus }) => {
        acc.sum_bonus = (acc.bonus_sum || 0) + bonus;
        return acc;
    }, {});
    const bonus_history = {};
    let i = 0;
    Object.values({ bonus_get, bonus_spent }).forEach((obj, index) => {
        Object.values(obj).forEach(({ bonus, timestamp }) => {
            const date = get_formatted_date(timestamp);
            bonus_history[i] = { date, bonus };
        });
    });
    return { sum_bonus, bonus_history };
};

const get_leadership = (bonus_logs, id) => {
    const bonus_get = Object.values(bonus_logs);
    const bonus_sums = Object.values(bonus_get).reduce((acc, { id, bonus }) => {
        if (!acc[id]) acc[id] = 0;
        acc[id] = acc[id] + bonus;
        return acc;
    }, {});

    const sorted_bonus_sums = Object.entries(bonus_sums).sort((a, b) => b[1] - a[1]);
    const ranking = sorted_bonus_sums
        .map(([id, bonus_sum], index) => ({ id, bonus_sum, place: index + 1 }));
    const result = ranking.reduce((acc, { id, bonus_sum, place }) => {
        acc[place] = { id, bonus_sum };
        return acc;
    }, {});

    let user_rating = {};

    for (const k in result) {
        if (result[k].id === id) {
            user_rating.place = k;
            user_rating.sum_bonus = result[k].id;
        }
    }

    const top_10_results = Object.fromEntries(
        Object.entries(result)
            .filter(([place, _]) => parseInt(place) <= 10)
    );

    return { user_rating, top_10_results };
};

export { get_ratings };