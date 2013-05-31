/*******************************************************************************
 * Copyright (c) 2002, 2013 Innoopract Informationssysteme GmbH and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    Innoopract Informationssysteme GmbH - initial API and implementation
 *    EclipseSource - ongoing development
 ******************************************************************************/

rwt.qx.Class.define( "rwt.widgets.ProgressBar", {
  extend : rwt.widgets.base.Parent,

  construct : function() {
    this.base( arguments );
    this.setOverflow( "hidden" );
    this.setAppearance( "progressbar" );
    this.setState( "normal" );
    this._timer = null;
    this._gfxCanvasAppended = false;
    // TODO [tb] : Create a superclass for vector-based widgets (canvas?)
    this._canvas = null;
    this._backgroundShape = null;
    this._indicatorShape = null;
    this._borderShape = null;
    this._useBorderShape = false;
    this._gfxBorderWidth = 0;
    this._indicatorVirtualPosition = 0;
    this._separatorStartShape = null;
    this._separatorEndShape = null;
    this._useSeparator = false;
    this._separatorWidth = 0;
    this._minimum = 0;
    this._maximum = 100;
    this._selection = 0;
  },

  destruct : function() {
    if( this._timer != null ) {
      this._timer.stop();
      this._timer.dispose();
    }
    this._timer = null;
    this._canvas = null;
    this._backgroundShape = null;
    this._indicatorShape = null;
    this._borderShape = null;
    this._separatorStartShape = null;
    this._separatorEndShape = null;
  },

  statics : {
    UNDETERMINED_SIZE : 40
  },

  events : {
    "minimumChanged" : "rwt.event.Event",
    "maximumChanged" : "rwt.event.Event",
    "selectionChanged" : "rwt.event.Event"
  },

  properties : {

    indicatorColor : {
      nullable : true,
      init : null,
      apply : "_applyIndicatorFill",
      themeable : true
    },

    // TODO [tb] : wrong offset in IE when vertical (or undetermined)
    indicatorImage : {
      nullable : true,
      init : null,
      apply : "_applyIndicatorFill",
      themeable : true
    },

    indicatorGradient : {
      nullable : true,
      init : null,
      apply : "_applyIndicatorFill",
      themeable : true
    },

    indicatorOpacity : {
      nullable : true,
      init : 1,
      apply : "_applyIndicatorFill",
      themeable : true
    },

    backgroundImageSized : {
      nullable : true,
      init : null,
      apply : "_applyBackgroundImageSized",
      themeable : true
    },

    separatorBorder : {
      nullable : true,
      init : null,
      apply : "_applySeparatorBorder",
      themeable : true
    }

  },

  members : {

    //////
    // API

    setMinimum : function( minimum ) {
      this._minimum = minimum;
      this.dispatchSimpleEvent( "minimumChanged" );
    },

    setMaximum : function( maximum ) {
      this._maximum = maximum;
      this.dispatchSimpleEvent( "maximumChanged" );
    },

    setSelection : function( selection ) {
      this._selection = selection;
      this.addToQueue( "indicatorSelection" );
      this.dispatchSimpleEvent( "selectionChanged" );
    },

    addState : function( state ) {
      if( state === "rwt_INDETERMINATE" ) {
        this._timer = new rwt.client.Timer( 120 );
        this._timer.addEventListener( "interval", this._onInterval, this );
        this._timer.start();
      }
      this.base( arguments, state );
    },

    setState : function( state ) {
      if( state == "error" ) {
        this.removeState( "normal" );
        this.removeState( "paused" );
        this.addState( "error" );
      } else if( state == "paused" ) {
        this.removeState( "normal" );
        this.removeState( "error" );
        this.addState( "paused" );
      } else {
        this.removeState( "error" );
        this.removeState( "paused" );
        this.addState( "normal" );
      }
    },

    //////////////
    // state-info

    _isIndeterminate : function() {
      return this.hasState( "rwt_INDETERMINATE" );
    },

    _isHorizontal : function() {
      return this.hasState( "rwt_HORIZONTAL" );
    },

    _isVertical : function() {
      return this.hasState( "rwt_VERTICAL" );
    },

    ////////////////
    // apply-methods

    // OVERWRITTEN, called indirectly by _applyBorder in rwt.widgets.base.Widget
    _queueBorder : function( value ) {
      this.addToQueue( "indicatorBorder" );
      if( value && value.getStyle() === "rounded" ) {
        // rounded borders are to be ignored by the qooxdoo-layouting:
        this._cachedBorderTop = 0;
        this._cachedBorderRight = 0;
        this._cachedBorderBottom = 0;
        this._cachedBorderLeft = 0;
        this._invalidateFrameDimensions();
      } else {
        this.base( arguments, value );
      }
    },

    // Overwritten from Widget
    _applyBackgroundColor : function( value ) {
      if( this._gfxCanvasAppended ) {
        this._styleBackgroundFill();
      }
    },

    // OVERWRITTEN FROM rwt.widgets.util.GraphicsMixin
    _applyBackgroundGradient : function( value ) {
      if( this._gfxCanvasAppended ) {
        this._styleBackgroundFill();
      }
    },

    _applyBackgroundImage : function( value ) {
      // nothing to do, uses _applyBackgroundImageSized instead
    },

    _applyBackgroundImageSized : function( value ) {
      if( this._gfxCanvasAppended ) {
        this._styleBackgroundFill();
      }
    },

    _applyIndicatorFill : function( value ) {
      if( this._gfxCanvasAppended ) {
        this._styleIndicatorFill();
      }
    },

    _applySeparatorBorder : function( value ) {
      this.addToQueue( "separatorBorder" );
    },

    ///////////////
    // eventhandler

    _onCanvasAppear : function() {
      rwt.graphics.GraphicsUtil.handleAppear( this._canvas );
    },

    _onInterval : function() {
      if( this.isSeeable() ) {
        this._renderIndicatorSelection();
      }
    },

    ///////
    // core

    _layoutPost : function( changes ) {
      if( !this._gfxCanvasAppended ) {
        this._createCanvas();
      }
      var dimensionChanged =    changes.width
                             || changes.height
                             || changes.frameWidth
                             || changes.frameHeight
                             || changes.initial;
      if( changes.separatorBorder ) {
        this._styleSeparatorBorder();
      }
      if( changes.indicatorBorder ) {
        this._styleIndicatorBorder();
      }
      if( changes.indicatorBorder || dimensionChanged ) {
        this._renderDimension();
        this._renderIndicatorSelection();
      } else if( changes.indicatorSelection || changes.separatorBorder ) {
        this._renderIndicatorSelection();
      }
    },

    _createCanvas : function() {
      var GraphicsUtil = rwt.graphics.GraphicsUtil;
      this._canvas = GraphicsUtil.createCanvas();
      this._getTargetNode().appendChild( GraphicsUtil.getCanvasNode( this._canvas ) );
      this._gfxCanvasAppended = true;
      this.addEventListener( "insertDom", this._onCanvasAppear );
      this._backgroundShape = GraphicsUtil.createShape( "roundrect" );
      this._indicatorShape = GraphicsUtil.createShape( "roundrect" );
      GraphicsUtil.addToCanvas( this._canvas, this._backgroundShape );
      GraphicsUtil.addToCanvas( this._canvas, this._indicatorShape );
      this._styleBackgroundFill();
      this._styleIndicatorFill();
      if( this.isSeeable() ) {
        this._onCanvasAppear();
      }
    },

    ///////////////
    // render style

    _styleIndicatorBorder : function() {
      var GraphicsUtil = rwt.graphics.GraphicsUtil;
      if( this.getBorder() && this.getBorder().getStyle() === "rounded" ) {
        if( !this._useBorderShape ) {
          this._style.border = "";
          if( this._borderShape == null ) {
            this._borderShape = GraphicsUtil.createShape( "roundrect" );
          }
          GraphicsUtil.addToCanvas( this._canvas, this._borderShape );
          this._useBorderShape = true;
        }
        this._gfxBorderWidth = this._getMaxBorderWidth( this.getBorder() );
        var color = this.getBorder().getColor();
        // NOTE : Different widths for different edges are not supported
        GraphicsUtil.setStroke( this._borderShape, color, this._gfxBorderWidth );
      } else {
        if( this._useBorderShape ) {
          GraphicsUtil.removeFromCanvas( this._canvas, this._borderShape );
          this._useBorderShape = true;
          this._gfxBorderWidth = 0;
        }
      }
    },

    _styleSeparatorBorder : function() {
      var GraphicsUtil = rwt.graphics.GraphicsUtil;
      var border = this.getSeparatorBorder();
      if( border != null ) {
        if( !this._useSeparator ) {
          if( this._isIndeterminate() ) {
            if( this._separatorStartShape == null ) {
              this._separatorStartShape = GraphicsUtil.createShape( "rect" );
            }
            GraphicsUtil.addToCanvas( this._canvas, this._separatorStartShape );
          }
          if( this._separatorEndShape == null ) {
            this._separatorEndShape = GraphicsUtil.createShape( "rect" );
          }
          GraphicsUtil.addToCanvas( this._canvas, this._separatorEndShape );
          this._useSeparator = true;
        }
        this._separatorWidth = this._getMaxBorderWidth( border );
        // use one color for all edges:
        var color = border.getColorTop();
        GraphicsUtil.setFillColor( this._separatorEndShape, color );
        if( this._isIndeterminate() ) {
          GraphicsUtil.setFillColor( this._separatorStartShape, color );
        }
      } else if( this._useSeparator ) {
        GraphicsUtil.removeFromCanvas( this._canvas, this._separatorEndShape );
        this._useSeparator = false;
        if( this._isIndeterminate() ) {
          GraphicsUtil.removeFromCanvas( this._canvas, this._separatorStartShape );
        }
        this._separatorWidth = 0;
      }
    },

    // indicator and separator do not support different border-widths
    _getMaxBorderWidth : function( border ) {
      var maxWidth = 0;
      maxWidth = Math.max( maxWidth, border.getWidthTop() );
      maxWidth = Math.max( maxWidth, border.getWidthLeft() );
      maxWidth = Math.max( maxWidth, border.getWidthRight() );
      maxWidth = Math.max( maxWidth, border.getWidthBottom() );
      return maxWidth;
    },

    _styleIndicatorFill : function() {
      var GraphicsUtil = rwt.graphics.GraphicsUtil;
      if( this.getIndicatorImage() != null && this.getIndicatorImage()[ 0 ] != null ) {
        var image = this.getIndicatorImage();
        GraphicsUtil.setFillPattern( this._indicatorShape, image[ 0 ], image[ 1 ], image[ 2 ] );
      } else if( this.getIndicatorGradient() != null ) {
        GraphicsUtil.setFillGradient( this._indicatorShape, this.getIndicatorGradient() );
      } else {
        GraphicsUtil.setFillColor( this._indicatorShape, this.getIndicatorColor() );
      }
      GraphicsUtil.setOpacity( this._indicatorShape, this.getIndicatorOpacity() );
    },

    _styleBackgroundFill : function() {
      var GraphicsUtil = rwt.graphics.GraphicsUtil;
      if( this.getBackgroundImageSized() != null && this.getBackgroundImageSized()[ 0 ] != null ) {
        var image = this.getBackgroundImageSized();
        GraphicsUtil.setFillPattern( this._backgroundShape, image[ 0 ], image[ 1 ], image[ 2 ] );
      } else if( this.getBackgroundGradient() != null ) {
        GraphicsUtil.setFillGradient( this._backgroundShape, this.getBackgroundGradient() );
      } else {
        GraphicsUtil.setFillColor( this._backgroundShape, this.getBackgroundColor() );
      }
    },

    ////////////////
    // render layout

    _renderDimension : function() {
      var GraphicsUtil = rwt.graphics.GraphicsUtil;
      var radii = [ 0, 0, 0, 0 ];
      var width = this.getInnerWidth();
      var height = this.getInnerHeight();
      if( this._useBorderShape ) {
        radii = this.getBorder().getRadii();
        GraphicsUtil.setRoundRectLayout( this._borderShape,
                                         this._gfxBorderWidth / 2,
                                         this._gfxBorderWidth / 2,
                                         width - this._gfxBorderWidth,
                                         height - this._gfxBorderWidth,
                                         radii );
      }
      GraphicsUtil.setRoundRectLayout( this._backgroundShape,
                                       this._gfxBorderWidth / 2,
                                       this._gfxBorderWidth / 2,
                                       width - this._gfxBorderWidth,
                                       height - this._gfxBorderWidth,
                                       radii );
    },

    _renderIndicatorSelection : function() {
      var GraphicsUtil = rwt.graphics.GraphicsUtil;
      var virtualPosition = this._getIndicatorVirtualPosition();
      var position = Math.max( virtualPosition, 0 );
      var length = this._getIndicatorLength( virtualPosition );
      if( length > 0 ) {
        var radii = this._getIndicatorRadii( position, length );
        // adjust position and length to hide edges under the border
        var displayPosition = position;
        var displayLength = length;
        if( position + length == this._getIndicatorFullLength() ) {
          displayLength += this._gfxBorderWidth / 2;
        } else {
          // this is done to reduce flickering in IE:
          displayLength += this._separatorWidth;
        }
        if( displayPosition === 0 ) {
          displayPosition += this._gfxBorderWidth / 2;
          displayLength += this._gfxBorderWidth / 2;
        } else {
          displayPosition += this._gfxBorderWidth;
        }
        // compute bounds
        var vertical = this._isVertical();
        var width =   vertical
                    ? this.getInnerWidth() - this._gfxBorderWidth
                    : displayLength;
        var height =   vertical
                     ? displayLength
                     : this.getInnerHeight() - this._gfxBorderWidth;
        var top =   vertical
                  ? this.getInnerHeight() - ( displayPosition + displayLength )
                  : this._gfxBorderWidth / 2;
        var left = vertical ? this._gfxBorderWidth / 2 : displayPosition;
        var shape = this._indicatorShape;
        GraphicsUtil.setDisplay( this._indicatorShape, true );
        GraphicsUtil.setRoundRectLayout( shape, left, top, width, height, radii );
      } else {
        GraphicsUtil.setDisplay( this._indicatorShape, false );
      }
      if( this._useSeparator ) {
        this._renderSeparator( position, length );
      }
    },

    _renderSeparator : function( position, length ) {
      var GraphicsUtil = rwt.graphics.GraphicsUtil;
      var full = length + position == this._getIndicatorFullLength();
      if( length === 0 ) {
        GraphicsUtil.setDisplay( this._separatorEndShape, false );
        if( this._isIndeterminate() ) {
          GraphicsUtil.setDisplay( this._separatorStartShape, false );
        }
      } else {
        GraphicsUtil.setDisplay( this._separatorEndShape, !full );
        if( this._isIndeterminate() ) {
          GraphicsUtil.setDisplay( this._separatorStartShape, position !== 0 );
        }
        var displayPosition = position + this._gfxBorderWidth - this._separatorWidth;
        var displayLength = length + 2 * this._separatorWidth;
        if( this._isVertical() ) {
          var left = this._gfxBorderWidth;
          var top = this.getInnerHeight() - ( displayLength + displayPosition );
          var width = this.getInnerWidth() - 2 * this._gfxBorderWidth;
          var height = this._separatorWidth;
          var shape = this._separatorEndShape;
          if( !full ) {
            GraphicsUtil.setRectBounds( shape, left, top, width, height );
          }
          if( position !== 0 ) {
            top = this.getInnerHeight() - displayPosition - this._separatorWidth;
            shape = this._separatorStartShape;
            GraphicsUtil.setRectBounds( shape, left, top, width, height );
          }
        } else {
          var left = displayPosition + displayLength - this._separatorWidth;
          var top = this._gfxBorderWidth;
          var width = this._separatorWidth;
          var height = this.getInnerHeight() - 2 * this._gfxBorderWidth;
          var shape = this._separatorEndShape;
          if( !full ) {
            GraphicsUtil.setRectBounds( shape, left, top, width, height );
          }
          if( position !== 0 ) {
            left = displayPosition;
            shape = this._separatorStartShape;
            GraphicsUtil.setRectBounds( shape, left, top, width, height );
          }
        }
      }
    },

    ////////////////
    // layout helper

    _getIndicatorLength : function( virtualPosition ) {
      var result = this._getIndicatorVirtualLength();
      var fullLength = this._getIndicatorFullLength();
      if( this._isIndeterminate() ) {
        // shorten the length to fit in the bar
        if( virtualPosition < 0 ) {
          result += virtualPosition;
        }
        if( ( virtualPosition + result ) > fullLength ) {
          result = fullLength - virtualPosition;
        }
      } else if( this._useBorderShape ) {
        // round length so it falls into a save area, position is assumed 0
        var minLength = this._getIndicatorMinSafeLength();
        var maxLength = this._getIndicatorMaxSafeLength();
        if( result < minLength ) {
          if( result > 0 ) {
            result = minLength;
          } else {
            result = 0;
          }
        }
        if( result > maxLength && result < fullLength ) {
          result = maxLength;
        }
      }
      return Math.round( result );
    },

    _getIndicatorVirtualLength : function() {
      var result;
      if( this._isIndeterminate() ) {
        result = rwt.widgets.ProgressBar.UNDETERMINED_SIZE;
      } else {
        var fullLength = this._getIndicatorFullLength();
        var selected = this._selection - this._minimum;
        var max = this._maximum - this._minimum;
        result = ( selected / max ) * fullLength;
      }
      return result;
    },

    _getIndicatorVirtualPosition : function() {
      var result = 0;
      if( this._isIndeterminate() ) {
        result = this._computeNextSaveIndicatorPosition();
      }
      return result;
    },

    _computeNextSaveIndicatorPosition : function() {
      var length = rwt.widgets.ProgressBar.UNDETERMINED_SIZE;
      var fullLength = this._getIndicatorFullLength();
      var position = this._indicatorVirtualPosition + 2;
      if( this._useBorderShape ) {
        var minWidth = this._getIndicatorMinSafeLength();
        var maxWidth = this._getIndicatorMaxSafeLength();
        var endPosition = position + length;
        if( endPosition > 0 && endPosition < minWidth ) {
          position = minWidth - length;
        }
        if( position > 0 && position < minWidth ) {
          position = minWidth;
        }
        endPosition = position + length;
        if( endPosition > maxWidth && endPosition < fullLength ) {
          position = fullLength - length;
        }
        if( position > maxWidth ) {
          position = -length;
        }
      } else if( position >= fullLength ) {
        position = -length;
      }
      this._indicatorVirtualPosition = position;
      return position;
    },

    _getIndicatorRadii : function( position, length ) {
      // works under the assumption that positon and length are "radii-save"
      var result = [ 0, 0, 0, 0 ];
      if( this._useBorderShape && length > 0 ) {
        var radii = this.getBorder().getRadii();
        var endPosition = position + length;
        var fullLength = this._getIndicatorFullLength();
        if( this._isVertical() ) {
          if( position === 0 ) {
            result[ 2 ] = radii[ 2 ];
            result[ 3 ] = radii[ 3 ];
          }
          if( endPosition == fullLength ) {
            result[ 0 ] = radii[ 0 ];
            result[ 1 ] = radii[ 1 ];
          }
        } else {
          if( position === 0 ) {
            result[ 0 ] = radii[ 0 ];
            result[ 3 ] = radii[ 3 ];
          }
          if( endPosition == fullLength ) {
            result[ 1 ] = radii[ 1 ];
            result[ 2 ] = radii[ 2 ];
          }
        }
      }
      return result;
    },

    _getIndicatorFullLength : function() {
      return   this._isVertical()
             ? this.getInnerHeight() - 2 * this._gfxBorderWidth
             : this.getInnerWidth() - 2 * this._gfxBorderWidth;
    },

    // minimal indicator-length for the left/lower rounded corners to work
    _getIndicatorMinSafeLength : function() {
      var radii = this.getBorder().getRadii();
      var result =   this._isVertical()
                   ? Math.max( radii[ 2 ], radii[ 3 ] )
                   : Math.max( radii[ 0 ], radii[ 3 ] );
      result += this._separatorWidth;
      result -= Math.floor( this._gfxBorderWidth / 2 );
      return result;
    },

    // maximum indicator-length for the right/upper corners to be rectangular
    _getIndicatorMaxSafeLength : function() {
      var radii = this.getBorder().getRadii();
      var fullLength = this._getIndicatorFullLength();
      var result =   this._isVertical()
                   ? fullLength - Math.max( radii[ 0 ], radii[ 1 ] )
                   : fullLength - Math.max( radii[ 1 ], radii[ 2 ] );
      result -= this._separatorWidth;
      result += Math.floor( this._gfxBorderWidth / 2 );
      return result;
    }

  }
});
