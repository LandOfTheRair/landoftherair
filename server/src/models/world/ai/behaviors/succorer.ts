import { Parser } from 'muud';

import { Game } from '../../../../helpers';
import { distanceFrom, GameServerResponse, IAIBehavior, INPC, IPlayer, ISuccorerBehavior, ItemSlot } from '../../../../interfaces';

export class SuccorerBehavior implements IAIBehavior {

  init(game: Game, npc: INPC, parser: Parser, behavior: ISuccorerBehavior) {

    let { succorOz } = behavior;
    succorOz ??= 1;

    parser.addCommand('hello')
      .setSyntax(['hello'])
      .setLogic(async ({ env }) => {
        const player = env?.player;
        if (!player) return 'You do not exist.';

        if (distanceFrom(player, npc) > 0) return 'You are too far away from the tree.';

        env?.callbacks.emit({
          type: GameServerResponse.SendConfirm,
          title: 'Get Succor Fruit?',
          content: 'Would you like to take a SUCCOR fruit?',
          extraData: { npcSprite: npc.sprite, okText: 'Yes, take!', cancelText: 'No, not now' },
          okAction: { command: '!privatesay', args: `${npc.uuid}, succor` }
        });

        return 'Would you like to take a SUCCOR fruit?';
      });

    parser.addCommand('succor')
      .setSyntax(['succor'])
      .setLogic(async ({ env }) => {
        const player: IPlayer = env?.player;
        if (!player) return 'You do not exist.';

        if (distanceFrom(player, npc) > 0) return 'You are too far away from the tree.';

        const rightHand = player.items.equipment[ItemSlot.RightHand];
        if (rightHand) return 'Your right hand cannot pick a fruit!';

        const succorItem = game.itemCreator.createSuccorItem(npc.map, npc.x, npc.y, game.subscriptionHelper.maxSuccorOz(player, succorOz));
        game.characterHelper.setRightHand(player, succorItem);

        return 'You take a succor fruit!';
      });
  }

  tick() {}
}
