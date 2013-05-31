/*******************************************************************************
 * Copyright (c) 2009, 2013 Innoopract Informationssysteme GmbH and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    Innoopract Informationssysteme GmbH - initial API and implementation
 *    EclipseSource - ongoing development
 ******************************************************************************/

rwt.qx.Class.define( "rwt.remote.DNDSupport", {
  type : "singleton",
  extend : rwt.qx.Object,

  construct : function() {
    this.base( arguments );
    this._dragSources = {};
    this._dropTargets = {};
    this._dropTargetEventQueue = {};
    this._requestScheduled = false;
    this._currentDragSource = null;
    this._currentDropTarget = null;
    this._currentTargetWidget = null;
    this._currentMousePosition = { x : 0, y : 0 };
    this._actionOverwrite = null;
    this._dataTypeOverwrite = null;
    this._dropFeedbackRenderer = null;
    this._dropFeedbackFlags = 0;
    this._dragFeedbackWidget = null;
    this._blockDrag = false;
  },

  members : {

    /////////////
    // dragSource

    registerDragSource : function( widget, operations ) {
      widget.addEventListener( "dragstart", this._dragStartHandler, this );
      widget.addEventListener( "dragend", this._dragEndHandler, this );
      var hash = widget.toHashCode();
      this._dragSources[ hash ] = {
        "dataTypes" : [],
        "actions" : this._operationsToActions( operations )
      };
    },

    setDragSourceTransferTypes : function( widget, transferTypes ) {
      var hash = widget.toHashCode();
      this._dragSources[ hash ][ "dataTypes" ] = transferTypes;
    },

    deregisterDragSource : function( widget ) {
      widget.removeEventListener( "dragstart", this._dragStartHandler, this );
      widget.removeEventListener( "dragend", this._dragEndHandler, this );
      var hash = widget.toHashCode();
      delete this._dragSources[ hash ];
    },

    isDragSource : function( widget ) {
      var hash = widget.toHashCode();
      return typeof this._dragSources[ hash ] != "undefined";
    },

    isDropTarget : function( widget ) {
      var hash = widget.toHashCode();
      return typeof this._dropTargets[ hash ] != "undefined";
    },

    setHasListener : function( widget, type, value ) {
      var remoteObject = rwt.remote.RemoteObjectFactory.getRemoteObject( widget );
      remoteObject._.listen[ type ] = value;
    },

    _dragStartHandler : function( event ) {
      var wm = rwt.remote.WidgetManager.getInstance();
      var target = event.getCurrentTarget();
      var control = wm.findControl( event.getTarget() );
      if( control == target && !this._blockDrag ) {
        var hash = target.toHashCode();
        var dataTypes = this._dragSources[ hash ].dataTypes;
        if( dataTypes.length > 0 ) {
          for( var i = 0; i < dataTypes.length; i++ ) {
            event.addData( dataTypes[ i ], true );
          }
          this._actionOverwrite = null;
          this._currentDragSource = target;
          var dndHandler = rwt.event.DragAndDropHandler.getInstance();
          dndHandler.clearActions();
          var doc = rwt.widgets.base.ClientDocument.getInstance();
          doc.addEventListener( "mouseover", this._onMouseOver, this );
          doc.addEventListener( "keydown", this._onKeyEvent, this );
          doc.addEventListener( "keyup", this._onKeyEvent, this );
          this.setCurrentTargetWidget( event.getOriginalTarget() );
          // fix for bug 296348
          var widgetUtil = rwt.widgets.util.WidgetUtil;
          widgetUtil._fakeMouseEvent( this._currentTargetWidget, "mouseout" );
          var sourceWidget = dndHandler.__dragCache.sourceWidget;
          var feedbackWidget = this._getFeedbackWidget( control, sourceWidget );
          // Note: Unlike SWT, the feedbackWidget can not be rendered behind
          // the cursor, i.e. with a negative offset, as the widget would
          // get all the mouse-events instead of a potential drop-target.
          dndHandler.setFeedbackWidget( feedbackWidget, 10, 20 );
          event.startDrag();
          event.stopPropagation();
        }
        this._sendDragSourceEvent( target, "DragStart", event.getMouseEvent() );
      }
    },

    _dragEndHandler : function( event ) {
      var target = event.getCurrentTarget();
      var mouseEvent = event.getMouseEvent();
      // fix for Bug 301544: block new dragStarts until request is send
      this._blockDrag = true;
      if( !this._requestScheduled ) {
        var req = rwt.remote.Server.getInstance();
        req.addEventListener( "send", this._onSend, this );
      }
      this._sendDragSourceEvent( target, "DragEnd", mouseEvent );
      this._cleanUp();
      event.stopPropagation();
    },

    _sendDragSourceEvent : function( widget, type, qxDomEvent ) {
      var x = 0;
      var y = 0;
      if( qxDomEvent instanceof rwt.event.MouseEvent ) {
        x = qxDomEvent.getPageX();
        y = qxDomEvent.getPageY();
      }
      var parameters = {
        "x" : x,
        "y" : y,
        "time" : rwt.remote.EventUtil.eventTimestamp()
      };
      rwt.remote.Server.getInstance().getRemoteObject( widget ).notify( type, parameters );
    },

    /////////////
    // dropTarget

    registerDropTarget : function( widget, operations ) {
      widget.addEventListener( "dragover", this._dragOverHandler, this );
      widget.addEventListener( "dragmove", this._dragMoveHandler, this );
      widget.addEventListener( "dragout", this._dragOutHandler, this );
      widget.addEventListener( "dragdrop", this._dragDropHandler, this );
      var hash = widget.toHashCode();
      this._dropTargets[ hash ] = {
        "actions" : this._operationsToActions( operations )
      };
      widget.setSupportsDropMethod( rwt.util.Functions.returnTrue );
    },

    setDropTargetTransferTypes : function( widget, transferTypes ) {
      widget.setDropDataTypes( transferTypes );
    },

    deregisterDropTarget : function( widget ) {
      widget.setDropDataTypes( [] );
      widget.removeEventListener( "dragover", this._dragOverHandler, this );
      widget.removeEventListener( "dragmove", this._dragMoveHandler, this );
      widget.removeEventListener( "dragout", this._dragOutHandler, this );
      widget.removeEventListener( "dragdrop", this._dragDropHandler, this );
      var hash = widget.toHashCode();
      delete this._dropTargets[ hash ];
      widget.setSupportsDropMethod( null );
    },

    _dragOverHandler : function( event ) {
      var target = event.getCurrentTarget();
      var hash = target.toHashCode();
      var mouseEvent = event.getMouseEvent();
      this._currentDropTarget = target;
      var action = this._computeCurrentAction( mouseEvent, target );
      this._setAction( action, null );
      this._sendDropTargetEvent( target, "DragEnter", mouseEvent, action );
      event.stopPropagation();
    },

    _dragMoveHandler : function( event ) {
      var target = event.getCurrentTarget();
      var mouseEvent = event.getMouseEvent();
      this._currentMousePosition.x = mouseEvent.getPageX();
      this._currentMousePosition.y = mouseEvent.getPageY();
      var action = this._computeCurrentAction( mouseEvent, target );
      this._setAction( action, mouseEvent );
      this._sendDropTargetEvent( target, "DragOver", mouseEvent, action );
      event.stopPropagation();
    },

    _dragOutHandler : function( event ) {
      var target = event.getCurrentTarget();
      var mouseEvent = event.getMouseEvent();
      if( this._currentTargetWidget !== mouseEvent.getTarget() ) {
        this._onMouseOver( mouseEvent );
      }
      var dndHandler = rwt.event.DragAndDropHandler.getInstance();
      dndHandler.clearActions();
      this.setFeedback( target, null, 0 );
      this._currentDropTarget = null;
      this._actionOverwrite = null;
      this._dataTypeOverwrite = null;
      if( this._isDropTargetEventScheduled( "DragEnter" ) ) {
        this._cancelDropTargetEvent( "DragEnter" );
        this._cancelDropTargetEvent( "DragOver" );
      } else {
        this._sendDropTargetEvent( target, "DragLeave", mouseEvent, "none" );
      }
      event.stopPropagation();
    },

    _dragDropHandler : function( event ) {
      var target = event.getCurrentTarget();
      var mouseEvent = event.getMouseEvent();
      var action = this._computeCurrentAction( mouseEvent, target );
      this._sendDropTargetEvent( target, "DropAccept", mouseEvent, action );
      event.stopPropagation();
    },

    _sendDropTargetEvent : function( widget, type, qxDomEvent, action ) {
      var wm = rwt.remote.WidgetManager.getInstance();
      var item = this._getCurrentItemTarget();
      var itemId = item != null ? wm.findIdByWidget( item ) : null;
      var x = 0;
      var y = 0;
      if( qxDomEvent instanceof rwt.event.MouseEvent ) {
        x = qxDomEvent.getPageX();
        y = qxDomEvent.getPageY();
      } else {
        x = this._currentMousePosition.x;
        y = this._currentMousePosition.y;
      }
      var source = wm.findIdByWidget( this._currentDragSource );
      var time = rwt.remote.EventUtil.eventTimestamp();
      var operation = action == "alias" ? "link" : action;
      var event = {};
      event[ "widget" ] = widget;
      event[ "eventName" ] = type;
      var param = {};
      param[ "x" ] = x;
      param[ "y" ] = y;
      param[ "item" ] = itemId;
      param[ "operation" ] = operation;
      param[ "feedback" ] = this._dropFeedbackFlags;
      param[ "dataType" ] = this._dataTypeOverwrite;
      param[ "source" ] = source;
      param[ "time" ] = time;
      event[ "param" ] = param;
      this._dropTargetEventQueue[ type ] = event;
      if( !this._requestScheduled ) {
        var req = rwt.remote.Server.getInstance();
        req.addEventListener( "send", this._onSend, this );
        this._requestScheduled = true;
        rwt.client.Timer.once( req.send, req, 200 );
      }
    },

    _isDropTargetEventScheduled : function( type ) {
      return typeof this._dropTargetEventQueue[ type ] != "undefined";
    },

    _cancelDropTargetEvent : function( type ) {
      delete this._dropTargetEventQueue[ type ];
    },

    _setPropertyRetroactively : function( dropTarget, property, value ) {
      for( var type in this._dropTargetEventQueue ) {
        var event = this._dropTargetEventQueue[ type ];
        if( event[ "widget" ] === dropTarget ) {
          event[ "param" ][ property ] = value;
        }
      }
    },

    _attachDropTargetEvents : function() {
      var server = rwt.remote.Server.getInstance();
      var events = this._dropTargetEventQueue;
      for( var type in events ) {
        var event = events[ type ];
        server.getRemoteObject( event.widget ).notify( event.eventName, event.param );
      }
      this._dropTargetEventQueue = {};
    },

    _getCurrentItemTarget : function() {
      var result = null;
      var target = this._getCurrentFeedbackTarget();
      if( target instanceof rwt.widgets.base.GridRow ) {
        var tree = this._currentDropTarget;
        result = tree._rowContainer.findItemByRow( target );
      } else {
        result = target;
      }
      return result;
    },

    //////////
    // actions

    _setAction : function( newAction, sourceEvent ) {
      // NOTE: using setCurrentAction would conflict with key events
      var dndHandler = rwt.event.DragAndDropHandler.getInstance();
      var oldAction = dndHandler.getCurrentAction();
      if( oldAction != newAction ) {
        dndHandler.clearActions();
        dndHandler.setAction( newAction );
        if( sourceEvent != null ) {
          this._sendDropTargetEvent( this._currentDropTarget,
                                     "DragOperationChanged",
                                     sourceEvent,
                                     newAction );
        }
      }
    },

    _operationsToActions : function( operations ) {
      var result = {};
      for( var i = 0; i < operations.length; i++ ) {
        var action = this._toAction( operations[ i ] );
        result[ action ] = action != null;
      }
      return result;
    },

    _toAction : function( operation ) {
      var result;
      switch( operation ) {
        case "DROP_MOVE":
          result = "move";
        break;
        case "DROP_COPY":
          result = "copy";
        break;
        case "DROP_LINK":
          result = "alias";
        break;
        default:
          result = operation;
        break;
      }
      return result;
    },

    _computeCurrentAction : function( domEvent, target ) {
      var result;
      if( this._actionOverwrite != null ) {
        result = this._actionOverwrite;
      } else {
        result = "move";
        var shift = domEvent.isShiftPressed();
        var ctrl = domEvent.isCtrlPressed();
        var alt = domEvent.isAltPressed();
        if( ctrl && !shift && !alt ) {
          result = "copy";
        } else if( alt && !shift && !ctrl ) {
          result = "alias";
        } else if( !alt && shift && ctrl ) {
          result = "alias";
        }
        var dropTargetHash = target.toHashCode();
        var dropActions = this._dropTargets[ dropTargetHash ].actions;
        var dragSourceHash = this._currentDragSource.toHashCode();
        var dragActions = this._dragSources[ dragSourceHash ].actions;
        if( !dragActions[ result ] || !dropActions[ result ] ) {
          result = "none";
        }
      }
      return result;
    },

    ///////////
    // feedback

    // TODO [tb] : allow overwrite using DropTarget.setDropTargetEffect?
    /*
     * Creates a feedback-renderer matching the given widget,
     * "implementing" the following interface:
     *  setFeedback : function( feedbackMap )
     *  renderFeedback : function( target )
     *  isFeedbackNode : function( node )
     */
    _createFeedback : function( widget ) {
      if( this._dropFeedbackRenderer == null ) {
        if( widget instanceof rwt.widgets.Grid ) {
          this._dropFeedbackRenderer = new rwt.widgets.util.GridDNDFeedback( widget );
        }
      }
    },

    _renderFeedback : function() {
      if( this._dropFeedbackRenderer != null ) {
        var target = this._getCurrentFeedbackTarget();
        this._dropFeedbackRenderer.renderFeedback( target );
      }
    },

    _getCurrentFeedbackTarget : function() {
      var result = null;
      var widget = this._currentTargetWidget;
      if( widget instanceof rwt.widgets.base.GridRow ) {
        // _currentDropTarget could be another tree
        if( this._currentDropTarget && this._currentDropTarget.contains( widget ) ) {
          result = widget;
        }
      }
      return result;
    },

    // TODO [tb] : allow overwrite using DragSourceEvent.image?
    _getFeedbackWidget : function( control, target ) {
      var item = target;
      var success = false;
      if( this._dragFeedbackWidget == null ) {
        this._dragFeedbackWidget
          = new rwt.widgets.base.MultiCellWidget( [ "image", "label" ] );
        this._dragFeedbackWidget.setOpacity( 0.7 );
        this._dragFeedbackWidget.setEnabled( false );
        this._dragFeedbackWidget.setPadding( 2 );
      }
      while( !success && item != control ) {
        if( item instanceof rwt.widgets.base.GridRow ) {
          success = true;
          this._configureTreeRowFeedback( item );
        }
        if( !success ) {
          item = item.getParent();
        }
      }
      return success ? this._dragFeedbackWidget : null;
    },

    _configureTreeRowFeedback : function( row ) {
      var widget = this._dragFeedbackWidget;
      var tree = this._currentDragSource;
      var item = tree._rowContainer.findItemByRow( row );
      if( item != null ) {
        var config = tree.getRenderConfig();
        var image = item.getImage( config.treeColumn );
        if( image != null ) {
          widget.setCellContent( 0, image );
          var imageWidth = config.itemImageWidth[ config.treeColumn ];
          widget.setCellDimension( 0, imageWidth, row.getHeight() );
        }
        var backgroundColor = item.getCellBackground( config.treeColumn );
        var textColor = item.getCellForeground( config.treeColumn );
        widget.setBackgroundColor( backgroundColor );
        widget.setTextColor( textColor );
        widget.setCellContent( 1, item.getText( config.treeColumn ) );
        widget.setFont( config.font );
      }
    },

    _resetFeedbackWidget : function() {
      if( this._dragFeedbackWidget != null ) {
        this._dragFeedbackWidget.setParent( null );
        this._dragFeedbackWidget.setFont( null );
        this._dragFeedbackWidget.setCellContent( 0, null );
        this._dragFeedbackWidget.setCellDimension( 0, null, null );
        this._dragFeedbackWidget.setCellContent( 1, null );
        this._dragFeedbackWidget.setBackgroundColor( null );
      }
    },

    ///////////////
    // eventhandler

    _onSend : function( event ) {
      this._attachDropTargetEvents();
      this._requestScheduled = false;
      this._blockDrag = false;
      var req = rwt.remote.Server.getInstance();
      req.removeEventListener( "send", this._onSend, this );
    },

    _onMouseOver : function( event ) {
      var target = event.getTarget();
      if( this._dropFeedbackRenderer != null ) {
        var node = event.getDomTarget();
        if( !this._dropFeedbackRenderer.isFeedbackNode( node ) ) {
          this.setCurrentTargetWidget( target );
        }
      } else {
        this.setCurrentTargetWidget( target );
      }
    },

    setCurrentTargetWidget : function( target ) {
      this._currentTargetWidget = target;
      this._renderFeedback();
    },

    _onKeyEvent : function( event ) {
      if( event.getType() == "keyup" && event.getKeyIdentifier() == "Alt" ) {
        // NOTE: This combination causes problems with future dom events,
        // so instead we cancel the operation.
        this._sendDragSourceEvent( this._currentDragSource, "DragEnd", event );
        this.cancel();
      } else if( this._currentDropTarget != null ) {
        var dndHandler = rwt.event.DragAndDropHandler.getInstance();
        var action = this._computeCurrentAction( event, this._currentDropTarget );
        this._setAction( action, event );
        dndHandler._renderCursor();
      }
    },

    /////////
    // helper

    _cleanUp : function() {
      // fix for bug 296348
      var widgetUtil = rwt.widgets.util.WidgetUtil;
      widgetUtil._fakeMouseEvent( this._currentTargetWidget, "elementOver" );
      widgetUtil._fakeMouseEvent( this._currentTargetWidget, "mouseover" );
      this.setCurrentTargetWidget( null );
      if( this._currentDropTarget != null) {
        this.setFeedback( this._currentDropTarget, null, 0 );
        this._currentDropTarget = null;
      }
      var dndHandler = rwt.event.DragAndDropHandler.getInstance();
      dndHandler.setFeedbackWidget( null );
      this._resetFeedbackWidget();
      this._currentDragSource = null;
      this._dataTypeOverwrite = null;
      this._currentMousePosition.x = 0;
      this._currentMousePosition.y = 0;
      var doc = rwt.widgets.base.ClientDocument.getInstance();
      doc.removeEventListener( "mouseover", this._onMouseOver, this );
      doc.removeEventListener( "keydown", this._onKeyEvent, this );
      doc.removeEventListener( "keyup", this._onKeyEvent, this );
    },

    //////////////////
    // server response

    cancel : function() {
      if( this._currentDragSource != null ) {
        var dndHandler = rwt.event.DragAndDropHandler.getInstance();
        dndHandler.globalCancelDrag();
        this._cleanUp();
      }
    },

    setOperationOverwrite : function( widget, operation ) {
      if( widget == this._currentDropTarget ) {
        var action = this._toAction( operation );
        var dndHandler = rwt.event.DragAndDropHandler.getInstance();
        this._actionOverwrite = action;
        this._setAction( action, null );
        dndHandler._renderCursor();
      }
      this._setPropertyRetroactively( widget, "operation", operation );
    },

    /*
     * feedback is an array of strings with possible values
     * "select", "before", "after", "expand" and "scroll", while
     * flags is the "feedback"-field of SWTs dropTargetEvent,
     * representing the same information as an integer.
     */
    setFeedback : function( widget, feedback, flags ) {
      if( widget == this._currentDropTarget ) {
        if( feedback != null ) {
          this._createFeedback( widget );
          if( this._dropFeedbackRenderer != null ) {
            var feedbackMap = {};
            for( var i = 0; i < feedback.length; i++ ) {
              feedbackMap[ feedback[ i ] ] = true;
            }
            this._dropFeedbackRenderer.setFeedback( feedbackMap );
            this._renderFeedback();
          }
        } else if( this._dropFeedbackRenderer != null ) {
          this._dropFeedbackRenderer.dispose();
          this._dropFeedbackRenderer = null;
        }
        this._dropFeedbackFlags = flags;
      }
    },

    setDataType : function( widget, type ) {
      if( widget == this._currentDropTarget ) {
        this._dataTypeOverwrite = type;
      }
      this._setPropertyRetroactively( widget, "dataType", type );
    }

  }

} );

