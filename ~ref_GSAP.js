window.onload = function()
{
    var gravBombTimeline = new TimelineMax({ repeat: -1, yoyo: true });
    
    var gravBombLeft = document.querySelectorAll(".grav-container.explosive.arrow-left");
    gravBombTimeline.to(gravBombLeft,  0.4, {scaleX: 0.6, left: "+=13px", ease:Elastic.easeIn});
    
    var gravBombRight = document.querySelectorAll(".grav-container.explosive.arrow-right");
    gravBombTimeline.to(gravBombRight, 0.4, {scaleX: 0.6, left: "-=13px", ease:Elastic.easeIn}, 0);
};

