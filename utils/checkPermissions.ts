import { UnauthorizedError } from "../errors";
import { tokenUserI } from "../types";
export const checkPermissions = (
  { userId, role }: tokenUserI,
  resourceUserId: string
) => {
  if (userId === resourceUserId || role === "admin") return;

  throw new UnauthorizedError("user is not authorised to access this route");
};
