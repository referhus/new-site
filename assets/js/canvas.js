;(function (app) {
  'use strict'

  var Canvas = function () {}
  var canvasIsloaded = false;
  Canvas.prototype.init = function () {
    var _self = this

    canvas = document.getElementById('canvas')
    anim_container = document.getElementById('animation_container')
    dom_overlay_container = document.getElementById('dom_overlay_container')
    if (AdobeAn && createjs) {
      var comp = AdobeAn.getComposition('EC1322B5AE7A4510BFB217DAE8BC1D05')
      var lib = comp.getLibrary()
      var loader = new createjs.LoadQueue(false)
      loader.addEventListener('fileload', function (evt) {Canvas.prototype.handleFileLoad(evt, comp)})
      loader.addEventListener('complete', function (evt) { Canvas.prototype.handleComplete(evt, comp) })
      // loader.addEventListener('progress', function (evt) {
      //   app.ProgressLoader.prototype.progressAnimate(evt.progress, evt.total, evt.currentTarget._numItems)
      // })

      var lib = comp.getLibrary()
      loader.loadManifest(lib.properties.manifest)
    }



  }

  Canvas.prototype.handleFileLoad = function (evt, comp) {
    var images = comp.getImages()
    if (evt && (evt.item.type == 'image')) {
      images[evt.item.id] = evt.result
    }
  }

  Canvas.prototype.handleComplete = function (evt, comp) {
    // This function is always called, irrespective of the content. You can use the variable "stage" after it is created in token create_stage.

    var lib = comp.getLibrary()
    var ss = comp.getSpriteSheet()
    var queue = evt.target
    var ssMetadata = lib.ssMetadata
    for (var i = 0; i < ssMetadata.length; i++) {
      ss[ssMetadata[i].name] = new createjs.SpriteSheet({'images': [queue.getResult(ssMetadata[i].name)], 'frames': ssMetadata[i].frames})
    }
    if (window.innerWidth < 768) {
      exportRoot = new lib.City_portrait()
    } else {
      exportRoot = new lib.City_landscape()
    }
    stage = new lib.Stage(canvas)
    // Registers the "tick" event listener.
    fnStartAnimation = function () {
      stage.addChild(exportRoot)
      createjs.Ticker.setFPS(lib.properties.fps)
      createjs.Ticker.addEventListener('tick', stage)
      canvasIsloaded = true;
    }
    // Code to support hidpi screens and responsive scaling.
    AdobeAn.makeResponsive(true, 'height', true, 2, [canvas, anim_container, dom_overlay_container])

    AdobeAn.compositionLoaded(lib.properties.id)
    app.Animation.prototype.preloaderTransition()
    fnStartAnimation()
  }

  Canvas.prototype.refreshImage = function (evt, comp) {
    if(canvasIsloaded) {
      var st = setTimeout(function(){
        AdobeAn.makeResponsive(true, 'height', true, 2, [canvas, anim_container, dom_overlay_container])
        clearTimeout(st)
      },100)
    }
  }

  app.Canvas = Canvas

  app.ready(function () {
    // console.log('Canvas ready')
    Canvas.prototype.init()
  })
})(window.app)
