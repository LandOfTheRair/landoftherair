import { IMacroCommandArgs, SoundEffect } from '../../../../../interfaces';
import { Player } from '../../../../../models';
import { MacroCommand } from '../../../../../models/macro';

export class Climbs extends MacroCommand {

  override aliases = ['climbup', 'climbdown'];
  override canBeFast = true;

  override execute(player: Player, args: IMacroCommandArgs) {

    if (this.game.effectHelper.hasEffect(player, 'Snare')) return this.sendMessage(player, 'You are snared!');

    const map = this.game.worldManager.getMap(player.map)?.map;
    if (!map) return;

    const interactable = map.getInteractableAt(player.x, player.y);

    if (!interactable || !['ClimbUp', 'ClimbDown'].includes(interactable.type)) {
      this.sendMessage(player, 'There is nowhere to grip here.');
      return;
    }

    const { teleportMap, teleportX, teleportY, requireParty, subscriberOnly, requireHoliday, requireClass } = interactable.properties;

    if (subscriberOnly && !this.game.subscriptionHelper.isPlayerSubscribed(player)) {
      return this.sendMessage(player, 'You found an easter egg! Sadly, it\'s spoiled.');
    }

    if (requireClass && player.baseClass !== requireClass) {
      return this.sendMessage(player, 'You can\'t quite figure out how to navigate this.');
    }

    if (requireParty && !this.game.partyHelper.isInParty(player)) {
      return this.sendMessage(player, 'You must gather your party before venturing forth.');
    }

    if (requireHoliday && !this.game.holidayHelper.isHoliday(requireHoliday)) {
      return this.sendMessage(player, `That location is only seasonally open during "${requireHoliday}"!`);
    }

    if (!this.game.teleportHelper.canTeleport(player, teleportMap)) {
      return this.sendMessage(player, 'You cannot enter this area.');
    }

    this.sendMessage(player, `You climb ${interactable.type === 'ClimbUp' ? 'up' : 'down'}.`, SoundEffect.EnvStairs);

    this.game.teleportHelper.teleport(
      player,
      { x: teleportX, y: teleportY, map: teleportMap }
    );

  }

}
