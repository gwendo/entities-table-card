# Entities Table Card by [@gwendo](https://www.github.com/gwendo)



[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE.md)
[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)

![Project Maintenance][maintenance-shield]
[![GitHub Activity][commits-shield]][commits]


## Support

Hey dude! Help me out for a couple of :beers: or a :coffee:!

[![coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://www.buymeacoffee.com/lonneberg)

## Options

| Name              | Type    | Requirement  | Description                                 | Default             |
| ----------------- | ------- | ------------ | ------------------------------------------- | ------------------- |
| type              | string  | **Required** | `custom:entities-table-card                 |                     |
| name              | string  | **Optional** | Card name                                   | `Entity Table`      |
| showSummary       | boolean | **Optional** | Whether to show a summary of currency type attributes | `Entity Table`      |
| entities          | array   | **Optional** | List of Home Assistant entity IDs           | `none`              |
| dataColumns       | array   | **Optional** | List of Column config                       | `none`              |

## Column Config

| Name            | Type   | Requirement  | Description                                         | Default     |
| --------------- | ------ | ------------ | ----------------------------------------------      | ----------- |
| header          | string | **Required** | Column header text                                  | `more-info` |
| attr            | string | **Required** | Attribute name holding the data for the column      | `none`      |
| format          | string | **Optional** | currency or percentage or null                      | `none`      |


## Examples

### With each entity specified

``` yaml
type: 'custom:entities-table-card'
name: Portfolio
showSummary: true
entities:
  - entity: sensor.avanza_stock_513577
  - entity: sensor.avanza_stock_26607
  - entity: sensor.avanza_stock_5247
  - entity: sensor.avanza_stock_56267
 dataColumns:
  - header: Name
    attr: name
  - header: Daily
    attr: changePercent
    format: percentage
  - header: '%'
    attr: profitLossPercentage
    format: percentage
  - header: Profit/Loss
    attr: totalProfitLoss
    format: currency
  - header: Value
    attr: totalValue
    format: currency
```

### Together with auto-entities

``` yaml
type: 'custom:auto-entities'
filter:
  include:
    - entity_id: sensor.avanza_stock_*
sort:
  method: attribute
  attribute: name
card:
  type: 'custom:entities-table-card'
  name: Portfolio
  showSummary: true
  dataColumns:
    - header: Name
      attr: name
    - header: Daily
      attr: changePercent
      format: percentage
    - header: '%'
      attr: profitLossPercentage
      format: percentage
    - header: Profit/Loss
      attr: totalProfitLoss
      format: currency
    - header: Value
      attr: totalValue
      format: currency
```

[commits-shield]: https://img.shields.io/github/commit-activity/y/gwendo/entities-table-card.svg?style=for-the-badge
[commits]: https://github.com/gwendo/entities-table-card/commits/master
[license-shield]: https://img.shields.io/github/license/gwendo/entities-table-card?style=for-the-badge
[maintenance-shield]: https://img.shields.io/maintenance/yes/2021.svg?style=for-the-badge
[releases-shield]: https://img.shields.io/github/release/gwendo/entities-table-card.svg?style=for-the-badge
[releases]: https://github.com/gwendo/entities-table-card/releases
