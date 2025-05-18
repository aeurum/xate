import axios from 'axios'

export default class Xate {
  #baseUrls = {
    OpenExchangeRates: 'https://openexchangerates.org/api/',
    ExchangeRateAPI: 'https://v6.exchangerate-api.com/v6/'
  }

  #base = 'USD'
  #info = {
    OpenExchangeRates: {
      supplementParams: params => params.app_id = this._id,
      endpoint: {
        info: () => 'usage.json',
        currencies: () => 'currencies.json',
        latest: () => 'latest.json',
        historical: date => `historical/${date}.json`,
      },
      baseApiUrl: () => this.#baseUrls.OpenExchangeRates
    },
    ExchangeRateAPI: {
      supplementParams: params => {
        for (const name in params) delete params[name]
      },
      endpoint: {
        info: () => 'quota',
        currencies: () => 'codes',
        latest: params => `latest/${params.base}`,
        historical: (date, params) => {
          return `history/${params.base}/${date.split('-').join('/')}`
        }
      },
      baseApiUrl: () => this.#baseUrls.ExchangeRateAPI + this._id + '/'
    }
  }

  constructor(provider, id, base) {
    this._provider = provider
    this._id = id
    this._base = base ?? this.#base
    this._info = this.#info[provider]
  }

  #daysUntilRenew(d) {
    const moment = new Date()
    let y = moment.getFullYear()
    let m = moment.getMonth()
    if (d < moment.getDate())
      if (++m > 11) y++, m = 0
    const target = new Date(y, m, d)
    return Math.ceil((target - moment) / (1000 * 60 * 60 * 24))
  }

  #supplementParams(params) {
    if (!params.base) params.base = this._base
  }
  #throwError(data) {
    switch (this._provider) {
      case 'OpenExchangeRates':
        throw data.description
      case 'ExchangeRateAPI':
        throw data['error-type']
    }
  }
  #decorateRequestsResultToReturn(result) {
    let made, left, days_until_renew
    switch (this._provider) {
      case 'OpenExchangeRates':
        const { usage } = result.data
        made = usage.requests
        left = usage.requests_remaining
        days_until_renew = usage.days_remaining
        break
      case 'ExchangeRateAPI':
        const {
          plan_quota,
          requests_remaining,
          refresh_day_of_month: day
        } = result
        made = plan_quota - requests_remaining
        left = requests_remaining
        days_until_renew = this.#daysUntilRenew(day)
        break
    }
    return { made, left, days_until_renew }
  }
  #decorateCurrenciesResultToReturn(result) {
    switch (this._provider) {
      case 'OpenExchangeRates': return result
      case 'ExchangeRateAPI':
        const { supported_codes } = result
        return Object.fromEntries(supported_codes)
    }
  }
  #decorateStandardResultToReturn(result) {
    let terms, date, base, rates
    switch (this._provider) {
      case 'OpenExchangeRates':
        ({
          license: terms,
          timestamp: date,
          base, rates
        } = result)
        break
      case 'ExchangeRateAPI':
        ({
          terms_of_use: terms,
          time_last_update_unix: date,
          base_code: base,
          conversion_rates: rates
        } = result)
        break
    }
    return { terms, date, base, rates }
  }

  async #request(endpoint, params = { }) {
    this._info.supplementParams(params)
    const apiUrl = `${this._info.baseApiUrl()}${endpoint}`
    try {
      return (await axios.get(apiUrl, { params })).data
    } catch (error) { this.#throwError(error.response.data) }
  }

  async requests() {
    const endpoint = this._info.endpoint.info()
    const result = await this.#request(endpoint, { })
    return this.#decorateRequestsResultToReturn(result)
  }
  async currencies(params = { }) {
    const endpoint = this._info.endpoint.currencies()
    const result = await this.#request(endpoint, params)
    return this.#decorateCurrenciesResultToReturn(result)
  }
  async latest(params = { }) {
    this.#supplementParams(params)
    const endpoint = this._info.endpoint.latest(params)
    const result = await this.#request(endpoint, params)
    return this.#decorateStandardResultToReturn(result)
  }
  async historical(date, params = { }) {
    this.#supplementParams(params)
    const args = [ date, params ]
    const endpoint = this._info.endpoint.historical(...args)
    const result = await this.#request(endpoint, params)
    return this.#decorateStandardResultToReturn(result)
  }
}