/*******************************************************************************
 * Copyright (c) 2002-2006 Innoopract Informationssysteme GmbH.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 * 
 * Contributors:
 *     Innoopract Informationssysteme GmbH - initial API and implementation
 ******************************************************************************/

package org.eclipse.rap.rwt.events;

import com.w4t.Adaptable;
import com.w4t.event.Event;

/**
 * TODO: [fappel] comment
 */
public final class DisposeEvent extends Event {

  public static final int WIDGET_DISPOSED = 0;
  private static final Class LISTENER = DisposeListener.class;


  public DisposeEvent( final Object source ) {
    super( source, WIDGET_DISPOSED );
  }

  protected void dispatchToObserver( final Object listener ) {
    ( ( DisposeListener )listener ).widgetDisposed( this );
  }

  protected Class getListenerType() {
    return LISTENER;
  }

  public static void addListener( final Adaptable adaptable, 
                                  final DisposeListener listener )
  {
    addListener( adaptable, LISTENER, listener );
  }

  public static void removeListener( final Adaptable adaptable, 
                                     final DisposeListener listener )
  {
    removeListener( adaptable, LISTENER, listener );
  }
  
  public static boolean hasListener( final Adaptable adaptable ) {
    return hasListener( adaptable, LISTENER );
  }
  
  public static Object[] getListeners( final Adaptable adaptable ) {
    return getListener( adaptable, LISTENER );
  }
}