import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { startCase } from 'lodash';

import { Alignment, Allegiance, ChatMode, directionFromOffset, directionToSymbol, GameServerEvent, Hostility, IAccount, ICharacter,
  ICharacterCreateInfo, IDialogChatAction, IMapData, INPC, IPlayer, isHostileTo, Stat } from '../../interfaces';
import { AccountState, GameState, LobbyState, SettingsState } from '../../stores';

import { ModalService } from './modal.service';
import { OptionsService } from './options.service';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private playGame: Subject<boolean> = new Subject();
  public get playGame$() {
    return this.playGame.asObservable();
  }

  private quitGame: Subject<void> = new Subject();
  public get quitGame$() {
    return this.quitGame.asObservable();
  }

  @Select(GameState.inGame) inGame$: Observable<boolean>;
  @Select(GameState.player) currentPlayer$: Observable<IPlayer>;
  @Select(GameState.map) currentMap$: Observable<IMapData>;

  @Select(AccountState.loggedIn) loggedIn$: Observable<boolean>;
  @Select(AccountState.account) account$: Observable<IAccount>;

  @Select(LobbyState.charCreateData) charCreateData$: Observable<ICharacterCreateInfo>;

  @Select(SettingsState.accounts) accounts$: Observable<IAccount[]>;
  @Select(SettingsState.charSlot) charSlot$: Observable<{ slot: number }>;
  @Select(SettingsState.chatMode) chatMode$: Observable<ChatMode>;
  @Select(SettingsState.currentCommand) currentCommand$: Observable<string>;
  @Select(SettingsState.currentLogMode) logMode$: Observable<string>;

  constructor(
    private socketService: SocketService,
    private optionsService: OptionsService,
    private modalService: ModalService
  ) {}

  init() {
    this.inGame$.subscribe(val => {
      if (val) {
        this.playGame.next(true);
        this.handleAutoExec();
        return;
      }

      this.playGame.next(false);
      this.quitGame.next();
    });
  }

private handleAutoExec() {
    if (!this.optionsService.autoExec) return;

    const commands = this.optionsService.autoExec.split('\n');
    commands.forEach(cmd => {
      this.sendCommandString(cmd);
    });
  }

  public reformatMapName(mapName: string): string {
    return this.reformatName(mapName.split('-Dungeon')[0]);
  }

  public reformatName(name: string): string {
    return startCase(name);
  }

  public sendCommandString(cmdString: string, target?: string) {
    cmdString = cmdString.replace(/\\;/g, '__SEMICOLON__');
    cmdString.split(';').forEach(cmd => {
      cmd = cmd.trim();
      cmd = cmd.replace(/__SEMICOLON__/g, ';');
      if (cmd === '') return;

      const hadHash = cmd.startsWith('#');
      if (hadHash) cmd = cmd.substring(1);

      let command = '';
      let args = '';

      if (cmd.includes(',') && (/[a-zA-Z0-9]/).test(cmd[0])) {
        command = '!privatesay';
        args = cmd;
      } else {
        [command, args] = this.parseCommand(cmd);
      }

      if (target) {
        args = `${args} ${target}`.trim();
      }

      this.sendAction(GameServerEvent.DoCommand, { command, args });
    });
  }

  public sendAction(action: GameServerEvent, args: any) {
    this.socketService.emit(action, args);
  }

  public queueAction(command: string, args?: string) {
    this.socketService.sendAction({ command, args });
  }

  private parseCommand(cmd: string) {
    const arr = cmd.split(' ');
    const multiPrefixes = ['party', 'look', 'show', 'cast', 'stance', 'powerword', 'art', 'findfamiliar', 'song'];

    let argsIndex = 1;

    let command = arr[0];

    if (multiPrefixes.includes(command)) {
      command = `${arr[0]} ${arr[1]}`;
      argsIndex = 2;
    }

    // factor in the space because otherwise indexOf can do funky things.
    const args = arr.length > argsIndex ? cmd.split(command)[1].trim() : '';

    return [command, args];
  }

  // get the direction from a character to another one
  public directionTo(from: { x: number; y: number; z?: number }, to: { x: number; y: number; z?: number }, useVertical = true): string {
    if (!to || !from) return '';

    const toZ = to.z ?? 0;
    const fromZ = from.z ?? 0;

    if (useVertical && toZ > fromZ) return 'Above';
    if (useVertical && toZ < fromZ) return 'Below';

    const diffX = to.x - from.x;
    const diffY = to.y - from.y;
    const dir = directionFromOffset(diffX, diffY);
    return directionToSymbol(dir);
  }

  // check the hostility level between two characters
  // any changes here _might_ need to be made to server/checkTargetForHostility
  public hostilityLevelFor(origin: ICharacter, compare: ICharacter): 'hostile'|'neutral'|'friendly' {
    if (!origin) return 'neutral';

    if (origin.allegiance === Allegiance.GM) return 'neutral';
    if (compare.allegiance === Allegiance.NaturalResource) return 'neutral';

    if ((origin as IPlayer).partyName && (origin as IPlayer).partyName === (compare as IPlayer).partyName) return 'neutral';

    if (compare.agro[origin.uuid] || origin.agro[compare.uuid]) return 'hostile';

    if (origin.effects._hash.Disguise && origin.totalStats[Stat.CHA] > compare.totalStats[Stat.WIL]) return 'neutral';

    const hostility = (compare as INPC).hostility;

    if (!hostility) return 'neutral';

    if (hostility === Hostility.Never) return 'friendly';

    if (hostility === Hostility.Faction) {
      if (isHostileTo(origin, compare.allegiance)
      || isHostileTo(compare, origin.allegiance)) return 'hostile';
    }

    if (origin.allegiance === compare.allegiance) return 'neutral';

    if (hostility === Hostility.Always) return 'hostile';

    if (origin.alignment === Alignment.Evil && compare.alignment === Alignment.Good) return 'hostile';

    return 'neutral';
  }

  public showCommandableDialog(dialogInfo: IDialogChatAction) {
    const res = this.modalService.commandDialog(dialogInfo);
    if (!res) return;

    res.subscribe(result => {
      if (!result || result === 'noop') return;

      const npcQuery = dialogInfo.displayNPCUUID || dialogInfo.displayNPCName;
      const cmd = npcQuery ? `${npcQuery}, ${result}` : result;
      this.sendCommandString(`#${cmd}`);
    });
  }
}
