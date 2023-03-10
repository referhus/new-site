(function (app) {
  "use strict";

  var inSectionLayer = false;
  var currentSectionLayer = 0;

  var Navigation = function () {};
  Navigation.intransition = false;
  Navigation.contentScroll = false;
  Navigation.sectionTransition = sectionTransition ? sectionTransition : "fade"; // fade
  Navigation.sectionTransitionSpeed = sectionTransitionSpeed
    ? sectionTransitionSpeed
    : 0.7; // fade
  var isMobile = $(window).width() < 769 ? true : false;
  Navigation.isDisableSwipe = false;
  var isIsland = false;
  var isTickerEnabled = true;

  // if($(window).width() < 769) {
  //     Navigation.sectionTransition = 'fade' //fade
  //     Navigation.sectionTransitionSpeed = 0.7 //fade
  // }
  Navigation.sectionIndex = 0;
  var isFirefox = /Firefox/i.test(navigator.userAgent);
  var is_iPad = navigator.userAgent.match(/iPad/i) != null;
  var is_touch = "ontouchstart" in window;

  var OSName = "Unknown OS";
  if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
  // var currentSection = 1
  var current = 0;
  var speed = [0.5, 1.3];
  var next = null;
  var dir = 0;
  var sensitivity = isFirefox ? 5 : OSName === "Windows" ? 110 : 150;
  var mousewheelevt = isFirefox ? "DOMMouseScroll" : "mousewheel";
  var number = 0;
  var initialLoad = true;

  var sections = {
    0: 0,
    1: [],
    2: 2,
  };

  var CW = 2735;
  var CH = 1580;
  var SCALE = 1;

  var CX = (CW * SCALE) / 2;
  var CY = (CH * SCALE) / 2;

  var coordinates = [
    {
      x: 0,
      y: 0,
      s: 1,
    },
    {
      x: -1,
      y: -1,
      s: 2,
    },
    {
      x: 0,
      y: 0,
      s: 2,
    },
    {
      x: 0,
      y: 0,
      s: 2,
    },
    {
      x: 0,
      y: 0,
      s: 2,
    },
    {
      x: 2735 / 2,
      y: 1580 / 2,
      s: 1,
    },
    {
      x: 275.45,
      y: -1000,
      s: 3.5,
    },
    {
      x: 2983.38,
      y: -588.78,
      s: 2.84,
    },
    {
      x: 185.66,
      y: 1304.53,
      s: 2.16,
    },
    {
      x: -293,
      y: 78,
      s: 3.32,
    },
  ];

  Navigation.prototype.init = function () {
    var _self = this;
    _self.scrollStatus(false);
    _self.scrollLockTo(current);
    _self.scrollBehaviour();
    _self.keyboardBehaviour();
    // _self.goToSection()
    _self.touchBehaviour();
    _self.buttonBehavior();
    _self.backtoTop();

    var sectionIndex = 0;
    if (app.isDevice) {
      $(".section.transition").remove();
    }

    $.each($(".section"), function (index, value) {
      sections[1].push(sectionIndex);
      sectionIndex++;
    });

    if (Navigation.sectionTransition === "slide") {
      TweenMax.set($(".section"), { yPercent: "100%" });
      TweenMax.set($(".section").eq(0), { yPercent: "0%" });
    }

    $(window).on("resize", function () {
      _self.scrollLockTo(current);
    });
    var contentGridIsActive = false;
    var contentArchiveIsActive = false;

    $(".section-last").on("scroll", function () {
      var st = $(this).scrollTop();

      if (
        st >=
        $(".last-content").height() +
          $("#section-footer").height() -
          ($(".section-last").height() + 1)
      ) {
        // console.log('reached bottom')
        // if (!config.tracking.scrollDepth.status[3]) {
        //   $.ecojs.tracking.send(
        //     "event",
        //     "Scroll-Depth",
        //     config.tracking.scrollDepth.depth[3] + "%",
        //     "section-scroll" + config.tracking.scrollDepth.depth[3]
        //   );
        //   config.tracking.scrollDepth.status[3] = true;
        // }
      }

      // content content__grid

      var contentGrid = $(".section-last").find(".content__grid");
      var contentArchive = $(".section-last").find(".content__archive-safe");
      if (contentGrid.offset().top > 200) {
        if (createjs) {
          if (createjs.Ticker && stage) {
            if (!isTickerEnabled) {
              createjs.Ticker.addEventListener("tick", stage);
              isTickerEnabled = true;
            }
          }
        }
      }

      if (
        contentGrid.offset().top < 0 &&
        contentGrid.offset().top > -contentGrid.height()
      ) {
        if (!contentGridIsActive) {
          contentGridIsActive = true;
          // if (config.tracking.sections) {
          //   var _data = config.tracking.sections[9];
          //   $.ecojs.tracking.send(
          //     _data.event,
          //     _data.category,
          //     _data.label,
          //     _data.value
          //   );
          //   if (createjs) {
          //     if (createjs.Ticker && stage) {
          //       if (isTickerEnabled) {
          //         createjs.Ticker.removeEventListener("tick", stage);
          //         isTickerEnabled = false;
          //       }
          //     }
          //   }
          // }
        }
      } else {
        if (contentGridIsActive) {
          contentGridIsActive = false;
        }
      }

      if (
        contentArchive.offset().top < 0 &&
        contentArchive.offset().top > -contentArchive.height()
      ) {
        if (!contentArchiveIsActive) {
          contentArchiveIsActive = true;
          // if (config.tracking.sections) {
          //   var _data = config.tracking.sections[10];
          //   $.ecojs.tracking.send(
          //     _data.event,
          //     _data.category,
          //     _data.label,
          //     _data.value
          //   );
          // }
        }
      } else {
        if (contentArchiveIsActive) {
          contentArchiveIsActive = false;
        }
      }
    });

    if (is_touch) {
      $(".section-scroll").on("scroll", function () {
        if ($(".section-scroll").hasClass("section-active")) {
          var sectionContainerHeight = $(
            ".section-scroll.section-active"
          ).height();
          var sectiontContentHeight = $(
            ".section-scroll.section-active .content-scroll"
          ).height();
          var sectionScrollBottom = parseInt(
            sectiontContentHeight - sectionContainerHeight
          );
          var sectionSrollTop = $(".section-scroll.section-active").scrollTop();
          if ($(".section-scroll.section-active").scrollTop() === 0) {
            Navigation.isDisableSwipe = false;
            inSectionLayer = true;
            // Navigation.prototype.triggerNavigate('up')
          } else if (sectionSrollTop >= sectionScrollBottom) {
            // Navigation.contentScroll = true

            inSectionLayer = true;
            Navigation.isDisableSwipe = false;
            console.log("bottom");

            if ($(".section-scroll.section-active").hasClass("section-last")) {
              // TweenMax.to(
              //   $(".content__footer"),
              //   0.7,
              //   {
              //     delay: 0.4,
              //     y: $(".content__footer .wrapper__nec-logo").height(),
              //     ease: Expo.easeOut,
              //   },
              //   0
              // );
              TweenMax.to(
                $(".btn__navigate-to-top"),
                0.3,
                { delay: 0.4, opacity: 1, scale: 1, transformOrigin: "center" },
                0
              );
            }

            // Navigation.prototype.triggerNavigate('down')

            // return false
          } else {
            Navigation.isDisableSwipe = true;
            if ($(".section-scroll.section-active").hasClass("section-last")) {
              // TweenMax.to($(".content__footer"), 0.7, {
              //   delay: 0.4,
              //   y: 0,
              //   ease: Expo.easeOut,
              // });
              TweenMax.to($(".btn__navigate-to-top"), 0.3, {
                delay: 0.4,
                opacity: 0,
                scale: 0,
                transformOrigin: "center",
              });
            }
          }
        }
      });
    }
  };

  Navigation.prototype.touchBehaviour = function () {
    // console.log('touch')
    var el = document.getElementById("main-content");

    // console.log(is_iPad, 'test')
    swipedetect(el, function (swipedir) {
      if (app.Animation.isPreloading) return;
      if ($(".burger").hasClass("is--active")) return;
      if (
        $(".comparison-tool").hasClass("is-active") ||
        $(".download-form").hasClass("is-active")
      ) {
        return;
      }

      if (Navigation.isDisableSwipe) return;
      if (swipedir === "up") {
        Navigation.prototype.directionConditional(1);
        Navigation.prototype.triggerNavigate("down");
      } else if (swipedir === "down") {
        Navigation.prototype.directionConditional(-1);
        Navigation.prototype.triggerNavigate("up");
      } else {
      }
    });
    var lastY;

    function swipedetect(el, callback) {
      var touchsurface = el,
        swipedir,
        startX,
        startY,
        dist,
        distX,
        distY,
        threshold = 30, // required min distance traveled to be considered swipe
        restraint = 50, // maximum distance allowed at the same time in perpendicular direction
        allowedTime = 1000, // maximum time allowed to travel that distance
        elapsedTime,
        startTime,
        handleswipe = callback || function (swipedir) {};

      touchsurface.addEventListener(
        "touchstart",
        function (e) {
          var touchobj = e.changedTouches[0];
          swipedir = "none";
          dist = 0;
          startX = touchobj.pageX;
          startY = touchobj.pageY;
          startTime = new Date().getTime(); // record time when finger first makes contact with surface
          //         e.preventDefault()

          // console.log('touchstart')
          // $('.content-scroll').addClass('disable-events');
        },
        false
      );

      touchsurface.addEventListener(
        "touchmove",
        function (e) {
          // e.preventDefault() // prevent scrolling when inside DIV
        },
        false
      );

      touchsurface.addEventListener(
        "touchend",
        function (e) {
          // $('.content-scroll').addClass('disable-events');

          var touchobj = e.changedTouches[0];
          distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
          distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
          elapsedTime = new Date().getTime() - startTime; // get time elapsed
          if (elapsedTime <= allowedTime) {
            // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
              // 2nd condition for horizontal swipe met
              swipedir = distX < 0 ? "left" : "right"; // if dist traveled is negative, it indicates left swipe
            } else if (
              Math.abs(distY) >= threshold &&
              Math.abs(distX) <= restraint
            ) {
              // 2nd condition for vertical swipe met
              swipedir = distY < 0 ? "up" : "down"; // if dist traveled is negative, it indicates up swipe
            }
          }
          handleswipe(swipedir);
          //         e.preventDefault()
        },
        false
      );
    }
  };

  Navigation.prototype.scrollBehaviour = function () {
    var scrollX = 0;
    document.addEventListener(
      mousewheelevt,
      function (e) {
        var eventinfo = [
          number,
          "wheel down",
          e,
          e.type,
          e,
          e.wheelDelta,
          e.detail,
        ];

        var wheelDelta = isFirefox ? e.detail * -1 : e.wheelDelta;

        // // console.log(wheelDelta)
        if ($(".container__nav").hasClass("is--active")) {
          return;
        }
        if (
          !$(".comparison-tool").hasClass("is-active") &&
          !$(".download-form").hasClass("is-active")
        ) {
          if (
            currentSectionLayer < sections[1].length - 1 &&
            currentSectionLayer !== 2 &&
            currentSectionLayer !== 4
          ) {
            e.preventDefault();
            if (app.Animation.isPreloading) return;
            if (wheelDelta > sensitivity) {
              Navigation.prototype.directionConditional(-1);
              Navigation.prototype.triggerNavigate("up");
            } else if (wheelDelta < -sensitivity) {
              Navigation.prototype.directionConditional(1);
              Navigation.prototype.triggerNavigate("down");
            }
            return false;
          }

          if ($(".section-scroll.section-active").length) {
            // if ($('header').height() <= $('.section-last .last-content').offset().top) {
            if (wheelDelta > sensitivity) {
              // console.log('test')
              if ($(".section-scroll.section-active").scrollTop() === 0) {
                e.preventDefault();
                // console.log('test')
                Navigation.isDisableSwipe = false;
                inSectionLayer = true;
                Navigation.prototype.triggerNavigate("up");
                return false;
              }
              if (
                $(".section-scroll.section-active").hasClass("section-last")
              ) {
                // TweenMax.to($(".content__footer"), 0.7, {
                //   delay: 0.4,
                //   y: 0,
                //   ease: Expo.easeOut,
                // });
                TweenMax.to($(".btn__navigate-to-top"), 0.3, {
                  delay: 0.4,
                  opacity: 0,
                  scale: 0,
                  transformOrigin: "center",
                });
              }
            }

            if (wheelDelta < -sensitivity) {
              var sectionContainerHeight = $(
                ".section-scroll.section-active"
              ).height();
              var sectiontContentHeight = $(
                ".section-scroll.section-active .content-scroll"
              ).height();
              var sectionScrollBottom = parseInt(
                sectiontContentHeight - sectionContainerHeight
              );
              var sectionSrollTop = $(
                ".section-scroll.section-active"
              ).scrollTop();
              if (sectionSrollTop >= sectionScrollBottom) {
                e.preventDefault();
                Navigation.contentScroll = true;
                inSectionLayer = true;
                Navigation.isDisableSwipe = false;
                Navigation.prototype.triggerNavigate("down");

                if (
                  $(".section-scroll.section-active").hasClass("section-last")
                ) {
                  // TweenMax.to(
                  //   $(".content__footer"),
                  //   0.7,
                  //   {
                  //     delay: 0.4,
                  //     y: $(".content__footer .wrapper__nec-logo").height(),
                  //     ease: Expo.easeOut,
                  //   },
                  //   0
                  // );
                  TweenMax.to(
                    $(".btn__navigate-to-top"),
                    0.3,
                    {
                      delay: 0.4,
                      opacity: 1,
                      scale: 1,
                      transformOrigin: "center",
                    },
                    0
                  );
                }

                return false;
              }
            }
            // }
          }
        }
      },
      { passive: false }
    );
  };

  Navigation.prototype.directionConditional = function (dir) {
    if (
      current === 1 &&
      currentSectionLayer === 0 &&
      dir < 0 &&
      !Navigation.intransition
    ) {
      inSectionLayer = false;
    }
  };

  Navigation.prototype.layerTransition = function (index) {};

  Navigation.prototype.scrollLockTo = function (index, isResize) {
    var header = $(".header");
    var section = [
      0,
      $("header").height(),
      $(window).height() + $("#section-footer").height(),
    ];
    // var pos = type === 'content' ? section[1] : type === 'header' ? section[0] : section[2]
    var pos = section[index];
    var s = current > 1 ? speed[1] : speed[0];
    // if($(window).width() < 768) {
    TweenMax.to($("#main-content"), s, {
      y: -pos,
      onComplete: function () {
        if (!isResize) {
          Navigation.intransition = false;
          if (current === 1) {
            inSectionLayer = true;
          }
        }
      },
    });
  };

  Navigation.prototype.changeSection = function (index) {
    var _self = this;
    var prevIndex = index > 0 ? index - 1 : index,
      nextIndex =
        index < sections[1].length ? index + 1 : sections[1].length - 1;
    var section = $(".section").eq(index),
      prevSection = $(".section").eq(prevIndex),
      nextSection = $(".section").eq(nextIndex),
      currentSection = $(".section-active");

    Navigation.sectionIndex = index;

    if (isIsland) {
      Navigation.prototype.islandAnimation("hide");
    }

    $(".touch-cover").css("display", "none");

    if (section.hasClass("section-ranking")) {
      $(".ranking-wrap").removeClass("view-graph");
    } else {
      $(".ranking-wrap").fadeOut();
    }
    Navigation.isDisableSwipe = false;

    //close banner if open
    $(".banner").fadeOut().removeClass("active");

    // // console.log('section: ', index)
    // // createjs.Ticker.removeEventListener("tick", stage)

    // scroll depth ga tracking
    // if (config.tracking.scrollDepth.depth.length) {
    //   var scrollDepth;

    //   // if (
    //   //   Navigation.sectionIndex === 2 &&
    //   //   !config.tracking.scrollDepth.status[0]
    //   // ) {
    //   //   // scrollDepth = config.tracking.scrollDepth.depth[0];
    //   //   // $.ecojs.tracking.send(
    //   //   //   "event",
    //   //   //   "Scroll-Depth",
    //   //   //   scrollDepth + "%",
    //   //   //   "section-scroll" + scrollDepth
    //   //   // );
    //   //   // config.tracking.scrollDepth.status[0] = true;
    //   // }

    //   // if (
    //   //   Navigation.sectionIndex === 4 &&
    //   //   !config.tracking.scrollDepth.status[1]
    //   // ) {
    //   //   scrollDepth = config.tracking.scrollDepth.depth[1];
    //   //   $.ecojs.tracking.send(
    //   //     "event",
    //   //     "Scroll-Depth",
    //   //     scrollDepth + "%",
    //   //     "section-scroll" + scrollDepth
    //   //   );
    //   //   config.tracking.scrollDepth.status[1] = true;
    //   // }

    //   // if (
    //   //   Navigation.sectionIndex === 6 &&
    //   //   !config.tracking.scrollDepth.status[2]
    //   // ) {
    //   //   scrollDepth = config.tracking.scrollDepth.depth[2];
    //   //   $.ecojs.tracking.send(
    //   //     "event",
    //   //     "Scroll-Depth",
    //   //     scrollDepth + "%",
    //   //     "section-scroll" + scrollDepth
    //   //   );
    //   //   config.tracking.scrollDepth.status[2] = true;
    //   // }
    // }

    // scroll change section tracking
    // if (config.tracking.sections) {
    //   var _data = config.tracking.sections[Navigation.sectionIndex];
    //   $.ecojs.tracking.send(
    //     _data.event,
    //     _data.category,
    //     _data.label,
    //     _data.value
    //   );
    // }

    Navigation.prototype.backtoTop(index);

    pretransition();

    function pretransition() {
      TweenMax.to($(".section-ctrl-up img"), 0.5, {
        y: -58,
        ease: Strong.easeOut,
      });
      TweenMax.to($(".section-ctrl-down img"), 0.5, {
        y: 58,
        ease: Strong.easeOut,
        onComplete: function () {
          TweenMax.to($(".section-ctrl-up img"), 0.5, {
            delay: 1,
            y: 0,
            ease: Strong.easeOut,
          });
          TweenMax.to($(".section-ctrl-down img"), 0.5, {
            delay: 1,
            y: 0,
            ease: Strong.easeOut,
          });
        },
      });
      transition();
    }

    function transition() {
      // $('video')[0].pause()
      var transitionOption, transitionProgress;

      if (Navigation.sectionTransition === "fade") {
        var secArr = [prevSection, nextSection, currentSection];
        TweenMax.to(secArr, 0.7, {
          opacity: 0,
          zIndex: -1,
          ease: Expo.easeInOut,
        });
        transitionOption = {
          opacity: 1,
          zIndex: 1,
          ease: Expo.easeInOut,
          onComplete: function () {
            transitionProgress = false;

            if (section.hasClass("section-scroll")) {
              if (dir > 0) {
                TweenMax.set($(".section-scroll.section-active"), {
                  scrollTo: { y: 0 },
                });
              } else {
                var sectionContainerHeight = $(
                  ".section-scroll.section-active"
                ).height();
                var sectiontContentHeight = $(
                  ".section-scroll.section-active .content-scroll"
                ).height();
                var sectionScrollBottom = parseInt(
                  sectiontContentHeight - sectionContainerHeight
                );
                TweenMax.set($(".section-scroll.section-active"), {
                  scrollTo: { y: sectionScrollBottom },
                });
                console.log("go to bottom");
              }
            }
          },
          onUpdate: transitionUpdate,
        };
      }

      if (Navigation.sectionTransition === "slide") {
        TweenMax.set($(".section"), { opacity: 1 });
        if (index == 0) {
          TweenMax.to($(".section"), Navigation.sectionTransitionSpeed, {
            yPercent: "100%",
            zIndex: 1,
            ease: Expo.easeInOut,
          });
        }
        TweenMax.to([prevSection], Navigation.sectionTransitionSpeed, {
          yPercent: "-100%",
          zIndex: 1,
          ease: Expo.easeInOut,
        });
        TweenMax.to([nextSection], Navigation.sectionTransitionSpeed, {
          yPercent: "100%",
          zIndex: 1,
          ease: Expo.easeInOut,
        });
        var circleContent = $(
          ".section-content.section-active .content-container"
        );

        if ($(window).width() < 767) {
          if (dir > 0) {
            TweenMax.to(
              $(".section-content.section-active .content-container"),
              0.3,
              {
                "border-bottom-left-radius": "50%",
                "border-bottom-right-radius": "50%",
                ease: Expo.easeIn,
              }
            );
          } else {
            // console.log('set to square')
            TweenMax.to(
              $(".section-content.section-active")
                .prev()
                .find(".content-container"),
              0.15,
              {
                "border-bottom-left-radius": "0",
                "border-bottom-right-radius": "0",
                ease: Linear.easeNone,
                delay: 0.4,
              }
            );
          }
        }
        transitionOption = {
          yPercent: "0%",
          zIndex: 1,
          ease: Expo.easeInOut,
          onComplete: function () {
            transitionProgress = false;

            if (section.hasClass("section-scroll")) {
              var sectionContainerHeight = $(
                ".section-scroll.section-active"
              ).height();
              var sectiontContentHeight = $(
                ".section-scroll.section-active .content-scroll"
              ).height();
              var sectionScrollBottom = parseInt(
                sectiontContentHeight - sectionContainerHeight
              );
              var sectionSrollTop = $(
                ".section-scroll.section-active"
              ).scrollTop();

              if ($(".section-scroll.section-active").scrollTop() === 0) {
                Navigation.isDisableSwipe = false;
              } else if (sectionSrollTop >= sectionScrollBottom) {
                Navigation.isDisableSwipe = false;
              } else {
                Navigation.isDisableSwipe = true;
              }
              if (dir > 0) {
                TweenMax.set($(".section-scroll.section-active"), {
                  scrollTo: { y: 0 },
                });
              } else {
                var sectionContainerHeight = $(
                  ".section-scroll.section-active"
                ).height();
                var sectiontContentHeight = $(
                  ".section-scroll.section-active .content-scroll"
                ).height();
                var sectionScrollBottom =
                  sectiontContentHeight !== sectiontContentHeight
                    ? parseInt(sectiontContentHeight - sectionContainerHeight)
                    : sectiontContentHeight;
                TweenMax.set($(".section-scroll.section-active"), {
                  scrollTo: { y: sectionScrollBottom },
                });
                console.log(sectionScrollBottom);
                console.log("asdlaskdhjask");
              }
            } else {
              Navigation.isDisableSwipe = false;
            }

            // if(isMobile) {
            //     Navigation.prototype.afterTransition();
            // }

            Navigation.intransition = false;
          },
          onUpdate: transitionUpdate,
        };
      }

      var tn = TweenMax.to(
        section,
        Navigation.sectionTransitionSpeed,
        transitionOption
      );
      //   if (isMobile) {
      //     // console.log(Navigation.sectionIndex)
      //     TweenMax.to($('.mob-layer'), 0.7, { opacity: 0, zIndex: -1, ease: Expo.easeInOut })
      //     TweenMax.to($('.mob-layer' + Navigation.sectionIndex), Navigation.sectionTransitionSpeed, {
      //       opacity: 1,
      //       zIndex: 1,
      //       ease: Expo.easeInOut
      //     })
      //   }

      function transitionUpdate() {
        if (tn.progress() > 0.8 && !transitionProgress) {
          Navigation.isDisableSwipe = false;

          if (section.hasClass("section-bg")) {
            transitionProgress = true;
            Navigation.prototype.afterTransition();
            if (isTickerEnabled) {
              if (createjs) {
                if (createjs.Ticker && stage) {
                  createjs.Ticker.removeEventListener("tick", stage);
                  isTickerEnabled = false;
                }
              }
              isTickerEnabled = false;
            }

            if (Navigation.sectionIndex === 1) {
              Navigation.prototype.islandAnimation("show");
            }
          } else {
            if (isMobile) {
              transitionProgress = true;
              Navigation.prototype.afterTransition();
            }

            if (!isTickerEnabled) {
              if (createjs) {
                if (createjs.Ticker && stage) {
                  createjs.Ticker.addEventListener("tick", stage);
                  isTickerEnabled = true;
                }
              }
            }
            // createjs.Ticker.addEventListener("tick", stage)
          }
          TweenMax.to($(".fade-in-out"), 0.3, {
            opacity: 1,
            ease: Expo.easeInOut,
          });
        }
      }

      if (!section.hasClass("section-bg")) {
        console.log(index);
        var canvasIndex =
          coordinates[index].x === -1 && coordinates[index].y === -1
            ? -1
            : index;
        // console.log(index)

        // if (!isMobile) {
        //   exportRoot.updateCanvas(
        //     canvasIndex,
        //     coordinates[index].x,
        //     coordinates[index].y,
        //     coordinates[index].s,
        //     Navigation.prototype.afterTransition
        //   );
        // } else {
        //   console.log("alskdjaskldalskjjkalsjklasd");
        //   exportRoot.updateCanvas(
        //     index,
        //     coordinates[index].x,
        //     coordinates[index].y,
        //     coordinates[index].s
        //   );
        // }
        // } else {
        // console.log(canvasIndex)
        // Navigation.prototype.afterTransition()
        // }

        if (isIsland) {
          //   Navigation.prototype.islandAnimation('hide')
        }
      } 
    }
  };

  Navigation.prototype.afterTransition = function () {
    // console.log('after transition')
    var section = $(".section").eq(Navigation.sectionIndex);
    var navItem = $(".nav-list .nav-item").eq(Navigation.sectionIndex);

    section.addClass("section-active").siblings().removeClass("section-active");
    $(".nav-list li").find("a").removeClass("is--active");
    navItem.addClass("is--active").siblings();
    app.Animation.prototype.animateContent(dir);

    var rankingStatus;
    if (section.hasClass("section-ranking")) {
      $(".ranking-wrap").show();
      rankingStatus = "play";
    } else {
      // $('.ranking-wrap').hide();
    }
    app.Carousel.prototype.thumbnailAnimation(rankingStatus);

    Navigation.intransition = false;
    if ($(window).width() > 1024) {
      if (!section.hasClass("section-ranking")) {
        TweenMax.killTweensOf(".section-ranking .model-layer *");
      } else {
        app.Animation.prototype.earthTransition();
      }
    }
    // console.log(Navigation.intransition)
  };

  Navigation.prototype.triggerNavigate = function (direction) {
    if (
      $(".comparison-tool").hasClass("is-active") ||
      $(".download-form").hasClass("is-active")
    ) {
      return;
    }

    // if ($(".content__footer").data().hidden) {
    //   TweenMax.to($(".content__footer"), 1, {
    //     y: 0,
    //     opacity: 1,
    //     ease: Expo.easeInOut,
    //   });
    //   $(".content__footer").data("hidden", false);
    // }
    if (direction === "up") {
      if (!inSectionLayer) {
        Navigation.prototype.navigateTo(current - 1);
      } else {
        Navigation.prototype.navigateLayerTo(currentSectionLayer - 1);
      }
    } else {
      if (!inSectionLayer) {
        Navigation.prototype.navigateTo(current + 1);
      } else {
        Navigation.prototype.navigateLayerTo(currentSectionLayer + 1);
      }
    }

    Navigation.prototype.directionConditional(dir);
  };

  Navigation.prototype.navigateTo = function (i) {
    if (current > i) {
      dir = -1;
    } else if (current < i) {
      dir = 1;
    } else {
      return;
    }
    if (i < 0 && dir == -1) return;
    // var totalSection = section.length - 1
    if (i > 2 && dir == 1) return;
    if (Navigation.intransition) return;
    Navigation.intransition = true;
    current = i;
    Navigation.prototype.scrollLockTo(current);
  };

  Navigation.prototype.navigateLayerTo = function (i) {
    if (currentSectionLayer > i) {
      dir = -1;
    } else if (currentSectionLayer < i) {
      dir = 1;
    } else {
      return;
    }
    if (i < 0 && dir == -1) return;
    if (i > sections[1].length - 1 && dir == 1) return;
    if (Navigation.intransition) return;
    Navigation.intransition = true;
    currentSectionLayer = i;
    Navigation.prototype.changeSection(currentSectionLayer);
  };

  (Navigation.prototype.keyboardBehaviour = function () {
    // console.log('keyboardbehavior')
    $(document).keydown(function (e) {
      switch (e.which) {
        case 33: // page up key
          dir = -1;
          Navigation.prototype.triggerNavigate("up");

          break;
        case 34: // page down key
          dir = 1;
          Navigation.prototype.triggerNavigate("down");

          break;
        case 38: // arrow up key
          dir = -1;
          Navigation.prototype.triggerNavigate("up");
          break;
        case 40: // arrow down key
          dir = 1;
          Navigation.prototype.triggerNavigate("down");
          break;
        default:
          return; // exit this handler for other keys
      }
    });
  }),
    (Navigation.prototype.scrollStatus = function (status) {
      if ($(window).width() > 1023) {
        if (status) {
          $("html, body").removeClass("disable-scroll");
        } else {
          $("html, body").addClass("disable-scroll");
        }
      }
    });

  Navigation.prototype.goToSection = function () {
    var navList = $(".nav-list li"),
      navItem = $(".nav-item"),
      circle = $(".circle");
    navItem.on("click", function (e) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      var section = $(this).parent("li").index();

      navItem.removeClass("is--active");
      $(this).addClass("is--active");
      $(".burger span").removeClass("is--active");
      TweenMax.to(circle, 1, {
        scale: 0,
        transformOrigin: "center",
        ease: Expo.easeInOut,
      });
      TweenMax.staggerTo(
        navList,
        0.3,
        {
          x: 100,
          opacity: 0,
          ease: Power3.easeOut,
          onComplete: function () {
            $(".container__nav").css("display", "none");
          },
        },
        0.05
      );

      Navigation.prototype.navigateLayerTo(section);
    });
  };

  Navigation.prototype.buttonBehavior = function () {
    var btnPrev = $(".btn__up-wrapper"),
      btnNext = $(".btn__down-wrapper"),
      btnNextLast = $(".btn__down-last");

    btnPrev.on("click", function (e) {
      e.preventDefault();
      Navigation.prototype.triggerNavigate("up");
    });
    btnNext.on("click", function (e) {
      e.preventDefault();
      Navigation.prototype.triggerNavigate("down");
    });
    btnNextLast.on("click", function (e) {
      e.preventDefault();
      TweenMax.to($(".section"), 0.8, {
        scrollTo: ".content__archive-safe",
        ease: Expo.easeInOut,
      });
      // TweenMax.to($('.section'), 0.8, { scrollTo: '.content.content__grid', ease: Expo.easeInOut })
    });
  };
  Navigation.prototype.backtoTop = function () {
    $(".btn__navigate-to-top, .btn__back-to-top").on("click", function (e) {
      e.preventDefault();
      inSectionLayer = true;
      Navigation.prototype.navigateLayerTo(0);
      $(".section-last").animate({
        scrollTop: 0,
      });
      // TweenMax.to($(".content__footer"), 0.7, {
      //   delay: 1,
      //   y: 0,
      //   ease: Expo.easeOut,
      // });
      TweenMax.to($(".btn__navigate-to-top"), 0.7, {
        delay: 1,
        scale: 0,
        ease: Expo.easeOut,
      });
      return false;
    });
  };

  Navigation.prototype.islandAnimation = function (status, callback) {
    var islandLayer0 = $(".island-layer-0");
    var islandLayer1 = $(".island-layer-1 img");
    var islandLayer2 = $(".island-layer-2 img");
    var islandLayer3 = $(".island-layer-3 img");
    var islandLayer4 = $(".island-layer-4 img");
    // console.log('islandAnimation')
    if (status === "show") {
      // section in
      isIsland = true;

      // console.log('asdas')
      TweenMax.set(".container__island", { opacity: 1 });
      TweenMax.fromTo(
        islandLayer0,
        0.9,
        { opacity: 0 },
        { overwrite: true, opacity: 1, force3D: true }
      );
      TweenMax.fromTo(
        islandLayer1,
        0.6,
        { opacity: 0, scale: 0 },
        {
          overwrite: true,
          opacity: 1,
          scale: 1,
          transformOrigin: "center",
          delay: 0.6,
          ease: Expo.easeOut,
          force3D: true,
        }
      );
      TweenMax.fromTo(
        islandLayer2,
        0.5,
        { y: -200 },
        {
          overwrite: true,
          opacity: 1,
          y: 0,
          delay: 0.85,
          ease: Expo.easeOut,
          force3D: true,
        }
      );
      TweenMax.fromTo(
        islandLayer3,
        0.5,
        { y: -200 },
        {
          overwrite: true,
          opacity: 1,
          y: 0,
          delay: 0.95,
          ease: Expo.easeOut,
          force3D: true,
        }
      );
      TweenMax.fromTo(
        islandLayer4,
        0.7,
        { opacity: 0 },
        {
          overwrite: true,
          opacity: 1,
          y: 0,
          delay: 1.3,
          ease: Expo.easeOut,
          force3D: true,
          onComplete: function () {
            // console.log(callback)
          },
        }
      );
    } else {
      // hide
      // section out
      isIsland = false;

      TweenMax.to(".container__island", 0.3, {
        opacity: 0,
        onComplete: function () {
          var yOffset = $(window).height() / 2;
          TweenMax.set(islandLayer4, {
            opacity: 0,
            delay: 0,
          });
          TweenMax.set(islandLayer0, { opacity: 0 });
          TweenMax.set(islandLayer1, {
            opacity: 0,
            scale: 0.5,
            transformOrigin: "center",
            delay: 0,
          });
          TweenMax.set(islandLayer2, { opacity: 0, y: -yOffset, delay: 0 });
          TweenMax.set(islandLayer3, { opacity: 0, y: -yOffset, delay: 0 });
        },
      });
    }
  };

  app.Navigation = Navigation;

  app.ready(function () {
    // console.log('Navigation ready')
    Navigation.prototype.init();
  });
})(window.app);
