import logger from '../../logs/logger.js';
import { IP_INFO } from './models.js';

const module = import.meta.filename;

async function block_IP(ip) {
    try {
        const ipInfo = await IP_INFO.findOne({ where: { ip } });
        if (ipInfo) {
            ipInfo.is_blocked = true;
            await ipInfo.save();
            logger.info(`IP address ${ip} has been blocked`, { module });
        } else {
            logger.error(`IP address ${ip} not found in IP_INFO`, { module });
        }
    } catch (error) {
        logger.error(`Error blocking IP address: ${error}`, { module });
    }
}

async function unblock_IP(ip) {
    try {
        const ipInfo = await IP_INFO.findOne({ where: { ip } });
        if (ipInfo) {
            ipInfo.is_blocked = false;
            await ipInfo.save();
            logger.info(`IP address ${ip} has been unblocked`, { module });
        } else {
            logger.error(`IP address ${ip} not found in IP_INFO`, { module });
        }
    } catch (error) {
        logger.error(`Error unblocking IP address: ${error}`, { module });
    }
}

async function save_request(ip, method, body, sessionID) {
    try {
        const ipInfo = await IP_INFO.findOne({ where: { ip } });
        if (ipInfo) {
            ipInfo.requests_count += 1;
            const newIndex = Object.keys(ipInfo.requests).length + 1;
            ipInfo.requests[newIndex] = {
                timestamp: new Date().toISOString(),
                method,
                body,
                sessionID
            };
            await ipInfo.save();
            logger.info(`Request saved for IP address ${ip}`, { module });
        } else {
            logger.error(`IP address ${ip} not found in IP_INFO`, { module });
        }
    } catch (error) {
        logger.error(`Error saving request data: ${error}`, { module });
    }
}

async function get_requests(ip) {
    try {
        const ipInfo = await IP_INFO.findOne({ where: { ip } });
        if (ipInfo) {
            const requests = ipInfo.requests;
            logger.info(`Requests for IP address ${ip}: ${JSON.stringify(requests)}`, { module });
            return ipInfo.requests_count;
        } else {
            logger.error(`IP address ${ip} not found in IP_INFO`, { module });
        }
    } catch (error) {
        logger.error(`Error getting requests: ${error}`, { module });
    }
}

export {
    block_IP,
    unblock_IP,
    save_request,
    get_requests
};