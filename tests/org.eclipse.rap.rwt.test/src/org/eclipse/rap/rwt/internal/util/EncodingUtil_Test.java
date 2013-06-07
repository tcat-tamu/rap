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
package org.eclipse.rap.rwt.internal.util;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.util.Arrays;

import org.eclipse.rap.rwt.internal.util.EncodingUtil;
import org.junit.Test;


public class EncodingUtil_Test {

  @Test
  public void testEscapeDoubleQuoted() {
    String stringToEscape = "First line.\nSecond \"middle\" line.\nThird line.";
    String expected = "First line.\nSecond \\\"middle\\\" line.\nThird line.";
    String result = EncodingUtil.escapeDoubleQuoted( stringToEscape );
    assertEquals( expected, result );

    stringToEscape = "First line.\nSecond \\middle\\ line.\nThird line.";
    expected = "First line.\nSecond \\\\middle\\\\ line.\nThird line.";
    result = EncodingUtil.escapeDoubleQuoted( stringToEscape );
    assertEquals( expected, result );
  }

  @Test
  public void testReplaceNewLines() {
    String stringToReplace = "First line.\nSecond line.\nThird line.";
    String expected = "First line.\\nSecond line.\\nThird line.";
    String result = EncodingUtil.replaceNewLines( stringToReplace );
    assertEquals( expected, result );

    stringToReplace = "First line.\rSecond line.\rThird line.";
    expected = "First line.\\nSecond line.\\nThird line.";
    result = EncodingUtil.replaceNewLines( stringToReplace );
    assertEquals( expected, result );

    stringToReplace = "First line.\r\nSecond line.\r\nThird line.";
    expected = "First line.\\nSecond line.\\nThird line.";
    result = EncodingUtil.replaceNewLines( stringToReplace );
    assertEquals( expected, result );

    stringToReplace = "First line.\r\nSecond line.\r\nThird line.";
    expected = "First line. Second line. Third line.";
    result = EncodingUtil.replaceNewLines( stringToReplace, " " );
    assertEquals( expected, result );
  }

  @Test
  public void testSplitNewlines() {
    String input = "";
    String[] expected = new String[] { "" };
    String[] result = EncodingUtil.splitNewLines( input );
    assertTrue( Arrays.equals( expected, result ) );

    input = "First line.\nSecond line.\nThird line.";
    expected = new String[] { "First line.", "Second line.", "Third line." };
    result = EncodingUtil.splitNewLines( input );
    assertTrue( Arrays.equals( expected, result ) );

    input = "First line.\rSecond line.\rThird line.";
    result = EncodingUtil.splitNewLines( input );
    assertTrue( Arrays.equals( expected, result ) );

    input = "First line.\r\nSecond line.\r\nThird line.";
    result = EncodingUtil.splitNewLines( input );
    assertTrue( Arrays.equals( expected, result ) );

    input = "First line.\r\nSecond line.\r\nThird line.\r\n";
    expected = new String[] { "First line.", "Second line.", "Third line.", "" };
    result = EncodingUtil.splitNewLines( input );
    assertTrue( Arrays.equals( expected, result ) );
  }

  @Test
  public void testEscapeLeadingTrailingSpaces() {
    String stringToEscape = "  All rights reserved.   ";
    String expected = "&nbsp;&nbsp;All rights reserved.&nbsp;&nbsp;&nbsp;";
    String result = EncodingUtil.escapeLeadingTrailingSpaces( stringToEscape );
    assertEquals( expected, result );

    stringToEscape = "All rights reserved. ";
    expected = "All rights reserved.&nbsp;";
    result = EncodingUtil.escapeLeadingTrailingSpaces( stringToEscape );
    assertEquals( expected, result );

    stringToEscape = "  All rights reserved.";
    expected = "&nbsp;&nbsp;All rights reserved.";
    result = EncodingUtil.escapeLeadingTrailingSpaces( stringToEscape );
    assertEquals( expected, result );

    stringToEscape = "All rights reserved.";
    expected = "All rights reserved.";
    result = EncodingUtil.escapeLeadingTrailingSpaces( stringToEscape );
    assertEquals( expected, result );

    stringToEscape = " \n  All rights reserved. \n ";
    expected = "&nbsp;\n  All rights reserved. \n&nbsp;";
    result = EncodingUtil.escapeLeadingTrailingSpaces( stringToEscape );
    assertEquals( expected, result );

    stringToEscape = "  ";
    expected = "&nbsp;&nbsp;";
    result = EncodingUtil.escapeLeadingTrailingSpaces( stringToEscape );
    assertEquals( expected, result );

    stringToEscape = "";
    expected = "";
    result = EncodingUtil.escapeLeadingTrailingSpaces( stringToEscape );
    assertEquals( expected, result );
  }

  @Test
  public void testReplaceWhiteSpaces() {
    String stringToEscape = "test1 test2";
    String expected = "test1 test2";
    String result = EncodingUtil.replaceWhiteSpaces( stringToEscape );
    assertEquals( expected, result );

    stringToEscape = "test1  test2";
    expected = "test1&nbsp; test2";
    result = EncodingUtil.replaceWhiteSpaces( stringToEscape );
    assertEquals( expected, result );

    stringToEscape = "test1   test2";
    expected = "test1&nbsp;&nbsp; test2";
    result = EncodingUtil.replaceWhiteSpaces( stringToEscape );
    assertEquals( expected, result );

    stringToEscape = " test";
    expected = "&nbsp;test";
    result = EncodingUtil.replaceWhiteSpaces( stringToEscape );
    assertEquals( expected, result );

    stringToEscape = "  test  ";
    expected = "&nbsp; test&nbsp;&nbsp;";
    result = EncodingUtil.replaceWhiteSpaces( stringToEscape );
    assertEquals( expected, result );
  }

  @Test
  public void testEscapeSpecialCharacters() {
    String stringToEscape = "abc\u2028abc\u2029abc";
    String expected = "abcabcabc";
    String result = EncodingUtil.removeNonDisplayableChars( stringToEscape );
    assertEquals( expected, result );
  }

  @Test
  public void testTruncateAtZero() {
    char[] stringToTruncate = new char[] { 'h', 'e', 'l', 0, 'l', 'o' };
    String expected = "hel";
    String result
      = EncodingUtil.truncateAtZero( String.valueOf( stringToTruncate ) );
    assertEquals( expected, result );
  }

}
