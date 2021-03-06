
import { Entity, Property } from '../../helpers/core/db/decorators';
import { ICharacterItems, IItemContainer, ISimpleItem, ItemSlot } from '../../interfaces';
import { BaseEntity } from '../BaseEntity';

@Entity()
export class PlayerItems extends BaseEntity implements ICharacterItems {

  // relation props

  // other props
  @Property() equipment: Partial<Record<ItemSlot, ISimpleItem>> = {};

  @Property() sack: IItemContainer = { items: [] };
  @Property() belt: IItemContainer = { items: [] };

  @Property() buyback: ISimpleItem[] = [];

}
