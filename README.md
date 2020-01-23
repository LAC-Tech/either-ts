# either-ts

A minimalist, zero dependency implementation of an 'Either' or 'Result' type. Inspired by similar types in Ocaml, Haskell, Scala, F#, Rust etc.

This is written in Javascript, but can be used in Typescript, or in js files that are being type-checked by tsc

## What's an Either type?

Either, aka Result, is a pattern for methods and functions that can return 'either' an error of type `L` or a normal result of type `R`. It's an alternative to error codes, or even using exceptions. The advantage is that it doesn't interrupt your control flow like exceptions and it doesn't let you ignore it like an error code.

## Why have you made this and not used other EIther libraries floating around?

Because this one is smaller, and just does one thing. It's not an attempt to reconstruct Haskell in Javascript - I am just taking one useful pattern I was productive with in other languages.

If there's a either implementation smaller than this, let me know!

## Installation 
```sh
yarn add either-ts
npm install either-ts
```

## Usage
```ts
import * as either from 'either-ts'

```

# API

## Creating an Either

#### left
`L -> Either<L, R>`

#### right
`R -> Either<L, R>`

#### create
`boolean -> (() -> L) -> (() -> R) -> Either<L, R>`

If false, will create an either with the result of the thunk that produces `L`. If true, it will use the thunk that produces `R`.

#### fromThrowable


#### fromNullable


## Using an Either


### Mapping

Transforms one side, while leaving the other side intact

#### .map
`Either<L, R> -> (R -> R2) -> Either<L, R2>`

#### .leftMap
`Either<L, R> -> (L -> L2) -> Either<L2, R>`

### Mapping and promisifying

#### .mapThen
`Either<L, R> -> (R -> Promise<R2>) -> Either<L2, R>`

Transforms the right hand side with a function that returns a promise, and promisifies the entire Either. This can be more convenient than having one side wrapped in a promise and one side not.

#### .leftMapThen
leftMapThen<L2>(f: (l: L) => Promise<L2>): Promise<Either<L2, R>>

### Flat-Mapping

#### .flatMap
flatMap<R2>(f: (r: R) => Either<L, R2>): Either<L, R2>

#### .leftFlatMap
leftFlatMap<L2>(f: (l: L) => Either<L2, R>): Either<L2, R>

### Flat Mapping then Promisifying

#### .flatMapThen  
flatMapThen<R2>(f: (r: R) => Promise<Either<L, R2>>): Promise<Either<L, R2>>

#### .leftFlatMapThen
leftFlatMapThen<L2>(
  	f: (l: L) => Promise<Either<L2, R>>): Promise<Either<L2, R>>

### Un-Wrapping

#### .rightOrElse
rightOrElse(f: (l: L) => R): R

#### .value
`Either<L, R> -> L | R`

Gets the raw value of an either. Useful for when you have used `map` and or `leftMap` to make the types the same.