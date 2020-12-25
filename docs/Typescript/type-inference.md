# 타입 추론

<div style="text-align: right">2020.12.25</div>

## 기본(Basic)

📌 typescript에서는 타입 표기가 없는 경우 타입 정보를 제공하기 위해 타입을 추론함

📌 타입 추론은 보통 변수와 멤버를 초기화 할때, 매개변수의 기본값을 설정할 때, 함수의 반환타입을 결정할 때 발생함

```tsx
// let x: number
let x = 3;
```

## 최적 공통 타입(Best common type)

📌 여러 표현식에서 타입 추론이 발생할 때, 해당 표현식의 타입을 사용하여 "최적 공통 타입"을 계산함

```tsx
// let x: (number | null)[]
let x = [0, 1, null];
```

📌 후보 타입들로부터 최적 공통 타입을 선택하기 때문에, 모든 후보 타입을 포함할 수 있는 상위 타입이 존재해도 후보 타입 중 상위 타입이 존재하지 않으면 선택할 수 없음

```tsx
// Animal 타입으로 추론되길 원하지만, 배열 중 Animal 타입의 객체가 없기 때문에
// Animal을 배열 요소 타입으로 추론하지 않음
// let zoo: (Rhino | Elephant | Snake)[]
let zoo = [new Rhino(), new Elephant(), new Snake()];

// let zoo: Animal[]
let zoo: Animal[] = [new Rhino(), new Elephant(), new Snake()];
```

## 문맥상 타이핑(Contextual typing)

📌 typescript에서는 경우에 따라 "다른 방향"에서도 타입을 추론함(= 문맥상 타이핑)

📌 문맥상 타이핑은 표현식의 타입이 해당 위치에 의해 암시될 때 발생함

```tsx
document.addEventListener("click", function(event) {
  console.log(event.button); // OK
});

document.addEventListener("scroll", function(event) {
  console.log(event.button); // ❌ error
});
```

📌 만약 문맥적으로 타입이 추론되지 않는 위치에 있다면, 함수의 인수는 암묵적으로 `any` 타입을 가지며 별도의 오류를 보고하지 않음(`"noImplicitAny": false` 일 때)

```tsx
const handler = function(uiEvent) {
  console.log(uiEvent.button); // OK, undefined
};
```

📌 또는 함수의 인수 타입을 `any` 타입으로 표기하여 재정의할 수 있음

```tsx
const handler = function(uiEvent: any) {
  console.log(uiEvent.button); // OK, undefined
};
```

> 참고자료 출처<br/>[Typescript-Handbook-ko - Type Inference](https://typescript-handbook-ko.org/pages/type-inference.html)<br />[https://www.typescripttutorial.net/typescript-tutorial/typescript-type-inference/](https://www.typescripttutorial.net/typescript-tutorial/typescript-type-inference/)
