import "reflect-metadata";
import * as dotenv from 'dotenv';
import Logging from './library/logging';
import { router as v1 } from './routes/v1';
import HttpError from './utils/http.error';
import { AppDataSource } from './data-source';
import MailService from './services/mail.service';
import express, { Request, Response } from 'express';

dotenv.config();

const router = express();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
const { PORT = 3000, NODE_ENV } = process.env;

//RULES OF OUR APIS
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin,X-Requested-with,Content-Type,Accept,Authorization'
    );

    if (req.method == 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT,POST,PATCH,DELETE,GET'
        );
        return res.status(200).json({});
    }
    next();
});

//API ROUTES WITH VERSION
router.use('/api', v1);

router.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'You are on node-typescript-boilderplate. You should not have further access from here.',
    });
});

//API ERROR HANDLING
router.use((req, res, next) => {
    const error = new Error('not found');
    // Logging.error(error);
    return res.status(404).json({ success: false, message: error.message });
});

//HANDEL ALL ERROR THROW BY CONTROLLERS
router.use(function (err: any, req: any, res: any, next: any) {
    Logging.error(err.stack);
    if (err instanceof HttpError) {
        return err.sendError(res);
    } else {
        return res.status(500).json({
            error: {
                title: 'general_error',
                detail: 'An error occurred, Please retry again later',
                code: 500,
            },
        });
    }
});

AppDataSource.initialize()
    .then(async () => {
        router.listen(PORT, () => {
            //MAIL SMTP CONNECTION
        Logging.info('Connecting with SMTP Server...');
        const mailService = MailService.getInstance();
        if (NODE_ENV === 'dev') {
            mailService.createLocalConnection();
        } else if (NODE_ENV === 'production') {
            mailService.createConnection();
        }
        Logging.info('SMTP Server Connected');
        Logging.info('SMTP Connection verified');
            Logging.info(`Server is running on port http://localhost:${PORT}.`)
        });
        Logging.info("Data Source has been initialized!");
    }).catch((error: any) => console.log(error));