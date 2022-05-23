export function createCurrencyFormatter(
  locales?: string | string[],
  currency = 'USD',
  options: Intl.NumberFormatOptions = {},
) {
  return (new Intl.NumberFormat(locales, {
    ...options,
    style: 'currency',
    currency,
  })).format;
}

export function stringify<T>(value: T) {
  return typeof value === 'object' ?
    JSON.stringify(value) :
    `${value}`;
}

export function getStringWidth(str: string, fontSize = 1) {
  const pxFontSize = 20 * fontSize;
  return str ? str.length * (pxFontSize - 10) + pxFontSize + 2 : 0;
}

export function hasWhitespaces(str: string) {
  return /\s/.test(str);
}

export function isNumber(str: string) {
  return !(hasWhitespaces(str) || isNaN(Number(str)));
}

export function toNumber<T>(str: string, fallback?: T) {
  const parsed = parseFloat(str);
  return isNaN(parsed) && fallback !== undefined ? fallback : parsed;
}

export function formatTime(seconds: number) {
  const hrs = ~~(seconds / 3600);
  const mins = ~~((seconds % 3600) / 60);
  const secs = ~~seconds % 60;

  const timestamp = [];
  if (hrs) {
    timestamp.push(hrs.toString().padStart(2, '0'));
  }
  return [
    ...timestamp,
    mins.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0'),
  ].join(':');
}
