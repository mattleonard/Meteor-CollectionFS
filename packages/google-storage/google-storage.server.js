// We use the official aws sdk
Storage = require('@google-cloud/storage');

/**
 * @public
 * @constructor
 * @param {String} name - The store name
 * @param {Object} options
 * @param {String} options.bucket - Bucket name
 * @param {String} [options.acl='private'] - ACL for objects when putting
 * @param {String} [options.folder='/'] - Which folder (key prefix) in the bucket to use
 * @returns {FS.StorageAdapter} An instance of FS.StorageAdapter.
 *
 * Creates an GoogleStorage store instance on the server. Inherits from FS.StorageAdapter
 * type.
 */
FS.Store.GoogleStorage = function(name, options) {
  var self = this;
  if (!(self instanceof FS.Store.GoogleStorage)) throw new Error('FS.Store.GoogleStorage missing keyword "new"');

  options = options || {};

  // Determine which folder (key prefix) in the bucket to use
  var folder = options.folder;
  if (typeof folder === 'string' && folder.length) {
    if (folder.slice(0, 1) === '/') {
      folder = folder.slice(1);
    }
    if (folder.slice(-1) !== '/') {
      folder += '/';
    }
  } else {
    folder = '';
  }

  // Load credentials from private settings file if not in production
  // Credentials are not needed if hosted on GC
  if (Meteor.isDevelopment && !options.credentials) {
    options.credentials = Meteor.settings.private.gc.credentials;
  }

  const GoogleStorage = new Storage(options);

  const bucket = GoogleStorage.bucket(options.bucket);
  if (!bucket) throw new Error('FS.Store.GoogleStorage you must specify the "bucket" option');

  return new FS.StorageAdapter(name, options, {
    typeName: 'storage.googleStorage',
    fileKey(fileObj) {
      // Lookup the copy
      var info = fileObj && fileObj._getInfo(name);
      // If the store and key is found return the key
      if (info && info.key) return info.key;

      // Support explicit fileKey function in options
      //   eg: set to save as just this filename
      //   fileKey: function(fileObj) { return { fileKey: fileObj.name() }; }
      //   eg: set to save as just the fileObj._id
      //   fileKey: function(fileObj) { return { fileKey: fileObj._id }; }
      //   eg: set to save as a path: <_id>/<name>
      //   fileKey: function(fileObj) { return { fileKey: fileObj._id + '/' + fileObj.name() }; }
      if (options && options.fileKey && typeof options.fileKey === 'function') {
        return options.fileKey(fileObj);
      }
      // Support for an extension on the fileObj itself
      if (fileObj && fileObj.fileKey) {
        if (typeof fileObj.fileKey === 'string') return fileObj.fileKey;
        if (typeof fileObj.fileKey === 'function') return fileObj.fileKey();
      }

      var filename = fileObj.name();
      var filenameInStore = fileObj.name({ store: name });

      // If no store key found we resolve / generate a key
      return fileObj.collectionName + '/' + fileObj._id + '-' + (filenameInStore || filename);
    },
    createReadStream(fileKey, options) {
      const file = bucket.file(fileKey);
      return file.createReadStream();
    },
    // Comment to documentation: Set options.ContentLength otherwise the
    // indirect stream will be used creating extra overhead on the filesystem.
    // An easy way if the data is not transformed is to set the
    // options.ContentLength = fileObj.size ...
    createWriteStream(fileKey, options) {
      const file = bucket.file(fileKey);

      options = options || {};

      const uploader = file.createWriteStream(options);

      uploader.on('error', err => {
        uploader.emit('error', err);
      });

      uploader.on('finish', () => {
        uploader.emit('stored', {
          fileKey,
          storedAt: new Date(),
        });
      });

      return FS.Utility.safeStream(uploader);
    },
    remove(fileKey, callback) {
      const file = bucket.file(fileKey);

      file.delete(function(error) {
        callback(error, !error);
      });
    },
    watch() {
      throw new Error('GoogleStorage storage adapter does not support the sync option');
    },
  });
};
