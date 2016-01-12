<?php

use Phalcon\Mvc\Model;

class Message extends Model 
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
     * @var integer
     *
     */
    public $threadId;

    /**
     * @var string
     *
     */
    public $content;

    /**
     * @var string
     *
     */
    public $tsCreate;
    
    public function initialize() {
    	$this->belongsTo ( "ownerId", "User", "username", array (
    			'alias' => 'owner'
    	) );
    	$this->belongsTo ( "threadId", "Thread", "id", array (
    			'alias' => 'thread'
    	) );
    }
    
    public function beforeValidationOnCreate() {
    	$this->tsCreate = date ( "Y-m-d H:i:s" );
    }

    public function columnMap() {
    	return array (
    			'id' => 'id',
    			'owner' => 'ownerId',
    			'thread_id' => 'threadId',
    			'content' => 'content',
    			'ts_create' => 'tsCreate'
    	);
    }
    
    public static function getMessage(Message $msg) {
    	return array (
    			"id" => $msg->id,
    			"owner" => $msg->owner->username,
    			"threadId" => $msg->thread->id,
    			"content" => $msg->content,
    			"tsCreate" => $msg->tsCreate
    	);
    }

}
