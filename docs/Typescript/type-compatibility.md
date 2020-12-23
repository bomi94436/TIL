# 타입 호환성

<div style="text-align: right">2020.12.24</div>

📌 typescript의 타입 호환성은 구조적 서브 타이핑(subtyping)을 기반으로 함

📌 구조적 타이핑: 오직 멤버만으로 타입을 관계시키는 방식(↔ 명목적 타이핑(nominal typing))

```tsx
interface Named {
  name: string;
}

class Person {
  name!: string;
}

let p: Named;
// OK, 구조적 타이핑이기 때문
p = new Person();
```

### 건전성에 대한 참고사항(A note on soundness)

📌 typescript의 타입 시스템은 컴파일 시간에 확인할 수 없는 특정 작업("건전"하지 않은 작업)을 안전하게 수행할 수 있음

## 시작하기

📌 typescript의 구조적 타입 시스템의 기본 규칙은 `y`가 최소한 `x`와 동일한 멤버를 가지고 있다면 `x`와 `y`는 호환됨:

```tsx
interface Named {
  name: string;
}

let x: Named;
// y의 추론된 타입: { name: string; location: string; }
let y = { name: "Alice", location: "Seattle" };
x = y; // OK
```

📌 호환성을 검사할 때는 오직 대상 타입의 멤버(아래의 경우엔 `Named`)만 고려됨

```tsx
function greet(n: Named) {
  console.log("Hello, " + n.name);
}
greet(y); // OK
```

## 두 함수 비교(Comparing two functions)

📌 매개변수의 이름은 고려하지 않고 타입만 검사함

📌 아래의 예시의 두 번째 할당에서 `y`는 `x`에 없는 두 번째 필수적인 매개변수를 가지고 있기 때문에 `x`에 `y`를 할당하는 것이 허용되지 않아 오류가 발생함

```tsx
let x = (a: number) => 0;
let y = (b: number, s: string) => 0;

y = x; // OK
x = y; // ❌ error
```

> `y = x`처럼 매개변수를 버리는 것이 허용되는 이유:
> 함수의 추가 매개변수를 무시하는 것이 실제로 javascript에선 일반적이기 때문

📌 타입 시스템은 원본 함수의 반환 타입이 대상 타입의 반환 타입의 하위 타입이 되도록 해야 함

```tsx
let x = () => ({ name: "Alice" });
let y = () => ({ name: "Alice", location: "Seattle" });

x = y; // 성공
y = x; // 오류, x()는 location 프로퍼티가 없습니다.
```

### 함수 매개변수의 Bivariance (Function parameter bibariance)

📌 함수 매개변수의 타입을 비교할 때, 원본 매개변수에 대상 매개변수를 할당하거나 이 반대로 할당할 수 있음(=양변성을 가짐)

```tsx
enum EventType {
  Mouse,
  Keyboard,
}

interface Event {
  timestamp: number;
}
interface MouseEvent extends Event {
  readonly x: number;
  readonly y: number;
}
interface KeyEvent extends Event {
  keyCode: number;
}

function listenEvent(eventType: EventType, handler: (n: Event) => void) {
  /* ... */
}

// 바람직하진 않지만 유용하고 일반적임
listenEvent(EventType.Mouse, (e: MouseEvent) => console.log(e.x + "," + e.y));

// 건전성 측면에서 바람직하지 않은 대안
listenEvent(EventType.Mouse, (e: Event) =>
  console.log((e as MouseEvent).x + "," + (e as MouseEvent).y)
);
listenEvent(EventType.Mouse, ((e: MouseEvent) =>
  console.log(e.x + "," + e.y)) as (e: Event) => void);

// 여전히 허용되지 않음 (명확한 오류). 완전히 호환되지 않는 타입에 적용되는 타입 안전성(Type safety)
listenEvent(EventType.Mouse, (e: number) => console.log(e));
```

📌 `"strictFunctionTypes": false`를 설정하면 `Event` 타입을 가지는 매개변수 자리에 `Event`의 서브타입인 `MouseEvent`를 할당해도 오류가 나지 않음

## 열거형(Enums)

📌 열거형과 숫자는 서로 호환됨

📌 다른 열거형 타입의 열거형 값은 호환되지 않음

```tsx
enum Status {
  Ready,
  Waiting,
}
enum Color {
  Red,
  Blue,
  Green,
}

let stat = Status.Ready;
stat = Color.Green; // ❌ error
```

## 클래스(Classes)

📌 클래스 타입의 두 개의 객체를 비교할 때, 오직 인스턴스 멤버만 비교됨

📌 정적인 멤버와 생성자는 호환성에 영향을 주지 않음

```tsx
class Animal {
  feet!: number;
  constructor(name: string, numFeet: number) {}
}

class Size {
  feet!: number;
  constructor(numFeet: number) {}
}

let a: Animal = new Animal("cat", 1);
let s: Size = new Size(1);

a = s; // OK
s = a; // OK
```

### 클래스의 `private` 멤버와 `protected` 멤버(Private and protected members in classes)

📌 클래스 인스턴스의 호환성을 검사할 때 대상 타입에 `private`나 멤버가 있다면, 원본 타입 또한 동일 클래스에서 비롯된 `private` 멤버가 있어야 함(`protected`도 같음)

📌 따라서 클래스는 상위 클래스와는 호환 가능하지만 같은 형태를 가진 다른 상속 계층 구조의 클래스와는 호환되지 않음

## 제네릭(Generics)

📌 typescript는 구조적 타입 시스템이기 때문에, 타입 매개변수는 멤버의 타입의 일부로 사용할 때 결과 타입에 영향을 줌

타입 인수가 지정된 제네릭 타입은 비-제네릭 타입처럼 동작함

```tsx
interface Empty<T> {}
let x: Empty<number> = {};
let y: Empty<string> = {};

x = y; // OK, y는 x의 구조와 대응하기 때문
```

```tsx
interface NotEmpty<T> {
  data?: T;
}
let x: NotEmpty<number> = {};
let y: NotEmpty<string> = {};

x = y; // 오류, x와 y 는 호환되지 않음
```

```tsx
let identity = function<T>(x: T): T {
  return x;
};

let reverse = function<U>(y: U): U {
  return y;
};

identity = reverse; // 성공, (x: any) => any는  (y: any) => any와 대응하기 때문
```

> 참고자료 출처<br />[Typescript-Handbook-ko - Type Compatibility](https://typescript-handbook-ko.org/pages/type-compatibility.html)<br/>[매일 성장하기 - 공변성과 반공변성은 무엇인가?](https://edykim.com/ko/post/what-is-coercion-and-anticommunism/)
