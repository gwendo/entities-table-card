/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LitElement,
  html,
  customElement,
  property,
  CSSResult,
  TemplateResult,
  css,
  PropertyValues,
  internalProperty,
} from 'lit-element';
import {ifDefined} from 'lit-html/directives/if-defined'
import {classMap} from 'lit-html/directives/class-map'
import {
  HomeAssistant,
  hasConfigOrEntityChanged,
  LovelaceCardEditor,
  getLovelace,
} from 'custom-card-helpers'; // This is a community maintained npm module with common helper functions/types
import {HassEntity} from 'home-assistant-js-websocket';
import './editor';

import type { EntitiesColumnConfig, EntitiesTableCardConfig } from './types';
import { CARD_VERSION } from './const';
import { localize } from './localize/localize';

/* eslint no-console: 0 */
console.info(
  `%c  ENTITIES-TABLE-CARD \n%c  ${localize('common.version')} ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'entities-table-card',
  name: 'Entities Table Card',
  description: 'A card to display entities in a table with attributes as columns',
});

// TODO Name your custom element
@customElement('entities-table-card')
export class EntitiesTableCard extends LitElement {
/*   public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('entities-table-card-editor');
  } */

  public static getStubConfig(): object {
    return {
      name: "My Entity Table",
      showSummary: false,
      entities: [],
      dataColumns: []
    };
  }

  // TODO Add any properities that should cause your element to re-render here
  // https://lit-element.polymer-project.org/guide/properties
  @property({ attribute: false }) public hass!: HomeAssistant;
  @internalProperty() private config!: EntitiesTableCardConfig;

  // https://lit-element.polymer-project.org/guide/properties#accessors-custom
  public setConfig(config: EntitiesTableCardConfig): void {
    // TODO Check for required fields and that they are of the proper format
    if (!config) {
      throw new Error(localize('common.invalid_configuration'));
    }


    this.config = {
      name: 'EntitiesTable',
      ...config,
    };
  }

  // https://lit-element.polymer-project.org/guide/lifecycle#shouldupdate
  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this.config) {
      return false;
    }
    return this.hasConfigOrEntityChanged(this, changedProps, false);
  }

  private hasConfigOrEntityChanged(
    element: any,
    changedProps: PropertyValues,
    forceUpdate: boolean,
  ): boolean {

    if (changedProps.has('config') || forceUpdate) {
      return true;
    }
    if (element.config!.entities) {
      const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
      if (oldHass && element.config) {
        return element.config!.entities.some( (el) => {
          return oldHass.states[el.entity].state !== element.hass!.states[el.entity].state;})
      }
      return true;
    } else {
      return false;
    }
  }

  protected render(): TemplateResult | void {
    
    return html`
      <ha-card
        .header=${this.config.name}
        tabindex="0"
        .label=${`EntitiesTable: ${this.config.entity || 'No Entity Defined'}`}
      >
      <table>
        <thead><tr>
          ${this.config.dataColumns?.map(col => {
            return html`<th class=${ifDefined(col.format)}>${col.header}</th>`
        })}
        </tr></thead>
        <tbody>
        ${this.config.entities?.map(ent => {
          const stateObj = this.hass.states[ent.entity];
          return stateObj ? this._renderEntity(stateObj) : html`<div class="not-found">Entity ${ent} not found</div>`
        })}
        ${this._renderSummary()}
        </tbody>
        </table>
      </ha-card>
    `;
  }

  private _renderSummary(): TemplateResult {
    if (this.config.dataColumns?.filter(dc => dc.showSummary) !== undefined) {
      return html`${this.config.dataColumns?.map(col => {
        if (col.showSummary) {
          const total = this.config.entities?.map(ent => this.hass.states[ent.entity].attributes[col.attr]).reduce((sum, currVal) => sum + isNaN(currVal) ? 0 : currVal)
          const classes = { summary: true, currency: true, positive: total > 0, negative: total < 0}
          return html`<td class=${classMap(classes)}>${Math.round(total).toLocaleString(navigator.language)}</td>`
        } else {
          return html`<td class="summary"></td>`
        }
      })
    }`
  }
    return html`` 
  }

  private _renderEntity(entity: HassEntity): TemplateResult {
    return html`<tr>${this.config.dataColumns?.map(col => {
      switch (col.format || 'default') {
        case 'currency':
          return this._renderCurrency(entity, col);
        case 'percentage':
          return this._renderPercentage(entity, col);
        default:
          return this._renderDefault(entity, col);
      }
    })}</tr>`
  }
  private _renderDefault(entity: HassEntity, col: EntitiesColumnConfig): TemplateResult {
    const classes = {}
    if (col.format) {
      classes[col.format] = true;
    }
    switch (col.type || 'default') {
      case 'number':
        classes['number'] = true
    }
    
    return html`<td class=${classMap(classes)} >
      ${this._getData(entity, col)}
    </td>`
  }
  private _renderPercentage(entity: HassEntity, col: EntitiesColumnConfig): TemplateResult {
    const amount = this._getData(entity, col)
    const classes = { percentage: true, positive: amount > 0, negative: amount < 0 }
    return html`<td class=${classMap(classes)}>
    ${ 
      amount.toFixed(2)
    }</td>`
  }

  private _renderCurrency(entity: HassEntity, col: EntitiesColumnConfig): TemplateResult {
    const amount = this._getData(entity, col);
    const classes = { currency: true, positive: amount > 0, negative: amount < 0 }
    return html`<td class=${classMap(classes)}>
      ${ Math.round(amount).toLocaleString(navigator.language) }
    </td>`
  }

  private _getData(entity: HassEntity, col: EntitiesColumnConfig): any {
    if (col.source === 'state') {
      if (col.type == 'number') {
        return Number(entity.state).toFixed(2)
      }
      return entity.state;
    } else {
      return entity.attributes[col.attr];
    }
  }

  
  // https://lit-element.polymer-project.org/guide/styles
  static get styles(): CSSResult {
    return css`
      table { 
        width: 95%;
        margin-left: 1rem;
        margin-right: 1rem;
      }
      thead { text-align: left}
      .currency {
          text-align: right;
      }
      .percentage {
          text-align: right;
      }
      .number {
          text-align: right;
      }
      .positive {
        color: var(--label-badge-green)
      }
      .negative {
        color: var(--label-badge-red)
      }
      .summary {
        border-top: 0.1rem solid var(--divider-color)
      }
    `;
  }
}
