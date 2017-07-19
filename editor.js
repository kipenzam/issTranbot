'use strict';
/*global $, console*/

$('#dismiss').keyup(function (e) {
	if (e.key == 'a') { alert('oh'); $('#area').focus(); }
})
$('#area').keyup(function (e) {
	if (e.altKey) {
		e.preventDefault();
		e.stopPropagation();
	}
	return false;
})
$('.tagButton').click(function () {
	let tag = $(this).attr('data-tag'),
		move = tag.match(/<.*?>/)[0].length;
	pasteToArea(tag, move);
})

$.fn.selectRange = function(start, end) {
    if(!end) end = start; 
    return this.each(function() {
        if (this.setSelectionRange) {
            this.focus();
            this.setSelectionRange(start, end);
        } else if (this.createTextRange) {
            var range = this.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    });
};

function pasteToArea (data, move) {
    let editor = $('#area')[0],
        text = editor.value,
        cursor = editor.selectionStart? Number(editor.selectionStart): 0,
        before = text? text.left(cursor): '',
        after = text? text.right(text.length - cursor): '',
        out;

    // if (before.length && !/.*? $/.test(before)) { data = ' ' + data; }
    out = text? (before + data + after): data;

    let forward = move || data.length;
    console.log(forward)
    $('#area')
        .val(out)
        .focus()
        .selectRange(cursor + forward);
}