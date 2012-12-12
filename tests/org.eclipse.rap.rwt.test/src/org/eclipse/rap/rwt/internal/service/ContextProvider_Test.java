/*******************************************************************************
 * Copyright (c) 2002, 2012 Innoopract Informationssysteme GmbH and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    Innoopract Informationssysteme GmbH - initial API and implementation
 *    EclipseSource - ongoing implementation
 ******************************************************************************/
package org.eclipse.rap.rwt.internal.service;

import junit.framework.TestCase;

import org.eclipse.rap.rwt.internal.application.ApplicationContextUtil;
import org.eclipse.rap.rwt.service.UISession;
import org.eclipse.rap.rwt.testfixture.Fixture;
import org.eclipse.rap.rwt.testfixture.TestRequest;
import org.eclipse.rap.rwt.testfixture.TestResponse;


public class ContextProvider_Test extends TestCase {

  public void testThreadLocalFunctionalityWithCurrentThread() {
    assertFalse( ContextProvider.hasContext() );
    TestResponse response = new TestResponse();
    TestRequest request = new TestRequest();
    ServiceContext serviceContext = new ServiceContext( request, response );
    ContextProvider.setContext( serviceContext );
    assertTrue( ContextProvider.hasContext() );
    ContextProvider.disposeContext();
    assertFalse( ContextProvider.hasContext() );
  }

  public void testThreadLocalFunctionalityWithAnyThread() throws Exception {
    TestResponse response = new TestResponse();
    TestRequest request = new TestRequest();
    ServiceContext serviceContext = new ServiceContext( request, response );

    final boolean[] hasContext = new boolean[ 1 ];
    Thread thread1 = new Thread() {
      public void run() {
        hasContext[ 0 ] = ContextProvider.hasContext();
      }
    };
    ContextProvider.setContext( serviceContext, thread1 );
    thread1.start();
    thread1.join();

    assertTrue( hasContext[ 0 ] );
    assertFalse( ContextProvider.hasContext() );

    hasContext[ 0 ] = false;
    Thread thread2 = new Thread() {
      public void run() {
        hasContext[ 0 ] = ContextProvider.hasContext();
      }
    };
    ContextProvider.setContext( serviceContext, thread2 );
    ContextProvider.disposeContext( thread2 );
    thread2.start();
    thread2.join();

    assertFalse( hasContext[ 0 ] );
    assertFalse( ContextProvider.hasContext() );

    hasContext[ 0 ] = true;
    final boolean[] useMapped = { false };
    Thread thread3 = new Thread() {
      public void run() {
        useMapped[ 0 ] = ContextProvider.releaseContextHolder();
        hasContext[ 0 ] = ContextProvider.hasContext();
      }
    };
    ContextProvider.setContext( serviceContext, thread3 );
    thread3.start();
    thread3.join();

    assertTrue( useMapped[ 0 ] );
    assertFalse( hasContext[ 0 ] );
  }

  public void testContextCreation() {
    TestResponse response = new TestResponse();
    try {
      new ServiceContext( null, response );
      fail( "Request parameter must not be null." );
    } catch( NullPointerException npe ) {
    }

    try {
      TestRequest request = new TestRequest();
      new ServiceContext( request, null );
      fail( "Response parameter must not be null." );
    } catch( NullPointerException npe ) {
    }
  }

  public void testApplicationContextIsAttachedToUISession() {
    Fixture.createServiceContext();

    UISession uiSession = ContextProvider.getUISession();

    assertNotNull( ApplicationContextUtil.get( uiSession ) );
  }

  @Override
  protected void setUp() throws Exception {
    Fixture.createApplicationContext();
  }

  protected void tearDown() throws Exception {
    if( ContextProvider.hasContext() ) {
      Fixture.disposeOfServiceContext();
    }
    Fixture.disposeOfApplicationContext();
    Fixture.disposeOfServletContext();
  }
}
