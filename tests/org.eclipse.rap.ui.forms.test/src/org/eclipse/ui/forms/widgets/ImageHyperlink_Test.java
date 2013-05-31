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
package org.eclipse.ui.forms.widgets;

import static org.eclipse.rap.rwt.testfixture.internal.TestUtil.createImage;

import java.io.IOException;

import junit.framework.TestCase;

import org.eclipse.rap.rwt.lifecycle.PhaseId;
import org.eclipse.rap.rwt.testfixture.Fixture;
import org.eclipse.swt.SWT;
import org.eclipse.swt.graphics.Image;
import org.eclipse.swt.graphics.Point;
import org.eclipse.swt.layout.FillLayout;
import org.eclipse.swt.widgets.*;

@SuppressWarnings( "restriction" )
public class ImageHyperlink_Test extends TestCase {

  public void testImage() throws IOException {
    Display display = new Display();
    Composite shell = new Shell( display, SWT.NONE );
    shell.setLayout( new FillLayout() );
    FormToolkit toolkit = new FormToolkit( shell.getDisplay() );
    Form form = toolkit.createForm( shell );
    form.getBody().setLayout( new TableWrapLayout() );
    ImageHyperlink hyperlink = toolkit.createImageHyperlink( form.getBody(), SWT.NONE );
    assertNotNull( hyperlink );
    assertEquals( null, hyperlink.getImage() );
    Image image = createImage( display, Fixture.IMAGE_100x50 );
    hyperlink.setImage( image );
    assertEquals( image, hyperlink.getImage() );
  }

  public void testComputeSize() throws IOException {
    Fixture.fakePhase( PhaseId.PROCESS_ACTION );
    Display display = new Display();
    Composite shell = new Shell( display, SWT.NONE );
    shell.setLayout( new FillLayout() );
    FormToolkit toolkit = new FormToolkit( shell.getDisplay() );
    Form form = toolkit.createForm( shell );
    form.getBody().setLayout( new TableWrapLayout() );
    ImageHyperlink hyperlink = toolkit.createImageHyperlink( form.getBody(), SWT.NONE );
    assertNotNull( hyperlink );
    assertEquals( null, hyperlink.getImage() );
    Image image = createImage( display, Fixture.IMAGE_100x50 );
    hyperlink.setImage( image );
    Point expected = new Point( 109, 52 );
    assertEquals( expected, hyperlink.computeSize( SWT.DEFAULT, SWT.DEFAULT ) );
    // fixed size
    expected = new Point( 50, 52 );
    assertEquals( expected, hyperlink.computeSize( 50, 50 ) );
  }

  @Override
  protected void setUp() throws Exception {
    Fixture.setUp();
  }

  @Override
  protected void tearDown() throws Exception {
    Fixture.tearDown();
  }
}
