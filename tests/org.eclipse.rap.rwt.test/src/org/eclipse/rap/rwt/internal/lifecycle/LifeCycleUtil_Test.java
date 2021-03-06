/*******************************************************************************
 * Copyright (c) 2011, 2015 EclipseSource and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    EclipseSource - initial API and implementation
 ******************************************************************************/
package org.eclipse.rap.rwt.internal.lifecycle;

import static org.eclipse.rap.rwt.testfixture.internal.ConcurrencyTestUtil.runInThread;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertSame;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;

import java.util.concurrent.atomic.AtomicReference;

import org.eclipse.rap.rwt.RWT;
import org.eclipse.rap.rwt.internal.application.ApplicationContextImpl;
import org.eclipse.rap.rwt.internal.service.ContextProvider;
import org.eclipse.rap.rwt.internal.service.UISessionImpl;
import org.eclipse.rap.rwt.service.UISession;
import org.eclipse.rap.rwt.testfixture.internal.Fixture;
import org.eclipse.rap.rwt.testfixture.internal.TestHttpSession;
import org.eclipse.swt.widgets.Display;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;


public class LifeCycleUtil_Test {

  @Before
  public void setUp() {
    Fixture.setUp();
  }

  @After
  public void tearDown() {
    Fixture.tearDown();
  }

  @Test
  public void testGetSessionDisplayBeforeAnyDisplayCreated() {
    Display sessionDisplay = LifeCycleUtil.getSessionDisplay();

    assertNull( sessionDisplay );
  }

  @Test
  public void testGetSessionDisplayWithDisplayCreated() {
    Display display = new Display();

    Display sessionDisplay = LifeCycleUtil.getSessionDisplay();

    assertSame( display, sessionDisplay );
  }

  @Test
  public void testGetSessionDisplayAfterDisplayDisposed() {
    Display display = new Display();
    display.dispose();

    Display sessionDisplay = LifeCycleUtil.getSessionDisplay();

    assertSame( display, sessionDisplay );
  }

  @Test
  public void testGetSessionDisplayFromBackgroundThreadWithoutContext() throws Throwable {
    final AtomicReference<Display> sessionDisplay = new AtomicReference<>();

    runInThread( new Runnable() {
      @Override
      public void run() {
        sessionDisplay.set( LifeCycleUtil.getSessionDisplay() );
      }
    } );

    assertNull( sessionDisplay.get() );
  }

  @Test
  public void testGetSessionDisplayFromBackgroundThreadWithContext() throws Throwable {
    final Display display = new Display();
    final AtomicReference<Display> sessionDisplay = new AtomicReference<>();
    Runnable runnable = new Runnable() {
      @Override
      public void run() {
        RWT.getUISession( display ).exec( new Runnable() {
          @Override
          public void run() {
            sessionDisplay.set( LifeCycleUtil.getSessionDisplay() );
          }
        } );
      }
    };
    runInThread( runnable );
    assertSame( display, sessionDisplay.get() );
  }

  @Test
  public void testGetUIThreadForNewSession() {
    IUIThreadHolder uiThread = LifeCycleUtil.getUIThread( ContextProvider.getUISession() );

    assertNull( uiThread );
  }

  @Test
  public void testGetUIThreadWithMultipleSessions() {
    IUIThreadHolder uiThread1 = mock( IUIThreadHolder.class );
    IUIThreadHolder uiThread2 = mock( IUIThreadHolder.class );
    ApplicationContextImpl applicationContext = mock( ApplicationContextImpl.class );
    UISession uiSession1 = new UISessionImpl( applicationContext, new TestHttpSession() );
    UISession uiSession2 = new UISessionImpl( applicationContext, new TestHttpSession() );

    LifeCycleUtil.setUIThread( uiSession1, uiThread1 );
    LifeCycleUtil.setUIThread( uiSession2, uiThread2 );

    assertSame( uiThread1, LifeCycleUtil.getUIThread( uiSession1 ) );
    assertSame( uiThread2, LifeCycleUtil.getUIThread( uiSession2 ) );
  }

  @Test
  public void testIsStartup_withoutDisplayCreated() {
    assertTrue( LifeCycleUtil.isStartup() );
  }

  @Test
  public void testIsStartup_withStartupParameter() {
    assertTrue( LifeCycleUtil.isStartup() );
  }

  @Test
  public void testIsStartup_whenDisplayWasCreated() {
    new Display();

    assertFalse( LifeCycleUtil.isStartup() );
  }

}
