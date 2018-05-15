import {
    URLTypes,
    buildURL,
    fetch,
} from '../../api/fetch.js';
import {
    percentFormatter,
    moneyFormatter,
} from '../../utils/index';

export function getUnconfirmInvoiceList(currentPage = 1, pageSize = 10) {
    const baseURL = `/invoices`;
    const url = buildURL(baseURL, URLTypes.MINIPROGRAM);
    return fetch(url, {
        method: 'GET',
    }).then((res) => dataFormatter(res));
};

export function confirmDriverInvoice(driverInvoiceCode, formId) {
    const url = buildURL('/invoices/confirm', URLTypes.MINIPROGRAM);
    return fetch(url, {
        method: 'PUT',
        showLoading: true,
        data: {
            driverInvoiceCode: driverInvoiceCode,
            formId: formId
        }
    });
}

function dataFormatter(response = {}) {
    const result = {};
    result.currentPage = response.currentPage || 0;
    result.totalPage = response.totalPage || 0;
    result.driverInvoices = (response.driverInvoices &&
      response.driverInvoices.map((x) => ({
            enterpriseCode: x.enterpriseCode,
            invoiceReceiverName: x.invoiceReceiverName,
            taxRate: percentFormatter(x.taxRate),
            taxAmount: moneyFormatter(x.taxAmount),
            totalAmount: moneyFormatter(x.totalAmount),
            totalAmountIncludeTax: moneyFormatter(x.totalAmountIncludeTax),
            driverInvoiceCode: x.driverInvoiceCode || '',
        }))) || [];

    return result;
}