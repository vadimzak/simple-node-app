'use strict'

const request = require('request')

const promisifiedRequest = async (options) => new Promise((resolve, reject) => request(options, (err, data) => err ? reject(err) : resolve(data)))

module.exports = class JovianXSDK {
  constructor (apiBaseUrl, endCompany, accountApiKey) {
    this.apiBaseUrl = apiBaseUrl
    this.endCompany = endCompany
    this.accountApiKey = accountApiKey
  }

  async trackEvent (event, data) {
    await promisifiedRequest({
      url: `${this.apiBaseUrl}/track_event?event=${encodeURIComponent(event)}`,
      method: 'POST',
      headers: {
        'Jx-Vendor': 'tufin',
        'Authorization': 'Basic ' + Buffer.from(this.endCompany + ':' + this.accountApiKey).toString('base64'),
      },
      json: data,
    })
  }
}
