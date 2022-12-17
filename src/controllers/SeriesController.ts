import { model, UpdateQuery, PaginateModel, Schema } from "mongoose";
import { Request, Response, NextFunction } from "express";
import { Series } from "../models/Series";
import { Image } from "../models/Image";
import multer from "multer";
import { multerConfig } from "../config/multer";
import fs from "fs";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

interface ISeries {
  uid: string;
  series: {
    _id: Schema.Types.ObjectId;
    title: string;
    img: string;
    gender: string;
    rate: number;
    description: string;
    createdAt: Date;
  };
}

interface ImageType {
  originalname: string;
  size: number;
  filename: string;
  path: string;
  buffer: Buffer;
  mimetype: string;
}

interface ImageTypeTwo {
    name: string;
    size: number;
    key?: string;
    url: string;
    path: string;
    file: {
      data: Buffer,
      contentType: string;
    }
}

interface ImageTypeThree extends Document {
  file: Buffer;
  uid: string;
  name: string;
  size: number;
  key: string;
  url: string;
  path: string;
  createdAt: Number;
}

// const Series = model('Series');

const SeriesController = {
  async createSeries(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const series: ISeries = await Series.create(req.body);

      res.json(series);
    } catch (error) {
      res
        .status(500)
        .json({ Error: "Não foi possível criar o registro na base de dados!" });
      next();
    }
  },

  async createSeriesImage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        originalname: name,
        size,
        filename: key,
        path,
        buffer,
        mimetype,
      }: ImageType = (req as any).file;

      if (size > 2 * 1024 * 1024) {
        res
          .status(400)
          .json({
            Error: "Não foi possível criar o registro na base de dados!",
          });
      } else {
        console.log("Buffer e mimetype:", req.file!);
        const imageUploadObject: ImageTypeTwo = {
          name,
          size,
          key,
          url: "",
          path,
          file: {
            data: req.file!.buffer,
            contentType: req.file!.mimetype,
          },
        };

        const postImage = new Image(imageUploadObject);
        await postImage.save();

        res.json({ buffer, mimetype });
      }
    } catch (error) {
      res
        .status(500)
        .json({ Error: "Não foi possível criar o registro na base de dados!" });
      next();
    }
  },

  async showAllSeries(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page = 1 }: any = req.query;
      const series: ISeries[] = await Series.find({ uid: req.params.uid });
      res.json(series);
    } catch (error) {
      res
        .status(500)
        .json({ Error: "Não foi possível trazer os registros solicitados!" });
      next();
    }
  },

  async showAllImages(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const imagePath: ImageTypeThree[] = await Image.find({ name: req.params.name });
      res.json(imagePath);
    } catch (error) {
      res
        .status(500)
        .json({ Error: "Não foi possível trazer os registros solicitados!" });
      next();
    }
  },

  async showSeries(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const series: ISeries | null = await Series.findById(req.params.id);

      res.json(series);
    } catch (error) {
      res.status(500).json({
        Error: "Não foi possível trazer o registro específico solicitado!",
      });
      next();
    }
  },

  async updateSeries(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const series: ISeries | null = await Series.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

      res.json(series);
    } catch (error) {
      res.status(500).json({
        Error: "Não foi possível atualizar o registro na base de dados!",
      });
      next();
    }
  },

  async deleteSeries(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await Series.findByIdAndRemove(req.params.id);

      res.json({ Success: "Registro deletado com sucesso!" });
    } catch (error) {
      res
        .status(500)
        .json({ Error: "Não foi possível deletar o registro solicitado!" });
      next();
    }
  },
};

export default SeriesController;
