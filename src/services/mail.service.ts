import * as dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { IMail } from '../interfaces';
import Logging from '../library/logging';

dotenv.config();

const { MAIL_HOST, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD, MAIL_SENDER } = process.env;

export default class MailService {
    private static instance: MailService;
    private transporter: nodemailer.Transporter;

    private constructor() {};

    //INTSTANCE CREATE FOR MAIL
    static getInstance() {
        if (!MailService.instance) {
            MailService.instance = new MailService();
        }

        return MailService.instance;
    }

    //CREATE TRANSPOTER
    getTransporter() {
        return this.transporter;
    }

    //CREATE CONNECTION FOR LOCAL
    async createLocalConnection() {
        let account = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass,
            }
        });
    }

    //CREATE CONNECTION FOR LIVE
    async createConnection() {
        this.transporter = nodemailer.createTransport({
            host: String(MAIL_HOST),
            port: Number(MAIL_PORT),
            secure: false,
            auth: {
                user: MAIL_USERNAME,
                pass: MAIL_PASSWORD,
            },
        });
        
    }

    async send(requestID: string | number | string[], options: IMail) {
        return await this.transporter.sendMail({
            from: `"Kawsar Ahmed" ${MAIL_SENDER || options.from}`,
            to: options.to,
            cc: options.cc,
            bcc: options.bcc,
            subject: options.subject,
            text: options.text,
            html: options.html,
        }).then(info => {
            Logging.info(`${requestID} - Mail sent successfully!!`);
            Logging.info(`${requestID} - [MailResponse]=${info.response} [MessageID]=${info.messageId}`);
            if (process.env.NODE_ENV === 'local') {
                Logging.info(`${requestID} - Nodemailer ethereal URL: ${nodemailer.getTestMessageUrl(
                    info
                )}`);
            }
            return info;
        });
    }

    //VERIFY CONNECTION
    async verifyConnection() {
        return this.transporter.verify();
    }
}
