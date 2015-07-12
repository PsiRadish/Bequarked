// Kyle Fiegener
// BEQUARKED

$(main);

// returns true if a and b are within 0.4 of each other
function closeEnough(a, b)
{
    return ( Math.abs(a - b) <= 0.4 );
}

function main()
{
    //var gameView = $(STYLE.sel.gameView);
    var gameView = $('#game');
    
    Game.init(gameView[0]);
    
    //var board = $(STYLE.sel.board);
    var board = $('#board');
    
    var playerPanes = $('.player');
    var player1Pane = $('.player-1');
    var player2Pane = $('.player-2');
    
    
    // size the board appropriately
    function sizeGame(e)
    {
        //var playerPaneWithTurn = $(STYLE.sel.playerPane + STYLE.sel.myTurn);
        var playerPaneWithTurn = playerPanes.filter('.my-turn');
        
        // remove inline styles previously added by jQuery,
        // reverting to slightly-broken CSS-only sizing
        gameView.removeAttr('style');
        board.removeAttr('style');
        playerPaneWithTurn.removeAttr('style');
        
        if (!closeEnough(board.height(), board.width())) // height and width are different
        {
            if (board.width() > board.height())
            {
                // want to maintain ratio between board width and gameView width
                // first, get that ratio
                var ratio = board.width() / gameView.width();
                // now apply it in reverse to the board width we want (same as height) and apply to game area
                gameView.width(board.height() / ratio);
            }
            else // board height > board width
            {   // well this is easier to fix
                gameView.height(board.width());
            }
        }
        
        //box-shadow: inset 0 0 22px 22px black
        
        var shadowPower = Math.round(playerPaneWithTurn.height() * 0.055);
        var shadowString = 'inset 0 0 ' + shadowPower + 'px ' + shadowPower + 'px black';
        playerPaneWithTurn.css('box-shadow', shadowString);
    }
    sizeGame();
    
    // do it again on resize
    $(window).resize(sizeGame);
    
    // FitText.js calls for fully responsive text
    $('.player h2').fitText(0.38333333333333333333333333333333); // 30px font size at max game size
    $('.player h3').fitText(0.47916666666666666666666666666667); // 24px font size at max game size
    //$('#title-container h1').fitText(0.68125);                   // 160px font size at max game size
    $('#title-container h1').fitText(0.77857142857142857142857142857143);                   // 160px font size at max game size
    
    function initSwap()
    {
        
    }
    
    function turnChanged(newTurn, oldTurn)
    {
        playerPanes.removeClass("my-turn");
        board.removeClass("player-" + oldTurn + "-turn");
        
        $('#player-' + newTurn).addClass("my-turn");
        board.addClass("player-" + newTurn + "-turn");
    }
    
    board.on('click', function(e)
    {
        if (!Game.animating)
        {
            var clickedQuark = $(e.target).closest(".quark-container");
                                    
            if (clickedQuark.hasClass('selected')) // this quark is already selected
            {
                // deselect it
                clickedQuark.removeClass('selected');
                
                return;
            }
            
            var selectedQuark = $(".selected");
            
            if (!selectedQuark.length) // no quark already selected
            {
                // select the clicked quark
                clickedQuark.addClass('selected');
            }
            else
            {
                //initSwap();
                
            }
            
            // !!!!! TEMPORARY: TURN CHANGE TEST !!!!!
            var oldTurn = Game.turn;
            Game.turn = (oldTurn == 1) ? 2 : 1;
            
            turnChanged(Game.turn, oldTurn);
            // !!!!! TEMPORARY: TURN CHANGE TEST !!!!!
        }
    });
}
