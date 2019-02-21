'use strict'

const request = require('request')

const promisifiedRequest = async (options) => new Promise((resolve, reject) => request(options, (err, data) => err ? reject(err) : resolve(data)))

module.exports = class JovianXSDK {
  constructor (apiHost, vendorCompany, endCompany, accountApiKey) {
    this.apiHost = apiHost
    this.vendorCompany = vendorCompany
    this.endCompany = endCompany
    this.accountApiKey = accountApiKey
  }

  async trackEvent (event, data) {
    try {
      await promisifiedRequest({
        url: `${this.apiHost}/track_event?event=${encodeURIComponent(event)}`,
        method: 'POST',
        headers: {
          'Jx-Vendor': this.vendorCompany,
          'Authorization': 'Basic ' + Buffer.from(this.endCompany + ':' + this.accountApiKey).toString('base64'),
        },
        json: data,
      })
    } catch (err) {
      console.error('JovianXSDK: Failed to track event', err)
    }
  }
}
