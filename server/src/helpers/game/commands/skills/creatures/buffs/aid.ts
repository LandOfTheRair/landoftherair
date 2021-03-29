import { ICharacter, IMacroCommandArgs, IPlayer } from '../../../../../../interfaces';
import { SpellCommand } from '../../../../../../models/macro';

export class Aid extends SpellCommand {

  aliases = ['aid', 'cast aid'];
  requiresLearn = true;
  canTargetSelf = true;
  spellRef = 'Aid';

  canUse(caster: ICharacter, target: ICharacter): boolean {
    return super.canUse(caster, target) && !this.game.effectHelper.hasEffect(target, 'Aid');
  }

  execute(player: IPlayer, args: IMacroCommandArgs) {
    if (!this.tryToConsumeMP(player, [], args.overrideEffect)) return;

    this.castSpell(player, args);
  }

}