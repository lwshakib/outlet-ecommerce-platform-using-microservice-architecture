import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";
import { sendEmail } from "./mailer";
import logger from "./logger/winston.logger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "../proto/email.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const emailProto = (grpc.loadPackageDefinition(packageDefinition) as any).email;

async function sendEmailGRPC(call: any, callback: any) {
  try {
    const { to, subject, body } = call.request;
    logger.info(" [x] Received from gRPC:", { to, subject });

    await sendEmail({ to, subject, body, method: "GRPC" });

    callback(null, { success: true, message: "Email sent successfully via gRPC" });
  } catch (error: any) {
    callback(null, { success: false, message: error.message || "Failed to send email via gRPC" });
  }
}

export function startGRPCServer() {
  const server = new grpc.Server();
  server.addService(emailProto.EmailService.service, {
    SendEmail: sendEmailGRPC,
  });

  const GRPC_PORT = process.env.GRPC_PORT || "50051";
  server.bindAsync(
    `0.0.0.0:${GRPC_PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        logger.error("gRPC Server failed to bind:", error);
        return;
      }
      logger.info(`gRPC Server running at http://0.0.0.0:${port}`);
    }
  );
}
