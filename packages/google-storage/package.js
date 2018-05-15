Package.describe({
  name: "cfs:google-storage",
  version: "0.1",
  summary: "Google Cloud Storage storage adapter for CollectionFS",
  git: "https://github.com/mattleonard/Meteor-CollectionFS/tree/master/packages/google-storage"
});

Npm.depends({
  "@google-cloud/storage": "^1.6.0"
});

Package.onUse(function(api) {
  api.versionsFrom("1.0");

  api.use(["cfs:base-package@0.0.30", "cfs:storage-adapter@0.2.1"]);
  api.addFiles(["google-storage.server.js"], "server");
  api.addFiles("google-storage.client.js", "client");
});

Package.onTest(function(api) {
  api.use(["cfs:standard-packages", "cfs:google-storage", "test-helpers", "tinytest"], "server");
  api.addFiles("tests/server-tests.js", "server");
  api.addFiles("tests/client-tests.js", "client");
});
