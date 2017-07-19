<?php
$phpRoot = $_SERVER["DOCUMENT_ROOT"].'/_php/';
require_once($phpRoot.'01_generals.php');
#require_once($phpRoot.'05_markups.php');
#require_once($phpRoot.'06_iss_constants.php');
#http://intranet.isangseung.co.kr/issTranbot/00_word/miss.php
$sql = "SELECT Max(IsNull(chapter, 0)) AS chapter FROM contract.dbo.master_word_prepare";
$obj = fetchClass($sql);
$chapter = $obj[0]->chapter;

$sql = "SELECT Max(IsNull(seq, 0)) AS seq FROM contract.dbo.master_word_prepare WHERE chapter = '$chapter' AND dismiss = 'Y'";
// console($sql);
$obj = fetchClass($sql);
$seq = $obj[0]->seq;

$sql = "UPDATE contract.dbo.master_word_prepare SET dismiss = '' WHERE chapter = '$chapter' AND seq = '$seq'";
sqlexec($sql);
echo ( strlen($errorLog) > 1? $errorLog: 'ok' );
?>