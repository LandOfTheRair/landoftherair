import { IMacroCommandArgs, IPlayer, MessageType } from '../../../../interfaces';
import { MacroCommand } from '../../../../models/macro';

export class DebugCountItems extends MacroCommand {

  override aliases = ['&items'];
  override canBeInstant = false;
  override canBeFast = false;

  override execute(player: IPlayer, args: IMacroCommandArgs) {
    const message = `[Debug] There are currently ${this.game.groundManager.getAllItemsFromGround(player.map).length} items on the ground in this world.`;
    this.game.messageHelper.sendLogMessageToPlayer(player, { message, sfx: undefined }, [MessageType.Description]);
  }
}
