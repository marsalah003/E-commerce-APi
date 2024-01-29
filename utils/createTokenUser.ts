// when getting user straight from database
import type { userDB_I } from "../types";

export const createTokenUser = (user: userDB_I) => {
  return {
    role: user.role,
    name: user.name,
    userId: user._id.toString(),
  };
};
