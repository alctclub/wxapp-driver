//提货 到货 回单
import fetch from './fetch.js';

export default event = (data) => {
  return fetch('/app-shipments/events', {
    urlType: 'trade',
    method: 'PUT',
    data: {
      shipmentCode: data.shipmentCode,
      orderCode: data.orderCode,
      enterpriseCode: data.enterpriseCode,
      latitudeValue: data.latitudeValue,
      longitudeValue: data.longitudeValue,
      location: data.location,
      time: new Date().toISOString(),
      statusCode: data.statusCode,
    }
  })
}