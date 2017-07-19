<?php
$phpRoot = $_SERVER["DOCUMENT_ROOT"].'/_php/';
require_once($phpRoot.'01_generals.php');
require_once($phpRoot.'05_markups.php');
#require_once($phpRoot.'06_iss_constants.php');
#http://intranet.isangseung.co.kr/issTranbot/00_word/
$sql = "SELECT Max(IsNull(chapter, 0)) AS chapter FROM contract.dbo.master_word_prepare";
$obj = fetchClass($sql);
$chapter = $obj[0]->chapter;

$sql = "SELECT html, seq FROM contract.dbo.master_word_prepare WHERE chapter = '$chapter' AND dismiss = '' ORDER BY seq";
$obj = fetchClass($sql);
if (count($obj) > 0) {
	foreach ($obj as $r) {
		$table = $r->html;
		$table = str_replace('<table>', "<table id='$r->seq'>", $table);
		$html .= $table;
	}
}


$en = input('', "n:en, .en");
$word_button = submit().button('선택취소', '#undo_selection').
			   button('문장부사', '#RB_Clause').button('외부검색', '.external_search');
$word_form = form(
	table(
		tr(
			td($en).td('', '#dynamic').td($word_button)
		)
	, 3).

	div(
		input('', "n:pumsa, #pumsa").
		input('', "n:ko, #ko, autocoplete:off")
	, '#word_normal').
	div(
		input('', "n:VB, #VB").
		input('', "n:VB_imperative, #VB_imperative").
		input('', "n:VB_and, #VB_and").
		input('', "n:VB_or, #VB_or").
		input('', "n:VB_must, #VB_must").
		input('', "n:VB_can, #VB_can").
		input('', "n:VB_only, #VB_only")
	, '#word_VB').
	div(
		input('', "n:JJ, #JJ").
		input('', "n:JJ_noun, #JJ_noun").
		input('', "n:JJ_back, #JJ_back").
		input('', "n:JJ_and, #JJ_and").
		input('', "n:JJ_or, #JJ_or")
	, '#word_JJ')

, '#word_form').
p('', '#console');
?>
<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8" />
<title>단어입력</title>
<?php echo $commonHead; ?>
<?php #echo add_version(''); ?>
<style>
u, code {text-decoration:none; color:#888;}
section.dismiss {min-height:165px;}
#pumsa {width:3em;}
input[name] {display:block;}
	:placeholder-shown {text-align:center;}
	::-webkit-input-placeholder { /* Chrome/Opera/Safari */
	  color:pink; opacity:1;
	}
	#word_normal input[name] {display:inline; margin-left:0.7em;}
input[type="submit"], input[type="button"] {height:33px;}
input[type="button"] {margin: 0 5px;}
input#sentence_en {width:90%;}
#area {display:block; margin:5mm auto; width:90%; height:4em; font-size:130%;}
span {margin-left:1em;}
</style></head>
<body>
<section class="dismiss"></section>

<?php echo ( strlen($errorLog) > 1? $errorLog: $word_form ); ?>
<div id="word_form_candidates" hidden></div>


<form action="miss.php" id="sentence">
<p class="sentence_en"></p>
<input type="hidden" name="sentence_en" id="sentence_en">
<input type="hidden" name="seq" id="seq">
<p id="sentence_middle"></p>
<p><textarea id="area" name="sentence_ko"></textarea></p>
<p>
	<input type="button" id="dismiss" value="문장 끝" />
	<input type="button" id="miss" value="문장 복구" />
	<input type="button" id="C_button" value="C" class="tagButton" data-tag="<code></code>" />
	<input type="button" id="S_button" value="S" class="tagButton" data-tag="<sup></sup>" />
	<input type="button" id="B_button" value="B" class="tagButton" data-tag="<b></b>" />
</p>
</form>


<section class="to_mine">
<?php echo ( strlen($errorLog) > 1? $errorLog: $html ); ?>
</section>
<div id="errorLog"><?php echo $errorLog; ?></div>
<?php echo add_version('script/class_word.js'); ?>
<?php echo add_version('script/class_sub.js'); ?>
<?php echo add_version('lib.js'); ?>
<?php echo add_version('script/pipeline.js'); ?>
<?php echo add_version('script/sentences.js'); ?>
<?php echo add_version('word.js'); ?>
<?php echo add_version('../_script/00_library.js'); ?>
<?php echo add_version('tran.js'); ?>
<?php echo add_version('index.js'); ?>
<?php echo add_version('editor.js'); ?>
</body></html>