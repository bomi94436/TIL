# 이터레이터와 제네레이터

<div style="text-align: right">2021.01.25</div>

📌 객체가 `Symbol.iterator` 프로퍼티에 대한 구현을 가지고 있다면 이터러블로 간주함

📌 `Array`, `Map`, `Set`, `String`, `Int32Array`, `Uint32Array` 등과 같은 일부 내장 타입에는 이미 `Symbol.iterator` 프로퍼티가 구현되어 있음

📌 객체의 Symbol.iterator 함수는 반복할 값 목록을 반환함

## `for..of` 문

📌 `for..of`는 객체의 `Symbol.iterator`프로퍼티를 호출하여, 이터러블 객체를 반복함

```tsx
let someArray = [1, "string", false];

for (let entry of someArray) {
  console.log(entry); // 1, "string", false
}
// console.log(someArray[Symbol.iterator]());
```

## `for..of` vs. `for..in` 문

📌 `for..of` 및 `for..in` 문 모두 목록을 반복함

📌 반복되는 값은 다르지만, `for..in`은 반복되는 객체의 _키_ 목록을 반환하고, `for..of`는 반복되는 객체의 숫자 프로퍼티 _값_ 목록을 반환함

```tsx
let list = [4, 5, 6];

for (let i in list) {
  console.log(i); // "0", "1", "2"
}

for (let i of list) {
  console.log(i); // "4", "5", "6"
}
```

📌 또한, `for..in`은 모든 객체에서 작동함; 객체의 프로퍼티를 검사하는 방법으로 사용됨.

📌 반면에 `for..of`는 이터러블 객체의 값에 주로 관심이 있음. `Map` 및 `Set` 과 같은 내장 객체는 저장된 값에 접근할 수 있는 `Symbol.iterator` 프로퍼티를 구현함

```tsx
let pets = new Set(["Cat", "Dog", "Hamster"]);
pets["species"] = "mammals";

for (let pet in pets) {
  console.log(pet); // "species"
}

for (let pet of pets) {
  console.log(pet); // "Cat", "Dog", "Hamster"
}
```

> 참고자료 출처<br/>[Typescript-Handbook-ko - Iterators and Generators](https://typescript-handbook-ko.org/pages/iterators-and-generators.html)
