/*******************************************************************************
 * Copyright (c) 2004, 2013 1&1 Internet AG, Germany, http://www.1und1.de,
 *                          EclipseSource and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    1&1 Internet AG and others - original API and implementation
 *    EclipseSource - adaptation for the Eclipse Remote Application Platform
 ******************************************************************************/

/**
 * Collection of helper methods operating on functions.
 */
rwt.qx.Class.define("rwt.util.Functions",
{
  statics :
  {

    /**
     * Simply return true.
     *
     * @type static
     * @return {Boolean} Always returns true.
     */
    returnTrue : function() {
      return true;
    },


    /**
     * Simply return false.
     *
     * @type static
     * @return {Boolean} Always returns false.
     */
    returnFalse : function() {
      return false;
    },


    /**
     * Simply return null.
     *
     * @type static
     * @return {var} Always returns null.
     */
    returnNull : function() {
      return null;
    },


    /**
     * Return "this".
     *
     * @type static
     * @return {Object} Always returns "this".
     */
    returnThis : function() {
      return this;
    },


    /**
     * Simply return 0.
     *
     * @type static
     * @return {Number} Always returns 0.
     */
    returnZero : function() {
      return 0;
    },


    /**
     * Simply return a negative index (-1).
     *
     * @type static
     * @return {Number} Always returns -1.
     */
    returnNegativeIndex : function() {
      return -1;
    },


    /**
     * Bind a function to an object. Each time the bound method is called the
     * 'this' variable is guaranteed to be 'self'.
     *
     * @param fcn {Function} function to bind
     * @param self {Object} object, which shuold act as the 'this' variable inside the bound function
     * @param varargs {arguments} multiple arguments which should be static arguments for the given function
     * @return {Function} the bound function
     */
    bind: function( fcn, self, varargs ) {
      // Create wrapper method
      if( arguments.length > 2 ) {
        // Static arguments
        var args = Array.prototype.slice.call( arguments, 2 );
        var wrap = function() {
          fcn.context = self;
          var ret = fcn.apply(self, args.concat(rwt.util.Arrays.fromArguments(arguments)));
          fcn.context = null;
          return ret;
        };
      } else {
        var wrap = function() {
          fcn.context = self;
          var ret = fcn.apply(self, arguments);
          fcn.context = null;
          return ret;
        };
      }

      // Correcting self
      wrap.self = fcn.self ? fcn.self.constructor : self;

      // Return wrapper method
      return wrap;
    },


    /**
     * Bind a function which works as an event listener to an object. Each time
     * the bound method is called the 'this' variable is guaranteed to be 'self'.
     *
     * @param fcn {Function} function to bind
     * @param self {Object} object, which shuold act as the 'this' variable inside the bound function
     * @return {Function} the bound function
     */
    bindEvent: function( fcn, self ) {
      // Create wrapper method
      var wrap = function( event ) {
        fcn.context = self;
        var ret = fcn.call( self, event || window.event );
        fcn.context = null;
        return ret;
      };

      // Correcting self
      wrap.self = fcn.self ? fcn.self.constructor : self;

      // Return wrapper method
      return wrap;
    },


    /**
     * Extract the caller of a function from the arguments variable.
     * This will not work in Opera.
     *
     * @param args {arguments} The local arguments variable
     * @return {Function|undefined} A reference to the calling function or "undefined" if caller is not supported.
     */
    getCaller: function(args) {
      return args.caller ? args.caller.callee : args.callee.caller;
    }
  }
});
