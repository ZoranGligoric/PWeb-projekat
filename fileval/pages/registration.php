<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Registracija</title>
<link rel="stylesheet" href="../css/loginStyle.css" />
</head>
<body>
<?php
	require('../php/dbConnect.php');
    // If form submitted, insert values into the database.
    if (isset($_POST['username'])){
        $username = $_POST['username'];
		$email = $_POST['email'];
        $password = $_POST['password'];
		$firstName = $_POST['firstName'];
		$lastName = $_POST['lastName'];
		$institution = $_POST['institution'];
		$username = stripslashes($username);
		$username = $connection->real_escape_string($username);
		$email = stripslashes($email);
		$email = $connection->real_escape_string($email);
		$password = stripslashes($password);
		$password = $connection->real_escape_string($password);
		$firstName = stripslashes($firstName);
		$firstName = $connection->real_escape_string($firstName);
		$lastName = stripslashes($lastName);
		$lastName = $connection->real_escape_string($lastName);
		$institution = stripslashes($institution);
		$institution = $connection->real_escape_string($institution);
		
		$checkQuery = "SELECT * FROM `koordinator` WHERE korisnickoIme='$username' ";
		$resultCheck = $connection->query($checkQuery) or die($connection->error);
		$rows = $resultCheck->num_rows;
		if($rows==1)
			echo "<div class='form'><h3>Već postoji korisnik sa tim korisničkim imenom.<br/> Pokušajte ponovo</h3><br/><a href='login.php'> Kliknite ovde za povratak na registraciju</a></div>";
		else{
			$query = "INSERT into `koordinator` (ime, prezime, institucija, email, korisnickoIme, sifra) VALUES ('$firstName', '$lastName', '$institution', '$email', '$username', '".md5($password)."')";
			$result = $connection->query($query);
			if($result)
				echo "<div class='form'><h3>Uspešno ste se registrovali.</h3><br/>Kliknite ovde za <a href='login.php'>prijavu</a></div>";
	}}else{
?>
<div class="form">
<h1>Registracija</h1>
<form name="registration" action="" method="post">
<input type="text" name="firstName" placeholder="Ime" required /><br/><br/>
<input type="text" name="lastName" placeholder="Prezime" required /><br/><br/>
<input type="text" name="username" placeholder="Korisničko ime" required /><br/><br/>
<input type="text" name="institution" placeholder="Institucija" optional /><br/><br/>
<input type="email" name="email" placeholder="Email" required /><br/><br/>
<input type="password" name="password" placeholder="Šifra" required /><br/><br/>
<input type="submit" name="submit" value="Registrujte se" /><br/><br/>
<p> <a href='login.php'>Povratak na prijavljivanje</a></p>
</form>
</div>
<?php } ?>
</body>
</html>
