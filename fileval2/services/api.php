<?php

	class API {
	
		public $data = "";
		
		const DB_SERVER = "127.0.0.1";
		const DB_USER = "root";
		const DB_PASSWORD = "";
		const DB = "fileval";

		private $db = NULL;
		private $mysqli = NULL;
		public function __construct(){
			$this->dbConnect();					// Initiate Database connection
		}
        
		private function dbConnect()
		{
			$this->mysqli = new mysqli(self::DB_SERVER, self::DB_USER, self::DB_PASSWORD, self::DB);
		}


		
		/*
		 * Dynmically call the method based on the query string
		 */
		public function processApi(){
			//print_r("processApi\n\n");
			//echo "processApi\n\n";
			//print "processApi\n\n";
			//printf("processApi\n\n");
			//flush();

            if($_SERVER['REQUEST_METHOD']==='GET') {
				//print_r("\n***** get zahtev *****\n");
                if ($_GET['on'] == 'seme') {
                    if ($_GET['all']=='true'){
                        //$this->getSema($_GET['id']);
						$id=intval($_GET['id']);
                        $this->getSema($id);
                    }
                    else{
                     $this->getSeme();
                    }
                }
                if ($_GET['on'] == 'kriterijumi') {
                    $this->getKriterijum($_GET['shemaId']);
                }
                if ($_GET['on'] == 'podeoci') {
                    $this->getPodeok($_GET['shemaId']);
                }
				//anci
				if ($_GET['on'] == 'zadaci') {
						if ($_GET['all']=='true'){
							$this->getZadaci();
						}
						else{
							$id=intval($_GET['id']);
							$this->getZadatak($id);
						}
					
                }
				if ($_GET['on'] == 'grupe') {
					
						$this->getGrupe();
					
                }
				if ($_GET['on'] == 'koordinatori') {
					
						$this->getKoordinatori();
					
                }
				//end anci
            }
            else if($_SERVER['REQUEST_METHOD']==='POST') {
				//print_r("\n***** post zahtev *****\n");
                /*if ($_POST['on'] == 'sheme') {
                    if ($_POST['action'] == 'insert') {
                        $this->insertSema();
                    }
                    else if ($_POST['action'] == 'update') {
                        $this->updateSema($_POST['id']);
                    }
                    else if ($_POST['action'] == 'delete') {
                        $this->deleteSema($_POST['id']);
                    }
                }*/
				$data = json_decode(file_get_contents('php://input'), true);
				//var_dump("POST ispis:");
				if($data['on'] == 'sheme'){
					if ($data['action'] == 'insert') {
						//echo "insertSema()";
						$this->insertSema();
					} else if ($data['action'] == 'update') {
						$this->updateSema($data['shema']['id']);
					} else if ($data['action'] == 'delete') {
						$this->deleteSema($data['id']);
					}
				}//end sheme
				
				if($data['on'] == 'zadatak'){
					if ($data['action'] == 'insert') {
						//var_dump("insertZadatak()");
						$this->insertZadatak();
					} else if ($data['action'] == 'update') {
						$this->updateZadatak($data['zadatak']['idZadatak']);
					} else 
						$this->deleteZadatak($data['id']);
					
				}//end zadatak
				
				
	
			}//end if je post
			else if($_SERVER['REQUEST_METHOD']==='DELETE') {
					//print_r("\n***** delete zahtev *****\n");
					$data = json_decode(file_get_contents('php://input'), true);
					$this->deleteZadatak($data['id']);
					
			}
			
			else if($_SERVER['REQUEST_METHOD']==='PUT') {
					//print_r("\n***** delete zahtev *****\n");
					$data = json_decode(file_get_contents('php://input'), true);
					$this->updateZadatak($data['zadatak']['idZadatak']);
					
			}
				
				//print_r("\n***** nijedan zahtev *****\n");
		}

        private function getSeme(){
            $retval = array();
            $res=$this->mysqli->query("select idSemaOcenjivanja as idshema, naziv, uslov, count(distinct idkriterijumevaluacije) 
			as kriterijumi, count(distinct idPodeokSkale) as preciznost from semaocenjivanja 
			join kriterijumEvaluacije ke on ke.semaocenjivanja_idsemaocenjivanja=idsemaocenjivanja 
			join podeokskale ps on ps.semaocenjivanja_idsemaocenjivanja=idsemaocenjivanja group by naziv, uslov");
            while($row=$res->fetch_assoc()) {
                $retval[]=$row;
            }
            echo json_encode($retval);
        }

		//anci
		private function getGrupe(){
			//echo "getGrupe()";
            $retval = array();
            $res=$this->mysqli->query("select idGrupa, naziv, brojClanova from grupa;");
            while($row=$res->fetch_assoc()) {
                $retval[]=$row;
            }
			//$data = json_encode($retval);
            //echo "\n\nGrupe data: \n" . $data;
			echo json_encode($retval);
            
        }
		
		private function getZadaci(){
			//echo "getZadaci()";
            $retval = array();
            $res=$this->mysqli->query("select z.idZadatak, z.naziv, z.opis, z.pdfLink, z.obavezan, z.poeni, 
				concat(k.ime, ' ', k.prezime) as imeKoordinatora, g.naziv as nazivGrupe, 
				so.naziv as nazivSeme, datumKreiranja, k.institucija
				from Zadatak z join Koordinator k on z.Koordinator_idKoordinator=k.idKoordinator
							   join Grupa g on z.Grupa_idGrupa=g.idGrupa
							   join SemaOcenjivanja so on z.SemaOcenjivanja_idSemaOcenjivanja=so.idSemaOcenjivanja");
            while($row=$res->fetch_assoc()) {
                $retval[]=$row;
            }
			//$data = json_encode($retval);
            //echo $data;
			echo json_encode($retval);
            
        }
		
		private function getKoordinatori(){
			//echo "getKoordinatori()";
            $retval = array();
            $res=$this->mysqli->query("select * from koordinator");
            while($row=$res->fetch_assoc()) {
                $retval[]=$row;
            }
			//$data = json_encode($retval);
            //echo $data;
			echo json_encode($retval);
            
        }
		
		private function getZadatak($id){
            $res=$this->mysqli->query("select z.idZadatak, z.naziv, z.opis, z.pdfLink, z.obavezan, z.poeni, 
				concat(k.ime, ' ', k.prezime) as imeKoordinatora, g.naziv as nazivGrupe, 
				so.naziv as nazivSeme, datumKreiranja, z.Koordinator_idKoordinator koordinatorID, 
				z.Grupa_idGrupa grupaID, z.SemaOcenjivanja_idSemaOcenjivanja semaID, k.institucija
				from Zadatak z join Koordinator k on z.Koordinator_idKoordinator=k.idKoordinator
							   join Grupa g on z.Grupa_idGrupa=g.idGrupa
							   join SemaOcenjivanja so on z.SemaOcenjivanja_idSemaOcenjivanja=so.idSemaOcenjivanja
				where z.idZadatak = $id");
            $row=$res->fetch_assoc();
            echo json_encode($row);
        }
		
		private function deleteZadatak($id){
			//header('Location: #/izmeniZadatak/{{zadatak.idZadatak}}');
			print_r("\ndelete from `zadatak` where idZadatak = ".strval($id));
			$upit = "delete from zadatak where idZadatak = ".strval($id);
			//var_dump($upit);
			$message = "\ndelete from zadatak where idZadatak = ".strval($id);
			 echo '<script>console.log("' . $message. '")</script>';
            $res=$this->mysqli->query("delete from zadatak where idZadatak = $id");

        }
		
		//end anci
		
        private function getSema($id){
            $res=$this->mysqli->query("select naziv, uslov from semaOcenjivanja where idSemaOcenjivanja=$id");
            $row=$res->fetch_assoc();
            echo json_encode($row);
        }

        private function getPodeok($shemaId){
            $retval = array();

            $res=$this->mysqli->query("select idPodeokSkale as idpodeok, opis, poeni from podeokskale where $shemaId = SemaOcenjivanja_idSemaOcenjivanja order by poeni");
            while($row=$res->fetch_assoc()) {
                $retval[]=$row;
            }
            echo json_encode($retval);
        }
        private function getKriterijum($shemaId){
            $retval = array();
            $res=$this->mysqli->query("select idKriterijumEvaluacije as idkriterijum, opis, poeni from kriterijumevaluacije where $shemaId = SemaOcenjivanja_idSemaOcenjivanja order by redniBroj");
            while($row=$res->fetch_assoc()) {
                $retval[]=$row;
            }
            echo json_encode($retval);
        }

        private function insertSema(){
            $data = json_decode(file_get_contents('php://input'), true);
            $naziv=$data['shema']['naziv'];
            $uslov=$data['shema']['uslov'];
            $query="insert into `semaocenjivanja` (`uslov`, `naziv`) values (".$uslov.", '".$naziv."');";
            $res=$this->mysqli->query($query);
            //var_dump($query);
            //var_dump($this->mysqli->error);

            $last_id = $this->mysqli->insert_id;
            $this->insertKriterijum($last_id);
            $this->insertPodeok($last_id);
            //var_dump($res);
        }
		//anci
		private function insertZadatak(){
            $data = json_decode(file_get_contents('php://input'), true);
            $naziv=$data['zadatak']['naziv'];
			$opis=$data['zadatak']['opis'];
			$pdfLink=$data['zadatak']['pdfLink'];
			$obavezan=$data['zadatak']['obavezan'];
			$poeni=$data['zadatak']['brojPoena'];
			$datumKreiranja=$data['zadatak']['datumKreiranja'];
            $IDKoordinator=$data['zadatak']['Koordinator_idKoordinator'];
			$IDGrupa=$data['zadatak']['Grupa_idGrupa'];
			$IDSema=$data['zadatak']['SemaOcenjivanja_idSemaOcenjivanja'];
            
			/*
			$query="insert into `zadatak` (`naziv`, `opis`, `pdfLink`, `obavezan`, `poeni`, `datumKreiranja`, 
					`Koordinator_idKoordinator`, `Grupa_idGrupa`, `SemaOcenjivanja_idSemaOcenjivanja`) 
			        values ('".$naziv."', '".$opis."', '".$pdfLink."', ".$obavezan.", ".$brojPoena.", '".$datumKreiranja."', 
							".$IDKoordinator.", ".$IDGrupa.", ".$IDSema.");";
							*/
			$query = "INSERT INTO `zadatak` (`idZadatak`, `naziv`, `opis`, `pdfLink`, `obavezan`, `poeni`, `Koordinator_idKoordinator`, 
				`Grupa_idGrupa`, `SemaOcenjivanja_idSemaOcenjivanja`, `datumKreiranja`) 
				VALUES (NULL, '".$naziv."', '".$opis."', '".$pdfLink."', '".$obavezan."', '".$poeni."', '".$IDKoordinator."', 
						'".$IDGrupa."', '".$IDSema."', '".$datumKreiranja."')";
            $res=$this->mysqli->query($query);
            print_r($query);
            //var_dump($this->mysqli->error);
			
			/*
            $last_id = $this->mysqli->insert_id;
            $this->insertKriterijum($last_id);
            $this->insertPodeok($last_id);
            //var_dump($res);*/
        }
		
		private function updateZadatak($id){
            $data = json_decode(file_get_contents('php://input'), true);
            $naziv=$data['zadatak']['naziv'];
			$opis=$data['zadatak']['opis'];
			$pdfLink=$data['zadatak']['pdfLink'];
			$obavezan=$data['zadatak']['obavezan'];
			$poeni=$data['zadatak']['brojPoena'];
			$datumKreiranja=$data['zadatak']['datumKreiranja'];
            $IDKoordinator=$data['zadatak']['Koordinator_idKoordinator'];
			$IDGrupa=$data['zadatak']['Grupa_idGrupa'];
			$IDSema=$data['zadatak']['SemaOcenjivanja_idSemaOcenjivanja'];
			
			
            $res=$this->mysqli->query("update zadatak set naziv= '".$naziv."', opis='".$opis."', pdfLink='".$pdfLink."', 
									   obavezan = ".$obavezan.", poeni = ".$poeni.", datumKreiranja = '".$datumKreiranja."', 
									   Koordinator_idKoordinator=".$IDKoordinator.", Grupa_idGrupa=".$IDGrupa.", 
									   SemaOcenjivanja_idSemaOcenjivanja=".$IDSema."
									where idZadatak = ".$id);
			
			//$res=$this->mysqli->query("update zadatak set naziv='Novi naziv bio je Esej 2' where idZadatak = 18");
            //var_dump($res);
			//var_dump($this->mysql_error);
			
        }
		
		
		//end anci

        private function updateSema($id){
			$data = json_decode(file_get_contents('php://input'), true);
			$naziv = $data['shema']['naziv'];
			$uslov = $data['shema']['uslov'];
			$this->updateKriterijum($id);
			$this->updatePodeok($id);
			$this->insertKriterijum($id);
			$this->insertPodeok($id);
			$query = "update semaocenjivanja set uslov =" . $uslov . ", naziv ='" . $naziv . "' where idSemaOcenjivanja = " . $id;
			$res = $this->mysqli->query($query);
			var_dump($query);
			var_dump($this->mysqli->error);
        }

        private function deleteSema($id){
            $res=$this->mysqli->query("delete from  `semaOcenjivanja` where idSemaOcenjivanja = $id");
            $this->deleteKriterijum($id);
            $this->deletePodeok($id);
        }

        private function insertKriterijum($shemaId){
            $data = json_decode(file_get_contents('php://input'), true);
            $arrKrit=$data['noviKriterijumi'];
            $query='';
            for ($i=0; $i<count($arrKrit); $i++){
                if($i===0) {
                    $query .= "insert into `kriterijumevaluacije` (`opis`, `poeni`, `redniBroj`, `semaOcenjivanja_idSemaOcenjivanja`) values ('".$arrKrit[$i]['opis']."', ". $arrKrit[$i]['poeni'].", ".$arrKrit[$i]['rbr'].", $shemaId)";
                }
                else{
                    $query .= ", ('".$arrKrit[$i]['opis']."', ".$arrKrit[$i]['poeni'].",".$arrKrit[$i]['rbr'].", $shemaId)";
                }
            }
            if(strlen($query)>0) {
                $res = $this->mysqli->query($query);
            }
            //var_dump($query);
            //var_dump(mysqli_dump_debug_info($this->mysqli));
        }

        private function updateKriterijum($id){
            $data = json_decode(file_get_contents('php://input'), true);
            $arrKrit=$data['kriterijumi'];
            $query='';
            for ($i=0; $i<count($arrKrit); $i++){
                $query .= "update `kriterijumevaluacije` set `opis`='".$arrKrit[$i]['opis']."', `poeni`=".$arrKrit[$i]['poeni']." where idKriterijumEvaluacije=".$arrKrit[$i]['idkriterijum'].";";
            }
            $res=$this->mysqli->query($query);
            //var_dump($query);
            //var_dump(mysqli_dump_debug_info($this->mysqli));
        }

        private function deleteKriterijum($id){
            $res=$this->mysqli->query("delete from  `kriterijumevaluacije` where semaOcenjivanja_idSemaOcenjivanja = $id");
        }

        private function insertPodeok($shemaId){
            $data = json_decode(file_get_contents('php://input'), true);
            $arrPod=$data['noviPodeoci'];
            $query='';
            for ($i=0; $i<count($arrPod); $i++){
                if($i===0) {
                    $query .= "insert into `podeokskale` (`opis`, `poeni`, `SemaOcenjivanja_idSemaOcenjivanja`) values ('".$arrPod[$i]['opis']."', ".($arrPod[$i]['poeni']/100).", $shemaId)";
                }
                else{
                    $query .= ", ('".$arrPod[$i]['opis']."', ".($arrPod[$i]['poeni']/100).", $shemaId)";
                }
            }
            if(strlen($query)>0) {
                $res = $this->mysqli->query($query);
            }
            //var_dump($query);
            //var_dump($this->mysqli->error);
        }

        private function updatePodeok($id){
            $data = json_decode(file_get_contents('php://input'), true);
            $arrPod=$data['podeoci'];
            $query='';
            for ($i=0; $i<count($arrPod); $i++){
                $query .= "update `podeokSkale` set `opis`='".$arrPod[$i]['opis']."', 'poeni'=".($arrPod[$i]['poeni']/100)." where idPodeokSkale=".$arrPod[$i]['idpodeok'].";";
            }
            $res=$this->mysqli->query($query);
            //var_dump($query);
            //var_dump(mysqli_dump_debug_info($this->mysqli));

        }

        private function deletePodeok($id)
        {
            $res=$this->mysqli->query("delete from  `podeokSkale` where semaOcenjivanja_idSemaOcenjivanja = $id");
        }
	}
	
	// Initiiate Library

	$api = new API;
	$api->processApi();
?>