


const functions = {
    'Sentence__a_allows_you_to': function Sentence__a_allows_you_to (arr) {
        let name = 'Sentence__a_allows_you_to', affected = [];
        function tests (sub) { return [
            sub.a.isNN(), sub.b.en == 'allows', sub.c.en == 'you', 
            sub.d.en == 'to', sub.e.isVBNN()
        ]; }
        function ko (sub) { return sub.ko(0, '를', '사용하면', 4, '할 수 있습니다'); }
        return K.loop(arr, affected, tests, 4, 'Sentence', ko, name);
    },
    'Sentence__you_will_learn_to': function Sentence__you_will_learn_to (arr) {
        let name = 'Sentence__you_will_learn_to', affected = [];
        function tests (sub) { return [
            sub.a.en == 'you', sub.b.en == 'will', sub.c.en == 'learn', 
            sub.d.en == 'to', sub.e.isVBNN()
        ]; }
        function ko (sub) { return sub.e.ko + '하는 법을 배웁니다.'; }
        return K.loop(arr, affected, tests, 4, 'Sentence', ko, name);
    },
    'VBNN__VBNN_andor_VBNN': function VBNN__VBNN_andor_VBNN (arr) {
        let name = 'VBNN__VBNN_andor_VBNN', affected = [];
        function tests (sub) { return [
            sub.a.isVBNN(), K.r.andor.test(sub.b.en), sub.c.isVBNN()
        ]; }
        function ko (sub) { sub.a.state('and'); }
        return K.loop(arr, affected, tests, 2, 'VBNN', ko, name);
    },
    'Clause__if_once_wh_': function Clause__if_once_wh_ (arr) {
        let name = 'Clause__if_once_wh_', affected = [];
        function tests (sub) { return [
            /^(?:if|once|when|whenever)$/.test(sub.a.en), sub.b.isClause()
        ]; }
        function ko (sub) { return sub.b.state(sub.a.en); }
        return K.loop(arr, affected, tests, 1, 'Clause', ko, name);
    },
    'VBNN__use_a_to_VBNN': function VBNN__use_a_to_VBNN (arr) {
        let name = 'VBNN__use_a_to_VBNN', affected = [];
        function tests (sub) { return [
            K.r.use.test(sub.a.en), sub.b.isNN(), sub.c.en == 'to', sub.d.isVB(), sub.e.isNN()
        ]; }
        function ko (sub) { return sub.ko(1, '_0', ' 써서', 4, '_3', 3); }
        return K.loop(arr, affected, tests, 4, 'VBNN', ko, name);
    },
    'NN__chapter_d': function NN__chapter_d (arr) {
        let name = 'NN__chapter_d', affected = [];
        function tests (sub) { return [
            /chapter/.test(sub.a.en), /^\d{1,}\.?$/.test(sub.b.en)
        ]; }
        function ko (sub) { return sub.ko(1, '장').ko.replace('. ', ''); }
        return K.loop(arr, affected, tests, 1, 'NN', ko, name);
    },
    'find_person_name': function find_person_name (arr) {
        let name = 'find_person_name', affected = [], ko;
        function tests (sub) { return [
            sub.a.pos == 'NNP' && sub.a.ko,
            /(?:NNP|Person)/.test(sub.b) && sub.b.ko,
        ]; }
        return K.loop_r(arr, affected, tests, 1, 'Person', ko, name);
    },
    'bold': function bold (arr) {
        let name = 'bold', affected = [];
        function tests (sub) { return [
            sub.a.pos == 'B', sub.c.pos == 'B', sub.b.ko
        ]; }
        function ko (sub) { return ['<b>', sub.b.ko, '</b>'].join(''); }
        return K.loop(arr, affected, tests, 2, 1, ko, name);
    },
    'NN__reverse_compound_code': function NN__reverse_compound_code (arr) {
        let name = 'NN__reverse_compound_code', affected = [];
        function tests (sub) { return [
            sub.a.pos == 'CODE',
            / (?:디렉토리|메서드|명령|모듈|모드|문법|문자|문|변수|클래스|폴더|플래그|함수)/.test(sub.b.ko),
        ]; }
        function ko (sub) { return sub.ko(1, 0); }
        return K.loop(arr, affected, tests, 1, 'NN', ko, name);
    },
    'NN__reverse_NN_code': function NN__reverse_NN_code (arr) {
        let name = 'NN__reverse_NN_code', affected = [];
        function tests (sub) { return [
            // /^(?:디렉토리|메서드|명령|모듈|모드|문법|문자|문|변수|클래스|폴더|플래그|함수)$/.test(sub.a.ko),
            sub.a.isNN() && sub.a.pos != 'CODE', sub.b.pos == 'CODE'
        ]; }
        function ko (sub) { return sub.ko(1, 0); }
        return K.loop(arr, affected, tests, 1, 'NN', ko, name);
    },
    'NN__code_NN': function NN__code_NN (arr) {
        let name = 'NN__code_NN', affected = [], ko;
        function tests (sub) { return [
            sub.some(o => o.pos == 'CODE'),
            sub.every(o => o.ko && /^(?:NN_multi|NNS|NNP|NN|CODE)?$/.test(o.pos))
        ]; }
        return K.loop(arr, affected, tests, 1, 'NN', ko, name);
    },
    'NN__NN_NN': function NN__NN_NN (arr) {
        let name = 'NN__NN_NN', affected = [], ko;
        function tests (sub) { return [
            sub.a.isNN(), sub.b.isNN(),
        ]; }
        return K.loop_r(arr, affected, tests, 1, 0, ko, name);
    },
    'strip_DT_stopwords': function strip_DT_stopwords (arr) {
        arr = arr.filter(o => o.pos != 'PRP$');
        arr = arr.filter(o => o.pos != 'DT' || o.ko);
        arr = arr.filter(o => o.pos != 'o' || o.en == 'c');
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].en == 'piece' && arr[i+1] && arr[i+1].en == 'of') {
                arr[i] = arr[i+1] = K.consumed;
            }
        }
        return [arr, []];
    },
    'NN__DT_NN': function NN__DT_NN (arr) {
        let name = 'NN__DT_NN', affected = [], ko;
        function tests (sub) { return [
            sub.a.pos == 'DT', sub.b.isNN()
        ]; }
        return K.loop(arr, affected, tests, 1, 1, ko, name, 2);
    },
    'NNS__CD_NN': function NNS__CD_NN (arr) {
        let name = 'NNS__CD_NN', affected = [];
        function tests (sub) { return [
            sub.a.isCD(), sub.b.isNN()
        ]; }
        function ko (sub) {
            return sub.ko(1, 0, '개').ko.replace('방법 두 개', '두 가지 방법');
        }
        return K.loop(arr, affected, tests, 1, 'NNS', ko, name);
    },
    'NNS__most_NNS': function NNS__most_NNS (arr) {
        let name = 'NNS__most_NNS', affected = [];
        function tests (sub) { return [
            sub.a.en == 'most', sub.b.pos == 'NNS'
        ]; }
        function ko (sub) { return sub.ko('대부분의', 1); }
        return K.loop(arr, affected, tests, 1, 'NNS', ko, name);
    },
    'JJ__RB_JJ': function JJ__RB_JJ (arr) {
        let name = 'JJ__RB_JJ', affected = [];
        function tests (sub) { return [
            sub.a.isRB(), sub.b.isJJ()
        ]; }
        function ko (sub) { 
            if (sub.a.en == 'more') { return sub.ko('더', 1); }
            if (sub.a.en == 'most') { return sub.ko('가장', 1); }
            return sub.ko(0, 1); 
        }
        return K.loop(arr, affected, tests, 1, 1, ko, name);
    },
    'JJ__JJ_andor_JJ': function JJ__JJ_andor_JJ (arr) {
        let name = 'JJ__JJ_andor_JJ', affected = [], ko;
        function tests (sub) { return [
            /JJ_(?:and|or)/.test(sub.a.pos), /(?:and|or)/.test(sub.b),
            sub.c.isJJ()
        ]; }
        return K.loop(arr, affected, tests, 2, 2, ko, name);
    },
    'JJ_noun__NN_POS': function JJ_noun__NN_POS (arr) {
        let name = 'JJ_noun__NN_POS', affected = [];
        function tests (sub) { return [
            sub.a.isNN(), sub.b.pos == 'POS'
        ]; }
        function ko (sub) { return sub.ko(0, '의'); }
        return K.loop(arr, affected, tests, 1, 'JJ_noun', ko, name);
    },
    'JJ_noun__CD_different': function JJ_noun__CD_different (arr) {
        let name = 'JJ_noun__CD_different', affected = [];
        function tests (sub) { return [
            sub.a.isCD(), sub.b.en == 'different' 
        ]; }
        function ko (sub) { return sub.ko(0, '가지'); }
        return K.loop(arr, affected, tests, 1, 'JJ_noun', ko, name);
    },
    'NN__JJ_NN': function NN__JJ_NN (arr) {
        let name = 'NN__JJ_NN', affected = [];
        function tests (sub) { return [
            sub.a.isJJ(), sub.b.isNN()
        ]; }
        function ko (sub) { 
            sub.a.pos = 'JJ_noun';
            let out = sub.ko(0, 1).ko.replace('의 웹사이트', ' 웹사이트');
            if (sub.a.en == 'double') { out = sub.ko(1, '두 개'); }
            if (sub.a.en == 'entire') { out = sub.ko(1, 0); }
            return out;
        }
        return K.loop_r(arr, affected, tests, 1, 1, ko, name);
    },
    'NN__NN_called_NN': function NN__NN_called_NN (arr) {
        let name = 'NN__NN_called_NN', affected = [];
        function tests (sub) { return [
            sub.a.isNN(), /^(?:called|named)$/.test(sub.b.en), sub.c.isNN()
        ]; }
        function ko (sub) { return sub.ko(2, 0); }
        return K.loop(arr, affected, tests, 2, 0, ko, name);
    },
    'NN__NN_VBN_IN_NN': function NN__NN_VBN_IN_NN (arr) {
        let name = 'NN__NN_VBN_IN_NN', affected = [];
        function tests (sub) { return [
            sub.a.isNN(), sub.b.isVBN(),
            sub.c.isIN(), sub.d.isNN()
        ]; }
        function ko (sub) { 
            if (sub.b.en == 'surrounded' && sub.c.en == 'by') {
                return sub.ko(3, '로', '둘러싸인', 0);
            }
            if (sub.b.en == 'separated' && sub.c.en == 'by') {
                return sub.ko(3, '로', '구분된', 0);
            }
            return sub.ko(3, 1, 0); 
        }
        return K.loop(arr, affected, tests, 3, 0, ko, name);
    },
    'VB__RB_VB': function VB__RB_VB (arr) {
        let name = 'VB__RB_VB', affected = [], ko;
        function tests (sub) { return [
            sub.a.isRB(), sub.b.isVB()
        ]; }
        return K.loop(arr, affected, tests, 1, 'VB', ko, name);
    },
    'NN__NN_andor_NN': function NN__NN_andor_NN (arr) {
        let name = 'NN__NN_andor_NN', affected = [];
        function tests (sub) { return [
            sub.a.isNN(), /^(?:and|or)$/.test(sub.b.en), sub.c.isNN()
        ]; }
        function ko (sub) { 
            let josa = sub.b.en == 'and'? '와': '나';
            return sub.ko(0, josa, 2); 
        }
        return K.loop(arr, affected, tests, 2, 'NN', ko, name);
    },
    'NN__NN_VBG_NN': function NN__NN_VBG_NN (arr) {
        let name = 'NN__NN_VBG_NN', affected = [];
        function tests (sub) { return [
            sub.a.isNN(), sub.b.pos == 'VBG', sub.c.isNN(1)
        ]; }
        function ko (sub) { return sub.ko(2, '하는', 0); }
        return K.loop(arr, affected, tests, 2, 'NN', ko, name);
    },
    'RB_Clause__un_like_NN': function RB_Clause__un_like_NN (arr) {
        let name = 'RB_Clause__un_like_NN', affected = [];
        function tests (sub) { return [
            /^(?:unlike|like)$/i.test(sub.a), sub.b.isNN()
        ]; }
        function ko (sub) { 
            if (sub.a.en == 'like') return sub.ko(0, '와', '달리');
            else return K.join(sub, [0, '처럼']);
        }
        return K.loop(arr, affected, tests, 1, 'RB_Clause', ko, name);
    },
    'NN__NN_comma_andor_NN': function NN__NN_comma_andor_NN (arr) {
        let name = 'NN__NN_comma_andor_NN', affected = [], ko;
        function tests (sub) { return [
            sub.a.isNN(), sub.b.en == ',',
            sub.c.isNN(), sub.d.en == ',',
            /^(?:and|or)$/.test(sub.e.en), sub.f.isNN(),
        ]; }
        return K.loop(arr, affected, tests, 5, 'NN_multi', ko, name);
    },
    'NN__NN_comma_andor_more': function NN__NN_comma_andor_more (arr) {
        let name = 'NN__NN_comma_andor_more', affected = [];
        function tests (sub) { return [
            sub.a.isNN(), sub.b.en == ',',
            sub.c.isNN(), sub.d.en == ',',
            /^(?:and|or)$/.test(sub.e.en), sub.f.en == 'more',
        ]; }
        function ko (sub) { return sub.ko(0, ',', 2, '등'); }
        return K.loop(arr, affected, tests, 5, 'NN_multi', ko, name);
    },
    'NN__NN_comma_NN_multi': function NN__NN_comma_NN_multi (arr) {
        let name = 'NN__NN_comma_NN_multi', affected = [], ko;
        function tests (sub) { return [
            sub.a.isNN(), sub.b.en == ',', sub.c.pos == 'NN_multi'
        ]; }
        return K.loop_r(arr, affected, tests, 2, 'NN_multi', ko, name);
    },
    'NN__NN_of_in_NN': function NN__NN_of_in_NN (arr) {
        let name = 'NN__NN_of_in_NN', affected = [];
        function tests (sub) { return [
            sub.a.isNN(), /^(?:of|in)$/.test(sub.b.en), sub.c.isNN()
        ]; }
        function ko (sub) {
            if (sub.b.en == 'of') sub.c.josa('의');
            return sub.ko(2, 0);
        }
        return K.loop_r(arr, affected, tests, 2, 'NN', ko, name);
    },
    'parenthesis': function parenthesis (arr) {
        let name = 'parenthesis', affected = [];
        function tests (sub) { return [
            sub.a.ko, sub.b.en == '(', sub.c.ko, sub.d.en == ')'
        ]; }
        function ko (sub) { return sub.ko(0, '(', 2, ')'); }
        return K.loop(arr, affected, tests, 3, 0, ko, name);
    },
    'VB__VB_andor_VB': function VB__VB_andor_VB (arr) {
        let name = 'VB__VB_andor_VB', affected = [];
        function tests (sub) { return [
            sub.a.isVB(), /(?:and|or)/.test(sub.b.en), sub.c.isVB(),            
        ]; }
        function ko (sub) { sub.a.pos = 'VB_and'; }
        return K.loop(arr, affected, tests, 2, 'VB', ko, name);
    },
    'RB__from_a_to_b': function from_a_to_b (arr) {
        let name = 'from_a_to_b', affected = [];
        function tests (sub) { return [
            sub.a.en == 'from', sub.a.isNN(),
            sub.c.en == 'to', sub.d.isNN(),
        ]; }
        function ko (sub) { return sub.ko(1, '부터', 3, '까지'); }
        return K.loop(arr, affected, tests, 3, 'RB_Clause', ko, name);
    },
    'RBNN__in_front_of_a': function RBNN__in_front_of_a (arr) {
        let name = 'RBNN__in_front_of_a', affected = [];
        function tests (sub) { return [
            sub.a.en == 'in', sub.b.en == 'front', sub.c.en == 'of', 
            sub.d.isNN()
        ]; }
        function ko (sub) { return sub.ko(3, '앞'); }
        return K.loop(arr, affected, tests, 3, 'RBNN', ko, name);
    },
    'RBNN__IN_NN': function RBNN__IN_NN (arr) {
        let name = 'RBNN__IN_NN', affected = [];
        function tests (sub) { return [
            sub.a.isIN(), sub.b.isNN(), !/^(?:if|once|when|whenever)$/.test(sub.a.en)
        ]; }
        function ko (sub) {
            let out = sub.ko(0, 1);
            if (sub.a.en == 'between') out = sub.ko(1, '사이');
            if (sub.a.en == 'from')    out = sub.ko(1, '에서');
            return out;
        }
        return K.loop(arr, affected, tests, 1, 'RB_Clause', ko, name);
    },
    'VBNN__change_a_from_b_to_c': function VBNN__change_a_from_b_to_c (arr) {
        let name = 'VBNN__change_a_from_b_to_c', affected = [];
        function tests (sub) { return [
            /^change(?:s|d)?/.test(sub.a.en), 
            sub.b.isNN(), sub.c.enStarts('from'), sub.d.enStarts('to')
        ]; }
        function ko (sub) { return sub.ko(1, '_0', 2, '에서', 3, '로', 0); }
        return K.loop(arr, affected, tests, 3, 'NN', ko, name);
    },
    'VBNN__pass_a_to_b_as_c': function VBNN__pass_a_to_b_as_c (arr) {
        let name = 'VBNN__pass_a_to_b_as_c', affected = [];
        function tests (sub) { return [
            / ?pass(?:es|ed|ing)?(?: in)?/.test(sub.a.en),
            sub.b.isNN(), sub.c.enStarts('to'), sub.d.enStarts('as')
        ]; }
        function ko (sub) { return sub.ko(1, '_0', 2, '에', 3, '로', 0); }
        return K.loop(arr, affected, tests, 3, 'VBNN', ko, name);
    },
    'VBNN__pass_a_as_b_to_c': function VBNN__pass_a_as_b_to_c (arr) {
        let name = 'VBNN__pass_a_as_b_to_c', affected = [];
        function tests (sub) { return [
            / ?pass(?:es|ed|ing)?(?: in)?/.test(sub.a.en),
            sub.b.isNN(1), sub.c.enStarts('as'), sub.d.enStarts('to')
        ]; }
        function ko (sub) {return sub.ko(1, '_0', 3, '에', 2, '로', 0); }
        return K.loop(arr, affected, tests, 3, 'VBNN', ko, name);
    },
    'VBNN__replace_a_with_b': function VBNN__replace_a_with_b (arr) {
        let name = 'VBNN__replace_a_with_b', affected = [];
        function tests (sub) { return [
            /^replac(?:es|ed|ing)?/i.test(sub.a.en),
            sub.b.isNN(), sub.c.enStarts('with')
        ]; }
        function ko (sub) { return sub.ko(1, '_0', 2, '로', 0); }
        return K.loop(arr, affected, tests, 2, 'VBNN', ko, name);
    },
    'VBNN__search_a_for_b': function VBNN__search_a_for_b (arr) {
        let name = 'VBNN__search_a_for_b', affected = [];
        function tests (sub) { return [
            /^search(?:s|d)?/.test(sub.a.en), sub.b.isNN(), sub.c.enStarts('for')
        ]; }
        function ko (sub) { return sub.ko(1, '에서', 2, '_0', 0); }
        return K.loop(arr, affected, tests, 2, 'VBNN', ko, name);
    },
    'VBNN__VB_a_to_b': function VBNN__VB_a_to_b (arr) {
        let name = 'VBNN__VB_a_to_b', affected = [],
            pass = / ?pass(?:es|ed|ing)?(?: in)?/,
            add = /^add(?:s|ed)?/, set = /^set(?:s)?/;
        function tests (sub) { return [
            sub.a.isVB(), sub.b.isNN(), sub.c.enStarts('to'),
            pass.test(sub.a.en) || set.test(sub.a.en) || add.test(sub.a.en)
        ]; }
        function ko (sub) {
            if (set.test(sub.a.en))  return sub.ko(1, '_0', 2, '로', 0); 
                                     return sub.ko(1, '_0', 2, '에', 0); //add, pass
        }
        return K.loop(arr, affected, tests, 2, 'VBNN', ko, name);
    },
    'VBNN__VB_a_as_b': function VBNN__VB_a_as_b (arr) {
        let name = 'VBNN__VB_a_as_b', affected = [],
            use = /^use(?:s|d)?/, pass = / ?pass(?:es|ed|ing)?(?: in)?/;
        function tests (sub) { return [
            sub.a.isVB(), sub.b.isNN(), sub.c.enStarts('as'), sub.c.pos == 'RBNN',
            use.test(sub.a.en) || pass.test(sub.a.en)
        ]; }
        function ko (sub) { 
            // if (use.test(sub.a.en))  return sub.ko(1, '_0', 2, '로', 0); 
            return sub.ko(1, '_0', 2, '로', 0);
        }
        return K.loop(arr, affected, tests, 2, 'VBNN', ko, name);
    },
    'VBNN__VB_to_a': function VBNN__VB_to_a (arr) {
        let name = 'VBNN__VB_to_a', affected = [],
            navigate = /^navigate(?:s|d)?/, evaluate = /^evaluat(?:e|es|ed|ing)$/;
        function tests (sub) { return [
            sub.a.isVB(), sub.b.enStarts('to'),
            navigate.test(sub.a.en) || evaluate.test(sub.a.en)
        ]; }
        function ko (sub) { 
            // if (navigate.test(sub.a.en)) return sub.ko(1, '로', 0]); 
            return sub.ko(1, '로', 0);
        }
        return K.loop(arr, affected, tests, 1, 'VBNN', ko, name);
    },
    'VBNN__start_with': function VBNN__start_with (arr) {
        let name = 'VBNN__start_with', affected = [];
        function tests (sub) { return [
            /^start(?:s)?/.test(sub.a.en),
            sub.b.enStarts('with')
        ]; }
        function ko (sub) { return sub.ko(1, '로', 0); }
        return K.loop(arr, affected, tests, 1, 'VBNN', ko, name);
    },
    'VBNN__VB_NN_RB': function VBNN__VB_NN_RB (arr) {
        let name = 'VBNN__VB_NN_RB', affected = [];
        function tests (sub) { return [
            sub.a.isVB(), sub.b.isNN(), sub.c.isRB()
        ]; }
        function ko (sub) { return sub.ko(1, '_0', 2, 0); }
        return K.loop(arr, affected, tests, 2, 'VBNN', ko, name);
    },
    'VBNN__VB_NN': function VBNN__VB_NN (arr) {
        let name = 'VBNN__VB_NN', affected = [];
        function tests (sub) { return [
            sub.a.isVB(), sub.b.isNN(),
        ]; }
        function ko (sub) { return sub.ko(1, '_0', 0); }
        return K.loop(arr, affected, tests, 1, 'VBNN', ko, name, 2);
    },
    'VBNN__VBNN_RB_Clause': function VBNN__VBNN_RB_Clause (arr) {
        let name = 'VBNN__VBNN_RB_Clause', affected = [];
        function tests (sub) { return [
            sub.a.isVBNN(), sub.b.isRB_Clause()
        ]; }
        function ko (sub) { return sub.ko(1, 0); }
        return K.loop(arr, affected, tests, 1, 'VBNN', ko, name);
    },
    'VBNN__RB_Clause_VBNN': function VBNN__RB_Clause_VBNN (arr) {
        let name = 'VBNN__RB_Clause_VBNN', affected = [], ko;
        function tests (sub) { return [
            sub.a.pos == 'RB_Clause', sub.b.isVBNN()
        ]; }
        return K.loop(arr, affected, tests, 1, 'VBNN', ko, name);
    },
    'VBNN__VBNN_that_VBNN': function VBNN__VBNN_that_VBNN (arr) {
        let name = 'VBNN__VBNN_that_VBNN', affected = [];
        function tests (sub) { return [
            sub.a.pos == 'VBNN', sub.b.en == 'that', sub.c.pos == 'VBNN'
        ]; }
        function ko (sub) { return sub.ko(2, '하는', 0); }
        return K.loop(arr, affected, tests, 2, 0, ko, name);
    },
    'VBNN__MD_VBNN': function VBNN__MD_VBNN (arr) {
        let name = 'VBNN__MD_VBNN', affected = [];
        function tests (sub) { return [
            sub.a.isMD(), sub.b.isVBNN()
        ]; }
        function ko (sub) { return sub.ko(1, 0); }
        return K.loop(arr, affected, tests, 1, 'VBNN', ko, name);
    },
    'NN__NN_that_VBNN': function NN__NN_that_VBNN (arr) {
        let name = 'NN__NN_that_VBNN', affected = [];
        function tests (sub) { return [
            sub.a.isNN(), sub.b.en == 'that', sub.c.isVBNN()
        ]; }
        function ko (sub) { return sub.ko(2, '하는', 0); }
        return K.loop(arr, affected, tests, 2, 0, ko, name);
    },
    'VBNN_VB__single': function VBNN_VB__single (arr) {
        let reg = /^(?:VB|VBNN)$/;
        for (var i = 0; i < arr.length; i++) {
            if (reg.test(arr[i].pos)) {
                let count_VB = arr.filter(o => reg.test(o.pumsa));
                if (count_VB.length == 1) {
                    if ( arr[i-1] && arr[i-1].isSubjective() ) { arr[i].state('single'); }
                    else { arr[i].state('imperative'); }
                    console.log(arr[i])
                }
            }
        }
        return [arr, []];
    },
    'Sentence__has': function Sentence__has (arr) {
        let name = 'Sentence__has', affected = [];
        function tests (sub) { return [
            sub.a.isNN(), /ha(?:s|ve)$/.test(sub.b.en), sub.c.isNN(),
            /(?:[\.:]) ?$/.test(sub.d.en)
        ]; }
        function ko (sub) { return sub.ko(0, '에는', 1, '가', '있습니다.'); }
        return K.loop(arr, affected, tests, 3, 'Sentence', ko, name);
    },
    'Sentence__has_not': function Sentence__has_not (arr) {
        let name = 'Sentence__has_not', affected = [];
        function tests (sub) { return [
            sub.a.isNN(), sub.b.en == 'does', sub.c.en == 'not', sub.d.en == 'have',
            sub.e.isNN(), /(?:[\.:]) ?$/.test(sub.f.en)
        ]; }
        function ko (sub) { return sub.ko(0, '에는', 4, '가', '없습니다.'); }
        return K.loop(arr, affected, tests, 5, 'Sentence', ko, name);
    },
    'Sentence__make_something_JJ': function Sentence__make_something_JJ (arr) {
        let name = 'Sentence__make_something_JJ', affected = [];
        function tests (sub) { return [
            /(?:make|made|makes)/.test(sub.a.en),
            sub.b.isNN(), sub.c.isJJ(), /[\.:] ?/.test(sub.d.en)
        ]; }
        function ko (sub) { return sub.ko(1, '를', 2, '만듭니다'); }
        return K.loop(arr, affected, tests, 3, 'Sentence', ko, name);
    },
    'Sentence__be_similar_to': function Sentence_be_similar_to (arr) {
        let name = 'Sentence_be_similar_to', affected = [];
        function tests (sub) { return [
            sub.a.isNN(), sub.b.isBE(),
            sub.c.en == 'similar', sub.d.enStarts('to'),
            / ?[\.:]$/.test(sub.e.en)
        ]; }
        function ko (sub) { return sub.ko(1, '는', 3, '와', '비슷합니다'); }
        return K.loop(arr, affected, tests, 4, 'Sentence', ko, name);
    },
    'Sentence__a_be_b': function Sentence__a_be_b (arr) {
        let name = 'Sentence__a_be_b', affected = [];
        function tests (sub) { return [
            sub.a.ko, sub.b.isBE(), sub.c.ko, /[\.:;] ?/.test(sub.d.en)
        ]; }
        function ko (sub) { 
            let vi = sub.c.ko + (sub.c.isNN()? '입니다.': '합니다.');console.log(vi)
            return sub.ko(0, '는', vi); 
        }
        return K.loop(arr, affected, tests, 3, 'Sentence', ko, name);
    },
    'Clause__NN_VBNN': function Clause__NN_VBNN (arr) {
        let name = 'Clause__NN_VBNN', affected = [];
        function tests (sub) { return [
            sub.a.isNN() || sub.a.isPRP(), sub.b.isVBNN()
        ]; }
        function ko (sub) {
            if (sub.a.isNN()) { return sub.ko(0, '는', 1); }
            else { return sub.ko(0, 1); }
        }
        return K.loop(arr, affected, tests, 1, 'Clause', ko, name);
    },
    'Clause__a_be_b': function Clause__a_be_b (arr) {
        let name = 'Clause__a_be_b', affected = [], ko;
        function tests (sub) { return [
            sub.a.ko, sub.b.isBE(), sub.c.ko
        ]; }
        return K.loop(arr, affected, tests, 2, 'Clause', ko, name);
    },
    'VB__MD_VB': function VB__MD_VB (arr) {
        let name = 'VB__MD_VB', affected = [];
        function tests (sub) { return [
            sub.a.isMD(), sub.b.isVB()
        ]; }
        function ko (sub) { return sub.ko(1, 0); }
        return K.loop(arr, affected, tests, 1, 1, ko, name);
    },
    'NN__NN_VBN': function NN__NN_VBN (arr) {
        let name = 'NN__NN_VBN', affected = [];
        function tests (sub) { return [
            sub.a.isNN(), sub.b.isVBN(),
        ]; }
        function ko (sub) { return sub.ko(1, 0); }
        return K.loop(arr, affected, tests, 1, 0, ko, name);
    },
};
