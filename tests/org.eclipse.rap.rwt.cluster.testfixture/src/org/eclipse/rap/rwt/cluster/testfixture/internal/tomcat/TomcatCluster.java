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
package org.eclipse.rap.rwt.cluster.testfixture.internal.tomcat;

import java.util.LinkedList;
import java.util.List;

import org.eclipse.rap.rwt.application.EntryPoint;
import org.eclipse.rap.rwt.cluster.testfixture.internal.server.DelegatingServletEngine;
import org.eclipse.rap.rwt.cluster.testfixture.server.IServletEngine;
import org.eclipse.rap.rwt.cluster.testfixture.server.IServletEngineCluster;


public class TomcatCluster implements IServletEngineCluster {
  private final List<DelegatingServletEngine> servletEngines;
  
  public TomcatCluster() {
    servletEngines = new LinkedList<DelegatingServletEngine>();
  }
  
  public IServletEngine addServletEngine() {
    TomcatEngine tomcatEngine = new TomcatEngine();
    return addServletEngine( tomcatEngine );
  }

  public IServletEngine addServletEngine( int port ) {
    TomcatEngine tomcatEngine = new TomcatEngine( port );
    return addServletEngine( tomcatEngine );
  }
  
  public void removeServletEngine( IServletEngine servletEngine ) {
    checkBelongsToCluster( servletEngine );
    DelegatingServletEngine delegatingServletEngine = ( DelegatingServletEngine )servletEngine;
    TomcatEngine tomcatEngine = ( TomcatEngine )delegatingServletEngine.getDelegate();
    tomcatEngine.getEngine().setCluster( null );
  }

  public void start( Class<? extends EntryPoint> entryPointClass ) throws Exception {
    for( DelegatingServletEngine servletEngine : servletEngines ) {
      configureEngine( ( TomcatEngine )servletEngine.getDelegate() );
      servletEngine.start( entryPointClass );
    }
  }

  public void stop() throws Exception {
    for( IServletEngine servletEngine : servletEngines ) {
      servletEngine.stop();
    }
  }

  private IServletEngine addServletEngine( TomcatEngine tomcatEngine ) {
    DelegatingServletEngine result = new DelegatingServletEngine( tomcatEngine );
    servletEngines.add( result );
    return result;
  }

  private static void configureEngine( TomcatEngine servletEngine ) {
    new ClusterConfigurer( servletEngine.getEngine() ).configure();
  }

  private void checkBelongsToCluster( IServletEngine servletEngine ) {
    if( !servletEngines.contains( servletEngine ) ) {
      String msg = "Servlet engine does not belong to cluster: " + servletEngine;
      throw new IllegalArgumentException( msg );
    }
  }
}
