<?php
$phpRoot = $_SERVER["DOCUMENT_ROOT"].'/_php/';
require_once($phpRoot.'01_generals.php');
#require_once($phpRoot.'05_markups.php');
#require_once($phpRoot.'06_iss_constants.php');
#http://intranet.isangseung.co.kr/issTranbot/00_word/update/db_reset.php

sqlexec("TRUNCATE table contract.dbo.master_word_prepare");
echo ( strlen($errorLog) > 1? $errorLog: $html );
?>