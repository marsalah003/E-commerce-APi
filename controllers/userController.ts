import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/User";
import { BadRequestError, UnauthenticatedError } from "../errors";
import {
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
} from "../utils";

const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find({ role: "user" }).select("-password");

  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req: Request, res: Response) => {
  const user = await User.findOne({
    _id: req.params.id,
    role: "user",
  }).select("-password");

  if (!user) throw new BadRequestError(`No user with id ${req.user.userId}`);

  checkPermissions(req.user, user._id.toString());

  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async ({ user }: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ user });
};

const updateUserPassword = async (
  { body: { oldPassword, newPassword }, user: { userId } }: Request,
  res: Response
) => {
  if (!oldPassword || !newPassword)
    throw new BadRequestError("both new and old password must be provided");

  const user = (await User.findOne({ _id: userId }))!;

  const isPasswordmatch = await user.comparePassword(oldPassword);

  if (!isPasswordmatch)
    throw new UnauthenticatedError(
      "old password does not match users password"
    );

  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ success: true });
};

const updateUser = async (
  { body: { name, email }, user: { userId } }: Request,
  res: Response
) => {
  if (!name || !email)
    throw new BadRequestError("both a new name and email must be provided");

  const updatedUser = (await User.findOneAndUpdate(
    { _id: userId },
    { name, email },
    {
      new: true,
      runValidators: true,
    }
  ))!;
  const tokenUser = createTokenUser(updatedUser);

  attachCookiesToResponse(res, tokenUser);

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

export {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
