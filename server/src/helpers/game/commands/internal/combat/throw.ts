
import { sample } from 'lodash';

import { distanceFrom, ICharacter, IMacroCommandArgs, IPlayer, ItemSlot, PhysicalAttackArgs } from '../../../../../interfaces';
import { SkillCommand } from '../../../../../models/macro';

export class ThrowCommand extends SkillCommand {

  override aliases = ['t', 'throw'];

  override range(): number {
    return 5;
  }

  override execute(player: IPlayer, args: IMacroCommandArgs) {
    const [hand, char] = args.arrayArgs;

    const target = this.game.targettingHelper.getFirstPossibleTargetInViewRange(player, char);
    if (!target) return this.youDontSeeThatPerson(player, args.stringArgs);

    if (target === player) return;

    if (distanceFrom(player, target) > this.range()) return this.sendMessage(player, 'That target is too far away!');

    const itemSlot = hand === 'left' ? ItemSlot.LeftHand : ItemSlot.RightHand;
    if (!player.items.equipment[itemSlot]) return this.sendMessage(player, 'You do not have anything to throw in that hand!');

    this.use(player, target, { throwHand: itemSlot });
  }

  override use(user: ICharacter, target: ICharacter, opts: PhysicalAttackArgs = {}): void {
    opts.isThrow = true;
    opts.throwHand = opts.throwHand || ItemSlot.RightHand;
    opts.attackRange = this.range();

    const numThrows = 1 + this.game.traitHelper.traitLevelValue(user, 'Multithrow');
    for (let i = 0; i < numThrows; i++) {
      this.game.combatHelper.physicalAttack(user, target, opts);

      if (user && target && this.game.traitHelper.rollTraitValue(user, 'BouncingThrows')) {
        const state = this.game.worldManager.getMapStateForCharacter(user);
        if (!state) return;

        const nearby = state.getAllHostilesInRange(user, 4).filter(x => x !== target);

        const bounceTo = sample(nearby);
        if (bounceTo) {
          this.game.combatHelper.physicalAttack(user, bounceTo, opts);
        }

      }
    }
  }

}
