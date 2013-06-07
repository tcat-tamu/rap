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
 * Helper for rwt.widgets.util.SelectionManager, contains data for selections
 */
rwt.qx.Class.define("rwt.widgets.util.Selection",
{
  extend : rwt.qx.Object,




  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param mgr {Object} a class which implements a getItemHashCode(item) method
   */
  construct : function(mgr)
  {
    this.base(arguments);

    this.__manager = mgr;
    this.removeAll();
  },




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /*
    ---------------------------------------------------------------------------
      USER METHODS
    ---------------------------------------------------------------------------
    */

    /**
     * Add an item to the selection
     *
     * @type member
     * @param item {var} item to add
     * @return {void}
     */
    add : function(item) {
      this.__storage[this.getItemHashCode(item)] = item;
    },


    /**
     * Remove an item from the selection
     *
     * @type member
     * @param item {var} item to remove
     * @return {void}
     */
    remove : function(item) {
      delete this.__storage[this.getItemHashCode(item)];
    },


    /**
     * Remove all items from the selection
     *
     * @type member
     * @return {void}
     */
    removeAll : function() {
      this.__storage = {};
    },


    /**
     * Check whether the selection contains a given item
     *
     * @type member
     * @param item {var} item to check for
     * @return {Boolean} whether the selection contains the item
     */
    contains : function(item) {
      return this.getItemHashCode(item) in this.__storage;
    },


    /**
     * Convert selection to an array
     *
     * @type member
     * @return {Array} array representation of the selection
     */
    toArray : function()
    {
      var res = [];

      for (var key in this.__storage) {
        res.push(this.__storage[key]);
      }

      return res;
    },


    /**
     * Return first element of the Selection
     *
     * @type member
     * @return {var} first item of the selection
     */
    getFirst : function()
    {
      for (var key in this.__storage) {
        return this.__storage[key];
      }
      return null;
    },


    /**
     * Get a string representation of the Selection. The return value can be used to compare selections.
     *
     * @type member
     * @return {String} string representation of the Selection
     */
    getChangeValue : function()
    {
      var sb = [];

      for (var key in this.__storage) {
        sb.push(key);
      }

      sb.sort();
      return sb.join(";");
    },


    /**
     * Compute a hash code for an item using the manager
     *
     * @type member
     * @param item {var} the item
     * @return {var} unique hash code for the item
     */
    getItemHashCode : function(item) {
      return this.__manager.getItemHashCode(item);
    },


    /**
     * Whether the selection is empty
     *
     * @type member
     * @return {Boolean} whether the selection is empty
     */
    isEmpty : function() {
      return rwt.util.Objects.isEmpty(this.__storage);
    }
  },




  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function() {
    this._disposeFields("__storage", "__manager");
  }
});
