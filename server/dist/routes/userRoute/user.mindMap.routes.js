import { Router } from "express";
import { container } from "../../core/DI/container";
import { asyncHandler } from "../../middleware/asyncHandler";
const mindMapRouter = Router();
const mindMapController = container.get('IUserMindMapController');
mindMapRouter.post('/create', asyncHandler(mindMapController.create.bind(mindMapController)))
    .get('/getMap', asyncHandler(mindMapController.getmap.bind(mindMapController)))
    .get('/mindMap', asyncHandler(mindMapController.mindMap.bind(mindMapController)))
    .post('/confirmMap', asyncHandler(mindMapController.confirmMap.bind(mindMapController)));
export default mindMapRouter;
