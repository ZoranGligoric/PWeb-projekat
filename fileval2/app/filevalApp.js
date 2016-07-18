
var filevalApp = angular.module('fileval', ['ngRoute']);

filevalApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
       /* .when('/pages/home', {
            templateUrl: 'pages/home.html',
            controller: 'homeCtrl',
        })
        .when('/pages/zadaci', {
            templateUrl: 'pages/zadaci.html',
            controller: 'zadaciCtrl',
        })
        .when('/pages/kandidati', {
            templateUrl: 'pages/kandidati.html',
            controller: 'kandidatiCtrl',
        })*/
        .when('/pages/sheme', {
            templateUrl: '../pages/shemaOcenjivanja.html',
            controller: 'shemaCtrl',
        })/*
        .when('/pages/stats', {
            templateUrl: 'pages/statistike.html',
            controller: 'statistikeCtrl',
        });*/
    $locationProvider.html5Mode(true);
}]);

filevalApp.run(['$location', '$rootScope', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);

filevalApp.controller('generalCtrl', ['$route', '$routeParams', '$location',
    function($route, $routeParams, $location) {
        this.$route = $route;
        this.$location = $location;
        this.$routeParams = $routeParams;
}]);

filevalApp.controller('shemaCtrl', ['$route', '$routeParams', '$location',
        function($route, $routeParams, $location) {
            this.$route = $route;
            this.$location = $location;
            this.$routeParams = $routeParams;

            getShema(); // Ucitava sve sheme
            function getShema() {
                $http.post("php/getShema.php").success(function (data) {
                    $scope.sheme = data;
                });
            }
            $scope.addShema = function (shema) {
                $http.post("php/addShema.php?shema=" + shema).success(function (data) {
                    getShema();
                    $scope.shemaInput = "";
                });
            };
            $scope.deleteShema = function (shema) {
                if (confirm("Da li ste sigurni da želite da uklonite shemu?")) {
                    $http.post("php/deleteShema.php?taskID=" + shema).success(function (data) {
                        getShema();
                    });
                }
            };

            $scope.toggleStatus = function (item, status, shema) {
                if (status == '2') {
                    status = '0';
                } else {
                    status = '2';
                }
                $http.post("php/updateShema.php?taskID=" + item + "&status=" + status).success(function (data) {
                    getShema();
                });
            };
        }
]);

   /* .controller('BookCtrl', ['$routeParams', function($routeParams) {
        this.name = "BookCtrl";
        this.params = $routeParams;
    }])
    .controller('ChapterCtrl', ['$routeParams', function($routeParams) {
        this.name = "ChapterCtrl";
        this.params = $routeParams;
    }]);




filevalApp.controller('shemaController', function($scope, $http) {*/
