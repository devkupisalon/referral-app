import { app } from './routes/init.js';
import './routes/routes.js';
import './routes/protects_routes.js';

app.listen("8000", "31.129.109.210", async (err) => {
    if (err) {
        logger.error(err.message);
    }
    logger.info("Server is running on port 8000", { module });
});

