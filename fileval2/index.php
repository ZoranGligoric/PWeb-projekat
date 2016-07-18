<?php
session_start();
if(!isset($_SESSION["username"])){
header("Location: partials/login.php");
exit(); }
?>

<!DOCTYPE html>

<html ng-app="filevalApp" ng-init="page=shemaOcenjivanja.html" ng-controller="generalController">
    <head>
        <title>Filološki fakultet - sistem za evaluaciju</title>
        <meta charset='utf-8'>
        <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css"/>
        <link rel="stylesheet" type="text/css" href="css/style.css"/>
        <link href="http://fonts.googleapis.com/css?family=Open+Sans:400,600,300,700" rel="stylesheet" type="text/css">

        <script type="text/javascript" src="js/angular.min.js"></script>
        <script type="text/javascript" src="app/filevalApp.js"></script>
    </head>

    <body>
    
        <div class="navbar navbar-default" id="navbar">
            <div class="container" id="navbar-container">
	            <div class="navbar-header">
                    <a href="#" class="navbar-brand">
				    <img src="img/flf.png" width="50" height="50" style="margin-right: 20px">Filološki fakultet <small>- sistem za evaluaciju</small>
		            </a>
                </div>
	            <div class="navbar-header pull-right" role="navigation">
                    <a href="pages/home" class="btn btn-sm btn-info nav-button-margin"> <i class="glyphicon glyphicon-home"></i>&nbsp;Početna</a>
                    <a href="pages/zadaci" class="btn btn-sm btn-info nav-button-margin"> <i class="glyphicon glyphicon-book"></i>&nbsp;Zadaci</a>
                    <a href="pages/kandidati" class="btn btn-sm btn-info nav-button-margin"> <i class="glyphicon glyphicon-user"></i>&nbsp;Kandidati</a>
                    <a href="pages/sheme" class="btn btn-sm btn-warning nav-button-margin"> <i class="glyphicon glyphicon-check"></i>&nbsp;Sheme ocenjivanja</a>
                    <a href="pages/stats" class="btn btn-sm btn-info nav-button-margin"> <i class="glyphicon glyphicon-stats"></i>&nbsp;Statistike</a>
                    <a href="pages/logout.php" class="btn btn-sm btn-danger nav-button-margin"> <i class="glyphicon glyphicon-log-out"></i>&nbsp;Izlaz</a>
                </div>
	        </div>
	    </div>

	    <div class="row">
    	    <div class="container">
    		    <div class="col-sm-9">
                   <!-- <div ng-view="" id="ng-view"></div>-->
                    <div ng-view></div>
                </div>
            </div>
        </div>
        <pre>$location.path() = {{main.$location.path()}}</pre>
        <pre>$route.current.templateUrl = {{main.$route.current.templateUrl}}</pre>
        <pre>$route.current.params = {{main.$route.current.params}}</pre>
        <pre>$routeParams = {{main.$routeParams}}</pre>

    </body>
</html>
