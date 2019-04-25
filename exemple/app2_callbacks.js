require('babel-register');

console.log("début");

getMember((member) => {
    console.log(member)
    getArticles(member, (articles) => {
        console.log(articles)
    })
})

console.log("Fin");

function getMember(next) {
    setTimeout(() => {
        next('Member 1 ')
    }, 1500)

}

function getArticles(member, next) {
    setTimeout(() => {
        next([1,2,3])
    }, 1500)
}

