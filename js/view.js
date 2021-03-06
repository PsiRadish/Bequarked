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
    var gameView = $('#game'),
        board = $('#board');
    
    //var sideBars = $('.sidebar');
    
    //var player1Pane = $('.player-1');
    //var player2Pane = $('.player-2');
    
    // size the board appropriately
    function sizeGame()
    {
        //var playerPaneWithTurn = playerPanes.filter('.my-turn');
        
        // remove inline styles previously added by jQuery, reverting to slightly-broken CSS-only sizing
        gameView.removeAttr('style');
        board.removeAttr('style');
        //playerPaneWithTurn.removeAttr('style');
        
        if (!closeEnough(board.height(), board.width())) // height and width are different
        {
            if (board.width() > board.height())
            {   // Want to maintain ratio between board width and gameView width, so first we need to find out what ratio is.
                var ratio = board.width() / gameView.width();
                // Now apply it in reverse to the board width we want (same as height) and apply to game area
                gameView.width(board.height() / ratio);
            }
            else // board height > board width
            {   // well this is easier to fix
                gameView.height(board.width());
            }
        }
        
        //playerPaneWithTurn.css('box-shadow', shadowString);
    }
    sizeGame();
    // do it again on resize
    $(window).resize(sizeGame);
    
    // use FitText.js for fully scaletastic text
    $('.sidebar h2').fitText(0.41666666666666666666666666666667); // 30px font size at max game size
    $('.sidebar h3').fitText(0.52083333333333333333333333333333, {thisEvents: "visible.fittext"}); // 24px font size at max game size
    $('.instructions .toggle').fitText(0.1); // 16px max
    $('#title-container').find('h1').fitText(0.77857142857142857142857142857143);  // 140px font size at max game size
    $('#winner-display').fitText(0.90825688073394495412844036697248); // 99px font size at max game size
    
    // stuff for keeping view logic and game logic synced
    gameView.waits = []; // don't actually foresee there ever being more than one, but just in case...
    gameView.newWait = function()
    {
        var deferred = $.Deferred();
        gameView.waits.push(deferred.promise());
        return deferred;
    }
    Object.defineProperty(gameView, 'ready',
    {
        get: function()
        {
            var currWaits = gameView.waits.slice(gameView.waits); // shallow copy
            
            // wait for all of them to finish
            var waiting = $.when.apply($, currWaits);
            waiting.done(function ()
            {
                // remove these old waits from list
                currWaits.forEach(function (wait)
                {
                    gameView.waits.remove(wait);
                });
            });
            
            return waiting;
        }
    });
    
    // Helper methods
    var Helper =
    {
        xCoordRegex: /[^\w-]x([0-7])[^\w-]/,
        yCoordRegex: /[^\w-]y([0-7])[^\w-]/,
        // extract x y grid coordinates as integers from a class attribute value string
        extractCoords: function(classString)
        {
            var coords = {};
            
            coords.x = parseInt(Helper.xCoordRegex.exec(classString)[1]);
            coords.y = parseInt(Helper.yCoordRegex.exec(classString)[1]);
            
            return coords;
        },
        
        quarkClassRegex: /[^\w-](ring-\w+ +arrow-\w+)/,
        extractQuarkClass: function($quark)
        {
            return Helper.quarkClassRegex.exec($quark.attr('class'))[1];
        },
        
        createQuarkContainerFromGameSquare: function(gameSquare)
        {
            var quarkElement = $('<div class="grid-element"> <div class="arrow-container"></div></div>');
            quarkElement.addClass("x" + gameSquare.x + " y" + gameSquare.y + " quark-container");
            quarkElement.addClass(gameSquare.quark.css);
            
            return quarkElement;
        },
        
        findGridElementAtCoords: function(elemType, x, y)
        {
            elemType = '.' + elemType + "-container";
            
            return $(elemType + '.x' + x + '.y' + y);
        }
    };
    
    function pauseInput()
    {
        board.removeClass('taking-input');
    }
    function unpauseInput()
    {
        board.addClass('taking-input');
    }
    
    board.on('click', function(e)
    {
        if (board.is('.taking-input'))
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
                var selectedCoords = Helper.extractCoords(selectedQuark.attr('class'));
                var clickedCoords = Helper.extractCoords(clickedQuark.attr('class'));
                
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
    // Instructions Toggle Button
    $('.sidebar.instructions .toggle').on('click', function(e)
    {
        $('.sidebar.instructions').toggleClass('expanded');
        board.toggleClass('taking-input');
        
        $(this).trigger('visible'); // custom event to be heard by modified FitText.js
    });
    
    //// CUSTOM EVENT LISTENERS
    // with non-anonymous functions so they'll show up in code navigation
    
    /// GameStart – Game start, fill in the board without any animation
    function onGameStart(e, gameSquares)
    {
        for (var gridKey in gameSquares)
        {   var gameSquare = gameSquares[gridKey];
            
            //Helper.createQuarkContainerFromGameSquare(gameSquare).appendTo(board);
            var quarkBox = $('<div class="grid-element"> <div class="arrow-container"></div> </div>');
            quarkBox.addClass("x" + gameSquare.x + " y" + gameSquare.y + " quark-container");
            quarkBox.addClass(gameSquare.quark.css);
    
            quarkBox.appendTo(board);
        }
    }
    gameView.on(Game.EventType.GameStart, onGameStart);
    
    /// BoardSwapSuccess – Player move was valid, show the quarks switching places
    function onSwapSuccess(e, squareA, squareB)
    {
        var quarkA = Helper.findGridElementAtCoords('quark', squareA.x, squareA.y);
        var quarkB = Helper.findGridElementAtCoords('quark', squareB.x, squareB.y);
        
        pauseInput();
        var wait = gameView.newWait();
        
        var swapDirectionA;
        var swapDirectionB;
        
        if (quarkA.css('top') == quarkB.css('top'))
        {   // horizontal swap
            if (parseFloat(quarkA.css('left')) > parseFloat(quarkB.css('left')))
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
            if (parseFloat(quarkA.css('top')) > parseFloat(quarkB.css('top')))
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
        var animClassesA = 'swapping ' + swapDirectionA + '-swap';
        var animClassesB = 'swapping ' + swapDirectionB + '-swap';
        
        // adding these classes will initiate CSS animations
        quarkA.addClass(animClassesA);
        quarkB.addClass(animClassesB);
        
        // wait for CSS animations to finish
        window.setTimeout(function()
        {
            // clear animation classes
            quarkA.removeClass(animClassesA);
            quarkB.removeClass(animClassesB);
            
            var aQuarkClass = Helper.extractQuarkClass(quarkA);
            var bQuarkClass = Helper.extractQuarkClass(quarkB);
            
            // swap the CSS classes that determine which ring and arrow to show
            quarkA.removeClass(aQuarkClass);
            quarkA.addClass(bQuarkClass);
            quarkB.removeClass(bQuarkClass);
            quarkB.addClass(aQuarkClass);
            
            unpauseInput();
            wait.resolve();
        }, 300);
    }
    gameView.on(Game.EventType.BoardSwapSuccess, onSwapSuccess);
    
    /// BoardSwapFail – Player move was invalid, show the quarks failing to switch places
    function onSwapFail(e, squareA, squareB)
    {
        var quarkA = Helper.findGridElementAtCoords('quark', squareA.x, squareA.y);
        var quarkB = Helper.findGridElementAtCoords('quark', squareB.x, squareB.y);
        
        pauseInput();
        var wait = gameView.newWait();
        
        var swapDirectionA;
        var swapDirectionB;
        
        if (quarkA.css('top') == quarkB.css('top'))
        {   // horizontal swap
            if (parseFloat(quarkA.css('left')) > parseFloat(quarkB.css('left')))
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
            if (parseFloat(quarkA.css('top')) > parseFloat(quarkB.css('top')))
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
        
        //var animClassesA = 'distorting swap-fail ' + swapDirectionA + '-swap-fail';
        //var animClassesB = 'distorting swap-fail ' + swapDirectionB + '-swap-fail';
        var animClassesA = 'swap-fail ' + swapDirectionA + '-swap-fail';
        var animClassesB = 'swap-fail ' + swapDirectionB + '-swap-fail';
        
        // adding these classes will initiate CSS animations
        quarkA.addClass(animClassesA);
        quarkB.addClass(animClassesB);
        
        // wait for CSS animations to finish
        window.setTimeout(function()
        {
            // clear animation classes
            quarkA.removeClass(animClassesA);
            quarkB.removeClass(animClassesB);
            
            unpauseInput();
            wait.resolve();
        
        }, 210);
    }
    gameView.on(Game.EventType.BoardSwapFail, onSwapFail);
    
    /// BoardRemoveMatches – Animate removal of quarks.
    function onRemoveMatches(e, matchSquares, bombCoords, scoreChain, scoreMult)
    {
        // display the score earned for the last match
        var chainString = scoreChain.toString();
        if (scoreMult > 1) // only show multiplier if > 1
            chainString += ' ×' + scoreMult;
        
        //$('.my-turn .score-chain').html(chainString);
        $('.player-score .score-chain').html(chainString);
        
        pauseInput();
        var wait = gameView.newWait();
        
        var animDur = 400;
        
        var doomedQuarks = []; // need to go over quarks again after delay, so I'll keep a collection
        
        // for (var gridKey in matchData)
        matchSquares.forEach(function(currSquare)
        {   //var currDatum = matchData[gridKey];
            //var currSquare = currDatum.square;
            
            var doomedQuark = Helper.findGridElementAtCoords('quark', currSquare.x, currSquare.y);
            doomedQuarks.push(doomedQuark);
            
            //// • CSS animation
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
            });
            
            unpauseInput();
            wait.resolve();
        
        }, animDur);
    }
    gameView.on(Game.EventType.BoardRemoveMatches, onRemoveMatches);
    
    /// BoardNewQuarks – Empty new quarks.
    function onNewQuarks(e, newSquares)
    {
        pauseInput();
        var wait = gameView.newWait();
        
        var animDur = 600;
        
        var newQuarks = []; // need to go over quarks again after delay, so I'll keep a collection
        
        newSquares.forEach(function(newSquare)
        {
            var quarkBox = $('.grid-element.quark-container.x' + newSquare.x + '.y' + newSquare.y);
            newQuarks.push(quarkBox);
            
            // I'll just blissfully assume the quarkBox isn't already showing a quark
            quarkBox.addClass(newSquare.quark.css + " spawning"); // "spawning" class applies spawning animation
        });
        
        // wait for animations to finish
        window.setTimeout(function()
        {
            newQuarks.forEach(function(newQuark)
            {
                newQuark.removeClass("spawning"); // remove animation class
            });
            
            unpauseInput();
            wait.resolve();
        
        }, animDur);
    }
    gameView.on(Game.EventType.BoardNewQuarks, onNewQuarks);
    
    /// BoardGravity
    function onGravity(e, gravSquares)
    {
        pauseInput();
        var wait = gameView.newWait();
        
        // Use deferreds to trigger next step only after everything is done falling (since falling time may vary)
        $.when.apply($, gravSquares.map(function(gravSquare)
        {
            var deferred = $.Deferred();
            
            // find the DOM element for this square
            var target = Helper.findGridElementAtCoords('quark', gravSquare.x, gravSquare.y);
            
            if (!gravSquare.quark) // no quark is landing in this space
            {   // no transition to set up, just move on
                deferred.resolve([gravSquare, target, null]);
            }
            else
            {
                var fallerX,
                    fallerY;
                switch (gravSquare.gravDir)
                {
                    case Direction.Right:
                        fallerX = gravSquare.x - gravSquare.gravApplied;
                        fallerY = gravSquare.y;
                        break;
                    case Direction.Left:
                        fallerX = gravSquare.x + gravSquare.gravApplied;
                        fallerY = gravSquare.y;
                        break;
                    case Direction.Down:
                        fallerX = gravSquare.x;
                        fallerY = gravSquare.y - gravSquare.gravApplied;
                        break;
                    case Direction.Up:
                        fallerX = gravSquare.x;
                        fallerY = gravSquare.y + gravSquare.gravApplied;
                        break;
                }
                
                // find the DOM element that will be falling into this space
                var faller = Helper.findGridElementAtCoords('quark', fallerX, fallerY);
                faller.addClass("move-" + gravSquare.gravApplied);
                faller.addClass("move-" + gravSquare.gravDir.string);
                
                // Once falling transition animation is completed.
                faller.one('transitionend webkitTransitionEnd oTransitionEnd', function()
                {
                    deferred.resolve([gravSquare, target, faller]);
                });
            }
            
            return deferred.promise();
        })).done(function() // all transitions have completed
        {
            // move all quark containers back where they were but change their quarks to match the new contents
            [].slice.call(arguments).forEach(function (result)
            {
                var gravSquare = result[0];
                var target = result[1];
                var faller = result[2];
                
                // remove any previous quark class
                target.removeClass("ring-red ring-blue arrow-up arrow-down arrow-left arrow-right");
                // add the new correct quark class
                if (gravSquare.quark)
                    target.addClass(gravSquare.quark.css);
                
                if (faller)
                {   // revert to original position
                    faller.removeClass("move-" + gravSquare.gravApplied + " move-" + gravSquare.gravDir.string);
                }
            });
            wait.resolve();
            unpauseInput();
        });
        
        /*gravSquares.forEach(function(squareFall)
        {
        
        });*/
    }
    gameView.on(Game.EventType.BoardGravity, onGravity);
    
    /// BoardGravityBomb
    function onGravityBomb(e, bombedSquares, bombCoords)
    {
        pauseInput();
        var wait = gameView.newWait();
        
        var animDur = 400;
        
        var bombedQuarks = []; // need to go over quarks again after delay, so I'll keep a collection
        
        // for (var gridKey in matchData)
        bombedSquares.forEach(function(currSquare)
        {
            var bombedQuark = Helper.findGridElementAtCoords('quark', currSquare.x, currSquare.y);
            
            // if there's actually a quark here
            if (bombedQuark.is('.ring-red, .ring-blue') && bombedQuark.is('.arrow-up, .arrow-down, .arrow-left, .arrow-right'))
            {    
                bombedQuarks.push(bombedQuark);
                
                var animClass = 'matching hv-match';
                
                // adding these classes will initiate CSS animations
                bombedQuark.addClass(animClass);
            }
        });
        
        // wait for animations to finish
        window.setTimeout(function()
        {
            bombedQuarks.forEach(function(doomedQuark)
            {   // empty it out hard
                doomedQuark.removeClass("ring-red ring-blue arrow-up arrow-down arrow-left arrow-right");
                doomedQuark.removeClass("matching hv-match");
            });
            
            unpauseInput();
            wait.resolve();
        
        }, animDur);
    }
    gameView.on(Game.EventType.BoardGravityBomb, onGravityBomb);
    
    /// BoardStable – Board ready for player input once again.
    function onStable(e, newScore)   //gameView.on(Game.EventType.BoardStable, function(e, oldTurn, newTurn, newScore)
    {
        pauseInput();
        var wait = gameView.newWait();
        
        // TODO: animate score chain moving up into total score before changing these values
        $('.player-score .score').html(newScore);
        $('.player-score .score-chain').html('');
        
        // playerPanes.removeClass("my-turn");
        // board.removeClass("player-" + oldTurn + "-turn");
        
        //$('#player-' + newTurn).addClass("my-turn");
        //board.addClass("player-" + newTurn + "-turn");
        
        unpauseInput();
        wait.resolve();
    }
    gameView.on(Game.EventType.BoardStable, onStable);
    
    // GameOver – self-explanatory
    function onGameOver(e, winner)
    {
        pauseInput();
        
        if (!winner) // tie
        {
            gameView.addClass("tie");
            return;
        }
        
        gameView.addClass("player-" + winner + "-win");
        $('#player-' + winner + ' .score-chain').html("WINNER");
    }
    gameView.on(Game.EventType.GameOver, onGameOver);
    
    
    // let's get this STARTED
    Game.init(gameView);
}
