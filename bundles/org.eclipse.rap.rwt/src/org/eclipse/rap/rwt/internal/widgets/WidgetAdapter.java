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

package org.eclipse.rap.rwt.internal.widgets;

import java.util.HashMap;
import java.util.Map;

public final class WidgetAdapter implements IWidgetAdapter {
  
  private final String id;
  private boolean initialized;
  private final Map preservedValues;
  private String jsParent;

  public WidgetAdapter() {
    id = IdGenerator.getInstance().newId();
    preservedValues = new HashMap();
  }
  
  public String getId() {
    return id;
  }

  public boolean isInitialized() {
    return initialized;
  }

  public void setInitialized( boolean initialized ) {
    this.initialized = initialized;
  }

  public void preserve( final String propertyName, final Object value ) {
    preservedValues.put( propertyName, value );
  }
  
  public Object getPreserved( final String propertyName ) {
    return preservedValues.get( propertyName );
  }

  public void clearPreserved() {
    preservedValues.clear();
  }

  public String getJSParent() {
    return jsParent;
  }

  public void setJSParent( final String jsParent ) {
    this.jsParent = jsParent;
  }
}
