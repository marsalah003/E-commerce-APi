import { StatusCodes } from "http-status-codes";
import { User } from "../models/User";
import { BadRequestError, UnauthenticatedError } from "../errors";
import { attachCookiesToResponse } from "../utils";
import { Request, Response } from "express";
import { createTokenUser } from "../utils";
import type { registerBodyI, loginBodyI } from "../types";
const register = async (
  { body: { name, email, password } }: { body: registerBodyI },
  res: Response
) => {
  const userExists = await User.findOne({ email });
  if (userExists) throw new BadRequestError("email is already in use");

  const isFirstAccount = (await User.countDocuments({})) === 0;

  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({ name, email, password, role });

  const tokenUser = createTokenUser(user);

  attachCookiesToResponse(res, tokenUser);

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (
  { body: { email, password } }: { body: loginBodyI },
  res: Response
) => {
  if (!email || !password)
    throw new BadRequestError("both email and password must be provided");

  const user = await User.findOne({ email });

  if (!user) throw new UnauthenticatedError("email was not found");

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid)
    throw new UnauthenticatedError("password doesent match");

  const tokenUser = createTokenUser(user);

  attachCookiesToResponse(res, tokenUser);

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req: Request, res: Response) => {
  res.cookie("token", "logout", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out! " });
};

export { register, login, logout };
