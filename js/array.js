// Kyle Fiegener

if (typeof Array.prototype.first === 'undefined')
{
    Array.prototype.first = function()
    {
        return this[0];
    };
}

if (typeof Array.prototype.last === 'undefined')
{
    Array.prototype.last = function()
    {
        return this[this.length-1];
    };
}

if (typeof Array.prototype.remove === 'undefined')
{
    Array.prototype.remove = function(member) 
    {
        var index = this.indexOf(member);
        if (index > -1) 
        {
            this.splice(index, 1);
        }
        return this;
    };
}

if (typeof Array.prototype.singleDepthCopy === 'undefined')
{
    Array.prototype.singleDepthCopy = function()
    {
        var copy = this.map(function(member) { return member; });
        
        return copy;
    }
}

//Game.spawnSquares = Game.dirtySquares.map(function(square) { return square; });