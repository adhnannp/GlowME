import { Router as Router_answer } from 'express';
import container_answer from '../../di/container';
import { TYPES as TYPES_answer } from '../../di/types';
import { IUserAnswerController } from '../../core/interfaces/controllers/user/IUser.Answer.Controller';
import { IUserAuthMiddleware as IUserAuthMiddleware_answer } from '../../core/interfaces/middlewares/IUserAuthMiddleware';

const answerRouter = Router_answer();

const answerController = container_answer.get<IUserAnswerController>(TYPES_answer.UserAnswerController);
const userAuthMiddleware_answer = container_answer.get<IUserAuthMiddleware_answer>(TYPES_answer.UserAuthMiddleware);
const auth_answer = userAuthMiddleware_answer.handle.bind(userAuthMiddleware_answer);

answerRouter.post('/answer/add', auth_answer, answerController.createAnswer.bind(answerController));
answerRouter.get('/answer/can-answer/:questionId', auth_answer, answerController.canUserAnswer.bind(answerController));
answerRouter.get('/answer/list/:questionId', auth_answer, answerController.getAnswersByQuestion.bind(answerController));
answerRouter.post('/answer/react/:answerId', auth_answer, answerController.reactToAnswer.bind(answerController));
answerRouter.delete('/answer/react/:answerId', auth_answer, answerController.removeAnswerReaction.bind(answerController));
answerRouter.patch('/answer/update-quality/:answerId', auth_answer, answerController.updateAnswerQuality.bind(answerController));

export default answerRouter;