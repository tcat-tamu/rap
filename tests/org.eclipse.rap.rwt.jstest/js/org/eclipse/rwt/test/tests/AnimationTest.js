/*******************************************************************************
 * Copyright (c) 2010, 2012 EclipseSource and others. All rights reserved.
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   EclipseSource - initial API and implementation
 ******************************************************************************/

rwt.qx.Class.define( "org.eclipse.rwt.test.tests.AnimationTest", {
  extend : rwt.qx.Object,
  
  members : {

    /////////////////
    // Animation core

    testEventsAndCustomFunctions : function() {
      var animation = new rwt.animation.Animation();
      var renderer = animation.getDefaultRenderer();
      renderer.setStartValue( 10 );
      renderer.setEndValue( 20 );
      assertEquals( 1, animation.getRendererLength() );
      assertEquals( renderer, animation.getRenderer( 0 ) );
      var log = this._attachLogger( animation, renderer, true );
      animation.start( "myConfig" );
      assertTrue( animation.isStarted() );
      assertFalse( animation.isRunning() );
      assertNotNull( rwt.animation.Animation._interval );
      rwt.animation.Animation._mainLoop();
      assertTrue( animation.isStarted() );
      assertTrue( animation.isRunning() );
      animation._finish();
      assertFalse( animation.isStarted() );
      assertFalse( animation.isRunning() );
      rwt.animation.Animation._mainLoop();
      assertNull( rwt.animation.Animation._interval );
      var expected = [];
      expected.push( "init", "myConfig", "setup", "myConfig" );
      expected.push( "[object rwt.animation.AnimationRenderer]" );
      expected.push( "convert", "number", 10, 20, "render", "number" );
      expected.push( "convert", "number", 10, 20, "render", "number" );
      expected.push( "cancel", "myConfig", "finish", "myConfig" );
      assertEquals( expected, log );
      assertNull( rwt.animation.Animation._interval );
      animation.dispose();
    },
    
    testTransitions : function() {
      var transitions = rwt.animation.Animation.transitions;
      for( var key in transitions ) {
        assertFalse( key + " for 0", isNaN( transitions[ key ]( 0 ) ) );
        assertFalse( key + " for 0.5", isNaN( transitions[ key ]( 0.5 ) ) );
        assertFalse( key + " for 1", isNaN( transitions[ key ]( 1 ) ) );
      }
    },

    testDuration : function() {
      var animation = new rwt.animation.Animation();
      animation.setDuration( 2000 );
      animation.start();
      rwt.animation.Animation._mainLoop();
      var end = new Date().getTime() + 2001;
      assertTrue( animation.isRunning() );
      animation._loop( end );
      assertFalse( animation.isStarted() );
      assertFalse( animation.isRunning() );
      rwt.animation.Animation._mainLoop();
      assertNull( rwt.animation.Animation._interval );
      animation.dispose();
    },

    testStartTime : function() {
      var animation = new rwt.animation.Animation();
      animation.setDuration( 2 );
      var start = new Date().getTime();
      animation.start();
      assertNull( animation._startOn );
      rwt.animation.Animation._mainLoop();
      assertTrue( animation.isRunning() );
      assertTrue( animation._startOn >= start );
      animation.cancel();
      assertNull( rwt.animation.Animation._interval );
      animation.dispose();
    },

    testDisposeAnimation : function() {
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      animation.dispose();
      assertTrue( animation.isDisposed() );      
      assertTrue( renderer.isDisposed() );      
    },

    testDisposeRenderer : function() {
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      renderer.dispose();
      assertFalse( animation.isDisposed() );      
      assertTrue( renderer.isDisposed() );      
      assertEquals( 0, animation.getRendererLength() );      
    },

    testRestart : function() {
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      renderer.setRenderFunction( function(){} );      
      renderer.setConverter( "none" );      
      var log = this._attachLogger( animation, renderer, false );
      animation.start( "myConfig" );
      assertTrue( animation.isStarted() );
      assertFalse( animation.isRunning() );
      rwt.animation.Animation._mainLoop();
      assertTrue( animation.isStarted() );
      assertTrue( animation.isRunning() );
      animation.restart();
      assertTrue( animation.isStarted() );
      assertFalse( animation.isRunning() );
      rwt.animation.Animation._mainLoop();
      assertTrue( animation.isStarted() );
      assertTrue( animation.isRunning() );
      animation._finish();
      assertFalse( animation.isStarted() );
      assertFalse( animation.isRunning() );
      rwt.animation.Animation._mainLoop();
      assertNull( rwt.animation.Animation._interval );
      var expected = [];
      expected.push( "init", "myConfig", "setup", "myConfig" );
      expected.push( "cancel", "myConfig" );
      expected.push( "init", "myConfig", "setup", "myConfig" );
      expected.push( "cancel", "myConfig", "finish", "myConfig" );
      assertEquals( expected, log );
      assertNull( rwt.animation.Animation._interval );
      animation.dispose();
    },

    testCancel : function() {
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      renderer.setStartValue( 10 );
      renderer.setEndValue( 20 );
      assertEquals( 1, animation.getRendererLength() );
      assertEquals( renderer, animation.getRenderer( 0 ) );
      var log = this._attachLogger( animation, renderer, true );
      animation.start( "myConfig" );
      assertTrue( animation.isStarted() );
      assertFalse( animation.isRunning() );
      assertNotNull( rwt.animation.Animation._interval );
      animation.cancel();
      assertNull( renderer.getLastValue() );
      assertFalse( animation.isStarted() );
      assertFalse( animation.isRunning() );
      rwt.animation.Animation._mainLoop();
      assertNull( rwt.animation.Animation._interval );
      var expected = [];
      expected.push( "init", "myConfig" );
      expected.push( "cancel", "myConfig" );
      assertEquals( expected, log );
      assertNull( rwt.animation.Animation._interval );
      animation.dispose();
    },
    
   testSkip : function() {
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      renderer.setStartValue( 10 );
      renderer.setEndValue( 20 );
      assertEquals( 1, animation.getRendererLength() );
      assertEquals( renderer, animation.getRenderer( 0 ) );
      var log = this._attachLogger( animation, renderer, true );
      animation.start( "myConfig" );
      assertTrue( animation.isStarted() );
      assertFalse( animation.isRunning() );
      assertNotNull( rwt.animation.Animation._interval );
      animation.skip();
      assertEquals( 1, renderer.getLastValue() );
      assertFalse( animation.isStarted() );
      assertFalse( animation.isRunning() );
      rwt.animation.Animation._mainLoop();
      assertNull( rwt.animation.Animation._interval );
      var expected = [];
      expected.push( "init", "myConfig", "setup", "myConfig" );
      expected.push( "[object rwt.animation.AnimationRenderer]" );
      expected.push( "convert", "number", 10, 20, "render", "number" );
      expected.push( "convert", "number", 10, 20, "render", "number" );
      expected.push( "cancel", "myConfig", "finish", "myConfig" );
      assertEquals( expected, log );
      assertNull( rwt.animation.Animation._interval );
      animation.dispose();
    },

    testExclusiveAnimation : function() {
      var animation = new rwt.animation.Animation();
      var animation2 = new rwt.animation.Animation();
      animation.setDuration( 1000 );
      animation2.setDuration( 1000 );
      var start = new Date().getTime();

      animation.setExclusive( true );
      animation2.start();
      animation.start();
      rwt.animation.Animation._mainLoop();

      assertTrue( animation.isRunning() );
      assertFalse( animation2.isRunning() );
      animation.dispose();
      animation2.dispose();
    },
    
    testSingleExclusiveAnimation : function() {
      var animation = new rwt.animation.Animation();
      animation.setDuration( 1000 );
      
      animation.setExclusive( true );
      animation.start();
      rwt.animation.Animation._mainLoop();
      
      assertTrue( animation.isRunning() );
      animation.dispose();
    },
    
    
    testExclusiveAnimationCanceled : function() {
      var animation = new rwt.animation.Animation();
      var animation2 = new rwt.animation.Animation();
      animation.setDuration( 1000 );
      animation2.setDuration( 1000 );
      var start = new Date().getTime();
      
      animation.setExclusive( true );
      animation2.start();
      animation.start();
      rwt.animation.Animation._mainLoop();
      animation.cancel(); // TODO [tb] : split
      rwt.animation.Animation._mainLoop();
    
      assertFalse( animation.isRunning() );
      assertTrue( animation2.isRunning() );
      animation.dispose();
      animation2.dispose();
    },
    
    
    /////////////////////////
    // AnimationRenderer core
    
    testConverter : function() {
      var converter = rwt.animation.AnimationRenderer.converter;
      assertEquals( -27.3, converter.none( -27.3 ) );
      assertEquals( -27, converter.round( -27.3 ) );
      assertEquals( 0, converter.positive( -27.3 ) );
      assertEquals( -14.4, converter.numeric( 0.44, -10, -20 ) );
      assertEquals( -14, converter.numericRound( 0.44, -10, -20 ) );
      assertEquals( 0, converter.numericPositive( 0.44, -10, -20 ) );
      assertEquals( 0, converter.numericPositiveRound( 0.44, -10, -20 ) );
      assertEquals( 14, converter.numericPositiveRound( 0.44, 10, 20 ) );
      assertEquals( 0, converter.factor ( 0.1, -1, 2 ) );
      assertEquals( 0.5, converter.factor ( 0.5, -1, 2 ) );
      assertEquals( 1, converter.factor ( 0.9, -1, 2 ) );
      var result = converter.color( 0.5, [ 0, 0, 200 ], [ 0, 100, 0 ] );
      assertEquals( "rgb(0,50,100)", result );
      result = converter.color( 3, [ 0, 0, 200 ], [ 0, 100, 100 ] );
      assertEquals( "rgb(0,255,0)", result );
      var gradient1 = [ 
        [ 0, [ 0, 255, 100 ] ], 
        [ 0.4, [ 0, 127, 50 ] ], 
        [ 1, [ 0, 255, 0 ] ] 
      ];
      var gradient2 = [ 
        [ 0, [ 0, 0, 50 ] ], 
        [ 0.6, [ 0, 127, 150 ] ], 
        [ 1, [ 255, 0, 0 ] ] 
      ];
      result = converter.gradient( 0.5, gradient1, gradient2 );
      var expected = "0,rgb(0,128,75),0.5,rgb(0,127,100),1,rgb(128,128,0)";
      assertEquals( expected,result.join() );
    },
    
    testActivateRendererOnce : function() {
      var log = [];
      var animation = new rwt.animation.Animation();
      var renderer1 = new rwt.animation.AnimationRenderer( animation );
      renderer1.setRenderFunction( function( value ){ 
        log.push( "render 1", typeof value ); 
      } );      
      renderer1.setConverter( "none" );      
      renderer1.setSetupFunction( function( config, context ) { 
        log.push( "setup 1", config ); 
      } );
      var renderer2 = new rwt.animation.AnimationRenderer( animation );
      renderer2.setRenderFunction( function( value ){ 
        log.push( "render 2", typeof value ); 
      } );      
      renderer2.setConverter( "none" );      
      renderer2.setSetupFunction( function( config, context ) { 
        log.push( "setup 2", config ); 
      } );
      renderer2.activateOnce();
      assertTrue( renderer1._active );
      assertTrue( renderer2._active );
      assertFalse( renderer1._activeOnce );
      animation.start( "myConfig1" );
      rwt.animation.Animation._mainLoop();
      assertTrue( animation.isRunning() );
      animation._finish();
      assertFalse( animation.isStarted() );
      rwt.animation.Animation._mainLoop();
      assertNull( rwt.animation.Animation._interval );
      assertFalse( renderer1._activeOnce );
      assertFalse( renderer2._activeOnce );
      assertTrue( renderer1._active );
      assertFalse( renderer2._active );
      animation.start( "myConfig2" );
      rwt.animation.Animation._mainLoop();
      assertTrue( animation.isRunning() );
      animation._finish();
      assertFalse( animation.isStarted() );
      rwt.animation.Animation._mainLoop();
      assertNull( rwt.animation.Animation._interval );
      var expected = [];
      expected.push( "setup 1", "myConfig1", "setup 2", "myConfig1" );
      expected.push( "render 1", "number", "render 2", "number" );
      expected.push( "render 1", "number", "render 2", "number" );
      expected.push( "setup 1", "myConfig2" );
      expected.push( "render 1", "number", "render 1", "number" );
      assertEquals( expected, log );
      assertNull( rwt.animation.Animation._interval );
      animation.dispose();
    },
    
    testActivateAllRendererOnce : function() {
      var animation = new rwt.animation.Animation();
      var renderer1 = new rwt.animation.AnimationRenderer( animation );
      var renderer2 = new rwt.animation.AnimationRenderer( animation );
      animation.activateRendererOnce();
      assertTrue( renderer1._activeOnce );
      assertTrue( renderer2._activeOnce );
      animation.dispose();
    },

    testPrepareValue : function() {
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      renderer._renderType = "height";
      assertEquals( 1, renderer._prepareValue( 1 ) );
      assertEquals( 0, renderer._prepareValue( null ) );
      renderer._renderType = "backgroundColor";
      assertEquals( [ 0, 255, 0 ], renderer._prepareValue( "#00FF00" ) );
      assertNull( renderer._prepareValue( null ) );
      assertNull( renderer._prepareValue( "transparent" ) );
      renderer._renderType = "backgroundGradient";
      var gradient = [ 
        [ 0, "#FF0000" ], 
        [ 0.4, "#00FF00" ], 
        [ 1, "#0000FF" ]
      ];
      var result = renderer._prepareValue( gradient );
      assertEquals( 0, result[ 0 ][ 0 ] );
      assertEquals( 0.4, result[ 1 ][ 0 ] );
      assertEquals( 1, result[ 2 ][ 0 ] );
      assertEquals( [ 255, 0, 0 ], result[ 0 ][ 1 ] );
      assertEquals( [ 0, 255, 0 ], result[ 1 ][ 1 ] );
      assertEquals( [ 0, 0, 255 ], result[ 2 ][ 1 ] );
      assertNull( renderer._prepareValue( null ) );
      renderer._renderType = null;
      animation.dispose();
    },

    testCloneFrom : function() {
      var animation = new rwt.animation.Animation();
      var renderer1 = new rwt.animation.AnimationRenderer( animation );
      var renderer2 = new rwt.animation.AnimationRenderer( animation );
      renderer1.setRenderFunction( function(){} );
      renderer2.setRenderFunction( function(){} );
      renderer1.setConverter( "numeric" );
      renderer1.setStartValue( 0 );
      renderer1.setEndValue( 120 );
      renderer2.setCloneFrom( renderer1 );
      renderer2.setConverter( function( value ){ return value - 10; } );
      animation.start();
      animation._render( 0.5 );
      assertEquals( 60, renderer1.getLastValue() );
      assertEquals( 50, renderer2.getLastValue() );
      animation._finish();
      assertEquals( 120, renderer1.getLastValue() );
      assertEquals( 110, renderer2.getLastValue() );
      animation.dispose();
    },
    
    /////////////////////////////////////////
    // AnimationRenderer - Widget integration
     
    testCheckValues : function() {
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      renderer._renderType = "height";
      renderer.setStartValue( 1 );
      renderer.setEndValue( 2 );
      assertTrue( renderer.checkValues() );
      renderer.setStartValue( 1 );
      renderer.setEndValue( 1 );
      assertFalse( renderer.checkValues() );
      renderer._renderType = "backgroundColor";
      renderer.setStartValue( "#FF00FF" );
      renderer.setEndValue( "#FF0000" );
      assertTrue( renderer.checkValues() );
      renderer.setEndValue( "#FF00FF" );
      assertFalse( renderer.checkValues() );
      renderer.setEndValue( null );
      assertFalse( renderer.checkValues() );
      renderer._renderType = null;
      animation.dispose();
    },

    testIsAnimated : function() {
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      var widget = new rwt.widgets.base.Terminator();
      var typeAppear = rwt.animation.AnimationRenderer.ANIMATION_APPEAR;
      var typeDisappear = rwt.animation.AnimationRenderer.ANIMATION_DISAPPEAR;
      var typeChange = rwt.animation.AnimationRenderer.ANIMATION_CHANGE;
      assertFalse( renderer.isAnimated() );
      renderer.animate( widget, "opacity", typeAppear | typeDisappear );
      renderer.setActive( false );
      assertFalse( renderer.isAnimated() );
      renderer.setActive( true );
      assertTrue( renderer.isAnimated() );
      assertTrue( renderer.isAnimated( typeAppear ) );
      assertFalse( renderer.isAnimated( typeChange) );
      assertTrue( renderer.isAnimated( typeDisappear ) );
      renderer.clearAnimation();
      assertFalse( renderer.isAnimated() );
      renderer.animate( widget, "opacity", typeChange );
      assertFalse( renderer.isAnimated( typeAppear ) );
      assertTrue( renderer.isAnimated( typeChange ) );
      assertFalse( renderer.isAnimated( typeDisappear ) );
      renderer.animate( widget, "opacity", 0 );
      assertFalse( renderer.isAnimated( typeDisappear ) );
      assertFalse( renderer.isAnimated( typeChange ) );
      assertFalse( renderer.isAnimated( typeAppear ) );
      assertFalse( renderer.isAnimated() );
      animation.dispose();
    },

    testGetHeightFromWidget : function() {
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      renderer.animate( this._createWidget(), "height", 0 );
      assertEquals( 200, renderer.getValueFromWidget() );
      this._cleanUp( animation );
    },

    testGetBackgroundColorFromWidget : function() {
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      var widget = this._createWidget();
      widget.setBackgroundColor( "#FF0000" );
      renderer.animate( widget, "backgroundColor", 0 );
      assertEquals( [ 255, 0, 0 ], 
                    renderer._prepareValue( renderer.getValueFromWidget() ) );
      widget.setBackgroundColor( "transparent" );
      assertEquals( null, 
                    renderer._prepareValue( renderer.getValueFromWidget() ) );
      widget.setBackgroundColor( null );
      assertEquals( null, 
                    renderer._prepareValue( renderer.getValueFromWidget() ) );
      this._cleanUp( animation );      
    }, 

    testGetBackgroundColorFromWidgetWidthRoundedBorder : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      var widget = this._createWidget();
      var border = new rwt.html.Border( 1, "rounded", "black", 4 );
      widget.setBorder( border );
      widget.setBackgroundColor( "#FF0000" );
      TestUtil.flush();
      renderer.animate( widget, "backgroundColor", 0 );
      assertEquals( [ 255, 0, 0 ], renderer._prepareValue( renderer.getValueFromWidget() ) );
      widget.setBackgroundColor( "transparent" );
      assertEquals( null, renderer._prepareValue( renderer.getValueFromWidget() ) );
      widget.setBackgroundColor( null );
      assertEquals( null, renderer._prepareValue( renderer.getValueFromWidget() ) );
      this._cleanUp( animation );      
    }, 

    testGetBackgroundGradientFromWidget : function() {
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      var widget = this._createWidget();
      var gradient = [ [ 0, "#FF0000" ], [ 0, "#00FF00" ] ];
      widget.setBackgroundGradient( gradient );
      renderer.animate( widget, "backgroundGradient", 0 );
      assertIdentical( gradient, renderer.getValueFromWidget() );
      widget.setBackgroundGradient( null );
      assertEquals( null, renderer.getValueFromWidget() );
      this._cleanUp( animation );
    },

    testHandleAnimation : function() {
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      var widget = this._createWidget();
      var typeChange = rwt.animation.AnimationRenderer.ANIMATION_CHANGE;
      var renderAdapter = widget.getAdapter( rwt.widgets.util.WidgetRenderAdapter );
      
      renderer.animate( widget, "opacity", typeChange );
      
      assertTrue( renderAdapter.hasEventListeners( "visibility" ) );
      assertTrue( renderAdapter.hasEventListeners( "opacity" ) );
      renderer.clearAnimation();
      assertFalse( renderAdapter.hasEventListeners( "visibility" ) );
      assertFalse( renderAdapter.hasEventListeners( "opacity" ) );
      widget.destroy();
      this._cleanUp( animation );
    },
        
    /////////////////
    // Test scenarios
    
    // Tests animationType "disappear" and renderType "opacity"
    testFadeOut : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      var widget = this._createWidget();
      assertFalse( TestUtil.hasElementOpacity( widget.getElement() ) );
      var typeDisappear = rwt.animation.AnimationRenderer.ANIMATION_DISAPPEAR;      
      renderer.animate( widget, "opacity", typeDisappear );
      widget.hide();
      assertTrue( widget._style.display != "none" );
      assertTrue( animation.isStarted() );
      assertEquals( null, renderer.getStartValue() );
      assertEquals( 0, renderer.getEndValue() );
      animation._render( 0.5 );
      assertEquals( 1, renderer.getStartValue() );
      assertEquals( 0, renderer.getEndValue() );
      assertTrue( widget._style.display != "none" );
      assertEquals( 0.5, renderer.getLastValue() );
      assertTrue( TestUtil.hasElementOpacity( widget.getElement() ) );
      animation._finish();
      assertFalse( animation.isStarted() );
      assertEquals( 0, renderer.getLastValue() ); 
      assertFalse( TestUtil.hasElementOpacity( widget.getElement() ) );
      assertEquals( "none", widget._style.display );
      widget.show();
      assertFalse( animation.isStarted() );
      assertTrue( widget._style.display != "none" );
      this._cleanUp( animation );
    },

    // Tests animationType "appear" and renderType "height"
    testSlideIn : function() {
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      var widget = this._createWidget();
      widget.hide();
      var typeAppear = rwt.animation.AnimationRenderer.ANIMATION_APPEAR;      
      renderer.animate( widget, "height", typeAppear );
      assertEquals( "none", widget._style.display );
      widget.show();
      assertTrue( widget._style.display != "none" );
      assertEquals( 0, parseInt( widget._style.height ) );
      assertTrue( animation.isStarted() );
      assertEquals( 0, renderer.getStartValue() );
      assertEquals( 200, renderer.getEndValue() );
      animation._render( 0.5 );
      assertEquals( 100, renderer.getLastValue() );
      assertEquals( 100, parseInt( widget._style.height ) );
      animation._finish();
      assertFalse( animation.isStarted() );
      assertEquals( 200, renderer.getLastValue() );
      assertEquals( 200, parseInt( widget._style.height ) );
      assertTrue( widget._style.display != "none" );
      widget.hide();
      assertFalse( animation.isStarted() );
      assertEquals( "none", widget._style.display );
      this._cleanUp( animation );      
    },

    testNoDisappearAnimationBeforeCreate : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      var widget = this._createWidget( true );
      var typeDisappear = rwt.animation.AnimationRenderer.ANIMATION_DISAPPEAR;      
      renderer.animate( widget, "opacity", typeDisappear );
      
      widget.hide();
      
      assertFalse( animation.isStarted() );
      this._cleanUp( animation );
    },


    // Tests animationType "change" and renderType "backgroundColor"
    testGlow : function() {
      var ColorUtil = rwt.util.Colors;
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      var widget = this._createWidget();
      widget.hide();
      widget.setBackgroundColor( "#FF0000" );
      var typeChange = rwt.animation.AnimationRenderer.ANIMATION_CHANGE;
      renderer.animate( widget, "backgroundColor", typeChange );
      widget.show();
      assertFalse( animation.isStarted() );
      assertTrue( widget.isSeeable() );
      widget.setBackgroundColor( "#00FF00" );
      assertTrue( animation.isStarted() );
      assertEquals( [ 255, 0, 0 ], ColorUtil.cssStringToRgb( widget._style.backgroundColor ) );
      assertEquals( [ 255, 0, 0 ], ColorUtil.cssStringToRgb( renderer.getStartValue() ) );
      assertEquals( [ 0, 255, 0 ], ColorUtil.cssStringToRgb( renderer.getEndValue() ) );
      animation._render( 0.5 ); assertTrue( animation.isRunning() );
      assertEquals( [ 128, 128, 0 ], ColorUtil.cssStringToRgb( renderer.getLastValue() ) );
      assertEquals( [ 128, 128, 0 ], ColorUtil.cssStringToRgb( widget._style.backgroundColor ) );
      animation._finish();
      assertFalse( animation.isStarted() );
      assertEquals( [ 0, 255, 0 ], ColorUtil.cssStringToRgb( renderer.getLastValue() ) );
      assertEquals( [ 0, 255, 0 ], ColorUtil.cssStringToRgb( widget._style.backgroundColor ) );
      widget.hide();
      assertFalse( animation.isStarted() );
      this._cleanUp( animation );     
    },

    // Can not animate from or to transparent/no color.  
    testGlowInvalidColor : function() {
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      var widget = this._createWidget();
      widget.hide();
      widget.setBackgroundColor( "#FF0000" );
      var typeChange = rwt.animation.AnimationRenderer.ANIMATION_CHANGE;
      renderer.animate( widget, "backgroundColor", typeChange );
      widget.show();
      assertFalse( animation.isStarted() );
      assertTrue( widget.isSeeable() );
      widget.setBackgroundColor( null );
      assertFalse( animation.isStarted() );
      this._cleanUp( animation );     
    },
    
    // Tests animationType "change" and renderType "height"
    testResize : function() {
      var proto = rwt.widgets.base.MultiCellWidget.prototype;
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      var widget = this._createWidget();
      var typeAppear = rwt.animation.AnimationRenderer.ANIMATION_APPEAR;
      var typeChange = rwt.animation.AnimationRenderer.ANIMATION_CHANGE;
      renderer.animate( widget, "height", typeChange );
      assertFalse( proto._renderRuntimeHeight == widget._renderRuntimeHeight );      
      assertFalse( animation.isStarted() );
      assertTrue( widget.isSeeable() );
      widget.setHeight( 300 );
      TestUtil.flush();
      assertTrue( animation.isStarted() );
      assertEquals( 200, parseInt( widget._style.height ) );
      assertEquals( 200, renderer.getStartValue() );
      assertEquals( 300, renderer.getEndValue() );
      animation._render( 0.5 );
      assertTrue( animation.isRunning() );
      assertEquals( 250, renderer.getLastValue() );
      assertEquals( 250, parseInt( widget._style.height ) );
      animation._finish();
      assertEquals( 300, renderer.getLastValue() );
      assertEquals( 300, parseInt( widget._style.height ) );
      assertFalse( animation.isStarted() );
      widget.hide();
      assertFalse( animation.isStarted() );
      this._cleanUp( animation );
    },

    testDeactivatedRenderer : function() {
      // Simply tests that nothing whatsoever happens 
      // (uses resize-scenario, but should be valid for all cases)
      var proto = rwt.widgets.base.MultiCellWidget.prototype;
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      var widget = this._createWidget();
      var typeChange = rwt.animation.AnimationRenderer.ANIMATION_CHANGE;
      renderer.animate( widget, "height", typeChange );
      renderer.setActive( false );
      assertTrue( widget.isSeeable() );
      assertTrue( proto._applyVisibility == widget._applyVisibility );
      assertTrue( proto._renderRuntimeHeight == widget._renderRuntimeHeight );
      assertEquals( 200, parseInt( widget._style.height ) );
      widget.setHeight( 300 );
      TestUtil.flush();
      assertFalse( animation.isStarted() );
      assertEquals( 300, parseInt( widget._style.height ) );
      animation.start();
      assertTrue( animation.isStarted() );
      animation._render( 0.5 );
      assertTrue( animation.isRunning() );
      assertEquals( null, renderer.getLastValue() );
      assertEquals( 300, parseInt( widget._style.height ) );
      animation._finish();
      assertEquals( 300, parseInt( widget._style.height ) );
      widget.hide();
      assertFalse( animation.isStarted() );
      this._cleanUp( animation );
    },

    testDisappearAnimationNoAutoStart : function() {
      // Using "fadeout" scenario
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      var widget = this._createWidget();
      assertFalse( TestUtil.hasElementOpacity( widget.getElement() ) );
      var typeDisappear = rwt.animation.AnimationRenderer.ANIMATION_DISAPPEAR;
      renderer.animate( widget, "opacity", typeDisappear );
      renderer.setAutoStart( false );
      widget.hide();
      assertTrue( widget._style.display != "none" );
      assertFalse( animation.isStarted() );
      assertEquals( null, renderer.getStartValue() );
      assertEquals( 0, renderer.getEndValue() );
      animation.start( "disappear" );
      animation._render( 0.5 );
      assertTrue( widget._style.display != "none" );
      assertEquals( 0.5, renderer.getLastValue() );
      assertTrue( TestUtil.hasElementOpacity( widget.getElement() ) );
      animation._finish();
      assertFalse( animation.isStarted() );
      assertEquals( 0, renderer.getLastValue() );
      assertFalse( TestUtil.hasElementOpacity( widget.getElement() ) );
      assertEquals( "none", widget._style.display );
      widget.show();
      assertFalse( animation.isStarted() );
      assertTrue( widget._style.display != "none" );
      this._cleanUp( animation );
    },

    testAppearAnimationNoAutoStart : function() {
      // Using "slideIn" scenario
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      var widget = this._createWidget();
      widget.hide();
      var typeAppear = rwt.animation.AnimationRenderer.ANIMATION_APPEAR;
      renderer.animate( widget, "height", typeAppear );
      renderer.setAutoStart( false );
      assertEquals( "none", widget._style.display );
      widget.show();
      assertTrue( widget._style.display != "none" );
      assertEquals( 0, parseInt( widget._style.height ) );
      assertFalse( animation.isStarted() );
      assertEquals( 0, renderer.getStartValue() );
      assertEquals( 200, renderer.getEndValue() );
      animation.start( "appear" );
      assertTrue( animation.isStarted() );
      animation._render( 0.5 );
      assertEquals( 100, renderer.getLastValue() );
      assertEquals( 100, parseInt( widget._style.height ) );
      animation._finish();
      assertFalse( animation.isStarted() );
      assertEquals( 200, renderer.getLastValue() );
      assertEquals( 200, parseInt( widget._style.height ) );
      assertTrue( widget._style.display != "none" );
      widget.hide();
      assertFalse( animation.isStarted() );
      assertEquals( "none", widget._style.display );
      this._cleanUp( animation );      
    },
    
    testChangeAnimatonNoAutoStart : function() {
      // Using "resize" scenario
      var proto = rwt.widgets.base.MultiCellWidget.prototype;
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      var widget = this._createWidget();
      var typeChange = rwt.animation.AnimationRenderer.ANIMATION_CHANGE;
      renderer.animate( widget, "height", typeChange );
      renderer.setAutoStart( false );
      assertFalse( proto._renderRuntimeHeight == widget._renderRuntimeHeight );      
      assertTrue( widget.isSeeable() );
      widget.setHeight( 300 );
      TestUtil.flush();
      assertFalse( animation.isStarted() );
      assertEquals( 200, parseInt( widget._style.height ) );
      assertEquals( 200, renderer.getStartValue() );
      assertEquals( 300, renderer.getEndValue() );
      animation.start( "change" );
      assertTrue( animation.isStarted() );
      animation._render( 0.5 );
      assertTrue( animation.isRunning() );
      assertEquals( 250, renderer.getLastValue() );
      assertEquals( 250, parseInt( widget._style.height ) );
      animation._finish();
      assertEquals( 300, renderer.getLastValue() );
      assertEquals( 300, parseInt( widget._style.height ) );
      assertFalse( animation.isStarted() );
      widget.hide();
      assertFalse( animation.isStarted() );
      this._cleanUp( animation );
    },
    
    ////////////////////////////
    // Anmiation is interrupted
    
    testRenderCallDuringChangeAnimation : function() {
      // using "resize" scenario
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      var widget = this._createWidget();
      var typeChange = rwt.animation.AnimationRenderer.ANIMATION_CHANGE;
      renderer.animate( widget, "height", typeChange );
      widget.setHeight( 300 );
      TestUtil.flush();
      assertTrue( animation.isStarted() );
      assertEquals( 200, parseInt( widget._style.height ) );
      assertEquals( 200, renderer.getStartValue() );
      assertEquals( 300, renderer.getEndValue() );
      animation._render( 0.5 );
      assertTrue( animation.isRunning() );
      assertEquals( 250, renderer.getLastValue() );
      assertEquals( 250, parseInt( widget._style.height ) );
      widget.setHeight( 350 );
      TestUtil.flush();
      assertTrue( animation.isStarted() );
      assertEquals( 250, renderer.getStartValue() );
      assertEquals( 350, renderer.getEndValue() );
      assertFalse( animation.isRunning() );
      animation._render( 0.5 );
      assertTrue( animation.isRunning() );
      assertEquals( 300, renderer.getLastValue() );
      assertEquals( 300, parseInt( widget._style.height ) );
      animation._finish();
      assertEquals( 350, renderer.getLastValue() );
      assertEquals( 350, parseInt( widget._style.height ) );
      assertFalse( animation.isStarted() );
      this._cleanUp( animation );
    },
    
    testRenderCallDuringChangeAnimationAndCancel : function() {
      // using "resize" scenario
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      var widget = this._createWidget();
      var typeChange = rwt.animation.AnimationRenderer.ANIMATION_CHANGE;
      renderer.animate( widget, "height", typeChange );
      renderer.activateOnce();
      assertTrue( renderer._activeOnce );
      assertTrue( renderer._active );
      widget.setHeight( 300 );
      TestUtil.flush();
      assertTrue( animation.isStarted() );
      assertEquals( 200, parseInt( widget._style.height ) );
      assertEquals( 200, renderer.getStartValue() );
      assertEquals( 300, renderer.getEndValue() );
      animation._render( 0.5 );
      assertTrue( animation.isRunning() );
      assertEquals( 250, renderer.getLastValue() );
      assertEquals( 250, parseInt( widget._style.height ) );
      animation.addEventListener( "init", function( event ) {
        animation.cancel();
      } );
      widget.setHeight( 350 );
      TestUtil.flush();
      assertEquals( 250, renderer.getLastValue() );
      assertEquals( 350, parseInt( widget._style.height ) );
      assertFalse( animation.isStarted() );
      assertFalse( renderer._activeOnce );
      assertFalse( renderer._active );      
      this._cleanUp( animation );
    },
    
    testDisappearDuringChangeAnimation : function() {
      // using "resize" scenario
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      var widget = this._createWidget();
      var typeChange = rwt.animation.AnimationRenderer.ANIMATION_CHANGE;
      renderer.animate( widget, "height", typeChange );
      widget.setHeight( 300 );
      TestUtil.flush();
      assertTrue( animation.isStarted() );
      assertEquals( 200, parseInt( widget._style.height ) );
      assertEquals( 200, renderer.getStartValue() );
      assertEquals( 300, renderer.getEndValue() );
      animation._render( 0.5 );
      assertTrue( animation.isRunning() );
      assertEquals( 250, renderer.getLastValue() );
      assertEquals( 250, parseInt( widget._style.height ) );
      widget.hide();
      TestUtil.flush();
      assertFalse( animation.isStarted() );
      assertEquals( 300, renderer.getLastValue() );
      assertEquals( 300, parseInt( widget._style.height ) );
      this._cleanUp( animation );
    },
    
    testRenderCallDuringAppearAnimation : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      var widget = this._createWidget();
      widget.hide();
      var typeAppear = rwt.animation.AnimationRenderer.ANIMATION_APPEAR;
      renderer.animate( widget, "height", typeAppear );
      assertEquals( "none", widget._style.display );
      widget.show();
      assertTrue( widget._style.display != "none" );
      assertEquals( 0, parseInt( widget._style.height ) );
      assertTrue( animation.isStarted() );
      assertEquals( 0, renderer.getStartValue() );
      assertEquals( 200, renderer.getEndValue() );
      animation._render( 0.5 );
      assertEquals( 100, renderer.getLastValue() );
      assertEquals( 100, parseInt( widget._style.height ) );
      widget.setHeight( 300 );
      TestUtil.flush();
      assertTrue( animation.isStarted() );
      assertEquals( 100, renderer.getStartValue() );
      assertEquals( 300, renderer.getEndValue() );
      animation._render( 0.5 );
      assertTrue( animation.isRunning() );
      assertEquals( 200, renderer.getLastValue() );
      assertEquals( 200, parseInt( widget._style.height ) );
      animation._finish();
      assertFalse( animation.isStarted() );
      assertEquals( 300, renderer.getLastValue() );
      assertEquals( 300, parseInt( widget._style.height ) );
      assertTrue( widget._style.display != "none" );
      widget.hide();
      assertFalse( animation.isStarted() );
      assertEquals( "none", widget._style.display );
      this._cleanUp( animation );    
    },
    
    testRenderCallDuringDisappearAnimation : function() {
      // using "fadeOut" scenario
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      var widget = this._createWidget();
      assertFalse( TestUtil.hasElementOpacity( widget.getElement() ) );
      var typeDisappear = rwt.animation.AnimationRenderer.ANIMATION_DISAPPEAR;
      renderer.animate( widget, "opacity", typeDisappear );
      widget.hide();
      assertTrue( widget._style.display != "none" );
      assertTrue( animation.isStarted() );
      assertEquals( null, renderer.getStartValue() );
      assertEquals( 0, renderer.getEndValue() );
      animation._render( 0.5 );
      assertEquals( 1, renderer.getStartValue() );
      assertEquals( 0, renderer.getEndValue() );
      assertTrue( animation.isRunning() );
      assertTrue( widget._style.display != "none" );
      assertEquals( 0.5, renderer.getLastValue() );
      var lastCss = widget._style.cssText;
      widget.setOpacity( 0.9 ); // should have no effect
      assertTrue( animation.isRunning() );
      assertEquals( 1, renderer.getStartValue() );
      assertEquals( 0, renderer.getEndValue() );
      assertEquals( lastCss, widget._style.cssText );
      assertTrue( TestUtil.hasElementOpacity( widget.getElement() ) );
      animation._finish();
      assertFalse( animation.isStarted() );
      assertEquals( 0, renderer.getLastValue() );
      assertTrue( TestUtil.hasElementOpacity( widget.getElement() ) );
      assertEquals( "none", widget._style.display );
      widget.show();
      assertFalse( animation.isStarted() );
      assertTrue( TestUtil.hasElementOpacity( widget.getElement() ) );
      assertTrue( widget._style.display != "none" );
      this._cleanUp( animation );
    },

    testDisappearDuringAppearAnimation : function() {
      // using "slideIn"-scenario
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      var widget = this._createWidget();
      widget.hide();
      var typeAppear = rwt.animation.AnimationRenderer.ANIMATION_APPEAR;
      renderer.animate( widget, "height", typeAppear );
      assertEquals( "none", widget._style.display );
      widget.show();
      assertTrue( widget._style.display != "none" );
      assertEquals( 0, parseInt( widget._style.height ) );
      assertTrue( animation.isStarted() );
      assertEquals( 0, renderer.getStartValue() );
      assertEquals( 200, renderer.getEndValue() );
      animation._render( 0.5 );
      assertEquals( 100, renderer.getLastValue() );
      assertEquals( 100, parseInt( widget._style.height ) );
      widget.hide();
      assertFalse( animation.isStarted() );
      assertEquals( 200, renderer.getLastValue() );
      assertEquals( 200, parseInt( widget._style.height ) );
      assertTrue( widget._style.display == "none" );
      this._cleanUp( animation );      
    },

    testDisappearBeforeScheduledAppearAnimation : function() {
      // using "slideIn"-scenario
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var widget = new rwt.widgets.base.MultiCellWidget( "label" );
      widget.setLocation( 10, 20 );
      widget.setDimension( 100, 200 );
      widget.hide();
      widget.addToDocument();
      var typeAppear = rwt.animation.AnimationRenderer.ANIMATION_APPEAR;
      renderer.animate( widget, "height", typeAppear );
      widget.show();
      assertFalse( widget.isCreated() );
      widget.hide();
      assertFalse( widget.isCreated() );
      assertEquals( null, renderer.getLastValue() );
      assertFalse( animation.isStarted() );
      this._cleanUp( animation );      
    },
    
    testAppearDuringDisappearAnimation : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      var widget = this._createWidget();
      assertFalse( TestUtil.hasElementOpacity( widget.getElement() ) );
      var typeDisappear = rwt.animation.AnimationRenderer.ANIMATION_DISAPPEAR;
      renderer.animate( widget, "opacity", typeDisappear );
      widget.hide();
      assertTrue( widget._style.display != "none" );
      assertTrue( animation.isStarted() );
      assertEquals( null, renderer.getStartValue() );
      assertEquals( 0, renderer.getEndValue() );
      animation._render( 0.5 );
      assertEquals( 1, renderer.getStartValue() );
      assertEquals( 0, renderer.getEndValue() );
      assertTrue( widget._style.display != "none" );
      assertEquals( 0.5, renderer.getLastValue() );
      assertTrue( TestUtil.hasElementOpacity( widget.getElement() ) );
      widget.show();
      assertFalse( animation.isStarted() );
      assertEquals( 0, renderer.getLastValue() );
      assertFalse( TestUtil.hasElementOpacity( widget.getElement() ) );
      assertTrue( widget._style.display != "none" );
      this._cleanUp( animation );
    },
    
    testHandleAnimationWhileRunning : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      var widget = this._createWidget();
      assertFalse( TestUtil.hasElementOpacity( widget.getElement() ) );
      var typeDisappear = rwt.animation.AnimationRenderer.ANIMATION_DISAPPEAR;      
      renderer.animate( widget, "opacity", typeDisappear );
      widget.hide();
      assertTrue( widget._style.display != "none" );
      assertTrue( animation.isStarted() );
      animation._render( 0.5 );
      var log = [];
      try {
        renderer.clearAnimation();
      } catch( ex ){
        log.push( ex );
      }
      assertEquals( 1, log.length );
      this._cleanUp( animation );
    },
    
    ///////////////
    // Other issues
    
    testMultipleAnimationRenderer : function() {
      var animation1 = new rwt.animation.Animation();
      var animation2 = new rwt.animation.Animation();
      var renderer1 = new rwt.animation.AnimationRenderer( animation1 );
      var renderer2 = new rwt.animation.AnimationRenderer( animation2 );
      var widget = this._createWidget();
      var typeDisappear = rwt.animation.AnimationRenderer.ANIMATION_DISAPPEAR;
      var typeAppear = rwt.animation.AnimationRenderer.ANIMATION_APPEAR;
      renderer1.animate( widget, "height", typeDisappear );
      renderer2.animate( widget, "opacity", typeAppear );
      
      widget.hide();
      rwt.animation.Animation._mainLoop();
      assertTrue( animation1.isRunning() );
      animation1.skip();
      rwt.animation.Animation._mainLoop();
      widget.show();
      
      rwt.animation.Animation._mainLoop();
      assertFalse( animation1.isRunning() );
      assertTrue( animation2.isRunning() );
      animation2.skip();
      rwt.animation.Animation._mainLoop();
      animation1.dispose();
      animation2.dispose();
      renderer1.dispose();
      renderer2.dispose();
      widget.dispose();
    },
    
    testFadeInToSolidFirstAppear : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var widget = new rwt.widgets.base.MultiCellWidget( "label" );
      widget.setLocation( 10, 20 );
      widget.setDimension( 100, 200 );
      widget.hide();
      widget.addToDocument();
      var animation = new rwt.animation.Animation();
      var renderer = animation.getDefaultRenderer();
      var typeAppear = rwt.animation.AnimationRenderer.ANIMATION_APPEAR;      
      renderer.animate( widget, "opacity", typeAppear );
      assertFalse( widget.isCreated() );
      widget.show();
      TestUtil.flush();
      assertTrue( widget._style.display != "none" );
      assertTrue( animation.isStarted() );
      assertFalse( animation.isRunning() );
      assertEquals( 0, renderer.getLastValue() );
      assertEquals( 0, renderer.getStartValue() );
      assertEquals( null, renderer.getEndValue() );
      assertTrue( TestUtil.hasElementOpacity( widget.getElement() ) );
      animation._render( 0.5 );
      assertEquals( 1, renderer.getEndValue() );
      assertTrue( animation.isRunning() );
      assertEquals( 0.5, renderer.getLastValue() );
      assertTrue( TestUtil.hasElementOpacity( widget.getElement() ) );
      animation._finish();
      assertFalse( animation.isStarted() );
      assertEquals( 1, renderer.getLastValue() );
      this._cleanUp( animation );
    },
    
    testFadeInTransparencyFirstAppear : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var widget = new rwt.widgets.base.MultiCellWidget( "label" );
      widget.setLocation( 10, 20 );
      widget.setDimension( 100, 200 );
      widget.hide();
      widget.setOpacity( 0.8 );
      widget.addToDocument();
      var animation = new rwt.animation.Animation();
      var renderer = animation.getDefaultRenderer();
      var typeAppear = rwt.animation.AnimationRenderer.ANIMATION_APPEAR;      
      renderer.animate( widget, "opacity", typeAppear );
      assertFalse( widget.isCreated() );
      widget.show();
      TestUtil.flush();
      assertTrue( widget._style.display != "none" );
      assertTrue( animation.isStarted() );
      assertFalse( animation.isRunning() );
      assertEquals( 0, renderer.getStartValue() );
      assertEquals( 0.8, renderer.getEndValue() );
      assertEquals( 0, renderer.getLastValue() );
      assertTrue( TestUtil.hasElementOpacity( widget.getElement() ) );
      animation._render( 0.5 );
      assertTrue( animation.isRunning() );
      assertEquals( 0.4, renderer.getLastValue() );
      assertTrue( TestUtil.hasElementOpacity( widget.getElement() ) );
      animation._finish();
      assertFalse( animation.isStarted() );
      assertEquals( 0.8, renderer.getLastValue() );
      assertTrue( TestUtil.hasElementOpacity( widget.getElement() ) );
      this._cleanUp( animation );
    },
    
    testSlideInOnFirstAppearBeforeFlush : function() {
      var animation = new rwt.animation.Animation();
      var renderer = new rwt.animation.AnimationRenderer( animation );
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var widget = new rwt.widgets.base.MultiCellWidget( "label" );
      widget.setLocation( 10, 20 );
      widget.setDimension( 100, 200 );
      widget.addToDocument();
      widget.hide();
      var typeAppear = rwt.animation.AnimationRenderer.ANIMATION_APPEAR;      
      renderer.animate( widget, "height", typeAppear );
      widget.show();
      assertFalse( widget.isCreated() );
      TestUtil.flush();
      assertTrue( widget.isCreated() );
      assertEquals( 0, renderer.getLastValue() );
      animation._finish();
      this._cleanUp( animation );      
    },

    /////////
    // Helper
    
    _createWidget : function( noFlush ) {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var widget = new rwt.widgets.base.MultiCellWidget( "label" );
      widget.setLocation( 10, 20 );
      widget.setDimension( 100, 200 );
      widget.addToDocument();
      if( noFlush !== true ) {
        TestUtil.flush();
      }
      return widget;
    },
    
    _attachLogger : function( animation, renderer, advanced ) {
      var log = [];
      animation.addEventListener( "init", function( event ) {
        log.push( "init", event.getData() );
      } );
      renderer.setSetupFunction( function( config, context ) { 
        log.push( "setup", config );
        if( advanced ) {
          log.push( context.toString() ); 
        } 
      } );
      animation.addEventListener( "cancel", function( event ) {
        log.push( "cancel", event.getData() );
      } );
      animation.addEventListener( "finish", function( event ) {
        log.push( "finish", event.getData() );
      } );
      if( advanced ) {
        renderer.setConverter( function( value, startValue, endValue ){ 
          log.push( "convert", typeof value, startValue, endValue ); 
          return value;
        } );
        renderer.setRenderFunction( function( value ){ 
          log.push( "render", typeof value ); 
        } );
      } else {
        renderer.setConverter( function( value, startValue, endValue ){  
          return value;
        } );
        renderer.setRenderFunction( function( value ){ } );        
      }
      return log;
    },
    
    _cleanUp : function( animation ) {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      for( var i = 0; i < animation.getRendererLength(); i++ ) {
        var renderer = animation.getRenderer( i );
        if( renderer._context && renderer._context.destroy ) {
          renderer._context.destroy();
        }
      }
      animation.dispose();
      TestUtil.flush();
    }

  }
  
} );