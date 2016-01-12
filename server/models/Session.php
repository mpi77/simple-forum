<?php

use Phalcon\Mvc\Model;

class Session extends Model 
{

    /**
     * @var string
     *
     */
    public $token;

    /**
     * @var string
     *
     */
    public $ownerId;

    /**
     * @var string
     *
     */
    public $tsTo;

    public function initialize() {
    	$this->belongsTo ( "ownerId", "User", "username", array (
    			'alias' => 'owner'
    	) );
    }
    
    public function beforeValidationOnCreate() {
    	$this->tsTo = date('Y-m-d H:m:s', strtotime('+1 week'));
    }
    
    public function columnMap() {
    	return array (
    			'token' => 'token',
    			'user_username' => 'ownerId',
    			'ts_to' => 'tsTo'
    	);
    }
    
    public static function getSession(Session $session) {
    	return array (
    			"token" => $session->token,
    			"owner" => $session->owner->username,
    			"tsTo" => $msg->tsTo
    	);
    }
}
