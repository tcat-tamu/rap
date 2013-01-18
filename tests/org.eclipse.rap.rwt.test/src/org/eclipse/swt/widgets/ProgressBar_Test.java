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
package org.eclipse.swt.widgets;

import static org.junit.Assert.assertEquals;

import org.eclipse.rap.rwt.lifecycle.PhaseId;
import org.eclipse.rap.rwt.testfixture.Fixture;
import org.eclipse.swt.SWT;
import org.eclipse.swt.graphics.Point;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;


public class ProgressBar_Test {

  @Before
  public void setUp() {
    Fixture.setUp();
  }

  @After
  public void tearDown() {
    Fixture.tearDown();
  }

  @Test
  public void testRangeOperations() {
    Display display = new Display();
    Shell shell = new Shell( display, SWT.NONE );
    ProgressBar progressBar = new ProgressBar( shell, SWT.HORIZONTAL );
    assertEquals( 0, progressBar.getMinimum() );
    assertEquals( 100, progressBar.getMaximum() );

    progressBar.setMinimum( 10 );
    assertEquals( 10, progressBar.getMinimum() );
    progressBar.setMinimum( -1 );
    assertEquals( 10, progressBar.getMinimum() );
    progressBar.setMinimum( 100 );
    assertEquals( 10, progressBar.getMinimum() );
    progressBar.setMinimum( 101 );
    assertEquals( 10, progressBar.getMinimum() );

    progressBar.setMaximum( 20 );
    assertEquals( 20, progressBar.getMaximum() );
    progressBar.setMaximum( progressBar.getMinimum() - 1 );
    assertEquals( 20, progressBar.getMaximum() );
    progressBar.setMaximum( progressBar.getMinimum() );
    assertEquals( 20, progressBar.getMaximum() );
  }

  @Test
  public void testSelection() {
    Display display = new Display();
    Shell shell = new Shell( display, SWT.NONE );
    ProgressBar progressBar = new ProgressBar( shell, SWT.HORIZONTAL );
    assertEquals( 0, progressBar.getSelection() );

    progressBar.setMinimum( 10 );
    assertEquals( 10, progressBar.getSelection() );

    progressBar.setSelection( 20 );
    progressBar.setMaximum( 15 );
    assertEquals( 15, progressBar.getSelection() );

    progressBar.setSelection( 20 );
    assertEquals( 15, progressBar.getSelection() );
    progressBar.setSelection( 0 );
    assertEquals( 10, progressBar.getSelection() );
  }

  @Test
  public void testState() {
    Display display = new Display();
    Shell shell = new Shell( display, SWT.NONE );
    ProgressBar progressBar = new ProgressBar( shell, SWT.HORIZONTAL );
    assertEquals( SWT.NORMAL, progressBar.getState() );
    progressBar.setState( SWT.PAUSED );
    assertEquals( SWT.PAUSED, progressBar.getState() );
    progressBar.setState( SWT.ERROR );
    assertEquals( SWT.ERROR, progressBar.getState() );
    // do not change state if parameter is not allowed
    progressBar.setState( 1 << 3 );
    assertEquals( SWT.ERROR, progressBar.getState() );
  }

  @Test
  public void testComputeSize() {
    Fixture.fakePhase( PhaseId.PROCESS_ACTION );
    Display display = new Display();
    Shell shell = new Shell( display, SWT.NONE );
    ProgressBar bar = new ProgressBar( shell, SWT.HORIZONTAL );
    Point expected = new Point( 162, 18 );
    assertEquals( expected, bar.computeSize( SWT.DEFAULT, SWT.DEFAULT ) );

    bar = new ProgressBar( shell, SWT.VERTICAL );
    expected = new Point( 18, 162 );
    assertEquals( expected, bar.computeSize( SWT.DEFAULT, SWT.DEFAULT ) );

    bar = new ProgressBar( shell, SWT.BORDER );
    expected = new Point( 162, 18 );
    assertEquals( 1, bar.getBorderWidth() );
    assertEquals( expected, bar.computeSize( SWT.DEFAULT, SWT.DEFAULT ) );

    expected = new Point( 102, 102 );
    assertEquals( expected, bar.computeSize( 100, 100 ) );
  }

  @Test
  public void testIsSerializable() throws Exception {
    Display display = new Display();
    Shell shell = new Shell( display, SWT.NONE );
    ProgressBar bar = new ProgressBar( shell, SWT.HORIZONTAL );
    bar.setSelection( 54 );

    ProgressBar deserializedBar = Fixture.serializeAndDeserialize( bar );

    assertEquals( bar.getSelection(), deserializedBar.getSelection() );
  }
}
