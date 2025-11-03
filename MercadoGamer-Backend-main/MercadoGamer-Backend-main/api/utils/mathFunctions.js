'use strict';

export default {
  /**
* getAvg:
* Average with one decimal, returns 0 if NaN or similar
* @param {Number} arr - Array to be iterated
*/
  getAvg(arr) {
    return (Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10) || 0
  }
}