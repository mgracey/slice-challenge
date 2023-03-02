/*
    Module to validate pizzabot command line arguments & return parsed arguments if valid or provide feedback to console if invalid
    Sample Response if valid:   
        {
            grid: { x: 5, y: 5 },
            points: [[ 0, 0 ], [ 1, 3 ]]
        }
*/

const chalk = require('chalk');
const expectedOptions = ["$0","_","d","draw","test"];

var validateInput = function (argv){  
    var args = argv._;

    var options = Object.keys(argv);

    //negative numbers preceeded by a space will get parsed as an option and cause issues with argument parsing
    //check for unexpected options 
    var unexpectedOptions = options.filter(function(a){return expectedOptions.indexOf(a) === -1});
    if(unexpectedOptions.length > 0 ){
        console.log(chalk.red("Unexpected options detected, please recheck"));
        return false 
    }

    //no args
    if(!args.length){
        console.log(chalk.red("Please provide arguments for pizzabot"));
        return false
    }
 
    //grids starting with 0x are parsed as hex values that need handled accordingly
    var gridArg = (typeof args[0] === "number")?"0x"+ args[0]:args[0]; 
    gridArg = gridArg.toLowerCase().split("x"); 
    var grid ={
        x: parseInt(gridArg[0]),
        y: parseInt(gridArg[1])
    }

    //missing an arg
    if(args.length === 1){
        console.log(chalk.red("Further argument required"));
        return false
    }

    //0x0
    if(!grid.x && !grid.y){
        console.log(chalk.red("That isn't much of a grid"));
        return false
    }

    //5x or 5xx5 or 5xA
    if(!(grid.x && grid.y)){
        if(isNaN(grid.x) || isNaN(grid.y)){
            console.log(chalk.red("Please recheck your grid argument"));
            return false
        }
    }

    //parse coordinates into nested array of points, catch error if coordinates are malformed
    try{
        args.shift();
        var points = args.join(" ")
                    .replace(/\(/g, "[")
                    .replace(/\)/g, "]")
                    .replace(/, /g, ",")
                    .replace(/\s+/g, ",")
                    .replace(/\]\[/g,"],[")
        points = eval("[" + points + "]");
    }
    catch(e){
        console.log(chalk.red("Unable to parse coordinate arguments, please recheck"));
        return false
    }

    for(var i=0; i < points.length; i++){
        //(4,2)(2,1) , (1,2)
        if(!points[i]){
            console.log(chalk.red("Empty coordinate detected, please recheck"));
            return false
        }

        //(3,2,1)
        if(points[i].length > 2){
            console.log(chalk.red("All coordinates must have a X and Y value only"));
            return false
        }

        var pointX = points[i][0];
        var pointY = points[i][1];

        //5x5 > (6,2)
        if(pointX > grid.x || pointX < 0){
            console.log(chalk.red("One of the specified coordinates has a X value that sits outside the grid and cannot be delivered too"));
            return false
        }

        //5x5 > (2,6)
        if(pointY > grid.y || pointY < 0){
            console.log(chalk.red("One of the specified coordinates has a Y value that sits outside the grid and cannot be delivered too"));
            return false
        }

        //(,4)
        if(pointX === undefined || pointY === undefined){
            console.log(chalk.red("It looks like one of your coordinates is missing a value"));
            return false
        }        
    }

    return {grid:grid, points:points};
}

module.exports = {
    validate:validateInput
}