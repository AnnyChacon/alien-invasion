const file = require('./file');

file.read('./Files/input.txt', function (err, data) {
    if(err){
        console.error(err);
        return;
    }
    let output = [];
    let error = false;
    const lines = data.split('\n');
    const n = Number(lines[0]);
    let line = [];
    let numberLine = 1;
    if (n >= 1 && n <= 30) {
        for (let i = 0; i < n; i++) {
            if(!error && numberLine < lines.length){
                line = lines[numberLine].split(' ').map(Number);
                numberLine++;
                if(!error && numberLine < lines.length && typeof line[0] !== 'undefined' && typeof line[1] !== 'undefined' && typeof line[2] !== 'undefined' && line[0] >= 4 && line[0] <= 100 && line[1] >= 4 && line[1] <= 100){
                    let ship = [];
                    for (let j = numberLine; j < (line[0] + numberLine); j++) {
                        let subLine = lines[j].split(' ').map(value => {
                            return /[a-zA-Z]/.test(value) ? value : ' ';
                        })
                        ship.push(subLine);
                    }
                    numberLine += line[0];
                    let layers = getLevels( getAreasCenterPoint( getLayers(ship), line[2] ) , ship);
                    layers = layers.sort(function ( a, b ) {
                        if ( a.id < b.id ){
                            return -1;
                        }
                        if ( a.id > b.id ){
                            return 1;
                        }
                        return 0;
                        }).sort((a, b) => a.area - b.area).sort((a, b) => a.level - b.level);
                    let leyersString = [];
                    layers.forEach(layer => {
                        if(typeof leyersString[layer.level] !== 'undefined'){
                            leyersString[layer.level] += `;${layer.id}:${layer.centerPointX},${layer.centerPointY}`;
                        }else{
                            leyersString[layer.level] = `${layer.id}:${layer.centerPointX},${layer.centerPointY}`;
                        }
                    });
                    output.push(leyersString.join(' '));
                    ship = [];
                    layers = [];
                }
            }else{
                error = true;
                console.error('Something went wrong, unexpected X, Y or Scale value.');
                break;
            }
        }
        if(!error && output.length){
            file.write('./Files/output.txt',output.join('\n'), function (err) {
                if (err){
                    console.error('There was a mistake',err);
                }
            });
            console.log('File generated successfully!');
            console.log('output.txt');
            file.read('./Files/output.txt', function (err, data) {
                if(err){
                    console.error(err);
                    return;
                }
                console.log(data);
            });
        }else{
            console.error('Something went wrong, there is nothing to write.');
        }
    }else{
        console.error('Something went wrong, unexpected N value.');
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
        layer.area = (layer.base * layer.height * scale).toFixed(3);
        layer.centerPointX = (( ( layer.height / 2 ) + layer.xa ) * scale).toFixed(3);
        layer.centerPointY = (( ( layer.base / 2 ) + layer.ya ) * scale).toFixed(3);
    });
    return layers;
}

function getLevels(layers, ship) {
    let count = 0;
    for (let level = 0; level < layers.length; level++) {
        for (let l = 0; l < layers.length; l++) {
            count = 0;
            if(typeof layers[l].level === 'undefined'){
                for (let x = layers[l].xa; x <= layers[l].xb; x++) {
                    for (let y = layers[l].ya; y <= layers[l].yb; y++) {
                        if(layers[l].id === ship[x][y]){
                            count++;
                        }else{
                            const aux = layers.filter(layer => layer.id === ship[x][y])[0];
                            if(aux && aux.level < level){
                                count++;
                            }
                        }
                    }
                }
                if(count === (layers[l].base * layers[l].height)){
                    layers[l].level = level;
                }
            }
        }
    }
    return layers;
}