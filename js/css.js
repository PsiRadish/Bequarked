// Kyle Fiegener
// BEQUARKED

//// structs of CSS stuff

const LABELS =
{
    gameView:       "game",
    board:          "board",
    
    playerPane:     "player",
    myTurn:         "my-turn",
    
    selected:       "selected",
    
    gridElement:    "grid-element",
    quarkBox:       "quark-container"
}
const SELECTORS =
{
    gameView:       '#'+LABELS.gameView,
    board:          '#'+LABELS.board,
    
    playerPane:     '.'+LABELS.playerPane,
    myTurn:         '.'+LABELS.myTurn,
    
    selected:       '.'+LABELS.selected,
    
    gridElement:    '.'+LABELS.gridElement,
    quarkBox:       '.'+LABELS.quarkBox
}

// this is the one actually used elsewhere
const STYLE =
{
    name: LABELS,
    sel:  SELECTORS
}
