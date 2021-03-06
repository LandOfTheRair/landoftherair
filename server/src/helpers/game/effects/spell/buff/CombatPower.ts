import { ICharacter, IStatusEffect, Stat } from '../../../../../interfaces';
import { Effect } from '../../../../../models';

export class CombatPower extends Effect {

  public override create(char: ICharacter, effect: IStatusEffect) {
    effect.effectInfo.statChanges = {
      [Stat.Offense]: effect.effectInfo.potency,
      [Stat.Defense]: effect.effectInfo.potency
    };
  }

}
