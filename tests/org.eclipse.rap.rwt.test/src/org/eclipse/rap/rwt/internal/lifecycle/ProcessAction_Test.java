/*******************************************************************************
 * Copyright (c) 2011 EclipseSource and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    EclipseSource - initial API and implementation
 ******************************************************************************/
package org.eclipse.rap.rwt.internal.lifecycle;

import junit.framework.TestCase;

import org.eclipse.rap.rwt.lifecycle.PhaseId;
import org.eclipse.rap.rwt.testfixture.Fixture;
import org.eclipse.swt.SWT;
import org.eclipse.swt.events.ShellAdapter;
import org.eclipse.swt.events.ShellEvent;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Shell;


public class ProcessAction_Test extends TestCase {
  
  private ProcessAction processAction;

  public void testGetPhaseId() {
    assertEquals( PhaseId.PROCESS_ACTION, processAction.getPhaseId() );
  }
  
  public void testExecute() {
    final boolean[] wasExecuted = { false };
    Display display = new Display();
    Shell shell = new Shell( display );
    shell.open();
    shell.addShellListener( new ShellAdapter() {
      public void shellClosed( ShellEvent event ) {
        wasExecuted[ 0 ] = true;
      }
    } );
    shell.notifyListeners( SWT.Close, null );
    
    PhaseId phaseId = processAction.execute( display );
    
    assertEquals( PhaseId.RENDER, phaseId );
    assertTrue( wasExecuted[ 0 ] );
  }
  
  protected void setUp() throws Exception {
    Fixture.setUp();
    Fixture.fakePhase( PhaseId.PROCESS_ACTION );
    processAction = new ProcessAction();
  }
  
  protected void tearDown() throws Exception {
    Fixture.tearDown();
  }
}
