import { model, UpdateQuery, PaginateModel } from "mongoose";
import { Request, Response, NextFunction } from "express";
import { Series } from "../models/Series";

interface ISeries {
  title: string;
  img: string;
  gender: string;
  rate: number;
  description: string;
  createdAt: Number;
}

// const Series = model('Series');

const SeriesController = {
  async createSeries(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const series = await Series.create(req.body);

      res.json(series);
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
      const series = await Series.find({ uid: req.params.uid });
      res.json(series);
    } catch (error) {
      res
        .status(500)
        .json({ Error: "Não foi possível trazer os registros solicitados!" });
      next();
    }
  },

  async showSeries(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const series = await Series.findById(req.params.id);

      res.json(series);
    } catch (error) {
      res.status(500).json({
        Error: "Não foi possível trazer o registro específico solicitado!",
      });
      next();
    }
  },

  async updateSeries(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const series = await Series.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });

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
