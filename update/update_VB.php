<?php
$phpRoot = $_SERVER["DOCUMENT_ROOT"].'/_php/';
require_once($phpRoot.'01_generals.php');
require_once('write_word.php');
#http://intranet.isangseung.co.kr/issTranbot/00_word/update_VB.php
header('Access-Control-Allow-Origin:*');
$en = request('en');
$VB = request('VB');
$VB_and = request('VB_and');
$VB_or = request('VB_or');
$VB_must = request('VB_must');
$VB_can = request('VB_can');
$html = 'ok';

sqlexec("DELETE FROM contract.dbo.master_word WHERE en = '$en' AND pumsa IN ('VB', 'VB_and', 'VB_or')");

if (strlen($VB) > 0) {
	sqlexec("INSERT INTO contract.dbo.master_word (en, ko, pumsa) VALUES ('$en', '$VB', 'VB')");
    $html .= " updated $en (VB)";
} else {
	$html .= " deleted $en (VB)";
}

if (strlen($VB_imperative) > 0) {
	sqlexec("INSERT INTO contract.dbo.master_word (en, ko, pumsa) VALUES ('$en', '$VB_imperative', 'VB_imperative')");
    $html .= " updated $en (VB_imperative)";
} else {
	$html .= " deleted $en (VB_imperative)";
}

if (strlen($VB_and) > 0) {
	sqlexec("INSERT INTO contract.dbo.master_word (en, ko, pumsa) VALUES ('$en', '$VB_and', 'VB_and')");
    $html .= " updated $en (VB_and)";
} else {
	$html .= " deleted $en (VB_and)";
}

if (strlen($VB_or) > 0) {
	sqlexec("INSERT INTO contract.dbo.master_word (en, ko, pumsa) VALUES ('$en', '$VB_or', 'VB_or')");
    $html .= " updated $en (VB_or)";
} else {
	$html .= " deleted $en (VB_or)";
}

if (strlen($VB_must) > 0) {
	sqlexec("INSERT INTO contract.dbo.master_word (en, ko, pumsa) VALUES ('$en', '$VB_must', 'VB_must')");
    $html .= " updated $en (VB_must)";
} else {
	$html .= " deleted $en (VB_must)";
}

if (strlen($VB_can) > 0) {
	sqlexec("INSERT INTO contract.dbo.master_word (en, ko, pumsa) VALUES ('$en', '$VB_can', 'VB_can')");
    $html .= " updated $en (VB_can)";
} else {
	$html .= " deleted $en (VB_can)";
}

if (strlen($VB_only) > 0) {
	sqlexec("INSERT INTO contract.dbo.master_word (en, ko, pumsa) VALUES ('$en', '$VB_only', 'VB_only')");
    $html .= " updated $en (VB_only)";
} else {
	$html .= " deleted $en (VB_only)";
}

$html .= write_word();
echo ( strlen($errorLog) > 1? $errorLog: $html );
?>