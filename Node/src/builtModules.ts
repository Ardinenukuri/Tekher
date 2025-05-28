const path = require('path')
const greet = require('./grettings')

console.log('currentfile:', path.basename(__filename) )
console.log('Directory:', path.basename((__dirname)))
console.log(greet('Klab Team'))