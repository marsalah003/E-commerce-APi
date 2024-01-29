import { Types } from "mongoose";
import { singleOrderItemSchema } from "./models/Order";
interface registerBodyI {
  name: string;
  email: string;
  password: string;
}
interface mongooseUserI extends registerBodyI {
  role: "admin" | "user";
}
interface userDB_I extends mongooseUserI {
  _id: Types.ObjectId;
}
interface loginBodyI extends Omit<registerBodyI, "name"> {}

interface errorObjectI {
  message: string;
}

interface tokenUserI {
  userId: string;
  role: string;
  name: string;
}
interface mongooseUserMethodsI {
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}
interface mongooseProductI {
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  company: string;
  colors: string[];
  featured: boolean;
  freeShipping: boolean;
  inventory: number;
  averageRating: number;
  user: Types.ObjectId;
  numOfReviews: number;
}

interface mongooseReviewI {
  rating: number;
  title: string;
  comment: string;
  user: Types.ObjectId;
  product: Types.ObjectId;
}
interface mongooseReviewMethodsI {}
interface mongooseProductMethodsI {}
interface fileI {
  image: {
    mv: (path: string) => Promise<boolean>;
    name: string;
    size: number;
    mimetype: string;
    tempFilePath: string;
  };
}
interface mongooseOrderI {
  tax: number;
  shippingFee: number;
  total: number;
  orderItems: (typeof singleOrderItemSchema)[];
  status: string;
  user: Types.ObjectId;
  clientSecret: string;
  paymentIntentId: string;
  subTotal: number;
}
interface cartItemI {
  name: string;
  price: number;
  image: string;
  amount: number;
  product: Types.ObjectId;
}

interface mongooseOrderMethodsI {}
export type {
  fileI,
  registerBodyI,
  loginBodyI,
  errorObjectI,
  mongooseUserI,
  mongooseUserMethodsI,
  userDB_I,
  tokenUserI,
  mongooseProductI,
  mongooseProductMethodsI,
  mongooseReviewI,
  mongooseReviewMethodsI,
  mongooseOrderI,
  mongooseOrderMethodsI,
  cartItemI,
};
