<?php
$phpRoot = $_SERVER["DOCUMENT_ROOT"].'/_php/';
require_once($phpRoot.'01_generals.php');
#require_once($phpRoot.'05_markups.php');
#require_once($phpRoot.'06_iss_constants.php');
#http://intranet.isangseung.co.kr/issTranbot/00_word/update_js.php
$tran_js = request('tran_js');

$fp = fopen('../tran.js', 'r'); 
$fr = fread($fp, filesize('../tran.js')); 
fclose($fp);

$reg = '/\/\/ 여기서부터 싱크[\s\S]*\/\/ 여기까지 싱크/';
preg_match($reg, $fr, $matches);
$static = str_replace($matches[0], '', $fr);

$script = trim($static)."\n\n".$tran_js;
$size = strlen($script);
saveFile('../tran.js', $script);
$res = "tran.js: $size written";

$lib_js = request('lib_js');
$size = strlen($lib_js);
saveFile('../lib.js', $lib_js);
$res .= "\nlib.js: $size written";


$sentences_js = request('sentences_js');
$size = strlen($sentences_js);
saveFile('../script/sentences.js', $sentences_js);
$res .= "\nsentences.js: $size written";

$pipeline_js = request('pipeline_js');
$size = strlen($pipeline_js);
saveFile('../script/pipeline.js', $pipeline_js);
$res .= "\npipeline.js: $size written";

$class_sub_js = request('class_sub_js');
$size = strlen($class_sub_js);
saveFile('../script/class_sub.js', $class_sub_js);
$res .= "\nclass_sub.js: $size written";

$class_word_js = request('class_word_js');
$size = strlen($class_word_js);
saveFile('../script/class_word.js', $class_word_js);
$res .= "\nclass_word.js: $size written";

echo $res;
?>