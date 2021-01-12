# 고급 타입

<div style="text-align: right">2021.01.12</div>

## 교차 타입(Intersection types)

📌 여러 타입을 하나로 결합

📌 기존 타입을 합쳐 필요한 모든 기능을 가진 하나의 타입을 얻을 수 있음

📌 기존의 객체-지향 틀과는 맞지 않는 믹스인이나 다른 컨셉들에서 교차 타입이 사용되는 것을 볼 수 있음

```tsx
function extend<First extends object, Second extends object>(
  first: First,
  second: Second
): First & Second {
  // Partial: 타입 변수의 모든 타입들을 optional 형태로 바꿔줌
  const result: Partial<First & Second> = {};
  for (const prop in first) {
    if (first.hasOwnProperty(prop)) {
      (result as First)[prop] = first[prop];
    }
  }
  for (const prop in second) {
    if (second.hasOwnProperty(prop)) {
      (result as Second)[prop] = second[prop];
    }
  }
  return result as First & Second;
}

class Person {
  constructor(public name: string) {}
}

interface Loggable {
  log(name: string): void;
}

class ConsoleLogger implements Loggable {
  log(name: string) {
    console.log(`Hello, I'm ${name}.`);
  }
}

let logger = new ConsoleLogger();

// es5에서는 prototype ok, es6에서는 prototype X
const jim = extend(new Person("Jim"), ConsoleLogger.prototype);
jim.log(jim.name);
```

## 유니언 타입(Union types)

📌 유니언 타입을 값으로 가지고 있으면, 유니언에 있는 모든 타입에 공통인 멤버만 접근 가능

```tsx
interface Bird {
  fly(): boolean;
  layEggs(): boolean;
}

interface Fish {
  swim(): boolean;
  layEggs(): boolean;
}

function getSmallPet(type: string): Fish | Bird {
  if (type === "fish")
    return {
      swim() {
        console.log("swim");
        return true;
      },
      layEggs() {
        console.log("lay eggs");
        return true;
      },
    };
  else
    return {
      fly() {
        console.log("fly");
        return true;
      },
      layEggs() {
        console.log("lay eggs");
        return true;
      },
    };
}

let pet = getSmallPet("fish");
pet.layEggs(); // OK
pet.swim(); // ❌ error
```

## 타입 가드와 차별 타입(Type guards and differentiating types)

```tsx
let pet = getSmallPet("fish");

// pet.swim()으로 접근 시 에러 발생
if ((pet as Fish).swim()) {
  (pet as Fish).swim();
} else if ((pet as Bird).fly()) {
  (pet as Bird).fly();
}
```

### 사용자-정의 타입 가드(User-defined type guards)

📌 타입 가드: 스코프 안에서의 타입을 보장하는 런타임 검사를 수행한다는 표현식

- 타입 서술어 사용하기(Using type predicates)

  📌 타입 가드를 정의하기 위해, 반환 타입이 _서술어_ 인 함수를 정의만 하면 됨

  📌 서술어는 `parameterName is Type` 형태임

  📌 `parameterName`은 반드시 현재 함수 시그니처의 매개변수 이름이어야 함

  📌 `isFish`가 변수와 함께 호출될 때마다, typescript는 기존 타입과 호환된다면 그 변수를 특정 타입으로 제한할 것임

  ```tsx
  function isFish(pet: Fish | Bird): pet is Fish {
    return (pet as Fish).swim !== undefined;
  }

  // 이제 'swim'과 'fly'에 대한 모든 호출은 허용됨
  if (isFish(pet)) {
    pet.swim();
  } else {
    pet.fly();
  }
  ```

- `in` 연산자 사용하기(Using the `in` operator)

  📌 `in` 연산자는 타입을 좁히는 표현으로 작용함

  📌 `n in x` 표현에서, `n`은 문자열 리터럴 혹은 문자열 리터럴 타입이고 `x`는 유니언 타입임

  📌 `true` 분기에서는 선택적 혹은 필수 프로퍼티 `n`을 가지는 타입으로 좁힘

  📌 `false` 분기에서는 선택적 혹은 누락된 프로퍼티 `n`을 가지는 타입으로 좁힘

  ```tsx
  function move(pet: Fish | Bird) {
    if ("swim" in pet) {
      return pet.swim();
    } else {
      return pet.fly();
    }
  }
  ```

### `typeof` 타입 가드(`typeof` type guards)

📌 타입 검사를 인라인으로 작성할 수 있음

📌 `typeof` 연산자는 `number`, `string`, `boolean`, `symbol`만 타입 가드로 인식할 수 있음

```tsx
function padLeft(value: string, padding: string | number) {
  if (typeof padding === "number") {
    return Array(padding + 1).join(" ") + value;
  }
  if (typeof padding === "string") {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}

console.log(padLeft("hello", 3));
```

### `instanceof` 타입 가드(`instanceof` type guards)

📌 생성자 함수를 사용하여 타입을 좁히는 방법

📌 instanceof의 오른쪽은 생성자 함수여야 함

```tsx
interface Padder {
  getPaddingString(): string;
}

class SpaceRepeatingPadder implements Padder {
  constructor(private numSpaces: number) {}
  getPaddingString() {
    return Array(this.numSpaces + 1).join(" ");
  }
}

class StringPadder implements Padder {
  constructor(private value: string) {}
  getPaddingString() {
    return this.value;
  }
}

function getRandomPadder() {
  return Math.random() < 0.5
    ? new SpaceRepeatingPadder(4)
    : new StringPadder("  ");
}

// SpaceRepeatingPadder | StringPadder
let padder: Padder = getRandomPadder();

if (padder instanceof SpaceRepeatingPadder) {
  padder; // SpaceRepeatingPadder
}
if (padder instanceof StringPadder) {
  padder; // StringPadder
}
```

## 널러블 타입(Nullable types)

📌 typescript는 javascript와 맞추기 위해 `null`과 `undefined`를 다르게 처리함

📌 아래 예제의 에러는 `"strictNullChecks": false`로 설정할 시 에러가 나지않음

```tsx
let s = "foo";
s = null; // ❌ error
let sn: string | null = "bar";
sn = null; // OK

sn = undefined; // ❌ error
```

### 선택적 매개변수와 프로퍼티(Optional parameters and properties)

📌 `"strictNullChecks": false`을 적용하면, 선택적 매개변수가 `| undefined`를 자동으로 추가함:

```tsx
function f(x: number, y?: number) {
  return x + (y || 0);
}
f(1, 2);
f(1);
f(1, undefined);
f(1, null); // ❌ error, 'null'은 'number | undefined'에 할당할 수 없음
```

```tsx
class C {
  a!: number;
  b?: number;
}
let c = new C();
c.a = 12;
c.a = undefined; // ❌ error, 'undefined'는 'number'에 할당할 수 없음
c.b = 13;
c.b = undefined; // OK
c.b = null; // ❌ error, 'null'은 'number | undefined'에 할당할 수 없음
```

### 타입 가드와 타입 단언(Type guards and type assertions)

📌 `null`을 제거하기 위해 타입가드를 사용할 필요가 있음

```tsx
function f(sn: string | null): string {
  // 타입 가드 사용
  if (sn == null) {
    return "default";
  } else {
    return sn;
  }
}
```

📌 위는 아래 예시로 대체 가능:

```tsx
function f(sn: string | null): string {
  return sn || "default";
}
```

📌 컴파일러가 `null`이나 `undefined`를 제거할 수 없는 경우, Non-null 단언 연산자(`!`)를 이용하여 수동으로 제거할 수 있음

📌 (컴파일러는 중첩 함수 안에서 null을 제거할 수 없음)

```tsx
function broken(name: string | null): string {
  function postfix(epithet: string) {
    return name.charAt(0) + ".  the " + epithet; // ❌ error, 'name'은 아마도 null임
  }
  name = name || "Bob";
  return postfix("great");
}

function fixed(name: string | null): string {
  function postfix(epithet: string) {
    return name!.charAt(0) + ".  the " + epithet; // OK
  }
  name = name || "Bob";
  return postfix("great");
}
```

## 타입 별칭(Type aliases)

📌 타입 별칭은 새로운 타입을 만드는 것이 아니라, 그 타입을 나타내는 새로운 _이름_ 을 만드는 것임

```tsx
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
  if (typeof n === "string") {
    return n;
  } else {
    return n();
  }
}
```

📌 인터페이스처럼, 타입 별칭은 제네릭이 될 수 있음

```tsx
type Container<T> = { value: T };
```

📌 프로퍼티 안에서 자기 자신을 참조하는 타입 별칭을 가질 수 있음

```tsx
type Tree<T> = {
  value: T;
  left: Tree<T>;
  right: Tree<T>;
};
```

📌 교차 타입과도 같이 사용 가능

```tsx
type LinkedList<T> = T & { next: LinkedList<T> };

interface Person {
  name: string;
}

var people!: LinkedList<Person>;
var s = people.name;
var s = people.next.name;
var s = people.next.next.name;
var s = people.next.next.next.name;
```

## 문자열 리터럴 타입(String literal types)

```tsx
type Easing = "ease-in" | "ease-out" | "ease-in-out";
class UIElement {
  animate(dx: number, dy: number, easing: Easing) {
    if (easing === "ease-in") {
      // ...
    } else if (easing === "ease-out") {
    } else if (easing === "ease-in-out") {
    } else {
      // 에러 발생시킬 것. null이나 undefined를 전달하면 안됨
    }
  }
}

let button = new UIElement();
button.animate(0, 0, "ease-in");
button.animate(0, 0, "uneasy"); // ❌ error
```

📌 문자열 리터럴 타입은 오버로드를 구별하기 위해서도 사용 가능

```tsx
function createElement(tagName: "img"): HTMLImageElement;
function createElement(tagName: "input"): HTMLInputElement;
function createElement(tagName: string): Element {
  // ...
}
```

## 숫자 리터럴 타입(Numeric literal types)

```tsx
function rollDice(): 1 | 2 | 3 | 4 | 5 | 6 {
  // ...
}
```

## 열거형 멤버 타입(Enum member types)

📌 열거형 멤버는 모든 멤버가 리터럴로 초기화될 때 타입을 가짐

## 판별 유니언(Discriminated unions)

판별 유니언이 되는 세 가지 요소

1. 공통 싱글톤 타입 프로퍼티를 갖는 타입 — 판별식
2. 해당 타입들의 유니언을 갖는 타입 별칭 — 유니언
3. 공통 프로퍼티의 타입 가드

```tsx
interface Square {
  kind: "square";
  size: number;
}
interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}
interface Circle {
  kind: "circle";
  radius: number;
}

type Shape = Square | Rectangle | Circle;

function area(s: Shape) {
  switch (s.kind) {
    case "square":
      return s.size * s.size;
    case "rectangle":
      return s.height * s.width;
    case "circle":
      return Math.PI * s.radius ** 2;
  }
}
```

## 다형성 `this` 타입(Polymorphic `this` types)

```tsx
class BasicCalculator {
  public constructor(protected value: number = 0) {}
  public currentValue(): number {
    return this.value;
  }
  public add(operand: number): this {
    this.value += operand;
    return this;
  }
  public multiply(operand: number): this {
    this.value *= operand;
    return this;
  }
  // ... 다른 연산들은 여기에 작성 ...
}

class ScientificCalculator extends BasicCalculator {
  public constructor(value = 0) {
    super(value);
  }
  public sin() {
    this.value = Math.sin(this.value);
    return this;
  }
  // ... 다른 연산들은 여기에 작성 ...
}

let v = new ScientificCalculator(2)
  .multiply(5)
  .sin()
  .add(1)
  .currentValue();
```

## 인덱스 타입(Index types)

📌 인덱스 타입을 사용하면, 동적인 프로퍼티 이름을 사용하는 코드를 컴파일러가 검사 가능

📌 인덱스 타입 쿼리 연산자(ex `keyof T`)

📌 인덱스 접근 연산자(ex `T[K]`)

```tsx
function pluck<T, K extends keyof T>(o: T, propertyNames: K[]): T[K][] {
  return propertyNames.map((n) => o[n]);
}

interface Car {
  manufacturer: string;
  model: string;
  year: number;
}
let taxi: Car = {
  manufacturer: "Toyota",
  model: "Camry",
  year: 2014,
};

// let makeAndModel: string[]
let makeAndModel: string[] = pluck(taxi, ["manufacturer", "model"]);

// let modelYear: (string | number)[]
let modelYear = pluck(taxi, ["model", "year"]);
```

## 인덱스 타입과 인덱스 시그니처(Index types and index signatures)

인덱스 시그니처 매개변수 타입은 string 혹은 number 이어야 함

```tsx
interface Dictionary<T> {
  [key: number]: T;
}
let keys: keyof Dictionary<number>; // 숫자
let value: Dictionary<number>["foo"]; // ❌ error, 프로퍼티 'foo'는 타입 'Dictionary<number>'에 존재하지 않습니다.
let value2: Dictionary<number>[42]; // 숫자
```

## 매핑 타입(Mapped types)

📌 선택적 프로퍼티와 읽기전용 프로퍼티

```tsx
interface PersonPartial {
  name?: string;
  age?: number;
}
interface PersonReadonly {
  readonly name: string;
  readonly age: number;
}
```

📌 매핑 타입을 기반으로 모든 프로퍼티를 `readonly` 혹은 선택적 프로퍼티로 만들 수 있음

```tsx
interface Person {
  name: string;
  age: number;
}
/*
// 타입 T의 프로퍼티 키 값에 해당하는 P를 전부 readonly 형태로 감싸 리턴
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};
type Partial<T> = {
    [P in keyof T]?: T[P];
};
*/
type PersonPartial = Partial<Person>;
type ReadonlyPerson = Readonly<Person>;
```

📌 멤버를 추가하고 싶다면 교차타입을 사용할 수 있음

```tsx
// Use this:
type PartialWithNewMember<T> = {
  [P in keyof T]?: T[P];
} & { newMember: boolean };

// don't use this:
/*
type PartialWithNewMember<T> = {
    [P in keyof T]?: T[P];
    newMember: boolean;
}
*/
```

📌 그 외의 매핑 타입

```tsx
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
type Record<K extends keyof any, T> = {
  [P in K]: T;
};
```

### 매핑 타입의 추론(Inference from mapped types)

📌 아래의 언래핑(upwrap) 추론은 동형 매핑된 타입에만 동작함

📌 만약 매핑 타입이 동형이 아니면(ex - `Record`) 언래핑 함수에 명시적인 타입 매개변수를 주어야 함

```tsx
type Proxy<T> = {
  get(): T;
  set(value: T): void;
};
type Proxify<T> = {
  [P in keyof T]: Proxy<T[P]>;
};

function unproxify<T>(t: Proxify<T>): T {
  let result = {} as T;
  for (const k in t) {
    result[k] = t[k].get();
  }
  return result;
}

let originalProps = unproxify(proxyProps);
```

## 조건부 타입(Conditional types)

📌 조건부 타입: 타입 관계 검사로 표현된 조건에 따라 두 가지 가능한 타입 중 하나를 선택함

```tsx
// T가 U에 할당될수 있으면 타입은 X가 되고 그렇지 않다면 타입이 Y가 됨을 의미
T extends U ? X : Y
```

📌 조건부 타입 `T extends U ? X : Y` 는 `X` 나 `Y` 로 결정되거나, `지연`됨

```tsx
interface Foo {
  propA: boolean;
  propB: boolean;
}

declare function f<T>(x: T): T extends Foo ? string : number;

function foo<U>(x: U) {
  // 'U extends Foo ? string : number' 타입을 가지고 있음
  // a는 아직 분기를 선택하지 못함
  let a = f(x);

  // 이 할당은 허용됨!
  let b: string | number = a;
}
```

### 분산 조건부 타입(Distributive conditional types)

📌 분산 조건부 타입: 검사된 타입이 벗겨진(naked) 타입 매개변수인 조건부 타입

📌 분산 조건부 타입은 인스턴스화 중에 자동으로 유니언 타입으로 분산됨

📌 예를 들어, `T`에 대한 타입 인수 `A | B | C`를 사용하여 `T extends U ? X : Y` 를 인스턴스화하면 `(A extends U ? X : Y) | (B extends U ? X : Y) | (C extends U ? X : Y)` 로 결정됨

```tsx
type BoxedValue<T> = { value: T };
type BoxedArray<T> = { array: T[] };
type Boxed<T> = T extends any[] ? BoxedArray<T[number]> : BoxedValue<T>;

type T20 = Boxed<string>; // BoxedValue<string>;
type T21 = Boxed<number[]>; // BoxedArray<number>;
type T22 = Boxed<string | number[]>; // BoxedValue<string> | BoxedArray<number>;
```

### 조건부 타입의 타입 추론(Type inference in conditional types)

📌 아래의 예제에서 함수 타입 `T`의 리턴 타입을 추론할 수 있다면 추론된 `R`이라는 타입을 리턴하고, 할 수 없다면 `any`를 리턴하게 만듦

```tsx
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
```

### 미리 정의된 조건부 타입(Predefined conditional types)

- `Exclude<T, U>` — `U`에 할당할 수 있는 타입은 `T`에서 제외
- `Extract<T, U>` — `U`에 할당할 수 있는 타입을 `T`에서 추출
- `NonNullable<T>` — `T`에서 `null`과 `undefined`를 제외
- `ReturnType<T>` — 함수 타입의 반환 타입을 얻기
- `InstanceType<T>` — 생성자 함수 타입의 인스턴스 타입을 얻기

```tsx
type T00 = Exclude<"a" | "b" | "c" | "d", "a" | "c" | "f">; // "b" | "d"
type T01 = Extract<"a" | "b" | "c" | "d", "a" | "c" | "f">; // "a" | "c"

type T02 = Exclude<string | number | (() => void), Function>; // string | number
type T03 = Extract<string | number | (() => void), Function>; // () => void

type T04 = NonNullable<string | number | undefined>; // string | number
type T05 = NonNullable<(() => string) | string[] | null | undefined>; // (() => string) | string[]

function f1(s: string) {
  return { a: 1, b: s };
}

class C {
  x = 0;
  y = 0;
}

type T10 = ReturnType<() => string>; // string
type T11 = ReturnType<(s: string) => void>; // void
type T12 = ReturnType<<T>() => T>; // {}
type T13 = ReturnType<<T extends U, U extends number[]>() => T>; // number[]
type T14 = ReturnType<typeof f1>; // { a: number, b: string }
type T15 = ReturnType<any>; // any
type T16 = ReturnType<never>; // never
type T17 = ReturnType<string>; // 오류
type T18 = ReturnType<Function>; // 오류

type T20 = InstanceType<typeof C>; // C
type T21 = InstanceType<any>; // any
type T22 = InstanceType<never>; // never
type T23 = InstanceType<string>; // 오류
type T24 = InstanceType<Function>; // 오류
```

> 참고자료 출처<br/>[해리의유목코딩 - Typescript 유틸리티 클래스 파헤치기](https://medium.com/harrythegreat/typescript-%EC%9C%A0%ED%8B%B8%EB%A6%AC%ED%8B%B0-%ED%81%B4%EB%9E%98%EC%8A%A4-%ED%8C%8C%ED%97%A4%EC%B9%98%EA%B8%B0-7ae8a786fb20)<br/>[HEROPY Tech - 한눈에 보는 타입스크립트(updated)](https://heropy.blog/2020/01/27/typescript/)<br/>[Typescript-Handbook-ko - Advanced Types](https://typescript-handbook-ko.org/pages/advanced-types.html)
