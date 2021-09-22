import { VisibleError } from '../errors/VisibleError.js';

export function checkNotNull(fieldsAndValues) {
  const missing = [];
  Object.entries(fieldsAndValues).forEach((entry) => {
    if (entry[1] === undefined) { missing.push(entry[0]); }
  });
  if (missing.length > 0) {
    throw new VisibleError(200, `Missing fields: ${missing}`);
  }
}
