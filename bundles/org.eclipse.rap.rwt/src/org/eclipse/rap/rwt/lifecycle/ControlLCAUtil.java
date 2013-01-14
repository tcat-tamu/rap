/*******************************************************************************
 * Copyright (c) 2002, 2012 Innoopract Informationssysteme GmbH and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    Innoopract Informationssysteme GmbH - initial API and implementation
 *    EclipseSource - ongoing development
 ******************************************************************************/
package org.eclipse.rap.rwt.lifecycle;


import static org.eclipse.rap.rwt.internal.protocol.ClientMessageConst.EVENT_PARAM_DETAIL;
import static org.eclipse.rap.rwt.internal.protocol.ClientMessageConst.EVENT_PARAM_INDEX;
import static org.eclipse.rap.rwt.lifecycle.WidgetLCAUtil.readEventPropertyValue;

import java.lang.reflect.Field;

import org.eclipse.rap.rwt.internal.protocol.ClientMessageConst;
import org.eclipse.rap.rwt.internal.protocol.ClientObjectFactory;
import org.eclipse.rap.rwt.internal.protocol.IClientObject;
import org.eclipse.rap.rwt.internal.util.ActiveKeysUtil;
import org.eclipse.rap.rwt.internal.util.NumberFormatUtil;
import org.eclipse.swt.SWT;
import org.eclipse.swt.custom.CTabFolder;
import org.eclipse.swt.custom.SashForm;
import org.eclipse.swt.graphics.Cursor;
import org.eclipse.swt.graphics.Font;
import org.eclipse.swt.graphics.Image;
import org.eclipse.swt.graphics.Point;
import org.eclipse.swt.graphics.Rectangle;
import org.eclipse.swt.internal.events.EventLCAUtil;
import org.eclipse.swt.internal.widgets.ControlUtil;
import org.eclipse.swt.internal.widgets.IControlAdapter;
import org.eclipse.swt.internal.widgets.IControlHolderAdapter;
import org.eclipse.swt.internal.widgets.Props;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Control;
import org.eclipse.swt.widgets.Event;
import org.eclipse.swt.widgets.Item;
import org.eclipse.swt.widgets.Link;
import org.eclipse.swt.widgets.Scrollable;
import org.eclipse.swt.widgets.Shell;
import org.eclipse.swt.widgets.Widget;


/**
 * Utility class that provides a number of useful static methods to support the
 * implementation of life cycle adapters (LCAs) for {@link Control}s.
 *
 * @see WidgetLCAUtil
 * @since 2.0
 */
public class ControlLCAUtil {

  // Property names to preserve widget property values
  private static final String PROP_ACTIVATE_LISTENER = "Activate";
  private static final String PROP_DEACTIVATE_LISTENER = "Deactivate";
  private static final String PROP_FOCUS_IN_LISTENER = "FocusIn";
  private static final String PROP_FOCUS_OUT_LISTENER = "FocusOut";
  private static final String PROP_MOUSE_DOWN_LISTENER = "MouseDown";
  private static final String PROP_MOUSE_DOUBLE_CLICK_LISTENER = "MouseDoubleClick";
  private static final String PROP_MOUSE_UP_LISTENER = "MouseUp";
  private static final String PROP_KEY_LISTENER = "KeyDown";
  private static final String PROP_TRAVERSE_LISTENER = "Traverse";
  private static final String PROP_MENU_DETECT_LISTENER = "MenuDetect";
  private static final String PROP_TAB_INDEX = "tabIndex";
  private static final String PROP_CURSOR = "cursor";
  private static final String PROP_BACKGROUND_IMAGE = "backgroundImage";
  private static final String PROP_CHILDREN = "children";

  static final int MAX_STATIC_ZORDER = 300;

  private static final String CURSOR_UPARROW
    = "rwt-resources/resource/widget/rap/cursors/up_arrow.cur";

  private ControlLCAUtil() {
    // prevent instance creation
  }

  ///////////////////////////////////////////////////////////
  // Methods to read and process common properties and events

  /**
   * Reads the bounds of the specified control from the current request and
   * applies it to the control. If no bounds are not submitted for the control,
   * it remains unchanged.
   *
   * @param control the control whose bounds to read and set
   */
  // TODO [rst] Revise: This seems to unnecessarily call getter and setter even
  //            when no bounds are submitted.
  public static void readBounds( Control control ) {
    Rectangle current = control.getBounds();
    Rectangle newBounds = WidgetLCAUtil.readBounds( control, current );
    control.setBounds( newBounds );
  }

  /**
   * Process a <code>HelpEvent</code> if the current request specifies that
   * there occured a help event for the given <code>widget</code>.
   *
   * @param control the control to process
   * @since 1.3
   */
  public static void processMenuDetect( Control control ) {
    if( WidgetLCAUtil.wasEventSent( control, ClientMessageConst.EVENT_MENU_DETECT ) ) {
      Event event = new Event();
      Point point = readEventXYProperties( control, ClientMessageConst.EVENT_MENU_DETECT );
      point = control.getDisplay().map( control, null, point );
      event.x = point.x;
      event.y = point.y;
      event.doit = true;
      control.notifyListeners( SWT.MenuDetect, event );
    }
  }

  public static void processEvents( Control control ) {
    processMouseEvents( control );
  }

  public static void processMouseEvents( Control control ) {
    if( WidgetLCAUtil.wasEventSent( control, ClientMessageConst.EVENT_MOUSE_DOWN ) ) {
      sendMouseEvent( control, ClientMessageConst.EVENT_MOUSE_DOWN, SWT.MouseDown );
    }
    if( WidgetLCAUtil.wasEventSent( control, ClientMessageConst.EVENT_MOUSE_DOUBLE_CLICK ) ) {
      sendMouseEvent( control, ClientMessageConst.EVENT_MOUSE_DOUBLE_CLICK, SWT.MouseDoubleClick );
    }
    if( WidgetLCAUtil.wasEventSent( control, ClientMessageConst.EVENT_MOUSE_UP ) ) {
      sendMouseEvent( control, ClientMessageConst.EVENT_MOUSE_UP, SWT.MouseUp );
    }
  }

  private static void sendMouseEvent( Control control, String eventName, int eventType ) {
    Event event = new Event();
    event.widget = control;
    event.type = eventType;
    event.button = readEventIntProperty( control,
                                         eventName,
                                         ClientMessageConst.EVENT_PARAM_BUTTON );
    Point point = readEventXYProperties( control, eventName );
    event.x = point.x;
    event.y = point.y;
    event.time = readEventIntProperty( control,
                                       eventName,
                                       ClientMessageConst.EVENT_PARAM_TIME );
    event.stateMask = EventLCAUtil.readStateMask( control, eventName )
                    | EventLCAUtil.translateButton( event.button );
    if( WidgetLCAUtil.wasEventSent( control, ClientMessageConst.EVENT_MOUSE_DOUBLE_CLICK ) ) {
      event.count = 2;
    } else {
      event.count = 1;
    }
    checkAndProcessMouseEvent( event );
  }

  public static void processKeyEvents( Control control ) {
    if( WidgetLCAUtil.wasEventSent( control, ClientMessageConst.EVENT_TRAVERSE ) ) {
      int keyCode = readEventIntProperty( control,
                                          ClientMessageConst.EVENT_TRAVERSE,
                                          ClientMessageConst.EVENT_PARAM_KEY_CODE );
      int charCode = readEventIntProperty( control,
                                           ClientMessageConst.EVENT_TRAVERSE,
                                           ClientMessageConst.EVENT_PARAM_CHAR_CODE );
      int stateMask = EventLCAUtil.readStateMask( control, ClientMessageConst.EVENT_TRAVERSE );
      int traverseKey = getTraverseKey( keyCode, stateMask );
      if( traverseKey != SWT.TRAVERSE_NONE ) {
        Event event = createKeyEvent( keyCode, charCode, stateMask );
        event.detail = traverseKey;
        control.notifyListeners( SWT.Traverse, event );
      }
    }
    if( WidgetLCAUtil.wasEventSent( control, ClientMessageConst.EVENT_KEY_DOWN ) ) {
      int keyCode = readEventIntProperty( control,
                                          ClientMessageConst.EVENT_KEY_DOWN,
                                          ClientMessageConst.EVENT_PARAM_KEY_CODE );
      int charCode = readEventIntProperty( control,
                                           ClientMessageConst.EVENT_KEY_DOWN,
                                           ClientMessageConst.EVENT_PARAM_CHAR_CODE );
      int stateMask = EventLCAUtil.readStateMask( control, ClientMessageConst.EVENT_KEY_DOWN );
      Event event = createKeyEvent( keyCode, charCode, stateMask );
      control.notifyListeners( SWT.KeyDown, event );
      event = createKeyEvent( keyCode, charCode, stateMask );
      control.notifyListeners( SWT.KeyUp, event );
    }
  }

  public static void processSelection( Widget widget, Item item, boolean readBounds ) {
    if( WidgetLCAUtil.wasEventSent( widget, ClientMessageConst.EVENT_SELECTION ) ) {
      Event event = createSelectionEvent( widget, readBounds, SWT.Selection );
      event.item = item;
      widget.notifyListeners( SWT.Selection, event );
    }
  }

  public static void processDefaultSelection( Widget widget, Item item ) {
    if( WidgetLCAUtil.wasEventSent( widget, ClientMessageConst.EVENT_DEFAULT_SELECTION ) ) {
      Event event = createSelectionEvent( widget, false, SWT.DefaultSelection );
      event.item = item;
      widget.notifyListeners( SWT.DefaultSelection, event );
    }
  }

  /////////////////////////////////////////////
  // Methods to preserve common property values

  /**
   * Preserves the values of the following properties of the specified control:
   * <ul>
   * <li>bounds</li>
   * <li>z-index (except for Shells)</li>
   * <li>tab index</li>
   * <li>tool tip text</li>
   * <li>menu</li>
   * <li>visible</li>
   * <li>enabled</li>
   * <li>foreground</li>
   * <li>background</li>
   * <li>background image</li>
   * <li>font</li>
   * <li>cursor</li>
   * <li>whether ControlListeners are registered</li>
   * <li>whether ActivateListeners are registered</li>
   * <li>whether MouseListeners are registered</li>
   * <li>whether FocusListeners are registered</li>
   * <li>whether KeyListeners are registered</li>
   * <li>whether TraverseListeners are registered</li>
   * <li>whether HelpListeners are registered</li>
   * <li>whether MenuDetectListeners are registered</li>
   * </ul>
   *
   * @param control the control whose parameters to preserve
   * @see #renderChanges(Control)
   */
  public static void preserveValues( Control control ) {
    WidgetAdapter adapter = WidgetUtil.getAdapter( control );
    WidgetLCAUtil.preserveBounds( control, control.getBounds() );
    adapter.preserve( PROP_CHILDREN, getChildren( control ) );
    adapter.preserve( PROP_TAB_INDEX, new Integer( getTabIndex( control ) ) );
    WidgetLCAUtil.preserveToolTipText( control, control.getToolTipText() );
    adapter.preserve( Props.MENU, control.getMenu() );
    adapter.preserve( Props.VISIBLE, Boolean.valueOf( getVisible( control ) ) );
    WidgetLCAUtil.preserveEnabled( control, control.getEnabled() );
    IControlAdapter controlAdapter = ControlUtil.getControlAdapter( control );
    WidgetLCAUtil.preserveForeground( control, controlAdapter.getUserForeground() );
    WidgetLCAUtil.preserveBackground( control,
                                      controlAdapter.getUserBackground(),
                                      controlAdapter.getBackgroundTransparency() );
    preserveBackgroundImage( control );
    WidgetLCAUtil.preserveFont( control, controlAdapter.getUserFont() );
    adapter.preserve( PROP_CURSOR, control.getCursor() );
    preserveActivateListeners( control );
    preserveMouseListeners( control );
    if( ( control.getStyle() & SWT.NO_FOCUS ) == 0 ) {
      preserveFocusListeners( control );
    }
    WidgetLCAUtil.preserveListener( control,
                                    PROP_KEY_LISTENER,
                                    hasKeyListener( control ) );
    WidgetLCAUtil.preserveListener( control,
                                    PROP_TRAVERSE_LISTENER,
                                    control.isListening( SWT.Traverse ) );
    WidgetLCAUtil.preserveListener( control,
                                    PROP_MENU_DETECT_LISTENER,
                                    control.isListening( SWT.MenuDetect ) );
    WidgetLCAUtil.preserveHelpListener( control );
    ActiveKeysUtil.preserveActiveKeys( control );
    ActiveKeysUtil.preserveCancelKeys( control );
  }

  /**
   * Preserves the value of the specified widget's background image.
   *
   * @param control the control whose background image property to preserve
   * @see #renderBackgroundImage(Control)
   */
  public static void preserveBackgroundImage( Control control ) {
    IControlAdapter controlAdapter = ControlUtil.getControlAdapter( control );
    Image image = controlAdapter.getUserBackgroundImage();
    WidgetAdapter adapter = WidgetUtil.getAdapter( control );
    adapter.preserve( PROP_BACKGROUND_IMAGE, image );
  }

  ///////////////////////////////////////////
  // Methods to render common property values

  /**
   * Determines for all of the following properties of the specified control
   * whether the property has changed during the processing of the current
   * request and if so, writes a protocol message to the response that updates the
   * corresponding client-side property.
   * <ul>
   * <li>bounds</li>
   * <li>z-index (except for Shells)</li>
   * <li>tab index</li>
   * <li>tool tip text</li>
   * <li>menu</li>
   * <li>visible</li>
   * <li>enabled</li>
   * <li>foreground</li>
   * <li>background</li>
   * <li>background image</li>
   * <li>font</li>
   * <li>cursor</li>
   * <!--li>whether ControlListeners are registered</li-->
   * <li>whether ActivateListeners are registered</li>
   * <li>whether MouseListeners are registered</li>
   * <li>whether FocusListeners are registered</li>
   * <li>whether KeyListeners are registered</li>
   * <li>whether TraverseListeners are registered</li>
   * <li>whether HelpListeners are registered</li>
   * </ul>
   *
   * @param control the control whose properties to set
   * @see #preserveValues(Control)
   * @since 1.5
   */
  public static void renderChanges( Control control ) {
    renderBounds( control );
    renderChildren( control );
    renderTabIndex( control );
    renderToolTip( control );
    renderMenu( control );
    renderVisible( control );
    renderEnabled( control );
    renderForeground( control );
    renderBackground( control );
    renderBackgroundImage( control );
    renderFont( control );
    renderCursor( control );
    ActiveKeysUtil.renderActiveKeys( control );
    ActiveKeysUtil.renderCancelKeys( control );
//    TODO [rst] missing: writeControlListener( control );
    renderListenActivate( control );
    renderListenFocus( control );
    renderListenMouse( control );
    renderListenKey( control );
    renderListenTraverse( control );
    renderListenMenuDetect( control );
    WidgetLCAUtil.renderListenHelp( control );
  }

  /**
   * Determines whether the bounds of the given control have changed during the
   * processing of the current request and if so, writes JavaScript code to the
   * response that updates the client-side bounds.
   *
   * @param control the control whose bounds to write
   * @since 1.5
   */
  public static void renderBounds( Control control ) {
    WidgetLCAUtil.renderBounds( control, control.getBounds() );
  }

  static void renderChildren( Control control ) {
    if( control instanceof Composite ) {
      String[] newValue = getChildren( control );
      WidgetLCAUtil.renderProperty( control, PROP_CHILDREN, newValue, null );
    }
  }

  static void renderTabIndex( Control control ) {
    if( control instanceof Shell ) {
      resetTabIndices( ( Shell )control );
      // tabIndex must be a positive value
      computeTabIndices( ( Shell )control, 1 );
    }
    Integer newValue = new Integer( getTabIndex( control ) );
    // there is no reliable default value for all controls
    if( WidgetLCAUtil.hasChanged( control, PROP_TAB_INDEX, newValue ) ) {
      IClientObject clientObject = ClientObjectFactory.getClientObject( control );
      clientObject.set( "tabIndex", newValue );
    }
  }

  /**
   * Determines whether the tool tip of the given control has changed during the
   * processing of the current request and if so, writes JavaScript code to the
   * response that updates the client-side tool tip.
   *
   * @param control the control whose tool tip to write
   * @since 1.5
   */
  public static void renderToolTip( Control control ) {
    WidgetLCAUtil.renderToolTip( control, control.getToolTipText() );
  }

  /**
   * Determines whether the property <code>menu</code> of the given control
   * has changed during the processing of the current request and if so, writes
   * a protocol message to the response that updates the client-side menu
   * property.
   *
   * @param control the control whose menu property to write
   * @since 1.5
   */
  public static void renderMenu( Control control ) {
    WidgetLCAUtil.renderMenu( control, control.getMenu() );
  }

  /**
   * Determines whether the visibility of the given control has changed during
   * the processing of the current request and if so, writes JavaScript code to
   * the response that updates the client-side visibility.
   *
   * @param control the control whose visibility to write
   * @since 1.5
   */
  public static void renderVisible( Control control ) {
    Boolean newValue = Boolean.valueOf( getVisible( control ) );
    Boolean defValue = control instanceof Shell ? Boolean.FALSE : Boolean.TRUE;
    // TODO [tb] : Can we have a shorthand for this, like in JSWriter?
    if( WidgetLCAUtil.hasChanged( control, Props.VISIBLE, newValue, defValue ) ) {
      IClientObject clientObject = ClientObjectFactory.getClientObject( control );
      clientObject.set( "visibility", newValue );
    }
  }

  /**
   * Determines whether the property <code>enabled</code> of the given control
   * has changed during the processing of the current request and if so, writes
   * a protocol message to the response that updates the client-side enabled
   * property.
   *
   * @param control the control whose enabled property to write
   * @since 1.5
   */
  public static void renderEnabled( Control control ) {
    // Using isEnabled() would result in unnecessarily updating child widgets of
    // enabled/disabled controls.
    WidgetLCAUtil.renderEnabled( control, control.getEnabled() );
  }

  /**
   * Determines whether the property <code>foreground</code> of the given
   * control has changed during the processing of the current request and if so,
   * writes a protocol message to the response that updates the client-side
   * foreground property.
   *
   * @param control the control whose foreground property to write
   * @since 1.5
   */
  public static void renderForeground( Control control ) {
    IControlAdapter controlAdapter = ControlUtil.getControlAdapter( control );
    WidgetLCAUtil.renderForeground( control, controlAdapter.getUserForeground() );
  }

  /**
   * Determines whether the property <code>background</code> of the given
   * control has changed during the processing of the current request and if so,
   * writes a protocol message to the response that updates the client-side
   * background property.
   *
   * @param control the control whose background property to write
   * @since 1.5
   */
  public static void renderBackground( Control control ) {
    IControlAdapter controlAdapter = ControlUtil.getControlAdapter( control );
    WidgetLCAUtil.renderBackground( control,
                                    controlAdapter.getUserBackground(),
                                    controlAdapter.getBackgroundTransparency() );
  }

  /**
   * Determines whether the background image of the given control has changed
   * during the processing of the current request and if so, writes a protocol
   * message to the response that updates the client-side background image
   * property.
   *
   * @param control the control whose background image property to write
   * @since 1.5
   */
  public static void renderBackgroundImage( Control control ) {
    IControlAdapter controlAdapter = ControlUtil.getControlAdapter( control );
    Image image = controlAdapter.getUserBackgroundImage();
    WidgetLCAUtil.renderProperty( control, PROP_BACKGROUND_IMAGE, image, null );
  }

  /**
   * Determines whether the property <code>font</code> of the given control
   * has changed during the processing of the current request and if so, writes
   * a protocol message to the response that updates the client-side font property.
   *
   * @param control the control whose font property to write
   * @since 1.5
   */
  public static void renderFont( Control control ) {
    IControlAdapter controlAdapter = ControlUtil.getControlAdapter( control );
    Font newValue = controlAdapter.getUserFont();
    WidgetLCAUtil.renderFont( control, newValue );
  }

  static void renderCursor( Control control ) {
    Cursor newValue = control.getCursor();
    if( WidgetLCAUtil.hasChanged( control, PROP_CURSOR, newValue, null ) ) {
      IClientObject clientObject = ClientObjectFactory.getClientObject( control );
      clientObject.set( PROP_CURSOR, getQxCursor( newValue ) );
    }
  }

  //////////////////
  // render listener

  static void renderListenActivate( Control control ) {
    // Note: Shell "Activate" event is handled by ShellLCA
    if( !control.isDisposed() && !( control instanceof Shell ) ) {
      renderListen( control, SWT.Activate, PROP_ACTIVATE_LISTENER );
      renderListen( control, SWT.Deactivate, PROP_DEACTIVATE_LISTENER );
    }
  }

  /**
   * Note that there is no corresponding readData method to fire the focus
   * events that are send by the client.
   * FocusEvents are thrown when the focus is changed programmatically and when
   * it is change by the user.
   * Therefore the methods in Display that maintain the current focusControl
   * also fire FocusEvents. The current client-side focusControl is read in
   * DisplayLCA#readData.
   */
  static void renderListenFocus( Control control ) {
    if( ( control.getStyle() & SWT.NO_FOCUS ) == 0 ) {
      renderListen( control, SWT.FocusIn, PROP_FOCUS_IN_LISTENER );
      renderListen( control, SWT.FocusOut, PROP_FOCUS_OUT_LISTENER );
    }
  }

  static void renderListenMouse( Control control ) {
    renderListen( control, SWT.MouseDown, PROP_MOUSE_DOWN_LISTENER );
    renderListen( control, SWT.MouseUp, PROP_MOUSE_UP_LISTENER );
    renderListen( control, SWT.MouseDoubleClick, PROP_MOUSE_DOUBLE_CLICK_LISTENER );
  }

  static void renderListenKey( Control control ) {
    boolean newValue = hasKeyListener( control );
    WidgetLCAUtil.renderListener( control, PROP_KEY_LISTENER, newValue, false );
  }

  static void renderListenTraverse( Control control ) {
    boolean newValue = control.isListening( SWT.Traverse );
    WidgetLCAUtil.renderListener( control, PROP_TRAVERSE_LISTENER, newValue, false );
  }

  static void renderListenMenuDetect( Control control ) {
    boolean newValue = control.isListening( SWT.MenuDetect );
    WidgetLCAUtil.renderListener( control, PROP_MENU_DETECT_LISTENER, newValue, false );
  }

  private static void renderListen( Control control, int eventType, String eventName ) {
    boolean newValue = control.isListening( eventType );
    WidgetLCAUtil.renderListener( control, eventName, newValue, false );
  }

  //////////////////////////
  // event processing helper

  private static Event createSelectionEvent( Widget widget, boolean readBounds, int type ) {
    Event result = new Event();
    if( widget instanceof Control && readBounds ) {
      Control control = ( Control )widget;
      Rectangle bounds = WidgetLCAUtil.readBounds( control, control.getBounds() );
      result.setBounds( bounds );
    }
    String eventName = type == SWT.Selection
                     ? ClientMessageConst.EVENT_SELECTION
                     : ClientMessageConst.EVENT_DEFAULT_SELECTION;
    result.stateMask = EventLCAUtil.readStateMask( widget, eventName );
    String detail = readEventPropertyValue( widget, eventName, EVENT_PARAM_DETAIL );
    if( "check".equals( detail ) ) {
      result.detail = SWT.CHECK;
    } else if( "search".equals( detail ) ) {
      result.detail = SWT.ICON_SEARCH;
    } else if( "cancel".equals( detail ) ) {
      result.detail = SWT.ICON_CANCEL;
    }
    String index = readEventPropertyValue( widget, eventName, EVENT_PARAM_INDEX );
    if (index != null)
      result.index = Integer.parseInt( index );
    return result;
  }

  private static Event createKeyEvent( int keyCode, int charCode, int stateMask ) {
    Event result = new Event();
    result.keyCode = translateKeyCode( keyCode );
    if( charCode == 0 ) {
      if( ( result.keyCode & SWT.KEYCODE_BIT ) == 0 ) {
        result.character = translateCharacter( result.keyCode );
      }
    } else {
      result.character = translateCharacter( charCode );
      if( Character.isLetter( charCode ) ) {
        // NOTE : keycodes from browser are the upper-case character, in SWT it is the lower-case
        result.keyCode = Character.toLowerCase( charCode );
      }
    }
    result.stateMask = stateMask;
    return result;
  }

  private static void checkAndProcessMouseEvent( Event event ) {
    boolean pass = false;
    Control control = ( Control )event.widget;
    //[ariddle] - view drag implementation
    if ( control instanceof CTabFolder ) {
      CTabFolder tabFolder = ( CTabFolder )control;
      Rectangle clientArea = tabFolder.getBounds();
      pass = clientArea.contains( tabFolder.toDisplay( event.x, event.y ) );
    } else if ( control instanceof Scrollable ) {
    //if( control instanceof Scrollable ) {
      Scrollable scrollable = ( Scrollable )control;
      Rectangle clientArea = scrollable.getClientArea();
      pass = clientArea.contains( event.x, event.y );
    } else {
      pass = event.x >= 0 && event.y >= 0;
    }
    if( pass ) {
      event.widget.notifyListeners( event.type, event );
    }
  }

  //////////////
  // read helper

  private static Point readEventXYProperties( Control control, String eventName ) {
    int x = readEventIntProperty( control, eventName, ClientMessageConst.EVENT_PARAM_X );
    int y = readEventIntProperty( control, eventName, ClientMessageConst.EVENT_PARAM_Y );
    return control.getDisplay().map( null, control, x, y );
  }

  private static int readEventIntProperty( Control control, String eventName, String property ) {
    String value = readEventStringProperty( control, eventName, property );
    return NumberFormatUtil.parseInt( value );
  }

  private static String readEventStringProperty( Control control,
                                                 String eventName,
                                                 String property )
  {
    WidgetLCAUtil.readEventPropertyValue( control, eventName, property );
    return WidgetLCAUtil.readEventPropertyValue( control, eventName, property );
  }

  //////////////////////
  // widget value getter

  private static String[] getChildren( Control control ) {
    String[] result = null;
    if( control instanceof Composite ) {
      Composite composite = ( Composite )control;
      IControlHolderAdapter controlHolder = composite.getAdapter( IControlHolderAdapter.class );
      Control[] children = controlHolder.getControls();
      result = new String[ children.length ];
      for( int i = 0; i < result.length; i++ ) {
        result[ i ] = WidgetUtil.getId( children[ i ] );
      }
    }
    return result;
  }

  // [if] Fix for bug 263025, 297466, 223873 and more
  // some qooxdoo widgets with size (0,0) are not invisible
  private static boolean getVisible( Control control ) {
    Point size = control.getSize();
    return control.getVisible() && size.x > 0 && size.y > 0;
  }

  // TODO [rh] Eliminate instance checks. Let the respective classes always return NO_FOCUS
  private static boolean takesFocus( Control control ) {
    boolean result = true;
    result &= ( control.getStyle() & SWT.NO_FOCUS ) == 0;
    result &= control.getClass() != Composite.class;
    result &= control.getClass() != SashForm.class;
    return result;
  }

  private static int getTabIndex( Control control ) {
    int result = -1;
    if( takesFocus( control ) ) {
      result = ControlUtil.getControlAdapter( control ).getTabIndex();
    }
    return result;
  }

  private static void resetTabIndices( Composite composite ) {
    Control[] children = composite.getChildren();
    for( int i = 0; i < children.length; i++ ) {
      Control control = children[ i ];
      ControlUtil.getControlAdapter( control ).setTabIndex( -1 );
      if( control instanceof Composite ) {
        resetTabIndices( ( Composite )control );
      }
    }
  }

  /**
   * Recursively computes the tab indices for all child controls of a given
   * composite and stores the resulting values in the control adapters.
   */
  private static int computeTabIndices( Composite composite, int startIndex ) {
    Control[] tabList = composite.getTabList();
    int result = startIndex;
    for( int i = 0; i < tabList.length; i++ ) {
      Control control = tabList[ i ];
      IControlAdapter controlAdapter = ControlUtil.getControlAdapter( control );
      controlAdapter.setTabIndex( result );
      // for Links, leave a range out to be assigned to hrefs on the client
      if( control instanceof Link ) {
        result += 300;
      } else {
        result += 1;
      }
      if( control instanceof Composite ) {
        result = computeTabIndices( ( Composite )control, result );
      }
    }
    return result;
  }

  static int getTraverseKey( int keyCode, int stateMask ) {
    int result = SWT.TRAVERSE_NONE;
    switch( keyCode ) {
      case 27:
        result = SWT.TRAVERSE_ESCAPE;
      break;
      case 13:
        result = SWT.TRAVERSE_RETURN;
      break;
      case 9:
        if( ( stateMask & SWT.MODIFIER_MASK ) == 0 ) {
          result = SWT.TRAVERSE_TAB_NEXT;
        } else if( stateMask == SWT.SHIFT ) {
          result = SWT.TRAVERSE_TAB_PREVIOUS;
        }
      break;
    }
    return result;
  }

  static int translateKeyCode( int keyCode ) {
    int result;
    switch( keyCode ) {
      case 16:
        result = SWT.SHIFT;
      break;
      case 17:
        result = SWT.CONTROL;
      break;
      case 18:
        result = SWT.ALT;
      break;
      case 20:
        result = SWT.CAPS_LOCK;
      break;
      case 38:
        result = SWT.ARROW_UP;
      break;
      case 37:
        result = SWT.ARROW_LEFT;
      break;
      case 39:
        result = SWT.ARROW_RIGHT;
      break;
      case 40:
        result = SWT.ARROW_DOWN;
      break;
      case 33:
        result = SWT.PAGE_UP;
      break;
      case 34:
        result = SWT.PAGE_DOWN;
      break;
      case 35:
        result = SWT.END;
      break;
      case 36:
        result = SWT.HOME;
      break;
      case 45:
        result = SWT.INSERT;
      break;
      case 46:
        result = SWT.DEL;
      break;
      case 112:
        result = SWT.F1;
      break;
      case 113:
        result = SWT.F2;
      break;
      case 114:
        result = SWT.F3;
      break;
      case 115:
        result = SWT.F4;
      break;
      case 116:
        result = SWT.F5;
      break;
      case 117:
        result = SWT.F6;
      break;
      case 118:
        result = SWT.F7;
      break;
      case 119:
        result = SWT.F8;
      break;
      case 120:
        result = SWT.F9;
      break;
      case 121:
        result = SWT.F10;
      break;
      case 122:
        result = SWT.F11;
      break;
      case 123:
        result = SWT.F12;
      break;
      case 144:
        result = SWT.NUM_LOCK;
      break;
      case 44:
        result = SWT.PRINT_SCREEN;
      break;
      case 145:
        result = SWT.SCROLL_LOCK;
      break;
      case 19:
        result = SWT.PAUSE;
      break;
      default:
        result = keyCode;
    }
    return result;
  }

  private static char translateCharacter( int keyCode ) {
    char result = ( char )0;
    if( Character.isDefined( ( char )keyCode ) ) {
      result = ( char )keyCode;
    }
    return result;
  }

  private static String getQxCursor( Cursor newValue ) {
    String result = null;
    if( newValue != null ) {
      // TODO [rst] Find a better way of obtaining the Cursor value
      // TODO [tb] adjust strings to match name of constants
      int value = 0;
      try {
        Class cursorClass = Cursor.class;
        Field field = cursorClass.getDeclaredField( "value" );
        field.setAccessible( true );
        value = field.getInt( newValue );
      } catch( Exception e ) {
        throw new RuntimeException( e );
      }
      switch( value ) {
        case SWT.CURSOR_ARROW:
          result = "default";
        break;
        case SWT.CURSOR_WAIT:
          result = "wait";
        break;
        case SWT.CURSOR_APPSTARTING:
          result = "progress";
          break;
        case SWT.CURSOR_CROSS:
          result = "crosshair";
        break;
        case SWT.CURSOR_HELP:
          result = "help";
        break;
        case SWT.CURSOR_SIZEALL:
          result = "move";
        break;
        case SWT.CURSOR_SIZENS:
          result = "row-resize";
        break;
        case SWT.CURSOR_SIZEWE:
          result = "col-resize";
        break;
        case SWT.CURSOR_SIZEN:
          result = "n-resize";
        break;
        case SWT.CURSOR_SIZES:
          result = "s-resize";
        break;
        case SWT.CURSOR_SIZEE:
          result = "e-resize";
        break;
        case SWT.CURSOR_SIZEW:
          result = "w-resize";
        break;
        case SWT.CURSOR_SIZENE:
        case SWT.CURSOR_SIZENESW:
          result = "ne-resize";
        break;
        case SWT.CURSOR_SIZESE:
          result = "se-resize";
        break;
        case SWT.CURSOR_SIZESW:
          result = "sw-resize";
        break;
        case SWT.CURSOR_SIZENW:
        case SWT.CURSOR_SIZENWSE:
          result = "nw-resize";
        break;
        case SWT.CURSOR_IBEAM:
          result = "text";
        break;
        case SWT.CURSOR_HAND:
          result = "pointer";
        break;
        case SWT.CURSOR_NO:
          result = "not-allowed";
        break;
        case SWT.CURSOR_UPARROW:
          result = CURSOR_UPARROW;
        break;
      }
    }
    return result;
  }

  private static boolean hasKeyListener( Control control ) {
    return control.isListening( SWT.KeyUp ) || control.isListening( SWT.KeyDown );
  }

  private static void preserveMouseListeners( Control control ) {
    WidgetLCAUtil.preserveListener( control,
                                    PROP_MOUSE_DOWN_LISTENER,
                                    control.isListening( SWT.MouseDown ) );
    WidgetLCAUtil.preserveListener( control,
                                    PROP_MOUSE_UP_LISTENER,
                                    control.isListening( SWT.MouseUp ) );
    WidgetLCAUtil.preserveListener( control,
                                    PROP_MOUSE_DOUBLE_CLICK_LISTENER,
                                    control.isListening( SWT.MouseDoubleClick ) );
  }

  private static void preserveFocusListeners( Control control ) {
    WidgetLCAUtil.preserveListener( control,
                                    PROP_FOCUS_IN_LISTENER,
                                    control.isListening( SWT.FocusIn ) );
    WidgetLCAUtil.preserveListener( control,
                                    PROP_FOCUS_OUT_LISTENER,
                                    control.isListening( SWT.FocusOut ) );
  }

  private static void preserveActivateListeners( Control control ) {
    // Note: Shell "Activate" event is handled by ShellLCA
    if( !( control instanceof Shell ) ) {
      WidgetLCAUtil.preserveListener( control,
                                      PROP_ACTIVATE_LISTENER,
                                      control.isListening( SWT.Activate ) );
      WidgetLCAUtil.preserveListener( control,
                                      PROP_DEACTIVATE_LISTENER,
                                      control.isListening( SWT.Deactivate ) );
    }
  }

}
