<?php
$phpRoot = $_SERVER["DOCUMENT_ROOT"].'/_php/';
require_once($phpRoot.'01_generals.php');
#require_once($phpRoot.'05_markups.php');
#require_once($phpRoot.'06_iss_constants.php');
#http://intranet.isangseung.co.kr/issTranbot/00_word/prepare/
$blob = request('html');
$chapter = request('chapter');
$array = explode('|||||', $blob);
$res = 'ok ';
$table = 'contract.dbo.master_word_prepare';

sqlexec("DELETE FROM $table WHERE chapter = $chapter AND dismiss = ''");
$sql = "SELECT Count(*) AS c FROM $table WHERE chapter = $chapter AND dismiss = 'y'";
$obj = fetchClass($sql);
$c = $obj[0]->c;
$res .= "$c lines so far";

$i = 1;
$in = 0;
foreach ($array as $string) {
	if ($i > $c && strlen(trim($string)) > 0) {
		$pair = explode('||||', $string);

		if (count($pair) > 1) {
			$sentence = trim($pair[0]);
			$html = trim($pair[1]);

			sqlexec("INSERT INTO $table (
				chapter, seq, sentence, html, dismiss
			) VALUES (
				$chapter, $i, '$sentence', '$html', ''
			)");

			$res .= "\n$i $sentence";
			$in++;
		} else {
			die("$sentence error");
		}
	}

	$i++;
}

$res .= "\ninserted $in tables";
echo ( strlen($errorLog) > 1? $errorLog: $res );
?>