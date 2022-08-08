import { TUserType } from "..";

declare global{
  namespace Express {
      interface Request {
        user?: TUserType;
      }
  }
}
