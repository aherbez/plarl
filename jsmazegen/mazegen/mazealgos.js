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