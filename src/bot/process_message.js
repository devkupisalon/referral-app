import bot from './init-bot.js';
import logger from '../logs/logger.js';
import { constants } from '../config/constants.js';
import { messages } from './messages.js';

const { parse_mode } = constants;
const module = import.meta.filename;

const send_message = async (data) => {
    try {
        const {
            chat_id,
            name,
            phone,
            email,
            tg_username,
            link,
            services,
            request,
            brand,
            model
        } = data;
        const message_data = {
            name,
            phone,
            email,
            tg_username,
            link,
            services,
            request,
            brand,
            model
        };
        const { message_id } = await bot.sendMessage(chat_id, messages[type](message_data), { parse_mode });
        if (message_id) {
            logger.success(`Message send successfully to ${chat_id}`, { module });
        }
    } catch (error) {
        logger.error(`Error while send message, error: ${error}`, { module });
    }
};

export { send_message };



