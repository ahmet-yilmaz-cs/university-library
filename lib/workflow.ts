import {Client as WorkflowClient} from "@upstash/workflow";
import config from "@/lib/config";
import { Client as QstashClient, resend } from "@upstash/qstash";

export const workflowClient = new WorkflowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
});

const qstashclient = new QstashClient({ token: 
  config.env.upstash.qstashToken 
});

export const sendEmail = async ({
  email, 
  subject, 
  message
} : {
  email: string,
  subject: string,
  message: string
}) => {

  await qstashclient.publishJSON({
    api: {
      name: "email",
      provider: resend({ token: config.env.resendToken }),
    },
    body: {
      from: "Ahmet Yılmaz <ahmetyilmaz@ahmet-yilmaz-cs.com>",
      // from "University Library <university-library@example.com>"
      to: [email],
      subject,
      html: message,
    },
  });
}