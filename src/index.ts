import * as dotenv from 'dotenv';
import * as express from 'express';
import { router as v1 } from './routes/v1';
import { Request, Response } from 'express';
import { AppDataSource } from './data-source';
import "reflect-metadata";
dotenv.config();

const router = express();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
const { PORT = 3000 } = process.env;


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

AppDataSource.initialize()
  .then(async () => {
    router.listen(PORT, () => {
        console.log("Server is running on http://localhost:" + PORT);
    });
    console.log("Data Source has been initialized!");
  }).catch((error: any) => console.log(error));