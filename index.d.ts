declare interface Either<L, R> {
  map<R2>(f: (r: R) => R2): Either<L, R2>
  leftMap<L2>(f: (l: L) => L2): Either<L2, R>    
  
  mapThen<R2>(f: (r: R) => Promise<R2>): Promise<Either<L, R2>>
  leftMapThen<L2>(f: (l: L) => Promise<L2>): Promise<Either<L2, R>>    

  flatMap<R2>(f: (r: R) => Either<L, R2>): Either<L, R2>
  leftFlatMap<L2>(f: (l: L) => Either<L2, R>): Either<L2, R>
  
  flatMapThen<R2>(f: (r: R) => Promise<Either<L, R2>>): Promise<Either<L, R2>>
  leftFlatMapThen<L2>(
  	f: (l: L) => Promise<Either<L2, R>>): Promise<Either<L2, R>>
  
  rightOrElse(f: (l: L) => R): R
  value: L | R
}

declare module 'either-ts' {
  function left<L, R>(value: L): Either<L, R>
  function right<L, R>(value: R): Either<L, R>
  function create<L, R>(
  	isRight: boolean,
  	leftThunk: () => L,
  	rightThunk: () => R
  ): Either<L, R>

  function fromThrowable<L, R>(thunk: () => R): Either<L, R>
  function fromNullable<L, R>(err: L): (nullable: R | null | undefined) => Either<L, R>

  function partition<L, R>(es: Either<L, R>[]): [L[], R[]]
}
