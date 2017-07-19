


class Sub extends Array {
	constructor (arr) {
		super(arr, arr);
		for (var i = 0; i < arr.length; i++) {
			this[i] = arr[i];
		}
	}
	ko (...arg) {
	    let self = this, conclusion;
	    arg = arg.map(function (n) {
	    	if (typeof n == 'number') {
	    		if (self[n].pos == 'MD') {
	    			return new Word(self[n].en, 'josa', self[n].ko);
	    		}
	    		return self[n];
	    	}
	    	if (typeof n == 'string') {
	    		if (n.indexOf('_') === 0) {
	    			let VB = self[Number(n.replace('_', ''))];
	    			return new Word(VB.en, 'josaVB', VB.ko);
	    		}
	    		return new Word('', 'josa', n);
	    	}
	    }); 

	    // console.log(arg.map(o => o.toString()).join(', '));
	    conclusion = arg.reduce(function (prev, current) {
	    	let out, ko, st;
	    	console.log(prev.toString(), current.toString());
	    	if (current.pos == 'josa')			prev.josa(current.ko);
	    	else if (current.pos == 'josaVB')	prev.josaVB(current.ko);
	    	else 								prev.korean += ' ' + current.ko;
	    		
	    	if (current.status.length) prev.state(current.status);	    	
	    	if (current.ko == '할 수')  prev.state('can');
	    	
	    	return prev;
	    });
	    return conclusion;
	}

	get a () { return this[0]; }
	get b () { return this[1]; }
	get c () { return this[2]; }
	get d () { return this[3]; }
	get e () { return this[4]; }
	get f () { return this[5]; }
	get g () { return this[6]; }
	get h () { return this[7]; }
	get i () { return this[8]; }
	get j () { return this[9]; }
	get k () { return this[10]; }
	get l () { return this[11]; }
	get m () { return this[12]; }
	get n () { return this[13]; }
}
