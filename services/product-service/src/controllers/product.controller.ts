import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import logger from "../logger/winston.logger";

// --- Product Logic ---

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, categoryId, companyId, q } = req.query;
    
    const where: any = {};
    if (q) {
      where.OR = [
        { name: { contains: String(q), mode: 'insensitive' } },
        { description: { contains: String(q), mode: 'insensitive' } },
      ];
    }
    if (categoryId) {
      where.categoryId = String(categoryId);
    } else if (category) {
      where.category = {
        name: { contains: String(category), mode: 'insensitive' }
      };
    }
    if (companyId) {
      where.companyId = String(companyId);
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        company: true,
        inventory: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Format for existing UI expectations
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { 
        category: true,
        company: true,
        inventory: true
      }
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
    const { name, description, price, images, categoryId, companyId, initialStock } = req.body;
    
    const product = await prisma.product.create({
      data: { 
        name, 
        description, 
        price: parseFloat(price), 
        images: images || [], 
        categoryId, 
        companyId,
        inventory: {
          create: {
            stock: initialStock || 0
          }
        }
      },
      include: {
        inventory: true,
        category: true
      }
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, price, images, categoryId } = req.body;
    const product = await prisma.product.update({
      where: { id },
      data: { 
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(images && { images }),
        ...(categoryId && { categoryId })
      }
    });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // Delete inventory first if not cascading
    await prisma.inventory.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// --- Category Logic ---

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body;
    const category = await prisma.category.create({
      data: { name, description }
    });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

// --- Company Logic ---

export const createCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, ownerId, industry, location } = req.body;
    const company = await prisma.company.create({
      data: { 
        name, 
        description, 
        ownerId, 
        industry,
        location: location || 'New York, USA'
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
