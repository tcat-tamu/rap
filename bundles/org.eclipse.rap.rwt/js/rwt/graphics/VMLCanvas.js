/*******************************************************************************
 * Copyright (c) 2010, 2012 EclipseSource and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    EclipseSource - initial API and implementation
 ******************************************************************************/

rwt.qx.Class.define( "rwt.graphics.VMLCanvas", {

  extend : rwt.qx.Object,

  construct : function( canvas ) {
    this._autoDispose = false;
    this.base( arguments );
    this._canvas = canvas;
    this._stateStack = [];
    this._currentPath = [];
    this.strokeStyle = "#000000";
    this.fillStyle = "#000000";
    this.lineWidth = 1;
    this.lineJoin = "miter";
    this.lineCap = "butt";
    this.miterLimit = 10;
    this.globalAlpha = 1;
  },

  destruct : function() {
    this._canvas = null;
  },

  // Implements the Canvas "2d"-context API, with some limitations:
  // Missing: strokeRect, fillRect, clip, arcTo, createRadialGradient,
  // scale, rotate, translate, transform, setTransform
  // Differing API: arc
  // Limited implementation: clearRect, createLinearGradient, drawImage,
  // strokeStyle only supports color, fillStyle does not support patterns
  members : {

    save : function() {
      var states = {};
      this._copyState( this, states );
      this._stateStack.push( states );
    },

    restore : function() {
      var context = this._stateStack.pop();
      this._copyState( context, this );
    },

    beginPath : function() {
      this._currentPath = [];
    },

    closePath : function() {
      this._currentPath.push( { "type" : "close" } );
    },

    // Limitation: Arguments are ignored, the entire canvas is cleared.
    clearRect : function( x, y, width, height ) {
      rwt.graphics.VML.clearCanvas( this._canvas );
    },

    stroke : function( fill ) {
      var shape = rwt.graphics.VML.createShapeFromContext( this, fill );
      rwt.graphics.VML.addToCanvas( this._canvas, shape );
    },

    fill : function() {
      this.stroke( true );
    },

    moveTo : function( x, y ) {
      this._currentPath.push( {
        "type" : "moveTo",
        "x" : x,
        "y" : y
      } );
    },

    lineTo : function( x, y ) {
      this._currentPath.push( {
        "type" : 'lineTo',
        "x" : x,
        "y" : y
      } );
    },

    quadraticCurveTo : function( cp1x, cp1y, x, y ) {
      this._currentPath.push( {
        "type" : "quadraticCurveTo",
        "cp1x" : cp1x,
        "cp1y" : cp1y,
        "x" : x,
        "y" : y
      } );
    },

    bezierCurveTo : function( cp1x, cp1y, cp2x, cp2y, x, y ) {
      this._currentPath.push( {
        "type" : 'bezierCurveTo',
        "cp1x" : cp1x,
        "cp1y" : cp1y,
        "cp2x" : cp2x,
        "cp2y" : cp2y,
        "x"    : x,
        "y"    : y
      } );
    },

    rect : function( x, y, width, height ) {
      // TODO [tb] : Apparently due to "closepath" call IE does not apply the lineJoin attribute
      this.moveTo( x, y );
      this.lineTo( x + width, y );
      this.lineTo( x + width, y + height );
      this.lineTo( x, y + height );
      this.closePath();
    },

    ellipse : function( x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiCW ) {
      // NOTE : according to WHATWG standard, but no support for rotation
      if( this._currentPath.length === 0 ) {
        var startX = x + Math.cos( startAngle ) * radiusX;
        var startY = y + Math.sin( startAngle ) * radiusY;
        this.moveTo( startX, startY );
      }
      this._currentPath.push( {
        "type" : "arc",
        "anticlockwise" : antiCW,
        "centerX" : x,
        "centerY" : y,
        "radiusX" : radiusX,
        "radiusY" : radiusY,
        "startAngle" : startAngle,
        "endAngle" : endAngle
      } );
    },

    arc : function( x, y, radius, startAngle, endAngle, antiCW ) {
      this.ellipse( x, y, radius, radius, 0, startAngle, endAngle, antiCW );
    },

    drawImage : function() {
      var shape = rwt.graphics.VML.createShape( "image" );
      rwt.graphics.VML.setOpacity( shape, this.globalAlpha );
      var image = arguments[ 0 ];
      if( arguments.length == 3 ) {
        var destX = arguments[ 1 ];
        var destY = arguments[ 2 ];
        rwt.graphics.VML.setImageData( shape,
                                          image.src,
                                          destX,
                                          destY,
                                          image.width,
                                          image.height );
      } else {
        var srcX = arguments[ 1 ];
        var srcY = arguments[ 2 ];
        var srcWidth = arguments[ 3 ];
        var srcHeight = arguments[ 4 ];
        var destX = arguments[ 5 ];
        var destY = arguments[ 6 ];
        var destWidth = arguments[ 7 ];
        var destHeight = arguments[ 8 ];
        var crop = [
          srcY / image.height,
          ( image.width - srcX - srcWidth ) / image.width,
          ( image.height - srcY - srcHeight ) / image.height,
          srcX / image.width
        ];
        rwt.graphics.VML.setImageData( shape,
                                          image.src,
                                          destX,
                                          destY,
                                          destWidth,
                                          destHeight,
                                          crop );
      }
      rwt.graphics.VML.addToCanvas( this._canvas, shape );
    },

    // Limitations: The gradient is drawn wither vertically or horizontally.
    // Calls to "addColorStop" must be in the order of the offsets and can not
    // overwrite previous colorsStops.
    createLinearGradient : function( x1, y1, x2, y2 ) {
      var gradient = [];
      gradient.addColorStop = this._addColorStopFunction;
      gradient.horizontal = x1 != x2;
      return gradient;
    },

    /////////
    // Helper

    _copyState : function( source, target ) {
      target.font = source.font;
      target.fillStyle = source.fillStyle;
      target.lineCap = source.lineCap;
      target.lineJoin = source.lineJoin;
      target.lineWidth = source.lineWidth;
      target.miterLimit = source.miterLimit;
      target.shadowBlur = source.shadowBlur;
      target.shadowColor = source.shadowColor;
      target.shadowOffsetX = source.shadowOffsetX;
      target.shadowOffsetY = source.shadowOffsetY;
      target.strokeStyle = source.strokeStyle;
      target.globalAlpha = source.globalAlpha;
    },

    _addColorStopFunction : function( offset, color ) {
      this.push( [ offset, color ] );
    }

  }

} );
