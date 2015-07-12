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
    $('#title-container h1').fitText(0.77857142857142857142857142857143);  // 140px font size at max game size
    $('#winner-display').fitText(0.90825688073394495412844036697248); // 99px font size at max game size
    
    
    // callback of doom
    function removeElement(e)
    {
        $(this).remove();
    }
    
    var xCoordRegex = /[^\w-]x([0-7])[^\w-]/;
    var yCoordRegex = /[^\w-]y([0-7])[^\w-]/;
    // extract x y grid coordinates as integers from a class attribute value string
    function extractCoords(classString)
    {
        var coords = {};
        
        coords.x = parseInt(xCoordRegex.exec(classString)[1]);
        coords.y = parseInt(yCoordRegex.exec(classString)[1]);
        
        return coords;
    }
    
    function quarkElementFromGameSquare(gameSquare)
    {
        var quarkElement = $('<div class="grid-element quark-container"> <div class="arrow-container"></div></div>');
        quarkElement.addClass("x" + gameSquare.x + " y" + gameSquare.y);
        quarkElement.addClass(gameSquare.quark.css);
        
        return quarkElement;
    }
    
    function pauseInput()
    {
        board.removeClass('taking-input');
    }
    function unpauseInput()
    {
        board.addClass('taking-input');
    }
    
    var quarkClassRegex = /[^\w-](ring-\w+ +arrow-\w+)/;
    function doAnimateSwapSuccess($quarkA, $quarkB)
    {
        pauseInput();
        Game.animating = true;
        
        var swapDirectionA;
        var swapDirectionB;
                
        if ($quarkA.css('top') == $quarkB.css('top'))
        {   // horizontal swap
            if (parseFloat($quarkA.css('left')) > parseFloat($quarkB.css('left')))
            {
                swapDirectionA = 'left';
                swapDirectionB = 'right';
            }
            else
            {
                swapDirectionA = 'right';
                swapDirectionB = 'left';
            }
        }
        else
        {   // vertical swap
            if (parseFloat($quarkA.css('top')) > parseFloat($quarkB.css('top')))
            {
                swapDirectionA = 'up';
                swapDirectionB = 'down';
            }
            else
            {
                swapDirectionA = 'down';
                swapDirectionB = 'up';
            }
        }
        
        // .swapping.left-swap
        var animClassesA = 'distorting swapping ' + swapDirectionA + '-swap';
        var animClassesB = 'distorting swapping ' + swapDirectionB + '-swap';
        // adding these classes will initiate CSS animations
        $quarkA.addClass(animClassesA);
        $quarkB.addClass(animClassesB);
        
        // wait for CSS animations to finish
        window.setTimeout(function()
        {
            // clear animation classes
            $quarkA.removeClass(animClassesA);
            $quarkB.removeClass(animClassesB);
            
            aQuarkClass = quarkClassRegex.exec($quarkA.attr('class'))[1];
            bQuarkClass = quarkClassRegex.exec($quarkB.attr('class'))[1];
            
            // swap the CSS classes that determine which ring and arrow to show
            $quarkA.removeClass(aQuarkClass);
            $quarkA.addClass(bQuarkClass);
            $quarkB.removeClass(bQuarkClass);
            $quarkB.addClass(aQuarkClass);
            
            unpauseInput();
            Game.animating = false;
        }, 300);
    }
    
    function animateSwapFail($quarkA, $quarkB)
    {
        pauseInput();
        Game.animating = true;
        
        var swapDirectionA;
        var swapDirectionB;
                
        if ($quarkA.css('top') == $quarkB.css('top'))
        {   // horizontal swap
            if (parseFloat($quarkA.css('left')) > parseFloat($quarkB.css('left')))
            {
                swapDirectionA = 'left';
                swapDirectionB = 'right';
            }
            else
            {
                swapDirectionA = 'right';
                swapDirectionB = 'left';
            }
        }
        else
        {   // vertical swap
            if (parseFloat($quarkA.css('top')) > parseFloat($quarkB.css('top')))
            {
                swapDirectionA = 'up';
                swapDirectionB = 'down';
            }
            else
            {
                swapDirectionA = 'down';
                swapDirectionB = 'up';
            }
        }
        
        var animClassesA = 'distorting swap-fail ' + swapDirectionA + '-swap-fail';
        var animClassesB = 'distorting swap-fail ' + swapDirectionB + '-swap-fail';
        // adding these classes will initiate CSS animations
        $quarkA.addClass(animClassesA);
        $quarkB.addClass(animClassesB);
        
        // wait for CSS animations to finish
        window.setTimeout(function()
        {
            // clear animation classes
            $quarkA.removeClass(animClassesA);
            $quarkB.removeClass(animClassesB);
            
            unpauseInput();
            Game.animating = false;
        }, 210);
    }
    
    board.on('click', function(e)
    {
        if (board.is('.taking-input') && !Game.animating)
        {
            var clickedQuark = $(e.target).closest('.quark-container');
            
            if (clickedQuark.hasClass('selected')) // this quark is already selected
            {
                // deselect it
                clickedQuark.removeClass('selected');
                
                return; // and done
            }
            
            var selectedQuark = $('.selected');
            
            if (!selectedQuark.length) // no quark already selected
            {
                // select the clicked quark
                clickedQuark.addClass("selected");
                
                return; // and done
            }
            else
            {
                var selectedCoords = extractCoords(selectedQuark.attr('class'));
                var clickedCoords = extractCoords(clickedQuark.attr('class'));
                
                // check for adjacency
                if ((selectedCoords.x == clickedCoords.x && Math.abs(selectedCoords.y - clickedCoords.y) == 1) ||
                    (selectedCoords.y == clickedCoords.y && Math.abs(selectedCoords.x - clickedCoords.x) == 1))
                {
                    // deselect quarks
                    selectedQuark.removeClass("selected");
                    
                    var selectedSquare = Game.Grid.getSquare(selectedCoords.x, selectedCoords.y);
                    var clickedSquare = Game.Grid.getSquare(clickedCoords.x, clickedCoords.y);
                    
                    // try the swap
                    Game.Grid.swapQuarks(selectedSquare, clickedSquare);
                    
                    return;
                    // we'll have to wait for an event to learn the results
                }
                else // too far away for swap, so select the new quark instead
                {
                   selectedQuark.removeClass("selected");
                   clickedQuark.addClass("selected");
                }
            }
        }
    });
    
    // CUSTOM EVENT LISTENERS
    gameView.on('board:start', function(e, gameSquares)
    {
        board.html(''); // clear the board
        
        for (var gridKey in gameSquares)
        {   var currSquare = gameSquares[gridKey];
            
            //var quarkElement = quarkElementFromGameSquare(currSquare);
            
            quarkElementFromGameSquare(currSquare).appendTo(board);
        }
    });
    
    gameView.on('swap:success', function(e, squareA, squareB)
    {
        var queryA = '.quark-container.x'+squareA.x+'.y'+squareA.y;
        var queryB = '.quark-container.x'+squareB.x+'.y'+squareB.y;
        
        doAnimateSwapSuccess($(queryA), $(queryB));
    });
    
    gameView.on('swap:fail', function(e, squareA, squareB)
    {
        var queryA = '.quark-container.x'+squareA.x+'.y'+squareA.y;
        var queryB = '.quark-container.x'+squareB.x+'.y'+squareB.y;
        
        animateSwapFail($(queryA), $(queryB));
    });
    
    gameView.on('matches:remove', function(e, matchData, scoreChain, scoreMult)
    {
        // display the score earned for the last match
        var chainString = scoreChain.toString();
        if (scoreMult > 1) // only show multiplier if > 1
            chainString += ' ×' + scoreMult;
        
        $('.my-turn .score-chain').html(chainString);
        
        pauseInput();
        Game.animating = true;
        
        var animDur = 300;
        
        for (var gridKey in matchData)
        {   var currDatum = matchData[gridKey];
            var currSquare = currDatum.square;
            
            var doomedQuark = $('.quark-container.x' + currSquare.x + '.y' + currSquare.y);
            
            // !!!!! Temporary fade out animation
            doomedQuark.fadeOut(animDur, removeElement);
        }
        
        // wait for animations to finish
        window.setTimeout(function()
        {
            unpauseInput();
            Game.animating = false;
        }, animDur);
    });
    
    gameView.on('board:newQuarks', function(e, newSquares)
    {
        pauseInput();
        Game.animating = true;
        
        var animDur = 500;
        
        newSquares.forEach(function(newSquare)
        {
            var newQuark = quarkElementFromGameSquare(newSquare);
            
            newQuark.appendTo(board);
            
            // !!!!!!!! TEMPORARY FADE ANIM
            newQuark.fadeIn(animDur);
        });
        
        // wait for animations to finish
        window.setTimeout(function()
        {
            unpauseInput();
            Game.animating = false;
        }, animDur);
    });
    
    gameView.on('board:stable', function(e, oldTurn, newTurn, newScore)
    {
        $('.my-turn .score').html(newScore);
        $('.my-turn .score-chain').html('');
        
        playerPanes.removeClass("my-turn");
        board.removeClass("player-" + oldTurn + "-turn");
        
        $('#player-' + newTurn).addClass("my-turn");
        board.addClass("player-" + newTurn + "-turn");
    });
    
    gameView.on('gameOver', function(e, winner)
    {
        pauseInput();
        
        if (!winner) // tie
        {
            gameView.addClass("tie");
            return;
        }
        
        gameView.addClass("player-" + winner + "-win");
        $('#player-' + winner + ' .score-chain').html("WINNER");
    });
    
    Game.init(gameView); // let's get this STARTED
}
