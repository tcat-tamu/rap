/*******************************************************************************
 * Copyright (c) 2009, 2013 EclipseSource and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    EclipseSource - initial API and implementation
 ******************************************************************************/

/**
 * This class provides the client-side counterpart for
 * org.eclipse.swt.widget.Combo and org.eclipse.swt.custom.CCombo.
 */
rwt.qx.Class.define( "rwt.widgets.Combo", {
  extend : rwt.widgets.base.Parent,

  construct : function( isCCombo ) {
    this.base( arguments );
    this._ccombo = isCCombo === true;
    //
    this._hasSelectionListener = false;
    this._hasDefaultSelectionListener = false;
    this._hasModifyListener = false;
    this._isModified = false;
    // Default values
    this._selected = null;
    this._editable = true;
    this._dropped = false;
    this._borderWidth = 0;
    this._selectionStart = 0;
    this._selectionLength = 0;
    this._itemHeight = 20;
    this._visibleItemCount = 5;
    // Text field
    this._field = new rwt.widgets.base.BasicText();
    this._field.setTabIndex( null );
    this._field.setAllowStretchY( true );
    this.add( this._field );
    // Drop down button
    this._button = new rwt.widgets.base.Button();
    this._button.setTabIndex( null );
    this._button.setHeight( "100%" );
    this.add( this._button );
    // List
    this._list = new rwt.widgets.base.BasicList( false );
    this._list.setTabIndex( null );
    this._list.setDisplay( false );
    this._blockMouseOver = false;
    this._list.addEventListener( "userScroll", function() {
      this._blockMouseOver = true;
      rwt.client.Timer.once( function() {
        this._blockMouseOver = false;
      }, this, 300 ); // the browser may fire a mouse event with some delay
    }, this );
    // List Manager
    this._manager = this._list.getManager();
    this._manager.setMultiSelection( false );
    this._manager.setDragSelection( false );
    this._manager.scrollItemIntoView = this._scrollItemIntoView;
    // Do not visualize the focus rectangle around the widget
    this.setHideFocus( true );
    // Add events listeners
    var cDocument = rwt.widgets.base.ClientDocument.getInstance();
    cDocument.addEventListener( "windowblur", this._onBlur, this );
    // Set appearance
    if( this._ccombo ) {
      this.setAppearance( "ccombo" );
      this._field.setAppearance( "ccombo-field" );
      this._button.setAppearance( "ccombo-button" );
      this._list.setAppearance( "ccombo-list" );
    } else {
      this.setAppearance( "combo" );
      this._field.setAppearance( "combo-field" );
      this._button.setAppearance( "combo-button" );
      this._list.setAppearance( "combo-list" );
    }
    // Init events
    this.addEventListener( "appear", this._onAppear, this );
    this.addEventListener( "focusin", this._onFocusIn, this );
    this.addEventListener( "blur", this._onBlur, this );
    this.addEventListener( "changeWidth", this._onChangeSize, this );
    this.addEventListener( "changeHeight", this._onChangeSize, this );
    this.addEventListener( "contextmenu", this._onContextMenu, this );
    this.addEventListener( "changeFont", this._onChangeFont, this );
    this.addEventListener( "changeTextColor", this._onChangeTextColor, this );
    this.addEventListener( "changeBackgroundColor", this._onChangeBackgroundColor, this );
    this.addEventListener( "changeVisibility", this._onChangeVisibility, this );
    // Mouse events
    this.addEventListener( "mousedown", this._onMouseDown, this );
    this.addEventListener( "mouseup", this._onMouseUp, this );
    this.addEventListener( "click", this._onMouseClick, this );
    this.addEventListener( "mousewheel", this._onMouseWheel, this );
    this.addEventListener( "mouseover", this._onMouseOver, this );
    this.addEventListener( "mousemove", this._onMouseMove, this );
    this.addEventListener( "mouseout", this._onMouseOut, this );
    // Keyboard events
    this.addEventListener( "keydown", this._onKeyDown, this );
    this.addEventListener( "keypress", this._onKeyPress, this );
    this._field.addEventListener( "keypress", this._onKeyPress, this );
    // Specific events
    this._field.addEventListener( "blur", this._onTextBlur, this );
    this._field.addEventListener( "input", this._onTextInput, this );
    this._list.addEventListener( "appear", this._onListAppear, this );
    this._setupCaptureRestore();
  },

  destruct : function() {
    var cDocument = rwt.widgets.base.ClientDocument.getInstance();
    cDocument.removeEventListener( "windowblur", this._onBlur, this );
    this.removeEventListener( "appear", this._onAppear, this );
    this.removeEventListener( "focusin", this._onFocusIn, this );
    this.removeEventListener( "blur", this._onBlur, this );
    this.removeEventListener( "changeWidth", this._onChangeSize, this );
    this.removeEventListener( "changeHeight", this._onChangeSize, this );
    this.removeEventListener( "contextmenu", this._onContextMenu, this );
    this.removeEventListener( "changeFont", this._onChangeFont, this );
    this.removeEventListener( "changeTextColor", this._onChangeTextColor, this );
    this.removeEventListener( "changeBackgroundColor", this._onChangeBackgroundColor, this );
    this.removeEventListener( "changeVisibility", this._onChangeVisibility, this );
    this.removeEventListener( "mousedown", this._onMouseDown, this );
    this.removeEventListener( "mouseup", this._onMouseUp, this );
    this.removeEventListener( "click", this._onMouseClick, this );
    this.removeEventListener( "mousewheel", this._onMouseWheel, this );
    this.removeEventListener( "mouseover", this._onMouseOver, this );
    this.removeEventListener( "mouseout", this._onMouseOut, this );
    this.removeEventListener( "keydown", this._onKeyDown, this );
    this.removeEventListener( "keypress", this._onKeyPress, this );
    this._field.removeEventListener( "keypress", this._onKeyPress, this );
    this._field.removeEventListener( "blur", this._onTextBlur, this );
    this._field.removeEventListener( "input", this._onTextInput, this );
    this._list.removeEventListener( "appear", this._onListAppear, this );
    // Solution taken from Qooxdoo implementation of ComboBox
    // in order to prevent memory leak and other problems.
    if( this._list && !rwt.qx.Object.inGlobalDispose() ) {
      this._list.setParent( null );
    }
    this._disposeObjects( "_field",
                          "_button",
                          "_list",
                          "_manager",
                          "_selected" );
  },

  events : {
    "itemsChanged" : "rwt.event.Event",
    "selectionChanged" : "rwt.event.Event"
  },

  members : {

    addState : function( state ) {
      this.base( arguments, state );
      if( state.substr( 0, 8 ) == "variant_" ) {
        this._field.addState( state );
        this._list.addState( state );
        this._button.addState( state );
      }
    },

    removeState : function( state ) {
      this.base( arguments, state );
      if( state.substr( 0, 8 ) == "variant_" ) {
        this._field.removeState( state );
        this._list.removeState( state );
        this._button.removeState( state );
      }
    },

    _onChangeSize : function( evt ) {
      this._setListBounds();
    },

    _onAppear : function( evt ) {
        if( this.hasState( "rwt_FLAT" ) ) {
          this._field.addState( "rwt_FLAT" );
          this._button.addState( "rwt_FLAT" );
          this._list.addState( "rwt_FLAT" );
        }
        if( this.hasState( "rwt_BORDER" ) ) {
          this._field.addState( "rwt_BORDER" );
          this._button.addState( "rwt_BORDER" );
          this._list.addState( "rwt_BORDER" );
        }
        this.getTopLevelWidget().add( this._list );
    },

    _onFocusIn : function( evt ) {
      if(    this._field.isCreated()
          && !rwt.remote.EventUtil.getSuspended() )
      {
        this._handleSelectionChange();
      }
    },

    _onContextMenu : function( evt ) {
      var menu = this.getContextMenu();
      if( menu != null && !this._dropped ) {
        menu.setLocation( evt.getPageX(), evt.getPageY() );
        menu.setOpener( this );
        menu.show();
        evt.stopPropagation();
      }
    },

    _onChangeFont : function( evt ) {
      var value = evt.getValue();
      this._field.setFont( value );
      var items = this._list.getItems();
      for( var i = 0; i < items.length; i++ ) {
        items[ i ].setFont( value );
      }
    },

    _onChangeTextColor : function( evt ) {
      var value = evt.getValue();
      this._field.setTextColor( value );
      this._list.setTextColor( value );
    },

    _onChangeBackgroundColor : function( evt ) {
      var color = evt.getValue();
      // Ensure that the list is never transparent (see bug 282540)
      if( color != null ) {
        this._list.setBackgroundColor( color );
      } else {
        this._list.resetBackgroundColor();
      }
    },

    _onChangeVisibility : function( evt ) {
      var value = evt.getValue();
      if( !value && this._dropped ) {
        this._toggleListVisibility();
      }
    },

    _applyCursor : function( value, old ) {
      this.base( arguments, value, old );
      if( value ) {
        this._field.setCursor( value );
        this._button.setCursor( value );
        this._list.setCursor( value );
      } else {
        this._field.resetCursor();
        this._button.resetCursor();
        this._list.resetCursor();
      }
    },

    // Focus handling methods
    _visualizeFocus : function() {
      if( this._field.isCreated() ) {
        this._field._visualizeFocus();
      }
      if( !this._editable ) {
        var focusIndicator = rwt.widgets.util.FocusIndicator.getInstance();
        var cssSelector = this._ccombo ? "CCombo-FocusIndicator" : "Combo-FocusIndicator";
        focusIndicator.show( this, cssSelector, null );
      }
      this.addState( "focused" );
    },

    // Override of the _ontabfocus method from rwt.widgets.base.Widget
    _ontabfocus : function() {
      if( this._field.isCreated() ) {
        this._field.selectAll();
      }
    },

    _visualizeBlur : function() {
      if( this._field.isCreated() ) {
        // setting selection lenght to 0 needed for IE to deselect text
        this._field._setSelectionLength( 0 );
        this._field._visualizeBlur();
      }
      if( !this._editable ) {
        var focusIndicator = rwt.widgets.util.FocusIndicator.getInstance();
        focusIndicator.hide( this );
      }
      this.removeState( "focused" );
    },

    // On "blur" or "windowblur" event: closes the list, if it is seeable
    _onBlur : function( evt ) {
      if( this._dropped ) {
        this._toggleListVisibility();
      }
    },

    ///////////////////////////////////////
    // List and list-items handling methods

    _setListBounds : function() {
      if( this.getElement() ){
        var elementPos = rwt.html.Location.get( this.getElement() );
        var listLeft = elementPos.left;
        var comboTop = elementPos.top;
        var listTop = comboTop + this.getHeight();
        var browserHeight = rwt.html.Window.getInnerHeight( window );
        var browserWidth = rwt.html.Window.getInnerWidth( window );
        var itemsWidth = this._list.getPreferredWidth();
        var listWidth = Math.min( browserWidth - listLeft, itemsWidth );
        listWidth = Math.max( this.getWidth(), listWidth );
        var itemsHeight = this._list.getItemsCount() * this._itemHeight;
        var listHeight = Math.min( this._getListMaxHeight(), itemsHeight );
        listHeight += this._list.getFrameHeight();
        if(    browserHeight < listTop + listHeight
            && comboTop > browserHeight - listTop )
        {
          listTop = elementPos.top - listHeight;
        }
        this._list.setLocation( listLeft, listTop );
        this._list.setWidth( listWidth );
        this._list.setHeight( listHeight );
        this._list.setItemDimensions( listWidth, this._itemHeight );
      }
    },

    _toggleListVisibility : function() {
      if( this._list.getItemsCount() ) {
        // Temporary make the text field ReadOnly, when the list is dropped.
        if( this._editable ) {
          this._field.setReadOnly( !this._dropped  );
        }
        if( !this._dropped ) {
          // Brings this widget on top of the others with same parent.
          this._bringToFront();
        }
        this.setCapture( !this._dropped );
        this._list.setDisplay( !this._dropped );
        if( this._list.getDisplay() ) {
          this._setListBounds();
        }
        this._dropped = !this._dropped;
        if( this._dropped ) {
          this._setListSelection( this._selected );
        }
        this._updateListScrollBar();
        this._updateListVisibleRequestParam();
      }
    },

    _updateListScrollBar : function() {
      if( this._dropped ) {
        var itemsHeight = this._list.getItemsCount() * this._itemHeight;
        var visible = this._getListMaxHeight() < itemsHeight;
        this._list.setScrollBarsVisible( false, visible );
      }
    },

    _resetListSelection : function() {
      this._manager.deselectAll();
      this._manager.setLeadItem( null );
      this._manager.setAnchorItem( null );
    },

    _setListSelection : function( item ) {
      this._manager.deselectAll();
      this._manager.setLeadItem( item );
      this._manager.setAnchorItem( item );
      this._manager.setSelectedItem( item );
    },

    _onListAppear : function( evt ) {
      if( this._selected ) {
        this._selected.scrollIntoView();
        this._list._syncScrollBars();
      }
    },

    _bringToFront : function() {
      var allWidgets = this.getTopLevelWidget().getChildren();
      var topZIndex = this._list.getZIndex();
      for( var vHashCode in allWidgets ) {
        var widget = allWidgets[ vHashCode ];
        if( widget.getZIndex ) {
          if( topZIndex < widget.getZIndex() ) {
            topZIndex = widget.getZIndex();
          }
        }
      }
      if( topZIndex > this._list.getZIndex() ) {
        this._list.setZIndex( topZIndex + 1 );
      }
    },

    _setSelected : function( value ) {
      this._selected = value;
      if( value ) {
        var fieldValue = value.getLabel().toString();
        this.setText( this._formatText( fieldValue ) );
        if( this._field.isCreated() ) {
          if( !rwt.remote.EventUtil.getSuspended() ) {
            this._field.selectAll();
            this._handleSelectionChange();
          }
        }
        this._setListSelection( value );
        this._manager.scrollItemIntoView( value );
      } else {
        if( !this._editable ) {
          this.setText( "" );
        }
        this._resetListSelection();
      }
      this._sendWidgetSelected();
      this.dispatchSimpleEvent( "selectionChanged" );
    },

    // [if] avoid warning message - see bug 300038
    _scrollItemIntoView : function( item, topLeft ) {
      if( item.isCreated() && item.isDisplayable() ) {
        item.scrollIntoView( topLeft );
      }
    },

    _formatText : function( value ) {
      var result = value;
      result = result.replace( /<[^>]+?>/g, "" );
      result = rwt.util.Encoding.unescape( result );
      return result;
    },

    ////////////////////////////////
    // Mouse events handling methods

    _reDispatch : function( event ) {
      var originalTarget = event.getTarget();
      if( this._list.contains( originalTarget ) ) {
        // TODO [tb] : should be disposed automatically, test
        originalTarget.dispatchEvent( event, false );
        event.stopPropagation();
      }
    },

    _onMouseDown : function( evt ) {
      if( evt.isLeftButtonPressed() ) {
        if( evt.getTarget() == this._field ) {
          if( !this._editable || this._dropped ) {
            this._toggleListVisibility();
          }
        } else if( this._dropped ) {
          this._reDispatch( evt );
        }
      }
    },

    _onMouseClick : function( evt ) {
      if( evt.isLeftButtonPressed() ) {
        // In case the 'mouseout' event has not been catched
        if( this._button.hasState( "over" ) ) {
          this._button.removeState( "over" );
        }
        // Redirecting the action, according to the click target
        var target = evt.getTarget();
        // Click is on a list item
        if(    target instanceof rwt.widgets.ListItem
            && target === this._list.getListItemTarget( target ) )
        {
          this._reDispatch( evt );
          this._toggleListVisibility();
          this._setSelected( this._manager.getSelectedItem() );
          this.setFocused( true );
        // Click is on the combo's button or outside the dropped combo
        } else if(    target == this._button
                   || (    this._dropped
                        && target != this
                        && target != this._field
                        && !this._list.contains( target ) ) )
        {
          this._toggleListVisibility();
        }
      }
    },

    _onMouseUp : function( evt ) {
      if( !this._dropped ) {
        this.setCapture( false );
      }
      if(    evt.getTarget() == this._field
          && !rwt.remote.EventUtil.getSuspended() )
      {
        this._handleSelectionChange();
      } else if( this._dropped ) {
        this._reDispatch( evt );
      }
    },

    _onMouseWheel : function( evt ) {
      if( this._dropped ) {
        if( !this._list.isRelevantEvent( evt ) ) {
          evt.preventDefault();
          evt.stopPropagation();
        }
      } else if( this.getFocused() ) {
        evt.preventDefault();
        evt.stopPropagation();
        var toSelect;
        var isSelected = this._selected;
        if( isSelected ) {
          if( evt.getWheelDelta() < 0 ) {
            toSelect = this._manager.getNext( isSelected );
          } else {
            toSelect = this._manager.getPrevious( isSelected );
          }
          if( toSelect ) {
            this._setSelected( toSelect );
          }
        } else if( this._list.getItemsCount() ) {
          this._setSelected( this._list.getItems()[0] );
        }
      }
    },

    _onMouseOver : function( evt ) {
      var target = evt.getTarget();
      if( target instanceof rwt.widgets.ListItem && !this._blockMouseOver ) {
        this._setListSelection( target );
      } else if( target == this._button ) {
        this._button.addState( "over" );
      }
    },

    _onMouseMove : function( evt ) {
      var target = evt.getTarget();
      if(    target instanceof rwt.widgets.ListItem
          && this._manager.getSelectedItem() !== evt.getTarget() )
      {
        this._onMouseOver( evt );
      }
    },

    _onMouseOut : function( evt ) {
      if( evt.getTarget() == this._button ) {
        this._button.removeState( "over" );
      }
    },

    _setupCaptureRestore : function() {
      var thumb = this._list._vertScrollBar._thumb;
      thumb.addEventListener( "mouseup", this._captureRestore, this );
    },

    _captureRestore : function( event ) {
      this.setCapture( true );
    },

    ////////////////////////////////////
    // Keyboard events handling methods

    _onKeyDown : function( evt ) {
      switch( evt.getKeyIdentifier() ) {
        case "Enter":
          if( this._dropped ) {
            this._toggleListVisibility();
            this._setSelected( this._manager.getSelectedItem() );
          } else if(    !evt.isShiftPressed()
                     && !evt.isAltPressed()
                     && !evt.isCtrlPressed()
                     && !evt.isMetaPressed() )
          {
            this._sendWidgetDefaultSelected();
          }
          this.setFocused( true );
          evt.stopPropagation();
        break;
        case "Escape":
          if( this._dropped ) {
            this._toggleListVisibility();
            this.setFocused( true );
            evt.stopPropagation();
          }
        break;
        case "Down":
        case "Up":
        case "PageUp":
        case "PageDown":
          if( evt.isAltPressed() ) {
            this._toggleListVisibility();
          } else {
            if( this._selected || this._manager.getSelectedItem() ) {
              this._list._onkeypress( evt );
              var selected = this._manager.getSelectedItem();
              this._setSelected( selected );
            } else if( this._list.getItemsCount() ) {
              this._setSelected( this._list.getItems()[ 0 ] );
            }
          }
        break;
      }
      if( this._field.isCreated() && !rwt.remote.EventUtil.getSuspended() ) {
        this._handleSelectionChange();
      }
    },

    _onKeyPress : function( evt ) {
      switch( evt.getKeyIdentifier() ) {
        case "Escape":
        case "Down":
        case "Up":
        case "PageUp":
        case "PageDown":
          evt.stopPropagation();
        break;
        case "Tab":
          if( this._dropped ) {
            this._toggleListVisibility();
          }
        break;
        case "Right":
          if( this._dropped ) {
            var toSelect =   this._selected
                           ? this._manager.getNext( this._selected )
                           : this._manager.getFirst();
            if( toSelect ) {
              this._setSelected( toSelect );
            }
          }
        break;
        case "Left":
          if( this._dropped ) {
            var toSelect =   this._selected
                           ? this._manager.getPrevious( this._selected )
                           : this._manager.getLast();
            if( toSelect ) {
              this._setSelected( toSelect );
            }
          }
        break;
        case "Enter":
          evt.preventDefault();
        break;
      }
      if( this._field.isCreated() && !rwt.remote.EventUtil.getSuspended() ) {
        this._handleSelectionChange();
      }
      if( evt.getCharCode() !== 0 ) {
        this._onKeyInput( evt );
      }
    },

    // Additional check for ALT and CTRL keys is added to fix bug 288344
    _onKeyInput : function( evt ) {
      if( ( this._dropped || !this._editable ) && !evt.isAltPressed() && !evt.isCtrlPressed() ) {
        this._list._onkeyinput( evt );
        var selected = this._manager.getSelectedItem();
        if( selected != null ) {
          this._setSelected( selected );
        } else {
          this._setListSelection( this._selected );
        }
      }
    },

    _onTextInput : function( evt ) {
      if( this._editable ) {
        this._isModified = true;
        this._selected = null;
        this._resetListSelection();
        if( !rwt.remote.EventUtil.getSuspended() ) {
          var req = rwt.remote.Server.getInstance();
          req.addEventListener( "send", this._onSend, this );
          if( this._hasModifyListener ) {
            rwt.client.Timer.once( this._sendModifyText, this, 500 );
          }
        }
      }
    },

    ///////////////////////////////////////////////
    // Actions, connected with server communication

    _onTextBlur : function( evt ) {
      if( !rwt.remote.EventUtil.getSuspended() && this._isModified ) {
        var req = rwt.remote.Server.getInstance();
        req.send();
      }
    },

    _onSend : function( evt ) {
      var server = rwt.remote.Server.getInstance();
      server.getRemoteObject( this ).set( "text", this._field.getComputedValue() );
      server.removeEventListener( "send", this._onSend, this );
      this._isModified = false;
      this.setText( this._field.getComputedValue() );
    },

    _sendModifyText : function() {
      var server = rwt.remote.Server.getInstance();
      server.getRemoteObject( this ).notify( "Modify" );
      this._isModified = false;
    },

    _sendWidgetSelected : function() {
      if( !rwt.remote.EventUtil.getSuspended() ) {
        var listItem = this._list.getSelectedItem();
        var remoteObject = rwt.remote.Server.getInstance().getRemoteObject( this );
        remoteObject.set( "selectionIndex", this._list.getItemIndex( listItem ) );
        if( this._hasSelectionListener ) {
          rwt.remote.EventUtil.notifySelected( this );
        }
        if( this._hasModifyListener ) {
          this._sendModifyText();
        }
      }
    },

    _sendWidgetDefaultSelected : function() {
      if( this._hasDefaultSelectionListener && !rwt.remote.EventUtil.getSuspended() ) {
        rwt.remote.EventUtil.notifyDefaultSelected( this );
      }
    },

    _updateListVisibleRequestParam : function() {
      if( !rwt.remote.EventUtil.getSuspended() ) {
        var server = rwt.remote.Server.getInstance();
        server.getRemoteObject( this ).set( "listVisible", this._list.getDisplay() );
      }
    },

    // Checks for a text field selection change and updates
    // the request parameter if necessary.
    _handleSelectionChange : function() {
      var sel = this._field.getComputedSelection();
      var start = sel[ 0 ];
      // TODO [ad] Solution from TextUtil.js - must be in synch with it
      // TODO [rst] Quick fix for bug 258632
      //            https://bugs.eclipse.org/bugs/show_bug.cgi?id=258632
      if( start === undefined ) {
        start = 0;
      }
      var length = sel[ 1 ] - sel[ 0 ];
      // TODO [ad] Solution from TextUtil.js - must be in synch with it
      // TODO [rst] Workaround for qx bug 521. Might be redundant as the
      //            bug is marked as (partly) fixed.
      //            See http://bugzilla.qooxdoo.org/show_bug.cgi?id=521
      if( typeof length == "undefined" ) {
        length = 0;
      }
      if( this._selectionStart != start || this._selectionLength != length ) {
        var remoteObject = rwt.remote.Server.getInstance().getRemoteObject( this );
        this._selectionStart = start;
        remoteObject.set( "selectionStart", start );
        this._selectionLength = length;
        remoteObject.set( "selectionLength", length );
      }
    },

    _getListMaxHeight : function() {
      return this._itemHeight * this._visibleItemCount;
    },

    //////////////
    // Set methods

    setItems : function( items ) {
      this._list.setItems( items );
      this.createDispatchEvent( "itemsChanged" );
    },

    setVisibleItemCount : function( value ) {
      this._visibleItemCount = value;
    },

    setItemHeight : function( value ) {
      this._itemHeight = value;
    },

    select : function( index ) {
      var items = this._list.getItems();
      var item = null;
      if( index >= 0 && index <= items.length - 1 ) {
        item = items[ index ];
      }
      this._setSelected( item );
    },

    setEditable : function( value ) {
      this._editable = value;
      this._field.setReadOnly( !value );
      this._field.setCursor( value ? null : "default" );
    },

    setListVisible : function( value ) {
      if( this._list.getDisplay() != value ) {
        this._dropped = !value;
        this._toggleListVisibility();
      }
    },

    setText : function( value ) {
      this._field.setValue( value );
    },

    setTextSelection : function( start, length ) {
      if( this._field.isCreated() ) {
        this._selectionStart = start;
        this._selectionLength = length;
        this._field.setSelection( start, start + length );
      }
    },

    setTextLimit : function( value ) {
      this._field.setMaxLength( value );
    },

    setHasSelectionListener : function( value ) {
      this._hasSelectionListener = value;
    },

    setHasDefaultSelectionListener : function( value ) {
      this._hasDefaultSelectionListener = value;
    },

    setHasModifyListener : function( value ) {
      this._hasModifyListener = value;
    },

    ////////////////////////////
    // apply subwidget html IDs

    applyObjectId : function( id ) {
      this.base( arguments, id );
      if( rwt.widgets.base.Widget._renderHtmlIds ) {
        this._list.applyObjectId( id + "-listbox" );
        this.addEventListener( "itemsChanged", this._applyListItemIds );
      }
    },

    _applyListItemIds : function() {
      var listId = this._list.getHtmlAttribute( "id" );
      var listItems = this._list.getItems();
      if( listItems ) {
        for( var i = 0; i < listItems.length; i++ ) {
          listItems[ i ].setHtmlAttribute( "id", this._list.getHtmlAttribute( "id" ) + "-listitem-" + i );
        }
      }
    }

  }
} );
