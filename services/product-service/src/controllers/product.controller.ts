import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import logger from "../logger/winston.logger";

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, companyId } = req.query;
    const products = await prisma.product.findMany({
      where: {
        ...(category ? { category: category as string } : {}),
        ...(companyId ? { companyId: companyId as string } : {}),
      },
      include: {
        company: true
      }
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { company: true }
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, price, images, category, companyId } = req.body;
    const product = await prisma.product.create({
      data: { name, description, price: parseFloat(price), images, category, companyId }
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const createCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, ownerId } = req.body;
    const company = await prisma.company.create({
      data: { name, description, ownerId }
    });
    res.status(201).json(company);
  } catch (error) {
    next(error);
  }
};

export const getCompaniesByOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ownerId } = req.params;
    const companies = await prisma.company.findMany({
      where: { ownerId }
    });
    res.json(companies);
  } catch (error) {
    next(error);
  }
};
