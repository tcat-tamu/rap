/*******************************************************************************
 * Copyright (c) 2011, 2012 EclipseSource and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    EclipseSource - initial API and implementation
 ******************************************************************************/
package org.eclipse.rap.rwt.internal.application;

import junit.framework.TestCase;

import org.eclipse.rap.rwt.testfixture.Fixture;


public class RWTFactory_Test extends TestCase {

  @Override
  protected void setUp() throws Exception {
    Fixture.setUp();
  }

  @Override
  protected void tearDown() throws Exception {
    Fixture.tearDown();
  }

  public void testApplicationScopedSingletons() {
    assertNotNull( RWTFactory.getThemeManager() );
    assertSame( RWTFactory.getThemeManager(), RWTFactory.getThemeManager() );

    assertNotNull( RWTFactory.getPhaseListenerRegistry() );
    assertSame( RWTFactory.getPhaseListenerRegistry(), RWTFactory.getPhaseListenerRegistry() );

    assertNotNull( RWTFactory.getLifeCycleFactory() );
    assertSame( RWTFactory.getLifeCycleFactory(), RWTFactory.getLifeCycleFactory() );

    assertNotNull( RWTFactory.getEntryPointManager() );
    assertSame( RWTFactory.getEntryPointManager(), RWTFactory.getEntryPointManager() );

    assertNotNull( RWTFactory.getResourceFactory() );
    assertSame( RWTFactory.getResourceFactory(), RWTFactory.getResourceFactory() );

    assertNotNull( RWTFactory.getImageFactory() );
    assertSame( RWTFactory.getImageFactory(), RWTFactory.getImageFactory() );

    assertNotNull( RWTFactory.getInternalImageFactory() );
    assertSame( RWTFactory.getInternalImageFactory(), RWTFactory.getInternalImageFactory() );

    assertNotNull( RWTFactory.getImageDataFactory() );
    assertSame( RWTFactory.getImageDataFactory(), RWTFactory.getImageDataFactory() );

    assertNotNull( RWTFactory.getFontDataFactory() );
    assertSame( RWTFactory.getFontDataFactory(), RWTFactory.getFontDataFactory() );

    assertNotNull( RWTFactory.getSettingStoreManager() );
    assertSame( RWTFactory.getSettingStoreManager(), RWTFactory.getSettingStoreManager() );

    assertNotNull( RWTFactory.getServiceManager() );
    assertSame( RWTFactory.getServiceManager(), RWTFactory.getServiceManager() );

    assertNotNull( RWTFactory.getResourceRegistry() );
    assertSame( RWTFactory.getResourceRegistry(), RWTFactory.getResourceRegistry() );

    assertNotNull( RWTFactory.getResourceDirectory() );
    assertSame( RWTFactory.getResourceDirectory(), RWTFactory.getResourceDirectory() );

    assertNotNull( RWTFactory.getResourceManager() );
    assertSame( RWTFactory.getResourceManager(), RWTFactory.getResourceManager() );

    assertNotNull( RWTFactory.getStartupPage() );
    assertSame( RWTFactory.getStartupPage(), RWTFactory.getStartupPage() );

    assertNotNull( RWTFactory.getDisplaysHolder() );
    assertSame( RWTFactory.getDisplaysHolder(), RWTFactory.getDisplaysHolder() );

    assertNotNull( RWTFactory.getTextSizeStorage() );
    assertSame( RWTFactory.getTextSizeStorage(), RWTFactory.getTextSizeStorage() );

    assertNotNull( RWTFactory.getProbeStore() );
    assertSame( RWTFactory.getProbeStore(), RWTFactory.getProbeStore() );

    assertNotNull( RWTFactory.getLifeCycleAdapterFactory() );
    assertSame( RWTFactory.getLifeCycleAdapterFactory(), RWTFactory.getLifeCycleAdapterFactory() );
  }

}
