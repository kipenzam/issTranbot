<?php
$phpRoot = $_SERVER["DOCUMENT_ROOT"].'/_php/';
require_once($phpRoot.'01_generals.php');
#require_once($phpRoot.'05_markups.php');
#require_once($phpRoot.'06_iss_constants.php');
require_once('write_word.php');
#http://intranet.isangseung.co.kr/issTranbot/00_word/update/update_word.php?en=click&pumsa=JJ_noun
header('Access-Control-Allow-Origin:*');
$en = request('en');
$ko = request('ko');
$pumsa = request('pumsa');
$html = 'ok';

if (strlen($en) > 0) {
	sqlexec("DELETE FROM contract.dbo.master_word WHERE en = '$en' AND pumsa = '$pumsa'");
    $html .= " deleted $en ($pumsa)";
}
if (strlen($ko) > 0) {
	sqlexec("INSERT INTO contract.dbo.master_word (en, ko, pumsa) VALUES ('$en', '$ko', '$pumsa')");
    $html .= " inserted $en - $ko ($pumsa)";
}

$html .= write_word();

echo ( strlen($errorLog) > 1? $errorLog: $html );
?>