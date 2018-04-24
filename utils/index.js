var numeral = require('../libs/numeral.min.js');
var Day = require('../libs/day');

const SHIPMENT_STATUS_LIST = [
  {
    code: 10,
    status: "新建"
  },
  {
    code: 20,
    status: "已确认"
  },
  {
    code: 25,
    status: "部分提货"
  },
  {
    code: 30,
    status: "已提货"
  },
  {
    code: 35,
    status: "部分到货"
  },
  {
    code: 40,
    status: "已到货"
  },
  {
    code: 45,
    status: "部分签收"
  },
  {
    code: 50,
    status: "已签收"
  },
  {
    code: 60,
    status: "已签收" // It's "已回单" in server, but display "已签收" in app
  },
  {
    code: 70,
    status: "已结算"
  },
];

export function getShipmentDisplayStatus(code) { 
  const status =  SHIPMENT_STATUS_LIST.find((x) => `${x.code}` === `${code}`);
  if (status) {
    return status.status;
  }
  return '';
}

export function isOrderComplete(statusCode) {
  if (Number(statusCode) && Number(statusCode) >= 60) {
    return true;
  }
  return false;
}

export function percentFormatter(percent) {
  if (percent) {
      return (percent * 100) + '%';
  }
  return '0%';

}

export function moneyFormatter(money) {
  if (money) {
      return numeral(money / 100).format('0,0.00');
  }
  return 0.00;
}

export function dateFormatter(date) {
  if (!date) {
    return '';
  }
  return Day(date).format('YYYY/MM/DD');
}
