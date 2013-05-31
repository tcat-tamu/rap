/*******************************************************************************
 * Copyright (c) 2011, 2013 EclipseSource and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    EclipseSource - initial API and implementation
 ******************************************************************************/
package org.eclipse.rap.rwt.internal.application;

import org.eclipse.rap.rwt.service.ResourceManager;


public class ApplicationContextHelper {

  public static void setSkipResoureRegistration( boolean ignore ) {
    ApplicationContextImpl.skipResoureRegistration = ignore;
  }

  public static void setSkipResoureDeletion( boolean ignore ) {
    ApplicationContextImpl.skipResoureDeletion = ignore;
  }

  public static void fakeResourceManager( ResourceManager fake ) {
    ApplicationContextImpl.testResourceManager = fake;
  }

}
