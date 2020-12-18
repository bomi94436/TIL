# 함수

<div style="text-align: right">2020.12.19</div>

📌 typescript 함수는 javascript와 같이 기명함수(named function)와 익명함수(anonymous function)로 만들 수 있음

- javascript의 기명함수와 익명함수

```tsx
// 기명 함수
fucntion add(x, y) {
  return x + y;
}

// 익명 함수
let myAdd = function(x, y) { return x + y };
```

## 함수 타입(Function types)

### 함수의 타이핑(Typing the function)

📌 typescript는 반환 문을 보고 반환 타입을 파악할 수 있으므로 반환타입을 생략할 수 있음

```tsx
function add(x: number, y: number): number {
  return x + y;
}

let myAdd = function(x: number, y: number): number {
  return x + y;
};
```

📌 함수의 타입을 지정하기 위해선 매개변수 타입과 반환 타입이 필요

📌 매개변수는 매개변수의 타입들이 올바르게 나열되어 있다면 타입의 매개변수 이름과 실제 함수의 매개변수 이름이 달라도 유효함

```tsx
// 반환값이 없다면 number 자리에 void를 넣음
let myAdd: (baseValue: number, increment: number) => number = function(
  x: number,
  y: number
): number {
  return x + y;
};
```

### 타입의 추론(Inferring the types)

📌 typescript 컴파일러는 방정식의 한쪽에만 타입이 있어도 타입을 알아낼 수 있음

📌 이러한 타입 추론 형태를 "contextual typing"이라 부름

```tsx
// 전체 함수 타입을 지정
let myAdd = function(x: number, y: number): number {
  return x + y;
};

// 함수 타입을 먼저 선언하면 실제 함수의 매개변수와 반환값의 타입이 추론됨
let myAdd2: (baseValue: number, increment: number) => number = function(x, y) {
  return x + y;
};
```

## 선택적 매개변수와 기본 매개변수(Optional and default parameter)

📌 typescript에서는 모든 매개변수가 함수에 필요하다고 가정함

📌 컴파일러는 각 매개변수에 대해 사용자가 값을 제공했는지 검사함

📌 함수에 주어진 매개변수의 수는 함수가 기대하는 매개변수의 수와 일치해야 함

```tsx
function buildName(firstName: string, lastName: string) {
  return firstName + " " + lastName;
}

let result1 = buildName("Bob"); // ❌ error
let result2 = buildName("Bob", "Adams", "Sr."); // ❌ error
let result3 = buildName("Bob", "Adams");
```

📌 선택적 매개변수라면 매개변수의 이름 끝에 `?`를 붙임으로써 해결 가능

```tsx
function buildName(firstName: string, lastName?: string) {
  if (lastName) return firstName + " " + lastName;
  else return firstName;
}

let result1 = buildName("Bob"); // OK
let result2 = buildName("Bob", "Adams", "Sr."); // ❌ error
let result3 = buildName("Bob", "Adams");
```

📌 프로그래머가 값을 제공하지 않거나 undefined로 했을 때엔 매개변수의 기본값을 정함으로써 해결 가능(`기본-초기화 매개변수`라 함)

```tsx
function buildName(firstName: string, lastName = "Smith") {
  return firstName + " " + lastName;
}

let result1 = buildName("Bob"); // Bob Smith
let result2 = buildName("Bob", undefined); // Bob Smith
let result3 = buildName("Bob", "Adams", "Sr."); // ❌ error
let result4 = buildName("Bob", "Adams");
```

📌 모든 필수 매개변수 뒤에 오는 `기본-초기화 매개변수`는 선택적으로 처리되며, 선택적 매개변수와 마찬가지로 해당 함수를 호출할 때 생략 가능함

📌 따라서 아래의 예시는 `(firstName: string, lastName?: string) => string` 라는 공통된 타입을 공유함

```tsx
function buildName(firstName: string, lastName?: string) {
  // ...
}

function buildName(firstName: string, lastName = "Smith") {
  // ...
}
```

📌 순수한 선택적 매개변수와는 다르게 `기본-초기화 매개변수`는 필수 매개변수 뒤에 오는것이 강요되지 않음

📌 기본-초기화 매개변수가 필수 매개변수보다 앞에 오게 된다면 사용자가 명시적으로 `undefined`를 전달해 주어야 `기본-초기화 매개변수`를 볼 수 있음

```tsx
function buildName(firstName = "Will", lastName: string) {
  return firstName + " " + lastName;
}

let result1 = buildName("Bob"); // ❌ error
let result2 = buildName("Bob", "Adams", "Sr."); // ❌ error
let result3 = buildName("Bob", "Adams"); // Bob Adams
let result4 = buildName(undefined, "Adams"); // Will Adams
```

## 나머지 매개변수(Rest parameters)

📌 필수, 선택적, 기본 매개변수는 한 번에 하나의 매개변수만을 가지고 이야기함

📌 typescript에서는 인자들을 하나의 변수로 모을 수 있음

📌 다수의 매개변수를 그룹 지어 작업하기를 원하거나, 함수가 최종적으로 얼마나 많은 매개변수를 취할지 모를 때 사용

📌 나머지 매개변수는 아무것도 넘겨주지 않을 수도 있으며, 원하는 만큼 넘겨 줄 수도 있음

```tsx
// 넘겨받은 나머지 매개변수들은 배열로 사용
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}

// Joseph Samuel Lucas MacKinzie
let employeeName = buildName("Joseph", "Samuel", "Lucas", "MacKinzie");
```

📌 생략부호(`...`)는 나머지 매개변수가 있는 함수의 타입에도 사용됨

```tsx
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}

let buildNameFun: (fname: string, ...rest: string[]) => string = buildName;
```

## this

### `this`와 화살표 함수(`this` and arrow functions)

📌 javascript에서, `this`는 함수가 호출될 때 정해지는 변수

📌 화살표 함수는 함수가 호출된 곳이 아닌 함수가 생성된 쪽의 `this`를 캡처함

```tsx
let deck = {
  suits: ["hearts", "spades", "clubs", "diamonds"],
  cards: Array(52),
  createCardPicker: function() {
    return () => {
      // return function() { 으로할 시 에러 발생
      let pickedCard = Math.floor(Math.random() * 52);
      let pickedSuit = Math.floor(pickedCard / 13);

      return { suit: this.suits[pickedSuit], card: pickedCard % 13 };
    };
  },
};

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();

alert("card: " + pickedCard.card + " of " + pickedCard.suit);
```

### `this` 매개 변수(`this` parameter)

📌 명시적으로 `this` 매개변수를 전달 가능

📌 `this` 매개변수는 함수의 매개변수 목록엣 가장 먼저 나오는 가짜 매개변수임

```tsx
interface Card {
  suit: string;
  card: number;
}
interface Deck {
  suits: string[];
  cards: number[];
  createCardPicker(this: Deck): () => Card;
}
let deck: Deck = {
  suits: ["hearts", "spades", "clubs", "diamonds"],
  cards: Array(52),
  // 아래 함수는 이제 callee가 반드시 Deck 타입이어야 함을 명시적으로 지정함
  createCardPicker: function(this: Deck) {
    return () => {
      let pickedCard = Math.floor(Math.random() * 52);
      let pickedSuit = Math.floor(pickedCard / 13);
      // this: Deck
      return { suit: this.suits[pickedSuit], card: pickedCard % 13 };
    };
  },
};

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();

alert("card: " + pickedCard.card + " of " + pickedCard.suit);
```

## 오버로드(Overloads)

📌 이름은 같지만 매개변수 타입과 반환 타입이 다른 여러 함수를 가질 수 있는 것

```tsx
let suits = ["hearts", "spades", "clubs", "diamonds"];

// 함수 선언
function pickCard(x: { suit: string; card: number }[]): number;
function pickCard(x: number): { suit: string; card: number };
// 함수 구현
function pickCard(x: any): any {
  if (typeof x == "object") {
    let pickedCard = Math.floor(Math.random() * x.length);
    return pickedCard;
  } else if (typeof x == "number") {
    let pickedSuit = Math.floor(x / 13);
    return { suit: suits[pickedSuit], card: x % 13 };
  }
}

let myDeck = [
  { suit: "diamonds", card: 2 },
  { suit: "spades", card: 10 },
  { suit: "hearts", card: 4 },
];
let pickedCard1 = myDeck[pickCard(myDeck)];
alert("card: " + pickedCard1.card + " of " + pickedCard1.suit);

let pickedCard2 = pickCard(15);
alert("card: " + pickedCard2.card + " of " + pickedCard2.suit);
```
