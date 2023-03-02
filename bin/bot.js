/*
    Core Pizzabot module to take valid arguments and use them to deliver pizzas to points in a grid
*/

const yargs = require('yargs');
const validator = require('./argValidator');

//main function called by pizzabot command
function main(){
    var validArgs = validator.validate(yargs.argv);
    if(validArgs){
        var dp = deliverPizzas(validArgs);
        console.log(dp.steps);

        if(yargs.argv.draw)
            drawRouteTaken(dp.steps,dp.history)        
    }   
}


//will deliver pizzas by travelling up one plottable column, down the next & back up again etc
function deliverPizzas(validArgs){
    var logistics = getLogistics(validArgs.points); 
    var stops = logistics.deliveryPoints;
    var directions = logistics.roadMap;

    var currentPos = [0,0];
    var history = [];
    var steps = "";

    while(stops.length > 0){
        history.push(currentPos);
        var nextStop = stops[0];
        
        //check if current position is a delivery point
        if(areSame(currentPos, nextStop)){
            steps += "D"; 
            stops.shift();
        }

        //if still deliveries to make, move towards next stop
        if(stops.length){
            var movement = move(currentPos,nextStop,directions);
            currentPos = movement.newPosition;
            steps += movement.direction;
        }
    }

    return {steps: steps, history:history}
}


//returns coordinates sorted into the order in which we will arrive at them when traversing the grid
//also returns map of directions we should follow for each column
function getLogistics(deliveryPoints){
    //group coordinates by column in an Obj keyed by x coordinate
       colGroups = {}, roadMap = {};
    for(let i=0; i<deliveryPoints.length; i++){
        let x = deliveryPoints[i][0];
        if(colGroups[x] !== undefined)
            colGroups[x].push(deliveryPoints[i]);
        else colGroups[x] = [deliveryPoints[i]]
    }

    //based on each colGroups index in the list of group keys, sort asc when even, dsc when odd
    let sortAsc = function(a,b){return a[1]-b[1]};
    let sortDsc = function(a,b){return b[1]-a[1]};
    for(let x in colGroups){
        var i = Object.keys(colGroups).indexOf(x);
        colGroups[x] = colGroups[x].sort((i%2)?sortDsc:sortAsc);
        roadMap[x] = (i%2)?"S":"N";
    }

    //convert colGroups back into nested array
    deliveryPoints = [];
    for(let key in colGroups)
        for(let idx in colGroups[key])
            deliveryPoints.push(colGroups[key][idx]);

    return {deliveryPoints:deliveryPoints, roadMap:roadMap}
}


//function to move one position towards the next stop / returns new position & direction travelled in
function move(currentPosition, nextStop,directions){
    var currentX = currentPosition[0];
    var currentY = currentPosition[1];
    var nextX = nextStop[0];
    var nextY = nextStop[1];

    var ret = {
        direction: "", 
        newPosition:[]
    }

    if(currentX === nextX){
        //already in the same column as next delivery point
        if(currentY === nextY){
            //already at next delivery point, dont move 
            ret.newPosition = currentPosition;
        }else{
            //move N or S in current col towards next point
            var direction = directions[currentX];
            ret.direction = direction;
            ret.newPosition = [currentX, currentY + ((direction === 'N')?1:-1)];
        }
    }else{
        if(currentY == nextY){
            //already in same row as next stop, move east toward it
            ret.direction = "E";
            ret.newPosition = [currentX + 1, currentY];
        }else{
            //continue moving in same direction if nextY in path ahead, else move across one to head in opposite direction
            var direction = directions[currentX];
            if(direction && isAhead(currentY,nextY,direction)){            
                ret.direction = direction;
                ret.newPosition = [currentX, currentY + ((direction === 'N')?1:-1)];
            }else{
                ret.direction = "E";
                ret.newPosition = [currentX + 1, currentY];
            }
        }
    }

    return ret;
}


//draw the route taken to the console
function drawRouteTaken(steps,routeTaken){
    //get the max X/Y values of the route
    var maxX = 0, maxY = 0;
    for(var i=0; i < routeTaken.length; i++){
        if(routeTaken[i][0] > maxX)
            maxX = routeTaken[i][0];

        if(routeTaken[i][1] > maxY)
            maxY = routeTaken[i][1];
    }
    maxX++; maxY++;

    //populate an empty matrix based off max X/Y values
    var table = {};
    for(var y=0; y < maxY; y++){
        var row = [];
        for(var x=0; x < maxX; x++)
            row.push([])
        table[" " + (maxY-y-1)] = row;
    }

    //loop through route taken and add to matrix accordingly
    for(var r=0; r < routeTaken.length; r++){
        var point = routeTaken[r];
        var x =point[0];
        var y = " " + point[1];    
        table[y][x] += steps[r];
    }

    console.table(table);
}


function areSame(a,b){ 
    return (a[0] === b[0] && a[1] === b[1])?true:false; 
}

function isAhead(currentY,destinationY,direction){
    if(direction === "N")
        return (destinationY > currentY)?true:false;
    else
        return (destinationY < currentY)?true:false;
}

module.exports = {
    main:main,
    deliverPizzas:deliverPizzas
}