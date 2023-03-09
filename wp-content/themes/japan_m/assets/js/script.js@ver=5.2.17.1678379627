$(document).ready(function () {
  TweenMax.killAll();
  window.app.init();
});

$(window).on("load", function () {
  // console.log('load')
  window.app.load();
  setTimeout(function () {
    $(".main").css("height", $(window).innerHeight());
  }, 200);
});

var layoutFlag = false

var isDesktopView = window.innerWidth > 767; 
var isMobileView = window.innerWidth < 768; 
$(window).on("resize", function () {
  window.app.isDevice = $(window).width() < 1024;

  if(isDesktopView && !isMobileView && window.innerWidth < 768 && !layoutFlag) {
    layoutFlag = true
  }

  if(!isDesktopView && isMobileView && window.innerWidth > 767 && !layoutFlag) {
    layoutFlag = true
  }

  if(layoutFlag) {
    layoutFlag = false
    location.reload();
  }
  app.Canvas.prototype.refreshImage();

});

// scroll to top when page loads
window.onbeforeunload = function () {
  $("body").hide();
  window.scrollTo(0, 0);
};
