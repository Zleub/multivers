function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

const euclidean_distance = (a, b) => Math.sqrt( Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) )
const test_distance = (p) => (a,b) => Math.sqrt( Math.pow(a.x - p.x, 2) + Math.pow(a.y - p.y, 2) ) < Math.sqrt( Math.pow(b.x - p.x, 2) + Math.pow(b.y - p.y, 2) )
const test = test_distance( {x: 10, y: 10} )

let t = [
	{x: 0, y: 0},
	{x: 1, y: 1},
	{x: 2, y: 2},
	{x: 3, y: 3},
	{x: 10, y: 10},
	{x: 3, y: 4},
	{x: 3, y: 7}
]

console.log(t)

t.sort(test)

console.log(t)

console.log('---------------')

t = shuffle(t)

console.log(t)

t.sort(test)

console.log(t)
