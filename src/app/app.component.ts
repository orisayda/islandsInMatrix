import { Component, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public row: number = 15; // Number of rows in matrix
  public col: number = 16; // Number of columns in matrix
  public matrix: any[][]=new Array(this.col); // Init array with this.col columns
  public islandCount: number; // Number of islands in matrix
  public witchWorld: boolean = false; // The type of the world - false if flat, true if round (without borders)

constructor(private cd: ChangeDetectorRef /** For detect changes in the attributes in view */) {
  
    this.generateMatrix(); // Call function for generate matrix 
    this.solve(); // Call function for calc number of islands in matrix
  }
  

  // Generate matrix with random val (0 or 1) and visited = false
  // Put the new matrix inside this.matrix
  generateMatrix() {
    var rows = [];
    for (var j = 0; j < this.row; j++) {
      var columns = [];
      for (var i = 0; i < this.col; i++) {
        columns.push({
          val: Math.round(Math.random()),
          visited: false
        });
      }
      rows.push(columns);
    }
    this.matrix = rows;
   }

   // Toggle a matrix cell and calc the number of islands
  toggleByIndex(i, j) {
    if(this.matrix[j][i].val==0)
      this.matrix[j][i].val = 1;
    else this.matrix[j][i].val=0;
    this.solve(); // Calc the number of islands
    this.cd.markForCheck(); // Check for changes and render them to view
  }

  // General function to execute the callback function for every cell in the matrix
  iterate(callback) {
    this.matrix.forEach(function(V, i) {
      V.forEach(function(U, j) {
        callback(U, i, j);
      });
    });
  }
 
  // Parameters: Row = i, Column = j
  // Return: Value of cell(i,j) in this.matrix
  getData(i, j) {
    return this.matrix[i][j];
  }

  // Calculate m modulo n
  // ** JavaScript has problem to calculate it directly **//
  moduloCalc(m, n) {
    return (((m % n) + n) % n);
  }

  // Parameters: Row = i, Column = j, collection = array of all cells we visited in
  // 
  // DFS algorithm to build array of all cells belong to a island inside the matrix
  findConnectedNeighbour(i, j, collection) {
    // since we are visiting, i,j put visited true
    this.getData(i, j).visited = true;
    collection.push(i,j);
    // Left
    // Check the left cell of cell(i,j)
    var canWeGoLeft;
    if(!this.witchWorld) { 
      // If calculate by *FLAT WORLD* need to be check if the left cell is inside the matrix 
      canWeGoLeft = j - 1 >= 0 && // Check if the next cell is inside the matrix
      this.getData(i, j - 1).visited === false && // Check if we visited in the next cell
      this.getData(i, j - 1).val === 1; // Check if the next cell value is 1
    } else { 
      // If calculate by *ROUND WORLD* the left cell index is represent by modulo Column
      canWeGoLeft =
      this.getData(i, this.moduloCalc(j - 1,this.col)).visited === false && // Check if we visited in the next cell
      this.getData(i, this.moduloCalc(j - 1,this.col)).val === 1;// Check if the next cell value is 1
    }
      
    // Go to the next cell if we can
    if (canWeGoLeft) {
      this.findConnectedNeighbour(i, this.moduloCalc(j - 1,this.col), collection);
    }
    //Right
    // Check the right cell of cell(i,j)
    var canWeGoRight;
    if(!this.witchWorld) {
      // If calculate by *FLAT WORLD* need to be check if the right cell is inside the matrix 
      canWeGoRight = j + 1 <= this.col - 1 && // Check if the next cell is inside the matrix
      this.getData(i, j + 1).visited === false &&// Check if we visited in the next cell
      this.getData(i, j + 1).val === 1;// Check if the next cell value is 1
    } else {
      // If calculate by *ROUND WORLD* the right cell index is represent by modulo Column
      canWeGoRight =
      this.getData(i, this.moduloCalc(j + 1,this.col)).visited === false &&// Check if we visited in the next cell
      this.getData(i, this.moduloCalc(j + 1,this.col)).val === 1;// Check if the next cell value is 1
    }
    // Go to the next cell if we can
    if (canWeGoRight) {
      this.findConnectedNeighbour(i, this.moduloCalc(j + 1,this.col), collection);
    }
    //UP
    // Check the upper cell of cell(i,j)
    var canWeGoUp;
    if(!this.witchWorld) {
      // If calculate by *FLAT WORLD* need to be check if the upper cell is inside the matrix 
      canWeGoUp = i - 1 >= 0 && // Check if the next cell is inside the matrix
      this.getData(i - 1, j).visited === false &&// Check if we visited in the next cell
      this.getData(i - 1, j).val === 1;// Check if the next cell value is 1
    } else {
      // If calculate by *ROUND WORLD* the upper cell index is represent by modulo Row
      canWeGoUp = 
      this.getData(this.moduloCalc(i - 1,this.row), j).visited === false &&// Check if we visited in the next cell
      this.getData(this.moduloCalc(i - 1,this.row), j).val === 1;// Check if the next cell value is 1
    }
    // Go to the next cell if we can
    if (canWeGoUp) {
      this.findConnectedNeighbour(this.moduloCalc(i - 1,this.row), j, collection);
    }
    //Down
    // Check the lower cell of cell(i,j)
    var canWeGoDown;
    if(!this.witchWorld) {
      // If calculate by *FLAT WORLD* need to be check if the lower cell is inside the matrix
      canWeGoDown = i + 1 <= this.row - 1 && // Check if the next cell is inside the matrix
      this.getData(i + 1, j).visited === false &&// Check if we visited in the next cell
      this.getData(i + 1, j).val === 1;// Check if the next cell value is 1
    } else {
       // If calculate by *ROUND WORLD* the lower cell index is represent by modulo Row
      canWeGoDown =
      this.getData(this.moduloCalc(i + 1,this.row), j).visited === false &&// Check if we visited in the next cell
      this.getData(this.moduloCalc(i + 1,this.row), j).val === 1;// Check if the next cell value is 1
    }
    // Go to the next cell if we can
    if (canWeGoDown) {
      this.findConnectedNeighbour(this.moduloCalc(i + 1,this.row), j, collection);
    }
  }

  // Build array of arrays - each array contains all cells that belong to an island
  // The main array lenght is the number of all islands inside the matrix
  // Complexity: O( COL * ROW )
  solve() {
    var self = this;
    var allIsLands = [];
    this.iterate(function(cell, i, j) { // Check every cell 
      if (cell.visited === false) { 
        cell.visited = true; // change visited to true 
        if (cell.val === 1) { // If val = 1 check all neighbors (left, right, up, down)
          var island = [];
          self.findConnectedNeighbour(i, j, island);
          allIsLands.push(island); // Add island array to the main array
        }
      }
    });
    this.islandCount = allIsLands.length; // Put the number of islands
    
   // Rest all cell in matrix to visited = false
   // For the next time to run the algorithm
    this.iterate(function(cell,i,j) {
      cell.visited=false;
    });
  }

  // Parameters: WorldType - a boolean | true if calculate by round world | false if calculate by flat world
  // Put the boolean in this.witchWorld
  setWorldType(WorldType) {
    this.witchWorld = WorldType;
    this.solve();
    this.cd.markForCheck();
  }
}
