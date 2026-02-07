"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../core/DI/container");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const mindMapRouter = (0, express_1.Router)();
const mindMapController = container_1.container.get('IUserMindMapController');
mindMapRouter.post('/create', (0, asyncHandler_1.asyncHandler)(mindMapController.create.bind(mindMapController)))
    .get('/getMap', (0, asyncHandler_1.asyncHandler)(mindMapController.getmap.bind(mindMapController)))
    .get('/mindMap', (0, asyncHandler_1.asyncHandler)(mindMapController.mindMap.bind(mindMapController)))
    .post('/confirmMap', (0, asyncHandler_1.asyncHandler)(mindMapController.confirmMap.bind(mindMapController)));
exports.default = mindMapRouter;
