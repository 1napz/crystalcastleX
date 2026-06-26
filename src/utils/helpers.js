// src/utils/helpers.js

/**
 * Utility functions for CrystalCastle
 * Reviewer cockpit ready — with config separation, safe error handling, and audit clarity
 */

import { IMAGE_CONFIG } from './constants.js';

/**
 * Debounce function
 * @param {Function} fn - function to debounce
 * @param {number} delay - delay in ms
 */
export function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Convert a byte count into a human-readable string using 1024-based units.
 * @param {number} bytes - The size in bytes.
 * @returns {string} Formatted size with up to two decimal places and unit (one of "Bytes", "KB", "MB", "GB"); returns "0 Bytes" when `bytes` is 0.
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Create a compact unique identifier string.
 * @param {string} prefix - Optional string prepended to the identifier.
 * @param {number} length - Number of characters for the random alphanumeric suffix (defaults to 9).
 * @returns {string} The identifier formed as <prefix><timestamp>-<randomSuffix>.
 */
export function generateId(prefix = '', length = 9) {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, length)}`;
}

/**
 * Check whether an uploaded image file meets configured type and size constraints.
 * @param {File} file - File object expected to contain `type` (MIME) and `size` (bytes).
 * @returns {{valid: boolean, error?: string}} `{ valid: true }` when the file's MIME type is allowed and its size is within limits; otherwise `{ valid: false, error }` with a human-readable error message explaining the rejection.
 */
export function isValidImageFile(file) {
  const { validTypes, maxSize } = IMAGE_CONFIG;

  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'กรุณาเลือกไฟล์ JPEG, PNG หรือ WEBP เท่านั้น' };
  }
  if (file.size > maxSize) {
    return { valid: false, error: 'ไฟล์ต้องไม่เกิน 6MB' };
  }
  return { valid: true };
}

/**
 * Persist a value into a per-key history in localStorage, keeping most-recent entries first and enforcing a maximum length.
 *
 * The value is stored as a JSON string and deduplicated by comparing serialized values; structurally equal values will not be added again.
 * Existing entries for the key are expected to be a JSON array of serialized values and will be read/overwritten.
 *
 * @param {string} key - localStorage key under which the history array is stored.
 * @param {any} value - Value to add to the history; it will be serialized with JSON.stringify before storage.
 * @param {number} [maxItems=50] - Maximum number of entries to retain; when exceeded, the oldest entries are removed.
 */
export function saveToHistory(key, value, maxItems = 50) {
  const saved = JSON.parse(localStorage.getItem(key) || '[]');
  const serializedValue = JSON.stringify(value);

  if (!saved.includes(serializedValue)) {
    saved.unshift(serializedValue);
    if (saved.length > maxItems) saved.pop();
    localStorage.setItem(key, JSON.stringify(saved));
  }
}

/**
 * Determines whether a value (compared by JSON serialization) already exists in a JSON array stored at the given localStorage key.
 * @param {string} key - localStorage key containing a JSON-encoded array of serialized values.
 * @param {any} value - Value to check; compared to stored entries using `JSON.stringify(value)`.
 * @returns {boolean} `true` if the serialized value is present in the stored array, `false` otherwise.
 */
export function isDuplicate(key, value) {
  const saved = JSON.parse(localStorage.getItem(key) || '[]');
  const serializedValue = JSON.stringify(value);
  return saved.includes(serializedValue);
}