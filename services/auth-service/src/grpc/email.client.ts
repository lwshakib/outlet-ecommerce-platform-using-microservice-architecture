import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";
import logger from "../logger/winston.logger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "../../proto/email.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const emailProto = (grpc.loadPackageDefinition(packageDefinition) as any).email;

const EMAIL_SERVICE_URL = process.env.EMAIL_SERVICE_GRPC_URL || "localhost:50051";

const client = new emailProto.EmailService(
  EMAIL_SERVICE_URL,
  grpc.credentials.createInsecure()
);

export const sendEmailGrpc = (to: string, subject: string, body: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    client.SendEmail({ to, subject, body }, (error: any, response: any) => {
      if (error) {
        logger.error("gRPC Error:", error);
        reject(error);
      } else {
        logger.info("gRPC Response:", response);
        resolve(response);
      }
    });
  });
};
