import { ICharacter, IPlayer, ItemSlot, Skill, SpellCastArgs, Stat } from '../../../../interfaces';
import { Spell } from '../../../../models/world/Spell';

export class ConjureSword extends Spell {

  override cast(caster: ICharacter | null, target: ICharacter | null, spellCastArgs: SpellCastArgs): void {
    if (!caster) return;

    const rightHand = caster.items.equipment[ItemSlot.RightHand];
    if (rightHand) {
      this.sendMessage(caster, { message: 'You need to empty your right hand!' });
      return;
    }

    this.sendMessage(caster, { message: 'You channel magical energy into the form of a sword.' });

    const item = this.game.itemCreator.getSimpleItem('Conjured Longsword');

    const skill = this.game.characterHelper.getSkillLevel(caster, Skill.Conjuration) + 1;

    item.mods.destroyOnDrop = true;
    item.mods.offhand = true;
    item.mods.tier = Math.floor(skill / 4);

    item.mods.stats = {};
    item.mods.stats[Stat.WeaponArmorClass] = Math.floor(skill / 6);
    item.mods.stats[Stat.Offense] = Math.floor(skill / 4);
    item.mods.stats[Stat.Defense] = Math.floor(skill / 4);
    item.mods.stats[Stat.Accuracy] = Math.floor(skill / 5);

    this.game.itemHelper.setOwner(caster as IPlayer, item);

    this.game.characterHelper.setRightHand(caster, item);

  }

}