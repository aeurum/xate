# Xate
Xate can help you access different exchange rate APIs.

## Installation
```
npm i xate
```

## Supported APIs
+ [Open Exchange Rates](https://openexchangerates.org/)
+ [Exchange Rate API](https://exchangerate-api.com/)

## Usage
```
const Xate = require('xate')
// import Xate from 'xate'

const provider = 'ExchangeRateAPI'
const apiKey = '0a1b2c3d4e5f6g7h8i9j'
const xate = new Xate(provider, apiKey)
```

## API

### Constructor
`Xate(provider, api_key, base)` constructor returns a new Xate instance.

#### Parameters
| Parameter | Type | Necessity | Description | Default |
| --- | --- | --- | --- | --- |
| provider | String | **Required** | API provider | ⸻ |
| api_key | String | **Required** | API key | ⸻ |
| base | String | Optional | Default base currency | USD |

### Types

#### Currencies
| Key | Value |
| --- | --- |
| Currency code | Currency name |

#### Rates
| Key | Value |
| --- | --- |
| Currency code | Currency exchange rate |

### Methods

#### Requests
`xate.requests()` returns usage statistics.

##### Response
| Property | Type | Description |
| --- | --- | --- |
| made | Number | Number of requests made |
| left | Number | Number of requests left |
| days_until_renew | Number | Number of days until quota gets renewed |

#### Currencies
`xate.currencies()` returns a list of supported currencies.

#### Parameters
| Parameter | Type | Necessity | Description | Default |
| --- | --- | --- | --- | --- |
| show_inactive | Boolean | Optional | Pass _True_ to include historical/inactive currencies (OpenExchangeRates only) | _False_ |
| show_alternative | Boolean | Optional | Pass _True_ to extend returned values with alternative, black market, and digital currency rates (OpenExchangeRates only) | _False_ |

#### Latest Rates
`xate.latest([ parameters ])` returns latest rates.

#### Parameters
| Parameter | Type | Necessity | Description | Default |
| --- | --- | --- | --- | --- |
| base | String | Optional | Base currency | USD |
| show_alternative | Boolean | Optional | Pass _True_ to extend returned values with alternative, black market, and digital currency rates (OpenExchangeRates only) | _False_ |

##### Response
| Property | Type | Description |
| --- | --- | --- |
| terms | String | Link to the terms of use |
| date | Number | Unix timestamp |
| base | String | Base currency |
| rates | Rates | Exchange rates |

#### Historical Rates
`xate.historical(date, [ parameters ])` returns historical rates for the requested date in YYYY-MM-DD format.

#### Parameters
| Parameter | Type | Necessity | Description | Default |
| --- | --- | --- | --- | --- |
| base | String | Optional | Base currency | USD |
| show_alternative | Boolean | Optional | Pass _True_ to extend returned values with alternative, black market, and digital currency rates (OpenExchangeRates only) | False |

##### Response
| Property | Type | Description |
| --- | --- | --- |
| terms | String | Link to the terms of use |
| date | Number | Unix timestamp |
| base | String | Base currency |
| rates | Rates | Exchange rates |

## Contributing
Contributions are only allowed in TON:
```
UQCYqT9-ycmXE3o57Cac1sM5ntIKdjqIwP3kzWmiZik0VU_b
```