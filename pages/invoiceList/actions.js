import {
    URLTypes,
    buildURL,
    fetch,
} from '../../api/fetch.js';
var numeral = require('../../libs/numeral.min.js');

export function getUnconfirmInvoiceList(currentPage = 1, pageSize = 10) {
    const baseURL = `/app-driver-invoices/unconfirm?PageSize=${pageSize}&CurrentPage=${currentPage}`;
    const url = buildURL(baseURL, URLTypes.TRADE);
    return fetch(url, {
        method: 'GET',
    });
};

export function getConfirmedInvoiceList(currentPage = 1, pageSize = 10) {
    const baseURL = `/app-driver-invoices/confirmed?PageSize=${pageSize}&CurrentPage=${currentPage}`;
    const url = buildURL(baseURL, URLTypes.TRADE);
    return fetch(url, {
        method: 'GET',
    }).then((res) => dataFormatter(res));
};

function percentFormatter(percent) {
    if (percent) {
        return (percent * 100) + '%';
    }
    return '0%';

}

function moneyFormatter(money) {
    if (money) {
        return numeral(money / 100).format('0,0.00');
    }
    return 0.00;
}

function dataFormatter(response = {}) {
    const result = {};
    result.currentPage = response.currentPage || 0;
    result.totalPage = response.totalPage || 0;
    result.modelList = (response.modelList &&
        response.modelList.map((x) => ({
            invoiceReceiverName: x.invoiceReceiverName,
            taxRate: percentFormatter(x.taxRate),
            taxAmount: moneyFormatter(x.taxAmount),
            totalAmount: moneyFormatter(x.totalAmount),
            totalAmountIncludeTax: moneyFormatter(x.totalAmountIncludeTax),
            driverInvoiceCode: x.driverInvoiceCode || '',
        }))) || [];

    return result;
}