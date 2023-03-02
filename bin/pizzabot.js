#!/usr/bin/env node

const yargs = require('yargs');
const pizzabot = require('./bot');
const tester = require('./tester');

//set up pizzabot commands
yargs
.command({
    command:'$0',
    describe:'Default pizzabot command \n\n Expected Arguments: [grid] "[coordinates]" \n Example Arguments: : 5x5 (0, 0) (1, 3) (4, 4) (4, 2)\n\n',
    handler:pizzabot.main
})
.option('draw', {
    alias: 'd',
    type: 'boolean',
    description: 'Draw route taken'
})
.command({
    command:'test',
    describe:'Perform a series of automated tests on pizzabot command \n\n No arguments required',
    handler:tester.test
})
.parse();