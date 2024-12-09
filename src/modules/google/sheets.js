import gauth from "./gauth.js";
import logger from "../../../logs/logger.js";

import { v4 as uuidv4 } from "uuid";
import { constants } from "../../config/constants.js";
import { send_message } from '../../bot/process-message.js';
import { create_folder } from './drive.js';

import {
  objify, get_last_key,
  get_values,
  create_monitor_row
} from '../common/helper.js';

import { calculate_ref_link_statistic } from '../../generators/metrics/metrics_generator.js';

const { sheets } = gauth();
let { GROUP_CHAT_ID } = constants;
GROUP_CHAT_ID = `-${GROUP_CHAT_ID}`;
const module = import.meta.filename;

const {
  REFERRAL_SPREADSHEET_ID,
  USERS,
  REF_LINKS_LOGS,
  REFERRALS,
  REF_LINKS,
  BONUS_LOGS,
  BONUS_SPENT,
  MONITOR_SPREADSHEET_ID,
  MONITOR,
  MANAGERS_IDS
} = constants;

const update_data = async (spreadsheetId, range, requestBody) => {
  const { data } = await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody,
  });
  return { data };
};

const get_data = async (spreadsheetId, range) => {
  const {
    data: { values },
  } = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  return objify(values);
};

const get_all_data = async (spreadsheetId, ranges) => {
  try {
    const {
      data: { valueRanges },
    } = await sheets.spreadsheets.values.batchGet({
      spreadsheetId,
      ranges,
    });
    const obj = valueRanges.reduce((acc, { values, range }) => {
      acc[range.match(/\'(.*?)\'/)[1]] = objify(values);
      return acc;
    }, {});
    return obj;
  } catch (error) {
    logger.error(`Error in get_all_data: ${error}`, { module });
  }
};

const save_user = async (obj) => {
  try {
    const uid = uuidv4();
    const { obj_values } = await get_data(REFERRAL_SPREADSHEET_ID, USERS);
    const row = get_last_key(obj_values) + 2;
    const range = `${USERS}!A${row}`;
    const folder_id = await create_folder(obj.name);
    const values = [uid, ...Object.values(obj), folder_id];
    const { data } = await update_data(REFERRAL_SPREADSHEET_ID, range, { values });
    if (data.spreadsheetId) {
      logger.success(`New user successfully saved`, { module });
    }
  } catch (error) {
    logger.error(`Error in save_user: ${error}`, { module });
  }
  ;
};

const delete_user = async (id) => {
  try {


  } catch (error) {
    logger.error(`Error in delete_user: ${error}`, { module });
  }
};

const save_referal = async (obj) => {
  try {
    const { obj_values } = await get_data(REFERRAL_SPREADSHEET_ID, REFERRALS);
    const row = get_last_key(obj_values) + 2;
    const range = `${REFERRALS}!A${row}`;
    const values = [...Object.values(obj), uuidv4()];
    const { data } = await update_data(REFERRAL_SPREADSHEET_ID, range, { values });
    if (data.spreadsheetId) {
      logger.success(`New referral successfully saved`, { module });
      await send_message({ ...data, chat_id: GROUP_CHAT_ID })
    }
  } catch (error) {
    logger.error(`Error in save_referal: ${error}`, { module });
  }
};

const save_ref_link = async (obj) => {
  try {
    const { obj_values } = await get_data(REFERRAL_SPREADSHEET_ID, REF_LINKS);
    const row = get_last_key(obj_values) + 2;
    const range = `${REF_LINKS}!A${row}`;
    const values = [Object.values(obj)];
    const { data } = await update_data(REFERRAL_SPREADSHEET_ID, range, { values });
    if (data.spreadsheetId) {
      logger.success(`New ref link successfully saved`, { module });
    }
  } catch (error) {
    logger.error(`Error in save_ref_link: ${error}`, { module });
  }
}

const save_bouns = async (obj) => {
  try {
    const { obj_values } = await get_data(REFERRAL_SPREADSHEET_ID, BONUS_LOGS);
    const row = get_last_key(obj_values) + 2;
    const range = `${BONUS_LOGS}!A${row}`;
    const values = [Object.values(obj)];
    const { data } = await update_data(REFERRAL_SPREADSHEET_ID, range, { values });
    if (data.spreadsheetId) {
      logger.success(`Bonus data successfully saved`, { module });
    }
  } catch (error) {
    logger.error(`Error in save_bouns: ${error}`, { module });
  }
};

const spent_bonus = async () => {
  try {
    const { obj_values } = await get_data(REFERRAL_SPREADSHEET_ID, BONUS_SPENT);
    const row = get_last_key(obj_values) + 2;
    const range = `${BONUS_SPENT}!A${row}`;
    const values = [Object.values(obj)];
    const { data } = await update_data(REFERRAL_SPREADSHEET_ID, range, { values });
    if (data.spreadsheetId) {
      logger.success(`Bonus successfully used`, { module });
    }
  } catch (error) {
    logger.error(`Error in spent_bonus: ${error}`, { module });
  }
};

const update_ref_link_data = async (obj) => {
  try {
    const { obj_values } = await get_data(REFERRAL_SPREADSHEET_ID, REF_LINKS_LOGS);
    const row = get_last_key(obj_values) + 2;
    const values = get_values(obj);
    const range = `${REF_LINKS_LOGS}!A${row}`;
    const { data } = await update_data(REFERRAL_SPREADSHEET_ID, range, { values });
    if (data.spreadsheetId) {
      logger.success(`Ref link data successfully updated`, { module });
    }
  } catch (error) {
    logger.error(`Error in update_ref_link_data: ${error}`, { module });
  }
};

const get_ref_link_statistics = async (obj) => {
  try {
    const { ref_link, id, tg_username } = obj;
    const { obj_values } = await get_data(REFERRAL_SPREADSHEET_ID, REF_LINKS_LOGS);
    const statistic = calculate_ref_link_statistic(obj_values, ref_link, id);
    logger.success(`Statistic for @${tg_username} and ref link ${ref_link} received`, { module });
    return statistic;
  } catch (error) {
    logger.error(`Error in get_ref_link_statistics: ${error}`, { module });
  }
};

const save_new_pre_order_row = async (data) => {
  try {
    const uid = uuidv4();
    const { obj_values } = await get_data(MONITOR_SPREADSHEET_ID, MONITOR);
    const row = get_last_key(obj_values) + 2;
    const range = `${MONITOR}!A${row}`;
    const values = create_monitor_row(uid, data);
    const { data } = await update_data(MONITOR_SPREADSHEET_ID, range, { values });
    if (data.spreadsheetId) {
      logger.success(`New pre_oorder data successfully saved`, { module });
      await send_message(data);
    }
  } catch (error) {
    logger.error(`Erroe in save_new_pre_order_row: ${error}`, { module });
  }
}

export {
  get_all_data,
  get_settings,
  save_ref_link,
  save_referal,
  save_user,
  save_bouns,
  spent_bonus,
  update_ref_link_data,
  get_ref_link_statistics,
  save_new_pre_order_row
};
