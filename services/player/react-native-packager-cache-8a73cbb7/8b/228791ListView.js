
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-native/Libraries/CustomComponents/ListView/ListView.js';
var ListViewDataSource = require('ListViewDataSource');
var React = require('React');
var ReactNative = require('ReactNative');
var RCTScrollViewManager = require('NativeModules').ScrollViewManager;
var ScrollView = require('ScrollView');
var ScrollResponder = require('ScrollResponder');
var StaticRenderer = require('StaticRenderer');
var TimerMixin = require('react-timer-mixin');

var cloneReferencedElement = require('react-clone-referenced-element');
var isEmpty = require('isEmpty');
var merge = require('merge');

var PropTypes = React.PropTypes;

var DEFAULT_PAGE_SIZE = 1;
var DEFAULT_INITIAL_ROWS = 10;
var DEFAULT_SCROLL_RENDER_AHEAD = 1000;
var DEFAULT_END_REACHED_THRESHOLD = 1000;
var DEFAULT_SCROLL_CALLBACK_THROTTLE = 50;

var ListView = React.createClass({
  displayName: 'ListView',

  _childFrames: [],
  _sentEndForContentLength: null,
  _scrollComponent: null,
  _prevRenderedRowsCount: 0,
  _visibleRows: {},
  scrollProperties: {},

  mixins: [ScrollResponder.Mixin, TimerMixin],

  statics: {
    DataSource: ListViewDataSource
  },

  propTypes: babelHelpers.extends({}, ScrollView.propTypes, {
    dataSource: PropTypes.instanceOf(ListViewDataSource).isRequired,

    renderSeparator: PropTypes.func,

    renderRow: PropTypes.func.isRequired,

    initialListSize: PropTypes.number.isRequired,

    onEndReached: PropTypes.func,

    onEndReachedThreshold: PropTypes.number.isRequired,

    pageSize: PropTypes.number.isRequired,

    renderFooter: PropTypes.func,
    renderHeader: PropTypes.func,

    renderSectionHeader: PropTypes.func,

    renderScrollComponent: React.PropTypes.func.isRequired,

    scrollRenderAheadDistance: React.PropTypes.number.isRequired,

    onChangeVisibleRows: React.PropTypes.func,

    removeClippedSubviews: React.PropTypes.bool,

    stickySectionHeadersEnabled: React.PropTypes.bool,

    stickyHeaderIndices: PropTypes.arrayOf(PropTypes.number).isRequired,

    enableEmptySections: PropTypes.bool
  }),

  getMetrics: function getMetrics() {
    return {
      contentLength: this.scrollProperties.contentLength,
      totalRows: this.props.enableEmptySections ? this.props.dataSource.getRowAndSectionCount() : this.props.dataSource.getRowCount(),
      renderedRows: this.state.curRenderedRowsCount,
      visibleRows: Object.keys(this._visibleRows).length
    };
  },

  getScrollResponder: function getScrollResponder() {
    if (this._scrollComponent && this._scrollComponent.getScrollResponder) {
      return this._scrollComponent.getScrollResponder();
    }
  },

  getScrollableNode: function getScrollableNode() {
    if (this._scrollComponent && this._scrollComponent.getScrollableNode) {
      return this._scrollComponent.getScrollableNode();
    } else {
      return ReactNative.findNodeHandle(this._scrollComponent);
    }
  },

  scrollTo: function scrollTo() {
    if (this._scrollComponent && this._scrollComponent.scrollTo) {
      var _scrollComponent;

      (_scrollComponent = this._scrollComponent).scrollTo.apply(_scrollComponent, arguments);
    }
  },

  scrollToEnd: function scrollToEnd(options) {
    if (this._scrollComponent) {
      if (this._scrollComponent.scrollToEnd) {
        this._scrollComponent.scrollToEnd(options);
      } else {
        console.warn('The scroll component used by the ListView does not support ' + 'scrollToEnd. Check the renderScrollComponent prop of your ListView.');
      }
    }
  },

  setNativeProps: function setNativeProps(props) {
    if (this._scrollComponent) {
      this._scrollComponent.setNativeProps(props);
    }
  },

  getDefaultProps: function getDefaultProps() {
    return {
      initialListSize: DEFAULT_INITIAL_ROWS,
      pageSize: DEFAULT_PAGE_SIZE,
      renderScrollComponent: function renderScrollComponent(props) {
        return React.createElement(ScrollView, babelHelpers.extends({}, props, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 329
          }
        }));
      },
      scrollRenderAheadDistance: DEFAULT_SCROLL_RENDER_AHEAD,
      onEndReachedThreshold: DEFAULT_END_REACHED_THRESHOLD,
      stickySectionHeadersEnabled: true,
      stickyHeaderIndices: []
    };
  },

  getInitialState: function getInitialState() {
    return {
      curRenderedRowsCount: this.props.initialListSize,
      highlightedRow: {}
    };
  },

  getInnerViewNode: function getInnerViewNode() {
    return this._scrollComponent.getInnerViewNode();
  },

  componentWillMount: function componentWillMount() {
    this.scrollProperties = {
      visibleLength: null,
      contentLength: null,
      offset: 0
    };
    this._childFrames = [];
    this._visibleRows = {};
    this._prevRenderedRowsCount = 0;
    this._sentEndForContentLength = null;
  },

  componentDidMount: function componentDidMount() {
    var _this = this;

    this.requestAnimationFrame(function () {
      _this._measureAndUpdateScrollProps();
    });
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var _this2 = this;

    if (this.props.dataSource !== nextProps.dataSource || this.props.initialListSize !== nextProps.initialListSize) {
      this.setState(function (state, props) {
        _this2._prevRenderedRowsCount = 0;
        return {
          curRenderedRowsCount: Math.min(Math.max(state.curRenderedRowsCount, props.initialListSize), props.enableEmptySections ? props.dataSource.getRowAndSectionCount() : props.dataSource.getRowCount())
        };
      }, function () {
        return _this2._renderMoreRowsIfNeeded();
      });
    }
  },

  componentDidUpdate: function componentDidUpdate() {
    var _this3 = this;

    this.requestAnimationFrame(function () {
      _this3._measureAndUpdateScrollProps();
    });
  },

  _onRowHighlighted: function _onRowHighlighted(sectionID, rowID) {
    this.setState({ highlightedRow: { sectionID: sectionID, rowID: rowID } });
  },

  render: function render() {
    var bodyComponents = [];

    var dataSource = this.props.dataSource;
    var allRowIDs = dataSource.rowIdentities;
    var rowCount = 0;
    var stickySectionHeaderIndices = [];

    var header = this.props.renderHeader && this.props.renderHeader();
    var footer = this.props.renderFooter && this.props.renderFooter();
    var totalIndex = header ? 1 : 0;

    for (var sectionIdx = 0; sectionIdx < allRowIDs.length; sectionIdx++) {
      var sectionID = dataSource.sectionIdentities[sectionIdx];
      var rowIDs = allRowIDs[sectionIdx];
      if (rowIDs.length === 0) {
        if (this.props.enableEmptySections === undefined) {
          var warning = require('fbjs/lib/warning');
          warning(false, 'In next release empty section headers will be rendered.' + ' In this release you can use \'enableEmptySections\' flag to render empty section headers.');
          continue;
        } else {
          var invariant = require('fbjs/lib/invariant');
          invariant(this.props.enableEmptySections, 'In next release \'enableEmptySections\' flag will be deprecated, empty section headers will always be rendered.' + ' If empty section headers are not desirable their indices should be excluded from sectionIDs object.' + ' In this release \'enableEmptySections\' may only have value \'true\' to allow empty section headers rendering.');
        }
      }

      if (this.props.renderSectionHeader) {
        var shouldUpdateHeader = rowCount >= this._prevRenderedRowsCount && dataSource.sectionHeaderShouldUpdate(sectionIdx);
        bodyComponents.push(React.createElement(StaticRenderer, {
          key: 's_' + sectionID,
          shouldUpdate: !!shouldUpdateHeader,
          render: this.props.renderSectionHeader.bind(null, dataSource.getSectionHeaderData(sectionIdx), sectionID),
          __source: {
            fileName: _jsxFileName,
            lineNumber: 432
          }
        }));
        if (this.props.stickySectionHeadersEnabled) {
          stickySectionHeaderIndices.push(totalIndex++);
        }
      }

      for (var rowIdx = 0; rowIdx < rowIDs.length; rowIdx++) {
        var rowID = rowIDs[rowIdx];
        var comboID = sectionID + '_' + rowID;
        var shouldUpdateRow = rowCount >= this._prevRenderedRowsCount && dataSource.rowShouldUpdate(sectionIdx, rowIdx);
        var row = React.createElement(StaticRenderer, {
          key: 'r_' + comboID,
          shouldUpdate: !!shouldUpdateRow,
          render: this.props.renderRow.bind(null, dataSource.getRowData(sectionIdx, rowIdx), sectionID, rowID, this._onRowHighlighted),
          __source: {
            fileName: _jsxFileName,
            lineNumber: 453
          }
        });
        bodyComponents.push(row);
        totalIndex++;

        if (this.props.renderSeparator && (rowIdx !== rowIDs.length - 1 || sectionIdx === allRowIDs.length - 1)) {
          var adjacentRowHighlighted = this.state.highlightedRow.sectionID === sectionID && (this.state.highlightedRow.rowID === rowID || this.state.highlightedRow.rowID === rowIDs[rowIdx + 1]);
          var separator = this.props.renderSeparator(sectionID, rowID, adjacentRowHighlighted);
          if (separator) {
            bodyComponents.push(separator);
            totalIndex++;
          }
        }
        if (++rowCount === this.state.curRenderedRowsCount) {
          break;
        }
      }
      if (rowCount >= this.state.curRenderedRowsCount) {
        break;
      }
    }

    var _props = this.props,
        renderScrollComponent = _props.renderScrollComponent,
        props = babelHelpers.objectWithoutProperties(_props, ['renderScrollComponent']);

    if (!props.scrollEventThrottle) {
      props.scrollEventThrottle = DEFAULT_SCROLL_CALLBACK_THROTTLE;
    }
    if (props.removeClippedSubviews === undefined) {
      props.removeClippedSubviews = true;
    }
    babelHelpers.extends(props, {
      onScroll: this._onScroll,
      stickyHeaderIndices: this.props.stickyHeaderIndices.concat(stickySectionHeaderIndices),

      onKeyboardWillShow: undefined,
      onKeyboardWillHide: undefined,
      onKeyboardDidShow: undefined,
      onKeyboardDidHide: undefined
    });

    return cloneReferencedElement(renderScrollComponent(props), {
      ref: this._setScrollComponentRef,
      onContentSizeChange: this._onContentSizeChange,
      onLayout: this._onLayout
    }, header, bodyComponents, footer);
  },

  _measureAndUpdateScrollProps: function _measureAndUpdateScrollProps() {
    var scrollComponent = this.getScrollResponder();
    if (!scrollComponent || !scrollComponent.getInnerViewNode) {
      return;
    }

    RCTScrollViewManager && RCTScrollViewManager.calculateChildFrames && RCTScrollViewManager.calculateChildFrames(ReactNative.findNodeHandle(scrollComponent), this._updateVisibleRows);
  },

  _setScrollComponentRef: function _setScrollComponentRef(scrollComponent) {
    this._scrollComponent = scrollComponent;
  },

  _onContentSizeChange: function _onContentSizeChange(width, height) {
    var contentLength = !this.props.horizontal ? height : width;
    if (contentLength !== this.scrollProperties.contentLength) {
      this.scrollProperties.contentLength = contentLength;
      this._updateVisibleRows();
      this._renderMoreRowsIfNeeded();
    }
    this.props.onContentSizeChange && this.props.onContentSizeChange(width, height);
  },

  _onLayout: function _onLayout(event) {
    var _event$nativeEvent$la = event.nativeEvent.layout,
        width = _event$nativeEvent$la.width,
        height = _event$nativeEvent$la.height;

    var visibleLength = !this.props.horizontal ? height : width;
    if (visibleLength !== this.scrollProperties.visibleLength) {
      this.scrollProperties.visibleLength = visibleLength;
      this._updateVisibleRows();
      this._renderMoreRowsIfNeeded();
    }
    this.props.onLayout && this.props.onLayout(event);
  },

  _maybeCallOnEndReached: function _maybeCallOnEndReached(event) {
    if (this.props.onEndReached && this.scrollProperties.contentLength !== this._sentEndForContentLength && this._getDistanceFromEnd(this.scrollProperties) < this.props.onEndReachedThreshold && this.state.curRenderedRowsCount === (this.props.enableEmptySections ? this.props.dataSource.getRowAndSectionCount() : this.props.dataSource.getRowCount())) {
      this._sentEndForContentLength = this.scrollProperties.contentLength;
      this.props.onEndReached(event);
      return true;
    }
    return false;
  },

  _renderMoreRowsIfNeeded: function _renderMoreRowsIfNeeded() {
    if (this.scrollProperties.contentLength === null || this.scrollProperties.visibleLength === null || this.state.curRenderedRowsCount === (this.props.enableEmptySections ? this.props.dataSource.getRowAndSectionCount() : this.props.dataSource.getRowCount())) {
      this._maybeCallOnEndReached();
      return;
    }

    var distanceFromEnd = this._getDistanceFromEnd(this.scrollProperties);
    if (distanceFromEnd < this.props.scrollRenderAheadDistance) {
      this._pageInNewRows();
    }
  },

  _pageInNewRows: function _pageInNewRows() {
    var _this4 = this;

    this.setState(function (state, props) {
      var rowsToRender = Math.min(state.curRenderedRowsCount + props.pageSize, props.enableEmptySections ? props.dataSource.getRowAndSectionCount() : props.dataSource.getRowCount());
      _this4._prevRenderedRowsCount = state.curRenderedRowsCount;
      return {
        curRenderedRowsCount: rowsToRender
      };
    }, function () {
      _this4._measureAndUpdateScrollProps();
      _this4._prevRenderedRowsCount = _this4.state.curRenderedRowsCount;
    });
  },

  _getDistanceFromEnd: function _getDistanceFromEnd(scrollProperties) {
    return scrollProperties.contentLength - scrollProperties.visibleLength - scrollProperties.offset;
  },

  _updateVisibleRows: function _updateVisibleRows(updatedFrames) {
    var _this5 = this;

    if (!this.props.onChangeVisibleRows) {
      return;
    }
    if (updatedFrames) {
      updatedFrames.forEach(function (newFrame) {
        _this5._childFrames[newFrame.index] = merge(newFrame);
      });
    }
    var isVertical = !this.props.horizontal;
    var dataSource = this.props.dataSource;
    var visibleMin = this.scrollProperties.offset;
    var visibleMax = visibleMin + this.scrollProperties.visibleLength;
    var allRowIDs = dataSource.rowIdentities;

    var header = this.props.renderHeader && this.props.renderHeader();
    var totalIndex = header ? 1 : 0;
    var visibilityChanged = false;
    var changedRows = {};
    for (var sectionIdx = 0; sectionIdx < allRowIDs.length; sectionIdx++) {
      var rowIDs = allRowIDs[sectionIdx];
      if (rowIDs.length === 0) {
        continue;
      }
      var sectionID = dataSource.sectionIdentities[sectionIdx];
      if (this.props.renderSectionHeader) {
        totalIndex++;
      }
      var visibleSection = this._visibleRows[sectionID];
      if (!visibleSection) {
        visibleSection = {};
      }
      for (var rowIdx = 0; rowIdx < rowIDs.length; rowIdx++) {
        var rowID = rowIDs[rowIdx];
        var frame = this._childFrames[totalIndex];
        totalIndex++;
        if (this.props.renderSeparator && (rowIdx !== rowIDs.length - 1 || sectionIdx === allRowIDs.length - 1)) {
          totalIndex++;
        }
        if (!frame) {
          break;
        }
        var rowVisible = visibleSection[rowID];
        var min = isVertical ? frame.y : frame.x;
        var max = min + (isVertical ? frame.height : frame.width);
        if (!min && !max || min === max) {
          break;
        }
        if (min > visibleMax || max < visibleMin) {
          if (rowVisible) {
            visibilityChanged = true;
            delete visibleSection[rowID];
            if (!changedRows[sectionID]) {
              changedRows[sectionID] = {};
            }
            changedRows[sectionID][rowID] = false;
          }
        } else if (!rowVisible) {
          visibilityChanged = true;
          visibleSection[rowID] = true;
          if (!changedRows[sectionID]) {
            changedRows[sectionID] = {};
          }
          changedRows[sectionID][rowID] = true;
        }
      }
      if (!isEmpty(visibleSection)) {
        this._visibleRows[sectionID] = visibleSection;
      } else if (this._visibleRows[sectionID]) {
        delete this._visibleRows[sectionID];
      }
    }
    visibilityChanged && this.props.onChangeVisibleRows(this._visibleRows, changedRows);
  },

  _onScroll: function _onScroll(e) {
    var isVertical = !this.props.horizontal;
    this.scrollProperties.visibleLength = e.nativeEvent.layoutMeasurement[isVertical ? 'height' : 'width'];
    this.scrollProperties.contentLength = e.nativeEvent.contentSize[isVertical ? 'height' : 'width'];
    this.scrollProperties.offset = e.nativeEvent.contentOffset[isVertical ? 'y' : 'x'];
    this._updateVisibleRows(e.nativeEvent.updatedChildFrames);
    if (!this._maybeCallOnEndReached(e)) {
      this._renderMoreRowsIfNeeded();
    }

    if (this.props.onEndReached && this._getDistanceFromEnd(this.scrollProperties) > this.props.onEndReachedThreshold) {
      this._sentEndForContentLength = null;
    }

    this.props.onScroll && this.props.onScroll(e);
  }
});

module.exports = ListView;