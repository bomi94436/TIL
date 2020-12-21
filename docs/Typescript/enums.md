# 열거형

<div style="text-align: right">2020.12.21</div>

📌 열거형(`enum`)으로 이름이 있는 상수들의 집합을 정의할 수 있음

📌 분류

- 열거형: 멤버 타입에 따라

  - 숫자 열거형
  - 문자열 열거형
  - 이종 열거형
  - 유니언 열거형

- 멤버: 멤버 초기화 방식에 따라
  - 계산된 멤버
  - 상수 멤버
    - 리터럴 열거형 멤버
    - 그 외 . . .

## 숫자 열거형(Numeric enums)

📌 한 멤버를 초기화 할 경우, 그 지점부터 뒤따르는 멤버들은 자동으로 `+1` 된 값을 가짐

- 정의

```tsx
enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}

console.log(Direction);
/*
{
  '1': 'Up',
  '2': 'Down',
  '3': 'Left',
  '4': 'Right',
  Up: 1,
  Down: 2,
  Left: 3,
  Right: 4
}
*/
```

- 사용

```tsx
enum ResponseEnum {
  No = 0,
  Yes = 1,
}

function respond(recipient: string, message: ResponseEnum): void {
  // ...
}

respond("Princess Caroline", ResponseEnum.Yes);
```

📌 계산된 멤버와 상수 멤버를 섞어서 사용할 경우, 계산된 멤버 이후에 초기화되지 않은 멤버가 나올 수 없음

```tsx
enum E {
  A, // OK
  B = getSomeValue(), // OK
  C, // ❌ error
  D = 2, // OK
}
```

## 문자열 열거형(String enums)

📌 문자열 열거형을 이용하면 코드를 실행할 때, 열거형 멤버에 지정된 이름과는 무관하게 유의미하고 읽기 좋은 값을 이용하여 실행할 수 있음

```tsx
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

console.log(Direction);
// { Up: 'UP', Down: 'DOWN', Left: 'LEFT', Right: 'RIGHT' }
```

## 이종 열거형(Heterogeneous enums)

📌 권장하지 않는 방식 🤔

```tsx
enum BooleanLikeHeterogeneousEnum {
  No = 0,
  Yes = "YES",
}
```

## 계산된 멤버와 상수 멤버(Computed and constant members)

📌 상수 멤버인 경우

- 열거형의 첫 번째 데이터이며 초기화 값이 없음

  ```tsx
  enum E {
    X,
  }
  ```

- 초기화 값이 없으며 숫자 상수로 초기화된 열거형 멤버 뒤에 따라 나옴

  ```tsx
  enum E1 {
    X,
    Y,
    Z,
  }

  enum E2 {
    A = 1,
    B,
    C,
  }
  ```

- 상수 열거형 표현식으로 초기화 됨. 아래의 경우 상수 열거형 표현식이라고 함:

  - 리터럴 열거형 표현식(기본적으로 문자 리터럴 또는 숫자 리터럴)
  - 이전에 정의된 다른 상수 열거형 멤버에 대한 참조(다른 열거형에서 시작될 수 있음)
  - 괄호로 묶인 상수 열거형 표현식
  - 상수 열거형 표현식에 단항 연산자 `+`, `-`, `~`를 사용한 경우
  - 상수 열거형 표현식을 이중 연산자 `+`, `-`, `*`, `/`, `%`, `<<`, `>>`, `>>>`, `&`, `|`, `^`의 피연산자로 사용할 경우

  > 상수 열거형 표현식 값이 `NaN`이거나 `Infinity`이면 컴파일 시점에서 오류가 남

📌 이외에 다른 모든 경우는 계산된 멤버로 간주함

```tsx
enum FileAccess {
  // 상수 멤버
  None,
  Read = 1 << 1,
  Write = 1 << 2,
  ReadWrite = Read | Write,
  // 계산된 멤버
  G = "123".length,
}
```

## 유니언 열거형과 열거형 멤버 타입(Union enums and enum member types)

📌 열거형의 모든 멤버가 리터럴 열거형 멤버일 경우

- 열거형 멤버를 타입처럼 사용할 수 있음

  ```tsx
  enum ShapeKind {
    Circle,
    Square,
  }

  interface Circle {
    kind: ShapeKind.Circle;
    radius: number;
  }

  interface Square {
    kind: ShapeKind.Square;
    sideLength: number;
  }

  let c: Circle = {
    kind: ShapeKind.Square, // ❌ error
    radius: 100,
  };
  ```

- 열거형 타입 자체가 효율적으로 각각의 열거형 멤버의 유니언이 될 수 있음

  ```tsx
  enum E {
    Foo,
    Bar,
  }

  function f(x: E) {
    if (x !== E.Foo || x !== E.Bar) {
      //             ~~~~~~~~~~~
      // ❌ error. 항상 참을 반환함
    }
  }
  ```

## 런타임에서 열거형(Enums at runtime)

📌 열거형은 런타임에 존재하는 실제 객체임

```tsx
enum E {
  X,
  Y,
  Z,
}

function f(obj: { X: number }) {
  return obj.X;
}

f(E); // OK
```

## 컴파일 시점에서 열거형(Enums at compile time)

📌 `keyof typeof`를 사용하여 모든 열거형의 키를 문자열로 나타내는 타입을 가져옴

```tsx
enum LogLevel {
  ERROR,
  WARN,
  INFO,
  DEBUG,
}

// type LogLevelStrings = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
type LogLevelStrings = keyof typeof LogLevel;

function printImportant(key: LogLevelStrings, message: string) {
  const num = LogLevel[key];
  if (num <= LogLevel.WARN) {
    console.log("Log level key is: ", key);
    console.log("Log level value is: ", num);
    console.log("Log level message is: ", message);
  }
}
printImportant("ERROR", "This is a message");
```

## 역 매핑(Reverse mappings)

📌 숫자 열거형 멤버는 멤버의 프로퍼티 이름을 가진 객체를 생성하는 것 외에도 열거형 값에서 열거형 이름으로 역 매핑을 할 수 있음

```tsx
enum Enum {
  A,
}
let a = Enum.A;
let nameOfA = Enum[a]; // "A"
```

## `const` 열거형(`const` enums)

📌 const 키워드를 사용함으로써 열거형 값에 접근할 때, 추가로 생성된 코드 및 추가적인 간접 참조에 대한 비용을 피할 수 있음

📌 const 열거형은 상수 열거형 표현식만 사용될 수 있음

📌 런타임에선 존재하지만, 컴파일 후에는 존재하지 않음

```tsx
const enum Directions {
    Up,
    Down,
    Left,
    Right,
}

let directions = [
    Directions.Up,
    Directions.Down,
    Directions.Left,
    Directions.Right,
];

/*
let directions = [
    0 /* Up */,
    1 /* Down */,
    2 /* Left */,
    3 /* Right */,
];
*/
```

## Ambient 열거형(Ambient enums)

📌 이미 존재하는 열거형 타입의 모습을 묘사하기 위해 사용됨

📌 ambient 열거형에서 초기화되지 않은 멤버는 항상 계산된 멤버로 간주됨

📌 런타임에서는 존재하지만, 컴파일 후에는 존재하지 않음

📌 `const`나 `declare` 키워드로 정의될 경우, 그 코드들은 컴파일된 코드에 포함되지 않음

```tsx
enum Directions {
  Up,
  Down,
  Left,
  Right,
}

declare enum Directions {
  LeftUp = 5,
  LeftDown = 0,
}

console.log(Directions.LeftUp); // undefined, 에러는 나지않음
```

> 참고자료 출처<br/> [Typescript-Handbook-ko - Enums](https://typescript-handbook-ko.org/pages/enums.html)<br/> [Medium - Introduction to TypeScript Enums — Const and Ambient Enums](https://levelup.gitconnected.com/introduction-to-typescript-enums-const-and-ambient-enums-1fe686b67495)
