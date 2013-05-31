/*******************************************************************************
 * Copyright (c) 2009, 2013 EclipseSource and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    EclipseSource - initial API and implementation
 ******************************************************************************/
package org.eclipse.rap.examples.pages;

import org.eclipse.rap.examples.ExampleUtil;
import org.eclipse.rap.examples.IExamplePage;
import org.eclipse.rap.examples.pages.internal.ImageUtil;
import org.eclipse.swt.SWT;
import org.eclipse.swt.custom.CLabel;
import org.eclipse.swt.events.SelectionAdapter;
import org.eclipse.swt.events.SelectionEvent;
import org.eclipse.swt.graphics.Image;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Group;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.Link;


public class LabelExample implements IExamplePage {

  public void createControl( Composite parent ) {
    parent.setLayout( ExampleUtil.createMainLayout( 1 ) );
    createTextLabels( parent );
    createAlignedLabels( parent );
    createImageLabels( parent );
    createCLabels( parent );
    createLinks( parent );
  }

  private static void createTextLabels( Composite parent ) {
    Group textGroup = new Group( parent, SWT.NONE );
    textGroup.setLayoutData( new GridData( SWT.FILL, SWT.TOP, true, false ) );
    textGroup.setText( "Text Labels" );
    textGroup.setLayout( ExampleUtil.createGridLayout( 2, false, true, true ) );
    Label simpleLabel = new Label( textGroup, SWT.NONE );
    simpleLabel.setText( "A simple text label." );
    Label wrappedLabel = new Label( textGroup, SWT.BORDER | SWT.WRAP );
    wrappedLabel.setText( "A fixed width label with a long text that wraps."
                          + " A long text that wraps. A long text that wraps."
                          + " A long text that wraps." );
    GridData wrappedData = new GridData( 200, SWT.DEFAULT );
    wrappedData.verticalSpan = 2;
    wrappedLabel.setLayoutData( wrappedData );
    Label borderLabel = new Label( textGroup, SWT.BORDER );
    borderLabel.setText( "A label with a border." );
  }

  private static void createAlignedLabels( Composite parent ) {
    Group group = new Group( parent, SWT.NONE );
    group.setLayoutData( new GridData( SWT.FILL, SWT.TOP, true, false ) );
    group.setText( "Alignment" );
    group.setLayout( ExampleUtil.createGridLayout( 3, false, true, true ) );
    Label leftLabel = new Label( group, SWT.BORDER | SWT.LEFT );
    leftLabel.setText( "These lines\nare\nleft-aligned" );
    leftLabel.setLayoutData( new GridData( SWT.FILL, SWT.TOP, true, false ) );
    Label centerLabel = new Label( group, SWT.BORDER | SWT.CENTER );
    centerLabel.setText( "These lines\nare\ncentered" );
    centerLabel.setLayoutData( new GridData( SWT.FILL, SWT.TOP, true, false ) );
    Label rightLabel = new Label( group, SWT.BORDER | SWT.RIGHT );
    rightLabel.setText( "These lines\nare\nright-aligned" );
    rightLabel.setLayoutData( new GridData( SWT.FILL, SWT.TOP, true, false ) );
  }

  private void createImageLabels( Composite parent ) {
    Group group = new Group( parent, SWT.NONE );
    group.setText( "Image Labels" );
    group.setLayoutData( new GridData( SWT.FILL, SWT.TOP, true, false ) );
    group.setLayout( ExampleUtil.createGridLayoutWithoutMargin( 1, false ) );
    Composite comp = new Composite( group, SWT.NONE );
    comp.setLayoutData( new GridData( SWT.CENTER, SWT.TOP, true, false ) );
    comp.setLayout( ExampleUtil.createGridLayout( 5, false, true, true ) );
    Display display = parent.getDisplay();
    Image image1 = ImageUtil.getImage( display, "emblem-system.png" );
    Image image2 = ImageUtil.getImage( display, "go-bottom.png" );
    Image image3 = ImageUtil.getImage( display, "system-search.png" );
    Label imageLabel1 = new Label( comp, SWT.NONE );
    imageLabel1.setImage( image1 );
    new Label( comp, SWT.SEPARATOR | SWT.VERTICAL );
    Label imageLabel2 = new Label( comp, SWT.NONE );
    imageLabel2.setImage( image2 );
    new Label( comp, SWT.SEPARATOR | SWT.VERTICAL );
    Label imageLabel3 = new Label( comp, SWT.NONE );
    imageLabel3.setImage( image3 );
  }

  private void createCLabels( Composite parent ) {
    Group group = new Group( parent, SWT.NONE );
    group.setText( "CLabel" );
    group.setLayoutData( new GridData( SWT.FILL, SWT.TOP, true, false ) );
    group.setLayout( ExampleUtil.createGridLayout( 3, false, true, true ) );
    Image image4 = ImageUtil.getImage( parent.getDisplay(), "button-image.gif" );
    CLabel cLabel1 = new CLabel( group, SWT.NONE );
    cLabel1.setText( "Image and text" );
    cLabel1.setImage( image4 );
    cLabel1.setAlignment( SWT.CENTER );
    cLabel1.setLayoutData( new GridData( SWT.FILL, SWT.TOP, true, false ) );
    CLabel cLabel2 = new CLabel( group, SWT.SHADOW_IN );
    cLabel2.setText( "Shadow-in style" );
    cLabel2.setImage( image4 );
    cLabel2.setAlignment( SWT.CENTER );
    cLabel2.setLayoutData( new GridData( SWT.FILL, SWT.TOP, true, false ) );
    CLabel cLabel3 = new CLabel( group, SWT.SHADOW_OUT );
    cLabel3.setText( "Shadow-out style" );
    cLabel3.setImage( image4 );
    cLabel3.setAlignment( SWT.CENTER );
    cLabel3.setLayoutData( new GridData( SWT.FILL, SWT.TOP, true, false ) );
  }

  private static void createLinks( Composite parent ) {
    Group group = new Group( parent, SWT.NONE );
    group.setText( "Links" );
    group.setLayoutData( new GridData( SWT.FILL, SWT.TOP, true, false ) );
    group.setLayout( ExampleUtil.createGridLayout( 1, false, true, true ) );
    Link link = new Link( group, SWT.NONE );
    link.setText( "A link widget with <a>two</a> embedded <a>hyperlinks</a>" );
    final Label linkLabel = new Label( group, SWT.NONE );
    linkLabel.setLayoutData( new GridData( SWT.FILL, SWT.TOP, true, false ) );
    link.addSelectionListener( new SelectionAdapter() {
      @Override
      public void widgetSelected( final SelectionEvent e ) {
        linkLabel.setText( "clicked \"" + e.text + "\"" );
      }
    } );
  }
}
