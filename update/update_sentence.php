<?php
$phpRoot = $_SERVER["DOCUMENT_ROOT"].'/_php/';
require_once($phpRoot.'01_generals.php');
#require_once($phpRoot.'05_markups.php');
#require_once($phpRoot.'06_iss_constants.php');
#http://intranet.isangseung.co.kr/issTranbot/00_word/update/update_sentence.php
$en = request('en');
$middle = request('middle');
$final = request('final');

if (strlen($en) == 0) {
	die('영어 원문이 없음!');
}
sqlexec("DELETE FROM contract.dbo.master_traned WHERE en = '$en'");

if (strlen($middle) > 0 && strlen($final) > 0) {
	sqlexec("INSERT INTO contract.dbo.master_traned (en, middle, final) VALUES ('$en', '$middle', 'final')");
}

echo ( strlen($errorLog) > 1? $errorLog: $html );
?>