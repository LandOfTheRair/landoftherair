import { Game } from '../../helpers';
import { GameServerEvent } from '../../interfaces';
import { ServerAction } from '../../models/ServerAction';

export class ChangePasswordAction extends ServerAction {
  override type = GameServerEvent.ChangePassword;
  override requiredKeys = ['newPassword', 'oldPassword'];
  override requiresLoggedIn = true;

  override async act(game: Game, callbacks, data) {
    if (data.newPassword.length < 11)   return { wasSuccess: false, message: 'Password must be >10 characters.' };
    if (data.newPassword.length > 256)  return { wasSuccess: false, message: 'Password must be less than <256 characters.' };

    const doesPasswordMatch = await game.accountDB.checkPasswordString(data.account, data.oldPassword);
    if (!doesPasswordMatch)             return { wasSuccess: false, message: 'Old password is not correct.' };

    try {

      await game.accountDB.changePassword(data.account, data.newPassword);
      game.logger.log('Auth:ChangePassword', `${data.username} changed password.`);

    } catch (e) {
      game.logger.error('ChangePasswordAction', e);
      return { message: 'Could not change password? Try again, or contact a GM if this persists.' };
    }

    return { wasSuccess: true, message: 'Successfully changed your password.' };
  }
}
