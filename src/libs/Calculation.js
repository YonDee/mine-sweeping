class Calculation {
  test(){
    console.log('hello')
  }
  /**
   * Calculates the element index around the current element
   * @param {number} index
   * @param {number} columns
   * @param {number} rows
   * @param {number} max
   * @return {Array} around grids index
   */
  getAroundGridIndex(index, columns, rows, max){
    index = parseInt(index);
    columns = parseInt(columns);
    rows = parseInt(rows);
    max = parseInt(max);
    const maxGrids = max || columns * rows;
    const top = index - columns;
    const bottom = index + columns;
    const left = index - 1;
    const right = index + 1;
    let aroundGridIndex = [];

    if (left >= 0 && index % columns > 0) {
      aroundGridIndex.push(left)
      if (top > 0) {
        aroundGridIndex.push(top - 1)
      }
      if (bottom < maxGrids) {
        aroundGridIndex.push(bottom - 1)
      }
    }
    if (right > 0 && right % columns > 0) {
      aroundGridIndex.push(right)
      if (top >= 0) {
        aroundGridIndex.push(top + 1)
      }
      if (bottom < maxGrids) {
        aroundGridIndex.push(bottom + 1)
      }
    }
    if (top >= 0) {
      aroundGridIndex.push(top)
    }
    if (bottom < maxGrids) {
      aroundGridIndex.push(bottom)
    }

    return aroundGridIndex;
  }

}

export default Calculation;