export function generateBillNo(key) {
  return "MVR" + key + new Date().valueOf();
}
