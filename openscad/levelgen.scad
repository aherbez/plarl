$fn = 32;

// variables
smallAmt = 0.00000001;

cellWall = 3;
cellSize = 10;
cellHeight = 6;
cellSep = cellSize + cellWall;

divotHeight = 4.6;

coverSupportH = 0.4;
coverSupportW = 1.2;
coverSize = cellSize - 0.5;
coverH = 0.8;

layerHeight = 0.2;

tokenHeight = 1;
tokenSize = cellSize - 1.2;
tokenSupportHeight = 2.6;
tokenSupportW = 2.2;
tokenSupportD = 0.8;

showCross = false;

pathW = 1.2;
pathD = 0.6;

// paste generated data here
path_vals = [4,6,8,6,10,8,2,12,3,11,10,11,12,6,8,5,6,8,4,4,5,5,4,5,3,12,5,5,7,11,9,5,4,7,9,7,11,8,4,5,3,11,10,11,10,10,11,11];
contents = [25,2,0,21,25,11,0,25,11,24,11,0,0,21,21,13,0,12,21,21,0,21,13,22,21,0,22,0,12,21,21,22,21,0,21,21,21,21,11,0,11,21,11,1,0,0,11,21];
dimX = 6;
dimY = 8;

// grabbed from comment here: https://williamaadams.wordpress.com/2011/11/01/boolean-operators-in-openscad-counting-in-binary/ 
function bit_set(b, n) = floor(n / pow(2, b)) % 2;

// maybe show cross section
if (showCross)
{
    difference() {
        printRL(dimX, dimY);
        
        translate([cellSize/2 + cellWall, -2, -2])
        cube([50, 60, 20]);
    }
} else {
    printRL(dimX, dimY);
}


module printRL(x, y) 
{
    union() {
        color([1,1,1])
        difference() {
            base(x, y);
            
            color([1,1,0])
            translate([cellSize/2, cellSize/2, 0])
            makePaths(x, y);
        }

        color([0,1,0])
        makeTokens(x, y);
        
        color([1,0,1])
        translate([0,0,-coverH])
        cellCovers(x, y);
        
    }
}

module makePaths(x, y) {
   offset = cellSep/2 + cellWall/2;
   halfCover = coverSize/2;  
   for (i=[0:x-1]) {
    for (j=[0:y-1]) {            
       index = (i * y ) + j;
        translate([cellSep*i+offset - halfCover,
            cellSep*j+offset- halfCover,
            cellHeight - divotHeight - pathD])
       // cube([coverSize, coverSize, coverH+smallAmt], centered=true);
        path(index);
      }
   }
}


module path(index) {
    if (contents[index] == 2) {
        rotate([0,0,90])
        import("icons/stairs.stl");
    }
    else {        
        if (path_vals[index] > 0) {
            cylinder(r=(pathW/2), h=5);
        }
        
        for (d=[0:4]) {
            if (bit_set(d, path_vals[index])) {
                
                rotate([0, 0, -90*d+90])
                translate([0, cellSize/4, 2.5])
                
                cube([pathW, cellSize/2-0.5, 5], center=true);
            }
        }
    }
}

module makeTokens(x, y)
{
   offset = cellSep/2 + cellWall/2;
   halfCover = coverSize/2;
   for (i=[0:x-1]) {
    for (j=[0:y-1]) {            
       translate([cellSep*i+offset - halfCover,
            cellSep*j+offset- halfCover,
            0])
        token((i * y ) + j);
      }
   }
}

module tokenSupport()
{
    difference() {
    translate([0,0,-smallAmt])
    cube([tokenSize, tokenSupportD, tokenSupportHeight + (smallAmt*2)]);
    
    color([0,1,0])
    translate([tokenSupportW, -2, -1])
    cube([tokenSize - (tokenSupportW * 2), 5, tokenSupportHeight - layerHeight+1]);
    }
}   

module addIcons(num, icon) {
    
    rotate([0,0,90]) {
    
        if (num % 2 == 1) {
            import(icon);
        }
        
        if (num > 1)
        {
            translate([tokenSize * 0.3, tokenSize * 0.3, 0])
            import(icon);
            
            translate([tokenSize * -0.3, tokenSize * -0.3, 0])
            import(icon);
        }
        
        if (num > 3) 
        {
            translate([tokenSize * -0.3, tokenSize * 0.3, 0])
            import(icon);
            
            translate([tokenSize * 0.3, tokenSize * -0.3, 0])
            import(icon);
        }
        
        if (num > 5)
        {
            translate([tokenSize * -0.3, 0, 0])
            import(icon);
            
            translate([tokenSize * 0.3, 0, 0])
            import(icon);
        }
    }
}

module token(index)
{   
    if (contents[index] > 10) {
    
        tokenSupport();
        
        translate([0, tokenSize-tokenSupportD, 0])
        tokenSupport();
        
        
        translate([0, 0, tokenSupportHeight]) {
            cube([tokenSize, tokenSize, tokenHeight]);

            if (contents[index] > 10) {
                translate([tokenSize/2, tokenSize/2, 0.4])
                
                if (contents[index] < 20) {
                    addIcons(contents[index]-10, "icons/dot.stl");
                } else {
                    addIcons(contents[index]-20, "icons/diamond.stl");
                }
            }
        }
    }
}


module cellDivot()
{
    linear_extrude(height=divotHeight+smallAmt, scale=1.1) {
        square(cellSize, center=true);
    }
}

module cellCovers(x, y)
{
   totalWidth = (y * cellSize) + ((y+1) * cellWall);
   
   startOffset = cellSize/2 + cellWall;
   separation = cellSize + cellWall; 
   for (i=[0:x-1])
   {
       centered = separation*i+startOffset - (coverSupportW/2);
       depthOffset = (coverSize - coverSupportW)/2;
       

       translate([centered - depthOffset, 0, cellHeight])
       cube([coverSupportW, totalWidth, coverSupportH+smallAmt]); 
       
       translate([centered + depthOffset, 0, cellHeight])
       cube([coverSupportW, totalWidth, coverSupportH+smallAmt]); 
   }
   
   offset = cellSep/2 + cellWall/2;
   halfCover = coverSize/2;
   for (i=[0:x-1]) {
        for (j=[0:y-1]) {
           translate([cellSep*i+offset - halfCover, cellSep*j+offset- halfCover,cellHeight+layerHeight])
           
            if (contents[(i * y ) + j] == 1) {
               cube([coverSize, coverSize, coverH+smallAmt], centered=true);
               

               translate([coverSize/2, coverSize/2,0]) 
               rotate([0,0,90])
               scale([1,1,1.4])
               import("icons/door.stl");
            
            } else {
               cube([coverSize, coverSize, coverH+smallAmt], centered=true);
            }
        }
   }
}

// make the base
module base(x, y)
{
    totalWidth = (x * cellSize) + ((x+1) * cellWall);
    totalDepth = (y * cellSize) + ((y+1) * cellWall);
    
    // translate([0, 0, cellHeight/2])
    
    difference() {
    cube([totalWidth, totalDepth, cellHeight]);
    
    offset = cellSep/2 + cellWall/2;
    color([0,1,1])
    for (i=[0:x-1]) {
        for (j=[0:y-1]) {
            translate([cellSep*i+offset,cellSep*j+offset,(cellHeight-divotHeight)])
            cellDivot();
        }
        
    }
    }
}