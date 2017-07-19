<?php
$phpRoot = $_SERVER["DOCUMENT_ROOT"].'/_php/';
require_once($phpRoot.'01_generals.php');
#require_once($phpRoot.'05_markups.php');
#require_once($phpRoot.'06_iss_constants.php');
#http://intranet.isangseung.co.kr/issTranbot/00_word/api/word/

$sql = "SELECT en, ko, pumsa FROM contract.dbo.master_word WHERE en != ''
ORDER BY Len(en) DESC, en, pumsa";
$obj = fetchClass($sql);

$array = '[';
foreach ($obj as $r) {
    $en = str_replace("'", '\'', $r->en);
    $array .= "
    {en: '$en', ko: '$r->ko', pumsa: '$r->pumsa'},";
}
$array .= "\n]";

echo ( strlen($errorLog) > 1? $errorLog: $array );
?>