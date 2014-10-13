describe('WalkontableRowStrategy', function () {
  var source
    , $container
    , $table
    , fakeWalkontableInstance;


  function allCells25(i) {
    if (source[i] !== void 0) {
      return 25;
    }
  }

  function allCellsPlus100(i) {
    if (source[i] !== void 0) {
      return i + 100;
    }
  }

  function getViewportHeight() {
    return 100;
  }

  beforeEach(function () {
    $container = $('<div></div>').css({'overflow': 'auto', width: 260, height: 201});
    $table = $('<table></table>'); //create a table that is not attached to document
    $container.append($table).appendTo('body');

    fakeWalkontableInstance = {
      getSetting : function(){},
      wtTable: {
        holder: $table[0]
      }
    };
  });

  afterEach(function () {

    $('.wtHolder').remove();
    $container.remove();
    fakeWalkontableInstance = void 0;
  });

  it("should calculate the first row to render, guessing by the scrollbar position", function () {
    var tableParentOffset = 0
      , scrollPosition = 0
      , defaultRowHeight = 23;

    var strategy = new WalkontableRowStrategy(fakeWalkontableInstance, getViewportHeight, tableParentOffset, scrollPosition, defaultRowHeight);

    expect(strategy.renderStart).toEqual(0);

    scrollPosition = 100;

    strategy.updateParameters(null,null,null,scrollPosition,null);
    strategy.updateRowBoundaries();

    expect(strategy.renderStart).toEqual(4);

    scrollPosition = 321;
    strategy.updateParameters(null,null,null,scrollPosition,null);
    strategy.updateRowBoundaries();

    expect(strategy.renderStart).toEqual(13);
  });

  it("should calculate the first visible row", function () {
    var tableParentOffset = 0
      , scrollPosition = 0
      , defaultRowHeight = 23;

    var strategy = new WalkontableRowStrategy(fakeWalkontableInstance, getViewportHeight, tableParentOffset, scrollPosition, defaultRowHeight);

    expect(strategy.viewportStart).toEqual(0);

    scrollPosition = 100;

    strategy.updateParameters(null,null,null,scrollPosition,null);
    strategy.updateRowBoundaries();

    expect(strategy.viewportStart).toEqual(5);

    scrollPosition = 321;
    strategy.updateParameters(null,null,null,scrollPosition,null);
    strategy.updateRowBoundaries();

    expect(strategy.viewportStart).toEqual(14);
  });

  it("should calculate the last row to render", function () {
    var tableParentOffset = 0
      , scrollPosition = 0
      , defaultRowHeight = 23;

    var strategy = new WalkontableRowStrategy(fakeWalkontableInstance, getViewportHeight, tableParentOffset, scrollPosition, defaultRowHeight);

    expect(strategy.renderEnd).toEqual(5);

    scrollPosition = 100;
    strategy.updateParameters(null,null,null,scrollPosition,null);
    strategy.updateRowBoundaries();

    expect(strategy.renderEnd).toEqual(10);

    scrollPosition = 321;
    strategy.updateParameters(null,null,null,scrollPosition,null);
    strategy.updateRowBoundaries();

    expect(strategy.renderEnd).toEqual(19);

    scrollPosition = 0;
    getViewportHeight = function () {
      return 321;
    };
    strategy.updateParameters(null, getViewportHeight, null, scrollPosition, null);
    strategy.updateRowBoundaries();

    expect(strategy.renderEnd).toEqual(14);

    scrollPosition = 321;
    getViewportHeight = function () {
      return 321;
    };
    strategy.updateParameters(null, getViewportHeight, null, scrollPosition, null);
    strategy.updateRowBoundaries();

    expect(strategy.renderEnd).toEqual(28);

  });

  it("should find the last visible row in viewport", function () {
    createDataArray(20, 100);
    var wt = new Walkontable({
      table: $table[0],
      data: getData,
      totalRows: getTotalRows,
      totalColumns: getTotalColumns
    });

    wt.draw();
    expect(wt.wtTable.getRowStrategy().viewportEnd.innerHTML).toEqual("7");

    $container.css("height", "300px");
    wt.draw();
    expect(wt.wtTable.getRowStrategy().viewportEnd.innerHTML).toEqual("11");

    $container.css("height", "100px");
    wt.draw();
    expect(wt.wtTable.getRowStrategy().viewportEnd.innerHTML).toEqual("3");
  });


//  it("cell strategy should add only as many rows as it fits in the viewport + maxOuts", function () {
//    source = range(20);
//    var viewportSize = 100;
//    var strategy = new WalkontableRowStrategy(fakeWalkontableInstance, viewportSize, allCells25, 1, 1);
//    for (var i = 0; i < source.length; i++) {
//      strategy.add(i);
//    }
//
//    var expectedRowCount = Math.ceil(viewportSize / 23) + strategy.maxBefore + strategy.maxOuts;
//
//
//    expect(strategy.cellSizes.length).toEqual(expectedRowCount);
//  });
//
//  it("should show all cells if containerSize is Infinity", function () {
//    source = [0, 1, 2, 5, 6, 7, 8, 9, 10];
//    var strategy = new WalkontableRowStrategy(fakeWalkontableInstance, Infinity, allCells25, 1, 1);
//    for (var i = 0; i < source.length; i++) {
//      strategy.add(i);
//    }
//    expect(strategy.cellCount).toEqual(source.length);
//  });
//
////getSize
//
//  it("getSize should return cell size at given index", function () {
//    source = [0, 1, 2, 3, 4];
//    var strategy = new WalkontableRowStrategy(fakeWalkontableInstance, Infinity, allCellsPlus100, 1, 1);
//    for (var i = 0; i < source.length; i++) {
//      strategy.add(i);
//    }
//    expect(strategy.cellSizes).toEqual([100, 101, 102, 103, 104]);
//    expect(strategy.getSize(0)).toEqual(100);
//    expect(strategy.getSize(4)).toEqual(104);
//  });
})
;
