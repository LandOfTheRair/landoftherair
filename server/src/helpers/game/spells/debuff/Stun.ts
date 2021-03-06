import { ICharacter, SpellCastArgs, Stat } from '../../../../interfaces';
import { Spell } from '../../../../models/world/Spell';

export class Stun extends Spell {

  override getDuration(caster: ICharacter | null) {
    if (!caster) return 3;
    return Math.floor(this.game.characterHelper.getStat(caster, Stat.WIS) / 2)
         + this.game.traitHelper.traitLevelValue(caster, 'IrresistibleStun');
  }

  override cast(caster: ICharacter | null, target: ICharacter | null, spellCastArgs: SpellCastArgs): void {
  }

}
