/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  const object = {};
  object.width = width;
  object.height = height;
  object.getArea = () => width * height;
  return object;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const object = Object.create(proto);
  Object.assign(object, JSON.parse(json));
  return object;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
const cssSelectorBuilder = {
  countErrText: 'Element, id and pseudo-element should not occur more then one time inside the selector',
  orderErrText: 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',

  element(value) {
    if (this.elVal) throw new Error(this.countErrText);
    if (this.idVal) throw new Error(this.orderErrText);
    const obj = { ...this };
    if (!obj.elVal) {
      obj.elVal = value;
    } else {
      obj.elVal += value;
    }
    return obj;
  },

  id(value) {
    if (this.idVal) throw new Error(this.countErrText);
    if (this.classVal || this.pseudoEl) throw new Error(this.orderErrText);
    const obj = { ...this };
    if (!obj.idVal) {
      obj.idVal = `#${value}`;
    } else {
      obj.idVal += `#${value}`;
    }
    return obj;
  },

  class(value) {
    if (this.attrVal) throw new Error(this.orderErrText);
    const obj = { ...this };
    if (!obj.classVal) {
      obj.classVal = `.${value}`;
    } else {
      obj.classVal += `.${value}`;
    }
    return obj;
  },

  attr(value) {
    if (this.pseudoCl) throw new Error(this.orderErrText);
    const obj = { ...this };
    if (!obj.attrVal) {
      obj.attrVal = `[${value}]`;
    } else {
      obj.attrVal += `[${value}]`;
    }
    return obj;
  },

  pseudoClass(value) {
    if (this.pseudoEl) throw new Error(this.orderErrText);
    const obj = { ...this };
    if (!obj.pseudoCl) {
      obj.pseudoCl = `:${value}`;
    } else {
      obj.pseudoCl += `:${value}`;
    }
    return obj;
  },

  pseudoElement(value) {
    if (this.pseudoEl) throw new Error(this.countErrText);
    const obj = { ...this };
    if (!obj.pseudoEl) {
      obj.pseudoEl = `::${value}`;
    } else {
      obj.pseudoEl += `::${value}`;
    }
    return obj;
  },

  combine(selector1, combinator, selector2) {
    const obj = { ...this };
    const value = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    if (!obj.value) {
      obj.value = value;
    } else {
      obj.value += value;
    }
    return obj;
  },

  stringify() {
    if (this.value) return this.value;
    let res = '';
    if (this.elVal) res += this.elVal;
    if (this.idVal) res += this.idVal;
    if (this.classVal) res += this.classVal;
    if (this.attrVal) res += this.attrVal;
    if (this.pseudoCl) res += this.pseudoCl;
    if (this.pseudoEl) res += this.pseudoEl;
    return res;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
