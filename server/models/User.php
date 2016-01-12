<?php

use Phalcon\Mvc\Model;

class User extends Model 
{

    /**
     * @var string
     *
     */
    public $username;

    /**
     * @var string
     *
     */
    public $password;

    /**
     * @var string
     *
     */
    public $firstname;

    /**
     * @var string
     *
     */
    public $lastname;

    public function initialize() {
    	$this->hasMany ( "username", "Session", "ownerId", array (
    			'alias' => 'nSession'
    	) );
    	$this->hasMany ( "username", "Threadmember", "memberId", array (
    			'alias' => 'nThreadmember'
    	) );
    	$this->hasMany ( "username", "Thread", "ownerId", array (
    			'alias' => 'nThread'
    	) );
    	$this->hasMany ( "username", "Message", "ownerId", array (
    			'alias' => 'nMessage'
    	) );
    }
    
    public function columnMap() {
    	return array (
    			'username' => 'username',
    			'password' => 'password',
    			'firstname' => 'firstname',
    			'lastname' => 'lastname'
    	);
    }
    
    public static function getUser(User $user) {
    	return array (
    			"username" => $user->username,
    			"firstname" => $user->firstname,
    			"lastname" => $user->lastname
    	);
    }
}
