<?php
$phpRoot = $_SERVER["DOCUMENT_ROOT"].'/_php/';
require_once($phpRoot.'01_generals.php');
require_once('write_word.php');
#http://intranet.isangseung.co.kr/issTranbot/00_word/update_JJ.php
header('Access-Control-Allow-Origin:*');
$en = request('en');
$JJ = request('JJ');
$JJ_noun = request('JJ_noun');
$JJ_back = request('JJ_back');
$JJ_and = request('JJ_and');
$JJ_or = request('JJ_or');
$html = 'ok';

sqlexec("DELETE FROM contract.dbo.master_word WHERE en = '$en' AND pumsa IN ('JJ', 'JJ_noun', 'JJ_and', 'JJ_or')");

if (strlen($JJ) > 0) {
	sqlexec("INSERT INTO contract.dbo.master_word (en, ko, pumsa) VALUES ('$en', '$JJ', 'JJ')");
    $html .= " updated $en (JJ)";
} else {
	$html .= " deleted $en (JJ)";
}

if (strlen($JJ_noun) > 0) {
	sqlexec("INSERT INTO contract.dbo.master_word (en, ko, pumsa) VALUES ('$en', '$JJ_noun', 'JJ_noun')");
    $html .= " updated $en (JJ_noun)";
} else {
	$html .= " deleted $en (JJ_noun)";
}

if (strlen($JJ_back) > 0) {
	sqlexec("INSERT INTO contract.dbo.master_word (en, ko, pumsa) VALUES ('$en', '$JJ_back', 'JJ_back')");
    $html .= " updated $en (JJ_back)";
} else {
	$html .= " deleted $en (JJ_back)";
}

if (strlen($JJ_and) > 0) {
	sqlexec("INSERT INTO contract.dbo.master_word (en, ko, pumsa) VALUES ('$en', '$JJ_and', 'JJ_and')");
    $html .= " updated $en (JJ_and)";
} else {
	$html .= " deleted $en (JJ_and)";
}

if (strlen($JJ_or) > 0) {
	sqlexec("INSERT INTO contract.dbo.master_word (en, ko, pumsa) VALUES ('$en', '$JJ_or', 'JJ_or')");
    $html .= " updated $en (JJ_or)";
} else {
	$html .= " deleted $en (JJ_or)";
}

$html .= write_word();
echo ( strlen($errorLog) > 1? $errorLog: $html );
?>