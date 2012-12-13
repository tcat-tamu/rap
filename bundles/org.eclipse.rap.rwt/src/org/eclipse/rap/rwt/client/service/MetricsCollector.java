/*******************************************************************************
 * Copyright (c) 2012 EclipseSource and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    EclipseSource - initial API and implementation
 ******************************************************************************/
package org.eclipse.rap.rwt.client.service;

import org.eclipse.swt.widgets.Display;


public interface MetricsCollector {

  void logMetrics( String id,
                   int requestCounter,
                   long parseDuration,
                   long processDuration,
                   String mesg );

  void logConnectionInfo( String id, String connectionInfo );

  void logMarker( String id, String markerDesc );

  void logClientCapture( String id, String clientCapture );

  void mapDisplay( String id, Display display );
}
