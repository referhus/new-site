(function (app) {
  "use strict";

  var Animation = function () {};

  Animation.isPreloading = true;

  Animation.prototype.init = function () {
    // Animation.prototype.inView()
    Animation.prototype.earthTransition();
    TweenMax.killTweensOf(".section-ranking .model-layer *");

    // Animation.prototype.preloader()

    if ($(".year-switch").length && $(".btn-year").length) {
      $(".section-layer-2 .btn-year").on("click", function (e) {
        e.preventDefault();
        TweenMax.to(".section-layer-2 .year-switch", 0.5, {
          x: $(this).width() * $(this).index(),
          ease: Power3.easeOut,
        });
        $(this).addClass("active").siblings().removeClass("active");

        var btnIndex = $(this).index() + 1;

        updateCopy(this);

        TweenMax.to($(".island-rank").not(".island-rank-" + btnIndex), 0.5, {
          opacity: 0,
          ease: Expo.easeOut,
        });
        TweenMax.to($(".island-rank").eq($(this).index()), 0.5, {
          y: "0%",
          opacity: 1,
          ease: Expo.easeOut,
          delay: 0.6,
          onComplete: function () {
            TweenMax.set($(".island-rank").not(".island-rank-" + btnIndex), {
              y: "-50%",
            });
          },
        });

        function updateCopy(button) {
          const year = $(".title__year");
          const yearCopy = $(".description");
          const isJapanVersion = $(button).hasClass("btn-year--jp");

          console.log(button);
          console.log(isJapanVersion);

          switch (btnIndex) {
            case 1:
              isJapanVersion
                ? yearCopy.text(
                    "Safe Cities Index2021は60都市を対象に、サイバーセキュリティ、医療・健康、インフラ、個人、そして今年から新たに加わった「環境」を含む76の指標について調査しました。ランキング上位5都市は、コペンハーゲン、トロント、シンガポール、シドニー、東京の順でした。"
                  )
                : yearCopy.text(
                    "The fourth iteration of the index looks at 60 cities across 76 indicators, covering digital, health, infrastructure, personal, and - new this year - environmental security. The top 5 cities were Copenhagen, Toronto, Singapore, Sydney, Tokyo, in that order."
                  );

              year.text("2021");

              break;
            case 2:
              isJapanVersion
                ? yearCopy.text(
                    "Safe Cities Index2019は60都市を対象に、サイバーセキュリティ、医療・健康、インフラ、個人の安全など57の指標について調査しました。上位5都市は東京、シンガポール、大阪、アムステルダム、シドニーの順でした。"
                  )
                : yearCopy.text(
                    "The third iteration of the index looks at 60 cities across 57 indicators, covering digital, health, infrastructure and personal security. The top 5 cities were Tokyo, Singapore, Osaka, Amsterdam, Sydney, in that order."
                  );

              year.text("2019");
              break;
            case 3:
              isJapanVersion
                ? yearCopy.text(
                    "Safe Cities Index2017は60都市を対象に、サイバーセキュリティ、医療・健康、インフラ、個人の安全など49の指標について調査しました。上位5都市は東京、シンガポール、大阪、トロント、メルボルンの順でした。"
                  )
                : yearCopy.text(
                    "The second iteration of the index looks at 60 cities across 49 indicators, covering digital, health, infrastructure and personal security. The top 5 cities were Tokyo, Singapore, Osaka, Toronto, Melbourne, in that order."
                  );

              year.text("2017");
              break;
            case 4:
              isJapanVersion
                ? yearCopy.text(
                    "Safe Cities Index2015は50都市を対象に、サイバーセキュリティ、医療・健康、インフラ、個人の安全など40の指標について調査しました。上位5都市は、東京、シンガポール、大阪、ストックホルム、アムステルダムの順でした。"
                  )
                : yearCopy.text(
                    "Our inaugural Safe Cities Index looks at 50 cities across 40 indicators, covering digital, health, infrastructure and personal security. The top 5 cities were Tokyo, Singapore, Osaka, Stockholm, Amsterdam, in that order."
                  );

              year.text("2015");
              break;
            default:
              break;
          }
        }
      });
    }

    if ($(".btn-show-ct").length) {
      $(".btn-show-ct").on("click", function (e) {
        e.preventDefault();
        $(".comparison-tool").fadeIn().addClass("is-active");
        TweenMax.to(".section-layer ", 0.3, {
          opacity: 0,
          ease: Power3.easeOut,
          onComplete: function () {
            if (
              $(".ct-field-terms").prop("checked") &&
              $(".ct-field.valid").length === 4
            ) {
              $(".ct-form-submit").removeClass("ct-disabled");
            }
          },
        });
      });
    }

    if ($(".btn-show-form").length) {
      $(".btn-show-form").on("click", function (e) {
        console.log("AAAAAAAAA");
        if (!window.skipForm) {
          e.preventDefault();
          // var file = $(this).attr("href");
          const workbookURL =
            window.location.origin +
            "/wp-content/uploads/2021/07/EIU_NEC_-Safe-Cities-Index-2021_Final-1.xlsm";
          // let file = $(this).attr("href");
          let file = $(this).attr("data-file");

          if (file === "#") {
            file = workbookURL;
          }

          // $(".download-form").fadeIn().addClass("is-active");
          if (file.includes(".pdf")) {
            $(".download-form")
              .fadeIn()
              .addClass("is-active")
              .attr("data-type", "whitepaper");
          } else {
            $(".download-form")
              .fadeIn()
              .addClass("is-active")
              .attr("data-type", "workbook");
          }

          // $(".download-form").find(".ct-download").attr("href", file);
          $(".download-form").find(".ct-download").attr("data-file", file);
          $(".df-form").addClass("active");

          openDownloadForm();
          var ctField = $(".ct-form-field");
          if (ctField.length) {
            ctField.each(function (index, value) {
              validateField($(value).find("input"));
            });
          }

          const termsCheckbox = $(".ct-field-terms");

          termsCheckbox.change(function () {
            const isComparisonTool = $(this).hasClass("ct-terms");
            console.log("zxczxczxczxc");
            if (isComparisonTool) {
              formInputs("ct");
            } else {
              formInputs();
            }
          });
        }
      });

      $(".btn-close-form").on("click", function (e) {
        e.preventDefault();
        $(".download-form").fadeOut().removeClass("is-active");
        $(".download-form").find(".ct-download").attr("data-file", "");
        // $(".download-form").find(".ct-download").attr("href", "");
      });
      // $('.download-form .ct-download').on('click', function(e) {
      //     e.preventDefault();

      // })
    }
  };

  //saveDownloadFormToDb

  Animation.prototype.animateContent = function (dir, isDelay, playback) {
    // // console.log(dir)
    var animatedChildren = $(".section-active .animated").find(
      ".animated-child"
    );
    if (animatedChildren.length > 0) {
      var animateElement;
      if (dir > 0) {
        animateElement = animatedChildren;
      } else {
        animateElement = animatedChildren.toArray().reverse();
      }
      TweenMax.staggerTo(
        animateElement,
        0.3,
        { delay: isDelay ? 1 : 0, y: 0, opacity: 1, ease: Power3.easeOut },
        0.05
      );
    }

    Animation.prototype.resetContent(dir);
  };

  Animation.prototype.resetContent = function (dir) {
    var animatedChildren = $(".section-active")
      .siblings()
      .find(".animated-child");

    var prevSections = $(".section-active").prevAll().find(".animated-child");
    var nextSections = $(".section-active").nextAll().find(".animated-child");

    if (app.Navigation.sectionTransition === "slide") {
      TweenMax.set(prevSections, { y: -25, opacity: 0 });
      TweenMax.set(nextSections, { y: 25, opacity: 0 });
    } else {
      TweenMax.set(animatedChildren, { y: 25, opacity: 0 });
    }
  };

  // Animation.prototype.preloader = function () {
  //   if (app.ProgressLoader) {
  //     var percentage = $(".content__preloader .percent");
  //     // app.ProgressLoader.prototype.loadCheck(percentage, Animation.prototype.preloaderTransition)
  //   }
  // };

  Animation.prototype.preloaderTransition = function (fn) {
    // console.log('preloader trigger')
    var preloader = $(".preloader"),
      preloaderSection = $(".preloader-section"),
      videoSection = $(".transition-section"),
      content = $(".section-layer-1 .content-layer");

    var height = $(window).height();
    var yPos = $(window).width() > 768 ? 0 : height / 3;

    // TweenMax.set(videoSection, {
    //   opacity: 1,
    //   delay: 1,
    //   onComplete: function () {
        // $(".preloader-image").remove();
        // if ($(window).width() > 768) {
        //   if (createjs && stage) {
        //     // createjs.Ticker.addEventListener('tick', stage)
        //   }
        // }

        // app.Navigation.prototype.triggerNavigate("down");
        // TweenMax.to([".satellite-wrapper", ".percent-wrapper"], 0.5, {
        //   opacity: 0,
        //   ease: Expo.easeOut,
        //   onComplete: function () {},
        // });
        TweenMax.to(".model-layer._promo", 0.5, {
          delay: 0.5,
          scale: 1.05,
          ease: Expo.easeIn,
          transformOrigin: "center -143%",
        });

        TweenMax.to(".section-layer-1 .model-layer._bottom", 0.5, {
          delay: 0.5,
          scale: 1.0,
          y: -yPos,
          ease: Expo.easeIn,
          transformOrigin: "center bottom",
          onComplete: function () {
            TweenMax.set(preloader, {
              opacity: 0,
              ease: Expo.easeInOut,
              onComplete: function () {
                // if ($(window).width() > 768) {
                Animation.isPreloading = false;

                // if (exportRoot) {
                //   exportRoot.initCity();
                // }
                // } else {
                //   TweenMax.to($('.mobile-layers'), .7, { scaleX: 1, scaleY: 1, ease: Back.easeOut })
                // }
                TweenMax.set(content, {
                  display: "flex",
                  onComplete: function () {
                    preloader.remove();
                    if (sectionConfig === "sync") {
                      var animatedChildren = $(
                        ".section-active .section-animated"
                      ).find(".section-animated-child");
                      TweenMax.staggerTo(
                        animatedChildren,
                        0.3,
                        { delay: 1, y: 0, opacity: 1, ease: Power3.easeOut },
                        0.05
                      );
                      // TweenMax.to(
                      //   [
                      //     $(".content__header"),
                      //     $(".content__footer"),
                      //     $(".language-container"),
                      //   ],
                      //   0.7,
                      //   {
                      //     delay: 1,
                      //     y: 0,
                      //     ease: Expo.easeOut,
                      //     onComplete: function () {
                      //       $(".content__header, .language-container").css(
                      //         "z-index",
                      //         6
                      //       );
                      //       Animation.isPreloading = false;
                      //       app.Navigation.intransition = false;
                      //     },
                      //   }
                      // );
                      TweenMax.to($(".section-control-nav img"), 0.5, {
                        delay: 1.1,
                        y: 0,
                        ease: Strong.easeOut,
                      });
                    } else {
                      Animation.prototype.animateContent(1, true);
                    }

                    app.Carousel.prototype.init();

                    // scroll change section tracking
                    // if (config.tracking.sections) {
                    //   var _data = config.tracking.sections[0];
                    //   // console.log(_data)
                    //   $.ecojs.tracking.send(
                    //     _data.event,
                    //     _data.category,
                    //     _data.label,
                    //     _data.value
                    //   );
                    // }
                  },
                });
              },
            });
          },
        });
      // },
    // });
  };

  Animation.prototype.earthTransition = function () {
    var layer1 = $(".earth-layer-1"),
      layer2 = $(".earth-layer-2"),
      layer3 = $(".earth-layer-3"),
      layer4 = $(".earth-layer-4");

    var sp = 0.02;
    TweenMax.to(layer1, 8, {
      rotation: "-360",
      ease: Linear.easeNone,
      transformOrigin: "center",
      repeat: -1,
    }).timeScale(sp);
    TweenMax.to(layer2, 5, {
      rotation: "360",
      ease: Linear.easeNone,
      transformOrigin: "center",
      repeat: -1,
    }).timeScale(sp);
    TweenMax.to(layer3, 2, {
      rotation: "-360",
      ease: Linear.easeNone,
      transformOrigin: "center",
      repeat: -1,
    }).timeScale(sp);
    TweenMax.to(layer4, 3, {
      rotation: "360",
      ease: Linear.easeNone,
      transformOrigin: "center",
      repeat: -1,
    }).timeScale(sp);
  };

  app.Animation = Animation;

  app.ready(function () {
    // console.log('Animation Ready')
    Animation.prototype.init();
  });
})(window.app);
