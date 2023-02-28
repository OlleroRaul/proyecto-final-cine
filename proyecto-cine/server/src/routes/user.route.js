import express from "express";
import { body } from "express-validator";
import favoriteController from "../controllers/favorite.controller.js";
import userController from "../controllers/user.controller.js";
import requestHandler from "../handlers/request.handler.js";
import userModel from "../models/user.model.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router();

router.post(
  "/signup",
  body("username")
    .exists().withMessage("se requiere nombre de usuario")
    .isLength({ min: 8 }).withMessage("nombre de usuario mínimo de 8 caracteres")
    .custom(async value => {
      const user = await userModel.findOne({ username: value });
      if (user) return Promise.reject("nombre de usuario existente");
    }),
  body("password")
    .exists().withMessage("se requiere contraseña")
    .isLength({ min: 8 }).withMessage("contraseña mínima de 8 caracteres"),
  body("confirmPassword")
    .exists().withMessage("se requiere confirmar contraseña")
    .isLength({ min: 8 }).withMessage("confirmar contraseña mínima de 8 caracteres")
    .custom((value, { req }) => {
      if (value !== req.body.password) throw new Error("las contraseñas no coinciden");
      return true;
    }),
  body("displayName")
    .exists().withMessage("se requiere un nombre público")
    .isLength({ min: 8 }).withMessage("nombre mínimo de 8 caracteres"),
  requestHandler.validate,
  userController.signup
);

router.post(
  "/signin",
  body("username")
    .exists().withMessage("se requiere nombre de usuario")
    .isLength({ min: 8 }).withMessage("nombre de usuario mínimo de 8 caracteres"),
  body("password")
    .exists().withMessage("se requiere contraseña")
    .isLength({ min: 8 }).withMessage("contraseña mínima de 8 caracteres"),
  requestHandler.validate,
  userController.signin
);

router.put(
  "/update-password",
  tokenMiddleware.auth,
  body("password")
    .exists().withMessage("se requiere contraseña")
    .isLength({ min: 8 }).withMessage("contraseña mínima de 8 caracteres"),
  body("newPassword")
    .exists().withMessage("se requiere nueva contraseña")
    .isLength({ min: 8 }).withMessage("nueva contraseña mínima de 8 caracteres"),
  body("confirmNewPassword")
    .exists().withMessage("se requiere confirmar contraseña")
    .isLength({ min: 8 }).withMessage("confirmar contraseña mínima de 8 caracteres")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) throw new Error("las contraseñas no coinciden");
      return true;
    }),
  requestHandler.validate,
  userController.updatePassword
);

router.get(
  "/info",
  tokenMiddleware.auth,
  userController.getInfo
);

router.get(
  "/favorites",
  tokenMiddleware.auth,
  favoriteController.getFavoritesOfUser
);

router.post(
  "/favorites",
  tokenMiddleware.auth,
  body("mediaType")
    .exists().withMessage("mediaType is required")
    .custom(type => ["movie", "tv"].includes(type)).withMessage("mediaType invalid"),
  body("mediaId")
    .exists().withMessage("mediaId is required")
    .isLength({ min: 1 }).withMessage("mediaId can not be empty"),
  body("mediaTitle")
    .exists().withMessage("mediaTitle is required"),
  body("mediaPoster")
    .exists().withMessage("mediaPoster is required"),
  body("mediaRate")
    .exists().withMessage("mediaRate is required"),
  requestHandler.validate,
  favoriteController.addFavorite
);

router.delete(
  "/favorites/:favoriteId",
  tokenMiddleware.auth,
  favoriteController.removeFavorite
);

export default router;