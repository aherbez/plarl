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