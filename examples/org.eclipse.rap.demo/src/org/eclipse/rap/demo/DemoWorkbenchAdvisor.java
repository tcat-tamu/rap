/*******************************************************************************
 * Copyright (c) 2002, 2008 Innoopract Informationssysteme GmbH.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     Innoopract Informationssysteme GmbH - initial API and implementation
 ******************************************************************************/

package org.eclipse.rap.demo;

import org.eclipse.rap.rwt.lifecycle.UICallBack;
import org.eclipse.swt.widgets.Display;
import org.eclipse.ui.application.*;


public class DemoWorkbenchAdvisor extends WorkbenchAdvisor {

  public void initialize( IWorkbenchConfigurer configurer ) {
    getWorkbenchConfigurer().setSaveAndRestore( true );
    super.initialize( configurer );
  }
  
  @Override
  public void preStartup() {
    UICallBack.activate( String.valueOf( this.hashCode() ));
    super.preStartup();
  }

  public String getInitialWindowPerspectiveId() {
    return "org.eclipse.rap.demo.perspective";
  }
  
  public WorkbenchWindowAdvisor createWorkbenchWindowAdvisor(
    final IWorkbenchWindowConfigurer windowConfigurer )
  {
    return new DemoWorkbenchWindowAdvisor( windowConfigurer );
  }
  
  @Override
  public boolean preShutdown() {
    UICallBack.deactivate( String.valueOf( this.hashCode() ));
    return super.preShutdown();
  }
}
