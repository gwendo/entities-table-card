import { LovelaceCard, LovelaceCardConfig, LovelaceCardEditor } from 'custom-card-helpers';

declare global {
  interface HTMLElementTagNameMap {
    'entities-table-card-editor': LovelaceCardEditor;
    'hui-error-card': LovelaceCard;
  }
}

// TODO Add your configuration elements here for type-checking
export interface EntitiesTableCardConfig extends LovelaceCardConfig {
  type: string;
  name?: string;
  entities?: EntityConfig[];
  dataColumns?: EntitiesColumnConfig[];
}

export interface EntitiesColumnConfig {
  header: string;
  source?: 'attr' | 'state';
  attr: string;
  format?: 'currency' | 'percentage';
  showSummary?: boolean;
}

export interface EntityConfig {
  entity: string;
}
