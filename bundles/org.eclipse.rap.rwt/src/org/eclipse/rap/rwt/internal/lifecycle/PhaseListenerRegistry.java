/*******************************************************************************
 * Copyright (c) 2002, 2012 Innoopract Informationssysteme GmbH and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    Innoopract Informationssysteme GmbH - initial API and implementation
 *    Frank Appel - replaced singletons and static fields (Bug 337787)
 *    EclipseSource - ongoing development
 ******************************************************************************/
package org.eclipse.rap.rwt.internal.lifecycle;

import java.util.HashSet;
import java.util.Set;

import org.eclipse.rap.rwt.internal.util.ParamCheck;
import org.eclipse.rap.rwt.lifecycle.PhaseListener;


public class PhaseListenerRegistry {
  private final Set<PhaseListener> phaseListeners;

  public PhaseListenerRegistry() {
    phaseListeners = new HashSet<PhaseListener>();
  }

  public void add( PhaseListener listener ) {
    ParamCheck.notNull( listener, "listener" );
    phaseListeners.add( listener );
  }

  public void remove( PhaseListener listener ) {
    ParamCheck.notNull( listener, "listener" );
    phaseListeners.remove( listener );
  }

  public void removeAll() {
    phaseListeners.clear();
  }

  public PhaseListener[] getAll() {
    PhaseListener[] result = new PhaseListener[ phaseListeners.size() ];
    phaseListeners.toArray( result );
    return result;
  }
}
