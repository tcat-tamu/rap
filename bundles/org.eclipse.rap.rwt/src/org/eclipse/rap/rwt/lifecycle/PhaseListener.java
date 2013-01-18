/*******************************************************************************
 * Copyright (c) 2002, 2013 Innoopract Informationssysteme GmbH and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    Innoopract Informationssysteme GmbH - initial API and implementation
 *    EclipseSource - ongoing development
 ******************************************************************************/
package org.eclipse.rap.rwt.lifecycle;

import java.io.Serializable;
import java.util.EventListener;

import org.eclipse.rap.rwt.application.Application;


/**
 * An interface implemented by objects that wish to be notified at the beginning
 * and ending of processing for each standard phase of the request processing
 * lifecycle.
 *
 * @since 2.0
 * @see Application#addPhaseListener(PhaseListener)
 */
// TODO [rh] why is this Serializable?
public interface PhaseListener extends EventListener, Serializable {

  /**
   * <p>
   * Handle a notification that the processing for a particular phase of the
   * request processing lifecycle is about to begin.
   *
   * @param event the {@link PhaseEvent}
   * </p>
   */
  public void beforePhase( PhaseEvent event );

  /**
   * <p>
   * Handle a notification that the processing for a particular phase has just
   * been completed.
   *
   * @param event the {@link PhaseEvent}
   * </p>
   */
  public void afterPhase( PhaseEvent event );

  /**
   * <p>
   * Return the identifier of the request processing phase during which this
   * listener is interested in processing {@link PhaseEvent} events. Legal
   * values are the singleton instances defined by the {@link PhaseId} class,
   * including <code>PhaseId.ANY</code> to indicate an interest in being
   * notified for all standard phases.
   * </p>
   *
   * @return instance of {@link PhaseId}
   */
  public PhaseId getPhaseId();
}
