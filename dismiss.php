<?php
$phpRoot = $_SERVER["DOCUMENT_ROOT"].'/_php/';
require_once($phpRoot.'01_generals.php');
#http://intranet.isangseung.co.kr/issTranbot/00_word/dismiss.php
$seq = request('seq');
$en = request('sentence_en');
$ko = request('sentence_ko');
$html = 'ok';

sqlexec("DELETE FROM contract.dbo.master_sentence WHERE en = '$en'");
sqlexec("INSERT INTO contract.dbo.master_sentence (en, middle, ko) VALUES ('$en', '', '$ko')");
sqlexec("UPDATE contract.dbo.master_word_prepare SET dismiss = 'y' WHERE seq = '$seq'");
$html .= " dismissed $seq";
echo ( strlen($errorLog) > 1? $errorLog: $html );
?>