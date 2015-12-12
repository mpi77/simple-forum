<?php
header ( 'Content-Type: text/html; charset=utf-8' );
date_default_timezone_set ("Europe/Prague");

$commons = array(
    "date" => "2015-01-01T00:00:00.000Z"
);

function metaResource($resource, $args = array(), $baseUri = "https://api.sf.sd2.cz/v1", $format = "application/json"){
    $r = array(
        "href" => sprintf("%s/%s",$baseUri, $resource),
        "mediaType" => $format
    );
    return array_merge($r, $args);
}

function collectionTemplate($urlPath, $items = array(), $isPagedCollection = true, $pageNumber = 1, $pageSize = 25, $firstPage = 1, $nextPage = 2, $previousPage = 1, $lastPage = 4, $itemsTotal = 100, $pagesTotal = 4){
    $r = array(
            "_meta" => metaResource($urlPath),
            "items" => $items
    );
    if($isPagedCollection){
        $r["pageNumber"] = $pageNumber;
        $r["pageSize"] = $pageSize;
        $r["itemsTotal"] = $itemsTotal;
        $r["pagesTotal"] = $pagesTotal;
        $r["first"] = array(
                "_meta" => metaResource($urlPath."?pageNumber=".$firstPage."&pageSize=".$pageSize)
        );
        $r["previous"] = array(
                "_meta" => metaResource($urlPath."?pageNumber=".$previousPage."&pageSize=".$pageSize)
        );
        $r["next"] = array(
                "_meta" => metaResource($urlPath."?pageNumber=".$nextPage."&pageSize=".$pageSize)
        );
        $r["last"] = array(
                "_meta" => metaResource($urlPath."?pageNumber=".$lastPage."&pageSize=".$pageSize)
        );
    }
    
    return $r;
}

$single = [
        "thread" => array(
            "_meta" => metaResource("threads/999/", array(
                    "id" => 999, 
                    "tsCreate"=>$commons["date"],
                    "tsUpdate"=>$commons["date"],
            		"tsLastChange"=>$commons["date"])),
            "author" => array("_meta" => metaResource("users/777/", array("id" => 777))),
            "title" => "thread title"
        ),
        "message" => array(
            "_meta" => metaResource("messages/888/", array(
                    "id" => 888, 
                    "tsCreate"=>$commons["date"],
            		"tsRead"=>$commons["date"])),
            "author" => array("_meta" => metaResource("users/777/", array("id" => 777))),
            "content" => "message content"
        ),
        
        "threadMember" => array(
            "_meta" => metaResource("threadMembers/666/", array(
                    "id" => 666, 
                    "tsCreate"=>$commons["date"],
                    "tsUpdate"=>$commons["date"],
            		"tsFrom"=>$commons["date"],
            		"tsTo"=>$commons["date"])),
            "thread" => array("_meta" => metaResource("threads/999/", array("id" => 999))),
            "author" => array("_meta" => metaResource("users/777/", array("id" => 777)))
        ),
        
        "user" => array(
            "_meta" => metaResource("users/777/", array(
                    "id" => 777, 
                    "tsCreate"=>$commons["date"],
                    "tsUpdate"=>$commons["date"])),
            "firstname" => "John",
            "lastname" => "Smith",
            "nick" => "js",
            "email" => "js@example.com"
        ),
		
		"session" => array(
				"_meta" => metaResource("access/"),
				"access_token" => "...stringACCESStoken...",
				"user" => array(
                    "_meta" => metaResource("users/777/", array(
                            "id" => 777, 
                            "tsCreate"=>$commons["date"],
                            "tsUpdate"=>$commons["date"])),
                    "firstname" => "John",
                    "lastname" => "Smith",
                    "nick" => "js",
                    "email" => "js@example.com"
                )
		)
        
        ];

foreach($single as $key => $value){
    file_put_contents("./item/".$key.".json", json_encode($value, JSON_PRETTY_PRINT|JSON_NUMERIC_CHECK));
}
            
$collection = array(
        "threads" => collectionTemplate("threads/", array(
                    array("_meta" => metaResource("threads/999/", array("id"=>999))),
                    array("_meta" => metaResource("threads/999/", array("id"=>999))),
                    array("_meta" => metaResource("threads/999/", array("id"=>999)))
                    ), false),
		"messages" => collectionTemplate("messsages/", array(
				array("_meta" => metaResource("messsages/888/", array("id"=>888))),
				array("_meta" => metaResource("messsages/888/", array("id"=>888))),
				array("_meta" => metaResource("messsages/888/", array("id"=>888)))
		), false),
		"threadMembers" => collectionTemplate("threadMembers/", array(
				array("_meta" => metaResource("threadMembers/666/", array("id"=>666))),
				array("_meta" => metaResource("threadMembers/666/", array("id"=>666))),
				array("_meta" => metaResource("threadMembers/666/", array("id"=>666)))
		), false)
);

foreach($collection as $key => $value){
    file_put_contents("./collection/".$key.".json", json_encode($value, JSON_PRETTY_PRINT|JSON_NUMERIC_CHECK));
}

echo "<pre>";
var_dump("ok");
echo "</pre>";

?>
