/*******************************************************************************
 * Copyright (c) 2007, 2012 NOMAD business software GmbH and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    Samy Abou-Shama NOMAD business software GmbH - initial Databinding migration
 *    EclipseSource - ongoing development
 ******************************************************************************/
package org.eclipse.rap.demo.databinding;

import org.eclipse.ui.*;


public class DataBindingPerspective implements IPerspectiveFactory {

  public static final String ID
    = "org.eclipse.rap.demo.databinding.DataBindingPerspective";

  private static final String DEMO_PERSPECTIVE_DEFAULT
    = "org.eclipse.rap.demo.perspective";
  private static final String DEMO_PERSPECTIVE_PLANNING
    = "org.eclipse.rap.demo.perspective.planning";
  private static final String TEST_MASTER_DETAIL_VIEW
    = "org.eclipse.rap.demo.databinding.nestedselection.TestMasterDetailView";
  private static final String DATABINDING_SNIPPETS_VIEW
    = "org.eclipse.rap.demo.databinding.DatabindingSnippetsView";

  public void createInitialLayout( final IPageLayout layout ) {
    String editorArea = layout.getEditorArea();
    layout.setEditorAreaVisible( false );
    IFolderLayout topLeft = layout.createFolder( "topLeft",
                                                 IPageLayout.LEFT,
                                                 0.25f,
                                                 editorArea );
    topLeft.addView( DATABINDING_SNIPPETS_VIEW );
    topLeft.addView( TEST_MASTER_DETAIL_VIEW );
    // add shortcuts to show view menu
    layout.addShowViewShortcut( DATABINDING_SNIPPETS_VIEW );
    // add shortcut for other perspective
    layout.addPerspectiveShortcut( DEMO_PERSPECTIVE_DEFAULT );
    layout.addPerspectiveShortcut( DEMO_PERSPECTIVE_PLANNING );
  }
}
