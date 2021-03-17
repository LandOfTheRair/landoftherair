
import { Injectable } from 'injection-js';

import { Holiday, IPlayer, Currency } from '../../../interfaces';
import { BaseService } from '../../../models/BaseService';

const holidayChecker = {

  // takes place in October, all month
  Halloween: () => new Date().getMonth() === 9,

  // takes place in November, all month
  Thanksgiving: () => new Date().getMonth() === 10,

  // takes place in December, all month
  Christmas: () => new Date().getMonth() === 11
};

const holidayDescriptions = {
  Halloween: 'Go smash some zombies, take their brains, and go trick-or-treating!',
  Thanksgiving: 'Help some pilgrims shoot some turkeys, test your shooting accuracy, and gather food for a feast!',
  Christmas: 'Stop Jack Frost from taking over Christmas, help some elves, and find some reindeer!'
};

@Injectable()
export class HolidayHelper extends BaseService {

  public init() {}

  isHoliday(hol: Holiday): boolean {
    if (!holidayChecker[hol]) return false;
    return holidayChecker[hol]();
  }

  isAnyHoliday(): boolean {
    return Object.keys(holidayChecker).map(hol => holidayChecker[hol]()).some(Boolean);
  }

  currentHoliday(): Holiday {
    let holiday = '';

    // we do this in case we have sub-holidays, ie, new years is the last week of christmas (for example)
    Object.keys(holidayChecker).forEach(checkHoliday => {
      if (!holidayChecker[checkHoliday]()) return;
      holiday = checkHoliday;
    });

    return holiday as Holiday;
  }

  currentHolidayDescription(holiday: Holiday|string): string {
    return holidayDescriptions[holiday];
  }

  tryGrantHolidayTokens(player: IPlayer, amt: number): void {
    if (!this.isAnyHoliday()) return;

    if (player.subscriptionTier > 0) amt *= 2;

    this.game.currencyHelper.gainCurrency(player, amt, Currency[this.currentHoliday()]);
    this.game.messageHelper.sendSimpleMessage(player, `You also earned ${amt} ${Currency[this.currentHoliday()]}!`);
  }

}
