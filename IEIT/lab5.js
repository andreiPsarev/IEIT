class Recogn{
    constructor(filename) {
        this.filename = filename;
        this.average_vector = [];
        this.basic_vector = [];
        this.limit_max = [];
        this.limit_min = [];
        this.binary_temp = [];
        this.binary_arr = [];
        this.counter = [];
        let base_limit_min = [];
        let base_limit_max = [];
      }
    reading(){
        const fs = require('fs');
        const readFile = path => fs.readFileSync(path, 'utf8');

        const dataFile = readFile(this.filename);
        this.data = JSON.parse(dataFile);
        console.log(this.filename);
        return this.data;
    }
    average(){
        this.average_vector = [];
            for(let i = 0; i < 10; i ++){
                let average = 0;
                for(let j = 0; j < 10; j ++){
                    average += this.data[j][i]/10;
                }
                this.average_vector.push(Number(average.toFixed(2)));
            }
        return this.average_vector;
    }
    limit(){
        this.limit_min = [];
        this.limit_max = [];
        
        for(let i = 0; i < 10; i ++){
            this.limit_max.push(Number((this.average_vector[i] + 20).toFixed(2)));
            this.limit_min.push(Number((this.average_vector[i] - 20).toFixed(2)));
        }
        return this.limit_max, this.limit_min;
    }
    binary(max, min){
        this.binary_temp = [];
        this.binary_arr = [];
        this.array_size = 10;
        this.counter = [];

        for(let i = 0; i < 10; i ++){
            for(let j = 0; j < 10; j ++){
                if(this.data[i][j] >= min[j] && this.data[i][j] <= max[j])
                    this.binary_temp.push(1);
                else 
                    this.binary_temp.push(0);
            }
        }

        for (let i = 0; i < this.binary_temp.length; i += this.array_size) {
            this.binary_arr.push(this.binary_temp.slice(i, i + this.array_size));
        }
        
        //console.log(this.binary_arr);    

        for(let i = 0; i < 10; i ++){
            this.temp = this.binary_arr[i];
            let count_1 = 0;
            let count_0 = 0;
        
            for(let j = 0; j < 10; j ++){
                if(this.binary_arr[j][i] == 1)
                    count_1 ++;
                
                if(this.binary_arr[j][i] == 0)
                    count_0 ++;
            }
        
            if(count_1 > count_0)
                this.counter.push(1);
            else
                this.counter.push(0);
        }
        console.log(this.counter);
        return this.counter;
    }
}

class Radius{
    constructor(first, second) {
        this.first = first;
        this.second = second;
        this.count = 0;
        this.k1 = 0;
        this.k2 = 0;
    }
    distance(first, second){
        this.count = 0;
        for(let i = 0; i < 10; i ++){
            if(this.first[i] !== this.second[i])
                this.count ++;
        }
        return this.count;
    }

    optim(first, second){
        for(let rad = 0; rad < 10; rad ++){
            this.count = 0;
            this.k1 = 0;
            this.k2 = 0;
            for(let i = 0; i < 10; i ++){
                if(this.first <= rad)
                this.k1++;
                else
                this.k2--;
            }
        }
        return [this.k1, this.k2];

    }
}
let min = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let max = [255, 255, 255, 255, 255, 255, 255, 255, 255, 255];

let first = new Recogn('matrix.json');
first.reading();
first.average();
first.limit();
min = first.limit_min;
max = first.limit_max;
first.binary(max, min);

let second = new Recogn('water.json');
second.reading();
second.average();
second.limit();
second.binary(max, min);

console.log("/////////////////////////");

let third = new Recogn('tree.json');
third.reading();
third.average();
third.limit();
third.binary(max, min);



console.log("////////////Radiuses///////////");

let neigh = [];

function optRadius(f_rad, s_rad) {
    for(let i = 0; i < 10; i ++){
    let k1 = 0;
    let k2 = 0;
    let t_d1, t_betta, d1_b = 0;
        for(let j = 0; j < 10; j ++){
            let radius_1_2 = new Radius(f_rad.binary(max, min), f_rad.binary_arr[j]);
            let radius_1_3 = new Radius(s_rad.binary(max, min), f_rad.binary_arr[j]);
            if(radius_1_2.distance() < i)
                k1++;
            if(radius_1_3.distance() < i)
                k2++;

            console.log(radius_1_2.distance());
            console.log(radius_1_3.distance());
            console.log(i);
        }
        t_d1 = k1/10;
        t_betta = k2/10;
        d1_b = t_d1 - t_betta;

        let kfe = d1_b * Math.log((1 + d1_b + 0.1) / (1 - d1_b + 0.1)) / Math.log(2);
        let a = Math.log((1 + d1_b + 0.1) / (1 - d1_b + 0.1));

        neigh.push(kfe);
        console.log(kfe);
    }

}

let ex = optRadius(first, second);
let result = 0;
console.log(neigh);
let minres = neigh[0];
let maxres = 0;
for(let i =0; i < neigh.length; i ++){
    if (neigh[i] > maxres) maxres = i + 1;
    if (neigh[i] < minres) minres = i + 1;
}
console.log("The maximum value is " + Math.max(...neigh) + " of radius" + maxres);