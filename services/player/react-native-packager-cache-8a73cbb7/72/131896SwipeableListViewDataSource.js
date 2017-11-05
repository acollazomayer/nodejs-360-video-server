
'use strict';

var ListViewDataSource = require('ListViewDataSource');

var SwipeableListViewDataSource = function () {
  function SwipeableListViewDataSource(params) {
    var _this = this;

    babelHelpers.classCallCheck(this, SwipeableListViewDataSource);

    this._dataSource = new ListViewDataSource({
      getRowData: params.getRowData,
      getSectionHeaderData: params.getSectionHeaderData,
      rowHasChanged: function rowHasChanged(row1, row2) {
        return row1.id !== _this._previousOpenRowID && row2.id === _this._openRowID || row1.id === _this._previousOpenRowID && row2.id !== _this._openRowID || params.rowHasChanged(row1, row2);
      },
      sectionHeaderHasChanged: params.sectionHeaderHasChanged
    });
  }

  babelHelpers.createClass(SwipeableListViewDataSource, [{
    key: 'cloneWithRowsAndSections',
    value: function cloneWithRowsAndSections(dataBlob, sectionIdentities, rowIdentities) {
      this._dataSource = this._dataSource.cloneWithRowsAndSections(dataBlob, sectionIdentities, rowIdentities);

      this._dataBlob = dataBlob;
      this.rowIdentities = this._dataSource.rowIdentities;
      this.sectionIdentities = this._dataSource.sectionIdentities;

      return this;
    }
  }, {
    key: 'getDataSource',
    value: function getDataSource() {
      return this._dataSource;
    }
  }, {
    key: 'getOpenRowID',
    value: function getOpenRowID() {
      return this._openRowID;
    }
  }, {
    key: 'getFirstRowID',
    value: function getFirstRowID() {
      if (this.rowIdentities) {
        return this.rowIdentities[0] && this.rowIdentities[0][0];
      }
      return Object.keys(this._dataBlob)[0];
    }
  }, {
    key: 'setOpenRowID',
    value: function setOpenRowID(rowID) {
      this._previousOpenRowID = this._openRowID;
      this._openRowID = rowID;

      this._dataSource = this._dataSource.cloneWithRowsAndSections(this._dataBlob, this.sectionIdentities, this.rowIdentities);

      return this;
    }
  }]);
  return SwipeableListViewDataSource;
}();

module.exports = SwipeableListViewDataSource;