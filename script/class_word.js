

class Word {
	/*
	명사계열	NN NNS NNP NNPS CODE
	동사계열	VB VBS VBD VBG VBN
			VB_imperative VB_and/or VB_only VB_can VB_must
	*/
	constructor (english, pumsa, korean, status) {
		this.english = english;
			if (pumsa != 'NNP') { this.english = english.toLowerCase(); }
		this.pumsa = pumsa;
		this.korean = korean;
			// 동사원형
			if (/(?:VB|VBD|VBP)/.test(pumsa)) 	this.basic = korean;
			// 관형사원형
			else if (pumsa == 'JJ_noun' && korean.endsWith('한')) {
											    this.basic = korean.replace(/한$/, '');
			}

			// 명사원형(조사를 바꾸는 경우는 없을듯하지만 예방 차원에서 미리 등록)
			else 								this.basic = korean;
		this.dictionary = {};
		this.dictionary[pumsa] = korean;
		this.status = [];
			if (status) {
				// console.log(korean, status)
				this.status = (typeof status == 'string'? [status]: status);
			}
	}

	get en () { return this.english; }

	get pos () { return this.pumsa; }
	set pos (p) {
		this.pumsa = p;
		//불규칙동사인 경우에만 사전에 변형을 추가하므로, 변형이 있으면 변형을 쓰고 아니면 기본형 어미를 붙인다.
		let dic = this.dictionary;
		if (dic[p]) { this.korean = dic[p]; }

		else if (p == 'VB_and') 		{ this.korean = this.basic + '하고'; }
		else if (p == 'VB_or')  		{ this.korean = this.basic + '하거나'; }
		else if (p == 'VB_can') 		{ 
			this.korean = this.basic + '할 수'; 
			if (this.single_verb) { this.korean += ' 있습니다.'; }
		}

		else if (p == 'VB_because') 	{ this.korean = this.basic + '하므로'; }
		else if (p == 'VB_if') 			{ this.korean = this.basic + '한다면'; }
		else if (p == 'VB_imperative') 	{ this.korean = this.basic + '하십시오'; }
		else if (p == 'VB_when') 		{ this.korean = this.basic + '할 때'; }


		else if (p == 'JJ_and') 		{ this.korean = this.basic + '하고'; }
		else if (p == 'JJ_or') 			{ this.korean = this.basic + '하거나'; }
	}

	get ko () { return this.korean; }


	state (s) {
		if (typeof s == 'string') this.status.push(s);
		else					  this.status.concat(s);
		// console.log(this.status)
		if (this.pumsa.startsWith('VB') || /(?:Clause|Sentence)/.test(this.pumsa)) {
			if (s == 'can') {
				this.korean += '할 수';
			}
			if (s == 'if') {
				this.korean += '하면';
			}
			if (s == 'once') {
				this.korean += '하고 나면';
			}
			if (s == 'single') {
				if (this.status.some(st => st == 'can')) 	this.korean += ' 있습니다.';
				else 									 	this.korean += ' 합니다.';
			}
			if (s == 'when') {
				this.korean += '할 때';
			}
			if (s == 'when') {
				this.korean += '할 때마다';
			}
		}
		// console.log(this.toString())
	}

	toString () { return [this.english, this.pumsa, this.korean, this.status].join('|'); }

	add (pumsa, korean) { this.dictionary[pumsa] = korean; }

	isBE () { return /(?:are|be|is)/.test(this.english) && this.pumsa == 'VB'; }
	isCD () { return this.pumsa == 'CD' && this.korean;	}
	isClause () { return this.korean && /(?:VBNN|Clause)/.test(this.pumsa); }
	isIN () { return /(?:IN|TO)/.test(this.pumsa); }
	isJJ () { return /(?:JJ|JJ_noun|JJ_and|JJ_or|VBN)/.test(this.pumsa) && this.korean; }
	isJJ_noun () { return /(?:JJ_noun|VBN)/.test(this.pumsa) && this.korean; }
	isMD () { return this.pumsa == 'MD' && this.korean; }
	isNN () { 
		return this.pumsa == 'CODE' || 
		(/^(?:CODE|NN|NNP|NNS|NN_multi|Person|URL)?$/.test(this.pumsa) && this.korean); 
	}
	isPRP () { return this.pumsa == 'PRP'; }
	isRB () { return this.pos.startsWith('RB') && this.pos != 'RB_Clause'; }
	isRB_Clause () { return this.pos == 'RB_Clause'; }
	isVB () { return /^VB[DGPZ]?$/.test(this.pumsa) && this.korean; }
	isVBN () { return this.pumsa == 'VBN' && this.korean; }
	isVBNN () { return this.pumsa == 'VBNN' && this.korean; }

	enStarts (start) { return this.english.startsWith(start); }
	enEnds (end) { return this.english.endsWith(end); }

	josa (j) {
	    let vowel_en = /[2459adefhiorstuvwxy]$/,
	        vowel_ko = new RegExp('\[' + [
	            '가까나다따라마바빠사싸아자짜차카타파하개깨내대때래매배빼새쌔애재째채캐태패해',
	            '걔꺠냬댸떄럐먜뱨뺴섀썌얘쟤쨰챼컈턔퍠햬거꺼너더떠러머버뻐서써어저쩌처커터퍼허',
	            '게께네데떼레메베뻬세쎄에제쩨체케테페헤계꼐녜뎨뗴례몌볘뼤셰쎼예졔쪠쳬켸톄폐혜',
	            '고꼬노도또로모보뽀소쏘오조쪼초코토포호과꽈놔돠똬롸뫄봐뽜솨쏴와좌쫘촤콰톼퐈화',
	            '교꾜뇨됴뚀료묘뵤뾰쇼쑈요죠쬬쵸쿄툐표효구꾸누두뚜루무부뿌수쑤우주쭈추쿠투푸후',
	            '규뀨뉴듀뜌류뮤뷰쀼슈쓔유쥬쮸츄큐튜퓨휴그끄느드뜨르므브쁘스쓰으즈쯔츠크트프흐',
	            '긔끠늬듸띄릐믜븨쁴싀씌의즤쯰츼킈틔픠희기끼니디띠리미비삐시씨이지찌치키티피히',
	        ].join('') + '\]' + '$'),
	        josa = {
			    '가': '이',   
			    '나': '이나',      '는': '은',   
			    '라는': '이라는',   '로': '으로',  '를': '을',       
			    ' 써서': ' 써서',
			    '에': '에',       '에서': '에서', '와': '과', '의': '의',
			    '하는': '하는', '해야': '해야',
			};
	    let end = this.korean.replace(/<[^>]*?>$/, '').trim(),
	    	reg = /[가-힣]$/.test(end)? vowel_ko: vowel_en;

	    this.korean += reg.test(end)? j: (josa[j] || '');
	    if (!this.korean) console.log(this.basic, reg.test(end), j, josa[j]);
	    return this; 
	}
	josaVB (v) { 
	    if (/^접근/.test(v)) return this.josa('에');
	    if (/^일치/.test(v)) return this.josa('와');
	    if (/^필요/.test(v)) return this.josa('가');
	    					return this.josa('를');
	}
}
