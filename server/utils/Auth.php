<?php
class Auth {
	public static function isAuth($token) {
		$r = false;
		
		if (! empty ( $token ) && preg_match("/^((B|b)earer)\s(\S+)$/", $token, $m) !== false) {
			$token = $m[3];
			$session = Session::findFirst ( array (
					"token = :token: AND :time: <= UNIX_TIMESTAMP(tsTo)",
					"bind" => array (
							"token" => $token ,
							"time" => time()
					) 
			) );
			if($session) {
				$r = true;
			}
		}
		return $r;
	}
	
	public static function getToken($header){
		if(preg_match("/^((B|b)earer)\s(\S+)$/", $header, $m) !== false){
			return $m[3];
		}
		return null;
	}
}