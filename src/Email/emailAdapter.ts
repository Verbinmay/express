import nodemailer from "nodemailer";
import {injectable} from "inversify";
@injectable()
export class EmailsAdapter  {
    async sendEmail(a: { email: string, subject: string, message: string }) {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "markmaywhynot@gmail.com",
                pass: process.env.GMAIL,
            },
        });

        return await transporter.sendMail({
            from: '"MARKIX" <markmaywhynot@gmail.com>', // sender address
            to: a.email, // list of receivers
            subject: a.subject, // Subject line
            html: a.message, // html body
        });
    }
}
