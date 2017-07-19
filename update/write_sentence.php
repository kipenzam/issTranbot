<?php
$phpRoot = $_SERVER["DOCUMENT_ROOT"].'/_php/';
require_once($phpRoot.'01_generals.php');
#require_once($phpRoot.'05_markups.php');
#require_once($phpRoot.'06_iss_constants.php');
#http://intranet.isangseung.co.kr/issTranbot/00_word/update/write_sentence.php
$en = request('en');
$ko = request('ko');
$html = 'ok';
function write ($en, $ko) {
	sqlexec("DELETE FROM contract.dbo.master_sentence WHERE en = '$en'");
	sqlexec("INSERT INTO contract.dbo.master_sentence (en, middle, ko) VALUES ('$en', '', '$ko')");
}

echo ( strlen($errorLog) > 1? $errorLog: $html );
?>