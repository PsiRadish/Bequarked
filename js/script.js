
var Animating = false; // input ignored while true

$(main);

function main()
{
    var board = $("#board");
    
    // size the board appropriately
    board.width(board.height());
    if ($(window).width() < board.width()) // respond to width squeeze
    {
        board.width($(window).width());
        board.height($(window).width());
    }
    
    // do it again on resize
    $(window).resize(function(e)
    {
        board.removeAttr('style'); // remove inline style
        
        board.width(board.height());
        if ($(window).width() < board.width()) // respond to width squeeze
        {
            board.width($(window).width());
            board.height($(window).width());
        }
    });
}
