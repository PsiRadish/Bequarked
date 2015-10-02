/*global jQuery */
/*!
 * FitText.js 1.2
 *
 * Copyright 2011, Dave Rupert http://daverupert.com
 * Released under the WTFPL license
 * http://sam.zoy.org/wtfpl/
 *
 * Date: Thu May 05 14:23:00 2011 -0600
 * 
 * RADISH
 * Date: Thu Oct 01 23:30:11 2015 -0700
 * Added "thisEvents" setting to support listening for additional events on 'this'
 * (so I can fix the font-size of 0 that I get after making an element that was "display: none" visible)
 */

(function($)
{
    $.fn.fitText = function(kompressor, options)
    {
        // Setup options
        var compressor = kompressor || 1,
            settings   = $.extend(
            {
                'minFontSize': Number.NEGATIVE_INFINITY,
                'maxFontSize': Number.POSITIVE_INFINITY,
                'thisEvents': null
            }, options);
        
        return this.each(function()
        {
            // Store the object
            var $this = $(this);
            
            // Resizer() resizes items based on the object width divided by the compressor * 10
            //var resizer = function(e, thish)
            var resizer = function()
            {
                //var $this = $(thish);
                
                $this.css('font-size', Math.max(Math.min($this.width() / (compressor * 10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
            };
            // Call once to set.
            resizer();
            //resizer(null, this);
            
            // Call on resize. Opera debounces their resize by default.
            //$(window).on('resize.fittext orientationchange.fittext, visible.fittext', {thish: this}, resizer);
            $(window).on('resize.fittext orientationchange.fittext, visible.fittext', resizer);
            
            if (settings.thisEvents)
            {
                $this.on(settings.thisEvents, resizer);
            }
        });
    };
})(jQuery);
