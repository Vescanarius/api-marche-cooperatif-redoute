require('babel-register');

console.log("début");

let p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('Promise 1')
    }, 1500)
})
let p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('Promise 2')
    }, 3000)
})

//la première venu
// Promise.race([p1,p2])

// attendre tout le monde
Promise.all([p1,p2])
.then((result)=>  console.log(result))


console.log("Fin");

/*

*/
