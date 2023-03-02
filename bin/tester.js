/*
    Module to run a series of tests that test the apps core functionality of validating user input and delivering pizzas to points in a grid
*/

const chalk = require('chalk');
const yargs = require('yargs');

const pizzabot = require('./bot');
const validator = require('./argValidator');

var testCount =0, passCount=0;


//Tests deliverPizzas function / Assumes all test arguments are valid
function testDeliverPizzas(){  
    try{
        console.log(chalk.underline.yellow("\nTESTING DELIVERPIZZAS FUNCTION:"));
        var tArgs = { grid:{x:"", y:""}, points:[] };
        
        //test1
        tArgs.grid = {x:5, y:5}
        tArgs.points = [[0, 0],[1, 3],[4, 4],[4, 2],[4, 2],[0, 1],[3, 2],[2, 3],[4, 1]];    
        console.log(chalk.yellow("Slice String Test"));
        assertEquals(tArgs,pizzabot.deliverPizzas(tArgs).steps,"DNDNNEDEDESDSEDNDDNND");
    
        //test2
        tArgs.grid = {x:5, y:5}
        tArgs.points = [[0, 0]];    
        console.log(chalk.yellow("\nJust one delivery on origin"));
        assertEquals(tArgs,pizzabot.deliverPizzas(tArgs).steps,"D");
    
        //test3
        tArgs.grid = {x:20, y:0}
        tArgs.points = [[20,0],[20,0],[20,0],[20,0]];    
        console.log(chalk.yellow("\nAll deliveries on X axis"));
        assertEquals(tArgs,pizzabot.deliverPizzas(tArgs).steps,"EEEEEEEEEEEEEEEEEEEEDDDD");
    
        //test4
        tArgs.grid = {x:0, y:20}
        tArgs.points = [[0,20],[0,20],[0,20],[0,20]];    
        console.log(chalk.yellow("\nAll deliveries on Y axis"));
        assertEquals(tArgs,pizzabot.deliverPizzas(tArgs).steps,"NNNNNNNNNNNNNNNNNNNNDDDD");
    
    }catch(e){
        console.log(chalk.bold.red("\nCritical Failure testing deliver pizzas, are your test arguments valid?"));
    }
}

//Tests if argument inputs are valid
function testIfValid(){
    console.log(chalk.underline.yellow("\nTESTING ARGUMENT VALIDATION FUNCTION:"));
    
    //test1
    var testString = "5x5 (0, 0) (1, 3) (4, 4) (4, 2) (4, 2) (0, 1) (3, 2) (2, 3) (4, 1";
    var tArgv = getTestableArgv(testString);
    console.log(chalk.yellow("\nMissing brackets on coordinate"));
    assertEquals(testString,validator.validate(tArgv),false);

    //test2
    testString = "1x1 (0, 0) (1, 3) (4, 4) (4, 2) (4, 2) (0, 1) (3, 2) (2, 3) (4, 1)";
    tArgv = getTestableArgv(testString);
    console.log(chalk.yellow("\nPoints sitting outside grid"));
    assertEquals(testString,validator.validate(tArgv),false);

    //test3
    testString = "0x0 (0, 0) (1, 3) (4, 4)";
    tArgv = getTestableArgv(testString);
    console.log(chalk.yellow("\nEmpty Grid"));
    assertEquals(testString,validator.validate(tArgv),false);

    //test4
    testString = "5xxxx5 (0, 0) (1, 3) (4, 4)";
    tArgv = getTestableArgv(testString);
    console.log(chalk.yellow("\nExtra x's inside grid arg"));
    assertEquals(testString,validator.validate(tArgv),false);

    //test5
    testString = "5x (0, 0) (1, 3) (4, 4)";
    tArgv = getTestableArgv(testString);
    console.log(chalk.yellow("\nMissing Y value in grid arg"));
    assertEquals(testString,validator.validate(tArgv),false);

    //test6
    testString = "x5 (0, 0) (1, 3) (4, 4)";
    tArgv = getTestableArgv(testString);
    console.log(chalk.yellow("\nMissing X value in grid arg"));
    assertEquals(testString,validator.validate(tArgv),false);

    //test7
    testString = "";
    tArgv = getTestableArgv(testString);
    console.log(chalk.yellow("\nNo Args"));
    assertEquals(testString,validator.validate(tArgv),false);

    //test8
    testString = "(1, 3) (4, 4) (4, 2) (4, 2) (0, 1) (3, 2) (2, 3) (4, 1)";
    tArgv = getTestableArgv(testString);
    console.log(chalk.yellow("\nMissing Grid Arg"));
    assertEquals(testString,validator.validate(tArgv),false);

    //test9
    testString = "5x5 (0, 0) (1, 3) (4, 4) (4, -2) (4, 2) (0, 1) (3, 2) (2, 3) (4, 1)";
    tArgv = getTestableArgv(testString);
    console.log(chalk.yellow("\nNegative Numbers"));
    assertEquals(testString,validator.validate(tArgv),false);

    //test10
    testString = "5x5 (0, 0) (1, 3) (4, 4) (4, 2) (4, 2) (0, 1) (3, 2) (2, 3) (4, 1)";
    tArgv = getTestableArgv(testString);
    var expectedOutput = {
        grid:{x:5,y:5},
        points:[[0,0],[1,3],[4,4],[4,2],[4,2],[0,1],[3,2],[2,3],[4,1]]
    }
    console.log(chalk.yellow("\nValid Arguments passed"));
    assertEquals(testString,validator.validate(tArgv),expectedOutput);
}

//checks if output and expected output are equal
function assertEquals(testParameters,output,expectedOutput){
    testCount++
    console.log("Test Parameters: ", testParameters);
    console.log("Expected Output: ", expectedOutput);
    console.log("Actual Output  : ", output);

    if(["object", "array"].indexOf(typeof output) > -1)
        output = JSON.stringify(output);

    if(["object", "array"].indexOf(typeof expectedOutput) > -1)
        expectedOutput = JSON.stringify(expectedOutput);

    if(output === expectedOutput){
        passCount++;
        console.log(chalk.green("SUCCESS"));
    }else console.log(chalk.red("FAILURE"));
}

//replicates what argv would look like given an input string
function getTestableArgv(string){
    var r = JSON.parse(JSON.stringify(yargs.argv));
    if(string.indexOf("-") > -1)
        r["UO"] = "Unexpected Option";
    r["_"] = string.split(" ");
    return r;
}

function test(){
    console.log(chalk.bold.yellow("Running Tests"));
    testIfValid();
    testDeliverPizzas();
    console.log(chalk.bold.yellow("\nPassed " + passCount +" out of " + testCount + " tests"));
}

module.exports = {
    test:test
}