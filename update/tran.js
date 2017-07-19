

// 여기서부터 싱크
String.prototype.title = function () {
	return this.replace(/^([a-z])([\s\S]*?)/, function ($1, $2, $3) {
		return $2.toUpperCase() + $3;
	});
};
String.prototype.lower = function () {
	return this.toLowerCase();
};
String.prototype.josa = function (joiner) {
	let vowel_en = /[2459aefhiorstuwxy]$/,
		vowel_ko = new RegExp('\[' + [
			'가까나다따라마바빠사싸아자짜차카타파하',
			'개깨내대때래매배빼새쌔애재째채캐태패해',
			'걔꺠냬댸떄럐먜뱨뺴섀썌얘쟤쨰챼컈턔퍠햬',
			'거꺼너더떠러머버뻐서써어저쩌처커터퍼허',
			'게께네데떼레메베뻬세쎄에제쩨체케테페헤',
			'계꼐녜뎨뗴례몌볘뼤셰쎼예졔쪠쳬켸톄폐혜',
			'고꼬노도또로모보뽀소쏘오조쪼초코토포호',
			'과꽈놔돠똬롸뫄봐뽜솨쏴와좌쫘촤콰톼퐈화',
			'교꾜뇨됴뚀료묘뵤뾰쇼쑈요죠쬬쵸쿄툐표효',
			'구꾸누두뚜루무부뿌수쑤우주쭈추쿠투푸후',
			'규뀨뉴듀뜌류뮤뷰쀼슈쓔유쥬쮸츄큐튜퓨휴',
			'그끄느드뜨르므브쁘스쓰으즈쯔츠크트프흐',
			'긔끠늬듸띄릐믜븨쁴싀씌의즤쯰츼킈틔픠희',
			'기끼니디띠리미비삐시씨이지찌치키티피히',
		].join('') + '\]' + '$');

	let reg,
		josa = {
			'나': '이나',
			'와': '과',
			'를': '을',
			'라는': '이라는',
		};

	let end = this.replace(/<[^>]*?>$/, '').trim();
	if (/[가-힣]$/.test(end)) { reg = vowel_ko; }
	else { reg = vowel_en; }

	if (reg.test(end)) {
		return this + joiner + ' ';
	} else {
		return this + (josa[joiner] || '') + ' ';
	}
};
K.reg = {
	'pumsa_NN': /^(?:CODE|NNS|NNP|NN)?$/,
	'pumsa_VB': ''
};
K.consumed = {en: '____consumed____', pumsa: 'NA', ko: ''};

		function tran (lines) {
			return lines.split('\n')
						.map(line => make_pair(line))
						.join('\n');
		}
		function make_pair (line) {
			return ['영문: ', line, '\n한글: ', tran_line(line)].join('');
		}
		function tran_line (line) {
			let array = K.map.sentences[line.trim()];
			if (!array) { console.log(line); }

			array = redefine_pumsa(array).map(o => get_ko(o));
			return pipe(array, pipeline, line);
		}
		function redefine_pumsa (arr) {
			let reg = K.reg.pumsa_NN, test2;
			for (var i = 0; i < arr.length; i++) {
				test2 = arr[i+1] && reg.test(arr[i+1].pumsa);
				if (arr[i].pumsa == 'JJ' && test2) {
					arr[i].pumsa = 'JJ_noun';
				}
			}
			return arr;
		}
		function get_ko (o) {
			let out = o, en = o.en, pumsa = o.pumsa, map = K.map.word;
			out.ko = '';
			if (/^(?:CODE|URL)$/.test(o.pumsa)) {
				out.ko = o.en; return out;
			}
			if (/^[\d]{1,}$/.test(o.en)) {
				out.ko = o.en; return out;
			}

			if (pumsa == 'NNP') {
				return fetch_map(out, map, en, pumsa);
			}

			if (map[en] && map[en][pumsa]) {
				return fetch_map(out, map, en, pumsa);
			}

			en = en.lower();
				if (map[en] && map[en][pumsa]) {
					return fetch_map(out, map, en, pumsa);
				}

			en = en.title();
				if (map[en] && map[en][pumsa]) {
					return fetch_map(out, map, en, pumsa);
				}
			
			return out;
		}
			function fetch_map (out, map, en, pumsa) {
				out.ko = map[en] && map[en][pumsa]? map[en][pumsa]: '';
				return out;
			}
		function pipe (array, pipeline, line) {
			let out = array, middle, confirm;
			for (var i = 0; i < pipeline.length; i++) {
				middle = pipeline[i](out, line);
				if (!middle[0]) { console.log('error in ' + middle[1]); }
				else {
					out = middle[0];
					confirm = out.filter(o => o.ko).map(o => o.ko).join('|');
					console.log(middle[1], confirm);
				}

				out = out.filter(o => o.en != '____consumed____');
			}
			return final(out);
		}
	const pipeline = [
		function compound_word (arr, line) {
			let out = arr,
				compounds = K.array.compounds.filter(word => line.lower().indexOf(word.en.lower()) >= 0),
				middle;
			for (var i = 0; i < compounds.length; i++) {
				middle = compose_compounds(compounds[i], line, out);
				if (!middle) { console.log('compound_word:', compounds[i], line, out); }
				else { out = middle; }
			}
			return [out, 'compound_word'];
		},
		function chapter (arr) {
			for (var i = 0; i < arr.length; i++) {
				if (/chapter/i.test(arr[i].en) && arr[i+1] && arr[i+1].pumsa == 'CD') {
					arr[i].ko = arr[i+1].en.match(/\d{1,}/) + '장';
					arr[i+1] = K.consumed;
				}
			}
			return [arr, 'chapter'];
		},
		// function strip_DT (arr, line) {
		// 	// experimental
		// 	arr = arr.filter(o => o.pumsa != 'DT' || !/^(?:an|a|the)$/.test(o.en));
		// 	return [arr, 'strip_DT'];
		// },
		function strip_PRP (arr) {
			// experimental
			arr = arr.filter(o => o.pumsa != 'PRP$');
			return [arr, 'strip_PRP'];
		},
		function find_person_name (arr) {
			let it, person;
			for (var i = arr.length - 1; i >= 1; i--) {
				it = arr[i-1];
				person = arr[i];
				if (/(?:NNP|PERSON)/.test(person.pumsa) && it.pumsa == 'NNP') {
					arr[i-1].en += ' ' + person.en; 
					arr[i-1].ko += ' ' + person.ko; 
					arr[i-1].pumsa = 'PERSON';
					arr[i] = K.consumed;
				}
			}
			arr = arr.map(function (o) {
				if (o.pumsa == 'PERSON') {
					return {en:o.en, pumsa:o.pumsa, ko:[o.ko, '<sup>', o.en, '</sup>'].join('')};
				}
				return o;
			});
			return [arr, 'find_person_name'];
		},
		function bold (arr) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i].pumsa == 'B' && arr[i+1] && arr[i+1].ko && arr[i+2] && arr[i+2].pumsa == 'B') {
					arr[i].en += arr[i+1].en + arr[i+2].en;
					arr[i].ko = ['<b>', arr[i+1].ko, '</b>'].join('');
					arr[i].pumsa = arr[i+1].pumsa;
					arr[i+1] = arr[i+2] = K.consumed;
				}
			}
			return [arr, 'bold'];
		},
		function reverse_NN_code (arr) {
			let reg = K.reg.pumsa_NN, test2;
			for (var i = arr.length - 1; i >= 0; i--) {
				test2 = arr[i-1] && /(?:모듈|클래스|함수)/.test(arr[i-1].ko);
				if (reg.test(arr[i].pumsa) && arr[i].pumsa == 'CODE' && test2) {
					arr[i-1] = combine(arr[i], arr[i-1], 'NN');
					arr.splice(i, 1);
				}
			}
			return [arr, 'reverse_NN_code'];
		},
		function combine_code_NN (arr) {
			let reg = K.reg.pumsa_NN, test2;
			for (var i = 0; i < arr.length; i++) {
				test2 = arr[i+1] && reg.test(arr[i+1].pumsa)
				if (arr[i].pumsa == 'CODE' && test2) {
					arr[i] = combine(arr[i], arr[i+1], 'NN');
					arr[i+1] = K.consumed;
				}

				test2 = arr[i+1] && arr[i+1].pumsa == 'CODE'
				if (reg.test(arr[i].pumsa) && test2) {
					arr[i] = combine(arr[i], arr[i+1], 'NN');
					arr[i+1] = K.consumed;
				}
			}
			return [arr, 'combine_code_NN'];
		},
		function combine_NN_of_NN (arr) {
			let reg = K.reg.pumsa_NN,
				out = arr,
				test2, test3, test4, test5, test6;
			for (var i = 0; i < out.length; i++) {
				test2 = out[i+1] && out[i+1].en == 'of';
				test3 = out[i+2] && reg.test(out[i+2].pumsa);
				if (reg.test(out[i].pumsa) && test2 && test3) {
					out[i] = combine(out[i+2], out[i], 'NN');
					out[i+1] = out[i+2] = K.consumed;
				}

				test4 = out[i+2] && is_a_an_the(out[i+2]);
				test5 = out[i+3] && reg.test(out[i+3].pumsa);
				if (reg.test(out[i].pumsa) && test2 && test4 && test5) {
					out[i] = combine(out[i+3], out[i], 'NN');
					out[i+1] = out[i+2] = out[i+3] = K.consumed;
				}
			}
			return [out, 'combine_NN_of_NN'];
		},
		function combine_most_NN (arr) {
			let test2;
			for (var i = arr.length - 1; i >= 0; i--) {
				test2 = arr[i-1] && arr[i-1].en == 'most';
				// console.log(arr[i-1], arr[i])
				if (arr[i].pumsa == 'NNS' && test2) {
					arr[i-1].en += ' ' + arr[i].en;
					arr[i-1].ko = '대부분의 ' + arr[i].ko;
					arr[i-1].pumsa = 'NNS';
					arr.splice(i, 1);
				}
			}
			return [arr, 'combine_most_NN'];
		},
		function combine_RB_JJ (arr) {
			for (var i = arr.length - 1; i >= 0; i--) {
				if (arr[i].pumsa.startsWith('JJ') && arr[i-1] && arr[i-1].pumsa == 'RB') {
					arr[i-1] = combine(arr[i-1], arr[i], 'next');
					arr.splice(i, 1);
				}
			}
			return [arr, 'combine_RB_JJ'];
		},
		function combine_NN_POS (arr) {
			let reg = K.reg.pumsa_NN, test2
			for (var i = 0; i < arr.length; i++) {
				test2 = arr[i+1] && arr[i+1].pumsa == 'POS' && arr[i+1].en == '’s';
				if (reg.test(arr[i].pumsa) && test2) {
					arr[i].ko += '의';
					arr[i].pumsa = 'JJ';
					arr[i+1] = K.consumed;
				}
			}
			return [arr, 'combine_RB_JJ'];
		},
		function combine_JJ_NN (arr) {
			let reg = K.reg.pumsa_NN, test2;
			for (var i = 0; i < arr.length; i++) {
				test2 = arr[i+1] && reg.test(arr[i+1].pumsa)
				if (arr[i].pumsa == 'JJ_noun' && arr[i].ko && test2) {
					arr[i] = combine(arr[i], arr[i+1], 'next');
					arr[i+1] = K.consumed;
				}

				if (arr[i].pumsa == 'DT' && arr[i].ko && test2) {
					arr[i] = combine(arr[i], arr[i+1], 'next');
					arr[i+1] = K.consumed;
				}
			}
			return [arr, 'combine_JJ_NN'];
		},
		function NN_called_NN (arr) {
			let reg = K.reg.pumsa_NN, test2, test3;
			for (var i = 0; i < arr.length; i++) {
				test2 = arr[i+1] && arr[i+1].en.lower() == 'called';
				test3 = arr[i+2] && arr[i+2].ko && reg.test(arr[i+2].pumsa);
				if (reg.test(arr[i].pumsa) && arr[i].ko && test2 && test3) {
					arr[i].en = [arr[i].en, arr[i+1].en, arr[i+2].en].join(' ');
					arr[i].ko = arr[i+2].ko.josa('라는') + arr[i].ko;
					arr[i+1] = arr[i+2] = K.consumed;
				}
			}
			return [arr, 'NN_called_NN'];
		},
		function combine_NN_comparison_NN (arr) {
			let reg = K.reg.pumsa_NN, test2, test3;
			for (var i = 0; i < arr.length; i++) {
				test2 = arr[i+1] && /^(?:less|greater) than/.test(arr[i+1].en);
				test3 = arr[i+2] && (reg.test(arr[i].pumsa) || (arr[i+2].pumsa == 'CD' && arr[i+2].ko));
				if (reg.test(arr[i].pumsa) && test2 && test3) {
					arr[i].en = [arr[i].en, arr[i+1].en, arr[i+2].en].join(' ');
					arr[i].ko = (arr[i+2].ko + arr[i+1].ko + ' ' + arr[i].ko).trim();
					arr[i].pumsa = 'NN';
					arr[i+1] = arr[i+2] = K.consumed; 
				}
			}
			return [arr, 'combine_NN_comparison_NN'];
		},
		function combine_NN_and_or_NN (arr) {
			let reg = K.reg.pumsa_NN, test2, test3, josa;
			for (var i = arr.length - 1; i >= 0; i--) {
				test2 = arr[i-1] && /(?:and|or)/.test(arr[i-1].en);
				test3 = arr[i-2] && reg.test(arr[i-2].pumsa);
				if (reg.test(arr[i].pumsa) && test2 && test3) {
					josa = arr[i-1].en == 'or'? '나': '와';
					arr[i-2].en += ', ' + arr[i].en;
					arr[i-2].ko = arr[i-2].ko.josa(josa) + arr[i].ko;
					arr[i-2].pumsa = 'NN';
					arr.splice(i, 2);
				}
			}
			return [arr, 'combine_NN_comma_NN'];
		},
		function combine_like_NN (arr) {
			let reg = K.reg.pumsa_NN, test2, test3;
			for (var i = 0; i < arr.length; i++) {
				test2 = arr[i+1] && reg.test(arr[i+1].pumsa);
				test3 = arr[i+2] && arr[i+2].en == ',';
				if (arr[i].en.lower() == 'like' && arr[i].pumsa == 'IN' && test2) {
					arr[i].en = [arr[i].en, arr[i+1].en].join(' ');
					arr[i].ko = arr[i+1].ko.josa('와') + '마찬가지로';
					arr[i].pumsa = 'NA';
					arr[i+1] = arr[i+2] = K.consumed;
				}
			}
			return [arr, 'combine_like_NN'];
		},
		function combine_NN_comma_NN (arr) {
			let reg = K.reg.pumsa_NN, test2, test3, test4;
			for (var i = arr.length - 1; i >= 0; i--) {
				test2 = arr[i-1] && /(?:and|or)/.test(arr[i-1].en);
				test3 = arr[i-2] && arr[i-2].en == ',';
				test4 = arr[i-3] && reg.test(arr[i-3].pumsa);
				if (reg.test(arr[i].pumsa) && test2 && test3 && test4) {
					arr[i-3].en += ', ' + arr[i].en;
					arr[i-3].ko += ', ' + arr[i].ko;
					arr[i-3].pumsa = 'NN';
					arr.splice(i, 3);
				}// else {
				// 	test2 = arr[i-1] && arr[i-1].en == ',';
				// 	test3 = arr[i-2] && reg.test(arr[i-2].pumsa);
				// 	if (reg.test(arr[i].pumsa) && test2 && test3) {
				// 		arr[i-2].en += ', ' + arr[i].en;
				// 		arr[i-2].ko += ', ' + arr[i].ko;
				// 		arr[i-2].pumsa = 'NN';
				// 		arr.splice(i, 2);
				// 	}
				// }
			}
			return [arr, 'combine_NN_comma_NN'];
		},
		function object_with_code_data_type (arr) {
			let test2, test3;
			for (var i = 0; i < arr.length; i++) {
				test2 = arr[i+1] && arr[i+1].en.lower() == 'with';
				test3 = arr[i+2] && arr[i+2].ko.endsWith('데이터 타입');
				if (arr[i].ko.endsWith('객체') && test2 && test3) {
					let code = arr[i+2].ko.replace('데이터 타입', '').trim();
					arr[i].ko = ['데이터 타입이 ', code, '인 ', arr[i].ko].join('');
					arr[i].pumsa = 'NN';
					arr[i+1] = arr[i+2] = K.consumed;
				}
			}
			return [arr, 'object_with_code_data_type'];
		},
		// function combine_RB_VB (arr) {
		// 	let test2, test3;
		// 	for (var i = 0; i < arr.length; i++) {
		// 		test2 = arr[i+1] && reg.test(arr[i+1].pumsa);
		// 		test3 = arr[i+2] && arr[i+2].pumsa == 'RB' && arr[i+2].ko;
		// 		if (/VB/.test(arr[i].pumsa) && arr[i].ko && test2 && test3) {
		// 			arr[i].en = arr[i+1].en + ' ' + arr[i+2].en + ' ' + arr[i].en;
		// 			arr[i].ko = [arr[i+1].ko.josa('를').trim(), arr[i+2].ko, arr[i].ko].join(' ');
		// 			arr[i].pumsa = 'VBNN';
		// 			arr[i+1] = arr[i+2] = K.consumed;
		// 		}
		// 	}
		// 	return [arr, 'combine_RB_VB'];
		// },
		function combine_VB_NN_RB (arr) {
			let reg = K.reg.pumsa_NN, test2, test3;
			for (var i = 0; i < arr.length; i++) {
				test2 = arr[i+1] && reg.test(arr[i+1].pumsa);
				test3 = arr[i+2] && arr[i+2].pumsa == 'RB' && arr[i+2].ko;
				if (/VB/.test(arr[i].pumsa) && arr[i].ko && test2 && test3) {
					arr[i].en = arr[i+1].en + ' ' + arr[i+2].en + ' ' + arr[i].en;
					arr[i].ko = [arr[i+1].ko.josa('를').trim(), arr[i+2].ko, arr[i].ko].join(' ');
					arr[i].pumsa = 'VBNN';
					arr[i+1] = arr[i+2] = K.consumed;
				}
			}
			return [arr, 'combine_VB_NN_RB'];
		},
		function combine_VB_NN (arr) {
			let reg = K.reg.pumsa_NN, test2, test3, test4;
			for (var i = 0; i < arr.length; i++) {
				test2 = arr[i+1] && reg.test(arr[i+1].pumsa);
				if (/VB/.test(arr[i].pumsa) && arr[i].ko && test2) {
					arr[i].en = arr[i+1].en + ' ' + arr[i].en;
					arr[i].ko = arr[i+1].ko.josa('를') + arr[i].ko;
					arr[i].pumsa = 'VBNN';
					arr[i+1] = K.consumed;
					// console.log('case 1: ', arr[i], arr[i+1], arr[i+2])
				}

				test3 = arr[i+1] && arr[i+1].pumsa == 'DT' && /(?:the|an|a)/.test(arr[i+1].en);
				test4 = arr[i+2] && reg.test(arr[i+2].pumsa);
				if (/VB/.test(arr[i].pumsa) && arr[i].ko && test3 && test4) {
					arr[i].en = [arr[i].en, arr[i+1].en, arr[i+2].en].join(' ');
					arr[i].ko = arr[i+2].ko.josa('를') + arr[i].ko;
					arr[i].pumsa = 'VBNN';
					arr[i+1] = arr[i+2] = K.consumed;
				}
			}
			return [arr, 'combine_VB_NN'];
		},
		function combine_NN_VBNN (arr) {
			let reg = K.reg.pumsa_NN, test2;
			for (var i = 0; i < arr.length; i++) {
				test2 = arr[i+1] && arr[i+1].pumsa == 'VBNN';
				if (reg.test(arr[i].pumsa) && arr[i].ko && test2) {
					arr[i] = combine(arr[i], arr[i+1], 'Clause');
					arr[i+1] = K.consumed;
				}
			}
			return [arr, 'combine_NN_VBNN'];
		},
	];
		function combine (prev, next, pumsa) {
			prev.en += ' ' + next.en;
			prev.ko += ' ' + next.ko;
			if (pumsa != 'prev') {
				if (pumsa == 'next') {
					prev.pumsa = next.pumsa;
				} else {
					prev.pumsa = pumsa || '';
				}
			}
			return prev;
		}
		function compose_compounds (word, line, objects) {
		    const en = word.en;
		    const words = en.split(' ');
		    let out = objects;
		    for (var i = 0; i < out.length - words.length; i++) {
		        let matched = true;
		        for (var j = 0; j < words.length; j++) {
		            matched = matched && (words[j].lower() == out[i + j].en.lower());
		        }
		        if (matched) {
		            out[i] = word;
		            for (var k = 1; k < words.length; k++) {
		                out[i + k] = K.consumed;
		            }
		        }
		    }
		    if (!out) { console.log(word, line, objects); }
		    return out;
		}
		function is_a_an_the (o) {
			return /(?:the|any|an|a)/.test(o.en) && o.pumsa == 'DT';
		}
	function final (array) {
		let out = array;
		if (out.length > 1) {
			out = out.filter(o => o.ko.length > 3 || /^(?:B|I|CODE|URL|SUP|SUB)$/.test(o.pumsa));
		}
		out = out.map(o => o.ko || o.en);
		out = out.join(' ');
		out = out.replace(/<b> /g, '<b>').replace(/\s{1,}<\/b> /g, '</b>');
		out = out.replace(/내장 (<code>.*?<\/code>) (함수)/g, function ($1, $2, $3) {
						return ['내장', $3, $2].join(' ');
					});
		return out;
	}

// confirm 2
// 여기까지 싱크