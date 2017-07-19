'use strict';
/*global K, $, console, tran*/

init_line();
    function init_line () {
        K.current_sentence = $('section.to_mine table:eq(0) tr.sentence td:eq(0)').html();
        $('section.to_mine table:eq(0) tr.sentence').remove();
        $('section.to_mine table:eq(0)').appendTo( $('section.dismiss') );
        present_ko();
        get_tran();
        remake_table( $('table:eq(0)') );
        window.setTimeout(function () {
            $('span').click(function () { pasteToArea($(this).html()); })
        , 0})
    }
    function get_tran () {
        let tripple = tran(K.current_sentence)[0],
            en = tripple[0];
        $('#sentence_en').val(en); 
        $('.sentence_en').html(en); 
        $('#area').val(tripple[2]);
    }
    function remake_table (table) {
        if (table.width() < $(window).width() - 50) { return false; }

        let new_table = $('<table/>').appendTo('section.dismiss');
            $('<tr class="en"/>').append(table.find('tr.en td:last-child')).appendTo(new_table);
            $('<tr class="pumsa"/>').append(table.find('tr.pumsa td:last-child')).appendTo(new_table);
            $('<tr class="ko"/>').append(table.find('tr.ko td:last-child')).appendTo(new_table);

        function move () {
            if (table.width() < $(window).width() - 50) { return false; }
            new_table.find('tr.en td:eq(0)').before( table.find('tr.en td:last-child') );
            new_table.find('tr.pumsa td:eq(0)').before( table.find('tr.pumsa td:last-child') );
            new_table.find('tr.ko td:eq(0)').before( table.find('tr.ko td:last-child') );
            window.setTimeout(move, 10);
        }
        move();

        window.setTimeout(function () {
            remake_table(new_table);
        }, 1000);
    }

    function present_ko () {
        const table = $('table:eq(0)');
        table.find('tr.ko td').each(function () {
            let en = $(this).attr('data-en'),
                map = K.map.word;
            if (map[en]) {
                $(this).html( map[en].ko );
            }
        });
    }


$('.en').on('paste', function () {
    window.setTimeout(function () {
        $('.en').val( $('.en').val().replace(/\s{1,}/g, ' ') );
        $('#pumsa').focus();
    }, 30);
});

$('.pumsa td, .ko td').click(function () {
    let index = $(this).index();
    $('tr.en td:eq(' + index + ')').click();
});
    $('tr.en td').click(function () {
        let pumsa = $(this).attr('class');

        let en = $(this).text();
            if (pumsa != 'NNP') { en = en.lower(); }

        let ko;
            if (K.map.word[en] && K.map.word[en][pumsa]) {
                ko = K.map.word[en][pumsa];
            }
            if (/^[A-Z]+s?$/.test(en)) {
                ko = en.replace(/^([A-Z]+)s?$/, function ($1, $2) {
                    return $2;
                });
            }

        if ($('.en').val()) {
            concatenate(en, pumsa, ko);
        } else {
            form_change(pumsa, en);
            $('.en').val(en);
            $('#word_form input:eq(1)').focus();
            if (pumsa != 'JJ' && pumsa != 'VB' && pumsa != 'VBP') {
                $('#pumsa').val(pumsa);
                $('#ko').val(ko);
            }
        }
    });
    function concatenate (en, pumsa, ko) {
        form_change();
        $('.en').val( [$('.en').val(), en].join(' ').trim() );
        $('#pumsa').val(pumsa);
        $('#ko').val( [$('#ko').val(), ko].join(' ').trim() );
    }
    function form_change (pumsa, en) {
        $('#RB_Clause').hide();
        let form = $('#word_form');

        $('#word_normal, #word_JJ, #word_VB').appendTo('#word_form_candidates');
        if (pumsa && pumsa.startsWith('JJ')) {
            $('#dynamic').append($('#word_JJ'));
            form.attr('action', 'update/update_JJ.php');
            find_word_variables(en, ['JJ', 'JJ_noun', 'JJ_and', 'JJ_or']);
        } 
        else if (pumsa && pumsa.startsWith('VB')) {
            $('#dynamic').append($('#word_VB'));
            form.attr('action', 'update/update_VB.php');
            find_word_variables(en, ['VB', 'VB_imperative', 'VB_and', 'VB_or']);
        } 
        else {
            $('#dynamic').append($('#word_normal'));
            form.attr('action', 'update/update_word.php');
        }

        if (pumsa == 'RB') {
            $('#RB_Clause').show();
        }
    }
    form_change();
    function find_word_variables (en, pumsas) {
        let map = K.map.word, word = map[en];
        pumsas.forEach(function (pumsa) {
            if (word && word.dictionary[pumsa]) { 
                $('#word_form #' + pumsa).val(word.dictionary[pumsa]); 
            }
        });
    }

$('#ko').dblclick( function () {
    if ($('#ko').val()) { return false; }
    $('#ko').val( $('.en').val() );
});

$('#undo_selection').click(undo_selection);
    function undo_selection () {
        $('#word_form')[0].reset();
        $('.en').val('');
        form_change();
    }

$('.external_search').click(function () {
    external_search($('.en').val());console.log($('.en').val(), 'wtf');
});
    function external_search (en) {
        let u = ['https://www.google.co.kr/search?q=', en, '+뜻', '&oq=', en].join('');
        window.open(u, '_blank');
    }


$('#dismiss').click(function () {
    $('#seq').val( $('table:eq(0)').attr('id') );
    $.post('dismiss.php', $('#sentence').serialize(), function (data) {
        $('section.dismiss').html('');
        console.log(data);
        form_change();
        undo_selection();
        window.setTimeout(init_line, 30);
    });
});
$('#miss').click(function () {
    $('#console').load('miss.php', function (data) {
        if (/ok/.test(data)) {
            document.reload();
        }
    });
});
$('#word_form').submit(function (e) {
    e.preventDefault();
    let u = [
        'http://intranet.isangseung.co.kr/issTranbot/00_word/',
        $(this).attr('action'), '?'
    ].join('');
    u += $(this).serialize();

    $('#console').load(u, function (data) {
        // let $en = $('.en'),
        //     $pumsa = $('#pumsa'),
        //     $ko = $('#ko');

        if (/^ok/.test(data)) {
            // regist_map($en.val(), $pumsa.val(), $ko.val());
            undo_selection();
            // $('#ko').blur();
            // present_ko();
            console.log(data);
            window.setTimeout(function () {
                $('#console').text('');
            }, 3000);
        }
    });
});

$('#RB_Clause')
    .click(function () {
        $('#pumsa').val('RB_Clause');
    })
    .hide();

$('input[name]').each(function () {
    $(this).attr('placeholder', $(this).attr('name'));
});