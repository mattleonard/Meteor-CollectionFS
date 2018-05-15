/**
 * @public
 * @constructor
 * @param {String} name - The store name
 * @param {Object} options
 * @returns {undefined}
 *
 * Creates an GoogleStorage store instance on the client, which is just a shell object
 * storing some info.
 */
FS.Store.GoogleStorage = function(name, options) {
  var self = this;
  if (!(self instanceof FS.Store.GoogleStorage))
    throw new Error('FS.Store.GoogleStorage missing keyword "new"');

  return new FS.StorageAdapter(name, options, {
    typeName: "storage.googleStorage"
  });
};

FS.Store.GoogleStorage.prototype.fileKey = function(fileObj) {
  return fileObj.collectionName + "/" + fileObj._id + "-" + fileObj.name();
};
