'use strict';

/**
 * @ngdoc overview
 * @name dailyRouteApp
 * @description
 * # dailyRouteApp
 *
 * Main module of the application.
 */
angular
    .module('dailyRouteApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ui.router',
        'gsDirectives',
        'ngAutocomplete',
        'ngTell',
        'LocalForageModule',
        'angularMoment'
    ])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        '$localForageProvider',
        function ($stateProvider, $urlRouterProvider, $localForageProvider) {

            /*$localForageProvider.config({
             driver: 'localStorageWrapper', // if you want to force a driver
             name: 'DailyRoute', // name of the database and prefix for your data, it is "lf" by default
             version: 1.0, // version of the database, you shouldn't have to use this
             storeName: 'dailyroutestorage', // name of the table
             description: 'Store the daily routes'
             });*/

            $localForageProvider.setNotify(true, true); // itemSet, itemRemove

            $stateProvider
                .state('main', {
                    url: '/',
                    views: {
                        'MainContent@': {
                            templateUrl: '/views/common/main-content.html',
                            controller: 'MainContentCtrl'
                        },
                        'MenuPanel@': {
                            templateUrl: '/views/menu/menu-panel.html',
                            controller: 'MenuPanelCtrl'
                        },
                        'Header@main': {
                            templateUrl: '/views/common/header.html',
                            controller: 'HeaderCtrl'
                        }
                    }
                })
                .state('main.dashboard', {
                    url: 'dashboard',
                    views: {
                        'Content@main': {
                            templateUrl: '/views/dashboard/dashboard.html',
                            controller: 'DashboardCtrl'
                        },
                        'SlideMenu@': {
                            templateUrl: '/views/common/add-route.html',
                            controller: 'AddRouteCtrl'
                        }
                    }
                })
                .state('main.settings', {
                    url: 'settings',
                    views: {
                        'Content@main': {
                            templateUrl: '/views/menu/settings.html',
                            controller: 'SettingsCtrl'
                        }
                    }
                });
            $urlRouterProvider.otherwise('/dashboard');
        }
    ])
    .run([
        '$state',
        '$stateParams',
        'drawerParams',
        'slideOutMenuParams',
        'gsDeviceListeners',
        '$rootScope',
        function ($state, $stateParams, drawerParams, slideOutMenuParams, gsDeviceListeners, $rootScope) {
            $rootScope.$state = $state;
            $rootScope.drawerParams = drawerParams;
            $rootScope.slideOutMenuParams = slideOutMenuParams;
            gsDeviceListeners.init();
            $rootScope.$on('$stateChangeStart', function () {
                drawerParams.close();
                slideOutMenuParams.close();
            });
            $rootScope.$on('$$back', function (event) {
                if (drawerParams.isDrawerOpen || slideOutMenuParams.isSlideOpen) {
                    event.preventDefault();
                    event.defaultPrevented = true;
                    drawerParams.close();
                    slideOutMenuParams.close();
                    $rootScope.$apply();
                }
            });
            $rootScope.$on('$$menu', function (event) {
                event.preventDefault();
                event.defaultPrevented = true;
                if (!slideOutMenuParams.isSlideOpen) {
                    drawerParams.toggle();
                }
                $rootScope.$apply();
            });
        }
    ]);
