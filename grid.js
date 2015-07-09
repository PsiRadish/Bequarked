
var Grid = []

function Square(x, y)
{
    Object.defineProperty(this, 'x', { value: x, enumerable: true });
    Object.defineProperty(this, 'y', { value: y, enumerable: true });
    
    Object.defineProperty(this, 'gem', { value: null, writable: true, enumerable: true });
    
    Object.defineProperty(this, 'gravUp',    { value: 0, writable: true, enumerable: true });
    Object.defineProperty(this, 'gravDown',  { value: 0, writable: true, enumerable: true });
    Object.defineProperty(this, 'gravLeft',  { value: 0, writable: true, enumerable: true });
    Object.defineProperty(this, 'gravRight', { value: 0, writable: true, enumerable: true });
}

// Object.defineProperty(Square.prototype, 'gem',
//     {   get: function()
//         {
//             return this._gem;
//         },
//         set: function(newGem)
//         {
//             this._gem = newGem;
//         },
//         enumerable: true
//     });

// Object.defineProperty(Square.prototype, 'gravUp',
//     {   get: function()
//         {
//             return this._gravUp;
//         },
//         set: function(value)
//         {
//             this._gravUp = value;
//         },
//         enumerable: true
//     });
// Object.defineProperty(Square.prototype, 'gravDown',
//     {   get: function()
//         {
//             return this._gravDown;
//         },
//         set: function(value)
//         {
//             this._gravDown = value;
//         },
//         enumerable: true
//     });
// Object.defineProperty(Square.prototype, 'gravLeft',
//     {   get: function()
//         {
//             return this._gravLeft;
//         },
//         set: function(value)
//         {
//             this._gravLeft = value;
//         },
//         enumerable: true
//     });
// Object.defineProperty(Square.prototype, 'gravRight',
//     {   get: function()
//         {
//             return this._gravRight;
//         },
//         set: function(value)
//         {
//             this._gravRight = value;
//         },
//         enumerable: true
//     });

var squareTest = new Square(3, 5);

console.log(squareTest.x, squareTest.y);

squareTest.x = 6;

console.log(squareTest.x, squareTest.y);

console.log(squareTest.gem);

squareTest.gem = "lolgem";

console.log(squareTest.gem);

var squareTroll = new Square(9, 0);
squareTroll.gem = "trollol";

console.log(squareTroll.x, squareTroll.y, squareTroll.gem);
console.log(squareTest.x, squareTest.y, squareTest.gem);

console.log(squareTest.gravLeft, squareTest.gravRight, squareTest.gravDown, squareTest.gravUp);
console.log(Object.keys(squareTest));
