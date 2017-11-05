

'use strict';

var Platform = {
  OS: 'vr',
  select: function select(obj) {
    return 'vr' in obj ? obj.vr : obj.default;
  }
};

module.exports = Platform;