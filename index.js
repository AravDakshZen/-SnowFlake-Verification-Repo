/**
 * SnowFlake end-to-end verification file
 * -------------------------------------
 * This file contains INTENTIONAL bugs so you can verify that SnowFlake's
 * repo-monitoring workflow works correctly:
 *
 *   1. Create an automation event targeting this repo
 *   2. SnowFlake fetches the latest commit, runs AI analysis
 *   3. It detects the errors below, displays them, and generates a fix patch
 *
 * Upload this file to a GitHub repo (e.g. snowflake-test), connect that repo
 * in Settings → GitHub, create an event with "Run analysis immediately" on,
 * and watch the investigation feed. Expected findings:
 *
 *   Bug A — TypeError: user is null            (products.js caller)
 *   Bug B — ReferenceError: price is not defined
 *   Bug C — NaN result in the discount helper
 */

// ── Bug A: calling .name on a null user ────────────────────────────────────
export function getDisplayName(user) {
  if (!user) {
    return 'Unknown User';
  }
  return `${user.name || 'Unknown'} (${user.email || 'No Email'})`;
}

// ── Bug B: using an undefined variable ────────────────────────────────────
export function checkoutTotal(cart) {
  if (!cart || !Array.isArray(cart)) {
    return 0;
  }
  let total = 0;
  for (const item of cart) {
    if (!item) continue;
    const quantity = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    total += quantity * price;
  }
  return total;
}

// ── Bug C: silent NaN from an undefined config field ──────────────────────
export function applyDiscount(amount, discountPercent) {
  const settings = { tax: 0.05 };
  const numericAmount = Number(amount) || 0;
  const numericDiscountPercent = Number(discountPercent) || 0;
  const discount = numericAmount * (numericDiscountPercent / 100) * (settings.tax || 0);
  return numericAmount - discount;
}

// ── Bug D: wrong comparison operator ──────────────────────────────────────
export function isEligible(age) {
  const numericAge = Number(age) || 0;
  if (numericAge >= 18) {
    return 'eligible';
  }
  return 'not eligible';
}

// Self-check — run `node index.js` to see every bug fire.
import { pathToFileURL } from 'node:url';

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    getDisplayName(null); // throws → "uncaught"
  } catch (e) {
    console.error('Bug A confirmed:', e.message);
  }
  try {
    checkoutTotal([{ quantity: 2 }]); // throws → ReferenceError
  } catch (e) { 
    console.error('Bug B confirmed:', e.message);
  }
  console.log('Bug C output:', applyDiscount('100', 10)); // NaN
  console.log('Bug D output:', isEligible(16)); // 'eligible' (wrong!)
}