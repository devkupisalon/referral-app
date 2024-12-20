import { google } from 'googleapis';
import { __dirname } from '../../config/constants.js';

const gauth = () => {
    const auth = new google.auth.GoogleAuth({
        keyFile: `${__dirname}/json/credentials.json`,
        scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const drive = google.drive({ version: 'v3', auth });
    return { sheets, drive, access_token: auth.getCredentials.access_token };
};

export default gauth;