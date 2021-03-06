
import { IMacroCommandArgs, IPlayer } from '../../../../../interfaces';
import { MacroCommand } from '../../../../../models/macro';

export class Move extends MacroCommand {
  override aliases = ['move'];
  override canBeFast = true;
  override canBeInstant = true;

  override execute(player: IPlayer, args: IMacroCommandArgs) {
    const [x, y] = args.arrayArgs.map(v => +v);
    this.game.movementHelper.moveWithPathfinding(player, { xDiff: x, yDiff: y });
  }
}
