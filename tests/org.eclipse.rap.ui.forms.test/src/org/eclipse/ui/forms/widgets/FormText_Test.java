/*******************************************************************************
 * Copyright (c) 2009, 2012 EclipseSource and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    EclipseSource - initial API and implementation
 ******************************************************************************/
package org.eclipse.ui.forms.widgets;

import junit.framework.TestCase;

import org.eclipse.rap.rwt.lifecycle.PhaseId;
import org.eclipse.rap.rwt.testfixture.Fixture;
import org.eclipse.swt.SWT;
import org.eclipse.swt.graphics.Point;
import org.eclipse.swt.layout.FillLayout;
import org.eclipse.swt.widgets.*;
import org.eclipse.ui.forms.HyperlinkSettings;

public class FormText_Test extends TestCase {

  public void testHyperlinkSettings() {
    Fixture.fakePhase( PhaseId.PROCESS_ACTION );
    Display display = new Display();
    Composite shell = new Shell( display, SWT.NONE );
    shell.setLayout( new FillLayout() );
    FormToolkit toolkit = new FormToolkit( shell.getDisplay() );
    Form form = toolkit.createForm( shell );
    form.getBody().setLayout( new TableWrapLayout() );
    FormText formText = toolkit.createFormText( form.getBody(), true );
    assertNotNull( formText );
    assertEquals( toolkit.getHyperlinkGroup(), formText.getHyperlinkSettings() );
    HyperlinkSettings settings = new HyperlinkSettings( display );
    formText.setHyperlinkSettings( settings );
    assertEquals( settings, formText.getHyperlinkSettings() );
  }

  public void testComputeSize() {
    Fixture.fakePhase( PhaseId.PROCESS_ACTION );
    Display display = new Display();
    Composite shell = new Shell( display, SWT.NONE );
    shell.setLayout( new FillLayout() );
    FormToolkit toolkit = new FormToolkit( shell.getDisplay() );
    Form form = toolkit.createForm( shell );
    form.getBody().setLayout( new TableWrapLayout() );
    FormText formText = toolkit.createFormText( form.getBody(), true );
    assertNotNull( formText );
    String text = "<form>"
      + "<p>First paragraph</p>"
      + "<li>First bullet</li>"
      + "<li>Second bullet</li>"
      + "<li>Third bullet</li>"
      + "<p>Second paragraph</p>"
      + "</form>";
    formText.setText( text, true, false );
    assertEquals( new Point( 110, 120 ), formText.computeSize( SWT.DEFAULT, SWT.DEFAULT ) );
    // fixed size
    assertEquals( new Point( 50, 50 ), formText.computeSize( 50, 50 ) );
  }

  protected void setUp() throws Exception {
    Fixture.setUp();
  }

  protected void tearDown() throws Exception {
    Fixture.tearDown();
  }
}
