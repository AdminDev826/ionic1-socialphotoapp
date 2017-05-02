angular.module('starter.services', [])

 .factory('ParseEventService', function($q) {
	 var ParseEventObject = Parse.Object.extend("Event");

	  return {
  		all: function(_param, offset){
        if(!offset) offset = 0;
  			var deferred = $q.defer();
  			//Query Parse
  			var query = new Parse.Query(ParseEventObject);
        query.include("venue");
        query.include("browseEvent");
        query.include("browseVenue");
        query.include("browseVenueType");
        query.limit(1000);
  			query.skip(1000 * offset);
  			query.find({
  			  success: function(results) {
  					deferred.resolve(results);
  			  },
  			  error: function(error) {
  					deferred.reject(error);
  			  }
  			});
  			return deferred.promise;
  		},
  		add: function(_param){
        console.log(_param);
  			var deferred = $q.defer();

  			var query = new ParseGroupObject();
  			query.set("userObjectId", _param.userObjectId);
  			query.set("name", _param.name);
  			query.set("members", _param.members);

  			query.save(null, {
  			  success: function(results) {
  					deferred.resolve(results);
  			  },
  			  error: function(d, error) {
  					deferred.reject(error);
  			  }
  			});
  			return deferred.promise;
  		},
  		destory: function(_param){
  			var deferred = $q.defer();
  			//Query Parse
  			var query = new Parse.Query(ParseEventObject);
  			query.equalTo("objectId", _param.id);
  			query.first( {
  			  success: function(results) {
            console.log(results);
              results.destroy();
              deferred.resolve([]);
  			  },
  			  error: function(d, error) {
  					deferred.reject(error);
  			  }
  			});
  			return deferred.promise;
  		},
  		update: function(_param){
  			var deferred = $q.defer();
  			//Query Parse
  			var query = new Parse.Query(ParseEventObject);
  			query.equalTo("objectId", _param.groupid);
  			query.first({
  			  success: function(results) {
  					results.set("userObjectId", _param.userObjectId);
  					results.set("name", _param.name);
  					results.set("members", _param.members);
  					results.save(null, {
  					  success: function(result) {
  							deferred.resolve(result);
  					  },
  					  error: function(d, error) {
  							deferred.reject(error);
  					  }
  					});
  			  },
  			  error: function(error) {
  					deferred.reject(error);
  			  }
  			});

  			return deferred.promise;
  		}
	  }
 })

 .factory('ParseVenueService', function($q) {
   var ParseVenueObject = Parse.Object.extend("Venue");

    return {
      all: function(_param, offset){
        if(!offset) offset = 0;
        var deferred = $q.defer();
        //Query Parse
        var query = new Parse.Query(ParseVenueObject);
        query.include("browseVenueType");
        query.limit(1000);
        query.skip(1000 * offset);
        query.find({
          success: function(results) {
            deferred.resolve(results);
          },
          error: function(error) {
            deferred.reject(error);
          }
        });
        return deferred.promise;
      }
    }
 })

 .factory('ParseGalleryService', function($q) {
	 var ParseGalleryObject = Parse.Object.extend("Gallery");
   var ParsePhotosObject = Parse.Object.extend("Photos");

	  return {
  		all: function(_param, offset){
        if(!offset) offset = 0;
  			var deferred = $q.defer();
  			//Query Parse
  			var query = new Parse.Query(ParseGalleryObject);
        query.include("venueid");
        query.limit(1000);
  			query.skip(1000 * offset);
  			query.find({
  			  success: function(results) {
  					deferred.resolve(results);
  			  },
  			  error: function(error) {
  					deferred.reject(error);
  			  }
  			});
  			return deferred.promise;
  		},
      getAllPhotos: function(_param, offset){
        if(!offset) offset = 0;
  			var deferred = $q.defer();
  			//Query Parse
  			var query = new Parse.Query(ParsePhotosObject);
        query.limit(1000);
  			query.skip(1000 * offset);
        query.include("gallery");
  			query.find({
  			  success: function(results) {
  					deferred.resolve(results);
  			  },
  			  error: function(error) {
  					deferred.reject(error);
  			  }
  			});
  			return deferred.promise;
  		}
	  }
 })

 .factory('NotificationService', function($q) {
  var ParseNotificationsObject = Parse.Object.extend("Notifications");

   return {
     all: function(_param, offset){
        if(!offset) offset = 0;
       var deferred = $q.defer();
       //Query Parse
       var query = new Parse.Query(ParseNotificationsObject);
        query.include("gallery");
        query.include("event");
        query.limit(1000);
       query.skip(1000 * offset);
       query.descending("createdAt");
       query.find({
         success: function(results) {
           deferred.resolve(results);
         },
         error: function(error) {
           deferred.reject(error);
         }
       });
       return deferred.promise;
     }
   }
 })

 .factory('ParseBrowseEventService', function($q) {
	 var ParseBrowseEventObject = Parse.Object.extend("BrowseEvent");

	  return {
  		all: function(_param, offset){
        if(!offset) offset = 0;
  			var deferred = $q.defer();
  			//Query Parse
  			var query = new Parse.Query(ParseBrowseEventObject);
        query.limit(1000);
  			query.skip(1000 * offset);
  			query.find({
  			  success: function(results) {
  					deferred.resolve(results);
  			  },
  			  error: function(error) {
  					deferred.reject(error);
  			  }
  			});
  			return deferred.promise;
  		}
	  }
 })

 .factory('ParseBrowseVenueService', function($q) {
  var ParseBrowseVenueObject = Parse.Object.extend("BrowseVenue");

   return {
     all: function(_param, offset){
        if(!offset) offset = 0;
       var deferred = $q.defer();
       //Query Parse
       var query = new Parse.Query(ParseBrowseVenueObject);
       query.limit(1000);
       query.skip(1000 * offset);
       query.find({
         success: function(results) {
           deferred.resolve(results);
         },
         error: function(error) {
           deferred.reject(error);
         }
       });
       return deferred.promise;
     }
   }
 })

 .factory('ParseBrowseVenueTypeService', function($q) {
	 var ParseBrowseVenueTypeObject = Parse.Object.extend("BrowseVenueType");

	  return {
  		all: function(_param, offset){
        if(!offset) offset = 0;
  			var deferred = $q.defer();
  			//Query Parse
  			var query = new Parse.Query(ParseBrowseVenueTypeObject);
        query.limit(1000);
  			query.skip(1000 * offset);
  			query.find({
  			  success: function(results) {
  					deferred.resolve(results);
  			  },
  			  error: function(error) {
  					deferred.reject(error);
  			  }
  			});
  			return deferred.promise;
  		}
	  }
 })

.factory('Storage', function(){
  return {
    getItem: function (key) {
      return localStorage.getItem(key);
    },

    getObject: function (key) {
      return angular.fromJson(localStorage.getItem(key));
    },

    setItem: function (key, data) {
      localStorage.setItem(key, data);
    },

    setObject: function (key, data) {
      localStorage.setItem(key, angular.toJson(data));
    },

    remove: function (key) {
      localStorage.removeItem(key);
    },

    clearAll : function () {
      localStorage.clear();
    }
  };
})
;
