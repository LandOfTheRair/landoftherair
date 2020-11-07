import { ICharacter } from './character';
import { IPlayer } from './player';

export interface IMacroCommandArgs {
  stringArgs: string;
  arrayArgs: string[];
  objArgs: any;
  calledAlias: string;
}

export interface IMacroCommand {
  aliases: string[];
  canBeFast: boolean;
  canBeInstant: boolean;

  execute(executor: IPlayer, args: IMacroCommandArgs): void;
}

export interface IMacroSkill extends IMacroCommand {
  metadata: IMacroMetadata;
  targetsFriendly: boolean;
  requiresLearn: boolean;

  range(char: ICharacter): number;
  cost(char: ICharacter): number;
  modifyCost(char: ICharacter, cost: number): number;
  canUse(char: ICharacter, target: ICharacter): boolean;

  use(char: ICharacter, target: ICharacter, opts: any): void;
}

export interface IMacroMonsterSkill extends IMacroSkill {
  isMonsterSkill: boolean;
}

export interface IMacroContainer {
  activeMacroBars: Record<string, Record<number, string[]>>; // username -> charSlot -> [group1, group2, group3]
  activeMacros: Record<string, Record<number, string>>; // username -> charSlot -> macroname
  customMacros: Record<string, IMacro>;
  characterMacros: Record<string, Record<number, Record<string, IMacroBar>>>;  // username -> charSlot -> macrobarname -> macrobar
}

export interface IMacroBar {
  macros: string[];
  name: string;
}

export interface IMacro {
  key: string;
  modifiers: { shift: boolean, alt: boolean, ctrl: boolean };

  mode: 'autoActivate' | 'lockActivation' | 'clickToTarget';
  ignoreAutoattackOption: boolean;

  appendTargetToEachMacro: boolean;
  macro: string;

  tooltipDesc: string;

  name: string;
  icon: string;

  color: string;
  background: string;

  isSystem: boolean;
  requiresLearn: boolean;
  requiresBaseClass: boolean;
}

export interface IMacroMetadata {
  name: string;
  macro: string;

  icon: string;
  color: string;
  bgColor?: string;

  mode: 'autoActivate' | 'lockActivation' | 'clickToTarget';
  tooltipDesc: string;

  requireBaseClass?: string;
  requireCharacterLevel?: number;
  requireSkillLevel?: number;

  skillTPCost?: number;
}
