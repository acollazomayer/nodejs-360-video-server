
'use strict';

var React = require('React');

var StaticRenderer = function (_React$Component) {
  babelHelpers.inherits(StaticRenderer, _React$Component);

  function StaticRenderer() {
    babelHelpers.classCallCheck(this, StaticRenderer);
    return babelHelpers.possibleConstructorReturn(this, (StaticRenderer.__proto__ || Object.getPrototypeOf(StaticRenderer)).apply(this, arguments));
  }

  babelHelpers.createClass(StaticRenderer, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.shouldUpdate;
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.render();
    }
  }]);
  return StaticRenderer;
}(React.Component);

StaticRenderer.propTypes = {
  shouldUpdate: React.PropTypes.bool.isRequired,
  render: React.PropTypes.func.isRequired
};


module.exports = StaticRenderer;