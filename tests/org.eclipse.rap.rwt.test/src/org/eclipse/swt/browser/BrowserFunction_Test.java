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
package org.eclipse.swt.browser;

import static org.junit.Assert.*;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import org.eclipse.rap.rwt.lifecycle.PhaseId;
import org.eclipse.rap.rwt.testfixture.Fixture;
import org.eclipse.swt.SWT;
import org.eclipse.swt.SWTException;
import org.eclipse.swt.internal.widgets.IBrowserAdapter;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Shell;


public class BrowserFunction_Test {

  private static final String FUNC = "func";

  private Browser browser;

  @Before
  public void setUp() {
    Fixture.setUp();
    Fixture.fakePhase( PhaseId.PROCESS_ACTION );
    Display display = new Display();
    Shell shell = new Shell( display );
    browser = new Browser( shell, SWT.NONE );
  }

  @After
  public void tearDown() {
    Fixture.tearDown();
  }

  @Test
  public void testCreateBrowserFunction() {
    BrowserFunction function = new BrowserFunction( browser, FUNC );
    assertFalse( function.isDisposed() );
    assertSame( browser, function.getBrowser() );
    assertEquals( FUNC, function.getName() );
    assertEquals( 1, getBrowserFunctions().length );
    assertSame( function, getBrowserFunctions()[ 0 ] );
  }

  @Test
  public void testCreateBrowserFunctionWithDuplicateName() {
    BrowserFunction function1 = new BrowserFunction( browser, FUNC );
    BrowserFunction function2 = new BrowserFunction( browser, FUNC );
    assertFalse( function1.isDisposed() );
    assertEquals( 1, getBrowserFunctions().length );
    assertSame( function2, getBrowserFunctions()[ 0 ] );
  }

  @Test
  public void testDispose() {
    BrowserFunction function = new BrowserFunction( browser, FUNC );
    function.dispose();
    assertTrue( function.isDisposed() );
    assertEquals( 0, getBrowserFunctions().length );
  }

  @Test
  public void testGetName() {
    BrowserFunction function = new BrowserFunction( browser, FUNC );
    assertEquals( FUNC, function.getName() );
  }

  @Test
  public void testGetBrowser() {
    BrowserFunction function = new BrowserFunction( browser, FUNC );
    assertEquals( browser, function.getBrowser() );
  }

  @Test
  public void testDisposeBrowser() {
    BrowserFunction function = new BrowserFunction( browser, FUNC );
    browser.dispose();
    assertTrue( function.isDisposed() );
  }

  @Test
  public void testConstructorWithNullBrowser() {
    try {
      new BrowserFunction( null, FUNC );
      fail();
    } catch( IllegalArgumentException expected ) {
    }
  }

  @Test
  public void testConstructorWithNullName() {
    try {
      new BrowserFunction( browser, null );
      fail();
    } catch( IllegalArgumentException expected ) {
    }
  }

  @Test
  public void testConstructorWithDisposedBrowser() {
    browser.dispose();
    try {
      new BrowserFunction( browser, FUNC );
      fail();
    } catch( SWTException expected ) {
    }
  }

  @Test
  public void testDuplicateFunction() {
    BrowserFunction function1 = new BrowserFunction( browser, FUNC );
    IBrowserAdapter adapter
      = browser.getAdapter( IBrowserAdapter.class );
    BrowserFunction[] functions = adapter.getBrowserFunctions();
    assertEquals( 1, functions.length );
    assertSame( function1, functions[ 0 ] );
    BrowserFunction function2 = new BrowserFunction( browser, FUNC );
    functions = adapter.getBrowserFunctions();
    assertEquals( 1, functions.length );
    assertSame( function2, functions[ 0 ] );
  }

  private BrowserFunction[] getBrowserFunctions() {
    Object adapter = browser.getAdapter( IBrowserAdapter.class );
    IBrowserAdapter browserAdapter = ( IBrowserAdapter )adapter;
    return browserAdapter.getBrowserFunctions();
  }

}
