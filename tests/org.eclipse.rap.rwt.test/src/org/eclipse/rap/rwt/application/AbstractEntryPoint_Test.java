/*******************************************************************************
 * Copyright (c) 2013, 2013 EclipseSource and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    EclipseSource - initial API and implementation
 ******************************************************************************/
package org.eclipse.rap.rwt.application;

import static org.eclipse.rap.rwt.internal.service.ContextProvider.getApplicationContext;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertSame;
import static org.mockito.Mockito.mock;

import java.io.IOException;
import java.util.concurrent.atomic.AtomicReference;

import org.eclipse.rap.rwt.internal.application.ApplicationContextImpl;
import org.eclipse.rap.rwt.internal.lifecycle.LifeCycle;
import org.eclipse.rap.rwt.internal.lifecycle.LifeCycleFactory;
import org.eclipse.rap.rwt.lifecycle.PhaseId;
import org.eclipse.rap.rwt.lifecycle.PhaseListener;
import org.eclipse.rap.rwt.testfixture.Fixture;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Shell;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;


public class AbstractEntryPoint_Test {

  @Before
  public void setUp() {
    Fixture.setUp();
    Fixture.fakePhase( PhaseId.PROCESS_ACTION );
    LifeCycleFactory lifeCycleFactory = getApplicationContext().getLifeCycleFactory();
    lifeCycleFactory.configure( TestLifeCycle.class );
    lifeCycleFactory.activate();
  }

  @After
  public void tearDown() {
    Fixture.tearDown();
  }

  @Test
  public void testCreateUI_createsDisplayAndShells() {
    AbstractEntryPoint entryPoint = new AbstractEntryPoint() {
      @Override
      protected void createContents( Composite parent ) {
      }
    };

    entryPoint.createUI();

    assertEquals( 1, Display.getCurrent().getShells().length );
  }

  @Test
  public void testCreateContents_parentHasLayout() {
    final AtomicReference<Composite> parentCaptor = new AtomicReference<Composite>();
    AbstractEntryPoint entryPoint = new AbstractEntryPoint() {
      @Override
      protected void createContents( Composite parent ) {
        parentCaptor.set( parent );
      }
    };

    entryPoint.createUI();

    assertNotNull( parentCaptor.get().getLayout() );
  }

  @Test
  public void testGetShell_returnsParentShell() {
    final AtomicReference<Composite> parentCaptor = new AtomicReference<Composite>();
    final AtomicReference<Shell> shellCaptor = new AtomicReference<Shell>();
    AbstractEntryPoint entryPoint = new AbstractEntryPoint() {
      @Override
      protected void createContents( Composite parent ) {
        parentCaptor.set( getShell() );
        shellCaptor.set( getShell() );
      }
    };

    entryPoint.createUI();

    assertSame( parentCaptor.get().getShell(), shellCaptor.get() );
  }

  @Test
  public void testCreateShell() {
    final Shell testShell = mock( Shell.class );
    final AtomicReference<Shell> shellCaptor = new AtomicReference<Shell>();
    AbstractEntryPoint entryPoint = new AbstractEntryPoint() {
      @Override
      protected void createContents( Composite parent ) {
        shellCaptor.set( getShell() );
      }
      @Override
      protected Shell createShell( Display display ) {
        return testShell;
      }
    };

    entryPoint.createUI();

    assertSame( testShell, shellCaptor.get() );
  }

  static class TestLifeCycle extends LifeCycle {
    public TestLifeCycle( ApplicationContextImpl applicationContext ) {
      super( applicationContext );
    }
    @Override
    public void execute() throws IOException {
    }
    @Override
    public void requestThreadExec( Runnable runnable ) {
    }
    @Override
    public void addPhaseListener( PhaseListener phaseListener ) {
    }
    @Override
    public void removePhaseListener( PhaseListener phaseListener ) {
    }
    @Override
    public void sleep() {
    }
  }

}
