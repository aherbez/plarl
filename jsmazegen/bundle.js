(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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


},{"./mazegen/maze_canvas2d.js":2,"./mazegen/mazealgos.js":3,"./mazegen/mazeparts.js":4}],2:[function(require,module,exports){
class MazeCanvas2d
{
    constructor(canvasID)
    {
        this.canvasID = canvasID;
        this.canvas = document.getElementById(this.canvasID);
        this.ctx = this.canvas.getContext('2d');
    
        this.w = this.canvas.clientWidth;
        this.h = this.canvas.clientHeight;
    }

    setGrid(g)
    {
        this.grid = g;
        this.cellSizeX = this.w / this.grid.columns;
        this.cellSizeY = this.h / this.grid.rows;

        this.drawMaze();
    }

    drawMaze()
    {
        if (this.grid) 
        {
            this.ctx.clearRect(0, 0, this.w, this.h);
            this.grid.forEachCell(this.drawCell);            
        }
    }

    drawCell = (cell, x, y) =>
    {
        this.ctx.save();
        this.ctx.translate(x * this.cellSizeX, y * this.cellSizeY);
        this.ctx.scale(1, this.cellSizeY / this.cellSizeX);

        this.ctx.lineWidth = 5;
        this.ctx.strokeRect(0, 0, this.cellSizeX, this.cellSizeX);

        this.ctx.save();
        this.ctx.translate(this.cellSizeX/2, this.cellSizeX/2);
        for (let i=0; i < 4; i++)
        {
            if (cell.hasPassage(i)) {
                
                this.ctx.fillStyle = "rgb(0,0,0)";
                if (cell.data != '') {
                    this.ctx.font = `${Math.floor(this.cellSizeX * 0.4)}px Arial`;
                    this.ctx.fillText(cell.data, 0, 0);
                }
                
                this.ctx.save();
                this.ctx.rotate(Math.PI/2 * i);
                
                this.ctx.fillStyle = "rgb(255, 255, 255)";
                
                this.ctx.beginPath();
                this.ctx.rect(-this.cellSizeX/4, -this.cellSizeX/2-5, this.cellSizeX/2, 10);
                this.ctx.fill();
                this.ctx.restore();
            }
        }
        this.ctx.restore();
        this.ctx.restore();
    }
}

module.exports = {
    MazeCanvas2d,
}
},{}],3:[function(require,module,exports){
const { Dirs } = require('./mazeparts');

const flipCoin = () => {
    return Math.random() > 0.499999;
}

const randomElement = (a) => {
    return a[Math.floor(Math.random() * a.length)];
}

class MazeAlgo
{
    constructor(g)
    {
        this.grid = g;
        this.genMaze();
        this.setData();
    }

    genMaze() {};

    setData() {
        let x,y;

        this.grid.forEachCell((cell, x, y) => {
            const type = Math.floor(Math.random() * 3);

            const randMax = Math.max((this.grid.rows - y)/this.grid.rows * 6, 2);
            const value = Math.max(1, Math.floor(Math.random() * randMax));

            switch (type) {
                case 1:
                    cell.data = value+10;
                    break;
                case 2:
                    cell.data = value+20;
                    break;
                default:
                    break;
            }

        });

        // pick a start position along the bottom
        y = this.grid.rows - 1;
        x = Math.floor(Math.random() * this.grid.columns);
        this.grid._cells[y][x].data = 1;
    
        // pick an end position along the top
        y = 0;
        x = Math.floor(Math.random() * this.grid.columns);
        this.grid._cells[y][x].data = 2;
    
    }
}

class RandomMaze extends MazeAlgo
{
    genMaze()
    {
        this.grid.forEachCell((cell, x, y) => {
            
            let v = Math.floor(Math.random() * 16);

            for (let i=0; i < 4; i++)
            {
                if (v & Math.pow(2,i)) {
                    cell.addPassage(i, true);
                }
            }

        });
    }
}


class BinaryTree extends MazeAlgo
{
    genMaze()
    {
        this.grid.forEachCell((cell, x, y, rows, columns) => {

            if (y < 1) 
            {
                cell.addPassage(Dirs.EAST, true);
            }

            if ( x === columns -1)
            {
                cell.addPassage(Dirs.NORTH, true);

            }

            if (y > 0 && x < (columns - 1)) {
                if (flipCoin()) {
                    cell.addPassage(Dirs.NORTH, true);
                }
                else {
                    cell.addPassage(Dirs.EAST, true);
                }
            }
        });
    }
}

class Sidewinder extends MazeAlgo
{
    genMaze()
    {
        const { rows, columns } = this.grid;

        let visitedCells = [];
        // process each row
        for (let y=0; y < rows; y++) {
            visitedCells = [];

            for (let x=0; x < columns; x++) {
                visitedCells.push(this.grid._cells[y][x]);
                
                if (x < (columns-1) && flipCoin()) {
                    // carve east
                    this.grid._cells[y][x].addPassage(Dirs.EAST, true);
                } else if (y < (rows-1)) {
                    // carve south
                    randomElement(visitedCells).addPassage(Dirs.SOUTH, true);
                    visitedCells = [];
                } else {
                    this.grid._cells[y][x].addPassage(Dirs.EAST, true);
                }
            }
        }
        
    }
}


module.exports = {
    RandomMaze,
    BinaryTree,
    Sidewinder,
}
},{"./mazeparts":4}],4:[function(require,module,exports){
const Dirs = {
    NORTH: 0,
    EAST: 1,
    SOUTH: 2,
    WEST: 3,

    reverse(dir) {
        return ((dir + 2) % 4);
    }
};

class Cell
{
    constructor()
    {
        this._passages = [0,0,0,0];
        this._neighbors = [];
        this.data = 0;
    }
    
    addPassage(dir, bidi = false)
    {
        this._passages[dir] = 1;
        if (bidi) {
            if (this._neighbors[dir]) {
                this._neighbors[dir].addPassage(Dirs.reverse(dir), false);
            }
        }
    }

    addNeighbor(dir, cell, bidi = false)
    {
        this._neighbors[dir] = cell;
        if (bidi)
        {
            cell._neighbors[Dirs.reverse(dir)] = this;
        }
    }

    removePassage(dir, bidi = false)
    {
        this._passages[dir] = 0;
        if (bidi) {
            if (this._neighbors[dir]) {
                this._neighbors[dir].removePassage(Dirs.reverse(dir), false);
            }
        }

    }

    hasPassage(dir)
    {
        return (this._passages[dir] === 1);
    }

    reset()
    {
        this._passages = [0,0,0,0];
    }

    get value()
    {
        let value = 0;
        this._passages.forEach((v, i) => {
            if (v === 1) {
                value += Math.pow(2, i);
            }
        })
        return value;
    }

}

class Grid
{
    constructor(columns, rows)
    {
        this.rows = rows;
        this.columns = columns;
        this.initCells();
    }

    initCells()
    {
        this._cells = [];
        for (let i=0; i < this.rows; i++)
        {
            this._cells[i] = [];
            for (let j=0; j < this.columns; j++)
            {
                this._cells[i][j] = new Cell();
            }
        }

        this.linkCells();
    }

    linkCells()
    {
        for (let y=0; y < this.rows; y++)
        {
            for (let x=0; x < this.columns; x++)
            {
                if (y < this.rows - 1) {
                    this._cells[y][x].addNeighbor(Dirs.SOUTH, this._cells[y+1][x], true);
                }

                if (x < this.columns - 1)
                {
                    this._cells[y][x].addNeighbor(Dirs.EAST, this._cells[y][x+1], true);
                }
            }
        }
    }

    forEachCell(f) {
        for (let y=0; y < this.rows; y++)
        {
            for (let x=0; x < this.columns; x++)
            {
                f(this._cells[y][x], x, y, this.rows, this.columns);
            }
        }
    }

    reset() {
        this.forEachCell((c) => {
            c.reset();
        });
    }

    toString()
    {
        let m = '';
        for (let i=0; i < this.rows; i++)
        {
            let s = '';
            for (let j=0; j < this.columns; j++)
            {
                s += '' + this._cells[i][j].value;
            }
            m += s + '\n';
        }
        return m;
    }

    getAllCells()
    {
        let allCells = [];
        for (let y=0; y < this.rows; y++)
        {
            allCells.push(...this._cells[y].map(c => {
                return c.value;
            }));
        }
        return allCells;
    }

    getCellContents()
    {
        let cellData = [];
        for (let y=0; y < this.rows; y++)
        {
            cellData.push(...this._cells[y].map(c => {
                return c.data;
            }));
        }
        return cellData;

    }
}


module.exports = {
    Cell,
    Dirs,
    Grid
};
},{}]},{},[1]);
