<?php

class CollectionGenerator {
	const KEY_META = "_meta";
	const KEY_ITEMS = "items";
	const KEY_PAGE_NUMBER = "pageNumber";
	const KEY_PAGE_SIZE = "pageSize";
	const KEY_ITEMS_TOTAL = "itemsTotal";
	const KEY_PAGES_TOTAL = "pagesTotal";
	public static function generate($items = array(), $queryUri = "", $itemsTotal = 0, $pagesTotal = 0, $pageNumber = 1, $pageSize = 20) {
		$r = array ();
		$r [self::KEY_META] = MetaGenerator::generate ( $queryUri );
		$r [self::KEY_ITEMS] = $items;
		$r [self::KEY_PAGE_NUMBER] = $pageNumber;
		$r [self::KEY_PAGE_SIZE] = $pageSize;
		$r [self::KEY_ITEMS_TOTAL] = $itemsTotal;
		$r [self::KEY_PAGES_TOTAL] = $pagesTotal;
		return $r;
	}
}