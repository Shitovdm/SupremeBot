
$(document).ready(function() {
    //  Welcome page slider.
    $(".right-shift").on("click",function(){
        slider__changePage("forth");
    });
    $(".left-shift").on("click",function(){
        slider__changePage("back");
    });
    
    
    
});



function slider__changePage(action){
    console.log(action);
    if(action === "forth"){
        //  Go to back page.
        $(".welcome-page").css("display","none");
    }else{
        if(action === "back"){
             //  Go to next page.
             $(".features-page").fadeIn(50);
             $('.features-page').animate({'left':'0'},400) ;    
             $('.welcome-page').animate({'left':'100%'},400) ; 
        }
    }
    
    
}