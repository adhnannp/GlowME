import { Router as Router_tag } from 'express';
import container_tag from '../../di/container';
import { TYPES as TYPES_tag } from '../../di/types';
import { IUserTagController } from '../../core/interfaces/controllers/user/IUser.Tag.Controller';
import { IUserAuthMiddleware as IUserAuthMiddleware_tag } from '../../core/interfaces/middlewares/IUserAuthMiddleware';

const tagRouter = Router_tag();

const tagController = container_tag.get<IUserTagController>(TYPES_tag.UserTagController);
const userAuthMiddleware_tag = container_tag.get<IUserAuthMiddleware_tag>(TYPES_tag.UserAuthMiddleware);
const auth_tag = userAuthMiddleware_tag.handle.bind(userAuthMiddleware_tag);

tagRouter.get('/tag/get-top', auth_tag, tagController.getTopTags.bind(tagController));
tagRouter.get('/tag/search-tags', auth_tag, tagController.searchTag.bind(tagController));

export default tagRouter;