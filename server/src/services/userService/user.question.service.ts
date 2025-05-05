// import { injectable, inject } from 'inversify';

// @injectable()
// export class UserQuestionService {

//   constructor(
//     @inject(TYPES.BadgeRepository) private badgeRepository: IBadgeRepository,
//     @inject(TYPES.UserRepository) private userRepository: IUserRepository
//   ) {}

//   async getAvailableBadges(userId: string): Promise<IBadge[]> {
//     return await this.badgeRepository.getAvailableBadges(userId);
//   }
// }