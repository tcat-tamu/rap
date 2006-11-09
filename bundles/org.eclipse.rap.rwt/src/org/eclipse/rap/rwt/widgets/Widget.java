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

package org.eclipse.rap.rwt.widgets;

import org.eclipse.rap.rwt.events.DisposeEvent;
import org.eclipse.rap.rwt.events.DisposeListener;
import com.w4t.*;
import com.w4t.event.EventAdapter;
import com.w4t.event.IEventAdapter;

/**
 * TODO: [fappel] comment
 * <p>
 * </p>
 */
public abstract class Widget implements Adaptable {

  // TODO: [gr�ver]: copy from swt
  /* Default size for widgets */
  static final int DEFAULT_WIDTH = 64;
  static final int DEFAULT_HEIGHT = 64;
  int style;
  private IEventAdapter eventAdapter;
  private boolean disposed;

  Widget() {
  }

  public Widget( final Widget parent, final int style ) {
    ParamCheck.notNull( parent, "parent" );
    this.style = style;
  }

  public Object getAdapter( final Class adapter ) {
    Object result = null;
    if( adapter == IEventAdapter.class ) {
      // //////////////////////////////////////////////////////
      // Note: This is not implemented via the AdapterManager,
      // since the manager's mapping mechanism prevents
      // the component being released unless the session
      // is invalidated.
      if( eventAdapter == null ) {
        eventAdapter = new EventAdapter();
      }
      result = eventAdapter;
    } else {
      result = W4TContext.getAdapterManager().getAdapter( this, adapter );
    }
    return result;
  }

  public abstract Display getDisplay();

  public int getStyle() {
    return style;
  }

  
  ///////////////////////////////////////////////
  // Registration and deregistration of listeners
  
  public void addDisposeListener( final DisposeListener listener ) {
    DisposeEvent.addListener( this, listener );
  }

  public void removeDisposeListener( final DisposeListener listener ) {
    DisposeEvent.removeListener( this, listener );
  }
  

  ///////////////////////////////////
  // Methods to dispose of the widget
  
  public final void dispose() {
    if( !isDisposed() ) {
      DisposeEvent disposeEvent = new DisposeEvent( this );
      disposeEvent.processEvent();
      releaseChildren();
      releaseParent();
      releaseWidget();
      disposed = true;
    }
  }

  public boolean isDisposed() {
    return disposed;
  }

  abstract void releaseChildren();

  abstract void releaseParent();

  abstract void releaseWidget();

  // copied from SWT
  static int checkBits( final int style,
                        final int int0,
                        final int int1,
                        final int int2,
                        final int int3,
                        final int int4,
                        final int int5 )
  {
    int mask = int0 | int1 | int2 | int3 | int4 | int5;
    int result = style;
    if( ( result & mask ) == 0 ) {
      result |= int0;
    }
    if( ( result & int0 ) != 0 ) {
      result = ( result & ~mask ) | int0;
    }
    if( ( result & int1 ) != 0 ) {
      result = ( result & ~mask ) | int1;
    }
    if( ( result & int2 ) != 0 ) {
      result = ( result & ~mask ) | int2;
    }
    if( ( result & int3 ) != 0 ) {
      result = ( result & ~mask ) | int3;
    }
    if( ( result & int4 ) != 0 ) {
      result = ( result & ~mask ) | int4;
    }
    if( ( result & int5 ) != 0 ) {
      result = ( result & ~mask ) | int5;
    }
    return result;
  }
}
