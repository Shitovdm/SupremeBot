
/**
 * Simple slider for landing page.
 * Can work in Google Chrome extension.
 * @author Shitov Dmitry 2018
 */

var currentSlide = 0;   //  Number of current slide.
var limitSlide = 2; //  Amount of slides(half withput null).

$(document).ready(function() {
    //  Welcome page slider.
    $(".right-arrow").on("click",function(){
        _changeSlide("forth");
    });
    $(".left-arrow").on("click",function(){
        _changeSlide("back");
    });
    //  Bind left and right arrows on keyboard to slide.
    document.onkeydown = function checkKeycode(event){
        var keycode;
        if (!event)
            var event = window.event;
        if (event.keyCode)
            keycode = event.keyCode;    //  IE
        else if (event.which)
            keycode = event.which;  //  all browsers
        if (keycode === 39) {
            //  Click on right arrow.
            _changeSlide("forth");
        }
        if (keycode === 37) {
            //  Click on left arrow.
            _changeSlide("back");
        }
    };
});


/**
 * Function calculated number of current slide and motion direction.
 * @param {type} action
 * @returns {undefined}
 */
function _changeSlide(action){
    if(action === "forth"){
        //  Forward;
        if(currentSlide < limitSlide){
            currentSlide++;
            toSlide(currentSlide,"forth");
        }
        (currentSlide === limitSlide) ? ($(".right-arrow").fadeOut(600)) : ($(".left-arrow").fadeIn(600));
    }else{
        if(action === "back"){
            //  Go to back page.
            if(currentSlide > -limitSlide){
                currentSlide--;
                toSlide(currentSlide,"back");
            }
            (currentSlide === -limitSlide) ? ($(".left-arrow").fadeOut(600)) : ($(".right-arrow").fadeIn(600));
        }
    }  
}

/**
 * Function hide/show determinated slide.
 * @param {Integer} slideNumber     This slide was removed.
 * @param {String} direction    Direction of motion.
 * @returns {undefined}
 * 
 */
function toSlide(slideNumber,direction) {
    var lastSlideClassName = "";
    var lastSlidePos = 0;
    
    if(direction === "forth"){
        lastSlideClassName = "slide-" + (slideNumber - 1);
        lastSlidePos = -100 + "%";
    }else{
        if(direction === "back"){
            lastSlideClassName = "slide-" + (slideNumber + 1);
            lastSlidePos = 100 + "%";
        } 
    }
    
    $(".slide-" + slideNumber).fadeIn(50);
    $(".slide-" + slideNumber).animate({'left': "0%"}, 400);
    $("." + lastSlideClassName).animate({'left': lastSlidePos}, 400);
}