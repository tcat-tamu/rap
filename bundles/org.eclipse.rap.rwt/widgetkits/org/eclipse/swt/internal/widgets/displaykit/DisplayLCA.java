/*******************************************************************************
 * Copyright (c) 2002, 2015 Innoopract Informationssysteme GmbH and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    Innoopract Informationssysteme GmbH - initial API and implementation
 *    EclipseSource - ongoing development
 ******************************************************************************/
package org.eclipse.swt.internal.widgets.displaykit;

import static org.eclipse.rap.rwt.internal.lifecycle.DisplayUtil.getAdapter;
import static org.eclipse.rap.rwt.internal.lifecycle.DisplayUtil.getId;
import static org.eclipse.rap.rwt.internal.lifecycle.WidgetUtil.getAdapter;
import static org.eclipse.rap.rwt.internal.lifecycle.WidgetUtil.getId;
import static org.eclipse.rap.rwt.internal.lifecycle.WidgetUtil.getLCA;
import static org.eclipse.rap.rwt.internal.protocol.ClientMessageConst.EVENT_RESIZE;
import static org.eclipse.rap.rwt.internal.protocol.ProtocolUtil.handleOperation;
import static org.eclipse.rap.rwt.internal.protocol.RemoteObjectFactory.getRemoteObject;

import java.io.IOException;
import java.text.MessageFormat;
import java.util.List;

import org.eclipse.rap.rwt.RWT;
import org.eclipse.rap.rwt.client.service.ExitConfirmation;
import org.eclipse.rap.rwt.internal.RWTMessages;
import org.eclipse.rap.rwt.internal.lifecycle.DisposedWidgets;
import org.eclipse.rap.rwt.internal.lifecycle.UITestUtil;
import org.eclipse.rap.rwt.internal.lifecycle.RemoteAdapter;
import org.eclipse.rap.rwt.internal.protocol.ClientMessage;
import org.eclipse.rap.rwt.internal.protocol.Operation;
import org.eclipse.rap.rwt.internal.protocol.ProtocolUtil;
import org.eclipse.rap.rwt.internal.protocol.RemoteObjectFactory;
import org.eclipse.rap.rwt.internal.remote.RemoteObjectLifeCycleAdapter;
import org.eclipse.rap.rwt.internal.textsize.MeasurementUtil;
import org.eclipse.rap.rwt.internal.util.ActiveKeysUtil;
import org.eclipse.rap.rwt.remote.OperationHandler;
import org.eclipse.swt.SWT;
import org.eclipse.swt.internal.widgets.IDisplayAdapter;
import org.eclipse.swt.internal.widgets.WidgetRemoteAdapter;
import org.eclipse.swt.internal.widgets.WidgetTreeVisitor;
import org.eclipse.swt.internal.widgets.WidgetTreeVisitor.AllWidgetTreeVisitor;
import org.eclipse.swt.widgets.Control;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Shell;
import org.eclipse.swt.widgets.Widget;


public class DisplayLCA {

  //[ariddle] - added to support metrics gathering
  static final String PROP_GENERATE_METRICS = "generateMetrics";
  static final String PROP_FOCUS_CONTROL = "focusControl";
  static final String PROP_EXIT_CONFIRMATION = "exitConfirmation";
  static final String PROP_TIMEOUT_PAGE = "timeoutPage";
  static final String PROP_TIMEOUT_INTERVAL = "timeoutInterval";
  private static final String METHOD_BEEP = "beep";
  private static final String PROP_RESIZE_LISTENER = "listener_Resize";

  public void readData( Display display ) {
    //[ariddle] - added to support metrics gathering
    readMetrics( display );
    handleOperations( display );
    visitWidgets( display );
    DNDSupport.handleOperations();
    RemoteObjectLifeCycleAdapter.readData( ProtocolUtil.getClientMessage() );
  }

  public void preserveValues( Display display ) {
    RemoteAdapter adapter = getAdapter( display );
    adapter.preserve( PROP_FOCUS_CONTROL, display.getFocusControl() );
    adapter.preserve( PROP_TIMEOUT_PAGE, getTimeoutPage( display ) );
    int maxInactiveInterval = RWT.getRequest().getSession().getMaxInactiveInterval();
    adapter.preserve( PROP_TIMEOUT_INTERVAL, Integer.valueOf( maxInactiveInterval ) );
    adapter.preserve( PROP_EXIT_CONFIRMATION, getExitConfirmation() );
    adapter.preserve( PROP_RESIZE_LISTENER, Boolean.valueOf( hasResizeListener( display ) ) );
    ActiveKeysUtil.preserveActiveKeys( display );
    ActiveKeysUtil.preserveCancelKeys( display );
    ActiveKeysUtil.preserveMnemonicActivator( display );
    if( adapter.isInitialized() ) {
      for( Shell shell : getShells( display ) ) {
        WidgetTreeVisitor.accept( shell, new AllWidgetTreeVisitor() {
          @Override
          public boolean doVisit( Widget widget ) {
            getLCA( widget ).preserveValues( widget );
            return true;
          }
        } );
      }
    }
  }

  public void render( Display display ) throws IOException {
    //[ariddle] - added to support metrics gathering
    renderMetricsEnablement( display );
    //[ariddle] - added to support metrics gathering
    renderMetricsEnablement( display );
    renderExitConfirmation( display );
    renderEnableUiTests( display );
    renderShells( display );
    disposeWidgets();
    renderFocus( display );
    renderBeep( display );
    renderResizeListener( display );
    renderUICallBack();
    ActiveKeysUtil.renderActiveKeys( display );
    ActiveKeysUtil.renderCancelKeys( display );
    ActiveKeysUtil.renderMnemonicActivator( display );
    RemoteObjectLifeCycleAdapter.render();
    MeasurementUtil.renderMeasurementItems();
    runRenderRunnables( display );
    markInitialized( display );
  }

  //[ariddle] - added to support metrics gathering
  private static void renderMetricsEnablement( Display display ) {
//    Boolean metricsEnabled = Boolean.valueOf( RWTRequestVersionControl.getInstance().isGenerateMetrics() );
//    IWidgetAdapter adapter = DisplayUtil.getAdapter( display );
//    Object oldMetricsEnabled = adapter.getPreserved( PROP_GENERATE_METRICS );
//    if( !metricsEnabled.equals( oldMetricsEnabled ) ) {
//      IClientObject clientObject = ClientObjectFactory.getClientObject( display );
//      clientObject.set( PROP_GENERATE_METRICS, metricsEnabled );
//    }
  }

  public void clearPreserved( Display display ) {
    ( ( WidgetRemoteAdapter )getAdapter( display ) ).clearPreserved();
    for( Shell shell : getShells( display ) ) {
      WidgetTreeVisitor.accept( shell, new AllWidgetTreeVisitor() {
        @Override
        public boolean doVisit( Widget widget ) {
          ( ( WidgetRemoteAdapter )getAdapter( widget ) ).clearPreserved();
          return true;
        }
      } );
    }
  }

  private static void handleOperations( Display display ) {
    ClientMessage clientMessage = ProtocolUtil.getClientMessage();
    List<Operation> operations = clientMessage .getAllOperationsFor( getId( display ) );
    if( !operations.isEmpty() ) {
      OperationHandler handler = new DisplayOperationHandler( display );
      for( Operation operation : operations ) {
        handleOperation( handler, operation );
      }
    }
  }

  private static void visitWidgets( Display display ) {
    WidgetTreeVisitor visitor = new AllWidgetTreeVisitor() {
      @Override
      public boolean doVisit( Widget widget ) {
        getLCA( widget ).readData( widget );
        return true;
      }
    };
    for( Shell shell : getShells( display ) ) {
      WidgetTreeVisitor.accept( shell, visitor );
    }
  }

  private static void renderShells( Display display ) throws IOException {
    RenderVisitor visitor = new RenderVisitor();
    for( Shell shell : getShells( display ) ) {
      WidgetTreeVisitor.accept( shell, visitor );
      visitor.reThrowProblem();
    }
  }

  private static String getTimeoutPage(Display display) {
    String timeoutPage = (String) display.getData( "org.eclipse.rap.rwt."+PROP_TIMEOUT_PAGE );
    if ( timeoutPage == null ) {
      String timeoutTitle = RWTMessages.getMessage( "RWT_SessionTimeoutPageTitle" );
      String timeoutHeadline = RWTMessages.getMessage( "RWT_SessionTimeoutPageHeadline" );
      String pattern = RWTMessages.getMessage( "RWT_SessionTimeoutPageMessage" );
      Object[] arguments = new Object[]{ "<a {HREF_URL}>", "</a>" };
      String timeoutMessage = MessageFormat.format( pattern, arguments );
      // TODO Escape umlauts etc
      timeoutPage = "<html><head><title>"
          + timeoutTitle
          + "</title></head><body><p>"
          + timeoutHeadline
          + "</p><p>"
          + timeoutMessage
          + "</p></body></html>";
    }
    return timeoutPage;
  }

  private static void renderExitConfirmation( Display display ) {
    String exitConfirmation = getExitConfirmation();
    RemoteAdapter adapter = getAdapter( display );
    Object oldExitConfirmation = adapter.getPreserved( PROP_EXIT_CONFIRMATION );
    boolean hasChanged = exitConfirmation == null
                       ? oldExitConfirmation != null
                       : !exitConfirmation.equals( oldExitConfirmation );
    if( hasChanged ) {
      getRemoteObject( display ).set( PROP_EXIT_CONFIRMATION, exitConfirmation );
    }
  }

  private static String getExitConfirmation() {
    ExitConfirmation exitConfirmation = RWT.getClient().getService( ExitConfirmation.class );
    return exitConfirmation == null ? null : exitConfirmation.getMessage();
  }

  private static void disposeWidgets() throws IOException {
    for( Widget widget : DisposedWidgets.getAll() ) {
      getLCA( widget ).renderDispose( widget );
    }
  }

  private static void renderFocus( Display display ) {
    if( !display.isDisposed() ) {
      IDisplayAdapter displayAdapter = getDisplayAdapter( display );
      RemoteAdapter widgetAdapter = getAdapter( display );
      Object oldValue = widgetAdapter.getPreserved( PROP_FOCUS_CONTROL );
      if(    !widgetAdapter.isInitialized()
          || oldValue != display.getFocusControl()
          || displayAdapter.isFocusInvalidated() )
      {
        // TODO [rst] Added null check as a NPE occurred in some rare cases
        Control focusControl = display.getFocusControl();
        if( focusControl != null ) {
          getRemoteObject( display ).set( PROP_FOCUS_CONTROL, getId( display.getFocusControl() ) );
        }
      }
    }
  }

  private static void renderBeep( Display display ) {
    IDisplayAdapter displayAdapter = getDisplayAdapter( display );
    if( displayAdapter.isBeepCalled() ) {
      displayAdapter.resetBeep();
      getRemoteObject( display ).call( METHOD_BEEP, null );
    }
  }

  private static void renderResizeListener( Display display ) {
    RemoteAdapter adapter = getAdapter( display );
    Boolean oldValue = ( Boolean )adapter.getPreserved( PROP_RESIZE_LISTENER );
    if( oldValue == null ) {
      oldValue = Boolean.FALSE;
    }
    Boolean newValue = Boolean.valueOf( hasResizeListener( display ) );
    if( !oldValue.equals( newValue ) ) {
      getRemoteObject( display ).listen( EVENT_RESIZE, newValue.booleanValue() );
    }
  }

  private static void renderUICallBack() {
    new ServerPushRenderer().render();
  }

  private static void renderEnableUiTests( Display display ) {
    if( UITestUtil.isEnabled() ) {
      if( !getAdapter( display ).isInitialized() ) {
        RemoteObjectFactory.getRemoteObject( display ).set( "enableUiTests", true );
      }
    }
  }

  private static void runRenderRunnables( Display display ) {
    WidgetRemoteAdapter adapter = ( WidgetRemoteAdapter )getAdapter( display );
    for( Runnable runnable : adapter.getRenderRunnables() ) {
      runnable.run();
    }
    adapter.clearRenderRunnables();
  }

  private static void markInitialized( Display display ) {
    ( ( WidgetRemoteAdapter )getAdapter( display ) ).setInitialized( true );
  }

  //[ariddle] - added to support metrics gathering
  static void readMetrics( Display display ) {
//    boolean metricsEnabled = RWTRequestVersionControl.getInstance().isGenerateMetrics();
//    if (metricsEnabled) {
//      HttpServletRequest request = ContextProvider.getRequest();
//      String id = request.getSession().getId();
//      StringBuilder mesg = new StringBuilder();
//      String parseDuration = request.getParameter( "parseDuration" );
//      String processDuration = request.getParameter( "processDuration" );
//
//      String cursorLocationX = readPropertyValue( display, "cursorLocation.x" );
//      String cursorLocationY = readPropertyValue( display, "cursorLocation.y" );
//      if (cursorLocationX != null && cursorLocationY != null)
//        mesg.append("cursorLocation : ").append( cursorLocationX ).append( "," ).append( cursorLocationY ).append( "\n" );
//
//      String focusControl = readPropertyValue( display, "focusControl" );
//      if (focusControl != null)
//        mesg.append("focusControl : ").append( focusControl ).append( "\n" );
//
//      String mouseDown = request.getParameter( "org.eclipse.swt.events.mouseDown" );
//      String mouseDownBtn = request.getParameter( "org.eclipse.swt.events.mouseDown.button" );
//      if (mouseDown != null && mouseDownBtn != null)
//        mesg.append("mouseDown : ").append( mouseDown ).append(", button: ").append(mouseDownBtn).append( "\n" );
//      String mouseUp = request.getParameter( "org.eclipse.swt.events.mouseUp" );
//      String mouseUpBtn = request.getParameter( "org.eclipse.swt.events.mouseUp.button" );
//      if (mouseUp != null && mouseUpBtn != null)
//        mesg.append("mouseUp : ").append( mouseUp ).append(", button: ").append(mouseUpBtn).append( "\n" );
//
//      RWTMetricsCollector collector = RWTRequestVersionControl.getInstance().getMetricsCollector();
//      collector.mapDisplay(id,display);
//      String clientCapture = readPropertyValue( display, "clientCapture" );
//      if (clientCapture != null) {
//        collector.logClientCapture( id, clientCapture );
//      }
//      int requestCounter = NumberFormatUtil.parseInt( request.getParameter( PROP_REQUEST_COUNTER ) );
//      if (parseDuration != null) {
//        long parseTime = NumberFormatUtil.parseLong( parseDuration );
//        long processTime = NumberFormatUtil.parseLong( processDuration );
//        //if first metric then log agent info
//        if (parseTime == -1 && processTime == -1) {
//          StringBuilder sessionInfo = new StringBuilder();
//          Enumeration<String> headerNames = request.getHeaderNames();
//          while (headerNames.hasMoreElements()) {
//            String headerName = headerNames.nextElement();
//            sessionInfo.append(headerName).append( " : " ).append( request.getHeader( headerName ) ).append( "\n" );
//          }
//          collector.logConnectionInfo(id,sessionInfo.toString());
//        }
//
//        collector.logMetrics(id,requestCounter,parseTime,processTime,mesg.toString());
//      }
//      else {
//        collector.logMetrics(id,requestCounter,-1,-1,"Metrics gathering is enabled but there is nothing coming from the client.\n");
//      }
//    }
  }

  private static boolean hasResizeListener( Display display ) {
    return getDisplayAdapter( display ).isListening( SWT.Resize );
  }

  private static IDisplayAdapter getDisplayAdapter( Display display ) {
    return display.getAdapter( IDisplayAdapter.class );
  }

  private static Shell[] getShells( Display display ) {
    return getDisplayAdapter( display ).getShells();
  }

  private static final class RenderVisitor extends AllWidgetTreeVisitor {

    private IOException ioProblem;

    @Override
    public boolean doVisit( Widget widget ) {
      ioProblem = null;
      boolean result = true;
      try {
        render( widget );
        runRenderRunnables( widget );
      } catch( IOException ioe ) {
        ioProblem = ioe;
        result = false;
      }
      return result;
    }

    private void reThrowProblem() throws IOException {
      if( ioProblem != null ) {
        throw ioProblem;
      }
    }

    private static void render( Widget widget ) throws IOException {
      getLCA( widget ).render( widget );
    }

    private static void runRenderRunnables( Widget widget ) {
      WidgetRemoteAdapter adapter = ( WidgetRemoteAdapter )getAdapter( widget );
      for( Runnable runnable : adapter.getRenderRunnables() ) {
        runnable.run();
      }
      adapter.clearRenderRunnables();
    }
  }

}
