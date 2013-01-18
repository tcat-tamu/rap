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

rwt.qx.Class.define( "rwt.graphics.SVG", {

  statics : {

    init : function(){
      // nothing to do
    },

    createCanvas : function() {
      var result = {};
      var node = this._createNode( "svg" );
      node.style.position = "absolute";
      node.style.left = "0px";
      node.style.top = "0px";
      node.style.width = "100%";
      node.style.height = "100%";
      var defs = this._createNode( "defs" );
      node.appendChild( defs );
      result.type = "svgCanvas";
      result.node = node;
      result.group = node;
      result.defsNode = defs;
      return result;
    },

    getCanvasNode : function( canvas ) {
      return canvas.node;
    },

    handleAppear : function( canvas ) {
      // nothing to do
    },

    enableOverflow : function( canvas, x, y, width, height ) {
      // Supported in firefox 3.0+, safari and chrome (with limitations)
      if( canvas.group === canvas.node ) {
        var node = canvas.node;
        var group = this._createNode( "g" );
        canvas.group = group;
        while( node.firstChild ) {
          group.appendChild( node.firstChild );
        }
        node.appendChild( group );
      }
      canvas.node.style.left = ( x * -1 ) + "px";
      canvas.node.style.top = ( y * -1 ) + "px";
      if( width ) {
        canvas.node.style.width = ( x + width ) + "px";
      } else {
        canvas.node.style.width = "100%";
      }
      if( height ) {
        canvas.node.style.height = ( y + height ) + "px";
      } else {
        canvas.node.style.height = "100%";
      }
      if( x === 0 && y === 0 ) {
        canvas.group.setAttribute( "transform", "" );
      } else {
        canvas.group.setAttribute( "transform", "translate(" + x + "," + y + ")" );
      }
    },

    createShape : function( type ) {
      var result;
      switch( type ) {
        case "rect":
          result = this._createRect();
        break;
        case "roundrect":
          result = this._createRoundRect();
        break;
        default:
          throw "invalid shape " + type;
      }
      result.node.setAttribute( "stroke", "none" );
      result.node.setAttribute( "stroke-width", "0px" );
      result.node.setAttribute( "fill", "none" );
      result.defNodes = {};
      result.parent = null;
      return result;
    },

    addToCanvas : function( canvas, shape, beforeShape ) {
      shape.parent = canvas;
      if( beforeShape ) {
        canvas.group.insertBefore( shape.node, beforeShape.node );
      } else {
        canvas.group.appendChild( shape.node );
      }
      this._attachDefinitions( shape );
    },

    removeFromCanvas : function( canvas, shape ) {
      this._detachDefinitions( shape );
      canvas.group.removeChild( shape.node );
      shape.parent = null;
    },

    setDisplay : function( shape, value ) {
      shape.node.setAttribute( "display", value ? "inline" : "none" );
    },

    getDisplay : function( shape ) {
      var display = shape.node.getAttribute( "display" );
      var result = display == "none" ? false : true;
      return result;
    },

    setRectBounds : function( shape, x, y, width, height ) {
      var node = shape.node;
      node.setAttribute( "width", this._convertNumeric( width ) );
      node.setAttribute( "height", this._convertNumeric( height ) );
      node.setAttribute( "x", this._convertNumeric( x ) );
      node.setAttribute( "y", this._convertNumeric( y ) );
    },

    setRoundRectLayout : function( shape, x, y, width, height, radii ) {
      var maxRadius = Math.floor( Math.min( width, height ) / 2 );
      var radiusLeftTop = Math.min( radii[ 0 ], maxRadius );
      var radiusTopRight = Math.min( radii[ 1 ], maxRadius );
      var radiusRightBottom = Math.min( radii[ 2 ], maxRadius );
      var radiusBottomLeft = Math.min( radii[ 3 ], maxRadius );
      var path = [];
      path.push( "M", x , y + radiusLeftTop );
      if( radiusLeftTop > 0 ) {
        path.push( "A", radiusLeftTop, radiusLeftTop, 0, 0, 1 );
        path.push( x + radiusLeftTop, y );
      }
      path.push( "L", x + width - radiusTopRight, y );
      if( radiusTopRight > 0 ) {
        path.push( "A", radiusTopRight, radiusTopRight, 0, 0, 1 );
      }
      path.push( x + width, y + radiusTopRight);
      path.push( "L", x + width, y + height - radiusRightBottom );
      if( radiusRightBottom > 0 ) {
        path.push( "A", radiusRightBottom, radiusRightBottom, 0, 0, 1 );
      }
      path.push( x + width - radiusRightBottom, y + height );
      path.push( "L", x + radiusBottomLeft, y + height );
      if( radiusBottomLeft > 0 ) {
        path.push( "A", radiusBottomLeft, radiusBottomLeft, 0, 0, 1 );
      }
      path.push( x , y + height - radiusBottomLeft );
      path.push( "Z" );
      shape.node.setAttribute( "d", path.join(" ") );
    },

    setFillColor : function( shape, color ) {
      this.setFillGradient( shape, null );
      if( color != null && color !== "" ) {
        shape.node.setAttribute( "fill", color );
      } else {
        shape.node.setAttribute( "fill", "none" );
      }
    },

    getFillColor : function( shape ) {
      var result = null;
      if( this.getFillType( shape ) == "color" ) {
        result = shape.node.getAttribute( "fill" );
      }
      return result;
    },

    setFillGradient : function( shape, gradient ) {
      if( gradient != null ) {
        var id = "gradient_" + rwt.qx.Object.toHashCode( shape );
        var gradNode;
        var horizontal = gradient.horizontal === true;
        if( typeof shape.defNodes[ id ] == "undefined" ) {
          gradNode = this._createNode( "linearGradient" );
          gradNode.setAttribute( "id", id );
          gradNode.setAttribute( "x1", 0 );
          gradNode.setAttribute( "y1", 0 );
          this._addNewDefinition( shape, gradNode, id );
        } else {
          gradNode = shape.defNodes[ id ];
        }
        gradNode.setAttribute( "x2", horizontal ? 1 : 0 );
        gradNode.setAttribute( "y2", horizontal ? 0 : 1 );
        // clear old colors:
        var stopColor = gradNode.childNodes[ 0 ];
        while( stopColor ) {
          gradNode.removeChild( stopColor );
          stopColor = gradNode.childNodes[ 0 ];
        }
        // set new colors
        for( var colorPos = 0; colorPos < gradient.length; colorPos++ ) {
          stopColor = this._createNode( "stop" );
          stopColor.setAttribute( "offset", gradient[ colorPos ][ 0 ] );
          stopColor.setAttribute( "stop-color", gradient[ colorPos ][ 1 ] );
          gradNode.appendChild( stopColor );
        }
        shape.node.setAttribute( "fill", "url(#" + id + ")" );
      } else {
        shape.node.setAttribute( "fill", "none" );
      }
    },

    setFillPattern : function( shape, source, width, height ) {
      if( source != null ) {
        var hash = rwt.qx.Object.toHashCode( shape );
        var patternId = "pattern_" + hash;
        var patternNode;
        var imageNode;
        if( typeof shape.defNodes[ patternId ] == "undefined" ) {
          patternNode = this._createNode( "pattern" );
          patternNode.setAttribute( "id", patternId );
          patternNode.setAttribute( "x", 0 );
          patternNode.setAttribute( "y", 0 );
          patternNode.setAttribute( "patternUnits", "userSpaceOnUse" );
          imageNode = this._createNode( "image" );
          imageNode.setAttribute( "x", 0 );
          imageNode.setAttribute( "y", 0 );
          imageNode.setAttribute( "preserveAspectRatio", "none" );
          patternNode.appendChild( imageNode );
          this._addNewDefinition( shape, patternNode, patternId );
        } else {
          patternNode = shape.defNodes[ patternId ];
          imageNode = patternNode.firstChild;
        }
        // the "-1" offset drastically reduces the white lines between
        // the tiles when zoomed in firefox.
        patternNode.setAttribute( "width", width );
        patternNode.setAttribute( "height", height );
        imageNode.setAttribute( "width", width );
        imageNode.setAttribute( "height", height );
        shape.node.setAttribute( "fill", "url(#" + patternId + ")" );
        if( rwt.client.Client.getEngine() == "webkit" ) {
          // Bug 301236: Loading an image using SVG causes a bad request
          // AFTER the image-request. Prevent by pre-loading the image.
          this._onImageLoad( source, function() {
            if(   shape.parent !== null
               && shape.parent.node.parentNode )
            {
              rwt.graphics.SVG._setXLink( imageNode, source );
              rwt.graphics.SVG._redrawWebkit( shape );
            }
          } );
        } else {
          this._setXLink( imageNode, source );
        }
      } else {
        shape.node.setAttribute( "fill", "none" );
      }
    },

    getFillType : function( shape ) {
      var result = shape.node.getAttribute( "fill" );
      if( result.search( "pattern_") != -1 ) {
        result = "pattern";
      } else if( result.search( "gradient_") != -1 ) {
        result = "gradient";
      } else if( result == "none" ) {
        result = null;
      } else {
        result = "color";
      }
      return result;
    },

    setStroke : function( shape, color, width ) {
      shape.node.setAttribute( "stroke-width", width + "px" );
      // needed due to a bug in Google Chrome (see bug 300509 ):
      if( width === 0 ) {
        shape.node.setAttribute( "stroke", "none" );
      } else {
        shape.node.setAttribute( "stroke", color != null ? color : "none" );
      }
    },

    getStrokeWidth : function( shape ) {
      // this assumes that only px can be set, which is true within this class
      return parseFloat( shape.node.getAttribute( "stroke-width" ) );
    },

    getStrokeColor : function( shape ) {
      return shape.node.getAttribute( "stroke" );
    },

    setOpacity : function( shape, opacity ) {
      shape.node.setAttribute( "opacity", opacity );
    },

    getOpacity : function( shape ) {
      var result = shape.node.getAttribute( "opacity" );
      return result ? result : 0;
    },

    setBlur : function( shape, blurRadius ) {
      if( blurRadius > 0 ) {
        var id = "filter_" + rwt.qx.Object.toHashCode( shape );
        var filterNode;
        if( typeof shape.defNodes[ id ] === "undefined" ) {
          filterNode = this._createNode( "filter" );
          filterNode.setAttribute( "id", id );
          filterNode.appendChild( this._createNode( "feGaussianBlur" ) );
          this._addNewDefinition( shape, filterNode, id );
        } else {
          filterNode = shape.defNodes[ id ];
        }
        filterNode.firstChild.setAttribute( "stdDeviation", blurRadius / 2 );
        shape.node.setAttribute( "filter", "url(#" + id + ")" );
      } else {
        shape.node.setAttribute( "filter", "none" );
      }
    },

    getBlur : function( shape ) {
      var result = 0;
      var filter = shape.node.getAttribute( "filter" );
      if( filter && filter !== "none" ) {
        var id = "filter_" + rwt.qx.Object.toHashCode( shape );
        var filterNode = shape.defNodes[ id ];
        result = filterNode.firstChild.getAttribute( "stdDeviation" ) * 2;
      }
      return result;
    },

    /////////
    // helper

    _onImageLoad : function( source, func ) {
      var loader = new Image();
      loader.src = source;
      loader.onload = function( ev ) {
        // Fix for bug 301768: "onload" is sometimes called too early due
        // to a bug in Google Chrome. This can be detected by this check:
        if( arguments.callee.caller != null ) {
          rwt.graphics.SVG._onImageLoad( source, func );
        } else {
          func();
        }
      };
    },

    _createNode : function( type ) {
      return document.createElementNS( "http://www.w3.org/2000/svg", type );
    },

    _createRect : function() {
      var result = {};
      result.type = "svgRect";
      var node = this._createNode( "rect" );
      node.setAttribute( "width", "0" );
      node.setAttribute( "height", "0" );
      node.setAttribute( "x", "0" );
      node.setAttribute( "y", "0" );
      result.node = node;
      return result;
    },

    _setXLink : function( node, value ) {
      node.setAttributeNS( "http://www.w3.org/1999/xlink", "href", value );
    },

    _createRoundRect : function() {
      var result = {};
      result.type = "svgRoundRect";
      var node = this._createNode( "path" );
      result.node = node;
      return result;
    },

    _addNewDefinition : function( shape, node, id ) {
      shape.defNodes[ id ] = node;
      if( shape.parent != null ) {
        shape.parent.defsNode.appendChild( node );
      }
    },

    // TODO [tb] : optimize so only the currently needed defs. are attached?
    _attachDefinitions : function( shape ) {
      for( var id in shape.defNodes ) {
        var node = shape.defNodes[ id ];
        shape.parent.defsNode.appendChild( node );
      }
    },

    _detachDefinitions : function( shape ) {
      for( var id in shape.defNodes ) {
        var node = shape.defNodes[ id ];
        node.parentNode.removeChild( node );
      }
    },

    _convertNumeric : function( value ) {
      return typeof value == "string" ? value : value + "px";
    },

    _redrawWebkit : function( shape ) {
      var wrapper = function() {
        rwt.graphics.SVG._redrawWebkitCore( shape );
      };
      window.setTimeout( wrapper, 10 );
    },

    _redrawWebkitCore : function( shape ) {
      if( shape.parent != null ) {
        shape.node.style.webkitTransform = "scale(1)";
      }
    },

    // TODO [tb] : remove if no longer needed:

    _dummyNode : null,

    _getDummyNode : function() {
      if( this._dummyNode == null ) {
        this._dummyNode = this._createNode( "rect" );
      }
      return this._dummyNode;
    }

  }

} );
