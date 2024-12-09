import gauth from "./gauth.js";
import logger from "../../../logs/logger.js";

import { constants } from "../../constants.js";

const { drive } = gauth();
const { REFERRALS_APP_FOLDER } = constants;

const create_folder = async (name) => {
  try {
    const response = await drive.files.create({
      resource: {
        name,
        mimeType: "application/vnd.google-apps.folder",
        parents: [REFERRALS_APP_FOLDER],
      },
    });

    const {
      data: { id },
    } = response;
    const folderLink = `https://drive.google.com/drive/folders/${id}`;

    await drive.permissions.create({
      fileId: id,
      requestBody: {
        role: "writer",
        type: "domain",
        domain: "kupisalon.ru",
      },
    });

    if (id) {
      logger.success("Folder created successfully", { module });
    }
    return { folderLink, id };
  } catch (error) {
    logger.error(`Error in create_folder: ${error}`, { module });
  }
};

export { create_folder };
