"use strict";

import { Response, Request, NextFunction } from "express";
import { UploadedFile } from "express-fileupload";
import Axios from "axios";
import FormData from "form-data";
import fs from "fs";
/**
 * Compiler API.
 * @route POST /api/v1/compile/
 */
export const postCompile = async (
  req: Request<{}, {}, { prog_language: string }>,
  res: Response,
  next: NextFunction
) => {
  const fileName = new Date().getTime();
  try {
    const file = req.files.file as UploadedFile;
    const data = new FormData();

    await file.mv("./tempUploads/" + fileName);

    data.append("file", fs.createReadStream("./tempUploads/" + fileName));

    const output = await Axios.post(
      `${process.env.COMPILER_URL}/${req.body.prog_language}`,
      data,
      {
        headers: { ...data.getHeaders() },
      }
    );

    fs.unlinkSync("./tempUploads/" + fileName);

    res.status(200).send(output.data);
  } catch (err) {
    fs.unlinkSync("./tempUploads/" + fileName);
    res.status(403).send(err.response.data);
    next(err);
  }
};
