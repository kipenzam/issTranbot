'use strict';
/*global console, Sub, Word*/
let K = {
	array: {},
	map: {
		word: {}
	},


	josa_all: [
	    '가', 
	    '나, 는', 
	    '라는, 로, 를',
	    '에, 에서, 와, 으로, 은, 을, 의, 이, 이라는',
	    '하는'
	].join(', ').split(', '),
	join_ko: function join_ko (sub, a, d) {
	    let sequence, current, next, VB_index;
	    for (var i = 0; i < a.length; i++) {
	        sequence = a[i]; next = a[i+1];
	        if (typeof sequence == 'number') {
	            current = sub[sequence];
	            a[i] = current;

	            if (next) {
	            	if (typeof next == 'string') {
		                // 동사의 인덱스인 경우
		                if (next.indexOf('_') === 0) {
		                	VB_index = Number(next.replace('_', ''));
		                    a[i] = current.josaVB(sub[VB_index].ko);  a[i+1] = null;
		                } 
		                // 조사인 경우
		                else if (K.josa_all.some(o => o == next)) {
		                    a[i] = current.josa(next);  			  a[i+1] = null;
		                }
		            }
	            }
	        }
	    }

	    let arr = [];
	    for (var j = 0; j < a.length; j++) {
	        if (a[j]) { arr.push(a[j]); }
	    }
	    let delimeter = typeof d == 'string'? d: ' ';
	    return arr.join(delimeter);
	},


	consumed: {en: '____consumed____', pumsa: 'NA', ko: ''},
	noun: /^(?:NN_multi|NNS|NNP|NN|CODE|Person)?$/,
	verb: /^VB[DGPZ]?$/,


	loop_get_pumsa: function loop_get_pumsa (pumsa, sub) {
		if (typeof pumsa == 'number') return sub[pumsa].pos;
		if (typeof pumsa == 'string') return pumsa;
		if (typeof pumsa == 'function') return pumsa(sub);
	},
	loop_try_test: function loop_try_test (tests, sub) {
        try {
	        return tests(sub);
	    }
	    catch (e) {
	    	let w;
	    	console.log(name + ': ');
	    	for (w in sub) {
	    		if (sub.hasOwnProperty(w)) { console.log('  ' + sub[w]); }
	    	}
	    	throw e;
	    }
	},
	loop: function loop (arr, affected, tests, items, pumsa, ko, name, log) {
	    let sub, bools, ko_loop, pumsa_loop, iteration = arr.length - items;
	    for (var i = 0; i < iteration; i++) {
	        sub = arr.slice(i, i+items+1);
	        sub = new Sub(sub);
			bools = this.loop_try_test(tests, sub);


	        if (K.suite(sub, bools, i, name, log)) {
	            ko_loop = typeof ko == 'function'? ko(sub): ko;
	            pumsa_loop = this.loop_get_pumsa(pumsa, sub);

	            arr = K.combine(sub, arr, i, items, pumsa_loop, ko_loop, name);
	            affected.push(arr[i]);
	        }
	    }
	    return [arr, affected];
	},
	loop_r: function loop_r (arr, affected, tests, items, pumsa, ko, name, log) {
	    let sub, bools, ko_loop, pumsa_loop;
	    for (var i = arr.length - 1 - items; i > 0; i--) {
	        sub = arr.slice(i, i+items+1);
	        sub = new Sub(sub);
			bools = this.loop_try_test(tests, sub);


	        if (K.suite(sub, bools, i, name, log)) {
	            ko_loop = typeof ko == 'function'? ko(sub): ko;
	            pumsa_loop = this.loop_get_pumsa(pumsa, sub);

	            arr = K.combine(sub, arr, i, items, pumsa_loop, ko_loop, name);
	            affected.push(arr[i]);
	        }
	    }
	    return [arr, affected];
	},
	combine: function combine (sub, arr, i, num, pumsa, ko, name) {
	    let j, kor, en = sub[0].en;
	    if (!ko) {
	        kor = sub[0].ko; if (!kor) console.log(sub);
	        for (j = 1; j <= num; j++) {
	            kor = kor.trim() + ' ' + sub[j].ko;
	            kor = kor.replace(/ {1,},/g, ',');
	        }
	    } 
	    else if (typeof ko == 'string') kor = ko;
	    else kor = ko.ko;	    
		    if (!kor) {console.log(name, sub, arr, i, num, pumsa, ko); }
		    else { console.log(name, kor); }

	    for (j = 1; j <= num; j++) {
	        en = en.trim() + ' ' + sub[j].en;
	        arr[i + j] = new Word('____consumed____', 'NA', '');
	    }
	    arr[i] = new Word(en.trim(), pumsa, kor.trim());
	    return arr;
	},
	suite: function suite (sub, bools, index, name, log) {
	    if (log == 2) { K.log_detail(sub, index, bools, name); }
	    if (log == 1) { K.log_brief(sub, index, bools, name); }
	    return bools.every(o => o);
	},
	log_detail: function log_detail (sub, index, bools, name) {
	    if (bools[0]) {
	        let r = [];
	        for (var i = 1; i < bools.length; i++) {
	            r.push( [sub[i].en, sub[i].pumsa, sub[i].ko].join('|') );
	            r.push(bools[i]);
	        }
	        console.log([name, ':', index, sub[0].toString()].join(' '), r);
	    }
	},
	log_brief: function log_brief (sub, index, bools, name) {
	    if (bools[0]) { console.log([name, ':', index, sub[0].toString()].join(' '), bools); }
	},


	r: {
		andor: /^(?:and|or)$/,
		use: /^use(?:s|d)?/,
	},
};