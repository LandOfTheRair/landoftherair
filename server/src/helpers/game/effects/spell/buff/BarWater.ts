import { ICharacter, IStatusEffect, Stat } from '../../../../../interfaces';
import { Effect } from '../../../../../models';

export class BarWater extends Effect {

  public override create(char: ICharacter, effect: IStatusEffect) {
    effect.effectInfo.statChanges = { [Stat.WaterResist]: effect.effectInfo.potency };
  }
}
