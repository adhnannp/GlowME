import { Router as Router_question } from 'express';
import container_question from '../../di/container';
import { TYPES as TYPES_question } from '../../di/types';
import { IUserQuestionController } from '../../core/interfaces/controllers/user/IUser.Question.Controller';
import { IUserAuthMiddleware as IUserAuthMiddleware_question } from '../../core/interfaces/middlewares/IUserAuthMiddleware';
import { questionUploads } from '../../config/multerConfig';

const questionRouter = Router_question();

const questionController = container_question.get<IUserQuestionController>(TYPES_question.UserQuestionController);
const userAuthMiddleware_question = container_question.get<IUserAuthMiddleware_question>(TYPES_question.UserAuthMiddleware);
const auth_question = userAuthMiddleware_question.handle.bind(userAuthMiddleware_question);

questionRouter.get('/questions/check-title', auth_question, questionController.checkTitleAvailablity.bind(questionController));
questionRouter.post(
  '/questions/create',
  auth_question,
  questionUploads.fields([
    { name: 'image', maxCount: 1 },
    { name: 'document', maxCount: 1 },
  ]),
  questionController.createQuestion.bind(questionController)
);
questionRouter.get('/questions/get-all', auth_question, questionController.getQuestionsByType.bind(questionController));
questionRouter.get('/questions/get-one/:slug', auth_question, questionController.getOneBySlug.bind(questionController));
questionRouter.post('/questions/find-similar', auth_question, questionController.findSimilarQuetions.bind(questionController));
questionRouter.get('/questions/get-related/:id', auth_question, questionController.relatedQuestions.bind(questionController));
questionRouter.post('/questions/react/:questionId', auth_question, questionController.reactToQuestion.bind(questionController));
questionRouter.delete('/questions/react/:questionId', auth_question, questionController.removeQuestionReaction.bind(questionController));

export default questionRouter;