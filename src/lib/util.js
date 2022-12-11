/**
 * Returns a new instance of a USD currency formatter.
 * 
 * @returns {Intl.NumberFormat}
 */
export const getCurrencyFormatter = () =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
