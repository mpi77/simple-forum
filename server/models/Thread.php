<?php

use Phalcon\Mvc\Model;

class Thread extends Model 
{

    /**
     * @var integer
     *
     */
    public $id;

    /**
     * @var string
     *
     */
    public $ownerId;

    /**
     * @var string
     *
     */
    public $title;

    /**
     * @var string
     *
     */
    public $tsCreate;

    /**
     * @var string
     *
     */
    public $tsLastMessage;

    public function initialize() {
    	$this->belongsTo ( "ownerId", "User", "username", array (
    			'alias' => 'owner'
    	) );
    	$this->hasMany ( "id", "Message", "threadId", array (
				'alias' => 'nMessage'
		) );
    	$this->hasMany ( "id", "Threadmember", "threadId", array (
    			'alias' => 'nThreadmember'
    	) );
    }
    
    public function beforeValidationOnCreate() {
    	$this->tsCreate = date ( "Y-m-d H:i:s" );
    }
    
    public function columnMap() {
    	return array (
    			'id' => 'id',
    			'owner' => 'ownerId',
    			'title' => 'title',
    			'ts_create' => 'tsCreate',
    			'ts_last_message' => 'tsLastMessage'
    	);
    }
    
    public static function getThread(Thread $thread) {
    	return array (
    			"id" => $thread->id,
    			"owner" => $thread->owner->username,
    			"title" => $thread->title,
    			"tsCreate" => $msg->tsCreate,
    			"tsLastMessage" => $msg->tsLastMessage,
    	);
    }
    
}
