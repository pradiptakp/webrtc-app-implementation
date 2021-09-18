// import { getUserDetail } from "./user";
import { NextFunction, Request, Response } from "express";
import * as authApi from "./auth";
import * as classesApi from "./classes";
import * as compilerApi from "./compiler";
import * as coursesApi from "./courses";
import * as exercisesApi from "./exercise";
import * as lecturersApi from "./lecturers";
import * as lessonApi from "./lesson";
import * as modulesApi from "./modules";
import * as quizzesApi from "./quizzes";
import * as rolesApi from "./roles";
import * as studentsApi from "./students";
import * as userApi from "./user";

/**
 * Classes API.
 * @route GET /api/v1/get-time/
 */
const getTimeApi = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const time = new Date().getTime();
    res.status(200).send({ time });
  } catch (e) {
    next(e);
  }
};

export const controllers = {
  ...authApi,
  ...classesApi,
  ...compilerApi,
  ...coursesApi,
  ...exercisesApi,
  ...lecturersApi,
  ...lessonApi,
  ...modulesApi,
  ...quizzesApi,
  ...rolesApi,
  ...studentsApi,
  ...userApi,
  getTimeApi,
};
