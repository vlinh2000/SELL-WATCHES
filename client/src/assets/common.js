export function getTotalPrice(list, fieldName, secondField) { // secondField using for multiple field 2
    return list.reduce((a, b) => a + b[fieldName] * (b[secondField] || 1), 0) || 0;
}