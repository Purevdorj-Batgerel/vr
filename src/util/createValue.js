export default function createValue(value, customSetValue) {
  /**
   *
   * @param {*} newValue
   */
  const setValue = newValue => {
    if (customSetValue && typeof customSetValue === 'function') {
      value = customSetValue()
    } else {
      value = newValue
    }
  }

  /**
   *
   * @returns {*} currentValue
   */
  const getValue = () => {
    return value
  }

  return [getValue, setValue]
}
