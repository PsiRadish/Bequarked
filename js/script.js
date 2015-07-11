
var Animating = false; // input ignored while true

// returns true if a and b are within 0.4 of each other
function closeEnough(a, b)
{
    return ( Math.abs(a - b) <= 0.4 );
}

$(main);

function main()
{
    var gameArea = $("#game");
    var board = $("#board");
    
    // size the board appropriately
    function sizeGame(e)
    {
        var playerWithTurn = $('.player.my-turn-yes');
        
        // remove inline styles previously added by jQuery,
        // reverting to slightly-broken CSS-only sizing
        gameArea.removeAttr('style');
        board.removeAttr('style');
        playerWithTurn.removeAttr('style');
        
        if (!closeEnough(board.height(), board.width())) // height and width are different
        {
            if (board.width() > board.height())
            {
                // want to maintain ratio between board width and gameArea width
                // first, get that ratio
                var ratio = board.width() / gameArea.width();
                // now apply it in reverse to the board width we want (same as height) and apply to game area
                gameArea.width(board.height() / ratio);
            }
            else // board height > board width
            {   // well this is easier to fix
                gameArea.height(board.width());
            }
        }
        
        //box-shadow: inset 0 0 22px 22px black
        
        var shadowPower = Math.round(playerWithTurn.height() * 0.055);
        var shadowString = 'inset 0 0 ' + shadowPower + 'px ' + shadowPower + 'px black';
        playerWithTurn.css('box-shadow', shadowString);
    }
    sizeGame();
    // do it again on resize
    $(window).resize(sizeGame);
}
