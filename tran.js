'use strict';
/*global K, console*/
K.array.word.forEach(word => regist_map(word.en, word.pumsa, word.ko));
    function regist_map (en, pumsa, ko) {
        let map = K.map.word;
        if (en != 'constructor') {
            if (!map[en]) { map[en] = new Word(en, pumsa, ko); }
            else { map[en].add(pumsa, ko); }
        }
    }

K.environmet = 'browser';

// 여기서부터 싱크

const pipeline = [
    'NN__chapter_d',                        // Chapter 4 => 4장
    'find_person_name',                     // NNP 기준으로 사람이름 처리
    'NN__reverse_compound_code',            // xx built-in function => 내장 함수 xx
    'NN__reverse_NN_code',                  // function xx => xx 함수
    'NN__code_NN',                          // 코드 + 명사 => 명사 하나로 취급
    'NN__NN_NN',
    'strip_DT_stopwords',                   // 관사, 인칭대명사 등 삭제
    'NN__DT_NN',                            // this, that 등을 명사에 합성
    'NNS__CD_NN',
    'NNS__most_NNS',                        // 대부분의~ 명사로 합성
    'JJ__RB_JJ',
    'JJ__JJ_andor_JJ',
    'JJ_noun__NN_POS',
    'JJ_noun__CD_different',
    'NN__JJ_NN',
    'bold',                                 // 볼드 태그도 명사로 합성
    'NN__NN_called_NN',
    'NN__NN_VBN_IN_NN',
    'NN__NN_VBN',
    // 'VB__MD_VB',
    'VB__RB_VB',
    'NN__NN_andor_NN',
    'NN__NN_VBG_NN',
    'RB_Clause__un_like_NN',
    'NN__NN_comma_andor_NN',
    'NN__NN_comma_andor_more',
    'NN__NN_comma_NN_multi',
    'NN__NN_of_in_NN',
    'parenthesis',
    //'in_outside_of_NN',   in/outside of를 하나로 묶고 그 뒤에서 명사를 받으면 간단
    'VB__VB_andor_VB',

    'RB__from_a_to_b',
    'RBNN__in_front_of_a',
    'RBNN__IN_NN',

    'VBNN__change_a_from_b_to_c',
    'VBNN__pass_a_to_b_as_c',
    'VBNN__pass_a_as_b_to_c',
    'VBNN__replace_a_with_b',
    'VBNN__search_a_for_b',
    'VBNN__use_a_to_VBNN',
    'VBNN__VB_a_to_b',
    'VBNN__VB_a_as_b',
    'VBNN__VB_to_a',
    'VBNN__start_with',
    'VBNN__VB_NN_RB',
    'VBNN__VB_NN',
    'VBNN__VBNN_RB_Clause',
    'VBNN__RB_Clause_VBNN',
    'VBNN__VBNN_that_VBNN',
    'VBNN__VBNN_andor_VBNN',
    'VBNN__MD_VBNN',
    'NN__NN_that_VBNN',
    'VBNN_VB__single',
    'parenthesis',
    'Sentence__a_allows_you_to',
    'Sentence__you_will_learn_to',
    'Sentence__has',
    'Sentence__has_not',
    'Sentence__make_something_JJ',
    'Sentence__be_similar_to',
    'Sentence__a_be_b',
    'Clause__NN_VBNN',
    'Clause__if_once_wh_',
    'Clause__a_be_b',
];


const final_replace = [
    ['변경하면', '바꾸면'],
    ['뷰할', '볼'],
    ['생성하고', '만들고'], ['생성할', '만들'], ['생성해야', '만들어야'],
];
function final (array, line) {
    let out = select(array), middle;
    middle = out[0]; 
    out = out[1];
    // out = out.map(o => o.ko);
    out = out.join(' ');
    out = out.replace(/<b> /g, '<b>').replace(/\s{1,}<\/b>/g, '</b>');
    out = out.replace(/내장 (<code>.*?<\/code>) (함수)/g, function ($1, $2, $3) {
                    return ['내장', $3, $2].join(' ');
                });
    if (/^\d{1,}\. /.test(line)) {
        out = line.match(/^\d{1,}\. /)[0] + out;
    }
    if (/^Chapter \d{1,}\. /.test(line)) {
        out = line.match(/^Chapter (\d{1,})\. /)[1] + '장. ' + out;
    }
    if (/^In this [Cc]hapter,/.test(line) && !/^이 장에서는/.test(out)) {
        out = '이 장에서는 ' + out;
    }
    if (/^In this section,/.test(line) && !/^이 섹션에서는/.test(out)) {
        out = '이 섹션에서는 ' + out;
    }
    if (/^In this example,/.test(line) && !/^이 예제에서는/.test(out)) {
        out = '이 예제에서는 ' + out;
    }
    if (/^In the (?:following|next) example,/.test(line) && !/^다음 예제/.test(out)) {
        out = '다음 예제에서는 ' + out;
    }
    if (/^For (?:instance|example),/.test(line) && !/^예를 들어/.test(out)) {
        out = '예를 들어 ' + out;
    }
    if (/^(?:Next),/.test(line) && !/^다음에는/.test(out)) {
        out = '다음에는 ' + out;
    }
    out = out
            .replace(/([가-힣]) ([가-힣]{1,} 개 이상)[을를]/, function ($1, $2, $3) {
                return $2.josa('를') + $3;
            })
            .replace(/ (에|부터|까지) /g, function ($1, $2) {
                return $2 + ' ';
            })
            .replace(/ (에|부터|까지)$/g, function ($1, $2) {
                return $2 + ' ';
            });
    final_replace.forEach(pair => out = out.replace(new RegExp(pair[0], 'g'), pair[1]));
    if (K.environmet == 'node') { console.log(line); }
    return [middle, out];
}

String.prototype.lower = function () { return this.toLowerCase(); };


function tran (lines) {
    if (K.environmet == 'browser') { 
        // console.clear(); 
    }
    return lines.split('\n')
                .map(line => make_triple(line.trim()));
}
function make_triple (line) {
    let pair = tran_line(line),
        middle = pair[0],
        trial = pair[1], out;
    if (K.environmet == 'browser') {
        middle = middle.map(o => '<span>' + o + '</span>').join('');
        out = [line, middle, trial];
    }
    else {
        line = '영문: ' + line;
        middle = '{{' + middle.join('||') + '}}';
        trial = '한글: ' + trial;
        out = [line, middle, trial].join('\n');
    }
    return out;
}

function tran_line (line) {
    let array;
    if (K.map.sentences[line]) { array = K.map.sentences[line]; }
    else { array = search_map(line); }
    if (!array) {
        console.log('tran_line: 영문 원본에 잘못된 문자가 있음: ', line, ' => ', array);
        let msg = '영문 원본에 잘못된 문자가 있음. 원본 확인하여 수정하거나 그냥 번역.';
        if (line.indexOf('&#39' >= 0)) {
            msg += ' 따옴표 이스케이프 때문에 &# 39를 사용해서 매치되지 않는 경우';
        }
        return msg;
    } else {
        array = array.map(o => get_ko(o));
        return pipe(array, pipeline, functions, line);
    }
}
function search_map (line) {
    let map = K.map.sentences;
    for (var sentence in map) {
        if (sentence.lower() == line.lower()) {
            return map[sentence];
        }
    }
}
function get_ko (o) {
    let en = o.en, pumsa = o.pumsa, map = K.map.word, out;
    let t1 = /^(?:CODE|URL|B|I|SUP|SUB|,|;|:|\.|\(|\))$/.test(o.pumsa), 
        t2 = /^[\d]{1,}\.?$/.test(en), 
        t3 = /^[“”]$/.test(en);

    if (t1 || t2 || t3)             out = new Word(en, pumsa, en);

    else if (map[en])               out = map[en];
    else if (map[en.toLowerCase()]) out = map[en.toLowerCase()];
    else                            out = new Word(en, pumsa, '');

    out.pumsa = pumsa;
    return out;
}

function pipe (array, pipeline, functions, line) {
    let out = array, func_name, func, middle;
    for (var i = 0; i < pipeline.length; i++) {
        func_name = pipeline[i];
        func = functions[func_name];
            if (!func) { console.log('undefined: ', func_name); }
        middle = func(out, line);
        if (middle && middle[0].every(o => typeof o.ko == 'string')) {
            out = middle[0];
            // console.log(func_name, out);
            if (K.environmet != 'node' && middle[1] && middle[1].length) {
                console.log(func_name + ': ' + affected(middle[1]));
            }
        } else {
            if (middle) console.log(middle[0]);
            throw new Error('error in ' + func_name);            
        }
        out = out.filter(o => o.en != '____consumed____');
    }
    return final(out, line);
}
function affected (affected) {
    return affected.map(o => o.ko + o.status.join(', ') + '_' + o.pumsa);
}
    function select (array) {
        let out = array, trial;
        out = out.filter(o => o.ko)
                 .map(function (o) {
                    if (o.pos == 'Person') {
                        return [o.ko, '<sup>', o.en, '</sup>'].join('');
                    } else {
                        return o.ko;
                    }
                 });
        if (out.length == 1) { return [out, out]; }

        trial = out.filter(o => 
            o.length > 9 || 
            /<(?:b|i|code|URL|sup|sub)>/.test(o) ||
            o.pumsa == 'RB_Clause'
        );
        if (trial.length) { return [out, trial]; }
        let lengths = out.map(o => o.length);
        let max = Math.max.apply(null, lengths);
        trial = out.filter(o => o.length == max);
        trial.length = 1;
        return [out, trial];
    }
// 여기까지 싱크