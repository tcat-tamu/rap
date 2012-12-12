/*******************************************************************************
 * Copyright (c) 2008, 2011 Innoopract Informationssysteme GmbH and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    Innoopract Informationssysteme GmbH - initial API and implementation
 *    EclipseSoource - ongoing development
 ******************************************************************************/
package org.eclipse.rap.rwt.internal.theme.css;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.eclipse.rap.rwt.internal.theme.IThemeCssElement;


/**
 * Holds all registered {@link IThemeCssElement}s.
 */
public class CssElementHolder {

  private final Map<String, IThemeCssElement> elements;

  public CssElementHolder() {
    elements = new HashMap<String,IThemeCssElement>();
  }

  public void addElement( IThemeCssElement element ) {
    if( elements.containsKey( element.getName() ) ) {
      String message = "An element with this name is already defined: " + element.getName();
      throw new IllegalArgumentException( message );
    }
    elements.put( element.getName(), element );
  }

  public IThemeCssElement[] getAllElements() {
    Collection<IThemeCssElement> values = elements.values();
    return values.toArray( new IThemeCssElement[ values.size() ] );
  }

  public void clear() {
    elements.clear();
  }

}
