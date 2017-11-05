
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-vr/Libraries/Pano/Prefetch.js';
var NativeMethodsMixin = require('NativeMethodsMixin');
var PropTypes = require('react/lib/ReactPropTypes');
var React = require('React');
var View = require('View');
var requireNativeComponent = require('requireNativeComponent');
var resolveAssetSource = require('resolveAssetSource');

var Prefetch = React.createClass({
  displayName: 'Prefetch',

  mixins: [NativeMethodsMixin],

  propTypes: babelHelpers.extends({}, View.propTypes, {
    source: PropTypes.oneOfType([PropTypes.shape({
      uri: PropTypes.string
    }), PropTypes.arrayOf(PropTypes.shape({
      uri: PropTypes.string
    })), PropTypes.shape({
      tile: PropTypes.string,
      maxDepth: PropTypes.number
    }), PropTypes.number])
  }),

  getDefaultProps: function getDefaultProps() {
    return {};
  },

  render: function render() {
    var props = babelHelpers.extends({}, this.props) || {};

    var source = resolveAssetSource(this.props.source);
    if (!source) {
      props.source = { uri: undefined };
    } else {
      props.source = source;
    }

    return React.createElement(
      RKPrefetch,
      babelHelpers.extends({}, props, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 72
        }
      }),
      this.props.children
    );
  }
});

var RKPrefetch = requireNativeComponent('Prefetch', Prefetch, {});

module.exports = Prefetch;