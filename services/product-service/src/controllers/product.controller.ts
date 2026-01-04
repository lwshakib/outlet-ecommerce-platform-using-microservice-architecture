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
    const { name, description, ownerId, industry } = req.body;
    const company = await prisma.company.create({
      data: { 
        name, 
        description, 
        ownerId, 
        industry,
        location: 'New York, USA' // Default location for now
      }
    });
    res.status(201).json(company);
  } catch (error) {
    next(error);
  }
};

export const getCompanyById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const company = await prisma.company.findUnique({
      where: { id },
      include: { products: true }
    });
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
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

export const getAllCompanies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(companies);
  } catch (error) {
    next(error);
  }
};

export const updateCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, location, industry } = req.body;
    const company = await prisma.company.update({
      where: { id },
      data: { name, description, location, industry }
    });
    res.json(company);
  } catch (error) {
    next(error);
  }
};
