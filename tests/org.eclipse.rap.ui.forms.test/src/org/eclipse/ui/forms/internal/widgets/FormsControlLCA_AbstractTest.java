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
package org.eclipse.ui.forms.internal.widgets;

import junit.framework.TestCase;

import org.eclipse.rap.rwt.lifecycle.WidgetAdapter;
import org.eclipse.rap.rwt.lifecycle.WidgetUtil;
import org.eclipse.rap.rwt.testfixture.Fixture;
import org.eclipse.swt.SWT;
import org.eclipse.swt.graphics.*;
import org.eclipse.swt.internal.widgets.Props;
import org.eclipse.swt.widgets.*;

@SuppressWarnings("restriction")
public abstract class FormsControlLCA_AbstractTest extends TestCase {

  protected Display display;
  protected Shell shell;

  @Override
  protected void setUp() {
    Fixture.setUp();
    display = new Display();
    shell = new Shell( display );
  }

  @Override
  protected void tearDown() {
    Fixture.tearDown();
  }

  protected void testPreserveControlProperties( Control control ) {
    // bound
    Rectangle rectangle = new Rectangle( 10, 10, 10, 10 );
    control.setBounds( rectangle );
    Fixture.preserveWidgets();
    WidgetAdapter adapter = WidgetUtil.getAdapter( control );
    assertEquals( rectangle, adapter.getPreserved( Props.BOUNDS ) );
    Fixture.clearPreserved();
    // enabled
    Fixture.preserveWidgets();
    adapter = WidgetUtil.getAdapter( control );
    assertEquals( Boolean.TRUE, adapter.getPreserved( Props.ENABLED ) );
    Fixture.clearPreserved();
    control.setEnabled( false );
    Fixture.preserveWidgets();
    adapter = WidgetUtil.getAdapter( control );
    assertEquals( Boolean.FALSE, adapter.getPreserved( Props.ENABLED ) );
    Fixture.clearPreserved();
    // visible
    Fixture.preserveWidgets();
    adapter = WidgetUtil.getAdapter( control );
    assertEquals( Boolean.TRUE, adapter.getPreserved( Props.VISIBLE ) );
    Fixture.clearPreserved();
    control.setVisible( false );
    Fixture.preserveWidgets();
    adapter = WidgetUtil.getAdapter( control );
    assertEquals( Boolean.FALSE, adapter.getPreserved( Props.VISIBLE ) );
    Fixture.clearPreserved();
    // menu
    Fixture.preserveWidgets();
    adapter = WidgetUtil.getAdapter( control );
    assertEquals( null, adapter.getPreserved( Props.MENU ) );
    Fixture.clearPreserved();
    Menu menu = new Menu( control );
    MenuItem item = new MenuItem( menu, SWT.NONE );
    item.setText( "1 Item" );
    control.setMenu( menu );
    Fixture.preserveWidgets();
    adapter = WidgetUtil.getAdapter( control );
    assertEquals( menu, adapter.getPreserved( Props.MENU ) );
    Fixture.clearPreserved();
    //foreground background font
    Color background = new Color( display, 122, 33, 203 );
    control.setBackground( background );
    Color foreground = new Color( display, 211, 178, 211 );
    control.setForeground( foreground );
    Font font = new Font( display, "font", 12, SWT.BOLD );
    control.setFont( font );
    control.setEnabled( true );
    Fixture.preserveWidgets();
    adapter = WidgetUtil.getAdapter( control );
    assertEquals( background, adapter.getPreserved( Props.BACKGROUND ) );
    assertEquals( foreground, adapter.getPreserved( Props.FOREGROUND ) );
    assertEquals( font, adapter.getPreserved( Props.FONT ) );
    Fixture.clearPreserved();
  }
}
