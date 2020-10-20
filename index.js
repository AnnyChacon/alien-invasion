const file = require('./file');
const fs = require('fs');
let ships = [];

file.read('./Files/input.txt', function (err, data) {
    if(err){
        console.error(err);
        return;
    }
    const lines = data.split('\n');
    const n = Number(lines[0]);
    let line = [];
    let numberLine = 1;
    if (n >= 1 && n <= 30) {
        for (let i = 0; i < n; i++) {
            line = lines[numberLine].split(' ').map(Number);
            numberLine++;
            let ship = [];
            for (let j = numberLine; j < (line[0] + numberLine); j++) {
                let subLine = lines[j].split(' ').map(value => {
                    return /[a-zA-Z]/.test(value) ? value : ' ';
                })
                ship.push(subLine);
            }
            numberLine += line[0];
            ships.push({
                id: i,
                dx: line[0],
                dy: line[1],
                l: line[2],
                ship: ship,
            });
        }
    }
})