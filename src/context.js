class Context {

  // construct a new context with atomic definition, groups are like layers (an array of subcontext definitions)
  constructor() {
    this.definition = {
      stroke: null,
      lines: [],
      groups: []
    };
  }

  // clone a context
  static clone(ctx) {
    const copy = new this();
    copy.definition = JSON.parse(JSON.stringify(ctx.definition));
    return copy;
  }

  // safely include a draft function and pass it a clone of the context, expect it to return a context
  static include(func) {
    const cls = this;
    this.prototype[func.name] = function(...args) {
      const c = cls.clone(this);
      return func(c, ...args);
    }
  }
};


// implement a context (and in the future validate interface)
function implement(...methods) {
  class Generatred extends Context {};
  for (const m of methods) {
    Generatred.include(m);
  }
  return Generatred
}


export {
  Context,
  implement
};
