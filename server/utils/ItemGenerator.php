<?php

class ItemGenerator {
	public static function generate($queryUri, $metaArgs = array(), $bodyArgs = array()) {
		$r = array();
		$r[MetaGenerator::KEY_META] = MetaGenerator::generate ( $queryUri, $metaArgs);
		return array_merge ( $r, $bodyArgs );
	}
}