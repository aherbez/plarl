const Dirs = {
    NORTH: 0,
    EAST: 1,
    SOUTH: 2,
    WEST: 3,
};

class Cell
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.neighbors = [];
    }

    get north()
    { return this.neighbors[Dirs.NORTH];}

    get east()
    { return this.neighbors[Dirs.EAST];}

    get south()
    { return this.neighbors[Dirs.SOUTH];}

    get west()
    { return this.neighbors[Dirs.WEST];}

    set north(cell)
    { this.link(cell, Dirs.NORTH, true);}

    set east(cell)
    { this.link(cell, Dirs.EAST, true);}

    set south(cell)
    { this.link(cell, Dirs.SOUTH, true);}

    set west(cell)
    { this.link(cell, Dirs.WEST, true);}

    link(cell, direction, bidirectional = false)
    {
        this.neighbors[direction] = cell;
        if (bidirectional) {
            cell.link(this, (direction + 2) % 4, false);
        }
    }

    isLinked(direction)
    {
        return (!!this.neighbors[direction]);
    }

    copy()
    {
        let c = new Cell(this.x, this.y);
        this.neighbors.forEach((cell, direction) => {
            c.link(cell, direction);
        });
        return c;
    }
}

module.exports = {
    Cell,
    Dirs,
}