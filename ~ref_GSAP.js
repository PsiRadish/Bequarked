window.onload = function()
{
    var gravBombTimeline = new TimelineMax({ repeat: -1, yoyo: true });
    
    var gravBombLeft = document.querySelectorAll(".grav-container.explosive.arrow-left");
    gravBombTimeline.to(gravBombLeft,  0.4, {scaleX: 0.6, left: "+=13px", ease:Elastic.easeIn});
    
    var gravBombRight = document.querySelectorAll(".grav-container.explosive.arrow-right");
    gravBombTimeline.to(gravBombRight, 0.4, {scaleX: 0.6, left: "-=13px", ease:Elastic.easeIn}, 0);
	
	/* Tip: Try substituting the following eases:
	Elastic.easeIn
	Elastic.easeInout
	Back.easeOut
	Power1.easeOut
	Power2.easeOut
	Power3.easeOut
	Power4.easeOut
	SlowMo.ease
    SlowMo.ease.config(0.2, 0.8)
    SlowMo.ease.config(0.8, 1.2)
	*/	
}

//run
//PC ctnrl-0
//MAC cmd-0