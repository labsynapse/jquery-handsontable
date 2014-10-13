
function WalkontableRowStrategy(instance, getViewportHeight, tableParentOffset, scrollPosition, defaultRowHeight) {

  WalkontableAbstractStrategy.apply(this, arguments);

  this.rowHeightCache = [];
  this.getViewportHeight = getViewportHeight;
  this.scrollPosition = scrollPosition;
  this.defaultRowHeight = defaultRowHeight;
  this.lastRenderEnd = 0;
  this.tableParentOffset = tableParentOffset;
  this.renderStart = this.getRenderStart();
  this.viewportStart = this.getViewportStart();
  this.viewportEnd = this.getViewportEnd();
  this.renderEnd = this.getRenderEnd();
}

WalkontableRowStrategy.prototype = new WalkontableAbstractStrategy();

WalkontableRowStrategy.prototype.updateRowBoundaries = function () {
  this.renderStart = this.getRenderStart();
  this.viewportStart = this.getViewportStart();
  this.viewportEnd = this.getViewportEnd();
  this.renderEnd = this.getRenderEnd();
};

WalkontableRowStrategy.prototype.updateParameters = function(instance, getViewportHeight, tableParentOffset, scrollPosition, defaultRowHeight) {
  if(getViewportHeight != void 0) this.getViewportHeight = getViewportHeight;
  if(scrollPosition != void 0) this.scrollPosition = scrollPosition;
  if(defaultRowHeight != void 0) this.defaultRowHeight = defaultRowHeight;
  if(tableParentOffset != void 0) this.tableParentOffset = tableParentOffset;
};

WalkontableRowStrategy.prototype.cacheRenderedRowHeights = function () {
  for(var i = this.renderStart; i < this.renderEnd; i++) {

  }
};

/**
 * Returns the index of the first cell that needs to be rendered
 * @returns {number}
 */
WalkontableRowStrategy.prototype.getRenderStart = function () {
  var renderStart = 0
    , rowHeightEstimate = this.estimateAvarageRowHeight(0, this.lastRenderEnd);

  renderStart = Math.floor(this.scrollPosition / rowHeightEstimate);

  return renderStart;
};

/**
 * Returns the index of the first cell visible in the viewport
 * @returns {number}
 */
WalkontableRowStrategy.prototype.getViewportStart = function () {
 var viewportStart = 0
    , rowHeightEstimate = this.estimateAvarageRowHeight(0, this.lastRenderEnd);

  viewportStart = Math.ceil(this.scrollPosition / rowHeightEstimate);

  return viewportStart;
};

/**
 * Returns the index of the last cell that needs to be rendered
 * @returns {number}
 */
WalkontableRowStrategy.prototype.getRenderEnd = function () {
  var viewportHeight = this.getViewportHeight();
  if(viewportHeight == Infinity) {
    return Infinity;
  }

  var viewportStart = this.getViewportStart()
    , renderEnd;

  renderEnd = viewportStart + Math.ceil(viewportHeight / this.defaultRowHeight);
  this.lastRenderEnd = renderEnd;
  return renderEnd;
};

WalkontableRowStrategy.prototype.getViewportEnd = function () {

  var container = this.instance.wtTable.holder.parentNode
    , containerOffset = Handsontable.Dom.offset(container)
    , viewportEndCoords = {
    x: containerOffset.left + 2,
    y: containerOffset.top + container.clientHeight
  };
    var lastRowCoords = {
      x: viewportEndCoords.x + 2,
      y: viewportEndCoords.y - 2
    };

  var lastRowCell = document.elementFromPoint(lastRowCoords.x, lastRowCoords.y);

  return lastRowCell;
};

/**
 * Returns estimated row height in the provided range
 * @param start
 * @param end
 */
WalkontableRowStrategy.prototype.estimateAvarageRowHeight = function (start, end) {
  var sum = 0
    , avarage = 0;

  if(end == 0) end = 1;

  for(var i = start; i < end; i++) {
    if(this.rowHeightCache[i]) {
      sum += this.rowHeightCache[i];
    } else {
      sum += this.defaultRowHeight;
    }
  }

  avarage = Math.ceil(sum / end - start);

  return avarage;
};

/**
 * Checks whether the number of already rendered rows does not exceeds the number of rows visible in viewport + maximal
 * number of rows rendered above and below viewport
 * @returns {boolean}
 */
WalkontableRowStrategy.prototype.canRenderMoreRows = function () {
  return this.remainingSize <= 0 || this.cellCount - this.maxBefore - this.visiblCellCount < this.curOuts;
};

WalkontableRowStrategy.prototype.countRendered = function () {
  return this.renderEnd - this.renderStart;
}

WalkontableRowStrategy.prototype.countVisible = function () {
  return this.renderEnd - this.viewportStart;
//  return this.visiblCellCount;
};

WalkontableRowStrategy.prototype.isLastIncomplete = function () {
  var lastRow = this.instance.wtTable.getLastVisibleRow();
  var firstCol = this.instance.wtTable.getFirstVisibleColumn();
  var cell = this.instance.wtTable.getCell(new WalkontableCellCoords(lastRow, firstCol));
  var cellOffsetTop = Handsontable.Dom.offset(cell).top;
  var cellHeight = Handsontable.Dom.outerHeight(cell);
  var cellEnd = cellOffsetTop + cellHeight;

  var viewportOffsetTop = this.instance.wtScrollbars.horizontal.scrollHandler.offsetTop + this.instance.wtScrollbars.vertical.getScrollPosition();
  var viewportEnd = viewportOffsetTop + getViewportHeight();


  return viewportEnd < cellEnd;
};
