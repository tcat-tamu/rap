/*******************************************************************************
 * Copyright (c) 2008, 2012 Innoopract Informationssysteme GmbH and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    Innoopract Informationssysteme GmbH - initial API and implementation
 *    EclipseSource - ongoing development
 ******************************************************************************/

rwt.qx.Class.define( "rwt.widgets.DateTimeTime", {
  extend : rwt.widgets.base.Parent,

  construct : function( style ) {
    this.base( arguments );
    this.setOverflow( "hidden" );
    this.setAppearance( "datetime-time" );

    // Get styles
    this._short = rwt.util.Strings.contains( style, "short" );
    this._medium = rwt.util.Strings.contains( style, "medium" );
    this._long = rwt.util.Strings.contains( style, "long" );

    // Has selection listener
    this._hasSelectionListener = false;
    this._requestTimer = null;

    // Add listener for font change
    this.addEventListener( "changeFont", this._rwt_onChangeFont, this );

    this.addEventListener( "keypress", this._onKeyPress, this );
    this.addEventListener( "keyup", this._onKeyUp, this );
    this.addEventListener( "mousewheel", this._onMouseWheel, this );
    this.addEventListener( "contextmenu", this._onContextMenu, this );
    this.addEventListener( "focus", this._onFocusIn, this );
    this.addEventListener( "blur", this._onFocusOut, this );

    // Focused text field
    this._focusedTextField = null;
    // Hours
    this._hoursTextField = new rwt.widgets.base.Label( "00" );
    this._hoursTextField.setAppearance( "datetime-field" );
    this._hoursTextField.setUserData( "maxLength", 2 );
    this._hoursTextField.addEventListener( "mousedown",  this._onTextFieldMouseDown, this );
    this.add(this._hoursTextField);
    // Separator
    this._separator3 = new rwt.widgets.base.Label( ":" );
    this._separator3.setAppearance( "datetime-separator" );
    this._separator3.addEventListener( "contextmenu", this._onContextMenu, this );
    this.add(this._separator3);
    // Minutes
    this._minutesTextField = new rwt.widgets.base.Label( "00" );
    this._minutesTextField.setAppearance( "datetime-field" );
    this._minutesTextField.setUserData( "maxLength", 2 );
    this._minutesTextField.addEventListener( "mousedown",  this._onTextFieldMouseDown, this );
    this.add(this._minutesTextField);
    // Separator
    this._separator4 = new rwt.widgets.base.Label( ":" );
    this._separator4.setAppearance( "datetime-separator" );
    if( this._medium || this._long ) {
      this.add(this._separator4);
    }
    // Seconds
    this._secondsTextField = new rwt.widgets.base.Label( "00" );
    this._secondsTextField.setAppearance( "datetime-field" );
    this._secondsTextField.setUserData( "maxLength", 2 );
    this._secondsTextField.addEventListener( "mousedown",  this._onTextFieldMouseDown, this );
    if( this._medium || this._long ) {
      this.add(this._secondsTextField);
    }
    // Spinner
    this._spinner = new rwt.widgets.base.Spinner();
    this._spinner.set({
      wrap: true,
      border: null,
      backgroundColor: null
    });
    this._spinner.setMin( 0 );
    this._spinner.setMax( 23 );
    this._spinner.setValue( 0 );
    this._spinner.addEventListener( "change",  this._onSpinnerChange, this );
    this._spinner._textfield.setTabIndex( null );
    // Hack to prevent the spinner text field to request the focus
    this._spinner._textfield.setFocused = function() {};
    // Solution for Bug 284021
    this._spinner._textfield.setVisibility( false );
    this._spinner._upbutton.setAppearance("datetime-button-up");
    this._spinner._downbutton.setAppearance("datetime-button-down");
    this._spinner.removeEventListener("keypress", this._spinner._onkeypress, this._spinner);
    this._spinner.removeEventListener("keydown", this._spinner._onkeydown, this._spinner);
    this._spinner.removeEventListener("keyup", this._spinner._onkeyup, this._spinner);
    this._spinner.removeEventListener("mousewheel", this._spinner._onmousewheel, this._spinner);
    this.add( this._spinner );
    // Set the default focused text field
    this._focusedTextField = this._hoursTextField;
  },

  destruct : function() {
    this.removeEventListener( "changeFont", this._rwt_onChangeFont, this );
    this.removeEventListener( "keypress", this._onKeyPress, this );
    this.removeEventListener( "keyup", this._onKeyUp, this );
    this.removeEventListener( "mousewheel", this._onMouseWheel, this );
    this.removeEventListener( "contextmenu", this._onContextMenu, this );
    this.removeEventListener( "focus", this._onFocusIn, this );
    this.removeEventListener( "blur", this._onFocusOut, this );
    this._hoursTextField.removeEventListener( "mousedown",  this._onTextFieldMouseDown, this );
    this._minutesTextField.removeEventListener( "mousedown",  this._onTextFieldMouseDown, this );
    this._secondsTextField.removeEventListener( "mousedown",  this._onTextFieldMouseDown, this );
    this._spinner.removeEventListener( "change",  this._onSpinnerChange, this );
    this._disposeObjects( "_hoursTextField",
                          "_minutesTextField",
                          "_secondsTextField",
                          "_focusedTextField",
                          "_spinner",
                          "_separator3",
                          "_separator4" );
  },

  statics : {
    HOURS_TEXTFIELD : 8,
    MINUTES_TEXTFIELD : 9,
    SECONDS_TEXTFIELD : 10,
    HOURS_MINUTES_SEPARATOR : 11,
    MINUTES_SECONDS_SEPARATOR : 12,
    SPINNER : 7,

    _isNoModifierPressed : function( evt ) {
      return    !evt.isCtrlPressed()
             && !evt.isShiftPressed()
             && !evt.isAltPressed()
             && !evt.isMetaPressed();
    }
  },

  members : {
    addState : function( state ) {
      this.base( arguments, state );
      if( state.substr( 0, 8 ) == "variant_" ) {
        this._hoursTextField.addState( state );
        this._minutesTextField.addState( state );
        this._secondsTextField.addState( state );
        this._spinner.addState( state );
        this._separator3.addState( state );
        this._separator4.addState( state );
      }
    },

    removeState : function( state ) {
      this.base( arguments, state );
      if( state.substr( 0, 8 ) == "variant_" ) {
        this._hoursTextField.removeState( state );
        this._minutesTextField.removeState( state );
        this._secondsTextField.removeState( state );
        this._spinner.removeState( state );
        this._separator3.removeState( state );
        this._separator4.removeState( state );
      }
    },

    _rwt_onChangeFont : function( evt ) {
      var value = evt.getValue();
      this._hoursTextField.setFont( value );
      this._minutesTextField.setFont( value );
      this._secondsTextField.setFont( value );
    },

    _onContextMenu : function( evt ) {
      var menu = this.getContextMenu();
      if( menu != null ) {
        menu.setLocation( evt.getPageX(), evt.getPageY() );
        menu.setOpener( this );
        menu.show();
        evt.stopPropagation();
      }
    },

    _onFocusIn : function( evt ) {
      this._focusedTextField.addState( "selected" );
      this._initialEditing = true;
    },

    _onFocusOut : function( evt ) {
      this._focusedTextField.removeState( "selected" );
    },

    _onTextFieldMouseDown : function( evt ) {
      this._setFocusedTextField( evt.getTarget() );
    },

    _setFocusedTextField :  function( textField ) {
      if( this._focusedTextField !== textField ) {
        var tmpValue;
        this._focusedTextField.removeState( "selected" );
        this._focusedTextField = null;
        if( textField === this._hoursTextField ) {
          this._spinner.setMin( 0 );
          this._spinner.setMax( 23 );
          tmpValue = this._removeLeadingZero( this._hoursTextField.getText() );
          this._spinner.setValue( parseInt( tmpValue, 10 ) );
        } else if( textField === this._minutesTextField ) {
          this._spinner.setMin( 0 );
          this._spinner.setMax( 59 );
          tmpValue = this._removeLeadingZero( this._minutesTextField.getText() );
          this._spinner.setValue( parseInt( tmpValue, 10 ) );
        } else if( textField === this._secondsTextField ) {
          this._spinner.setMin( 0 );
          this._spinner.setMax( 59 );
          tmpValue = this._removeLeadingZero( this._secondsTextField.getText() );
          this._spinner.setValue( parseInt( tmpValue, 10 ) );
        }
        this._focusedTextField = textField;
        this._focusedTextField.addState( "selected" );
        this._initialEditing = true;
      }
    },

    _onSpinnerChange : function( evt ) {
      if( this._focusedTextField != null ) {
        var oldValue = this._focusedTextField.getText();
        var newValue = this._addLeadingZero( this._spinner.getValue() );
        this._focusedTextField.setText( newValue );
        if( oldValue != newValue ) {
          this._sendChanges();
        }
      }
    },

    _onKeyPress : function( evt ) {
      var keyIdentifier = evt.getKeyIdentifier();
      if( rwt.widgets.DateTimeTime._isNoModifierPressed( evt ) ) {
        switch( keyIdentifier ) {
          case "Left":
            if( this._focusedTextField === this._hoursTextField ) {
              if( this._short ) {
                this._setFocusedTextField( this._minutesTextField );
              } else {
                this._setFocusedTextField( this._secondsTextField );
              }
            } else if( this._focusedTextField === this._minutesTextField ) {
              this._setFocusedTextField( this._hoursTextField );
            } else if( this._focusedTextField === this._secondsTextField ) {
              this._setFocusedTextField( this._minutesTextField );
            }
            evt.preventDefault();
            evt.stopPropagation();
            break;
          case "Right":
            if( this._focusedTextField === this._hoursTextField ) {
              this._setFocusedTextField( this._minutesTextField );
            } else if( this._focusedTextField === this._minutesTextField ) {
              if( this._short ) {
                this._setFocusedTextField( this._hoursTextField );
              } else {
                this._setFocusedTextField( this._secondsTextField );
              }
            } else if( this._focusedTextField === this._secondsTextField ) {
              this._setFocusedTextField( this._hoursTextField );
            }
            evt.preventDefault();
            evt.stopPropagation();
            break;
          case "Up":
            var value = this._spinner.getValue();
            if( value == this._spinner.getMax() ) {
              this._spinner.setValue( this._spinner.getMin() );
            } else {
              this._spinner.setValue( value + 1 );
            }
            evt.preventDefault();
            evt.stopPropagation();
            break;
          case "Down":
            var value = this._spinner.getValue();
            if( value == this._spinner.getMin() ) {
              this._spinner.setValue( this._spinner.getMax() );
            } else {
              this._spinner.setValue( value - 1 );
            }
            evt.preventDefault();
            evt.stopPropagation();
            break;
          case "PageUp":
          case "PageDown":
          case "Home":
          case "End":
            evt.preventDefault();
            evt.stopPropagation();
            break;
        }
      }
    },

    _onKeyUp : function( evt ) {
      var keypress = evt.getKeyIdentifier();
      var value = this._focusedTextField.getText();
      value = this._removeLeadingZero( value );
      if( rwt.widgets.DateTimeTime._isNoModifierPressed( evt ) ) {
        switch( keypress ) {
          case "0": case "1": case "2": case "3": case "4":
          case "5": case "6": case "7": case "8": case "9":
            var maxChars = this._focusedTextField.getUserData( "maxLength" );
            var newValue = keypress;
            if( value.length < maxChars && !this._initialEditing ) {
              newValue = value + keypress;
            }
            var intValue = parseInt( newValue, 10 );
            if( intValue >= this._spinner.getMin() && intValue <= this._spinner.getMax() ) {
              this._spinner.setValue( intValue );
            } else {
              newValue = keypress;
              intValue = parseInt( newValue, 10 );
              if( intValue >= this._spinner.getMin() && intValue <= this._spinner.getMax() ) {
                this._spinner.setValue( intValue );
              }
            }
            this._initialEditing = false;
            evt.preventDefault();
            evt.stopPropagation();
            break;
          case "Home":
            var newValue = this._spinner.getMin();
            this._spinner.setValue( newValue );
            this._initialEditing = true;
            evt.preventDefault();
            evt.stopPropagation();
            break;
          case "End":
            var newValue = this._spinner.getMax();
            this._spinner.setValue( newValue );
            this._initialEditing = true;
            evt.preventDefault();
            evt.stopPropagation();
            break;
        }
      }
    },

    _onMouseWheel : function( evt ) {
      if( this.getFocused() ) {
        evt.preventDefault();
        evt.stopPropagation();
        this._spinner._onmousewheel( evt );
      }
    },

    _addLeadingZero : function( value ) {
      return value < 10 ? "0" + value : "" + value;
    },

    _removeLeadingZero : function( value ) {
      var result = value;
      if( value.length == 2 ) {
        var firstChar = value.substring( 0, 1 );
        if( firstChar == "0" ) {
          result = value.substring( 1 );
        }
      }
      return result;
    },

    _sendChanges : function() {
      if( !rwt.remote.EventUtil.getSuspended() ) {
        var widgetManager = rwt.remote.WidgetManager.getInstance();
        var req = rwt.remote.Server.getInstance();
        var id = widgetManager.findIdByWidget( this );
        req.addParameter( id + ".hours",
                          this._removeLeadingZero( this._hoursTextField.getText() ) );
        req.addParameter( id + ".minutes",
                          this._removeLeadingZero( this._minutesTextField.getText() ) );
        req.addParameter( id + ".seconds",
                          this._removeLeadingZero( this._secondsTextField.getText() ) );
        if( this._hasSelectionListener ) {
          this._requestTimer.restart();
        }
      }
    },

    _onInterval : function() {
      this._requestTimer.stop();
      rwt.remote.EventUtil.notifySelected( this );
    },

    setHours : function( value ) {
      this._hoursTextField.setText( this._addLeadingZero( value ) );
      if( this._focusedTextField === this._hoursTextField ) {
        this._spinner.setValue( value );
      }
    },

    setMinutes : function( value ) {
      this._minutesTextField.setText( this._addLeadingZero( value ) );
      if( this._focusedTextField === this._minutesTextField ) {
        this._spinner.setValue( value );
      }
    },

    setSeconds : function( value ) {
      this._secondsTextField.setText( this._addLeadingZero( value ) );
      if( this._focusedTextField === this._secondsTextField ) {
        this._spinner.setValue( value );
      }
    },

    setHasSelectionListener : function( value ) {
      this._hasSelectionListener = value;
      this._requestTimer = new rwt.client.Timer( 110 );
      this._requestTimer.addEventListener( "interval", this._onInterval, this );
    },

    setBounds : function( ind, x, y, width, height ) {
      var widget;
      switch( ind ) {
        case rwt.widgets.DateTimeTime.HOURS_TEXTFIELD:
          widget = this._hoursTextField;
        break;
        case rwt.widgets.DateTimeTime.MINUTES_TEXTFIELD:
          widget = this._minutesTextField;
        break;
        case rwt.widgets.DateTimeTime.SECONDS_TEXTFIELD:
          widget = this._secondsTextField;
        break;
        case rwt.widgets.DateTimeTime.HOURS_MINUTES_SEPARATOR:
          widget = this._separator3;
        break;
        case rwt.widgets.DateTimeTime.MINUTES_SECONDS_SEPARATOR:
          widget = this._separator4;
        break;
        case rwt.widgets.DateTimeTime.SPINNER:
          widget = this._spinner;
        break;
      }
      widget.set({
        left: x,
        top: y,
        width: width,
        height: height
      });
    }
  }
} );
