<?php
function write_word () {
	$sql = "SELECT en, ko, pumsa FROM contract.dbo.master_word WHERE en != ''
	ORDER BY Len(en) DESC";
	$obj = fetchClass($sql);

	$array = "K.array.word = [\n";
	foreach ($obj as $r) {
	    $array .= "{en:'$r->en', ko:'$r->ko', pumsa:'$r->pumsa'},\n";
	}
	$array .= "];";

	$size = strlen($array);
	$path = $_SERVER["DOCUMENT_ROOT"].'/issTranbot/word.js';
	saveFile('../word.js', $array);
	
	return " word.js: $size written";
}
?>