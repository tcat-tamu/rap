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
 *    Frank Appel - replaced singletons and static fields (Bug 337787)
 ******************************************************************************/
package org.eclipse.swt.widgets;

import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyZeroInteractions;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.ArrayList;
import java.util.concurrent.atomic.AtomicBoolean;

import junit.framework.TestCase;

import org.eclipse.rap.rwt.RWT;
import org.eclipse.rap.rwt.application.EntryPoint;
import org.eclipse.rap.rwt.graphics.Graphics;
import org.eclipse.rap.rwt.internal.application.RWTFactory;
import org.eclipse.rap.rwt.internal.lifecycle.DisplayLifeCycleAdapter;
import org.eclipse.rap.rwt.internal.lifecycle.DisplayUtil;
import org.eclipse.rap.rwt.internal.lifecycle.IUIThreadHolder;
import org.eclipse.rap.rwt.internal.lifecycle.LifeCycleUtil;
import org.eclipse.rap.rwt.internal.lifecycle.RWTLifeCycle;
import org.eclipse.rap.rwt.lifecycle.IWidgetAdapter;
import org.eclipse.rap.rwt.lifecycle.PhaseId;
import org.eclipse.rap.rwt.lifecycle.UICallBack;
import org.eclipse.rap.rwt.lifecycle.WidgetUtil;
import org.eclipse.rap.rwt.testfixture.Fixture;
import org.eclipse.rap.rwt.testfixture.internal.NoOpRunnable;
import org.eclipse.swt.SWT;
import org.eclipse.swt.SWTError;
import org.eclipse.swt.SWTException;
import org.eclipse.swt.custom.CTabFolder;
import org.eclipse.swt.custom.CTabItem;
import org.eclipse.swt.events.DisposeEvent;
import org.eclipse.swt.events.DisposeListener;
import org.eclipse.swt.graphics.Color;
import org.eclipse.swt.graphics.Cursor;
import org.eclipse.swt.graphics.Device;
import org.eclipse.swt.graphics.Font;
import org.eclipse.swt.graphics.FontData;
import org.eclipse.swt.graphics.Image;
import org.eclipse.swt.graphics.Point;
import org.eclipse.swt.graphics.RGB;
import org.eclipse.swt.graphics.Rectangle;
import org.eclipse.swt.internal.widgets.IDisplayAdapter;
import org.eclipse.swt.layout.FillLayout;
import org.mockito.ArgumentCaptor;


public class Display_Test extends TestCase {

  @Override
  protected void setUp() throws Exception {
    Fixture.setUp();
    Fixture.fakePhase( PhaseId.PROCESS_ACTION );
  }

  @Override
  protected void tearDown() throws Exception {
    Fixture.tearDown();
  }

  public void testGetAdapterWithDisplayAdapter() {
    Display display = new Display();
    Object adapter = display.getAdapter( IDisplayAdapter.class );
    assertTrue( adapter instanceof IDisplayAdapter );
  }

  public void testGetAdapterWithWidgetAdapter() {
    Display display = new Display();
    Object adapter = display.getAdapter( IWidgetAdapter.class );
    assertTrue( adapter instanceof IWidgetAdapter );
  }

  public void testGetAdapterWithLifeCycleAdapter() {
    Display display = new Display();
    Object adapter = display.getAdapter( DisplayLifeCycleAdapter.class );
    assertTrue( adapter instanceof DisplayLifeCycleAdapter );
  }

  public void testSingleDisplayPerSession() {
    Device display = new Display();
    assertEquals( Display.getCurrent(), display );
    try {
      new Display();
      fail( "Only one display allowed per session" );
    } catch( SWTError e ) {
      // expected
    }
    display.dispose();
    Device secondDisplay = new Display();
    assertEquals( Display.getCurrent(), secondDisplay );
  }

  public void testGetCurrent() throws Throwable {
    assertNull( Display.getCurrent() );
    final Display display = new Display();
    assertSame( display, Display.getCurrent() );
    // init with something non-null
    final Display[] displayFromBgThread = { display };
    final Display[] displayFromBgThreadWithFakeContext = { display };
    Runnable runnable = new Runnable() {
      public void run() {
        displayFromBgThread[ 0 ] = Display.getCurrent();
        UICallBack.runNonUIThreadWithFakeContext( display, new Runnable() {
          public void run() {
            displayFromBgThreadWithFakeContext[ 0 ] = Display.getCurrent();
          }
        } );
      }
    };

    Fixture.runInThread( runnable );

    assertNull( displayFromBgThread[ 0 ] );
    assertNull( displayFromBgThreadWithFakeContext[ 0 ] );
  }

  public void testGetDefaultFromUIThread() {
    IUIThreadHolder uiThreadHolder = mock( IUIThreadHolder.class );
    when( uiThreadHolder.getThread() ).thenReturn( Thread.currentThread() );
    LifeCycleUtil.setUIThread( RWT.getUISession(), uiThreadHolder );

    Display display = Display.getDefault();

    assertNotNull( display );
    assertSame( display, Display.getDefault() );
  }

  public void testGetDefaultWithTerminatedUIThread() {
    IUIThreadHolder uiThreadHolder = mock( IUIThreadHolder.class );
    when( uiThreadHolder.getThread() ).thenReturn( Thread.currentThread() );
    LifeCycleUtil.setUIThread( RWT.getUISession(), uiThreadHolder );

    Display display = Display.getDefault();

    assertNotNull( display );
  }

  public void testGetDefaultWithExistingDisplayFromUIThread() {
    Display display = new Display();
    assertSame( display, Display.getDefault() );
  }

  public void testGetDefaultFromBackgroundThreadWithoutContext() throws Throwable {
    final Display[] backgroundDisplay = { null };
    new Display();
    Runnable runnable = new Runnable() {
      public void run() {
        backgroundDisplay[ 0 ] = Display.getDefault();
      }
    };

    Fixture.runInThread( runnable );

    assertNull( backgroundDisplay[ 0 ] );
  }

  public void testGetDefaultFromBackgroundThreadDoesNotCreateDisplay() throws Throwable {
    final Display[] backgroundDisplay = { null };
    Runnable runnable = new Runnable() {
      public void run() {
        backgroundDisplay[ 0 ] = Display.getDefault();
      }
    };

    Fixture.runInThread( runnable );

    assertNull( backgroundDisplay[ 0 ] ) ;
  }

  public void testGetDefaultFromBackgroundThreadWithContext() throws Throwable {
    final Display[] backgroundDisplay = { null };
    final Display display = new Display();
    Runnable runnable = new Runnable() {
      public void run() {
        UICallBack.runNonUIThreadWithFakeContext( display, new Runnable() {
          public void run() {
            backgroundDisplay[ 0 ] = Display.getDefault();
          }
        } );
      }
    };

    Fixture.runInThread( runnable );

    assertSame( display, backgroundDisplay[ 0 ] );
  }

  public void testGetDefaultWithDisposedDisplay() {
    IUIThreadHolder uiThreadHolder = mock( IUIThreadHolder.class );
    when( uiThreadHolder.getThread() ).thenReturn( Thread.currentThread() );
    LifeCycleUtil.setUIThread( RWT.getUISession(), uiThreadHolder );
    Display display = new Display();
    display.dispose();

    Display newDisplay = Display.getDefault();
    assertNotNull( newDisplay );
    assertNotSame( display, newDisplay );
  }

  public void testGetThreadFromUIThread() {
    Display display = new Display();

    Thread thread = display.getThread();

    assertSame( Thread.currentThread(), thread );
    display.dispose();
  }

  public void testGetThreadFromBackgroundThreadWithoutContext() throws Throwable {
    final Display display = new Display();
    final Thread[] thread = { null };
    Runnable runnable = new Runnable() {
      public void run() {
        thread[ 0 ] = display.getThread();
      }
    };

    Fixture.runInThread( runnable );

    assertSame( Thread.currentThread(), thread[ 0 ] );
  }

  public void testGetSessionDisplay() {
    Display display = new Display();
    assertSame( display, LifeCycleUtil.getSessionDisplay() );
  }

  public void testAttachAndDetachThread() {
    Display display = new Display();
    IDisplayAdapter adapter = display.getAdapter( IDisplayAdapter.class );
    adapter.detachThread();
    assertNull( display.getThread() );
    adapter.attachThread();
    assertSame( Thread.currentThread(), display.getThread() );
  }

  public void testGetShells() {
    Display display = new Display();
    assertEquals( 0, display.getShells().length );
    Composite shell1 = new Shell( display , SWT.NONE );
    assertSame( shell1, display.getShells()[ 0 ] );
    Composite shell2 = new Shell( display , SWT.NONE );
    Composite[] shells = display.getShells();
    assertTrue( shell2 == shells[ 0 ] || shell2 == display.getShells()[ 1 ] );
  }

  public void testProperties() {
    Display display = new Display();
    assertEquals( 0, display.getShells().length );
    Rectangle bounds = display.getBounds();
    assertNotNull( bounds );
    bounds.x += 1;
    assertTrue( bounds.x != display.getBounds().x );
  }

  public void testBounds() {
    Display display = new Display();
    Object adapter = display.getAdapter( IDisplayAdapter.class );
    IDisplayAdapter displayAdapter = ( IDisplayAdapter )adapter;
    Rectangle expectedBounds = new Rectangle( 0, 10, 60, 99 );
    displayAdapter.setBounds( expectedBounds );
    Rectangle bounds = display.getBounds();
    assertEquals( expectedBounds, bounds );
    assertNotSame( expectedBounds, bounds );
  }

  public void testClientArea() {
    Display display = new Display();
    Object adapter = display.getAdapter( IDisplayAdapter.class );
    IDisplayAdapter displayAdapter = ( IDisplayAdapter )adapter;
    Rectangle testRect = new Rectangle( 1, 2, 3, 4 );
    displayAdapter.setBounds( testRect );
    Rectangle clientArea = display.getClientArea();
    assertEquals( testRect, clientArea );
    assertNotSame( testRect, clientArea );
  }

  public void testMap() {
    Display display = new Display();
    Shell shell = new Shell( display, SWT.NONE );
    Rectangle shellBounds = new Rectangle( 10, 10, 400, 400 );
    int shellBorder = shell.getBorderWidth();
    shell.setBounds( shellBounds );

    Rectangle actual = display.map( shell, shell, 1, 2, 3, 4 );
    Rectangle expected = new Rectangle( 1, 2, 3, 4 );
    assertEquals( expected, actual );

    actual = display.map( shell, null, 5, 6, 7, 8 );
    expected = new Rectangle( shellBounds.x + shellBorder + 5,
                              shellBounds.y + shellBorder + 6,
                              7,
                              8 );
    assertEquals( expected, actual );

    shell.setLayout( new FillLayout() );
    TabFolder folder = new TabFolder( shell, SWT.BORDER );
    int folderBorder = folder.getBorderWidth();
    shell.layout();
    actual = display.map( folder, shell, 6, 7, 8, 9 );
    expected = new Rectangle( folder.getBounds().x + folderBorder + 6,
                              folder.getBounds().y + folderBorder + 7,
                              8,
                              9 );
    assertEquals( expected, actual );

    int borders = shellBorder + folderBorder;
    actual = display.map( null, folder, 1, 2, 3, 4 );
    expected = new Rectangle( 1 - shell.getBounds().x - borders,
                              2 - shell.getBounds().y - borders,
                              3,
                              4 );
    assertEquals( expected, actual );
  }

  public void testMapWithChildShell() {
    Display display = new Display();
    Shell shell = new Shell( display, SWT.NONE );
    shell.setBounds( 100, 100, 800, 600 );
    Shell childShell1 = new Shell( shell, SWT.NONE );
    childShell1.setBounds( 200, 200, 800, 600 );
    int childShell1Border = childShell1.getBorderWidth();
    Point expected = new Point( 200 + childShell1Border,
                                200 + childShell1Border );
    Point actual = display.map( childShell1, null, 0, 0 );
    assertEquals( expected, actual );
    expected = new Point( 100, 100 );
    actual = display.map( childShell1, shell, 0, 0 );
    assertEquals( expected, actual );

    Shell childShell2 = new Shell( shell, SWT.NONE );
    childShell2.setBounds( 200, 200, 800, 600 );
    expected = new Point( 14, 17 );
    actual = display.map( childShell1, childShell2, 14, 17 );
    assertEquals( expected, actual );
  }

  public void testMapWithDifferentBorders() {
    Display display = new Display();
    Shell shell = new Shell( display, SWT.NONE );
    shell.setBounds( 100, 100, 800, 600 );
    Composite comp1 = new Composite( shell, SWT.BORDER );
    comp1.setBounds( 0, 0, 20, 20 );
    int comp1Offset = comp1.getBorderWidth();
    // Test with scrollable
    Composite comp2 = new Composite( shell, SWT.NONE );
    comp2.setBounds( 10, 10, 20, 20 );
    int comp2Offset = comp2.getBorderWidth();
    Rectangle actual = display.map( comp2, comp1, 1, 2, 3, 4 );
    Rectangle expected = new Rectangle( 1 + 10 + comp2Offset - comp1Offset,
                                        2 + 10 + comp2Offset - comp1Offset,
                                        3,
                                        4 );
    assertEquals( expected, actual );
    // Test with control
    Button button = new Button( shell, SWT.NONE );
    button.setBounds( 10, 10, 20, 20 );
    actual = display.map( button, comp1, 1, 2, 3, 4 );
    expected = new Rectangle( 1 + 10 - comp1Offset,
                              2 + 10 - comp1Offset,
                              3,
                              4 );
    assertEquals( expected, actual );
    // Test with CTabFolder
    CTabFolder folder = new CTabFolder( shell, SWT.CLOSE );
    CTabItem item = new CTabItem( folder, SWT.NONE );
    item.setText( "Item" );
    folder.setBounds( 10, 10, 100, 100 );
    actual = display.map( folder, comp1, 1, 2, 3, 4 );
    expected = new Rectangle( 1 + 10 - comp1Offset,
                              2 + 10 - comp1Offset,
                              3,
                              4 );
    assertEquals( expected, actual );
  }

  ////////////////////////////
  // SWT Tests for Display#map

  /*
   * Verbatim copy from SWT Test_org_eclipse_swt_widgets_Display
   */
  public void test_mapLorg_eclipse_swt_widgets_ControlLorg_eclipse_swt_widgets_ControlII() {
    Display display = new Display();
    try {
      Shell shell = new Shell(display, SWT.NO_TRIM);
      Button button1 = new Button(shell, SWT.PUSH);
      button1.setBounds(0,0,100,100);
      Button button2 = new Button(shell, SWT.PUSH);
      button2.setBounds(200,100,100,100);
      shell.setBounds(0,0,400,400);
      shell.open();

      Point shellOffset = shell.getLocation();
      Point result;

      result = display.map(button1, button2, 0, 0);
      assertEquals(new Point(-200,-100), result);
      result = display.map(button1, button2, -10, -20);
      assertEquals(new Point(-210,-120), result);
      result = display.map(button1, button2, 30, 40);
      assertEquals(new Point(-170,-60), result);

      result = display.map(button2, button1, 0, 0);
      assertEquals(new Point(200,100), result);
      result = display.map(button2, button1, -5, -15);
      assertEquals(new Point(195,85), result);
      result = display.map(button2, button1, 25, 35);
      assertEquals(new Point(225,135), result);

      result = display.map(null, button2, 0, 0);
      assertEquals(new Point(-200 - shellOffset.x,-100 - shellOffset.y), result);
      result = display.map(null, button2, -2, -4);
      assertEquals(new Point(-202 - shellOffset.x,-104 - shellOffset.y), result);
      result = display.map(null, button2, 6, 8);
      assertEquals(new Point(-194 - shellOffset.x,-92 - shellOffset.y), result);

      result = display.map(button2, null, 0, 0);
      assertEquals(new Point(shellOffset.x + 200,shellOffset.y + 100), result);
      result = display.map(button2, null, -3, -6);
      assertEquals(new Point(shellOffset.x + 197,shellOffset.y + 94), result);
      result = display.map(button2, null, 9, 12);
      assertEquals(new Point(shellOffset.x + 209,shellOffset.y + 112), result);

//      button1.dispose();
//      try {
//        result = display.map(button1, button2, 0, 0);
//        fail("No exception thrown for map from control being disposed");
//      } catch (IllegalArgumentException e) {
//        assertEquals("Incorrect exception thrown for map from control being disposed", SWT.ERROR_INVALID_ARGUMENT, e);
//      }
//      try {
//        result = display.map(button2, button1, 0, 0);
//        fail("No exception thrown for map to control being disposed");
//      } catch (IllegalArgumentException e) {
//        assertEquals("Incorrect exception thrown for map to control being disposed", SWT.ERROR_INVALID_ARGUMENT, e);
//      }

      shell.dispose();
    } finally {
      display.dispose();
    }
  }

  /*
   * Verbatim copy from SWT Test_org_eclipse_swt_widgets_Display
   */
  public void test_mapLorg_eclipse_swt_widgets_ControlLorg_eclipse_swt_widgets_ControlIIII() {
    Display display = new Display();
    try {
      Shell shell = new Shell(display, SWT.NO_TRIM);
      Button button1 = new Button(shell, SWT.PUSH);
      button1.setBounds(0,0,100,100);
      Button button2 = new Button(shell, SWT.PUSH);
      button2.setBounds(200,100,100,100);
      shell.setBounds(0,0,400,400);
      shell.open();

      Point shellOffset = shell.getLocation();
      Rectangle result;

      result = display.map(button1, button2, 0, 0, 100, 100);
      assertEquals(new Rectangle(-200,-100,100,100), result);
      result = display.map(button1, button2, -10, -20, 130, 140);
      assertEquals(new Rectangle(-210,-120,130,140), result);
      result = display.map(button1, button2, 50, 60, 170, 180);
      assertEquals(new Rectangle(-150,-40,170,180), result);

      result = display.map(button2, button1, 0, 0, 100, 100);
      assertEquals(new Rectangle(200,100,100,100), result);
      result = display.map(button2, button1, -5, -15, 125, 135);
      assertEquals(new Rectangle(195,85,125,135), result);
      result = display.map(button2, button1, 45, 55, 165, 175);
      assertEquals(new Rectangle(245,155,165,175), result);

      result = display.map(null, button2, 0, 0, 100, 100);
      assertEquals(new Rectangle(-200 - shellOffset.x,-100 - shellOffset.y,100,100), result);
      result = display.map(null, button2, -2, -4, 106, 108);
      assertEquals(new Rectangle(-202 - shellOffset.x,-104 - shellOffset.y,106,108), result);
      result = display.map(null, button2, 10, 12, 114, 116);
      assertEquals(new Rectangle(-190 - shellOffset.x,-88 - shellOffset.y,114,116), result);

      result = display.map(button2, null, 0, 0, 100, 100);
      assertEquals(new Rectangle(shellOffset.x + 200,shellOffset.y + 100,100,100), result);
      result = display.map(button2, null, -3, -6, 109, 112);
      assertEquals(new Rectangle(shellOffset.x + 197,shellOffset.y + 94,109,112), result);
      result = display.map(button2, null, 15, 18, 121, 124);
      assertEquals(new Rectangle(shellOffset.x + 215,shellOffset.y + 118,121,124), result);

//      button1.dispose();
//      try {
//        result = display.map(button1, button2, 0, 0, 100, 100);
//        fail("No exception thrown for map from control being disposed");
//      } catch (IllegalArgumentException e) {
//        assertEquals("Incorrect exception thrown for map from control being disposed", SWT.ERROR_INVALID_ARGUMENT, e);
//      }
//      try {
//        result = display.map(button2, button1, 0, 0, 100, 100);
//        fail("No exception thrown for map to control being disposed");
//      } catch (IllegalArgumentException e) {
//        assertEquals("Incorrect exception thrown for map to control being disposed", SWT.ERROR_INVALID_ARGUMENT, e);
//      }

      shell.dispose();
    } finally {
      display.dispose();
    }
  }

  /*
   * Verbatim copy from SWT Test_org_eclipse_swt_widgets_Display
   */
  public void test_mapLorg_eclipse_swt_widgets_ControlLorg_eclipse_swt_widgets_ControlLorg_eclipse_swt_graphics_Point() {
    Display display = new Display();
    try {
      Shell shell = new Shell(display, SWT.NO_TRIM);
      Button button1 = new Button(shell, SWT.PUSH);
      button1.setBounds(0,0,100,100);
      Button button2 = new Button(shell, SWT.PUSH);
      button2.setBounds(200,100,100,100);
      shell.setBounds(0,0,400,400);
      shell.open();

      Point result;
      Point point = new Point(0,0);
      Point shellOffset = shell.getLocation();

      result = display.map(button1, button2, point);
      assertEquals(new Point(-200,-100), result);
      result = display.map(button1, button2, new Point(-10,-20));
      assertEquals(new Point(-210,-120), result);
      result = display.map(button1, button2, new Point(30,40));
      assertEquals(new Point(-170,-60), result);

      result = display.map(button2, button1, point);
      assertEquals(new Point(200,100), result);
      result = display.map(button2, button1, new Point(-5,-15));
      assertEquals(new Point(195,85), result);
      result = display.map(button2, button1, new Point(25,35));
      assertEquals(new Point(225,135), result);

      result = display.map(null, button2, point);
      assertEquals(new Point(-200 - shellOffset.x,-100 - shellOffset.y), result);
      result = display.map(null, button2, new Point(-2,-4));
      assertEquals(new Point(-202 - shellOffset.x,-104 - shellOffset.y), result);
      result = display.map(null, button2, new Point(6,8));
      assertEquals(new Point(-194 - shellOffset.x,-92 - shellOffset.y), result);

      result = display.map(button2, null, point);
      assertEquals(new Point(shellOffset.x + 200,shellOffset.y + 100), result);
      result = display.map(button2, null, new Point(-3,-6));
      assertEquals(new Point(shellOffset.x + 197,shellOffset.y + 94), result);
      result = display.map(button2, null, new Point(9,12));
      assertEquals(new Point(shellOffset.x + 209,shellOffset.y + 112), result);

//      button1.dispose();
//      try {
//        result = display.map(button1, button2, point);
//        fail("No exception thrown for map from control being disposed");
//      } catch (IllegalArgumentException e) {
//        assertEquals("Incorrect exception thrown for map from control being disposed", SWT.ERROR_INVALID_ARGUMENT, e);
//      }
//      try {
//        result = display.map(button2, button1, point);
//        fail("No exception thrown for map to control being disposed");
//      } catch (IllegalArgumentException e) {
//        assertEquals("Incorrect exception thrown for map to control being disposed", SWT.ERROR_INVALID_ARGUMENT, e);
//      }
//
//      try {
//        result = display.map(button2, button1, (Point) null);
//        fail("No exception thrown for null point");
//      } catch (IllegalArgumentException e) {
//        assertEquals("Incorrect exception thrown for point being null", SWT.ERROR_NULL_ARGUMENT, e);
//      }

      shell.dispose();
    } finally {
      display.dispose();
    }
  }

  /*
   * Verbatim copy from SWT Test_org_eclipse_swt_widgets_Display
   */
  public void test_mapLorg_eclipse_swt_widgets_ControlLorg_eclipse_swt_widgets_ControlLorg_eclipse_swt_graphics_Rectangle() {
    Display display = new Display();
    try {
      Shell shell = new Shell(display, SWT.NO_TRIM);
      Button button1 = new Button(shell, SWT.PUSH);
      button1.setBounds(0,0,100,100);
      Button button2 = new Button(shell, SWT.PUSH);
      button2.setBounds(200,100,100,100);
      shell.setBounds(0,0,400,400);
      shell.open();

      Rectangle result;
      Rectangle rect = new Rectangle(0,0,100,100);
      Point shellOffset = shell.getLocation();

      result = display.map(button1, button2, rect);
      assertEquals(new Rectangle(-200,-100,100,100), result);
      result = display.map(button1, button2, new Rectangle(-10, -20, 130, 140));
      assertEquals(new Rectangle(-210,-120,130,140), result);
      result = display.map(button1, button2, new Rectangle(50, 60, 170, 180));
      assertEquals(new Rectangle(-150,-40,170,180), result);

      result = display.map(button2, button1, rect);
      assertEquals(new Rectangle(200,100,100,100), result);
      result = display.map(button2, button1, new Rectangle(-5, -15, 125, 135));
      assertEquals(new Rectangle(195,85,125,135), result);
      result = display.map(button2, button1, new Rectangle(45, 55, 165, 175));
      assertEquals(new Rectangle(245,155,165,175), result);

      result = display.map(null, button2, rect);
      assertEquals(new Rectangle(-200 - shellOffset.x,-100 - shellOffset.y,100,100), result);
      result = display.map(null, button2, new Rectangle(-2, -4, 106, 108));
      assertEquals(new Rectangle(-202 - shellOffset.x,-104 - shellOffset.y,106,108), result);
      result = display.map(null, button2, new Rectangle(10, 12, 114, 116));
      assertEquals(new Rectangle(-190 - shellOffset.x,-88 - shellOffset.y,114,116), result);

      result = display.map(button2, null, rect);
      assertEquals(new Rectangle(shellOffset.x + 200,shellOffset.y + 100,100,100), result);
      result = display.map(button2, null, new Rectangle(-3, -6, 109, 112));
      assertEquals(new Rectangle(shellOffset.x + 197,shellOffset.y + 94,109,112), result);
      result = display.map(button2, null, new Rectangle(15, 18, 121, 124));
      assertEquals(new Rectangle(shellOffset.x + 215,shellOffset.y + 118,121,124), result);


//      button1.dispose();
//      try {
//        result = display.map(button1, button2, rect);
//        fail("No exception thrown for map from control being disposed");
//      } catch (IllegalArgumentException e) {
//        assertEquals("Incorrect exception thrown for map from control being disposed", SWT.ERROR_INVALID_ARGUMENT, e);
//      }
//      try {
//        result = display.map(button2, button1, rect);
//        fail("No exception thrown for map to control being disposed");
//      } catch (IllegalArgumentException e) {
//        assertEquals("Incorrect exception thrown for map to control being disposed", SWT.ERROR_INVALID_ARGUMENT, e);
//      }
//
//      try {
//        result = display.map(button2, button1, (Rectangle) null);
//        fail("No exception thrown for null point");
//      } catch (IllegalArgumentException e) {
//        assertEquals("Incorrect exception thrown for rectangle being null", SWT.ERROR_NULL_ARGUMENT, e);
//      }

      shell.dispose();
    } finally {
      display.dispose();
    }
  }

  public void testActiveShell() {
    Display display = new Display();
    assertNull( display.getActiveShell() );
    Shell shell1 = new Shell( display, SWT.NONE );
    assertNull( display.getActiveShell() );
    shell1.open();
    assertSame( shell1, display.getActiveShell() );
    Shell shell2 = new Shell( display, SWT.NONE );
    shell2.open();
    assertSame( shell2, display.getActiveShell() );
    shell2.dispose();
    assertSame( shell1, display.getActiveShell() );

    // Test disposing of inactive shell
    Shell inactiveShell = new Shell( display, SWT.NONE );
    Shell activeShell = new Shell( display, SWT.NONE );
    inactiveShell.open();
    activeShell.open();
    assertSame( activeShell, display.getActiveShell() );
    inactiveShell.dispose();
    assertSame( activeShell, display.getActiveShell() );

    // Test explicitly setting the active shell
    Shell shell3 = new Shell( display, SWT.NONE );
    Shell shell4 = new Shell( display, SWT.NONE );
    shell3.open();
    shell4.open();
    assertSame( shell4, display.getActiveShell() );
    shell3.setActive();
    assertSame( shell3, display.getActiveShell() );
  }

  public void testSystemFont() {
    Device display = new Display();
    Font systemFont = display.getSystemFont();
    assertNotNull( systemFont );
  }

  public void testFontList() {
    Display display = new Display();
    FontData[] fontList = display.getFontList( null, false );
    assertEquals( 0, fontList.length );
    fontList = display.getFontList( null, true );
    assertTrue( fontList.length > 0 );
    String firstFontName = fontList[ 0 ].getName();
    fontList = display.getFontList( firstFontName, true );
    assertEquals( 1, fontList.length );
    fontList = display.getFontList( "not existing font", true );
    assertEquals( 0, fontList.length );
  }

  public void testSystemImageSizes() {
    Display display = new Display();
    Rectangle expected = new Rectangle( 0, 0, 32, 32 );
    Image errorImage = display.getSystemImage( SWT.ICON_ERROR );
    assertEquals( expected, errorImage.getBounds() );
    Image infoImage = display.getSystemImage( SWT.ICON_INFORMATION );
    assertEquals( expected, infoImage.getBounds() );
    Image questionImage = display.getSystemImage( SWT.ICON_QUESTION );
    assertEquals( expected, questionImage.getBounds() );
    Image warningImage = display.getSystemImage( SWT.ICON_WARNING );
    assertEquals( expected, warningImage.getBounds() );
    Image workImage = display.getSystemImage( SWT.ICON_WORKING );
    assertEquals( expected, workImage.getBounds() );
  }

  public void testInvalidSystemImage() {
    Display display = new Display();
    assertNull( display.getSystemImage( SWT.VERTICAL ) );
  }

  public void testSystemImagesAreShared() {
    Display display = new Display();
    Image errorImage = display.getSystemImage( SWT.ICON_ERROR );
    assertSame( errorImage, display.getSystemImage( SWT.ICON_ERROR ) );
    Image infoImage = display.getSystemImage( SWT.ICON_INFORMATION );
    assertSame( infoImage, display.getSystemImage( SWT.ICON_INFORMATION ) );
    assertNotSame( errorImage, infoImage );
    Image workImage = display.getSystemImage( SWT.ICON_WORKING );
    // same icon is used in default theme
    assertSame( infoImage, workImage );
  }

  public void testSystemColor() {
    Display display = new Display();
    Color color;
    // Theme colors
    color = display.getSystemColor( SWT.COLOR_WIDGET_NORMAL_SHADOW );
    assertEquals( new RGB( 167, 166, 170 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_WIDGET_DARK_SHADOW );
    assertEquals( new RGB( 133, 135, 140 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_WIDGET_LIGHT_SHADOW );
    assertEquals( new RGB( 220, 223, 228 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_WIDGET_HIGHLIGHT_SHADOW );
    assertEquals( new RGB( 255, 255, 255 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_WIDGET_BORDER );
    assertEquals( new RGB( 172, 168, 153 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_WIDGET_FOREGROUND );
    assertEquals( new RGB( 74, 74, 74 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_WIDGET_BACKGROUND );
    assertEquals( new RGB( 255, 255, 255 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_INFO_BACKGROUND );
    assertEquals( new RGB( 255, 255, 255 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_INFO_FOREGROUND );
    assertEquals( new RGB( 74, 74, 74 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_LIST_BACKGROUND );
    assertEquals( new RGB( 255, 255, 255 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_LIST_FOREGROUND );
    assertEquals( new RGB( 74, 74, 74 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_LIST_SELECTION );
    assertEquals( new RGB( 0, 88, 159 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_LIST_SELECTION_TEXT );
    assertEquals( new RGB( 255, 255, 255 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_TITLE_BACKGROUND );
    assertEquals( new RGB( 0, 128, 192 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_TITLE_BACKGROUND_GRADIENT );
    assertEquals( new RGB( 0, 128, 192 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_TITLE_FOREGROUND );
    assertEquals( new RGB( 255, 255, 255 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_TITLE_INACTIVE_BACKGROUND );
    assertEquals( new RGB( 121, 150, 165 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_TITLE_INACTIVE_BACKGROUND_GRADIENT );
    assertEquals( new RGB( 121, 150, 165 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_TITLE_INACTIVE_FOREGROUND );
    assertEquals( new RGB( 255, 255, 255 ), color.getRGB() );
    // Fix colors
    color = display.getSystemColor( SWT.COLOR_BLACK );
    assertEquals( new RGB( 0, 0, 0 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_BLUE );
    assertEquals( new RGB( 0, 0, 255 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_CYAN );
    assertEquals( new RGB( 0, 255, 255 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_DARK_BLUE );
    assertEquals( new RGB( 0, 0, 128 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_DARK_CYAN );
    assertEquals( new RGB( 0, 128, 128 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_DARK_GRAY );
    assertEquals( new RGB( 128, 128, 128 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_DARK_GREEN );
    assertEquals( new RGB( 0, 128, 0 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_DARK_MAGENTA );
    assertEquals( new RGB( 128, 0, 128 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_DARK_RED );
    assertEquals( new RGB( 128, 0, 0 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_DARK_YELLOW );
    assertEquals( new RGB( 128, 128, 0 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_GRAY );
    assertEquals( new RGB( 192, 192, 192 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_GREEN );
    assertEquals( new RGB( 0, 255, 0 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_MAGENTA );
    assertEquals( new RGB( 255, 0, 255 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_RED );
    assertEquals( new RGB( 255, 0, 0 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_WHITE );
    assertEquals( new RGB( 255, 255, 255 ), color.getRGB() );
    color = display.getSystemColor( SWT.COLOR_YELLOW );
    assertEquals( new RGB( 255, 255, 0 ), color.getRGB() );
    // Only one instance per color
    Color systemRed = display.getSystemColor( SWT.COLOR_RED );
    Color red = Graphics.getColor( 255, 0, 0 );
    assertEquals( red, systemRed );
    assertSame( red, systemRed );
    assertSame( systemRed, display.getSystemColor( SWT.COLOR_RED ) );
  }

  public void testAddFilterWithNullArgument() {
    Display display = new Display();
    try {
      display.addFilter( SWT.Dispose, null );
      fail();
    } catch( IllegalArgumentException expected ) {
    }
  }

  public void testAddAndRemoveFilter() {
    Display display = new Display();
    final int CLOSE_CALLBACK = 0;
    final int DISPOSE_CALLBACK = 1;
    final boolean[] callbackReceived = new boolean[]{ false, false };
    Listener listener = new Listener() {
      public void handleEvent( Event e ) {
        if( e.type == SWT.Close ) {
          callbackReceived[ CLOSE_CALLBACK ] = true;
        } else if( e.type == SWT.Dispose ) {
          callbackReceived[ DISPOSE_CALLBACK ] = true;
        }
      }
    };
    display.addFilter( SWT.Close, listener );
    Shell shell = new Shell( display );
    shell.close();
    assertTrue( callbackReceived[ CLOSE_CALLBACK ] );
    assertFalse( callbackReceived[ DISPOSE_CALLBACK ] );
    // removeFilter
    callbackReceived[ CLOSE_CALLBACK ] = false;
    callbackReceived[ DISPOSE_CALLBACK ] = false;
    display.removeFilter( SWT.Close, listener );
    shell = new Shell( display );
    shell.close();
    assertFalse( callbackReceived[ CLOSE_CALLBACK ] );
    assertFalse( callbackReceived[ DISPOSE_CALLBACK ] );
    // remove filter for an event that was not added before -> do nothing
    display.removeFilter( SWT.FocusIn, listener );
  }

  public void testRemoveFilterWithNullArgument() {
    Display display = new Display();

    try {
      display .removeFilter( SWT.Dispose, null );
      fail();
    } catch( IllegalArgumentException expected ) {
    }

  }

  public void testEnsureIdIsW1() throws IOException {
    Class<EnsureIdEntryPoint> entryPointClass = EnsureIdEntryPoint.class;
    RWTFactory.getEntryPointManager().register( "/rap", entryPointClass, null );
    Fixture.fakeNewRequest();
    RWTLifeCycle lifeCycle = ( RWTLifeCycle )RWTFactory.getLifeCycleFactory().getLifeCycle();
    lifeCycle.execute();
    assertEquals( "w1", DisplayUtil.getId( LifeCycleUtil.getSessionDisplay() ) );
    RWTFactory.getEntryPointManager().deregisterAll();
  }

  public void testSetData() {
    Display display = new Display();
    display.setData( new Integer( 10 ) );
    Integer i = ( Integer )display.getData();
    assertNotNull( i );
    assertTrue( i.equals( new Integer( 10 ) ) );
  }

  public void testSetDataKey() {
    Display display = new Display();
    display.setData( "Integer", new Integer( 10 ) );
    display.setData( "String", "xyz" );
    Integer i = ( Integer )display.getData( "Integer" );
    assertNotNull( i );
    assertTrue( i.equals( new Integer( 10 ) ) );
    String s = ( String )display.getData( "String" );
    assertNotNull( s );
    assertTrue( s.equals( "xyz" ) );
    display.setData( "Integer", null );
    Object result = display.getData( "Integer" );
    assertNull( result );
    try {
      display.setData( null, "no" );
      fail( "should throw IllegalArgumentException ");
    } catch ( IllegalArgumentException e ) {
      // expected
    }
    try {
      display.getData( null );
      fail( "should throw IllegalArgumentException ");
    } catch ( IllegalArgumentException e ) {
      // expected
    }
  }

  public void testTimerExecWithNullArgument() {
    // Ensure that parameters are checked properly
    final Display display = new Display();
    try {
      display.timerExec( 0, null );
      fail( "timerExec must throw exception when null-runnable is passed in " );
    } catch( Exception expected ) {
    }
    // Further timerExec tests can be found in UICallbackManager_Test
  }

  public void testTimerExecFromBackgroundThread() throws Throwable {
    final Display display = new Display();
    // Ensure that invoking from background thread throws InvalidThreadAccess
    Runnable runnable = new Runnable() {
      public void run() {
        display.timerExec( 1, new NoOpRunnable() );
      }
    };

    try {
      Fixture.runInThread( runnable );
      fail();
    } catch( SWTException expected ) {
      assertEquals( SWT.ERROR_THREAD_INVALID_ACCESS, expected.code );
    }
  }

  public void testRemoveNonExistingTimerExec() {
    Display display = new Display();
    display.timerExec( -1, new NoOpRunnable() );
    // must not cause any exception
  }

  public void testGetMonitors() {
    final Display display = new Display();
    Monitor[] monitors = display.getMonitors();
    assertNotNull( monitors );
    assertEquals( 1, monitors.length );
    Monitor monitor = monitors[ 0 ];
    assertNotNull( monitor );
    // Further monitor tests can be found in Monitor_Test
  }

  public void testGetPrimaryMonitor() {
    final Display display = new Display();
    Monitor monitor = display.getPrimaryMonitor();
    assertNotNull( monitor );
    // Further monitor tests can be found in Monitor_Test
  }

  public void testDisposeExecWithNullArgument() {
    Display display = new Display();
    display.disposeExec( null );
    display.dispose();
    assertTrue( display.isDisposed() );
  }

  public void testDispose() {
    Display display = new Display();
    assertFalse( display.isDisposed() );
    display.dispose();
    assertTrue( display.isDisposed() );
    assertNull( Display.getCurrent() );
    // Ensure that calling dispose() on a disposed of Display is allowed
    display.dispose();
    assertTrue( display.isDisposed() );
  }

  public void testDisposeNotificationsOrder() {
    // 1. display dispose listener
    // 2. shell dispose listeners
    // 3. disposeRunnable(s)
    final java.util.List<Object> log = new ArrayList<Object>();
    Display display = new Display();
    Shell shell = new Shell( display );
    shell.addDisposeListener( new DisposeListener() {
      public void widgetDisposed( DisposeEvent event ) {
        log.add( event );
      }
    } );
    display.addListener( SWT.Dispose, new Listener() {
      public void handleEvent( Event event ) {
        log.add( event );
      }
    } );
    display.disposeExec( new Runnable() {
      public void run() {
        log.add( "disposeRunnable" );
      }
    } );
    display.dispose();
    assertEquals( 3, log.size() );
    Event displayDisposeEvent = ( Event )log.get( 0 );
    assertSame( display, displayDisposeEvent.display );
    DisposeEvent shellDisposeEvent = ( DisposeEvent )log.get( 1 );
    assertSame( shell, shellDisposeEvent.widget );
    String disposeExecRunnable = ( String )log.get( 2 );
    assertEquals( "disposeRunnable", disposeExecRunnable );
    assertTrue( display.isDisposed() );
  }

  public void testSystemCursor() {
    Display display = new Display();
    Cursor arrow = display.getSystemCursor( SWT.CURSOR_ARROW );
    Cursor cross = display.getSystemCursor( SWT.CURSOR_CROSS );
    assertNotNull( arrow );
    assertNotNull( cross );
    assertNotSame( arrow, cross );
    assertFalse( arrow.equals( cross ) );
    Cursor help1 = display.getSystemCursor( SWT.CURSOR_HELP );
    Cursor help2 = display.getSystemCursor( SWT.CURSOR_HELP );
    assertSame( help1, help2 );
  }

  public void testCloseWithoutListeners() {
    Display display = new Display();
    display.close();
    assertTrue( display.isDisposed() );
  }

  public void testCloseWithListener() {
    final java.util.List<Event> log = new ArrayList<Event>();
    Display display = new Display();
    display.addListener( SWT.Close, new Listener() {
      public void handleEvent( Event event ) {
        log.add( event );
      }
    } );
    display.close();
    assertTrue( display.isDisposed() );
    assertEquals( 1, log.size() );
    Event event = log.get( 0 );
    assertSame( display, event.display );
  }

  public void testCloseWithExceptionInListener() {
    final String exceptionMessage = "exception in close event";
    Display display = new Display();
    display.addListener( SWT.Close, new Listener() {
      public void handleEvent( Event event ) {
        throw new RuntimeException( exceptionMessage );
      }
    } );
    try {
      display.close();
      fail( "Exception in close-listener must interrupt close operation" );
    } catch( RuntimeException e ) {
      assertEquals( exceptionMessage, e.getMessage() );
    }
  }

  public void testGetDismissalAlignment() {
    Display display = new Display();
    assertEquals( SWT.LEFT, display.getDismissalAlignment() );
  }

  public void testCloseWithVetoingListener() {
    Display display = new Display();
    display.addListener( SWT.Close, new Listener() {
      public void handleEvent( Event event ) {
        event.doit = false;
      }
    } );
    display.close();
    assertFalse( display.isDisposed() );
  }

  public void testCheckDevice() throws Exception {
    final Throwable[] throwable = { null };
    final Display display = new Display();
    Runnable runnable = new Runnable() {
      public void run() {
        // access 'some' method that calls checkDevice()
        try {
          display.getShells();
        } catch( Throwable e ) {
          throwable[ 0 ] = e;
        }
      }
    };
    Thread backgroundThread = new Thread( runnable );
    backgroundThread.setDaemon( true );
    backgroundThread.start();
    backgroundThread.join();
    assertTrue( throwable[ 0 ] instanceof SWTException );
    SWTException swtException = ( SWTException )throwable[ 0 ];
    assertEquals( SWT.ERROR_THREAD_INVALID_ACCESS, swtException.code );
  }

  public void testFilterWithoutListener() {
    Display display = new Display();
    Listener filter = mock( Listener.class );
    display.addFilter( SWT.Resize, filter );
    Widget widget = new Shell( display );

    widget.notifyListeners( SWT.Resize, new Event() );

    verify( filter ).handleEvent( any( Event.class ) );
  }

  public void testCloseEventFilter() {
    Display display = new Display();
    final StringBuilder order = new StringBuilder();
    final java.util.List<Event> events = new ArrayList<Event>();
    display.addFilter( SWT.Close, new Listener() {
      public void handleEvent( Event event ) {
        events.add( event );
        order.append( "filter, " );
      }
    } );
    display.addListener( SWT.Close, new Listener() {
      public void handleEvent( Event event ) {
        events.add( event );
        event.doit = false;
        order.append( "listener" );
      }
    } );

    display.close();

    assertEquals( "filter, listener", order.toString() );
    assertEquals( 2, events.size() );
    Event filterEvent = events.get( 0 );
    assertSame( display, filterEvent.display );
    assertEquals( SWT.Close, filterEvent.type );
    assertNull( filterEvent.widget );
    Event listenerEevent = events.get( 1 );
    assertSame( filterEvent, listenerEevent );
  }

  public void testDisposeEventFilter() {
    Display display = new Display();
    final StringBuilder order = new StringBuilder();
    final java.util.List<Event> events = new ArrayList<Event>();
    display.addFilter( SWT.Dispose, new Listener() {
      public void handleEvent( Event event ) {
        events.add( event );
        order.append( "filter, " );
      }
    } );
    display.addListener( SWT.Dispose, new Listener() {
      public void handleEvent( Event event ) {
        events.add( event );
        order.append( "listener" );
      }
    } );
    display.dispose();
    assertEquals( "filter, listener", order.toString() );
    assertEquals( 2, events.size() );
    Event filterEvent = events.get( 0 );
    assertSame( display, filterEvent.display );
    assertEquals( SWT.Dispose, filterEvent.type );
    assertNull( filterEvent.widget );
    Event listenerEevent = events.get( 1 );
    assertSame( filterEvent, listenerEevent );
  }

  public void testGetCursorControlWithNoControl() {
    Display display = new Display();
    setCursorLocation( display, 234, 345 );
    assertNull( display.getCursorControl() );
  }

  public void testGetCursorControlWithVisibleControl() {
    Display display = new Display();
    setCursorLocation( display, 234, 345 );
    Control control = new Shell( display );
    control.setBounds( 100, 100, 500, 500 );
    control.setVisible( true );
    assertSame( control, display.getCursorControl() );
  }

  public void testGetCursorControlWithNestedControl() {
    Display display = new Display();
    setCursorLocation( display, 234, 345 );
    Shell shell = new Shell( display );
    shell.setBounds( 100, 100, 500, 500 );
    shell.setVisible( true );
    Control control = new Composite( shell, SWT.NONE );
    control.setBounds( 0, 0, 500, 500 );
    assertSame( control, display.getCursorControl() );
  }

  public void testGetCursorControlWithTwiceNestedControl() {
    Display display = new Display();
    setCursorLocation( display, 234, 345 );
    Shell shell = new Shell( display );
    shell.setBounds( 100, 100, 500, 500 );
    shell.setVisible( true );
    Composite composite = new Composite( shell, SWT.NONE );
    composite.setBounds( 0, 0, 500, 500 );
    Button button = new Button( composite, SWT.PUSH );
    button.setBounds( 130, 240, 10, 10 );
    assertSame( button, display.getCursorControl() );
  }

  public void testGetCursorControlWithInvisibleNestedControl() {
    Display display = new Display();
    setCursorLocation( display, 234, 345 );
    Shell shell = new Shell( display );
    shell.setBounds( 100, 100, 500, 500 );
    shell.setVisible( true );
    Composite composite = new Composite( shell, SWT.NONE );
    composite.setBounds( 0, 0, 500, 500 );
    Button button = new Button( composite, SWT.PUSH );
    button.setBounds( 130, 240, 10, 10 );
    button.setVisible( false );
    assertSame( composite, display.getCursorControl() );
  }

  public void testGetCursorControlWithOverlappingControls() {
    Display display = new Display();
    setCursorLocation( display, 234, 345 );
    Shell shell = new Shell( display );
    shell.setBounds( 100, 100, 500, 500 );
    shell.setVisible( true );
    Composite composite = new Composite( shell, SWT.NONE );
    composite.setBounds( 0, 0, 500, 500 );
    Button button = new Button( composite, SWT.PUSH );
    button.setBounds( 130, 240, 10, 10 );
    Button overlappingButton = new Button( composite, SWT.PUSH );
    overlappingButton.setBounds( 130, 240, 10, 10 );
    assertSame( button, display.getCursorControl() );
  }

  public void testGetCursorControlWithOverlappingAndHiddenControls() {
    Display display = new Display();
    setCursorLocation( display, 234, 345 );
    Shell shell = new Shell( display );
    shell.setBounds( 100, 100, 500, 500 );
    shell.setVisible( true );
    Composite composite = new Composite( shell, SWT.NONE );
    composite.setBounds( 0, 0, 500, 500 );
    Button hiddenButton = new Button( composite, SWT.PUSH );
    hiddenButton.setBounds( 130, 240, 10, 10 );
    hiddenButton.setVisible( false );
    Button overlappingButton = new Button( composite, SWT.PUSH );
    overlappingButton.setBounds( 130, 240, 10, 10 );
    assertSame( overlappingButton, display.getCursorControl() );
  }

  public void testGetCursorControlWithDisposedControl() {
    Display display = new Display();
    setCursorLocation( display, 234, 345 );
    Shell shell = new Shell( display );
    shell.setBounds( 100, 100, 500, 500 );
    shell.setVisible( true );
    shell.dispose();
    assertNull( display.getCursorControl() );
  }

  public void testAppName() {
    Display.setAppName( "App name" );
    assertEquals( "App name", Display.getAppName() );
  }

  public void testAppNameDefaultValue() {
    assertNull( Display.getAppName() );
  }

  public void testAppNameWithNullArgument() {
    Display.setAppName( null );
    assertNull( Display.getAppName() );
  }

  public void testAppVersion() {
    Display.setAppVersion( "v1.3" );
    assertEquals( "v1.3", Display.getAppVersion() );
  }

  public void testAppVersionDefaultValue() {
    assertNull( Display.getAppVersion() );
  }

  public void testAppVersionWithNullArgument() {
    Display.setAppVersion( null );
    assertNull( Display.getAppVersion() );
  }

  public void testFindDisplay() {
    Display display = new Display();
    assertSame( display, Display.findDisplay( display.getThread() ) );
  }

  public void testFindDisplayWithNull() {
    Display foundDisplay = Display.findDisplay( null );
    assertNull( foundDisplay );
  }

  public void testFindDisplayWithDisposedDisplay() {
    Display display = new Display();
    Thread disposedDisplayThread = display.getThread();
    display.dispose();
    Display foundDisplay = Display.findDisplay( disposedDisplayThread );
    assertNull( foundDisplay );
  }

  public void testFindDisplayFromDifferentSession() throws Exception {
    final Display[] otherDisplay = new Display[ 1 ];
    Thread otherThread = new Thread( new Runnable() {
      public void run() {
        Fixture.createServiceContext();
        otherDisplay[ 0 ] = new Display();
      }
    } );
    otherThread.setDaemon( true );
    otherThread.start();
    otherThread.join();
    Display display = Display.findDisplay( otherThread );
    assertNotNull( display );
    assertSame( otherDisplay[ 0 ], display );
  }

  public void testFindDisplayForReCreatedDisplay() {
    Display display = new Display();
    display.dispose();
    Display reCreatedDisplay = new Display();
    assertSame( reCreatedDisplay, Display.findDisplay( reCreatedDisplay.getThread() ) );
  }

  public void testGetSystemTray() {
    Display display = new Display();
    assertNull( display.getSystemTray() );
  }

  public void testGetMenuBar() {
    Display display = new Display();
    assertNull( display.getMenuBar() );
  }

  public void testGetSystemTaskBar() {
    Display display = new Display();
    assertNull( display.getSystemTaskBar() );
  }

  public void testGetSystemMenu() {
    Display display = new Display();
    assertNull( display.getSystemMenu() );
  }

  public void testSyncExecIsReleasedOnSessionTimeout() throws Exception {
    final AtomicBoolean executed = new AtomicBoolean( false );
    final Display display = new Display();
    Thread thread = new Thread( new Runnable() {
      public void run() {
        display.syncExec( new Runnable() {
          public void run() {
            executed.set( true );
          }
        } );
      }
    } );
    thread.setDaemon( true );
    thread.start();
    while( display.getSynchronizer().getMessageCount() < 1 ) {
      Thread.yield();
    }

    display.dispose();

    thread.join( 5000 );
    assertFalse( thread.isAlive() );
    assertFalse( executed.get() );
  }

  public void testRemoveShell_VisibleActiveShell() {
    Display display = new Display();
    Shell visibleShell = new Shell( display );
    visibleShell.open();
    Shell invisibleShell = new Shell( display );
    Shell shell = new Shell( display );
    shell.open();

    shell.dispose();

    assertFalse( invisibleShell.isVisible() );
    assertSame( visibleShell, display.getActiveShell() );
  }

  public void testRemoveShell_NoActiveShell() {
    Display display = new Display();
    Shell invisibleShell = new Shell( display );
    Shell shell = new Shell( display );
    shell.open();

    shell.dispose();

    assertFalse( invisibleShell.isVisible() );
    assertNull( display.getActiveShell() );
  }

  public void testDisposeFailsWhenInDisposal() {
    // See bug 389384
    final Display display = new Display();
    Shell shell = new Shell( display );
    shell.addDisposeListener( new DisposeListener() {
      public void widgetDisposed( DisposeEvent event ) {
        display.dispose();
      }
    } );

    try {
      display.dispose();
      fail();
    } catch( SWTException exception ) {
      assertEquals( "Device is disposed", exception.getMessage() );
    }
  }

  public void testReadAndDispatchIgnoresEventsFromDisposedWidgets() {
    Fixture.fakePhase( PhaseId.READ_DATA );
    Display display = new Display();
    Widget widget = new Shell( display );
    Listener listener = mock( Listener.class );
    widget.addListener( SWT.Activate, listener );
    widget.dispose();

    Fixture.fakePhase( PhaseId.PROCESS_ACTION );
    display.readAndDispatch();

    verify( listener, never() ).handleEvent( any( Event.class ) );
  }

  public void testAddListenerWithNullArgument() {
    Display display = new Display();

    try {
      display.addListener( 123, null );
      fail();
    } catch( IllegalArgumentException expected ) {
    }
  }

  public void testRemoveListenerWithNullArgument() {
    Display display = new Display();

    try {
      display.removeListener( 123, null );
      fail();
    } catch( IllegalArgumentException expected ) {
    }
  }

  public void testAddListener() {
    Display display = new Display();
    Listener listener = mock( Listener.class );

    display.addListener( 123, listener );
    Event event = new Event();
    display.sendEvent( 123, event );

    verify( listener ).handleEvent( event );
  }

  public void testRemoveListener() {
    Display display = new Display();
    Listener listener = mock( Listener.class );
    display.addListener( 123, listener );

    display.removeListener( 123, listener );
    display.sendEvent( 123, new Event() );

    verifyZeroInteractions( listener );
  }

  public void testSendEvent() {
    Display display = new Display();
    Listener listener = mock( Listener.class );
    display.addListener( 123, listener );

    display.sendEvent( 123, new Event() );

    ArgumentCaptor<Event> captor = ArgumentCaptor.forClass( Event.class );
    verify( listener ).handleEvent( captor.capture() );
    assertEquals( 123, captor.getValue().type );
    assertEquals( display, captor.getValue().display );
    assertTrue( captor.getValue().time > 0 );
  }

  public void testSendEventWithPredefinedTime() {
    Display display = new Display();
    Listener listener = mock( Listener.class );
    display.addListener( 123, listener );

    Event event = new Event();
    event.time = 4;
    display.sendEvent( 123, event );

    ArgumentCaptor<Event> captor = ArgumentCaptor.forClass( Event.class );
    verify( listener ).handleEvent( captor.capture() );
    assertEquals( 123, captor.getValue().type );
    assertEquals( display, captor.getValue().display );
    assertEquals( event.time, captor.getValue().time );
  }

  public void testRemoveListenerWithoutAddingListener() {
    Display display = new Display();
    Listener listener = mock( Listener.class );

    display.removeListener( 123, listener );
    display.sendEvent( 123, new Event() );

    verifyZeroInteractions( listener );
  }

  private static void setCursorLocation( Display display, int x, int y ) {
    IDisplayAdapter adapter = display.getAdapter( IDisplayAdapter.class );
    adapter.setCursorLocation( x, y );
  }

  public static class EnsureIdEntryPoint implements EntryPoint {
    public int createUI() {
      Display display = new Display();
      Shell shell = new Shell( display );
      WidgetUtil.getId( shell );
      return 0;
    }
  }

}
