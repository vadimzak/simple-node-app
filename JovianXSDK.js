'use strict'

const request = require('request')

const promisifiedRequest = async (options) => new Promise((resolve, reject) => request(options, (err, data) => err ? reject(err) : resolve(data)))

module.exports = class JovianXSDK {

  constructor (endCompany, accountApiKey) {
    this.endCompany = endCompany
    this.accountApiKey = accountApiKey
  }

  async trackEvent (event, data) {
    await promisifiedRequest({
      url: `http://dev.app.jovianx.com:3000/api/v1/track_event?event=${encodeURIComponent(event)}`,
      method: 'POST',
      headers: {
        'Jx-Vendor': 'tufin',
        'Authorization': 'Basic ' + Buffer.from(this.endCompany + ':' + this.accountApiKey).toString('base64'),
      },
      json: data,
    })
  }
}
