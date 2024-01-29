import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Product } from "../models/Product";
import { BadRequestError } from "../errors";
import cloudinary from "cloudinary";
import { unlink } from "fs/promises";
import type { fileI } from "../types";
import { Review } from "../models/Review";

const createProduct = async (
  { body, user: { userId } }: Request,
  res: Response
) => {
  const product = await Product.create({ ...body, user: userId });
  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req: Request, res: Response) => {
  const products = await Product.find({});

  res.status(StatusCodes.OK).json({ count: products.length, products });
};
const getSingleProduct = async (
  { params: { id: productId } }: Request,
  res: Response
) => {
  const product = await Product.findOne({ _id: productId });

  if (!product)
    throw new BadRequestError(`There is no product with id ${productId}`);

  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (
  { body, params: { id: productId } }: Request,
  res: Response
) => {
  const updatedProduct = await Product.findOneAndUpdate(
    { _id: productId },
    body,
    { new: true, runValidators: true }
  );

  if (!updatedProduct)
    throw new BadRequestError(`No product with id ${productId}`);

  res.status(StatusCodes.OK).json({ updatedProduct });
};
const deleteProduct = async (
  { params: { id: productId } }: Request,
  res: Response
) => {
  const productToDelete = await Product.findById(productId);
  if (!productToDelete)
    throw new BadRequestError(`No product with id ${productId}`);

  await productToDelete.deleteOne();
  res.status(StatusCodes.OK).json({ success: "product deleted" });
};
const uploadImage = async ({ files }: { files: fileI }, res: Response) => {
  if (!files) throw new BadRequestError("An image must be provided");

  if (!files.image.mimetype.startsWith("image"))
    throw new BadRequestError("please upload an image");

  const maxSize = 1024 * 1024;

  if (files.image.size > maxSize) throw new BadRequestError("image too large");

  const { secure_url } = await cloudinary.v2.uploader.upload(
    files.image.tempFilePath,
    {
      use_filename: true,
      folder: "10-E-commerce-API",
      auto: true,
    }
  );

  await unlink(files.image.tempFilePath);
  res.status(StatusCodes.CREATED).json({ image: { src: secure_url } });
};

export {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
