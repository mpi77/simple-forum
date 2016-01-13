<?php
use Phalcon\Loader;
use Phalcon\Mvc\Micro;
use Phalcon\DI\FactoryDefault;
use Phalcon\Http\Response;
use Phalcon\Db\Adapter\Pdo\Mysql as PdoMysql;
use Phalcon\Paginator\Adapter\QueryBuilder as PQB;
error_reporting ( E_ALL );
date_default_timezone_set ( 'Europe/Prague' );

try {
	$loader = new Loader ();
	$loader->registerDirs ( array (
			__DIR__ . '/models/',
			__DIR__ . '/utils/' 
	) )->register ();
	
	$di = new FactoryDefault ();
	$di->set ( 'db', function () {
		return new PdoMysql ( array (
				"host" => "localhost",
				"username" => "simpleforum",
				"password" => "simpleforum",
				"dbname" => "simpleforum",
				'charset'  => 'utf8'
		) );
	} );
	
	$app = new Micro ( $di );
	
	$app->notFound ( function () use($app) {
		$app->response->setStatusCode ( 404, "Not Found" )->sendHeaders ();
		echo 'This is crazy, but this page was not found!';
	} );
	
	// hello
	$app->get ( '/', function () {
		$response = new Response ();
		$response->setJsonContent ( array (
				'about' => 'This is a private API :)' 
		) );
		
		return $response;
	} );
	
	// get threads
	$app->get ( '/threads/:params', function () use($app) {
		if (Auth::isAuth ( $app->request->getHeader ( "Authorization" ) ) === false) {
			$response = new Response ();
			$response->setStatusCode ( 403, "Unauthorized" );
			return $response;
		}
		
		$page_size = ( int ) $app->request->get ( Paginator::URL_QUERY_PARAM_PAGE_SIZE, "int", Paginator::DEFAULT_PAGE_SIZE );
		$page_number = ( int ) $app->request->get ( Paginator::URL_QUERY_PARAM_PAGE_NUMBER, "int", Paginator::DEFAULT_PAGE );
		
		$valid_fields = array (
				"id" => "",
				"title" => "",
				"ownerId" => "",
				"tsCreate" => "" 
		);
		
		$builder = $app->modelsManager->createBuilder ()->columns ( array_keys ( $valid_fields ) )->from ( 'Thread' );
		
		$paginator = new PQB ( array (
				"builder" => $builder,
				"limit" => $page_size,
				"page" => $page_number 
		) );
		$page = $paginator->getPaginate ();
		
		$items = array ();
		$expandable = Expandable::buildExpandableFields ( $app->request->get ( Expandable::URL_QUERY_PARAM ), array (
				"thread" 
		) );
		foreach ( $page->items as $item ) {
			if (in_array ( "thread", $expandable )) {
				// ts of last msg
				$last_message = Message::findFirst ( array (
						"threadId = :threadId:",
						"bind" => array (
								"threadId" => $item->id 
						),
						"order" => "tsCreate DESC" 
				) );
				
				$items [] = array (
						MetaGenerator::KEY_META => MetaGenerator::generate ( sprintf ( "/threads/%s", $item->id ), array (
								MetaGenerator::KEY_ID => $item->id,
								"tsCreate" => $item->tsCreate,
								"tsLastMessage" => (!empty($last_message->tsCreate ) ? $last_message->tsCreate  : "")
						) ),
						"author" => array (
								MetaGenerator::KEY_META => MetaGenerator::generate ( sprintf ( "/users/%s", $item->ownerId ), array (
										MetaGenerator::KEY_ID => $item->ownerId 
								) ) 
						),
						"title" => $item->title 
				);
			} else {
				$items [] = array (
						MetaGenerator::KEY_META => MetaGenerator::generate ( sprintf ( "/threads/%s", $item->id ), array (
								MetaGenerator::KEY_ID => $item->id 
						) ) 
				);
			}
		}
		$response = new Response ();
		if (! empty ( $items )) {
			$response->setContentType ( 'application/json', 'UTF-8' );
			$response->setStatusCode ( 200, "OK" );
			$response->setJsonContent ( CollectionGenerator::generate ( $items, $app->request->getURI (), $page->total_items, $page->total_pages, $page->current, $page_size ) );
		} else {
			$response->setStatusCode ( 204, "No Content" );
		}
		return $response;
	} );
	
	// get a thread
	$app->get ( '/threads/{id:([1-9][0-9]{0,9})}/:params', function ($id) use($app) {
		if (Auth::isAuth ( $app->request->getHeader ( "Authorization" ) ) === false) {
			$response = new Response ();
			$response->setStatusCode ( 403, "Unauthorized" );
			return $response;
		}
		
		$response = new Response ();
		$response->setContentType ( 'application/json', 'UTF-8' );
		
		$thread = Thread::findFirst ( array (
				"id = :id:",
				"bind" => array (
						"id" => $id 
				) 
		) );
		if ($thread) {
			$last_message = Message::findFirst ( array (
					"threadId = :threadId:",
					"bind" => array (
							"threadId" => $thread->id 
					),
					"order" => "tsCreate DESC" 
			) );
			$r = ItemGenerator::generate ( $app->request->getURI (), array (
					MetaGenerator::KEY_ID => $thread->id,
					"tsCreate" => $thread->tsCreate,
					"tsLastMessage" => (!empty($last_message->tsCreate ) ? $last_message->tsCreate  : "") 
			), array (
					"author" => array (
							MetaGenerator::KEY_META => MetaGenerator::generate ( sprintf ( "/users/%s", $thread->ownerId ), array (
									MetaGenerator::KEY_ID => $thread->ownerId 
							) ) 
					),
					"title" => $thread->title 
			) );
			$response->setStatusCode ( 200, "OK" );
			$response->setJsonContent ( $r );
		} else {
			$response->setStatusCode ( 404, "Not Found" );
		}
		
		return $response;
	} );
	
	// create a new thread
	$app->post ( '/threads/:params', function () use($app) {
		if (Auth::isAuth ( $app->request->getHeader ( "Authorization" ) ) === false) {
			$response = new Response ();
			$response->setStatusCode ( 403, "Unauthorized" );
			return $response;
		}
		
		$valid_fields = array (
				"title" => "/^[\s\S]*$/" 
		);
		$body = $app->request->getJsonRawBody ();
		$response = new Response ();
		$response->setContentType ( 'application/json', 'UTF-8' );
		
		if (preg_match ( $valid_fields ["title"], $body->title ) === 1) {
			$session = Session::findFirst ( array (
					"token = :token:",
					"bind" => array (
							"token" => Auth::getToken ( $app->request->getHeader ( "Authorization" ) ) 
					) 
			) );
			if ($session) {
				$new = new Thread ();
				$new->ownerId = $session->ownerId;
				$new->title = $body->title;
				
				if ($new->save ()) {
					$response->setStatusCode ( 201, "Created" );
				} else {
					$response->setStatusCode ( 500, "Internal Server Error" );
				}
			} else {
				$response->setStatusCode ( 403, "Unauthorized" );
			}
		} else {
			$response->setStatusCode ( 400, "Bad Request" );
		}
		
		return $response;
	} );
	
	// delete a thread
	$app->delete ( '/threads/{id:([1-9][0-9]{0,9})}/:params', function ($id) use($app) {
		if (Auth::isAuth ( $app->request->getHeader ( "Authorization" ) ) === false) {
			$response = new Response ();
			$response->setStatusCode ( 403, "Unauthorized" );
			return $response;
		}
		
		$response = new Response ();
		$response->setContentType ( 'application/json', 'UTF-8' );
		
		$thread = Thread::findFirst ( array (
				"id = :id:",
				"bind" => array (
						"id" => $id 
				) 
		) );
		if ($thread) {
			// remove messages
			$messages = Message::find ( array (
					"threadId = :threadId:",
					"bind" => array (
							"threadId" => $thread->id 
					) 
			) );
			foreach ( $messages as $m ) {
				if ($m->delete () == false) {
					$response->setStatusCode ( 500, "Internal Server Error" );
					return $response;
				}
			}
			
			// remove threadMembers
			$members = Threadmember::find ( array (
					"threadId = :threadId:",
					"bind" => array (
							"threadId" => $thread->id 
					) 
			) );
			foreach ( $members as $m ) {
				if ($m->delete () == false) {
					$response->setStatusCode ( 500, "Internal Server Error" );
					return $response;
				}
			}
			
			// remove thread
			if ($thread->delete () == false) {
				$response->setStatusCode ( 500, "Internal Server Error" );
			} else {
				$response->setStatusCode ( 200, "OK" );
			}
		} else {
			$response->setStatusCode ( 404, "Not Found" );
		}
		
		return $response;
	} );
	
	// get messages
	$app->get ( '/messages/:params', function () use($app) {
		if (Auth::isAuth ( $app->request->getHeader ( "Authorization" ) ) === false) {
			$response = new Response ();
			$response->setStatusCode ( 403, "Unauthorized" );
			return $response;
		}
		
		$page_size = ( int ) $app->request->get ( Paginator::URL_QUERY_PARAM_PAGE_SIZE, "int", Paginator::DEFAULT_PAGE_SIZE );
		$page_number = ( int ) $app->request->get ( Paginator::URL_QUERY_PARAM_PAGE_NUMBER, "int", Paginator::DEFAULT_PAGE );
		
		$valid_fields = array (
				"id" => "",
				"threadId" => "/^[1-9][0-9]{0,9}$/",
				"ownerId" => "",
				"content" => "",
				"tsCreate" => "" 
		);
		
		$builder = $app->modelsManager->createBuilder ()->columns ( array_keys ( $valid_fields ) )->from ( 'Message' );
		
		// append WHERE conditions
		$where = Searchable::buildQueryBuilderWhereParams ( $app->request->get ( Searchable::URL_QUERY_PARAM ), $valid_fields );
		if (is_array ( $where ) && ! empty ( $where ) && $where !== false && $where !== null) {
			$builder->where ( $where ["conditions"], $where ["bindParams"] );
		}
		if ($where === false) {
			$response = new Response ();
			$response->setStatusCode ( 400, "Bad Request" );
			return $response;
		}
		
		// append ORDER BY string
		if (($order = Sortable::buildQueryBuilderOrderByParams ( $app->request->get ( Sortable::URL_QUERY_PARAM ), array_keys ( array("tsCreate") ) )) !== false) {
			$builder->orderBy ( $order );
		}
		
		$paginator = new PQB ( array (
				"builder" => $builder,
				"limit" => $page_size,
				"page" => $page_number 
		) );
		$page = $paginator->getPaginate ();
		
		$items = array ();
		$expandable = Expandable::buildExpandableFields ( $app->request->get ( Expandable::URL_QUERY_PARAM ), array (
				"message" 
		) );
		foreach ( $page->items as $item ) {
			if (in_array ( "message", $expandable )) {
				$items [] = array (
						MetaGenerator::KEY_META => MetaGenerator::generate ( sprintf ( "/messages/%s", $item->id ), array (
								MetaGenerator::KEY_ID => $item->id,
								"tsCreate" => $item->tsCreate 
						) ),
						"author" => array (
								MetaGenerator::KEY_META => MetaGenerator::generate ( sprintf ( "/users/%s", $item->ownerId ), array (
										MetaGenerator::KEY_ID => $item->ownerId 
								) ) 
						),
						"content" => $item->content 
				);
			} else {
				$items [] = array (
						MetaGenerator::KEY_META => MetaGenerator::generate ( sprintf ( "/messages/%s", $item->id ), array (
								MetaGenerator::KEY_ID => $item->id 
						) ) 
				);
			}
		}
		$response = new Response ();
		if (! empty ( $items )) {
			$response->setContentType ( 'application/json', 'UTF-8' );
			$response->setStatusCode ( 200, "OK" );
			$response->setJsonContent ( CollectionGenerator::generate ( $items, $app->request->getURI (), $page->total_items, $page->total_pages, $page->current, $page_size ) );
		} else {
			$response->setStatusCode ( 204, "No Content" );
		}
		return $response;
	} );
	
	// get a message
	$app->get ( '/messages/{id:([1-9][0-9]{0,9})}/:params', function ($id) use($app) {
		if (Auth::isAuth ( $app->request->getHeader ( "Authorization" ) ) === false) {
			$response = new Response ();
			$response->setStatusCode ( 403, "Unauthorized" );
			return $response;
		}
		
		$response = new Response ();
		$response->setContentType ( 'application/json', 'UTF-8' );
		
		$message = Message::findFirst ( array (
				"id = :id:",
				"bind" => array (
						"id" => $id 
				) 
		) );
		if ($message) {
			$r = ItemGenerator::generate ( $app->request->getURI (), array (
					MG::KEY_ID => $message->id,
					"tsCreate" => $message->tsCreate 
			), array (
					"author" => array (
							MetaGenerator::KEY_META => MetaGenerator::generate ( sprintf ( "/users/%s", $message->ownerId ), array (
									MetaGenerator::KEY_ID => $message->ownerId 
							) ) 
					),
					"content" => $message->content 
			) );
			$response->setStatusCode ( 200, "OK" );
			$response->setJsonContent ( $r );
		} else {
			$response->setStatusCode ( 404, "Internal Server Error" );
		}
		
		return $response;
	} );
	
	// create a new message
	$app->post ( '/messages/:params', function () use($app) {
		if (Auth::isAuth ( $app->request->getHeader ( "Authorization" ) ) === false) {
			$response = new Response ();
			$response->setStatusCode ( 403, "Unauthorized" );
			return $response;
		}
		
		$valid_fields = array (
				"threadId" => "/^[1-9][0-9]{0,9}$/",
				"content" => "/^[\s\S]*$/" 
		);
		$body = $app->request->getJsonRawBody ();
		$response = new Response ();
		$response->setContentType ( 'application/json', 'UTF-8' );
		
		if (preg_match ( $valid_fields ["threadId"], $body->threadId ) === 1 && preg_match ( $valid_fields ["content"], $body->content ) === 1) {
			$session = Session::findFirst ( array (
					"token = :token:",
					"bind" => array (
							"token" => Auth::getToken ( $app->request->getHeader ( "Authorization" ) ) 
					) 
			) );
			$thread = Thread::findFirst ( array (
					"id = :id:",
					"bind" => array (
							"id" => $body->threadId 
					) 
			) );
			if ($session && $thread) {
				$membership = Threadmember::findFirst ( array (
						"threadId = :threadId: AND memberId = :memberId:",
						"bind" => array (
								"threadId" => $thread->id,
								"memberId" => $session->ownerId
						)
				) );
				
				if(!$membership){
					$membership = new Threadmember();
					$membership->threadId = $thread->id;
					$membership->memberId = $session->ownerId;
					if ($membership->save () == false) {
						$response->setStatusCode ( 500, "Internal Server Error" );
						return $response;
					}
				}
				
				$new = new Message ();
				$new->ownerId = $session->ownerId;
				$new->threadId = $thread->id;
				$new->content = $body->content;
				
				if ($new->save ()) {
					$response->setStatusCode ( 201, "Created" );
				} else {
					$response->setStatusCode ( 500, "Internal Server Error" );
				}
			} else {
				$response->setStatusCode ( 400, "Bad Request" );
			}
		} else {
			$response->setStatusCode ( 400, "Bad Request" );
		}
		
		return $response;
	} );
	
	// delete a message
	$app->delete ( '/messages/{id:([1-9][0-9]{0,9})}/:params', function ($id) use($app) {
		if (Auth::isAuth ( $app->request->getHeader ( "Authorization" ) ) === false) {
			$response = new Response ();
			$response->setStatusCode ( 403, "Unauthorized" );
			return $response;
		}
		
		$response = new Response ();
		$response->setContentType ( 'application/json', 'UTF-8' );
		
		$message = Message::findFirst ( array (
				"id = :id:",
				"bind" => array (
						"id" => $id 
				) 
		) );
		$threadId = $message->threadId;
		$ownerId = $message->ownerId;
		$next_message = Message::findFirst ( array (
				"threadId = :threadId: AND ownerId = :ownerId: AND id != :id:",
				"bind" => array (
						"threadId" => $threadId,
						"ownerId" => $ownerId,
						"id" => $id
				)
		) );
		if ($message) {
			if ($message->delete ()) {
				if(!$next_message){
					$membership = Threadmember::findFirst ( array (
							"threadId = :threadId: AND memberId = :memberId:",
							"bind" => array (
									"threadId" => $threadId,
									"memberId" => $ownerId
							)
					) );
					if ($membership->delete () == false) {
						$response->setStatusCode ( 500, "Internal Server Error" );
						return $response;
					}
				}
				$response->setStatusCode ( 200, "OK" );
			} else {
				$response->setStatusCode ( 500, "Internal Server Error" );
			}
		} else {
			$response->setStatusCode ( 404, "Not Found" );
		}
		
		return $response;
	} );
	
	// get memberships
	$app->get ( '/threadMembers/:params', function () use($app) {
		if (Auth::isAuth ( $app->request->getHeader ( "Authorization" ) ) === false) {
			$response = new Response ();
			$response->setStatusCode ( 403, "Unauthorized" );
			return $response;
		}
		
		$page_size = ( int ) $app->request->get ( Paginator::URL_QUERY_PARAM_PAGE_SIZE, "int", Paginator::DEFAULT_PAGE_SIZE );
		$page_number = ( int ) $app->request->get ( Paginator::URL_QUERY_PARAM_PAGE_NUMBER, "int", Paginator::DEFAULT_PAGE );
		
		$valid_fields = array (
				"threadId" => "/^[1-9][0-9]{0,9}$/",
				"memberId" => "",
				"tsCreate" => "" 
		);
		
		$builder = $app->modelsManager->createBuilder ()->columns ( array_keys ( $valid_fields ) )->from ( 'Threadmember' );
		
		// append WHERE conditions
		$where = Searchable::buildQueryBuilderWhereParams ( $app->request->get ( Searchable::URL_QUERY_PARAM ), $valid_fields );
		if (is_array ( $where ) && ! empty ( $where ) && $where !== false && $where !== null) {
			$builder->where ( $where ["conditions"], $where ["bindParams"] );
		}
		if ($where === false) {
			$response = new Response ();
			$response->setStatusCode ( 400, "Bad Request" );
			return $response;
		}
		
		$paginator = new PQB ( array (
				"builder" => $builder,
				"limit" => $page_size,
				"page" => $page_number 
		) );
		$page = $paginator->getPaginate ();
		
		$items = array ();
		$expandable = Expandable::buildExpandableFields ( $app->request->get ( Expandable::URL_QUERY_PARAM ), array (
				"threadMember" 
		) );
		foreach ( $page->items as $item ) {
			if (in_array ( "threadMember", $expandable ) || in_array ( "owner", $expandable )) {
				$ti = array ();
				$ti [MetaGenerator::KEY_META] = MetaGenerator::generate ( sprintf ( "/threadMembers/%s", "" ), array (
						MetaGenerator::KEY_ID => "",
						"tsCreate" => $item->tsCreate 
				) );
				$ti ["member"] = array (
						MetaGenerator::KEY_META => MetaGenerator::generate ( sprintf ( "/users/%s", $item->memberId ), array (
								MetaGenerator::KEY_ID => $item->memberId 
						) ) 
				);
				$ti ["thread"] = array (
						MetaGenerator::KEY_META => MetaGenerator::generate ( sprintf ( "/threads/%s", $item->threadId ), array (
								MetaGenerator::KEY_ID => $item->threadId 
						) ) 
				);
				
				$items [] = $ti;
			} else {
				$items [] = array (
						MetaGenerator::KEY_META => MetaGenerator::generate ( sprintf ( "/threadMembers/%s", "" ), array (
								MetaGenerator::KEY_ID => $item->id 
						) ) 
				);
			}
		}
		$response = new Response ();
		if (! empty ( $items )) {
			$response->setContentType ( 'application/json', 'UTF-8' );
			$response->setStatusCode ( 200, "OK" );
			$response->setJsonContent ( CollectionGenerator::generate ( $items, $app->request->getURI (), $page->total_items, $page->total_pages, $page->current, $page_size ) );
		} else {
			$response->setStatusCode ( 204, "No Content" );
		}
		return $response;
	} );
	
	// create a session
	$app->post ( '/session', function () use($app) {
		$valid_fields = array (
				"username" => "/^[a-zA-Z0-9_\/\.\-]{0,45}$/",
				"password" => "/^[a-zA-Z0-9_\/\.\-]{0,45}$/" 
		);
		$body = $app->request->getJsonRawBody ();
		$response = new Response ();
		$response->setContentType ( 'application/json', 'UTF-8' );
		if (preg_match ( $valid_fields ["username"], $body->username ) === 1 && preg_match ( $valid_fields ["password"], $body->password ) === 1) {
			$user = User::findFirst ( array (
					"username = :username: AND password = :password:",
					"bind" => array (
							"username" => $body->username,
							"password" => hash ( "sha256", $body->password ) 
					) 
			) );
			if ($user) {
				$session = Session::find ( array (
						"ownerId = :username:",
						"bind" => array (
								"username" => $body->username 
						) 
				) );
				if ($session) {
					if ($session->delete () == false) {
						$response->setStatusCode ( 500, "Internal Server Error" );
					} else {
						$new = new Session ();
						$new->token = substr ( hash ( "sha256", sprintf ( "%s:%s:%s", $body->username, substr ( md5 ( rand () ), 0, 7 ), date ( "YmdHis" ) ) ), 0, 45 );
						$new->ownerId = $body->username;
						if ($new->save ()) {
							$response->setStatusCode ( 201, "Created" );
							$response->setJsonContent ( array (
									MetaGenerator::KEY_META => MetaGenerator::generate ( $app->request->getURI () ),
									"access_token" => $new->token,
									"user" => array_merge ( array (
											MetaGenerator::KEY_META => MetaGenerator::generate ( "/users/" . $body->username, array (
													"id" => $body->username 
											) ) 
									), User::getUser ( $user ) ) 
							) );
						} else {
							$response->setStatusCode ( 500, "Internal Server Error" );
						}
					}
				}
			} else {
				$response->setStatusCode ( 404, "Resource not found" );
			}
		} else {
			$response->setStatusCode ( 400, "Bad Request" );
		}
		
		return $response;
	} );
	
	$app->handle ();
} catch ( Exception $e ) {
	echo $e->getMessage (), '<br>';
	echo nl2br ( htmlentities ( $e->getTraceAsString () ) );
}
