<?php

use Phalcon\Mvc\Model;

class Threadmember extends Model 
{

    /**
     * @var integer
     *
     */
    public $threadId;

    /**
     * @var string
     *
     */
    public $memberId;

    /**
     * @var string
     *
     */
    public $tsCreate;

    public function initialize() {
    	$this->belongsTo ( "memberId", "User", "username", array (
    			'alias' => 'member'
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
    			'thread_id' => 'threadId',
    			'member' => 'memberId',
    			'ts_create' => 'tsCreate'
    	);
    }
    
    public static function getThreadmember(Threadmember $tm) {
    	return array (
    			"threadId" => $tm->thread->id,
    			"member" => $tm->member->username,
    			"tsCreate" => $tm->tsCreate
    	);
    }
}
