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