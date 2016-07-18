<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Prijava</title>
<link rel="stylesheet" href="../css/loginStyle.css" />
</head>
<body>
<div id="top">
<p id="welcome">Dobro došli!</p>
<img src='../img/flf.png'/>
</div>
<p>
<?php
	require('../services/dbConnect.php');
	session_start();
    // If form submitted, insert values into the database.
    if (isset($_POST['username'])){
        $username = $_POST['username'];
        $password = $_POST['password'];
		$username = stripslashes($username);
		$username = $connection->real_escape_string($username);
		$password = stripslashes($password);
		$password = $connection->real_escape_string($password);
	//Checking is user existing in the database or not
        $query = "SELECT * FROM `koordinator` WHERE korisnickoIme='$username' and sifra='".md5($password)."'";
		$result = $connection->query($query) or die($connection->error);
		$rows = $result->num_rows;
        if($rows==1){
			$_SESSION['username'] = $username;
			header("Location: ../index.html"); // Redirect user to login.php    TODO ----> prebaciti na index.php
            }else{
				echo "<div class='form'><h3>Pogrešno korisničko ime ili šifra</h3><br/><a href='login.php'> Kliknite ovde za povratak na prijavu</a></div>";
				}
    }else{
?>
<div class="form">
<h1>Prijava</h1>
<form action="" method="post" name="login">
<input type="text" name="username" placeholder="Korisničko ime" required /><br/><br/>
<input type="password" name="password" placeholder="Šifra" required /><br/><br/>
<input name="submit" type="submit" value="Prijavite se" />
</form>
<p>Niste registrovani? <a href='registration.php'>Registrujte se ovde</a></p>
</div>
<?php } ?>
</body>
</html>
