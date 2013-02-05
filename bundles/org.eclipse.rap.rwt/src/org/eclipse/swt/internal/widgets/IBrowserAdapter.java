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
package org.eclipse.swt.internal.widgets;

import org.eclipse.rap.rwt.widgets.BrowserCallback;
import org.eclipse.swt.browser.BrowserFunction;

//[ariddle] - Change browser to prevent hangs due to concurrent/stacked-up requests
public interface IBrowserAdapter {

  String getText();
  void sendProgressCompletedEvent();

//  String getExecuteScript();
  IBrowserScript getExecuteScript();
  void setExecuteResult( boolean executeResult, Object evalResult );
//  void setExecutePending( boolean executePending );
//  boolean getExecutePending();
  boolean hasUrlChanged();
  void resetUrlChanged();

  BrowserFunction[] getBrowserFunctions();
  void evaluateNonBlocking( String script, BrowserCallback browserCallback );
  
  public interface IBrowserScript {

    String getScript();

    void setExecutePending( boolean pending );
    boolean getExecutePending();
  }
}
