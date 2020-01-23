/// <reference path="index.d.ts"/>
/** @typedef {import('either-ts')} Sig */

/** @type {Sig['left']} */
exports.left = value => new Left(value)

/** @type {Sig['right']} */
exports.right = value => new Right(value)

/** @type {Sig['create']} */
exports.create = function(isRight, leftThunk, rightThunk) {
	return isRight ? exports.right(rightThunk()) : exports.left(leftThunk())
}

/** @type {Sig['fromThrowable']} */
exports.fromThrowable = thunk => {
	try {
		return exports.right(thunk())
	} catch(e) {
		return exports.left(e)
	}
}

/** @type {Sig['fromNullable']} */
exports.fromNullable = err => nullable => 
	nullable == null ? exports.left(err) : exports.right(nullable)

/**
	@template L, R
	@type {Sig['partition']}
*/
exports.partition = es => {
	/** @type {L[]} */
	const ls = []
	/** @type {R[]} */
	const rs = []

	for(const e of es) e
		.leftMap(left => ls.push(left))
		.map(right => rs.push(right))

	return [ls, rs]
}

/** @template L, R */
class Left {
	/** @param {L} value */
	constructor(value) { this.leftValue = value }

	get value() { return this.leftValue }

	/**
		@template L2
		@param {function(L): L2} f
	*/
	leftMap(f) {
		return new Left(f(this.leftValue))
	}

	/**
		@template R2
		@param {function(R): R2} _
	*/
	map(_) {
		return new Left(this.leftValue)
	}

	/**
		@template L2
		@param {function(L): Promise<L2>} f
	*/
	async leftMapThen(f) {
		return new Left(await f(this.leftValue))
	}

	/**
		@template R2
		@param {function(R): R2} _
	*/
	async mapThen(_) {
		return Promise.resolve(new Left(this.leftValue))
	}

	/**
		@template L2
		@param {function(L): Either<L2, R>} f 
	*/
	leftFlatMap(f) {
		return f(this.leftValue)    
	}

	/**
		@template R2
		@param {function(R): Either<L, R2>} _ 
	*/
	flatMap(_) {
		return new Left(this.leftValue)
	}

	/**
		@template L2
		@param {function(L): Promise<Either<L2, R>>} f 
	*/
	async leftFlatMapThen(f) {
		return await f(this.leftValue)
	}

	/**
		@template R2
		@param {function(R): Promise<Either<L, R2>>} f 
	*/
	flatMapThen(f) {
		return Promise.resolve(new Left(this.leftValue))
	}

	/** @param {function(L): R} f */
	rightOrElse(f) {
		return f(this.leftValue)
	}
}

/** @template L, R */
class Right {
	/** @param {R} value */
	constructor(value) { this.rightValue = value }

	get value() { return this.rightValue }

	/**
		@template L2
		@param {function(L): L2} _ 
	*/
	leftMap(_) {
		return new Right(this.rightValue)       
	}

	/**
		@template R2
		@param {function(R): R2} f 
	*/
	map(f) {
		return new Right(f(this.rightValue))
	}

	/**
		@template L2
		@param {function(L): Promise<L2>} _ 
	*/
	async leftMapThen(_) {
		return Promise.resolve(new Right(this.rightValue))
	}

	/**
		@template R2
		@param {function(R): Promise<R2>} f 
	*/ 
	async mapThen(f) {
		return new Right(await f(this.rightValue))
	}

	/**
		@template L2
		@param {function(L): Either<L2, R>} _ 
	*/
	leftFlatMap(_) {        
		return new Right(this.rightValue)
	}

	/**
		@template R2
		@param {function(R): Either<L, R2>} f 
	*/
	flatMap(f) {
		return f(this.rightValue)
	}

	/**
		@template L2
		@param {function(L): Promise<Either<L2, R>>} f
	*/
	leftFlatMapThen(f) {
		return Promise.resolve(new Right(this.rightValue))
	}

	/**
		@template R2
		@param {function(R): Promise<Either<L, R2>>} f
	*/
	async flatMapThen(f) {
		return await f(this.rightValue)
	}

	/** @param {function(L): R} _ */
	rightOrElse(_) {
		return this.rightValue
	}
}