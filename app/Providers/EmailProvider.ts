import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config()

export class EmailProvider {

    private emailHost?: string;
    private user?: string;
    private pass?: string;
    private port: number = 465;
    private secure: boolean = true;

    constructor() {
        this.emailHost = process.env.EMAIL_HOST;
        this.user = process.env.EMAIL_USER;
        this.pass = process.env.EMAIL_PASS;
        this.port = process.env.EMAIL_PORT === undefined ? this.port : parseInt(process.env.EMAIL_PORT)
    }

    private setEmailTransport = async (): Promise<any> => {
        console.log(`smtp.${this.emailHost}`)
        const transporter = nodemailer.createTransport({
            host: `smtp.${this.emailHost}`,
            port: this.port,
            secure: this.secure,
            auth: {
                // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                user: this.user,
                pass: this.pass
            }
        });
        return transporter;
    }

    public sendEmail = async (senderName: string = '', receiverEmail: string, subject: string, text: string, html: string): Promise<void> => {
        try {
            // send mail with defined transport object
            const setTrasnport = await this.setEmailTransport();
            await setTrasnport.sendMail({
                from: `${senderName}" <${this.user}>`, // sender address
                to: receiverEmail, // list of receivers
                subject: subject, // Subject line
                text: `${text}`, // plain text body
                html: `${html}`, // html body
            });
        } catch (error) {
            console.log(error);
        }
    }
}