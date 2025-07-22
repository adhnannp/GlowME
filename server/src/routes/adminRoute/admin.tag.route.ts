import { Router as Router_tag } from 'express';
import container_tag from '../../di/container';
import { TYPES as TYPES_tag } from '../../di/types';
import { IAdminTagController } from '../../core/interfaces/controllers/admin/IAdmin.Tag.Controller';
import { IAdminAuthMiddleware as IAdminAuthMiddleware_tag } from '../../core/interfaces/middlewares/IAdminAuthMiddleware';

const tagRouter = Router_tag();

const tagController = container_tag.get<IAdminTagController>(TYPES_tag.AdminTagController);
const adminAuthMiddleware_tag = container_tag.get<IAdminAuthMiddleware_tag>(TYPES_tag.AdminAuthMiddleware);
const adminAuth_tag = adminAuthMiddleware_tag.handle.bind(adminAuthMiddleware_tag);

tagRouter.get('/tags', adminAuth_tag, tagController.getAllTags.bind(tagController));
tagRouter.post('/tags', adminAuth_tag, tagController.createTag.bind(tagController));
tagRouter.patch('/tags/:id', adminAuth_tag, tagController.editTagName.bind(tagController));
tagRouter.patch('/tags/list/:id', adminAuth_tag, tagController.listTag.bind(tagController));
tagRouter.patch('/tags/unlist/:id', adminAuth_tag, tagController.unlistTag.bind(tagController));

export default tagRouter;