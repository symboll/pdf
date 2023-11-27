const pattern = {
    customer: /^CustPO-[A-Z0-9]+/,
    order: /^\d{8}$/,
    delivery: /^\d{6}$/,
    multiple: /\d{4}-\d{2}-\d{6}-\d{2}-\d{2}$/,
    product: /(\d{8})(\d+\.000)(\d{4}-\d{2}-\d{2})(\d{4}-\d{2}-\d{2})/,
}
module.exports = pattern