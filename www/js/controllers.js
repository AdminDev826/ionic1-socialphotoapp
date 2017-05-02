angular.module('starter.controllers', [])

.controller('FirstCtrl', function($scope, $rootScope, $ionicModal, $state, $timeout, $ionicActionSheet, $ionicViewSwitcher, ionicToast, $cordovaCamera, $ionicLoading) {

    Parse.initialize("G9watfzx5oPJPdhlfDtW6wNXrEY7syqZYQnmW0nO", "GlKvpo90mEnPJCvlnvYPbnEApCUHPWS4TFkYxr7y");
    Parse.serverURL = "https://parseapi.back4app.com";

    $rootScope.loginAsGuest = false;

    $scope.user = {username:"", password:""};
    $scope.newuser={firstName:"", lastName:"", email:"", password:"", confirm:"", dob:new Date(), gender:"Male", facebookLogin:false, profileImage:""}
    $scope.isTab = 'signin';
    $scope.changeTab = function(tabName){
      $scope.isTab = tabName;
    }

    $scope.onSwipeLeft = function(){
      $scope.isTab = 'signin';
    };

    $scope.onSwipeRight = function(){
      $scope.isTab = 'signup';
    };

    $scope.goGuest = function(){
        $scope.closeLogin();
        $state.go("termsofuse");
    };

    $scope.onTerms = function(){
        $scope.closeLogin();
        $scope.termsmodal.show();
    };

    $scope.onForgotPassword = function(){
      $scope.closeLogin();
      $state.go("forgotpassword");
    };

    $scope.closeTermsModal = function(){
        $scope.termsmodal.hide();
    };

    $ionicModal.fromTemplateUrl('templates/terms1.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.termsmodal = modal;
    });

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.showSignin = function() {
      $scope.modal.show();
      $scope.isTab = 'signin';
    };

    // Open the login modal
    $scope.showSignup = function() {
      $scope.modal.show();
      $scope.isTab = 'signup';
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
      console.log('Doing login', $scope.loginData);

      $scope.closeLogin();
    };

    var onSuccess = function (data) {
  		window.resolveLocalFileSystemURI(data, function(entry) {
  				var reader = new FileReader();

  				reader.onloadend = function(evt) {
                $ionicLoading.show();
  							var byteArray = new Uint8Array(evt.target.result);
  							var output = new Array( byteArray.length );
  							var i = 0;
  							var n = output.length;
  							while( i < n ) {
  							    output[i] = byteArray[i];
  							    i++;
  							}
  							var parseFile = new Parse.File("mypic.jpg", output);

  						  parseFile.save().then(function(ob) {
                    try{
                  		$scope.newuser.profileImage = JSON.stringify(ob).split(",")[2].split("\":")[1].replace("}", "").replace("\"", "").replace("\"", "");
  									}catch(e){}
  									$timeout(function(){$scope.$apply();});

                    $ionicLoading.hide();
  						  }, function(error) {
  						      console.log(error);
                    $ionicLoading.hide();
  			        });

    			}

  				reader.onerror = function(evt) {
  				      console.log('read error');
  				      console.log(JSON.stringify(evt));
  				}

  				entry.file(function(s) {
  				    	reader.readAsArrayBuffer(s);
  				}, function(e) {
  					    console.log('ee');
  				});
  			});
  	}

    $scope.showCameraSheet = function() {

       // Show the action sheet
       var hideSheet = $ionicActionSheet.show({
         buttons: [
           { text: 'From Camera' },
           { text: 'From PhotoLibrary' }
         ],
         titleText: 'Select your photo',
         cancelText: 'Cancel',
         cancel: function() {
              // add cancel code..
            },
         buttonClicked: function(index) {
            if(index == 0)
     				{
     					var options = {
     					  quality:50,
     					  targetWidth:300,
     					  targetHeight:300,
     					  destinationType: Camera.DestinationType.FILE_URI,
     					  sourceType: Camera.PictureSourceType.CAMERA,
     					};

     					$cordovaCamera.getPicture(options).then(onSuccess, function(err) {
     					  console.log(err);
     					});
     				}else{
     					var options = {
     					  quality:50,
     					  targetWidth:300,
     					  targetHeight:300,
     					  destinationType: Camera.DestinationType.FILE_URI,
     					  sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
     					};

     					$cordovaCamera.getPicture(options).then(onSuccess, function(err) {
     					  console.log(err);
     					});
     				}
            return true;
         }
       });
     };

      $scope.login = function(user){
        if($scope.user.username == undefined || $scope.user.password == undefined || $scope.user.username == "" || $scope.user.password == "")
        {
          ionicToast.show('Please fill out email and password fields.', 'bottom',false, 3000);
          return;
        }

        $ionicLoading.show();
        Parse.User.logIn($scope.user.username, $scope.user.password, {
          success: function(user) {
            console.log(user);
            $scope.closeLogin();
            $ionicViewSwitcher.nextDirection('back');
            $state.go("app.home");

            $ionicLoading.hide();
          },
          error: function(user, error) {
            // The login failed. Check error to see why.
            console.log(error);
            $ionicLoading.hide();
            ionicToast.show(error.message, 'bottom',false, 3000);
            $scope.user = {username:"", password:""};
          }
        });
      }

      $scope.looksLikeMail = function (str) {
    		var lastAtPos = str.lastIndexOf('@');
    		var lastDotPos = str.lastIndexOf('.');
    		return (lastAtPos < lastDotPos && lastAtPos > 0 && str.indexOf('@@') == -1 && lastDotPos > 2 && (str.length - lastDotPos) > 2);
    	}

      $scope.signup = function(){
        if($scope.newuser.firstName == undefined || $scope.newuser.firstName == "")
    		{
    			ionicToast.show('Please enter first name.', 'bottom',false, 3000);
    			return;
    		}

        if($scope.newuser.lastName == undefined || $scope.newuser.lastName == "")
    		{
    			ionicToast.show('Please enter last name.', 'bottom',false, 3000);
    			return;
    		}

        if($scope.newuser.email == undefined || $scope.newuser.email == "" || !$scope.looksLikeMail($scope.newuser.email))
    		{
    			ionicToast.show('Please enter valid email address.', 'bottom',false, 3000);
    			return;
    		}

        if($scope.newuser.password == undefined || $scope.newuser.password == "")
    		{
    			ionicToast.show('Please enter password.', 'bottom',false, 3000);
    			return;
    		}

        if($scope.newuser.confirm == undefined || $scope.newuser.confirm == "")
    		{
    			ionicToast.show('Please enter confirm password.', 'bottom',false, 3000);
    			return;
    		}

        if($scope.newuser.password !== $scope.newuser.confirm)
    		{
    			ionicToast.show('Password does not match.', 'bottom',false, 3000);
    			return;
    		}

        if($scope.newuser.dob == undefined || $scope.newuser.dob == "")
    		{
    			ionicToast.show('Please enter birthday.', 'bottom',false, 3000);
    			return;
    		}

        if($scope.newuser.gender == undefined || $scope.newuser.gender == "")
    		{
    			ionicToast.show('Please select gender.', 'bottom',false, 3000);
    			return;
    		}

        if($scope.newuser.profileImage == undefined || $scope.newuser.profileImage == "")
    		{
    			ionicToast.show('Please select your photo.', 'bottom',false, 3000);
    			return;
    		}

        $ionicLoading.show();
        var user = new Parse.User();
        user.set("username", $scope.newuser.email);
        user.set("password", $scope.newuser.password);
        user.set("email", $scope.newuser.email);
        user.set("firstName", $scope.newuser.firstName);
        user.set("lastName", $scope.newuser.lastName);
        user.set("dob", $scope.newuser.dob);
        user.set("gender", $scope.newuser.gender);
        user.set("profileImage", $scope.newuser.profileImage);
        user.set("facebookLogin", $scope.newuser.facebookLogin);
        user.set("pushNotification", true);
        user.set("Venues", []);
        user.signUp(null, {
          success: function(user) {
            // Hooray! Let them use the app now.
            console.log(user);
            //$ionicLoading.hide();
            //ionicToast.show("Please verify your email before Login.", 'bottom',false, 3000);
            //$state.go("signin");
            $scope.closeLogin();
            $ionicViewSwitcher.nextDirection('back');
            $state.go("app.home");
            $ionicLoading.hide();
          },
          error: function(user, error) {
            // Show the error message somewhere and let the user try again.
            console.log("Error: " + error.code + " " + error.message);
            ionicToast.show(error.message, 'bottom',false, 3000);
            $ionicLoading.hide();
          }
        });
      };

      $scope.uploadProfileFile = function(event){
        console.log(event);
    		  $ionicLoading.show();
          var files = event.target.files;
      		if(files.length > 0)
      		{
      			var parseFile = new Parse.File("photo.jpg", files[0]);
      			parseFile.save().then(function(ret){
      				$ionicLoading.hide();
      				$scope.newuser.profileImage = ret._url;
              console.log($scope.newuser.profileImage);
      				event.target.files = null;
      			}, function(error){
      				ionicToast.show(error.message, 'bottom',false, 3000);
      				$ionicLoading.hide();
      			});
      		}else{
      			$ionicLoading.hide();
      		}
      };

      var fbLoginSuccess = function (userData) {
          console.log(userData);
          $ionicLoading.show({template:'Getting FB User Information...'});
          facebookConnectPlugin.api('/me?fields=first_name,last_name,email,gender,id,picture',["public_profile"],
              function(response) {
                    console.log(response);
                    $ionicLoading.show({template:'Getting Parse User Information...'});

                    var query = new Parse.Query(Parse.User);
                    query.equalTo("username", response.id);
                    query.equalTo("facebookLogin", true);
                    query.find({
                      success: function(aUser) {
                        console.log(aUser);
                        if(aUser.length > 0){

                          Parse.User.logIn(response.id, response.id, {
                            success: function(user) {
                                console.log(user);
                                $ionicLoading.hide();
                                $scope.closeLogin();
                                $ionicViewSwitcher.nextDirection('back');
                                $state.go("app.home");
                            },
                            error: function(user, error) {
                              console.log(error);
                              $ionicLoading.hide();
                              ionicToast.show(error.message, 'bottom',false, 3000);
                            }
                          });
                        }else{
                          $ionicLoading.show({template:'Sign up processing...'});
                          var user = new Parse.User();
                          user.set("username", response.id);
                          user.set("password", response.id);
                          user.set("firstName", response.first_name);
                          user.set("lastName", response.last_name);
                          user.set("gender", response.gender);
                          user.set("profileImage", response.picture.data.url);
                          user.set("facebookLogin", true);
                          user.set("pushNotification", false);
                          user.set("Venues", []);
                          user.signUp(null, {
                            success: function(user) {
                              console.log(user);
                              $scope.closeLogin();
                              $ionicViewSwitcher.nextDirection('back');
                              $state.go("app.home");
                              $ionicLoading.hide();
                            },
                            error: function(user, error) {
                              console.log("Error: " + error.code + " " + error.message);
                              ionicToast.show(error.message, 'bottom',false, 3000);
                              $ionicLoading.hide();
                            }
                          });
                        }
                      },
                      error:function(user, error){
                        console.log(error);
                        $ionicLoading.hide();
                      }
                    });
          });
      }

      $scope.fbLogin = function(){
        $ionicLoading.show();
        facebookConnectPlugin.login(["public_profile"], fbLoginSuccess,
          function loginError (error) {
              console.error(error);
              $ionicLoading.hide();
          }
        );
      };

})

.controller('AppCtrl', function($scope, $rootScope, $state, $ionicViewSwitcher, $rootScope, $ionicLoading) {
    Parse.initialize("G9watfzx5oPJPdhlfDtW6wNXrEY7syqZYQnmW0nO", "GlKvpo90mEnPJCvlnvYPbnEApCUHPWS4TFkYxr7y");
    Parse.serverURL = "https://parseapi.back4app.com";

    $scope.logout = function(){
      Parse.User.logOut();
      $ionicViewSwitcher.nextDirection('back');
      $state.go("first");
    };

    $scope.goSearch = function(){
      $state.go("app.search");
    };

    var checkPushSetting = function(){
      try{
          if($scope.currentUser.pushNotification){
            $ionicLoading.show();
            parsePlugin.subscribe('SampleChannel', function() {
                console.log('OK');
                $ionicLoading.hide();
            }, function(e) {
                console.log('error');
                $ionicLoading.hide();
            });
          }else{
            $ionicLoading.show();
            Parse.Cloud.run("removeInstallation", {installationId:$rootScope.installationId}, {
              success:function(result){
                console.log(result);
                $ionicLoading.hide();
              },
              error:function(error){
                console.log(error);
                $ionicLoading.hide();
              }
            });
          }

      }catch(e){ console.log(e);};
    };

    var getUserInfo = function(){
      var currentUser = Parse.User.current();
      $scope.currentUser = {name:"", photo:"", pushNotification:true};
      if (currentUser) {
          // do stuff with the user
          $scope.currentUser.name = currentUser.get('firstName')+" "+currentUser.get('lastName');
          $scope.currentUser.photo = currentUser.get('profileImage');
          $scope.currentUser.pushNotification = currentUser.get('pushNotification');
          checkPushSetting();
      } else {
          // show the signup or login page
          if(!$rootScope.loginAsGuest)
            $state.go("first");
          else{
            parsePlugin.subscribe('SampleChannel', function() {
                console.log('OK');
            }, function(e) {
                console.log('error');
            });
          }
      }
    };
    getUserInfo();

    $rootScope.$on('refreshUserInfo', function(event, args){
  	   getUserInfo();
  	});

    /*
    var defs = [];
    var addVenueData = function(){
    //  $ionicLoading.show();
      defs = [];
      var ParseVenueObject = Parse.Object.extend("Event");
      var mainInfo = $http.get('./img/Export/Event-2.json').success(function(response) {
          for (var index in response.results){
            var def = $.Deferred();
            _param =  response.results[index];

            console.log(_param);
            var query = new ParseVenueObject();
            query.set("active", _param.active);
            query.set("age", _param.age);
            query.set("dayOfWeek", _param.dayOfWeek);
            query.set("deleted", _param.deleted);
            query.set("dressCode", _param.dressCode);
            query.set("endDate", _param.endDate);
            query.set("feature", _param.feature);
            query.set("imageThumbURL", _param.imageThumbURL);
            query.set("name", _param.name);
            query.set("startDate", _param.startDate);
            query.set("theme", _param.theme);
            query.set("venue", _param.venue);



            query.save(null, {
              success: function(results) {
                console.log(results);
                //deferred.resolve(results);
              },
              error: function(d, error) {
                //deferred.reject(error);
              }
            });
            defs.push(def.promise());
          }

      });
      $timeout(function(){
      $.when.apply($, defs).then(function(){
        console.log("all things done");
      });
      }, 2000);
    };*/


    //addVenueData();
})

.controller('HomeCtrl', function($scope, $state, $filter, ParseEventService, $ionicLoading, ionicToast, $ionicSlideBoxDelegate, $ionicScrollDelegate) {
  $scope.eventTileList = new Array();
  $scope.eventSliderList = new Array();
  var loadEventsData = function(){
    $scope.eventTileList = new Array();
    $scope.eventSliderList = new Array();
    $ionicLoading.show();
    ParseEventService.all().then(function (data) {
      $ionicLoading.hide();
      var now = new Date();
      var today = moment(now).valueOf();
      for(var index in data){

        var event = {
          id:data[index].id,
          videoStillURL:data[index].get('videoStillURL'),
          dressCode:data[index].get('dressCode'),
          active:data[index].get('active'),
          dayOfWeek:data[index].get('dayOfWeek'),
          theme:data[index].get('theme'),
          endDate:data[index].get('endDate'),
          name:data[index].get('name'),
          venue:data[index].get('venue'),
          startDate:data[index].get('startDate'),
          desc:data[index].get('desc'),
          ordering:data[index].get('ordering'),
          imageURL:data[index].get('imageURL'),
          imageThumbURL:data[index].get('imageThumbURL'),
          imageFeatureURL:data[index].get('imageFeatureURL'),
          videoURL:data[index].get('videoURL'),
          feature:data[index].get('feature'),
          deleted:data[index].get('deleted'),
          age:data[index].get('age'),
          description:data[index].get('description'),
          timestamp:moment(data[index].get('startDate')).valueOf()
        };

        event.formatted_date = moment(event.startDate).format("MMMM Do YYYY");

        if((event.timestamp >= today) && (event.timestamp <= (parseInt(today)+ 7* 24 * 60 * 60 * 1000)))
        {
          if(event.feature == 1){
            $scope.eventTileList.push(event);
          }
          if(event.feature == 2){
            $scope.eventSliderList.push(event);
          }
        }
      }

      $scope.sortedArray = $filter('orderBy')($scope.eventTileList, 'timestamp', false);
      $scope.eventTileList = $scope.sortedArray;
      console.log($scope.eventTileList);
      $ionicSlideBoxDelegate.update();
      $ionicScrollDelegate.resize();
    },
    function (error) {
      $ionicLoading.hide();
      ionicToast.show(error.message, 'bottom',false, 3000);
    });
  };
  loadEventsData(0);

  $scope.goDetail = function(item){
    $state.go("app.event_detail", {selectedEvent:angular.toJson(item)});
  }

  $scope.goSliderDetail = function(item){
    $state.go("app.event_detail", {selectedEvent:angular.toJson(item)});
  }

})

.controller('SearchCtrl', function($scope, $state, $stateParams, ParseEventService, $ionicLoading, ionicToast, $ionicSlideBoxDelegate, $ionicScrollDelegate) {

  $scope.search = {txt:""};
  $scope.onSearch = function(){
    $scope.searchTxt = $scope.search.txt;
    console.log($scope.searchTxt);
    loadEventsData(0);
    //$state.go("app.search", {searchTxt:$scope.search.txt});
  };
  $scope.searchTxt = $scope.search.txt;
  console.log($scope.searchTxt);

  $scope.eventTileList = new Array();
  $scope.eventSliderList = new Array();
  var loadEventsData = function(){
    $scope.eventTileList = new Array();
    $scope.eventSliderList = new Array();
    $ionicLoading.show();
    ParseEventService.all().then(function (data) {
      $ionicLoading.hide();
      var now = new Date();
      var today = moment(now).valueOf();
      for(var index in data){

        var event = {
          id:data[index].id,
          videoStillURL:data[index].get('videoStillURL'),
          dressCode:data[index].get('dressCode'),
          active:data[index].get('active'),
          dayOfWeek:data[index].get('dayOfWeek'),
          theme:data[index].get('theme'),
          endDate:data[index].get('endDate'),
          name:data[index].get('name'),
          venue:data[index].get('venue'),
          startDate:data[index].get('startDate'),
          desc:data[index].get('desc'),
          ordering:data[index].get('ordering'),
          imageURL:data[index].get('imageURL'),
          imageThumbURL:data[index].get('imageThumbURL'),
          imageFeatureURL:data[index].get('imageFeatureURL'),
          videoURL:data[index].get('videoURL'),
          feature:data[index].get('feature'),
          deleted:data[index].get('deleted'),
          age:data[index].get('age'),
          description:data[index].get('description'),
          timestamp:moment(data[index].get('startDate')).valueOf()
        };

        event.formatted_date = moment(event.startDate).format("MMMM Do YYYY");

        if((event.timestamp >= today) && (event.timestamp <= (parseInt(today)+ 7* 24 * 60 * 60 * 1000)))
        {

          if(event.feature == 1 || event.feature == 2){
            if($scope.searchTxt == ""){
              $scope.eventTileList.push(event);
            }else{
              if(event.name.indexOf($scope.searchTxt)>0 || event.venue.get('name').indexOf($scope.searchTxt)>0)
                $scope.eventTileList.push(event);
            }
          }
        }
      }

      console.log($scope.eventTileList);
      $ionicSlideBoxDelegate.update();
      $ionicScrollDelegate.resize();
    },
    function (error) {
      $ionicLoading.hide();
      ionicToast.show(error.message, 'bottom',false, 3000);
    });
  };
  loadEventsData(0);

  $scope.goDetail = function(item){
    $state.go("app.event_detail", {selectedEvent:angular.toJson(item)});
  }

})

.controller('UpcommingCtrl', function($scope, $state, $ionicLoading, ParseEventService, ionicToast, $ionicScrollDelegate) {
  $scope.eventTileList = new Array();
  var loadEventsData = function(){
    $scope.eventTileList = new Array();
    $ionicLoading.show();
    ParseEventService.all().then(function (data) {
      $ionicLoading.hide();

      var firstFeatrue = [];
      var secondFeatrue = [];
      var zeroFeatrue = [];

      for(var index in data){

        var event = {
          id:data[index].id,
          videoStillURL:data[index].get('videoStillURL'),
          dressCode:data[index].get('dressCode'),
          active:data[index].get('active'),
          dayOfWeek:data[index].get('dayOfWeek'),
          theme:data[index].get('theme'),
          endDate:data[index].get('endDate'),
          name:data[index].get('name'),
          venue:data[index].get('venue'),
          startDate:data[index].get('startDate'),
          desc:data[index].get('desc'),
          ordering:data[index].get('ordering'),
          imageURL:data[index].get('imageURL'),
          imageThumbURL:data[index].get('imageThumbURL'),
          imageFeatureURL:data[index].get('imageFeatureURL'),
          videoURL:data[index].get('videoURL'),
          feature:data[index].get('feature'),
          deleted:data[index].get('deleted'),
          age:data[index].get('age'),
          description:data[index].get('description'),
          timestamp:moment(data[index].get('startDate')).valueOf()
        };

        event.formatted_date = moment(event.startDate).format("MMMM Do YYYY");

        if(event.feature == 1 && ((event.timestamp >= parseInt($scope.calendar_list[0].timestamp)) && (event.timestamp <= (parseInt($scope.calendar_list[0].timestamp)+ 7* 24 * 60 * 60 * 1000)))){
          firstFeatrue.push(event);
          //$scope.eventTileList.push(event);
        }

        if(event.feature == 2 && ((event.timestamp >= parseInt($scope.calendar_list[0].timestamp)) && (event.timestamp <= (parseInt($scope.calendar_list[0].timestamp)+ 7* 24 * 60 * 60 * 1000)))){
          secondFeatrue.push(event);
        }

        if(event.feature == 0 && ((event.timestamp >= parseInt($scope.calendar_list[0].timestamp)) && (event.timestamp <= (parseInt($scope.calendar_list[0].timestamp)+ 7* 24 * 60 * 60 * 1000)))){
          zeroFeatrue.push(event);
        }
      }

      for(var index in secondFeatrue){
        $scope.eventTileList.push(secondFeatrue[index]);
      }

      for(var index in firstFeatrue){
        $scope.eventTileList.push(firstFeatrue[index]);
      }

      for(var index in zeroFeatrue){
        $scope.eventTileList.push(zeroFeatrue[index]);
      }

      $ionicScrollDelegate.resize();
    },
    function (error) {
      $ionicLoading.hide();
      ionicToast.show(error.message, 'bottom',false, 3000);
    });
  };

  $scope.calendar_list = new Array();
  $scope.activeDate = "";
  $scope.activeNextDate = "";
  $scope.activeDateIndex = 0;
  var getCalendarData = function(){
    $scope.calendar_list = new Array();

    var now = new Date();
    //now ="Tue Oct 18 2016 11:00:00 GMT+0300 (EEST)";
    //now = now.getFullYear() +"-"+ now.getMonth() +"-"+ now.getDate();
    //now = (now.getMonth()+1) + " " + now.getDate() + " " + now.getFullYear() + " 00:00:00 GMT+0200 (EET)";

    var today = moment(now).valueOf();

    $scope.activeDate = {timestamp:today, dayNum:"", dayOfWeek:""};
    $scope.activeDateIndex = 0;
    $scope.activeNextDate = {timestamp:parseInt(today)+24*60*60*1000, dayNum:"", dayOfWeek:""};
    $scope.calendar_list.push({timestamp:today, dayNum:"", dayOfWeek:""});
    for(i=1; i<7; i++){
      var timestamp = parseInt(today) + i * 24 * 60 * 60 * 1000;

      $scope.calendar_list.push({timestamp:timestamp, dayNum:"", dayOfWeek:""})
    }

    for(var j=0; j<7; j++){
      $scope.calendar_list[j].dayNum = moment($scope.calendar_list[j].timestamp).format("DD");
      $scope.calendar_list[j].dayOfWeek = moment($scope.calendar_list[j].timestamp).format("dd");
    }

    console.log($scope.calendar_list);

    loadEventsData(0);
  };
  getCalendarData();

  $scope.changeDate = function(day){
    console.log(day);
    $scope.activeDate = day;
    $scope.activeNextDate = {timestamp:parseInt(day.timestamp)+24*60*60*1000, dayNum:"", dayOfWeek:""};
  };


  $scope.goDetail = function(item){
    $state.go("app.event_detail", {selectedEvent:angular.toJson(item)});
  }

  $scope.onSwipeLeft = function(){
    console.log("onSwipeLeft");
    if($scope.activeDateIndex>=0 && $scope.activeDateIndex<6)
    {
      $scope.activeDateIndex++;
      $scope.changeDate($scope.calendar_list[$scope.activeDateIndex]);
    }
  };

  $scope.onSwipeRight = function(){
    console.log("onSwipeRight");
    if($scope.activeDateIndex>0 && $scope.activeDateIndex<7)
    {
      $scope.activeDateIndex--;
      $scope.changeDate($scope.calendar_list[$scope.activeDateIndex]);
    }
  };

})

.controller('NotificationsCtrl', function($scope, $state, $ionicLoading, ParseEventService, NotificationService, ionicToast, $ionicScrollDelegate){
  $scope.notificationList = new Array();
  var loadNotificationsData = function(){
    $scope.notificationList = new Array();
    $ionicLoading.show();
    NotificationService.all().then(function (data) {
      $ionicLoading.hide();

      for(var i in data){
        var notification = {
          title:data[i].get('title'),
          description:data[i].get('description'),
          gallery:data[i].get('gallery'),
          event:data[i].get('event'),
          images:data[i].get('images'),
          isWhat:"nothing",
          date:moment(data[i].get('createdAt')).fromNow()}

          if(notification.event && notification.event.id)
          {
            notification.isWhat = "event";
          }

          if(notification.gallery && notification.gallery.id)
            notification.isWhat = "gallery";

          console.log(notification);
          $scope.notificationList.push(notification);
      }
    },
    function (error) {
      $ionicLoading.hide();
      ionicToast.show(error.message, 'bottom',false, 3000);
    });
  };
  loadNotificationsData();

  $scope.goGallery = function(item){
    console.log(item.gallery);
    var event = {
      id:item.gallery.id,
      venueGallery:item.gallery.get('venueGallery'),
      active:item.gallery.get('active'),
      eventDate:moment(item.gallery.get('eventDate')).format("MMMM Do YYYY"),
      venueid:item.gallery.get('venueid'),
      ordering:item.gallery.get('ordering'),
      cover:item.gallery.get('cover'),
      title:item.gallery.get('title')
    };
    $state.go("app.gallery", {selectedPhoto:angular.toJson(event)});
  };

  $scope.goEvent = function(item){
    var selectedEvent = {};
    $ionicLoading.show();
    ParseEventService.all().then(function (data) {
      $ionicLoading.hide();
      var now = new Date();
      var today = moment(now).valueOf();
      for(var index in data){

        var event = {
          id:data[index].id,
          videoStillURL:data[index].get('videoStillURL'),
          dressCode:data[index].get('dressCode'),
          active:data[index].get('active'),
          dayOfWeek:data[index].get('dayOfWeek'),
          theme:data[index].get('theme'),
          endDate:data[index].get('endDate'),
          name:data[index].get('name'),
          venue:data[index].get('venue'),
          startDate:data[index].get('startDate'),
          desc:data[index].get('desc'),
          ordering:data[index].get('ordering'),
          imageURL:data[index].get('imageURL'),
          imageThumbURL:data[index].get('imageThumbURL'),
          imageFeatureURL:data[index].get('imageFeatureURL'),
          videoURL:data[index].get('videoURL'),
          feature:data[index].get('feature'),
          deleted:data[index].get('deleted'),
          age:data[index].get('age'),
          description:data[index].get('description'),
          timestamp:moment(data[index].get('startDate')).valueOf()
        };

        event.formatted_date = moment(event.startDate).format("MMMM Do YYYY HH:SS");

        if(event.id == item.event.id)
        {
          selectedEvent = event;
        }
      }

      $state.go("app.event_detail", {selectedEvent:angular.toJson(selectedEvent)});
    },
    function (error) {
      $ionicLoading.hide();
    });


  };
})

.controller('PhotosCtrl', function($scope, $state, $ionicLoading, ParseGalleryService, ionicToast, $ionicScrollDelegate, $ionicModal){
  $scope.eventTileList = new Array();
  var loadEventsData = function(){
    $scope.eventTileList = new Array();
    $ionicLoading.show();
    ParseGalleryService.all().then(function (data) {
      $ionicLoading.hide();

      for(var index in data){

        var event = {
          id:data[index].id,
          venueGallery:data[index].get('venueGallery'),
          active:data[index].get('active'),
          eventDate:moment(data[index].get('eventDate')).format("MMMM Do YYYY"),
          venueid:data[index].get('venueid'),
          ordering:data[index].get('ordering'),
          cover:data[index].get('cover'),
          title:data[index].get('title')
        };

        $scope.eventTileList.push(event);
      }
      $ionicScrollDelegate.resize();
    },
    function (error) {
      $ionicLoading.hide();
      ionicToast.show(error.message, 'bottom',false, 3000);
    });
  };
  loadEventsData(0);

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/photo_detail.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closePhotoDetail = function() {
    $scope.modal.hide();
  };

  $scope.selectedPhoto = "";
  // Open the login modal
  $scope.showPhotoDetail = function(item) {
    $scope.selectedPhoto = item;
    console.log($scope.selectedPhoto);
    $scope.modal.show();
  };

  $scope.goPhotoGallery = function(item) {
    $state.go("app.gallery", {selectedPhoto:angular.toJson(item)});
  };
})

.controller('GalleryCtrl', function($scope, $ionicLoading, $timeout, $ionicSlideBoxDelegate, $stateParams, ParseGalleryService, ionicToast, $ionicScrollDelegate, $ionicModal){
  $scope.selectedGallery = angular.fromJson($stateParams.selectedPhoto);
  console.log($scope.selectedGallery);
  $scope.photoTileList = new Array();
  var loadEventsData = function(){
    $scope.photoTileList = new Array();
    $ionicLoading.show();
    ParseGalleryService.getAllPhotos().then(function (data) {
      $ionicLoading.hide();

      for(var index in data){

        var event = {
          id:data[index].id,
          gallery:data[index].get('gallery'),
          title:data[index].get('title'),
          eventDate:moment(data[index].get('createdAt')).format("MMMM Do YYYY"),
          filename:data[index].get('filename')
        };

        if((event.gallery != undefined) && (event.gallery.id == $scope.selectedGallery.id))
        {
          $scope.photoTileList.push(event);
        }
      }

      console.log($scope.photoTileList);
      $ionicScrollDelegate.resize();
    },
    function (error) {
      $ionicLoading.hide();
      ionicToast.show(error.message, 'bottom',false, 3000);
    });
  };
  loadEventsData(0);

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/photo_detail.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closePhotoDetail = function() {
    $scope.modal.hide();
  };

  $scope.selectedPhoto = "";
  // Open the login modal
  $scope.showPhotoDetail = function(index) {

    console.log(index);
    $scope.modal.show();
    $timeout(function(){
      $ionicSlideBoxDelegate.slide(index, 100);
      $scope.selectedPhoto = $scope.photoTileList[$ionicSlideBoxDelegate.currentIndex()];
    }, 300)
  };

  $scope.slideHasChanged = function(index){
    $scope.selectedPhoto = $scope.photoTileList[index];
  };

  $scope.shareImg = function(){
    console.log($ionicSlideBoxDelegate.currentIndex());
    window.plugins.socialsharing.shareViaInstagram('', $scope.photoTileList[$ionicSlideBoxDelegate.currentIndex()].filename, function() {console.log('share ok')}, function(errormsg){console.log(errormsg)});
  }

  $scope.options = {
    loop: false,
    effect: 'fade',
    speed: 500,
  }
})

.controller('BrowseCtrl', function($scope, $state, $ionicLoading, ParseEventService, ParseVenueService, ionicToast, $ionicScrollDelegate) {
  $scope.currentTab = "event";

  $scope.changeTab = function(name){
    $scope.currentTab = name;

    if(name == 'event'){
      loadBrowseEventsData();
    }

    if(name == 'venue'){
      loadBrowseVenueData();
    }

    if(name == 'type'){
      loadBrowseVenueTypeData();
    }
  };

  $scope.onSwipeRight = function(){

    if($scope.currentTab == 'venue'){
      $scope.currentTab = 'event';
      loadBrowseVenueData();
    }

    if($scope.currentTab == 'type'){
      $scope.currentTab = 'venue';
      loadBrowseVenueTypeData();
    }
  };

  $scope.onSwipeLeft = function(){
    if($scope.currentTab == 'venue'){
      $scope.currentTab = 'type';
      loadBrowseVenueData();
    }

    if($scope.currentTab == 'event'){
      $scope.currentTab = 'venue';
      loadBrowseEventsData();
    }

  };

  $scope.browseEventList = new Array();
  var loadBrowseEventsData = function(){
    $scope.browseEventList = new Array();
    $ionicLoading.show();
    ParseEventService.all().then(function (data) {
      $ionicLoading.hide();

      for(var index in data){

        var event = {
          id:data[index].id,
          browseEvent:data[index].get('browseEvent'),
          startDate:moment(data[index].get('startDate')).valueOf()
        };

        var now = new Date();
        var today = moment(now).valueOf();
        var lastDay = parseInt(today) + 7 * 24 * 60 * 60 * 1000;
        if(parseInt(event.startDate) > parseInt(today) && parseInt(event.startDate) < parseInt(lastDay)){
          //console.log(event);
          if(event.browseEvent && event.browseEvent.id){

            var browseevent = {
              id:event.browseEvent.id,
              EventName:event.browseEvent.get('EventName'),
              BrowseEventImg:event.browseEvent.get('BrowseEventImg')
            };

            var flag = false;
            for(var j in $scope.browseEventList){
              if($scope.browseEventList[j].id == browseevent.id)
                flag = true;
            }
            //console.log(browseevent);
            if(flag == false)
              $scope.browseEventList.push(browseevent);
          }
        }
      }
      $ionicScrollDelegate.resize();
    },
    function (error) {
      $ionicLoading.hide();
      ionicToast.show(error.message, 'bottom',false, 3000);
    });
  };

  $scope.browseVenueList = new Array();
  var loadBrowseVenueData = function(){
    $scope.browseVenueList = new Array();
    $ionicLoading.show();
    ParseEventService.all().then(function (data) {
      $ionicLoading.hide();

      for(var index in data){

        var event = {
          id:data[index].id,
          browseVenue:data[index].get('browseVenue'),
          startDate:moment(data[index].get('startDate')).valueOf(),
          venue:data[index].get('venue'),
        };
        var now = new Date();
        var today = moment(now).valueOf();
        var lastDay = parseInt(today) + 7 * 24 * 60 * 60 * 1000;
        if(parseInt(event.startDate) > parseInt(today) && parseInt(event.startDate) < parseInt(lastDay)){

          if(event.browseVenue && event.browseVenue.id){

            var browseVenue = {
              id:event.browseVenue.id,
              VenueName:event.browseVenue.get('VenueName'),
              VenueThumImag:event.venue.get('imageThumbURL')
            };

            var flag = false;
            for(var j in $scope.browseVenueList){
              if($scope.browseVenueList[j].id == browseVenue.id)
                flag = true;
            }
            //console.log(browseevent);
            if(flag == false)
              $scope.browseVenueList.push(browseVenue);
          }
        }
      }
      $ionicScrollDelegate.resize();
    },
    function (error) {
      $ionicLoading.hide();
      ionicToast.show(error.message, 'bottom',false, 3000);
    });
  };


  $scope.browseVenueTypeList = new Array();
  var loadBrowseVenueTypeData = function(){
      $scope.browseVenueTypeList = new Array();
      $ionicLoading.show();
      ParseVenueService.all().then(function (data) {
        $ionicLoading.hide();

        for(var index in data){

          var event = {
            id:data[index].id,
            name:data[index].get('name'),
            browseVenueType:data[index].get('browseVenueType')
          };

            if(event.browseVenueType && event.browseVenueType.id){

                var browseVenueType = {
                  id:event.browseVenueType.id,
                  VenueTypeName:event.browseVenueType.get('VenueTypeName'),
                  VenueTypeThumImg:event.browseVenueType.get('VenueTypeThumImg')
                };

                var flag = false;
                for(var j in $scope.browseVenueTypeList){
                  if($scope.browseVenueTypeList[j].id == browseVenueType.id)
                    flag = true;
                }
                //console.log(browseevent);
                if(flag == false)
                {
                  $scope.browseVenueTypeList.push(browseVenueType);
                }
            }

          //$scope.browseVenueTypeList.push(event);
        }
        $ionicScrollDelegate.resize();
      },
      function (error) {
        $ionicLoading.hide();
        ionicToast.show(error.message, 'bottom',false, 3000);
      });
  };

  $scope.changeTab("event");

  $scope.goEventCategory = function(item){
    $state.go("app.browseCategory", {selectedData:angular.toJson({type:"event", id:item.id, name:item.EventName})});
  };

  $scope.goVenueCategory = function(item){
    //$state.go("app.browseCategory", {selectedData:angular.toJson({type:"venue", id:item.id, name:item.VenueName})});
    $state.go("app.browseCategory", {selectedData:angular.toJson({type:"venue", id:item.id, name:item.EventName})});
  };

  $scope.goVenueTypeCategory = function(item){
    $state.go("app.browseCategory", {selectedData:angular.toJson({type:"venueType", id:item.id, name:item.VenueTypeName})});
  };
})

.controller('BrowseCategoryCtrl', function($scope, $filter, $state, $stateParams, ParseEventService, $ionicLoading, ionicToast, $ionicSlideBoxDelegate, $ionicScrollDelegate) {
  $scope.selectedData = angular.fromJson($stateParams.selectedData);
  console.log($scope.selectedData);

  $scope.eventTileList = new Array();
  var loadEventsData = function(){
    $scope.eventTileList = new Array();

    $ionicLoading.show();
    ParseEventService.all().then(function (data) {
      $ionicLoading.hide();
      var now = new Date();
      var today = moment(now).valueOf();
      for(var index in data){

        var event = {
          id:data[index].id,
          videoStillURL:data[index].get('videoStillURL'),
          dressCode:data[index].get('dressCode'),
          active:data[index].get('active'),
          dayOfWeek:data[index].get('dayOfWeek'),
          theme:data[index].get('theme'),
          endDate:data[index].get('endDate'),
          name:data[index].get('name'),
          venue:data[index].get('venue'),
          venueId:data[index].get('venue').id,
          venueLogo:data[index].get('venue').get("imageThumbURL"),
          startDate:data[index].get('startDate'),
          desc:data[index].get('desc'),
          ordering:data[index].get('ordering'),
          imageURL:data[index].get('imageURL'),
          imageThumbURL:data[index].get('imageThumbURL'),
          imageFeatureURL:data[index].get('imageFeatureURL'),
          videoURL:data[index].get('videoURL'),
          feature:data[index].get('feature'),
          deleted:data[index].get('deleted'),
          age:data[index].get('age'),
          description:data[index].get('description'),
          timestamp:moment(data[index].get('startDate')).valueOf(),
          browseVenue:data[index].get('browseVenue'),
          browseEvent:data[index].get('browseEvent')
        };

        if(event.venue){
            event.browseVenueType = event.venue.get('browseVenueType');
        }

        event.formatted_date = moment(event.startDate).format("MMMM Do YYYY");

        if((event.timestamp >= today) && (event.timestamp <= (parseInt(today)+ 7* 24 * 60 * 60 * 1000)))
        {
          //if(event.feature == 1){
            if($scope.selectedData.type == "event" && event.browseEvent && $scope.selectedData.id == event.browseEvent.id)
              $scope.eventTileList.push(event);

            if($scope.selectedData.type == "venue" && event.browseEvent && $scope.selectedData.id == event.browseEvent.id)
            {
                var flag = false;
                for(var i in $scope.eventTileList){
                  if(event.venueId == $scope.eventTileList[i].venueId){
                    flag = true;
                  }
                }
                if(flag == false){
                  event.imageThumbURL = event.venueLogo;
                  $scope.eventTileList.push(event);
                }
            }

            // if($scope.selectedData.type == "venue" && event.browseVenue && $scope.selectedData.id == event.browseVenue.id)
            // {
            //   event.imageThumbURL = event.venueLogo;
            //   $scope.eventTileList.push(event);
            // }

            if($scope.selectedData.type == "venueType" && event.browseVenueType && $scope.selectedData.id == event.browseVenueType.id)
            {
              var flag = false;
              for(var i in $scope.eventTileList){
                if(event.venueId == $scope.eventTileList[i].venueId){
                  flag = true;
                }
              }
              if(flag == false){
                event.imageThumbURL = event.venueLogo;
                $scope.eventTileList.push(event);
              }
            }

            $scope.sortedArray = $filter('orderBy')($scope.eventTileList, 'timestamp', false);
            $scope.eventTileList = $scope.sortedArray;
          //}
        }
      }

      $ionicSlideBoxDelegate.update();
      $ionicScrollDelegate.resize();
    },
    function (error) {
      $ionicLoading.hide();
      ionicToast.show(error.message, 'bottom',false, 3000);
    });
  };
  loadEventsData(0);

  $scope.goDetail = function(item){
    if($scope.selectedData.type == "venue" || $scope.selectedData.type == "venueType"){
      $state.go("app.venue_detail", {selectedEvent:angular.toJson(item)});
    }else{
      $state.go("app.event_detail", {selectedEvent:angular.toJson(item)});
    }
  }

})

.controller('SettingsCtrl', function($scope, $state, $rootScope, $timeout, $rootScope, $ionicLoading, ParseEventService, ionicToast, $ionicHistory, $ionicActionSheet, $cordovaEmailComposer, $cordovaCamera) {
    var currentUser = Parse.User.current();
    $scope.currentUser = {firstName:"", lastName:"", profileImage:"", password:"", email:"", $timeout, pusNotification:""};
    if (currentUser) {
        // do stuff with the user
        $scope.currentUser.firstName = currentUser.get('firstName');
        $scope.currentUser.lastName = currentUser.get('lastName');
        $scope.currentUser.profileImage = currentUser.get('profileImage');
        $scope.currentUser.email = currentUser.get('email');
        $scope.currentUser.pushNotification = currentUser.get('pushNotification');
    } else {
        // show the signup or login page
        $state.go("first");
    }

    $scope.looksLikeMail = function (str) {
      var lastAtPos = str.lastIndexOf('@');
      var lastDotPos = str.lastIndexOf('.');
      return (lastAtPos < lastDotPos && lastAtPos > 0 && str.indexOf('@@') == -1 && lastDotPos > 2 && (str.length - lastDotPos) > 2);
    }

    $scope.onSave = function(){
          if($scope.currentUser.profileImage == undefined || $scope.currentUser.profileImage == "")
          {
            ionicToast.show('Please select photo image.', 'bottom',false, 3000);
            return;
          }

          if($scope.currentUser.firstName == undefined || $scope.currentUser.firstName == "")
          {
            ionicToast.show('Please enter first name.', 'bottom',false, 3000);
            return;
          }

          if($scope.currentUser.lastName == undefined || $scope.currentUser.lastName == "")
          {
            ionicToast.show('Please enter last name.', 'bottom',false, 3000);
            return;
          }

          // if($scope.currentUser.email == undefined || $scope.currentUser.email == "" || !$scope.looksLikeMail($scope.currentUser.email))
      		// {
      		// 	ionicToast.show('Please enter valid email address.', 'bottom',false, 3000);
      		// 	return;
      		// }

          $ionicLoading.show();
          var currentUser = Parse.User.current();
          var query = new Parse.Query(Parse.User);
          query.get(currentUser.id, {
            success: function(userAgain) {
              $ionicLoading.hide();
              console.log(userAgain);
              userAgain.set("firstName", $scope.currentUser.firstName);
              userAgain.set("lastName", $scope.currentUser.lastName);
              userAgain.set("email", $scope.currentUser.email);
              userAgain.set("profileImage", $scope.currentUser.profileImage);
              userAgain.set("pushNotification", $scope.currentUser.pushNotification);
              userAgain.save(null, {
                success:function(useragainAgain){
                  $rootScope.$broadcast('refreshUserInfo');
                  ionicToast.show("User information has been changed successfully.", 'bottom',false, 3000);
                },
                error: function(userAgain, error) {
                  // This will error, since the Parse.User is not authenticated
                  console.log(error);
                }
              });
            }
          });
    };

    $scope.changePush = function(){
      console.log($scope.currentUser.pushNotification);
      if($scope.currentUser.pushNotification){
        $ionicLoading.show();
        parsePlugin.subscribe('SampleChannel', function() {
            console.log('OK');
            $ionicLoading.hide();
        }, function(e) {
            console.log('error');
            $ionicLoading.hide();
        });
      }else{
        $ionicLoading.show();
        Parse.Cloud.run("removeInstallation", {installationId:$rootScope.installationId}, {
          success:function(result){
            console.log(result);
            $ionicLoading.hide();
          },
          error:function(error){
            console.log(error);
            $ionicLoading.hide();
          }
        });
      }
    };

    var onSuccess = function (data) {
  		window.resolveLocalFileSystemURI(data, function(entry) {
  				var reader = new FileReader();

  				reader.onloadend = function(evt) {
                $ionicLoading.show();
  							var byteArray = new Uint8Array(evt.target.result);
  							var output = new Array( byteArray.length );
  							var i = 0;
  							var n = output.length;
  							while( i < n ) {
  							    output[i] = byteArray[i];
  							    i++;
  							}
  							var parseFile = new Parse.File("mypic.jpg", output);

  						  parseFile.save().then(function(ob) {
                    try{
                  		$scope.currentUser.profileImage = JSON.stringify(ob).split(",")[2].split("\":")[1].replace("}", "").replace("\"", "").replace("\"", "");
  									}catch(e){}
  									$timeout(function(){$scope.$apply();});

                    $ionicLoading.hide();
  						  }, function(error) {
  						      console.log(error);
                    $ionicLoading.hide();
  			        });

    			}

  				reader.onerror = function(evt) {
  				      console.log('read error');
  				}

  				entry.file(function(s) {
  				    	reader.readAsArrayBuffer(s);
  				}, function(e) {
  					    console.log('ee');
  				});
  			});
  	}

    $scope.showCameraSheet = function() {

       // Show the action sheet
       var hideSheet = $ionicActionSheet.show({
         buttons: [
           { text: 'From Camera' },
           { text: 'From PhotoLibrary' }
         ],
         titleText: 'Select your photo',
         cancelText: 'Cancel',
         cancel: function() {
              // add cancel code..
            },
         buttonClicked: function(index) {
            if(index == 0)
     				{
     					var options = {
     					  quality:50,
     					  targetWidth:300,
     					  targetHeight:300,
     					  destinationType: Camera.DestinationType.FILE_URI,
     					  sourceType: Camera.PictureSourceType.CAMERA,
     					};

     					$cordovaCamera.getPicture(options).then(onSuccess, function(err) {
     					  console.log(err);
     					});
     				}else{
     					var options = {
     					  quality:50,
     					  targetWidth:300,
     					  targetHeight:300,
     					  destinationType: Camera.DestinationType.FILE_URI,
     					  sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
     					};

     					$cordovaCamera.getPicture(options).then(onSuccess, function(err) {
     					  console.log(err);
     					});
     				}
            return true;
         }
       });
     };

     $scope.onContact = function(){
       var email = {
          to: 'rodk.music@gmail.com',
          cc: '',
          bcc: [],
          attachments: [],
          subject: 'Wugi App',
          body: '',
          isHtml: true
        };

       $cordovaEmailComposer.open(email).then(null, function () {
         //ionicToast.show('Email has been sent.', 'bottom',false, 3000);
       });
     };
})

.controller('ChangePasswordCtrl', function($scope, $ionicLoading, ParseEventService, ionicToast, $ionicHistory) {
  $scope.user = {current_psw:"", new_psw:""};

  var currentUser = Parse.User.current();

  $scope.goBack = function(){
    $ionicHistory.goBack();
  };

  $scope.onSavePassword = function(){
    if($scope.user.current_psw == undefined || $scope.user.current_psw == "")
    {
      ionicToast.show('Please enter current password.', 'bottom',false, 3000);
      return;
    }

    if($scope.user.new_psw == undefined || $scope.user.new_psw == "")
    {
      ionicToast.show('Please enter cell phone number.', 'bottom',false, 3000);
      return;
    }

    var currentUser = Parse.User.current();
    if(currentUser){
        $ionicLoading.show();
        Parse.User.logIn(currentUser.get('username'), $scope.user.current_psw, {
          success: function(userAgain) {
            // Do stuff after successful login.
            //console.log(userAgain);
            userAgain.set("password", $scope.user.new_psw);
              userAgain.save(null, {
                success:function(userAgagin1){
                  $ionicLoading.hide();
                  ionicToast.show("Password has been changed successfully.", 'bottom',false, 3000);
                  $ionicHistory.goBack();
                },
                error: function(userAgain1, error) {
                  // This will error, since the Parse.User is not authenticated
                  console.log(userAgain1);
                  $ionicLoading.hide();
                }
            });

          },
          error: function(user, error) {
            // The login failed. Check error to see why.
            console.log(error);
            $ionicLoading.hide();
            ionicToast.show("Please enter exact current password.", 'bottom',false, 3000);

          }
        });
    }
  };
})

.controller('ForgotPasswordCtrl', function($scope, $ionicLoading, ionicToast, $ionicHistory) {

  $scope.user = {email:""};

  $scope.looksLikeMail = function (str) {
    var lastAtPos = str.lastIndexOf('@');
    var lastDotPos = str.lastIndexOf('.');
    return (lastAtPos < lastDotPos && lastAtPos > 0 && str.indexOf('@@') == -1 && lastDotPos > 2 && (str.length - lastDotPos) > 2);
  }

  $scope.send = function(){
    console.log($scope.user.email);
    if($scope.user.email == undefined || $scope.user.email == "" || !$scope.looksLikeMail($scope.user.email))
    {
      ionicToast.show('Please enter valid email address.', 'bottom',false, 3000);
      return;
    }

    $ionicLoading.show();
    Parse.User.requestPasswordReset($scope.user.email, {
      success: function() {
        // Password reset request was sent successfully
        $ionicLoading.hide();
        ionicToast.show("Email has been sent. Please check your inbox.", 'bottom',false, 47000);
        //$ionicHistory.goBack();
      },
      error: function(error) {
        // Show the error message somewhere
        //alert("Error: " + error.code + " " + error.message);
        $ionicLoading.hide();
        ionicToast.show(error.message, 'bottom',false, 47000);
      }
    });
  };

  $scope.goBack = function(){
    $ionicHistory.goBack();
  };
})

.controller('EventDetailCtrl', function($scope, $state, $ionicLoading, ParseEventService, ionicToast, $ionicHistory, $stateParams, $cordovaGeolocation, $cordovaLaunchNavigator, $cordovaInAppBrowser) {
  console.log(angular.fromJson($stateParams.selectedEvent));
  $scope.event = angular.fromJson($stateParams.selectedEvent);

  if($scope.event && $scope.event.venue && $scope.event.venue.recentPhotos){
    $scope.event.venue.photos = new Array();
    for(var index in $scope.event.venue.recentPhotos){
      $scope.event.venue.photos.push({url:$scope.event.venue.recentPhotos[index]});
    }
  }

  var distance = function(lat1, lon1, lat2, lon2, unit) {
  	var radlat1 = Math.PI * lat1/180;
  	var radlat2 = Math.PI * lat2/180;
  	var theta = lon1-lon2;
  	var radtheta = Math.PI * theta/180;
  	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  	dist = Math.acos(dist);
  	dist = dist * 180/Math.PI;
  	dist = dist * 60 * 1.1515;
  	if (unit=="K") { dist = dist * 1.609344 }
  	if (unit=="N") { dist = dist * 0.8684 }
    dist = parseInt(dist * 100) / 100;
  	return dist
  }

  $scope.myLocation = {lat:1, long:1};
  var getDistance = function(){
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
        $scope.myLocation.lat  = position.coords.latitude;
        $scope.myLocation.long = position.coords.longitude;

        dist = distance($scope.myLocation.lat, $scope.myLocation.long, $scope.event.venue.geolocation.latitude, $scope.event.venue.geolocation.longitude);
        $scope.event.venue.dist = dist;
      }, function(err) {
        // error
      });
  };
  getDistance();

  $scope.goVenueDetail = function(){
    $state.go("app.venue_detail", {selectedEvent:angular.toJson($scope.event)})
  };

  var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'yes'
  };
  $scope.openWebsite = function(url){
    $cordovaInAppBrowser.open(url, '_blank', options).then(function(event) {
        // success
      })
      .catch(function(event) {
        // error
      });
  };

  $scope.navigatorApp = function(){
    var destination = [$scope.event.venue.geolocation.latitude, $scope.event.venue.geolocation.longitude];
  	var start = [$scope.myLocation.lat, $scope.myLocation.long];
      var options = {app:launchnavigator.APP.UBER};
      $cordovaLaunchNavigator.navigate(destination, start,  options).then(function() {
        console.log("Navigator launched");
      }, function (err) {
        console.error(err);
      });
  };

  $scope.goMapBrowser = function(){
    var url = "https://www.google.com/maps/search/" + $scope.event.venue.address[0]+","+$scope.event.venue.address[1];
    console.log(url);
    $cordovaInAppBrowser.open(url, '_system', options).then(function(event) {
        // success
      })
      .catch(function(event) {
        // error
      });
  };
})

.controller('VenueDetailCtrl', function($scope, $state, $ionicLoading, ParseGalleryService, ParseEventService, ionicToast, $ionicHistory, $stateParams, $cordovaGeolocation, $cordovaLaunchNavigator, $cordovaInAppBrowser) {
  console.log(angular.fromJson($stateParams.selectedEvent));
  $scope.event = angular.fromJson($stateParams.selectedEvent);

  if($scope.event && $scope.event.venue && $scope.event.venue.recentPhotos){
    $scope.event.venue.photos = new Array();
    for(var index in $scope.event.venue.recentPhotos){
      $scope.event.venue.photos.push({url:$scope.event.venue.recentPhotos[index]});
    }
  }

  var loadVenuePhotoData = function(){
    $scope.event.venue.photos = new Array();
    $ionicLoading.show();
    ParseGalleryService.all().then(function (data) {
      $ionicLoading.hide();

      for(var index in data){

        var event = {
          id:data[index].id,
          venueGallery:data[index].get('venueGallery'),
          active:data[index].get('active'),
          eventDate:moment(data[index].get('eventDate')).format("MMMM Do YYYY"),
          venueid:data[index].get('venueid'),
          ordering:data[index].get('ordering'),
          cover:data[index].get('cover'),
          title:data[index].get('title')
        };
        if(event.venueid.id == $scope.event.venue.objectId)
          $scope.event.venue.photos.push(event);
      }
    },
    function (error) {
      $ionicLoading.hide();
      ionicToast.show(error.message, 'bottom',false, 3000);
    });
  };
  loadVenuePhotoData(0);

  $scope.goPhotoGallery = function(gallery){
    console.log(gallery);
    $state.go("app.gallery", {selectedPhoto:angular.toJson(gallery)});
  };

  var distance = function(lat1, lon1, lat2, lon2, unit) {
  	var radlat1 = Math.PI * lat1/180;
  	var radlat2 = Math.PI * lat2/180;
  	var theta = lon1-lon2;
  	var radtheta = Math.PI * theta/180;
  	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  	dist = Math.acos(dist);
  	dist = dist * 180/Math.PI;
  	dist = dist * 60 * 1.1515;
  	if (unit=="K") { dist = dist * 1.609344 }
  	if (unit=="N") { dist = dist * 0.8684 }
    dist = parseInt(dist * 100) / 100;
  	return dist
  }

  $scope.myLocation = {lat:1, long:1};
  var getDistance = function(){
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
        $scope.myLocation.lat  = position.coords.latitude;
        $scope.myLocation.long = position.coords.longitude;

        dist = distance($scope.myLocation.lat, $scope.myLocation.long, $scope.event.venue.geolocation.latitude, $scope.event.venue.geolocation.longitude);
        $scope.event.venue.dist = dist;
      }, function(err) {
        // error
      });
  };
  getDistance();

  $scope.goVenueDetail = function(){
    $state.go("app.venue_detail", {selectedEvent:angular.toJson($scope.event)})
  };

  var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'yes'
  };
  $scope.openWebsite = function(url){
    $cordovaInAppBrowser.open(url, '_blank', options).then(function(event) {
        // success
      })
      .catch(function(event) {
        // error
      });
  };

  $scope.navigatorApp = function(){
    var destination = [$scope.event.venue.geolocation.latitude, $scope.event.venue.geolocation.longitude];
  	var start = [$scope.myLocation.lat, $scope.myLocation.long];
      var options = {app:launchnavigator.APP.UBER};
      $cordovaLaunchNavigator.navigate(destination, start,  options).then(function() {
        console.log("Navigator launched");
      }, function (err) {
        console.error(err);
      });
  };

  $scope.goMapBrowser = function(){
    var url = "https://www.google.com/maps/search/" + $scope.event.venue.address[0]+","+$scope.event.venue.address[1];
    console.log(url);
    $cordovaInAppBrowser.open(url, '_system', options).then(function(event) {
        // success
      })
      .catch(function(event) {
        // error
      });
  };
})

.controller('TermsOfUseCtrl', function($scope, $rootScope, $ionicLoading, $ionicHistory, ionicToast, $ionicViewSwitcher, $state){
  Parse.initialize("G9watfzx5oPJPdhlfDtW6wNXrEY7syqZYQnmW0nO", "GlKvpo90mEnPJCvlnvYPbnEApCUHPWS4TFkYxr7y");
  Parse.serverURL = "https://parseapi.back4app.com";

  $scope.goBack = function(){
    $ionicHistory.goBack();
  };

  $scope.loginAsGuest = function(){

    $rootScope.loginAsGuest = true;
    $ionicViewSwitcher.nextDirection('back');
    $state.go("app.home");
  };
})

;
