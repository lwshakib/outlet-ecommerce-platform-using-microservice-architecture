import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";
import { prisma } from "../lib/prisma";
import logger from "../logger/winston.logger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "../../proto/product.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const productProto = (grpc.loadPackageDefinition(packageDefinition) as any).product;

const productServer = {
  async CreateCompany(call: any, callback: any) {
    try {
      const { name, description, ownerId } = call.request;
      const company = await prisma.company.create({
        data: { name, description, ownerId },
      });
      callback(null, company);
    } catch (error: any) {
      logger.error("CreateCompany Error:", error);
      callback({
        code: grpc.status.INTERNAL,
        message: error.message,
      });
    }
  },

  async GetCompany(call: any, callback: any) {
    try {
      const company = await prisma.company.findUnique({
        where: { id: call.request.id },
      });
      if (!company) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: "Company not found",
        });
      }
      callback(null, company);
    } catch (error: any) {
      callback({
        code: grpc.status.INTERNAL,
        message: error.message,
      });
    }
  },

  async ListCompanies(call: any, callback: any) {
    try {
      const companies = await prisma.company.findMany({
        where: { ownerId: call.request.ownerId },
      });
      callback(null, { companies });
    } catch (error: any) {
      callback({
        code: grpc.status.INTERNAL,
        message: error.message,
      });
    }
  },

  async CreateProduct(call: any, callback: any) {
    try {
      const { name, description, price, images, category, companyId } = call.request;
      const product = await prisma.product.create({
        data: { name, description, price, images, category, companyId },
      });
      callback(null, product);
    } catch (error: any) {
      logger.error("CreateProduct Error:", error);
      callback({
        code: grpc.status.INTERNAL,
        message: error.message,
      });
    }
  },

  async GetProduct(call: any, callback: any) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: call.request.id },
      });
      if (!product) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: "Product not found",
        });
      }
      callback(null, product);
    } catch (error: any) {
      callback({
        code: grpc.status.INTERNAL,
        message: error.message,
      });
    }
  },

  async ListProducts(call: any, callback: any) {
    try {
      const { category } = call.request;
      const products = await prisma.product.findMany({
        where: category ? { category } : {},
      });
      callback(null, { products });
    } catch (error: any) {
      callback({
        code: grpc.status.INTERNAL,
        message: error.message,
      });
    }
  },

  async GetProductsByCompany(call: any, callback: any) {
    try {
      const products = await prisma.product.findMany({
        where: { companyId: call.request.companyId },
      });
      callback(null, { products });
    } catch (error: any) {
      callback({
        code: grpc.status.INTERNAL,
        message: error.message,
      });
    }
  },
};

export const startGrpcServer = () => {
  const server = new grpc.Server();
  server.addService(productProto.ProductService.service, productServer);
  const port = process.env.GRPC_PORT || "50052";
  server.bindAsync(
    `0.0.0.0:${port}`,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        logger.error("gRPC Server failed to bind:", error);
        return;
      }
      logger.info(`gRPC Product Server running at http://0.0.0.0:${port}`);
    }
  );
};
