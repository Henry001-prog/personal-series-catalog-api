import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  // CORS preflight request
  if (req.method === "OPTIONS") {
    next();
  } else {
    const token =
      req.body.token || req.query.token || req.headers["authorization"];

    if (!token) {
      return res.status(403).send({ errors: ["No token provided."] });
    }

    jwt.verify(
      token,
      process.env.AUTH_SECRET,
      function (err: any, decoded: any) {
        if (err) {
          return res.status(403).send({
            errors: ["Failed to authenticate token."],
          });
        } else {
          // req.decoded = decoded;
          next();
        }
      }
    );
  }
};
