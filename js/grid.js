
//// Direction constants pseudo-namespace you're a wizard Harry
const Direction = 
{
    left:   'directionLeft',
    right:  'directionRight',
    up:     'directionUp',
    down:   'directionDown',
    vertical:   'directionVertical',
    horizontal: 'directionHorizontal'
};

//// Gem types
const Gem =
{
    RedLeft:
    {
        gravDir: Direction.left
    },
    BlueLeft:
    {
        gravDir: Direction.left
    },
    RedUp:
    {
        gravDir: Direction.up
    },
    BlueUp:
    {
        gravDir: Direction.up
    },
    RedRight:
    {
        gravDir: Direction.right
    },
    BlueRight:
    {
        gravDir: Direction.right
    },
    RedDown:
    {
        gravDir: Direction.down
    },
    BlueDown:
    {
        gravDir: Direction.down
    }
};

var Grid = 
{
    gravDir: Direction.down,
    
    squares:
    {   // Efficiency or whimsy? You decide!
        0x00: new Square(0, 0),
        0x10: new Square(1, 0),
        0x20: new Square(2, 0),
        0x30: new Square(3, 0),
        0x40: new Square(4, 0),
        0x50: new Square(5, 0),
        0x60: new Square(6, 0),
        0x70: new Square(7, 0),
        
        0x01: new Square(0, 1),
        0x11: new Square(1, 1),
        0x21: new Square(2, 1),
        0x31: new Square(3, 1),
        0x41: new Square(4, 1),
        0x51: new Square(5, 1),
        0x61: new Square(6, 1),
        0x71: new Square(7, 1),
        
        0x02: new Square(0, 2),
        0x12: new Square(1, 2),
        0x22: new Square(2, 2),
        0x32: new Square(3, 2),
        0x42: new Square(4, 2),
        0x52: new Square(5, 2),
        0x62: new Square(6, 2),
        0x72: new Square(7, 2),
        
        0x03: new Square(0, 3),
        0x13: new Square(1, 3),
        0x23: new Square(2, 3),
        0x33: new Square(3, 3),
        0x43: new Square(4, 3),
        0x53: new Square(5, 3),
        0x63: new Square(6, 3),
        0x73: new Square(7, 3),
        
        0x04: new Square(0, 4),
        0x14: new Square(1, 4),
        0x24: new Square(2, 4),
        0x34: new Square(3, 4),
        0x44: new Square(4, 4),
        0x54: new Square(5, 4),
        0x64: new Square(6, 4),
        0x74: new Square(7, 4),
        
        0x05: new Square(0, 5),
        0x15: new Square(1, 5),
        0x25: new Square(2, 5),
        0x35: new Square(3, 5),
        0x45: new Square(4, 5),
        0x55: new Square(5, 5),
        0x65: new Square(6, 5),
        0x75: new Square(7, 5),
        
        0x06: new Square(0, 6),
        0x16: new Square(1, 6),
        0x26: new Square(2, 6),
        0x36: new Square(3, 6),
        0x46: new Square(4, 6),
        0x56: new Square(5, 6),
        0x66: new Square(6, 6),
        0x76: new Square(7, 6),
        
        0x07: new Square(0, 7),
        0x17: new Square(1, 7),
        0x27: new Square(2, 7),
        0x37: new Square(3, 7),
        0x47: new Square(4, 7),
        0x57: new Square(5, 7),
        0x67: new Square(6, 7),
        0x77: new Square(7, 7)
    },
    
    getSquare: function(x, y)
    {
        return this.squares[ (x << 4) | y ];
    }
};

// Square object constructor
function Square(x, y)
{
    Object.defineProperty(this, 'x', { value: x, enumerable: true });
    Object.defineProperty(this, 'y', { value: y, enumerable: true });
    
    Object.defineProperty(this, 'quark', { value: null, writable: true, enumerable: true });
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

function matchEvent( /*?*/ )
{
    var evt;
    
    var detailObj =
        {
            squares:   [],
            alignment: Direction.vertical
            // etc.
        };
    
    // check if CustomEvent constructor will work
    if (typeof CustomEvent === 'function')
    {
        evt = new CustomEvent("match", { detail: detailObj });
    }
    else // Internet Explorer (probably), have to use the old deprecated way
    {
        evt = document.createEvent('CustomEvent');
        evt.initCustomEvent("match", false, false,
            {
                squares:   [],
                alignment: Direction.vertical
            });
    }
}



//// command-line only stuff for testing purposes
if (typeof process != 'undefined')
{    
    var squareTest = Grid.getSquare(3, 5);
    
    console.log(squareTest.x, squareTest.y);
    
    squareTest.x = 6;
    
    console.log(squareTest.x, squareTest.y);
    
    console.log(squareTest.gem);
    
    squareTest.gem = "lolgem";
    
    console.log(squareTest.gem);
    
    var squareTroll = Grid.squares[0x70];
    squareTroll.gem = "trollol";
    
    console.log(squareTroll.x, squareTroll.y, squareTroll.gem);
    console.log(squareTest.x, squareTest.y, squareTest.gem);
    
    console.log(Object.keys(squareTest));    
}
