📌 보통 타입 체크를 위해 사용되며 변수, 함수, 클래스에 사용될 수 있음

```tsx
interface LabeledValue {
  label: string;
}

function printLabel(labeledObj: LabeledValue) {
  console.log(labeledObj.label);
}

// 형태가 중요하기 때문에 꼭 파라미터의 타입과 같은 변수로 선언하지 않아도 됨
let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);
```

## 선택적 프로퍼티

📌 필수가 아닌 속성으로 정의 가능

```tsx
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  let newSquare = { color: "white", area: 100 };
  if (config.color) {
    newSquare.color = config.color;
  }
  if (config.width) {
    newSquare.area = config.width * config.width;
  }
  return newSquare;
}

let mySquare = createSquare({ color: "black" });
```

## 읽기전용 프로퍼티(Readonly properties)

📌 할당 이후 값을 변경할 수 없음

```tsx
interface Point {
  readonly x: number;
  readonly y: number;
}
```

배열은 `ReadonlyArray<T>` 타입을 통해 읽기전용 배열 생성 가능

```tsx
let arr: ReadonlyArray<number> = [1, 2, 3];
```

## `readonly` vs `const`

변수에는 `const` 사용, 프로퍼티에는 `readonly` 사용

## 초과 프로퍼티 검사(Exess property check)

📌 만약 객체 리터럴이 대상 타입(target type)이 갖고있지 않은 프로퍼티를 갖고 있으면 에러가 발생

```tsx
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  // ...
}

let mySquare = createSquare({ colour: "red", width: 100 }); // ❌ error
```

- 방법1: 타입 단언 사용

```tsx
let mySquare = createSquare({ colour: "red", width: 100 } as SquareConfig);
```

- 방법2: 문자열 인덱스 서명 추가

```tsx
interface SquareConfig {
  color?: string;
  width?: number;
  [propName: string]: any;
}
```

- 방법3: 객체를 다른 변수에 할당

```tsx
// 공동객체 프로퍼티(width 또는 color)가 없으면 에러남
let squareOptions = { colour: "red", width: 100 };
let mySquare = createSquare(squareOptions);
```

## 함수 타입(Function type)

📌 인터페이스에 호출 서명(call signature)을 전달함으로써 함수의 타입 선언 가능

```tsx
interface SearchFunc {
  (source: string, subString: string): boolean;
}
// type SearchFunc = (source: string, subString: string) => boolean;

const mySearch: SearchFunc = (src, sub) => {
  const result = src.search(sub);
  return result > -1;
};
```

## 인덱서블 타입(Indexable types)

📌 타입을 인덱스로 기술 가능

📌 인덱서블 타입은 인덱스 시그니처(index signature)를 가져야 하며, 인덱스 시그니처는 `number` 혹은 `string`이어야 함

```tsx
interface StringArray1 {
  [index: number]: string; // index signature
}

interface StringArray2 {
  [index: string]: string;
}

let myArray1: StringArray1 = ["Bob", "Fred"];
let myArray2: StringArray1 = {
  0: "Bob",
  1: "Fred",
};
let myArray3: StringArray2 = {
  a: "apple",
  b: "banana",
};

let myStr1: string = myArray1[0];
let myStr2: string = myArray2[0];
let myStr3: string = myArray3["a"]; // myArray3.a
```

📌 문자열 인덱스 시그니처를 사용할 경우, 모든 프로퍼티는 인덱스 시그니처의 반환타입과 같아야 함

```tsx
interface NumberDictionary {
  [index: string]: number;
  length: number;
  name: string; // ❌ error number여야 함
}
```

## 클래스 타입(Class types)

- 기본적인 `interface`를 이용한 `class` 생성

```tsx
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date): void;
}

class Clock implements ClockInterface {
  currentTime: Date = new Date();
  setTime(d: Date) {
    this.currentTime = d;
  }
  constructor(h: number, m: number) {}
}

const clock = new Clock(1, 2);
```

- class의 생성자를 `interface`의 construct signature로 직접 검사할 수 없음

```tsx
interface ClockConstructor {
  new (hour: number, minute: number); // ❌ error
}

class Clock implements ClockConstructor {
  currentTime: Date;
  // 생성자는 static이기 때문에 타입 검사에 포함되지 않음
  // -> construct signature를 직접 적용할 수 없음
  constructor(h: number, m: number) {}
}
```

- 생성함수를 만들어서 `class`의 생성자 간접 검사

```tsx
interface ClockInterface {
  // clock이 가질 속성 또는 함수
  tick(): void;
}

interface ClockConstructor {
  new (hour: number, minute: number): ClockInterface; // construct signature
}

// 생성함수를 이용하여 construct signature를 간접 적용
function createClock(
  ctor: ClockConstructor,
  hour: number,
  minute: number
): ClockInterface {
  // clock class의 생성자를 이용해 clock 인스턴스를 반환
  return new ctor(hour, minute);
}

// 클래스가 인터페이스를 implements할 때, 클래스의 인스턴스만 검사
class DigitalClock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log("beep beep");
  }
}
class AnalogClock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log("tick tock");
  }
}

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);
```

- 위의 좀 더 간단한 방법

```tsx
interface ClockInterface {
  tick(): void;
}

interface ClockConstructor {
  new (hour: number, minute: number): ClockInterface;
}

const Clock: ClockConstructor = class Clock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log("beep beep");
  }
};
```

## 인터페이스 확장(Extending Interfaces)

📌 한 인터페이스의 멤버를 `extends`를 이용하여 다른 인터페이스에 복사할 수 있음

```tsx
interface Shape {
  color: string;
}

interface PenStroke {
  penWidth: number;
}

interface Square extends Shape, PenStroke {
  sideLength: number;
}

let square = {} as Square;
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;
```

## 하이브리드 타입(Hybrid Types)

```tsx
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function getCounter(): Counter {
  let counter = function(start) {
    return "hi";
  } as Counter;
  counter.interval = 123;
  counter.reset = function() {};
  return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```
