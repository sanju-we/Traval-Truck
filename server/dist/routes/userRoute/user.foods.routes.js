"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../core/DI/container");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const userFoodsRouter = (0, express_1.Router)();
const userFoodController = container_1.container.get('IUserFoodsController');
userFoodsRouter.get('/getAll', (0, asyncHandler_1.asyncHandler)(userFoodController.getAll.bind(userFoodController)));
exports.default = userFoodsRouter;
