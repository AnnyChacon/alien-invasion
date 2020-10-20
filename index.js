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
            let layers = getAreasCenterPoint(getLayers(ship), line[2]);
            ships.push({
                id: i,
                width: line[0],
                height: line[1],
                scale: line[2],
                ship: ship,
                layers: layers,
            });
            ship = [];
            layers = [];
        }
    }
})

function getLayers(ship) {
    let found = false;
    let layers = [];
    for (let i = 0; i < ship.length; i++) {
        for (let j = 0; j < ship[i].length; j++) {
            found = false;
            if(ship[i][j] !== ' '){
                layers.forEach(layer => {
                    if(layer.id === ship[i][j]){
                        found = true;
                        if(i < layer.xa){
                            layer.xa = i;
                        }
                        if(i > layer.xb){
                            layer.xb = i;
                        }
                        if(j < layer.ya){
                            layer.ya = j;
                        }
                        if(j > layer.yb){
                            layer.yb = j;
                        }
                    }
                });
                if(!found){
                    layers.push({
                        id: ship[i][j],
                        xa: i,
                        xb: i,
                        ya: j,
                        yb: j,
                    })
                }
            }
        }
    }
    return layers;
}

function getAreasCenterPoint(layers, scale) {
    layers.forEach(layer => {
        layer.base = layer.yb - layer.ya + 1;
        layer.height = layer.xb - layer.xa + 1;
        layer.area = layer.base * layer.height * scale;
        layer.centerPointX = ( ( layer.height / 2 ) + layer.xa ) * scale;
        layer.centerPointY = ( ( layer.base / 2 ) + layer.ya ) * scale;
    });
    return layers;
}