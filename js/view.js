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
    // var player1Pane = $('.player-1');
    // var player2Pane = $('.player-2');
    
    // TIMEOUT IN LOOP TEST
    // for (var i = 0; i < 10; i++)
    // {
    //     var tId = window.setTimeout(function()
    //     {
    //         console.log(i, tId);
    //     }, 500);
    // };
    
    // size the board appropriately
    function sizeGame()
    {
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
    $('#title-container').find('h1').fitText(0.77857142857142857142857142857143);  // 140px font size at max game size
    $('#winner-display').fitText(0.90825688073394495412844036697248); // 99px font size at max game size
    
    
    // callback of doom
    /*function removeElement(e)
    {
        $(this).remove();
    }*/
    
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
        var quarkElement = $('<div class="grid-element"> <div class="arrow-container"></div></div>');
        quarkElement.addClass("x" + gameSquare.x + " y" + gameSquare.y + " quark-container");
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
            
            var aQuarkClass = quarkClassRegex.exec($quarkA.attr('class'))[1];
            var bQuarkClass = quarkClassRegex.exec($quarkB.attr('class'))[1];
            
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
                    Game.swapQuarks(selectedSquare, clickedSquare);
                    
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
    
    //// CUSTOM EVENT LISTENERS
    
    // GameStart – Game start, fill in the board without any animation
    gameView.on(Game.EventType.GameStart, function(e, gameSquares)
    {
        board.html(''); // clear the board
        
        for (var gridKey in gameSquares)
        {   var currSquare = gameSquares[gridKey];
            
            //var quarkElement = quarkElementFromGameSquare(currSquare);
            
            quarkElementFromGameSquare(currSquare).appendTo(board);
        }
    });
    
    // swap:success – Player move was valid, show the quarks switching places
    gameView.on(Game.EventType.BoardSwapSuccess, function(e, squareA, squareB)
    {
        var queryA = '.quark-container.x'+squareA.x+'.y'+squareA.y;
        var queryB = '.quark-container.x'+squareB.x+'.y'+squareB.y;
        
        doAnimateSwapSuccess($(queryA), $(queryB));
    });
    
    // swap:fail – Player move was invalid, show the quarks failing to switch places
    gameView.on(Game.EventType.BoardSwapFail, function(e, squareA, squareB)
    {
        var queryA = '.quark-container.x'+squareA.x+'.y'+squareA.y;
        var queryB = '.quark-container.x'+squareB.x+'.y'+squareB.y;
        
        animateSwapFail($(queryA), $(queryB));
    });
    
    // due for eminent replacement
    //gameView.on(Game.EventType.BoardRemoveMatches, function(e, matchData, scoreChain, scoreMult)
    // BoardRemoveMatches – Animate removal of quarks.
    gameView.on(Game.EventType.BoardRemoveMatches, function(e, matchSquares, bombSquares, scoreChain, scoreMult)
    {
        // display the score earned for the last match
        var chainString = scoreChain.toString();
        if (scoreMult > 1) // only show multiplier if > 1
            chainString += ' ×' + scoreMult;
        
        $('.my-turn .score-chain').html(chainString);
        
        pauseInput();
        Game.animating = true;
        
        var animDur = 400;
        
        var doomedQuarks = []; // need to go over quarks again after delay, so I'll keep a collection
        
        // for (var gridKey in matchData)
        matchSquares.forEach(function(currSquare)
        {   //var currDatum = matchData[gridKey];
            //var currSquare = currDatum.square;
            
            var doomedQuark = $('.quark-container.x' + currSquare.x + '.y' + currSquare.y);
            doomedQuarks.push(doomedQuark);
            
            //// • CSS animation
            // var animClass = 'distorting matching';
            var animClass = 'matching';
            switch (currSquare.matchAlignment)
            {
                case Alignment.Horizontal:
                    animClass += ' h-match';
                    break;
                case Alignment.Vertical:
                    animClass += ' v-match';
                    break;
                case Alignment.Horizontal | Alignment.Vertical:
                    animClass += ' hv-match';
                    break;
            }
            
            // adding these classes will initiate CSS animations
            doomedQuark.addClass(animClass); //*/
            
            /*// • GreenSock animation
            var animParams =
            {
                ease: Power4.easeInOut,
                onCompleteScope: doomedQuark,
                onComplete: function()
                {
                    // $this = $(this);
                    
                    // how many fucking ways do I have to say this before you'll fucking do it?
                    TweenLite.killTweensOf(this);
                    TweenLite.killTweensOf(this[0]);
                    this.removeAttr('style');
                }
            };
            
            switch (currSquare.matchAlignment)
            {
             case Alignment.Horizontal:
                animParams.scaleX = 2;
                animParams.scaleY = 0;
                break;
             case Alignment.Vertical:
                animParams.scaleX = 0;
                animParams.scaleY = 2;
                break
             case Alignment.Horizontal | Alignment.Vertical:
                ///// TEMPORARY?
                animParams.scaleX = 0;
                animParams.scaleY = 0;
                break;
            }
            
            TweenLite.to(doomedQuark, animDur/1000, animParams); //*/
        });
        
        // wait for animations to finish
        window.setTimeout(function()
        {
            doomedQuarks.forEach(function(doomedQuark)
            {   // empty it out hard
                doomedQuark.removeClass("ring-red ring-blue arrow-up arrow-down arrow-left arrow-right");
                doomedQuark.removeClass("distorting matching h-match v-match hv-match");
                // doomedQuark.removeAttr('style');
            });
            
            unpauseInput();
            Game.animating = false;
            
        }, animDur);
    });
    
    // BoardNewQuarks – Spawn new quarks.
    gameView.on(Game.EventType.BoardNewQuarks, function(e, newSquares)
    {
        pauseInput();
        Game.animating = true;
        
        var animDur = 600;
        
        var newQuarks = []; // need to go over quarks again after delay, so I'll keep a collection
        
        newSquares.forEach(function(newSquare)
        {
            var quarkBox = $('.grid-element.x' + newSquare.x + '.y' + newSquare.y);
            newQuarks.push(quarkBox);
            
            // I'll just blissfully assume the quarkBox isn't already showing a quark
            quarkBox.addClass("quark-container " + newSquare.quark.css + " spawning"); // "spawning" class applies spawning animation
        });
        
        // wait for animations to finish
        window.setTimeout(function()
        {
            newQuarks.forEach(function(newQuark)
            {
                newQuark.removeClass("spawning"); // remove animation class
            });
            
            unpauseInput();
            Game.animating = false;
            
        }, animDur);
    });
    
    // BoardStable – Board ready for player input once again.
    gameView.on(Game.EventType.BoardStable, function(e, newScore)   //gameView.on(Game.EventType.BoardStable, function(e, oldTurn, newTurn, newScore)
    {
        pauseInput();
        Game.animating = true;
        
        // TODO: animate score chain moving up into total score before changing these values
        $('.my-turn .score').html(newScore);
        $('.my-turn .score-chain').html('');
        
        // playerPanes.removeClass("my-turn");
        // board.removeClass("player-" + oldTurn + "-turn");
        
        //$('#player-' + newTurn).addClass("my-turn");
        //board.addClass("player-" + newTurn + "-turn");
        
        unpauseInput();
        Game.animating = false;
    });
    
    gameView.on(Game.EventType.GameOver, function(e, winner)
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
