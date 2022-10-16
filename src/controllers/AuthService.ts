import { Request, Response, NextFunction } from "express";
import _ from "lodash";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { User } from "../models/User";
import { ObjectId } from "mongoose";
import crypto from "crypto";

const uid = crypto.randomBytes(16).toString("hex");

interface IUser {
  _id: ObjectId;
  email: string;
  password: string;
  toJSON: () => string | object | Buffer;
}

const emailRegex: RegExp = /\S+@\S+\.\S+/;
const passwordRegex: RegExp =
  /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/;

const sendErrorsFromDB = (res: Response, dbErrors: any): Response => {
  const errors: [] | any = [];
  _.forIn(dbErrors.errors, (error) => errors.push(error.message));
  return res.status(400).json({ errors });
};

const login = (req: Request, res: Response, next: NextFunction): void => {
  const email: string = req.body.email || "";
  const password: string = req.body.password || "";

  User.findOne({ email }, (err: any, user: IUser) => {
    if (err) {
      return sendErrorsFromDB(res, err);
    } else if (user && bcryptjs.compareSync(password, user.password)) {
      const token: string = jwt.sign(user.toJSON(), process.env.AUTH_SECRET, {
        expiresIn: "5 day",
      });
      const { email }: IUser = user;
      res.json({ email, token });
    } else {
      return res.status(400).send({ errors: ["Usuário/Senha inválidos"] });
    }
  });
};

const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token: string = req.body.token || "";

  jwt.verify(
    token,
    process.env.AUTH_SECRET,
    function (err: any, decoded: any): Response {
      return res.status(200).send({ valid: !err });
    }
  );
};

const signup = (req: Request, res: Response, next: NextFunction) => {
  // const name: string = req.body.name || "";
  const email: string = req.body.email || "";
  const password: string = req.body.password || "";
  const confirmPassword: string = req.body.confirm_password || "";

  if (!email.match(emailRegex)) {
    return res.status(300).send({ errors: ["O e-mail informado está inválido"] });
  }

  if (!password.match(passwordRegex)) {
    return res.status(400).send({
      errors: [
        "Senha precisar ter: uma letra maiúscula, uma letra minúscula, um número, um caractere especial(@#$%) e tamanho entre 6-20.",
      ],
    });
  }

  const salt = bcryptjs.genSaltSync();
  const passwordHash: string = bcryptjs.hashSync(password, salt);
  if (!bcryptjs.compareSync(confirmPassword, passwordHash)) {
    return res.status(500).send({ errors: ["Senhas não conferem."] });
  }

  User.findOne({ email }, (err: any, user: IUser) => {
    if (err) {
      return sendErrorsFromDB(res, err);
    } else if (user) {
      return res.status(600).send({ errors: ["Usuário já cadastrado."] });
    } else {
      const newUser = new User({ email, password: passwordHash, uid });
      newUser.save((err) => {
        if (err) {
          return sendErrorsFromDB(res, err);
        } else {
          login(req, res, next);
        }
      });
    }
  });
};

const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({ email: req.params.email }, "-password");

    res.json(user);
  } catch (error) {
    res.status(900).json({
      Error: "Não foi possível trazer o registro específico solicitado!",
    });
    next();
  }
};

export const AuthService = { login, signup, validateToken, verifyUser };
