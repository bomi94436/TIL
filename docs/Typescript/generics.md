# 제네릭

<div style="text-align: right">2020.12.20</div>

📌 제네릭은 단일 타입이 아닌 다양한 타입에서 작동하는 컴포넌트를 작성할 수 있도록 함

📌 함수나 클래스의 선언 시점이 아닌, 사용 시점에 타입을 선언할 수 있는 방법을 제공

```tsx
// 제네릭이 없다면, identity 함수에 특정 타입을 주어야 함
function identity(arg: number): number {
  return arg;
}

// any를 사용하면 반환타입이 어떤 타입인지에 대한 정보를 잃게 됨
function identity(arg: any): any {
  return arg;
}

// 제네릭을 사용함으로써 타입 변수로서 사용
//                 ^^^^^^^
// 인수의 타입을 캡처
function identity<T>(arg: T): T {
  return arg;
}

// 화살표 함수일 때
const identity = <T>(arg: T): T => {
  return arg;
};
```

- 제네릭 함수의 호출방법

```tsx
// 방법1: 함수에 타입 인수를 포함한 모든 인수를 전달
let output = identity<string>("myString");

// 방법2: 타입 인수 추론 사용
let output = identity("myString");
```

## 제네릭 타입 변수 작업(Working with generic type variables)

- 제네릭을 사용한 매개변수를 배열로서 사용하고 싶을 때

```tsx
// 방법1
function loggingIdentity<T>(arg: T[]): T[] {
  console.log(arg.length);
  return arg;
}

// 방법2
function loggingIdentity<T>(arg: Array<T>): Array<T> {
  console.log(arg.length);
  return arg;
}
```

## 제네릭 타입(Generic types)

- 제네릭 함수의 타입

```tsx
let myIdentity: <T>(arg: T) => T = (arg) => {
  return arg;
};
```

- 제네릭 타입 매개변수에 다른 이름을 사용할 수도 있음

```tsx
function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: <U>(arg: U) => U = identity;
```

- 제네릭 타입을 객체 리터럴 타입의 함수 호출 시그니처로 작성할 수도 있음

```tsx
function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: { <T>(arg: T): T } = identity;
```

```tsx
interface GenericIdentityFn<T> {
  (arg: T): T;
}

function identity<T>(arg: T): T {
  return arg;
}
// number로 타입지정
let myIdentity: GenericIdentityFn<number> = identity;
```

## 제네릭 클래스(Generic classes)

📌 제네릭 클래스는 정적 측면이 아닌 인스턴스 측면에서만 제네릭임

📌 클래스로 작업할 때 정적 멤버는 클래스의 타입 매개변수를 쓸 수 없음

```tsx
class GenericNumber<T> {
  zeroValue!: T;
  add!: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) {
  return x + y;
};
```

## 제네릭 제약조건(Generic constraints)

📌 특정 타입들로만 동작하는 제네릭 함수를 만들고 싶을 수 있음

```tsx
function loggingIdentity<T>(arg: T): T {
  console.log(arg.length); // ❌ error. T에는 .length가 없음
  return arg;
}
```

📌 T가 무엇이 될 수 있는지에 대한 제약조건을 인터페이스에 나열

```tsx
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

loggingIdentity({ length: 10, value: 3 });
```

### 제네릭 제약조건에서 타입 매개변수 사용(Using type parameters in generic constraints)

📌 `extends` 키워드를 사용함으로써 타입변수에 제약 조건을 추가할 수 있음

```tsx
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a"); // OK
getProperty(x, "m"); // ❌ error. 인수의 타입 'm' 은 'a' | 'b' | 'c' | 'd'에 해당되지 않음
```

```tsx
type U = string | number | boolean;

type MyType<T extends U> = string | T;

interface IUser<T extends U> {
  name: string;
  age: T;
}
```

### 제네릭에서 클래스 타입 사용(Using class types in generics)

📌 제네릭을 사용하면서 클래스 팩토리를 생성할 때는 생성자 함수로 클래스 타입을 참조해야 함

```tsx
function create<T>(c: { new (): T }): T {
  return new c();
}
```

```tsx
interface AnimalInterface {
  name: string;
}

interface AnimalConstructor<T> {
  new (name: string): T;
}

function create<T>(c: AnimalConstructor<T>, name: string): T {
  return new c(name);
}

class Animal implements AnimalInterface {
  constructor(public name: string) {}
}

let cat = create<AnimalInterface>(Animal, "Cat");
console.log(cat.name);
```

> 참고자료 출처<br/>[Typescript-Handbook-ko - Generics](https://typescript-handbook-ko.org/pages/generics.html)<br/>[HEROPY Tech - 한눈에 보는 타입스크립트(updated)](https://heropy.blog/2020/01/27/typescript/)
