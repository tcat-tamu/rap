/*******************************************************************************
 * Copyright (c) 2011, 2012 EclipseSource and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    EclipseSource - initial API and implementation
 ******************************************************************************/
package org.eclipse.rap.rwt.cluster.testfixture.internal.server;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertSame;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.util.LinkedList;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.eclipse.rap.rwt.application.EntryPoint;
import org.eclipse.rap.rwt.cluster.testfixture.server.IServletEngine;
import org.eclipse.rap.rwt.cluster.testfixture.test.TestEntryPoint;
import org.junit.Before;
import org.junit.Test;


public class DelegatingServletEngine_Test {

  private TestServletEngine testServletEngine;

  @Before
  public void setUp() throws Exception {
    testServletEngine = new TestServletEngine();
  }

  @Test
  public void testGetDelegate() {
    TestServletEngine delegate = new TestServletEngine();

    DelegatingServletEngine engine = new DelegatingServletEngine( delegate );

    assertSame( delegate, engine.getDelegate() );
  }

  @Test
  public void testStartWithNullEntryPointClass() throws Exception {
    IServletEngine engine = new DelegatingServletEngine( testServletEngine );
    try {
      engine.start( null );
      fail();
    } catch( NullPointerException expected ) {
    }
  }

  @Test
  public void testStartDelegates() throws Exception {
    IServletEngine engine = new DelegatingServletEngine( testServletEngine );

    engine.start( TestEntryPoint.class );

    assertEquals( TestServletEngine.START, testServletEngine.invocations.get( 0 ) );
  }

  @Test
  public void testStartMultipleTimes() throws Exception {
    IServletEngine engine = startServletEngine( TestEntryPoint.class );
    try {
      engine.start( TestEntryPoint.class );
      fail();
    } catch( IllegalStateException e ) {
    }
  }

  @Test
  public void testGetSessionsDelegates() throws Exception {
    IServletEngine engine = new DelegatingServletEngine( testServletEngine );
    engine.start( TestEntryPoint.class );

    engine.getSessions();

    assertTrue( testServletEngine.invocations.contains( TestServletEngine.START ) );
  }

  @Test
  public void testGetSessionsAfterStop() throws Exception {
    IServletEngine engine = startServletEngine( TestEntryPoint.class );
    engine.stop();

    try {
      engine.getSessions();
      fail();
    } catch( IllegalStateException expected ) {
    }
  }

  @Test
  public void testStopDelegates() throws Exception {
    IServletEngine engine = new DelegatingServletEngine( testServletEngine );
    engine.start( TestEntryPoint.class );

    engine.stop();

    assertTrue( testServletEngine.invocations.contains( TestServletEngine.STOP ) );
  }

  @Test
  public void testStopTimeoutDelegates() throws Exception {
    IServletEngine engine = new DelegatingServletEngine( testServletEngine );
    engine.start( TestEntryPoint.class );

    engine.stop( 0 );

    assertTrue( testServletEngine.invocations.contains( TestServletEngine.STOP ) );
  }

  @Test
  public void testGetPortDelegates() throws Exception {
    IServletEngine engine = new DelegatingServletEngine( testServletEngine );
    engine.start( TestEntryPoint.class );

    engine.getPort();

    assertTrue( testServletEngine.invocations.contains( TestServletEngine.GET_PORT ) );
  }

  private IServletEngine startServletEngine( Class<? extends EntryPoint> entryPoint )
    throws Exception
  {
    IServletEngine result = new DelegatingServletEngine( testServletEngine );
    result.start( entryPoint );
    return result;
  }

  private static class TestServletEngine implements IServletEngine {
    static final String START = "start";
    static final String STOP = "stop";
    static final String GET_PORT = "getPort";
    static final String GET_SESSIONS = "getSessions";

    List<String> invocations;

    public TestServletEngine() {
      invocations = new LinkedList<String>();
    }

    public void start( Class<? extends EntryPoint> entryPointClass ) throws Exception {
      invocations.add( START );
    }

    public void stop() throws Exception {
      invocations.add( STOP );
    }

    public void stop( int timeout ) throws Exception {
      invocations.add( STOP );
    }

    public int getPort() {
      invocations.add( GET_PORT );
      return 0;
    }

    public HttpSession[] getSessions() {
      invocations.add( GET_SESSIONS );
      return null;
    }
  }

}
