import { Router } from "express";
import { IAdminSubscriptionController } from "../../core/interface/controllerInterface/admin/Iadmin.subscription.controller.js";
import { container } from "../../core/DI/container.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const adminSubscriptionRouter = Router()
const AdminSubscription = container.get<IAdminSubscriptionController>('IAdminSubscriptionController');

adminSubscriptionRouter
  .post('/add', asyncHandler(AdminSubscription.addSubscription.bind(AdminSubscription)))
  .get('/getAll', asyncHandler(AdminSubscription.getAll.bind(AdminSubscription)))
  .put('/update/:id', asyncHandler(AdminSubscription.updateSubscription.bind(AdminSubscription)))
  .put('/toggle/:id',asyncHandler(AdminSubscription.tonggleStatus.bind(AdminSubscription)))

export default adminSubscriptionRouter