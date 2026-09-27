/**
 * formatters.js — Pure utility functions for formatting values.
 *
 * Keep all display/formatting logic here to avoid duplication
 * across components.
 */

/**
 * Format a number as Philippine Peso currency.
 * @param {number} amount
 * @returns {string} e.g. "₱1,250.00"
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount);
}

/**
 * Format a date string or Date object to a readable format.
 * @param {string|Date} date
 * @returns {string} e.g. "July 7, 2026"
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

/**
 * Truncate a string to a max length and append ellipsis.
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(str, maxLength = 100) {
  if (!str || str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
}
