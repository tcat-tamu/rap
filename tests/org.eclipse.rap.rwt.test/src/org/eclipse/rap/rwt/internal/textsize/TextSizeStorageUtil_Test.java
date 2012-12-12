/*******************************************************************************
 * Copyright (c) 2011, 2012 Frank Appel and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    Frank Appel - initial API and implementation
 *    EclipseSource - bug 348056: Eliminate compiler warnings
 ******************************************************************************/
package org.eclipse.rap.rwt.internal.textsize;

import java.util.HashSet;
import java.util.Set;

import junit.framework.TestCase;

import org.eclipse.rap.rwt.testfixture.Fixture;
import org.eclipse.swt.SWT;
import org.eclipse.swt.graphics.FontData;
import org.eclipse.swt.graphics.Point;


public class TextSizeStorageUtil_Test extends TestCase {
  private static final FontData FONT_DATA = new FontData( "arial", 10, SWT.NORMAL );
  private static final String TEST_STRING = "test";
  private static final int MODE = TextSizeUtil.STRING_EXTENT;


  public void testLookupOfNotExistingText() {
    assertNull( TextSizeStorageUtil.lookup( FONT_DATA, TEST_STRING, SWT.DEFAULT, MODE ) );
  }

  public void testStoreWithUnprobedFont() {
    try {
      TextSizeStorageUtil.store( FONT_DATA, TEST_STRING, SWT.DEFAULT, MODE, new Point( 1, 1 ) );
      fail( "No probe available." );
    } catch( IllegalStateException ise ) {
    }
  }

  public void testStoreAndLookup() {
    ProbeResultStore probeResultStore = ProbeResultStore.getInstance();
    probeResultStore.createProbeResult( new Probe( FONT_DATA ), new Point( 2, 10 ) );
    Point storedSize = new Point( 10, 10 );

    TextSizeStorageUtil.store( FONT_DATA, TEST_STRING, SWT.DEFAULT, MODE, storedSize );
    Point lookupSize = TextSizeStorageUtil.lookup( FONT_DATA, TEST_STRING, SWT.DEFAULT, MODE );

    assertEquals( storedSize, lookupSize );
  }

  public void testGetKey() {
    Set<Integer> takenKeys = new HashSet<Integer>();
    StringBuilder generatedText = new StringBuilder();
    for( int i = 0; i < 100; i++ ) {
      generatedText.append( "a" );
      String text = generatedText.toString();
      Probe probe = new Probe( text, FONT_DATA );
      Point size = new Point( 1, 2 );
      ProbeResultStore.getInstance().createProbeResult( probe, size );
      Integer key = TextSizeStorageUtil.getKey( FONT_DATA, text, SWT.DEFAULT, MODE );
      assertFalse( takenKeys.contains( key ) );
      takenKeys.add( key );
    }
  }

  protected void setUp() throws Exception {
    Fixture.setUp();
  }

  protected void tearDown() throws Exception {
    Fixture.tearDown();
  }
}
