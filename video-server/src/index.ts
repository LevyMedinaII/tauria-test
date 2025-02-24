import './LoadEnv'; // Must be the first import
import app from '@server';
import logger from '@shared/helpers/Logger';
import { initializeTables } from './daos';

// Start the server
const port = Number(process.env.PORT || 3000);
app.listen(port, async () => {
    // Create tables if DB is empty
    await initializeTables();

    logger.info('Express server started on port: ' + port);
});
