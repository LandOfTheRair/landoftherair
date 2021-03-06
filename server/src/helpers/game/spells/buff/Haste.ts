import { ICharacter, SpellCastArgs, Stat } from '../../../../interfaces';
import { Spell } from '../../../../models/world/Spell';

export class Haste extends Spell {

  override getDuration(caster: ICharacter | null) {
    return caster ? this.game.characterHelper.getStat(caster, Stat.INT) * 25 : 600;
  }

  override cast(caster: ICharacter | null, target: ICharacter | null, spellCastArgs: SpellCastArgs): void {
  }

}
