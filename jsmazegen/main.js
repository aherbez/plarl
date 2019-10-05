const { Dirs, Cell, Grid } = require('./mazegen/mazeparts.js');
const { RandomMaze, BinaryTree, Sidewinder } = require('./mazegen/mazealgos.js');
const { MazeCanvas2d } = require('./mazegen/maze_canvas2d.js');

let c = new MazeCanvas2d("stage");


function makeMaze() {
    console.log('making maze!');
    
    let dimsX = 10;
    let dimsY = 2;

    try {
        dimsX = parseInt(document.getElementById("cellsX").value, 10);
        dimsY = parseInt(document.getElementById("cellsY").value, 10);
    } catch (e) {}
    
    
    let g = new Grid(dimsX,dimsY);
    new Sidewinder(g);
    
    console.log(g.getAllCells());
    console.log(g.getCellContents());
    
    const cells = `path_vals = [${g.getAllCells()}];`;
    const cellData = `contents = [${g.getCellContents()}];`;
    const w = `dimX = ${g.rows};`;
    const h = `dimY = ${g.columns};`;
    
    const outputDiv = document.getElementById("output");
    
    outputDiv.innerHTML = [cells, cellData, w, h].join("<br />");
    
    c.setGrid(g);    
}

makeMaze();

module.exports = {
    makeMaze,
};

/*

difference() {
    cube([40, 60, 10], center=true);

    translate([0, 0, 20])
    cube([30, 50, 40], center=true);       
}
*/

