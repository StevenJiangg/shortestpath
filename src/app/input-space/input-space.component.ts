import { Component, OnInit, Query } from '@angular/core';

@Component({
  selector: 'app-input-space',
  templateUrl: './input-space.component.html',
  styleUrls: ['./input-space.component.css']
})
export class InputSpaceComponent implements OnInit {

  clicked = true;
  inputNumber: number = 9;
  boxIndex  = {
    iIndex : 0, 
    jIndex: 0,
  };
  toggle:boolean = false;
  storeIndex = new Array(this.boxIndex, this.boxIndex);
  highlightPath = new Array();
  testingX = 0;

  testingY = 0;
  
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
  clickedPoint(i: any, j: any):void {
    this.testingX = i;
    this.testingY = j;
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
    var testingEdges2 = this.currentEdges(point2.iIndex, point2.jIndex);

    /*console.log(source.iIndex, source.jIndex);
    console.log(point2.iIndex, point2.jIndex);
    console.log("edges for point 2" , testingEdges2);*/

    for(var i = 0; i < Graph.length; i++){
      dist[i] = Infinity;
      prev[i] = undefined;
      Q.push(i);
      if(Graph[i].iIndex === source.iIndex && Graph[i].jIndex === source.jIndex){
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
      if(Q.findIndex(isLargeNumber) != -1){
        vertex = Q.findIndex(isLargeNumber);
      }

      Q.splice(vertex, 1);
      
      var neighborVertex;
      for(var i = 0; i < neighborsOfSmallestVertex.length; i++){
        alt  = dist[sDistVertex] + 1; // all neighbors have edge cost of 1 to its previous nodes so its (+1)
        neighborVertex = this.convertToVertices(neighborsOfSmallestVertex[i])

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
        if(JSON.stringify(Graph[j]) ===  JSON.stringify(pairs)){
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

  checkPath(i: any, j: any):void {
    this.highlightPath = new Array();
    var boxIndex  = {
      iIndex : i, 
      jIndex: j,
    };
    if(this.storeIndex.length < 2){
      this.storeIndex.push(boxIndex)
    }
    else{
      this.storeIndex.shift();
      this.storeIndex.push(boxIndex);
    }
  }

  classTester(i: any, j: any){
    for(var index = 0; index < this.storeIndex.length; index++){
      if(this.storeIndex[index].iIndex == i && this.storeIndex[index].jIndex == j){
        return true;
      }
    }
    return false;
  }
  fillPath(source:any, target:any){
    var infoObj = this.findPath(source, target);
    var prevHolder = infoObj.prev;
    var distHolder = infoObj.dist;
    //console.log("target" , target);
    //console.log("target vertex", this.convertToVertices(target))
    var targetVert = this.convertToVertices(target)
    var sourceVert = this.convertToVertices(source)
    var index = prevHolder[targetVert];
    while(index != sourceVert){
      this.highlightPath.push(this.convertToObject(index))
      index = prevHolder[index];
    }
    //console.log(this.highlightPath)
    return false;
  }

  testingFunction(m: any, n: any){
    var checkVert = this.highlightPath;
    for(var i = 0; i < checkVert.length; i++){
      if(checkVert[i].iIndex == m && checkVert[i].jIndex == n){
        return true;
      }
    }
    return false;
  }

}
