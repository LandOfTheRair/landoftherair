import { IMacroCommandArgs, IPlayer } from '../../../../interfaces';
import { MacroCommand } from '../../../../models/macro';
import { CharacterHelper } from '../../../character';

export class Tickle extends MacroCommand {

  aliases = ['tickle'];
  canBeInstant = true;
  canBeFast = true;

  execute(player: IPlayer, args: IMacroCommandArgs) {
    const state = this.game.worldManager.getMapStateForCharacter(player);
    const playersInView = state.getAllPlayersInRange(player, 4);
    const target = this.game.targettingHelper.getFirstPossibleTargetInViewRange(player, args.stringArgs);

    if (!target || args.arrayArgs.length === 0 || target === player) {
      this.sendMessage(player, 'You tickle the air!');
      playersInView.filter(element => element !== player).forEach(p => {
        this.sendChatMessage(p, `${player.name} tickles the air!`);
      });
      return;
    }

    this.game.characterHelper.clearAgro(player, target);
    this.sendMessage(player, `You tickle ${target.name}!`);
    this.sendMessage(target, `${player.name} tickles you!`);
    playersInView.filter(element => element !== player && element !== target).forEach(p => {
      this.sendChatMessage(p, `${player.name} tickle ${target.name}!`);
    });

  }

}