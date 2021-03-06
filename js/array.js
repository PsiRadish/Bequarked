// Kyle Fiegener
// Array extensions.
// Because REASONS.

if (typeof Array.prototype.first === 'undefined')
{
    Array.prototype.first = function()  // yeah, so I'm lazy
    {
        return this[0];
    };
}

if (typeof Array.prototype.last === 'undefined')
{
    Array.prototype.last = function()  // yeah, so I'm lazy
    {
        return this[this.length-1];
    };
}

if (typeof Array.prototype.remove === 'undefined')
{
    Array.prototype.remove = function(member)  // yeah, so I'm SUPER lazy
    {
        var index = this.indexOf(member);
        if (index > -1) 
        {
            this.splice(index, 1);
        }
        return this;
    };
}

if (typeof Array.prototype.union === 'undefined')
{   
    // Array.concat without duplicate values
    Array.prototype.union = function(other)
    {
        var hash = {};
        // add array elements to hash using their own value as key, eliminating duplicates
        for (var i = 0; i < this.length; i++)
            hash[this[i]] = this[i];
        for (i = 0; i < other.length; i++)
            hash[other[i]] = other[i];
        
        // convert back to an array
        var union = [];
        for (var k in hash)
        {
            if (hash.hasOwnProperty(k))  // <-- optional
                union.push(hash[k]);
        }
        
        return union;
    }
}

/*if (typeof Array.prototype.singleDepthCopy === 'undefined')
{
    Array.prototype.singleDepthCopy = function()  // It's useful, I swear.
    {
        var copy = this.map(function(member) { return member; });
        
        return copy;
    }
}*/
