/*******************************************************************************
 * Copyright (c) 2002, 2012 Innoopract Informationssysteme GmbH and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    Innoopract Informationssysteme GmbH - initial API and implementation
 *    EclipseSource - ongoing development
 ******************************************************************************/
package org.eclipse.swt.graphics;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.eclipse.rap.rwt.testfixture.Fixture;
import org.eclipse.swt.SWT;
import org.junit.Test;


public class FontData_Test {

  @Test
  public void testDefaultConstructor() {
    FontData fontData = new FontData();
    assertEquals( "", fontData.getName() );
    assertEquals( "", fontData.getLocale() );
    assertEquals( 12, fontData.getHeight() );
    assertEquals( SWT.NORMAL, fontData.getStyle() );
  }

  @Test
  public void testConstructor() {
    FontData fontData = new FontData( "roman", 1, SWT.NORMAL );
    assertEquals( "roman", fontData.getName() );
    assertEquals( "", fontData.getLocale() );
    assertEquals( 1, fontData.getHeight() );
    assertEquals( SWT.NORMAL, fontData.getStyle() );
  }

  @Test
  public void testFontDataFromString() {
    FontData fontData = new FontData( "1|roman|1|0|" );
    assertEquals( "roman", fontData.getName() );
    assertEquals( "", fontData.getLocale() );
    assertEquals( 1, fontData.getHeight() );
    assertEquals( SWT.NORMAL, fontData.getStyle() );
  }

  @Test
  public void testSetName() {
    FontData fontData = new FontData( "foo", 8, SWT.ITALIC );
    fontData.setName( "bar" );
    assertEquals( "bar", fontData.getName() );
    assertEquals( 8, fontData.getHeight() );
    assertEquals( SWT.ITALIC, fontData.getStyle() );
  }

  @Test
  public void testSetHeight() {
    FontData fontData = new FontData( "foo", 8, SWT.ITALIC );
    fontData.setHeight( 12 );
    assertEquals( "foo", fontData.getName() );
    assertEquals( 12, fontData.getHeight() );
    assertEquals( SWT.ITALIC, fontData.getStyle() );
  }

  @Test
  public void testSetStyle() {
    FontData fontData = new FontData( "foo", 8, SWT.ITALIC );
    fontData.setStyle( SWT.BOLD );
    assertEquals( "foo", fontData.getName() );
    assertEquals( 8, fontData.getHeight() );
    assertEquals( SWT.BOLD, fontData.getStyle() );
  }

  @Test
  public void testSetLocale() {
    assertEquals( "", setAndGetLocale( "" ) );
    assertEquals( " ", setAndGetLocale( " " ) );
    assertEquals( "  ", setAndGetLocale( "  " ) );
    assertEquals( "", setAndGetLocale( "_" ) );
    assertEquals( "", setAndGetLocale( "__" ) );
    assertEquals( "", setAndGetLocale( "___" ) );
    assertEquals( "_", setAndGetLocale( "____" ) );
    assertEquals( " ", setAndGetLocale( "_ _" ) );
    assertEquals( " _ ", setAndGetLocale( " _ " ) );
    assertEquals( "a", setAndGetLocale( "a" ) );
    assertEquals( "a", setAndGetLocale( "_a_" ) );
    assertEquals( "a_b", setAndGetLocale( "_a_b" ) );
    assertEquals( "a_b", setAndGetLocale( "_a_b_" ) );
    assertEquals( " _a_b_ ", setAndGetLocale( " _a_b_ " ) );
    assertEquals( "a_b_", setAndGetLocale( "__a_b__" ) );
    assertEquals( "a_b_c_d_e", setAndGetLocale( "_a_b_c_d_e_" ) );
    assertEquals( "foo_bar_baz", setAndGetLocale( "foo_bar_baz" ) );
  }

  @Test
  public void testSetLocaleToNull() {
    FontData fontData = new FontData();
    fontData.setLocale( "foo" );
    fontData.setLocale( null );
    assertEquals( "", fontData.getLocale() );
  }

  @Test
  public void testEquals() {
    FontData fontData1 = new FontData( "roman", 1, SWT.NORMAL );
    assertFalse( fontData1.equals( null ) );
    assertFalse( fontData1.equals( new Object() ) );
    assertFalse( fontData1.equals( new FontData( "roman", 1, SWT.BOLD ) ) );
    assertFalse( fontData1.equals( new FontData( "roman", 2, SWT.NORMAL ) ) );
    assertFalse( fontData1.equals( new FontData( "arial", 1, SWT.NORMAL ) ) );
    assertTrue( fontData1.equals( new FontData( "roman", 1, SWT.NORMAL ) ) );
  }

  @Test
  public void testHashCode() {
    FontData roman1Normal = new FontData( "roman", 1, SWT.NORMAL );
    FontData roman1Normal2 = new FontData( "roman", 1, SWT.NORMAL );
    assertEquals( roman1Normal.hashCode(), roman1Normal2.hashCode() );
    assertFalse( roman1Normal.hashCode() == new Object().hashCode() );
    FontData fontData3 = new FontData( "roman", 1, SWT.BOLD );
    assertFalse( roman1Normal.hashCode() == fontData3.hashCode() );
    fontData3 = new FontData( "roman", 2, SWT.NORMAL );
    assertFalse( roman1Normal.hashCode() == fontData3.hashCode() );
    fontData3 = new FontData( "arial", 1, SWT.NORMAL );
    assertFalse( roman1Normal.hashCode() == fontData3.hashCode() );

    FontData arial13Normal = new FontData( "arial", 13, SWT.NORMAL );
    FontData arial12Bold = new FontData( "arial", 12, SWT.BOLD );
    assertFalse( arial13Normal.hashCode() == arial12Bold.hashCode() );
  }

  @Test
  public void testHashCodeWithLocale() {
    FontData localeDe = new FontData( "", 1, SWT.NORMAL );
    localeDe.setLocale( "de" );
    FontData localeEn = new FontData( "", 1, SWT.NORMAL );
    localeEn.setLocale( "en" );
    assertEquals( localeDe.hashCode(), localeEn.hashCode() );
  }

  @Test
  public void testEqualsWithLocale() {
    FontData localeDe = new FontData( "", 1, SWT.NORMAL );
    localeDe.setLocale( "de" );
    FontData localeEn = new FontData( "", 1, SWT.NORMAL );
    localeEn.setLocale( "en" );
    assertTrue( localeDe.equals( localeEn ) );
  }

  @Test
  public void testSerialization() throws Exception {
    FontData fontData = new FontData( "name", 1, SWT.BOLD );
    fontData.setLocale( "fr" );

    FontData deserializedFontData = Fixture.serializeAndDeserialize( fontData );

    assertEquals( fontData.getName(), deserializedFontData.getName() );
    assertEquals( fontData.getHeight(), deserializedFontData.getHeight() );
    assertEquals( fontData.getStyle(), deserializedFontData.getStyle() );
    assertEquals( fontData.getLocale(), deserializedFontData.getLocale() );
  }

  private static String setAndGetLocale( String locale ) {
    FontData fontData = new FontData();
    fontData.setLocale( locale );
    return fontData.getLocale();
  }

}
