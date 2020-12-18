# 기본 타입

<div style="text-align: right">2020.12.15</div>

## 불리언(`boolean`)

```tsx
let isDone: boolean = false;
```

## 숫자(`number`)

```tsx
let decimal: number = 6;
let binary: number = 0b1010;
let octal: number = 0o744;
let hex: number = 0xf00d;
```

## 문자열(`string`)

```tsx
let color: string = "red";
```

## 배열(`Array`)

```tsx
// 방법 1: 배열 요소들을 나타내는 타입 뒤에 []을 씀
let list: number[] = [1, 2, 3];
let [one, two] = list; // one = 1, two = 2
// 방법 2: 제네릭 배열 타입 사용
let list: Array<number> = [1, 2, 3];
```

- 배열의 읽기 전용

```tsx
let arr1: readonly number[] = [1, 2, 3, 4];
let arr2: ReadonlyArray<number> = [1, 2, 3, 4];
let arr3 = [1, 2, 3, 4] as const;
```

## 튜플(tuple)

📌 배열의 길이가 고정되고 각 요소의 타입이 지정되어 있는 배열 형식

📌 구조분해할당 가능

```tsx
let arr: [string, number] = ["hi", 10];
let [str, num] = arr;
```

- 튜플 타입의 2차원 배열

```tsx
let users: [number, string, boolean][];
// let users: Array<[number, string, boolean]>;

users = [
  [1, "name1", true],
  [2, "name2", true],
  [3, "name3", false],
];
```

- 값으로 타입을 대체 가능

```tsx
let arr: [1, number];
arr = [1, 2];
arr = [2, 2]; // ❌ error
```

📌 튜플의 특징(정해진 타입의 고정된 길이)은 할당할 때에 국한됨

📌 즉, `push`나 `splice`와 같은 배열 함수가 허용됨

📌 읽기전용을 원한다면 배열과 같이 `readonly` 키워드 사용가능

```tsx
let arr: readonly [string, number] = ["hi", 10];
```

## 열거(`enum`)

```tsx
// 숫자 열거형
enum Color {
  Red,
  Green,
  Blue,
} // Red = 0, Green = 1, Blue = 2
let c: Color = Color.Green;
// 문자 열거형
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
```

📌 시작하는 숫자를 수동으로 매길 수 있음

📌 수동으로 설정한 숫자부터 뒤에오는 멤버는 +1 한 값을 가짐

```tsx
enum Color {
  Red = 1,
  Green,
  Blue,
} // Red = 1, Green = 2, Blue = 3
```

📌 숫자 열거형은 역방향 매핑(Reverse Mapping) 가능

```tsx
enum Color {
  Red,
  Green,
  Blue,
}

console.log(Color.Red); // 0
console.log(Color[0]); // Red
```

## `any`

```tsx
let hi: any = "hi";
hi = 10;
hi = ["a", 2, true];
```

## `void`

📌 어떤 타입도 존재할 수 없음을 의미

📌 변수에는 undifined와 null("strictNullChecks": false 일 때만)만 할당 가능

📌 함수에는 반환값이 없을 때 설정

```tsx
let var1: void = null;
let var2: void = undefined;
function func(): void {
  console.log("sth");
}
```

## `null`과 `undefined`

📌 `null`과 `undefined`는 모든타입의 하위타입

```tsx
// "strictNullChecks": false 일 때 모두 OK
let str1: string = null;
let str2: string = undefined;
let und: undefined = null;
let nul: null = undefined;
let any1: any = null;
let any2: any = undefined;
let void1: void = null;
let void2: void = undefined;

// "strictNullChecks": true 일 때
let str1: string = null; // ❌ error
let str2: string = undefined; // ❌ error
let und: undefined = null; // ❌ error
let nul: null = undefined; // ❌ error
let any1: any = null; // OK
let any2: any = undefined; // OK
let void1: void = null; // ❌ error
let void2: void = undefined; // OK
```

## `never`

📌 절대 발생하지 않을 값을 의미

📌 어떠한 타입도 적용할 수 없음(`never` 자신 제외)

```tsx
function error(message: string): never {
  throw new Error(message);
}
```

## 객체(`object`)

📌 원시타입이 아닌 타입

```tsx
let obj: object = {};
let arr: object = [];
let date: object = new Date();
type User1 = {
  name: string;
  age: number;
};
interface User2 {
  name: string;
  age: number;
}

let usr1: User1 = {
  name: "name1",
  age: 1,
};

let usr2: User2 = {
  name: "name2",
  age: 2,
};

// 모두 object
console.log(typeof obj);
console.log(typeof arr);
console.log(typeof date);
console.log(typeof usr1);
console.log(typeof usr2);
```

## 타입 단언(Type assertions)

📌 컴파일러가 가진 정보를 무시하고 프로그래머가 원하는 임의의 타입을 값에 할당하고 싶을 때 사용

📌 프로그래머가 타입스크립트보다 타입에 대해 더 잘 이해하고 있는 상황을 의미

📌 컴파일 단계에서만 타입을 변형시킴

📌 typescript를 JSX와 함께 사용할 때는 `as`만 허용

```tsx
// 방법1: 제네릭(angel bracket) 사용
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;

// 방법2: as 사용
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;
```
