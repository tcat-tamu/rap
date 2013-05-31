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
package org.eclipse.swt.custom;

import static org.eclipse.rap.rwt.testfixture.internal.TestUtil.createImage;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertSame;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.io.IOException;

import org.eclipse.rap.rwt.internal.theme.ThemeTestUtil;
import org.eclipse.rap.rwt.testfixture.Fixture;
import org.eclipse.swt.SWT;
import org.eclipse.swt.graphics.Font;
import org.eclipse.swt.graphics.Point;
import org.eclipse.swt.internal.custom.ICTabFolderAdapter;
import org.eclipse.swt.internal.graphics.FontUtil;
import org.eclipse.swt.widgets.Control;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.Shell;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;


public class CTabItem_Test {

  @Before
  public void setUp() {
    Fixture.setUp();
  }

  @After
  public void tearDown() {
    Fixture.tearDown();
  }

  @Test
  public void testCreation() {
    Display display = new Display();
    Shell shell = new Shell( display , SWT.MULTI );
    CTabFolder folder = new CTabFolder( shell, SWT.NONE );
    CTabItem item = new CTabItem( folder, SWT.NONE );
    assertEquals( null, folder.getSelection() );
    assertSame( folder, item.getParent() );
    assertSame( display, item.getDisplay() );
  }

  @Test
  public void testInitialState() {
    Display display = new Display();
    Shell shell = new Shell( display , SWT.NONE );
    CTabFolder folder = new CTabFolder( shell, SWT.NONE );
    CTabItem item = new CTabItem( folder, SWT.NONE );

    assertEquals( null, item.getToolTipText() );
    assertEquals( "", item.getText() );
    assertEquals( null, item.getControl() );
    assertEquals( null, item.getImage() );
  }

  @Test
  public void testStyle() {
    Display display = new Display();
    Shell shell = new Shell( display , SWT.NONE );
    CTabFolder folder = new CTabFolder( shell, SWT.NONE );
    CTabItem item1 = new CTabItem( folder, SWT.NONE );
    assertEquals( SWT.NONE, item1.getStyle() );

    CTabItem item2 = new CTabItem( folder, SWT.LEFT );
    assertEquals( SWT.NONE, item2.getStyle() );

    // TODO [rh] Different from SWT: SWT doesn't return CLOSE even though it was
    //      set in constructor. SWT currently relies on the behavior tested
    //      below to calulate the width of a CTabItem
    CTabItem item3 = new CTabItem( folder, SWT.CLOSE );
    assertTrue( ( item3.getStyle() & SWT.CLOSE ) != 0 );
  }

  @Test
  public void testBounds() {
    Display display = new Display();
    Shell shell = new Shell( display, SWT.NONE );
    CTabFolder folder = new CTabFolder( shell, SWT.MULTI | SWT.TOP );
    folder.setSize( 150, 80 );
    CTabItem item1 = new CTabItem( folder, SWT.NONE );
    shell.layout();

    assertTrue( item1.getBounds().width > 0 );
    assertTrue( item1.getBounds().height > 0 );

    CTabItem item2 = new CTabItem( folder, SWT.NONE );
    assertTrue( item1.getBounds().width > 0 );
    assertTrue( item1.getBounds().height > 0 );
    assertTrue( item2.getBounds().width > 0 );
    assertTrue( item2.getBounds().height > 0 );
    int item1Right = item1.getBounds().x + item1.getBounds().width;
    assertTrue( item2.getBounds().x >= item1Right );
  }

  @Test
  public void testDisplay() {
    Display display = new Display();
    Shell shell = new Shell( display, SWT.NONE );
    CTabFolder folder = new CTabFolder( shell, SWT.NONE );
    CTabItem item = new CTabItem( folder, SWT.NONE );
    assertSame( display, item.getDisplay() );
    assertSame( folder.getDisplay(), item.getDisplay() );
  }

  @Test
  public void testSetControl() {
    Display display = new Display();
    Shell shell = new Shell( display, SWT.NONE );
    CTabFolder folder = new CTabFolder( shell, SWT.MULTI | SWT.TOP );
    folder.setSize( 80, 50 );
    CTabItem item1 = new CTabItem( folder, SWT.NONE );
    Control item1Control = new Label( folder, SWT.NONE );
    item1Control.setSize( 1, 1 );
    shell.open();

    // Set control for unselected item
    folder.setSelection( -1 );
    item1.setControl( item1Control );
    assertSame( item1Control, item1.getControl() );
    assertFalse( item1Control.getVisible() );
    assertEquals( new Point( 1, 1 ), item1Control.getSize() );

    // Reset control: must set its visibility to false
    item1Control.setVisible( true );
    item1.setControl( null );
    assertEquals( null, item1.getControl() );
    assertFalse( item1Control.getVisible() );

    // Set control for selected item
    CTabItem item2 = new CTabItem( folder, SWT.NONE );
    Control item2Control = new Label( folder, SWT.NONE );
    folder.setSelection( 1 );
    item2.setControl( item2Control );
    assertSame( item2Control, item2.getControl() );
    assertTrue( item2Control.getVisible() );
    assertEquals( folder.getClientArea(), item2Control.getBounds() );

    // Try to set disposed of control
    try {
      Control control = new Label( folder, SWT.NONE );
      control.dispose();
      CTabItem item = new CTabItem( folder, SWT.NONE );
      item.setControl( control );
      fail( "setControl must not accept disposed of controls" );
    } catch( IllegalArgumentException e ) {
      // expected
    }

    // Try to set control with wrong parent
    try {
      Control control = new Label( shell, SWT.NONE );
      CTabItem item = new CTabItem( folder, SWT.NONE );
      item.setControl( control );
      String msg
        = "setControl must only accept controls whose parent is the folder";
      fail( msg );
    } catch( IllegalArgumentException e ) {
      // expected
    }
  }

  @Test
  public void testShowClose() {
    CTabFolder folder;
    CTabItem item;
    ICTabFolderAdapter adapter;
    Display display = new Display();
    Shell shell = new Shell( display, SWT.NONE );
    // Test with folder that was created with SWT.CLOSE
    folder = new CTabFolder( shell, SWT.CLOSE );
    adapter
      = folder.getAdapter( ICTabFolderAdapter.class );
    item = new CTabItem( folder, SWT.NONE );
    assertFalse( item.getShowClose() );
    assertTrue( adapter.showItemClose( item ) );
    item = new CTabItem( folder, SWT.CLOSE );
    assertTrue( item.getShowClose() );
    assertTrue( adapter.showItemClose( item ) );

    item.setShowClose( false );
    assertTrue( item.getShowClose() );

    // Test with folder that was created without SWT.CLOSE
    folder = new CTabFolder( shell, SWT.NONE );
    adapter
      = folder.getAdapter( ICTabFolderAdapter.class );
    item = new CTabItem( folder, SWT.NONE );
    assertFalse( item.getShowClose() );
    assertFalse( adapter.showItemClose( item ) );
    item = new CTabItem( folder, SWT.CLOSE );
    assertTrue( item.getShowClose() );
    assertTrue( adapter.showItemClose( item ) );

    item.setShowClose( false );
    assertFalse( item.getShowClose() );
  }

  @Test
  public void testShowImage() throws IOException {
    CTabItem item1, item2;
    Display display = new Display();
    Shell shell = new Shell( display, SWT.NONE );
    // Test with images, that should appear on unselected tabs
    CTabFolder folder = new CTabFolder( shell, SWT.NONE );
    folder.setSize( 120, 120 );
    folder.setUnselectedImageVisible( true );
    ICTabFolderAdapter adapter
      = folder.getAdapter( ICTabFolderAdapter.class );
    item1 = new CTabItem( folder, SWT.NONE );
    item1.setImage( createImage( display, Fixture.IMAGE1 ) );
    item2 = new CTabItem( folder, SWT.NONE );
    item2.setImage( createImage( display, Fixture.IMAGE1 ) );
    folder.setSelection( item1 );
    assertTrue( adapter.showItemImage( item1 ) );
    assertTrue( adapter.showItemImage( item2 ) );
    // Test with images, that should not appear on unselected tabs
    folder = new CTabFolder( shell, SWT.NONE );
    folder.setSize( 120, 120 );
    folder.setUnselectedImageVisible( false );
    item1 = new CTabItem( folder, SWT.NONE );
    item1.setImage( createImage( display, Fixture.IMAGE1 ) );
    item2 = new CTabItem( folder, SWT.NONE );
    item2.setImage( createImage( display, Fixture.IMAGE1 ) );
    folder.setSelection( item1 );
    assertTrue( adapter.showItemImage( item1 ) );
    assertFalse( adapter.showItemImage( item2 ) );
  }

  @Test
  public void testSetFont() {
    Display display = new Display();
    Shell shell = new Shell( display, SWT.NONE );
    // Test with images, that should appear on unselected tabs
    CTabFolder folder = new CTabFolder( shell, SWT.NONE );
    Font folderFont = folder.getFont();
    CTabItem item = new CTabItem( folder, SWT.NONE );
    Font cTabFont = new Font( display, "BeautifullyCraftedTreeFont", 15, SWT.BOLD );
    item.setFont( cTabFont );
    assertSame( cTabFont, item.getFont() );
    Font itemFont = new Font( display, "ItemFont", 40, SWT.NORMAL );
    item.setFont( itemFont );
    assertSame( itemFont, item.getFont() );
    item.setFont( null );
    assertSame( folderFont, item.getFont() );
    Font font = new Font( display, "Testfont", 10, SWT.BOLD );
    font.dispose();
    try {
      item.setFont( font );
      fail( "Disposed Font must not be set." );
    } catch( IllegalArgumentException e ) {
      // Expected Exception
    }
  }

  @Test
  public void testGetFontFromCSS() throws IOException {
    Display display = new Display();
    Shell shell = new Shell( display, SWT.NONE );
    String css = "CTabItem { font: 22px Verdana, sans-serif; }"
               + "CTabItem:selected { font: 24px Verdana, sans-serif; }";
    ThemeTestUtil.registerTheme( "custom", css, null );
    ThemeTestUtil.setCurrentThemeId( "custom" );
    CTabFolder folder = new CTabFolder( shell, SWT.NONE );
    CTabItem item = new CTabItem( folder, SWT.NONE );
    Font font = item.getFont();
    assertEquals( 22, FontUtil.getData( font ).getHeight() );
    folder.setSelection( 0 );
    font = item.getFont();
    assertEquals( 24, FontUtil.getData( font ).getHeight() );
  }

}
