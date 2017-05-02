// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'ionic-toast', 'ionicLazyLoad'])

.run(function($ionicPlatform, ionicToast, $state, $rootScope) {
  $ionicPlatform.ready(function() {
    Parse.initialize("G9watfzx5oPJPdhlfDtW6wNXrEY7syqZYQnmW0nO", "GlKvpo90mEnPJCvlnvYPbnEApCUHPWS4TFkYxr7y");
    Parse.serverURL = "https://parseapi.back4app.com";
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      //cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      //StatusBar.styleDefault();
    }

    if(navigator.network && navigator.network.connection.type == "none"){
  		ionicToast.show("You don't appear to have an active connection. Please check your network status.", 'bottom',false, 10000);
  		$state.go("first");
  	}

  	var onOffline = function(){
  		ionicToast.show("You don't appear to have an active connection. Please check your network status.", 'bottom',false, 10000);
  		$state.go("first");
  	};

  	document.addEventListener("offline", onOffline, false);

    function doWhatever(){
        parsePlugin.getInstallationId(function(id) {
            console.log(id);
            $rootScope.installationId = id;
        }, function(e) {
            console.log('error');
        });

        parsePlugin.getSubscriptions(function(subscriptions) {
            console.log(subscriptions);
        }, function(e) {
            console.log('error');
        });
        /*
        parsePlugin.subscribe('SampleChannel', function() {
            console.log('OK');
        }, function(e) {
            console.log('error');
        });

        parsePlugin.unsubscribe('SampleChannel', function(msg) {
            console.log('OK');
        }, function(e) {
            console.log('error');
        });
        */
    }

    function onNotification(pnObj){
        //alert("received pn: " + JSON.stringify(pnObj));
        navigator.notification.alert(angular.toJson(pnObj), function(index){}, "Wugi", "Ok");
    }

    function onPushOpen(pnObj){
        //alert("open from pn: " + JSON.stringify(pnObj));
        navigator.notification.alert(angular.toJson(pnObj), function(index){}, "Wugi", "Ok");
    }
    try{
      parsePlugin.register({
      appId:"G9watfzx5oPJPdhlfDtW6wNXrEY7syqZYQnmW0nO", clientKey:"DDpKun5fbQLzvuXdKwDtTnwgIQdln6BAV0m7qBxe", server:"https://parseapi.back4app.com", ecb:"onNotification", pushOpen: "onPushOpen" },
      function() {
          console.log('successfully registered device!');
          doWhatever();
      }, function(e) {
          console.log('error registering device: ' + e);
      });
    }catch(e){console.log(e);}
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.views.swipeBackEnabled(false);
	$ionicConfigProvider.views.maxCache(5);
  $ionicConfigProvider.navBar.alignTitle('center');

  $stateProvider

  .state('first', {
    url: '/first',
    templateUrl: 'templates/first.html',
    controller: 'FirstCtrl'
  })

  .state('termsofuse', {
    url: '/termsofuse',
    templateUrl: 'templates/termsofuse.html',
    controller: 'TermsOfUseCtrl'
  })

  .state('forgotpassword', {
    url: '/forgotpassword',
    templateUrl: 'templates/forgot_password.html',
    controller: 'ForgotPasswordCtrl'
  })

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        }
      }
  })

  .state('app.browseCategory', {
      url: '/browseCategory/:selectedData',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse_category.html',
          controller: 'BrowseCategoryCtrl'
        }
      }
  })

  .state('app.search', {
      url: '/search',
      views: {
        'menuContent': {
          templateUrl: 'templates/search.html',
          controller: 'SearchCtrl'
        }
      },
      cache:false
  })

  .state('app.event_detail', {
      url: '/event_detail/:selectedEvent',
      views: {
        'menuContent': {
          templateUrl: 'templates/event_detail.html',
          controller: 'EventDetailCtrl'
        }
      }
  })

  .state('app.venue_detail', {
      url: '/venue_detail/:selectedEvent',
      views: {
        'menuContent': {
          templateUrl: 'templates/venue_detail.html',
          controller: 'VenueDetailCtrl'
        }
      }
  })

  .state('app.upcomming', {
      url: '/upcomming',
      views: {
        'menuContent': {
          templateUrl: 'templates/upcomming.html',
          controller: 'UpcommingCtrl'
        }
      }
  })

  .state('app.photos', {
      url: '/photos',
      views: {
        'menuContent': {
          templateUrl: 'templates/photos.html',
          controller: 'PhotosCtrl'
        }
      }
  })

  .state('app.gallery', {
      url: '/gallery/:selectedPhoto',
      views: {
        'menuContent': {
          templateUrl: 'templates/gallery.html',
          controller: 'GalleryCtrl'
        }
      }
  })

  .state('app.notifications', {
      url: '/notifications',
      views: {
        'menuContent': {
          templateUrl: 'templates/notifications.html',
          controller: 'NotificationsCtrl'
        }
      }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html',
          controller: 'BrowseCtrl'
        }
      }
  })

  .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: 'templates/settings.html',
          controller: 'SettingsCtrl'
        }
      }
  })

  .state('app.change_password', {
      url: '/change_password',
      views: {
        'menuContent': {
          templateUrl: 'templates/change_password.html',
          controller: 'ChangePasswordCtrl'
        }
      }
  })

  .state('app.about', {
      url: '/about',
      views: {
        'menuContent': {
          templateUrl: 'templates/about.html'
        }
      }
  })

  .state('app.contact', {
      url: '/contact',
      views: {
        'menuContent': {
          templateUrl: 'templates/contact.html'
        }
      }
  })

  .state('app.privacy', {
      url: '/privacy',
      views: {
        'menuContent': {
          templateUrl: 'templates/privacy.html'
        }
      }
  })

  .state('app.terms', {
      url: '/terms',
      views: {
        'menuContent': {
          templateUrl: 'templates/terms.html'
        }
      }
  })

    ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/first');
})
.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeHandler);
    }
  };
})
;
