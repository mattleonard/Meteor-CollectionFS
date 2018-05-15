#### <a name="FS.Store.GoogleStorage"></a>new _fsStore_.GoogleStorage(name, options)&nbsp;&nbsp;<sub><i>Server</i></sub>

-
_This method **GoogleStorage** is defined in `FS.Store`_

**Arguments**

* **name** _{String}_  
  The store name
* **options** _{Object}_
  * **bucket** _{String}_  
    Bucket name
  * **ACL** _{String}_ (Default = 'private')
    ACL for objects when putting
  * **folder** _{String}_ (Default = '/')
    Which folder (key prefix) in the bucket to use

**Returns** _{FS.StorageAdapter}_
An instance of FS.StorageAdapter.

Creates an GoogleStorage store instance on the server. Inherits from FS.StorageAdapter
type.

> `FS.Store.GoogleStorage = function(name, options) { ...` [google-storage.server.js:17](google-storage.server.js#L17)

-

---

#### <a name="FS.Store.GoogleStorage"></a>new _fsStore_.GoogleStorage(name, options)&nbsp;&nbsp;<sub><i>Client</i></sub>

-
_This method **GoogleStorage** is defined in `FS.Store`_

**Arguments**

* **name** _{String}_  
  The store name
* **options** _{Object}_

-

**Returns** _{undefined}_

Creates an GoogleStorage store instance on the client, which is just a shell object
storing some info.

> `FS.Store.GoogleStorage = function(name, options) { ...` [google-storage.client.js:11](google-storage.client.js#L11)

-
