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
package org.eclipse.swt.custom;

import junit.framework.TestCase;

import org.eclipse.rap.rwt.RWT;
import org.eclipse.rap.rwt.graphics.Graphics;
import org.eclipse.rap.rwt.internal.theme.IThemeAdapter;
import org.eclipse.rap.rwt.lifecycle.PhaseId;
import org.eclipse.rap.rwt.testfixture.Fixture;
import org.eclipse.swt.SWT;
import org.eclipse.swt.graphics.Color;
import org.eclipse.swt.graphics.Point;
import org.eclipse.swt.graphics.Rectangle;
import org.eclipse.swt.internal.custom.clabelkit.CLabelThemeAdapter;
import org.eclipse.swt.internal.widgets.IWidgetGraphicsAdapter;
import org.eclipse.swt.internal.widgets.MarkupValidator;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Shell;

public class CLabel_Test extends TestCase {

  private Display display;
  private Shell shell;

  @Override
  protected void setUp() throws Exception {
    Fixture.setUp();
    Fixture.fakePhase( PhaseId.PROCESS_ACTION );
    display = new Display();
    shell = new Shell( display );
  }

  @Override
  protected void tearDown() throws Exception {
    Fixture.tearDown();
  }

  public void testSetBackgroundColor() {
    CLabel label = new CLabel( shell, SWT.RIGHT );
    Color red = display.getSystemColor( SWT.COLOR_RED );
    label.setBackground( red );
    assertEquals( label.getBackground(), red );
  }

  public void testSetToolTipText() {
    CLabel label = new CLabel( shell, SWT.RIGHT );
    label.setToolTipText( "foo" );
    assertEquals( label.getToolTipText(), "foo" );
  }

  public void testSetAlignment() {
    CLabel label = new CLabel( shell, SWT.LEFT );
    assertEquals( label.getAlignment(), SWT.LEFT );
    label.setAlignment( SWT.RIGHT );
    assertEquals( label.getAlignment(), SWT.RIGHT );
  }

  public void testSetImage() {
    CLabel label = new CLabel( shell, SWT.RIGHT );
    assertEquals( label.getImage(), null );
    label.setImage( Graphics.getImage( Fixture.IMAGE1, getClass().getClassLoader() ) );
    assertEquals( label.getImage(),
                  Graphics.getImage( Fixture.IMAGE1, getClass().getClassLoader() ) );
  }

  public void testSetText() {
    CLabel label = new CLabel( shell, SWT.RIGHT );
    assertEquals( null, label.getText() );
    label.setText( "bar" );
    assertEquals( label.getText(), "bar" );
  }

  @SuppressWarnings("deprecation")
  public void testComputeSize() {
    CLabel label = new CLabel( shell, SWT.RIGHT );
    Point expected = new Point( 12, 26 );
    assertEquals( expected, label.computeSize( SWT.DEFAULT, SWT.DEFAULT ) );
    label.setText( "bar" );
    expected = new Point( 32, 30 );
    assertEquals( expected, label.computeSize( SWT.DEFAULT, SWT.DEFAULT ) );
    label.setImage( Graphics.getImage( Fixture.IMAGE_100x50 ) );
    expected = new Point( 137, 62 );
    assertEquals( expected, label.computeSize( SWT.DEFAULT, SWT.DEFAULT ) );
    label.setMargins( 1, 2, 3, 4 );
    expected = new Point( 129, 56 );
    assertEquals( expected, label.computeSize( SWT.DEFAULT, SWT.DEFAULT ) );
  }

  public void testSetMargins() {
    CLabel label = new CLabel( shell, SWT.RIGHT );
    CLabelThemeAdapter themeAdapter = ( CLabelThemeAdapter )label.getAdapter( IThemeAdapter.class );
    Rectangle padding = themeAdapter.getPadding( label );
    assertEquals( padding.x, label.getLeftMargin() );
    assertEquals( padding.y, label.getTopMargin() );
    assertEquals( padding.width - padding.x, label.getRightMargin() );
    assertEquals( padding.height - padding.y, label.getBottomMargin() );
    label.setMargins( 1, 2, 3, 4 );
    assertEquals( 1, label.getLeftMargin() );
    assertEquals( 2, label.getTopMargin() );
    assertEquals( 3, label.getRightMargin() );
    assertEquals( 4, label.getBottomMargin() );
    label.setLeftMargin( 6 );
    assertEquals( 6, label.getLeftMargin() );
    label.setTopMargin( 7 );
    assertEquals( 7, label.getTopMargin() );
    label.setRightMargin( 8 );
    assertEquals( 8, label.getRightMargin() );
    label.setBottomMargin( 9 );
    assertEquals( 9, label.getBottomMargin() );
    label.setLeftMargin( -1 );
    assertEquals( 6, label.getLeftMargin() );
    label.setTopMargin( -1 );
    assertEquals( 7, label.getTopMargin() );
    label.setRightMargin( -1 );
    assertEquals( 8, label.getRightMargin() );
    label.setBottomMargin( -1 );
    assertEquals( 9, label.getBottomMargin() );
    label.setMargins( -1, -1, -1, -1 );
    assertEquals( 0, label.getLeftMargin() );
    assertEquals( 0, label.getTopMargin() );
    assertEquals( 0, label.getRightMargin() );
    assertEquals( 0, label.getBottomMargin() );
  }

  public void testSetBackgroundGradient_Horizontal() {
    CLabel label = new CLabel( shell, SWT.RIGHT );
    Color[] colors = new Color[] {
      display.getSystemColor( SWT.COLOR_RED ),
      display.getSystemColor( SWT.COLOR_GREEN ),
      display.getSystemColor( SWT.COLOR_BLUE )
    };
    int[] percents = new int[] { 33, 66 };
    label.setBackground( colors, percents );
    IWidgetGraphicsAdapter adapter
      = label.getAdapter( IWidgetGraphicsAdapter.class );
    assertEquals( colors.length, adapter.getBackgroundGradientColors().length );
    assertEquals( percents.length + 1,
                  adapter.getBackgroundGradientPercents().length );
    assertFalse( adapter.isBackgroundGradientVertical() );
  }

  public void testSetBackgroundGradient_Vertical() {
    CLabel label = new CLabel( shell, SWT.RIGHT );
    Color[] colors = new Color[] {
      display.getSystemColor( SWT.COLOR_RED ),
      display.getSystemColor( SWT.COLOR_GREEN ),
      display.getSystemColor( SWT.COLOR_BLUE )
    };
    int[] percents = new int[] { 33, 66 };
    label.setBackground( colors, percents, true );
    IWidgetGraphicsAdapter adapter
      = label.getAdapter( IWidgetGraphicsAdapter.class );
    assertEquals( colors.length, adapter.getBackgroundGradientColors().length );
    assertEquals( percents.length + 1,
                  adapter.getBackgroundGradientPercents().length );
    assertTrue( adapter.isBackgroundGradientVertical() );
  }

  public void testSetBackgroundGradient_NullValues() {
    CLabel label = new CLabel( shell, SWT.RIGHT );
    Color[] colors = null;
    int[] percents = null;
    try {
      label.setBackground( colors, percents, true );
    } catch( IllegalArgumentException ex ) {
      fail( "Null colors not allowed" );
    }
    colors = new Color[] {
      display.getSystemColor( SWT.COLOR_RED ),
      display.getSystemColor( SWT.COLOR_GREEN ),
      display.getSystemColor( SWT.COLOR_BLUE )
    };
    try {
      label.setBackground( colors, percents, true );
      fail( "Null percents not allowed" );
    } catch( IllegalArgumentException ex ) {
      // expected
    }
  }

  public void testSetBackgroundGradient_ArraysSize() {
    CLabel label = new CLabel( shell, SWT.RIGHT );
    Color[] colors = new Color[] {
      display.getSystemColor( SWT.COLOR_RED ),
      display.getSystemColor( SWT.COLOR_GREEN ),
      display.getSystemColor( SWT.COLOR_BLUE )
    };
    int[] percents = new int[] { 66 };
    try {
      label.setBackground( colors, percents, true );
      fail( "Wrong arrays size" );
    } catch( IllegalArgumentException ex ) {
      // expected
    }
  }

  public void testSetBackgroundGradient_InvalidPercents() {
    CLabel label = new CLabel( shell, SWT.RIGHT );
    Color[] colors = new Color[] {
      display.getSystemColor( SWT.COLOR_RED ),
      display.getSystemColor( SWT.COLOR_GREEN ),
      display.getSystemColor( SWT.COLOR_BLUE )
    };
    int[] percents = new int[] { 66, 30 };
    try {
      label.setBackground( colors, percents, true );
      fail( "Percents are not in increase order" );
    } catch( IllegalArgumentException ex ) {
      // expected
    }
    percents = new int[] { -10, 66 };
    try {
      label.setBackground( colors, percents, true );
      fail( "Percents value out of range 0 - 100" );
    } catch( IllegalArgumentException ex ) {
      // expected
    }
    percents = new int[] { 66, 110 };
    try {
      label.setBackground( colors, percents, true );
      fail( "Percents value out of range 0 - 100" );
    } catch( IllegalArgumentException ex ) {
      // expected
    }
  }

  public void testSetBackgroundGradient_NullColorReplace() {
    CLabel label = new CLabel( shell, SWT.RIGHT );
    label.setBackground( display.getSystemColor( SWT.COLOR_GREEN ) );
    Color[] colors = new Color[] {
      display.getSystemColor( SWT.COLOR_RED ),
      null,
      display.getSystemColor( SWT.COLOR_BLUE )
    };
    int[] percents = new int[] { 33, 66 };
    label.setBackground( colors, percents );
    IWidgetGraphicsAdapter adapter
      = label.getAdapter( IWidgetGraphicsAdapter.class );
    assertEquals( colors.length, adapter.getBackgroundGradientColors().length );
    assertEquals( display.getSystemColor( SWT.COLOR_GREEN ),
                  adapter.getBackgroundGradientColors()[ 1 ] );
  }

  public void testIsSerializable() throws Exception {
    CLabel label = new CLabel( shell, SWT.NONE );
    label.setText( "text" );

    CLabel deserializedLabel = Fixture.serializeAndDeserialize( label );

    assertEquals( "text", deserializedLabel.getText() );
  }

  public void testMarkupTextWithoutMarkupEnabled() {
    CLabel label = new CLabel( shell, SWT.NONE );
    label.setData( RWT.MARKUP_ENABLED, Boolean.FALSE );

    try {
      label.setText( "invalid xhtml: <<&>>" );
    } catch( IllegalArgumentException notExpected ) {
      fail();
    }
  }

  public void testMarkupTextWithMarkupEnabled() {
    CLabel label = new CLabel( shell, SWT.NONE );
    label.setData( RWT.MARKUP_ENABLED, Boolean.TRUE );

    try {
      label.setText( "invalid xhtml: <<&>>" );
      fail();
    } catch( IllegalArgumentException expected ) {
    }
  }

  public void testMarkupTextWithMarkupEnabled_ValidationDisabled() {
    CLabel label = new CLabel( shell, SWT.NONE );
    label.setData( RWT.MARKUP_ENABLED, Boolean.TRUE );
    label.setData( MarkupValidator.MARKUP_VALIDATION_DISABLED, Boolean.TRUE );

    try {
      label.setText( "invalid xhtml: <<&>>" );
    } catch( IllegalArgumentException notExpected ) {
      fail();
    }
  }

  public void testDisableMarkupIsIgnored() {
    CLabel label = new CLabel( shell, SWT.NONE );
    label.setData( RWT.MARKUP_ENABLED, Boolean.TRUE );

    label.setData( RWT.MARKUP_ENABLED, Boolean.FALSE );

    assertTrue( label.markupEnabled );
  }

}
