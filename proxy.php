<?php

// go to https://developer.jcdecaux.com
// register and get your key
// set your key just after
$ak = '------MYKEY-----';
$baseUrl = 'https://api.jcdecaux.com/vls/v1/';

$datas = array();
$ch = curl_init();
$url = null;
$method = 'GET';
$json = "{}";

if(isset($_GET['action'])) {
	switch($_GET['action']) {
		case 'statistiques':
			$url = 'contracts';
			break;
		case 'contracts':
			$url = 'contracts';
			break;
		case 'stations':
			$url = 'stations';

			if(isset($_GET['contract'])) {
				$datas['contract'] = $_GET['contract'];
			}

			if(isset($_GET['id'])) {
				$url .= '/' . $_GET['id'];
			}

			break;
	}

	if($url) {

		$query = '';
		$datas['apiKey'] = $ak;
		switch ($method) {
			case 'POST':

				break;
			default:
				$query = '?' . http_build_query($datas);
				break;
		}

		curl_setopt($ch, CURLOPT_URL, $baseUrl . $url . $query);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1) ;
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

		// exécution de la session
		$json = curl_exec($ch);

		if($errno = curl_errno($ch)) {
		    $data['_system'] = array(
		    	'code' => curl_errno($ch),
		    	'message' => curl_strerror($errno)
		    );
		}

		// fermeture des ressources
		curl_close($ch);
	}
}

header("Expires: Mon, 26 Jul 1997 05:00:00 GMT" );
header("Last-Modified: " . gmdate( "D, d M Y H:i:s" ) . "GMT" );
header("Cache-Control: no-cache, must-revalidate" );
header("Pragma: no-cache" );
header("Content-type: application/json");
echo $json;