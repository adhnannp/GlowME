import { inject, injectable } from 'inversify';
import cron from 'node-cron';
import { TYPES } from '../di/types';
import { IUserRepository } from '../core/interfaces/repositories/IUserRepository';
import { IUnbanUsersJob } from '../core/interfaces/middlewares/IUnbanUserJob';

@injectable()
export class UnbanUsersJob implements IUnbanUsersJob{

  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  public start(): void {
    cron.schedule('2 0 * * *', async () => {
      console.log('[CRON] Running unban job at 12:02 AM...');

      try {
        const success = await this.userRepository.unbanExpiredUsers();
        if (success) {
          console.log('[CRON] Successfully unbanned expired users.');
        } else {
          console.warn('[CRON] Unban operation was not acknowledged.');
        }
      } catch (err) {
        console.error('[CRON] Error in unban cron job:', err);
      }
    });
  }
}
