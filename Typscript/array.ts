//arrays, if condition, switch, loops
const candidates: string[] = [];
candidates.push('kozo');
candidates.push('ola')
candidates.push('okay')
candidates.push('lolo')

console.log(candidates.length);

//for loop

for(let i=1; i<candidates.length; i++){
    console.log(candidates[i]);
}
for(let i=candidates.length-1; i>0; i--){
    console.log(candidates)
}
for(const candidate of candidates){
    console.log(candidates);
}

//while loop

let i=0;
while(i<=5){
    console.log(i);
    i++
}