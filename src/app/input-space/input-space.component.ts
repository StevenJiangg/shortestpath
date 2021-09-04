import { trigger } from '@angular/animations';
import { Component, OnInit, Query } from '@angular/core';

@Component({
  selector: 'app-input-space',
  templateUrl: './input-space.component.html',
  styleUrls: ['./input-space.component.css']
})
export class InputSpaceComponent implements OnInit {

  clicked = true;
  inputNumber: number = 9;
  toggle:boolean = false;
  startingPoint = {
    iIndex : 0, 
    jIndex: 0,
  }
  endingPoint ={
    iIndex : this.inputNumber-1, 
    jIndex: this.inputNumber-1,
  }

  highlightPath = new Array();
  blockArray = new Array();

  blockCondition = true;
  startCond = false;
  endCond = false;
  toggleConditions: any;
  disableButton = false;
  
  constructor() { }

  ngOnInit(): void {
  }

  generateBoard(input: number){
    var boardArray = new Array();
    var tempArray = new Array();
    for(var i = 0; i < input; i++){
      for(var j = 0; j < input; j++){
        tempArray.push(j);
      }
      boardArray.push(tempArray);
      tempArray = [];
    }
    return boardArray;
  }

  change(){
    this.toggle = !this.toggle;
  }

  log(e: any){
    console.log(e)
  }
  graph(){
    var vertices = new Array();
    for(var iIndex = 0; iIndex < this.inputNumber; iIndex++){
      for(var jIndex = 0; jIndex < this.inputNumber; jIndex++){
        vertices.push({iIndex, jIndex});
      }
    }
    return vertices;
  }
  
  currentEdges(x: number, y: number){
    var edges = new Array();
    var top = x-1;
    var bot = x+1;
    var left = y-1;
    var right = y+1;
    var iIndex =  0;
    var jIndex = 0;
    if(top >=0 && top < this.inputNumber){
      iIndex =  x-1;
      if(left >= 0){
        jIndex = y-1;
        edges.push({iIndex, jIndex});
      }
      if(y>= 0 ){
        jIndex = y;
        edges.push({iIndex, jIndex});
      }
      if(right>=0 && right < this.inputNumber){
        jIndex = y+1;
        edges.push({iIndex, jIndex});
      }
    }
    if(x >= 0 && x < this.inputNumber){
      iIndex =  x;
      if(left >= 0){
        jIndex = y-1;
        edges.push({iIndex, jIndex});
      }
      //edges.push({x, y});
      if(right>=0 && right < this.inputNumber){
        jIndex = y+1;
        edges.push({iIndex, jIndex});
      }
    }
    if(bot >=0 && bot < this.inputNumber){
      iIndex =  x+1;
      if(left >= 0){
        jIndex = y-1;
        edges.push({iIndex, jIndex});
      }
      if(y>= 0){
        jIndex = y;
        edges.push({iIndex, jIndex});
      }
      if(right>=0 && right < this.inputNumber){
        jIndex = y+1;
        edges.push({iIndex, jIndex});
      }
    }
    //console.log(edges);
    return edges;
  }

  findPath(source: any, point2: any){
    this.highlightPath = new Array();
    var dist = new Array();
    var prev = new Array();
    var Q = new Array();
    var alt = 0;
    var sDistVertex: number;
    var neighborsOfSmallestVertex;
    var Graph = this.graph();
    if(JSON.stringify(source) == JSON.stringify(point2)){
      console.log("FOUND");
      return {dist, prev};
    }

    //console.log(source.iIndex, source.jIndex);
    //console.log(point2.iIndex, point2.jIndex);
    //console.log("blockage",this.blockArray);

    for(var i = 0; i < Graph.length; i++){
      dist[i] = Infinity;
      prev[i] = undefined;
      for(var k = 0; k < this.blockArray.length; k++){
        if(Graph[i].iIndex == this.blockArray[k].iIndex && Graph[i].jIndex == this.blockArray[k].jIndex){
          dist[i] = 500;
          prev[i] = 500;
        }
      }
      Q.push(i);
      if(Graph[i].iIndex == source.iIndex && Graph[i].jIndex == source.jIndex){
        dist[i] = 0;
      }
    }

    while(Q.length > 0 ){
      sDistVertex = this.smallestDist(dist, Q); 
      neighborsOfSmallestVertex =  this.currentEdges(Graph[sDistVertex].iIndex,Graph[sDistVertex].jIndex )
      if(sDistVertex=== this.convertToVertices(point2) ){
        //console.log("FOUND TARGET")
        break;
      }
      var vertex = 0;
      const isLargeNumber = (element: number) => element == sDistVertex;
      if(Q.findIndex(isLargeNumber) !== -1){
        vertex = Q.findIndex(isLargeNumber);
      }
      

      Q.splice(vertex, 1);
      
      var neighborVertex;
      for(var i = 0; i < neighborsOfSmallestVertex.length; i++){
        alt  = dist[sDistVertex] + 1; // all neighbors have edge cost of 1 to its previous nodes so its (+1)
        neighborVertex = this.convertToVertices(neighborsOfSmallestVertex[i])
        if(dist[neighborVertex] == 500){
          continue;
        }
        if(alt < dist[neighborVertex]){
          dist[neighborVertex] = alt;
          prev[neighborVertex] = sDistVertex;
        }
      }
    }
    //console.log("dist", dist);
    //console.log("prev", prev);
    return {dist, prev};
  }

  convertToVertices(pairs: any){
    var vertex = 0;
    var Graph = this.graph();
    for(var j = 0; j < Graph.length; j++){
        if(JSON.stringify(Graph[j]) ==  JSON.stringify(pairs)){
          vertex = j;
      }
    }
    return vertex;
  }

  convertToObject(vertex: any){
    var row = 0;
    var col = vertex%this.inputNumber;
    while(vertex >= this.inputNumber){
      vertex = vertex - this.inputNumber;
      if(vertex >= 0){
        row = row + 1;
      }
    }
    var pairs = {
      iIndex : row, 
      jIndex: col,
    };
    return pairs;
  }

  smallestDist(dist: any, Q:any){
    // loop through Q, get each value in its indices  
    // each of those values represent a key, u, to the Dist array, use thsese keys to access the distances of each u
    // find the minimum distance and return u
    var vertex = 0;
    var minDist = Infinity;
    for(var i = 0; i < Q.length; i++){
      var index = Q[i];
      if(minDist > dist[index]){
        minDist = dist[index];
        vertex = index;
      }
    }
    return vertex ;
  }

  fillPath(source:any, target:any){
    var infoObj = this.findPath(source, target);
    var prevHolder = infoObj.prev;
    var distHolder = infoObj.dist;

    var targetVert = this.convertToVertices(target)
    var sourceVert = this.convertToVertices(source)
    var index = prevHolder[targetVert];
    var maxLoop = this.inputNumber *this.inputNumber;
    while(index !== sourceVert){
      this.highlightPath.push(this.convertToObject(index))
      index = prevHolder[index];
      if(this.highlightPath.length > maxLoop){
        break;
      }
    }
    if(index !== sourceVert){
      this.highlightPath = [];
      alert("CANNOT FIND TARGET")
    }
  }

  toggleAddBlocks(){
    this.highlightPath = new Array();
    this.blockCondition = !this.blockCondition
  }
  toggleStartPoint(){
    this.startCond = !this.startCond;
  }
  toggleEndPoint(){
    this.endCond = !this.endCond;
  }

  changeStart(i : any, j : any){
    this.highlightPath = new Array();
    if( i == this.endingPoint.iIndex && j == this.endingPoint.jIndex){
      this.disableButton = true;
      alert("INCREDIBLE, YOU'VE FOUND THE SHORTEST PATH")
    }
    else{
      this.disableButton = false;
    }
    this.startingPoint = {
      iIndex : i, 
      jIndex: j,
    }
  }
  changeEnd(i : any, j : any){
    this.highlightPath = new Array();
    if( i == this.startingPoint.iIndex && j == this.startingPoint.jIndex){
      this.disableButton = true;
      alert("INCREDIBLE, YOU'VE FOUND THE SHORTEST PATH")
    }
    else{
      this.disableButton = false;
    }
    this.endingPoint = {
      iIndex : i, 
      jIndex: j,
    }
  }

  addBlocks(m: any, n: any){
    this.highlightPath = new Array();
    var boxIndex  = {
      iIndex: m, 
      jIndex: n,
    };
    var checkVert = this.blockArray;
   
    for(var i = 0; i < checkVert.length; i++){
      if(JSON.stringify(checkVert[i]) == JSON.stringify(boxIndex)){
        this.blockArray.splice(i, 1);
        return;
      }
    }
    this.blockArray.push(boxIndex)
  }

  checkAddedBlocks(m: any, n: any){
    var checkVert = this.blockArray;
    for(var i = 0; i < checkVert.length; i++){
      if(checkVert[i].iIndex == m && checkVert[i].jIndex == n){
        return true;
      }
    }
    return false;
  }

  highlight(m: any, n: any){
    var checkVert = this.highlightPath;
    for(var i = 0; i < checkVert.length; i++){
      if(checkVert[i].iIndex == m && checkVert[i].jIndex == n){
        return true;
      }
    }
    return false;
  }


  down: boolean = false

  mousedown(i: any, j: any) {
    this.down = true
  }
  
  mouseover(i: any, j: any) {
    if(this.down){
      this.addBlocks(i, j);
    }
  }
  
  mouseup(i: any, j: any) {
    this.addBlocks(i, j);
    this.down = false
  }

  clear(){
    this.highlightPath = [];
    this.blockArray = [];
  }

}
