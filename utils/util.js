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
    status: "已签收"
  },
  {
    code: 70,
    status: "已结算"
  },
];

export function getStatusDisplay(code) { 
  const status =  SHIPMENT_STATUS_LIST.find((x) => `${x.code}` === `${code}`);
  if (status) {
    return status.status;
  }
  return '';
}
