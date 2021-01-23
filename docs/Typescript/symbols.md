# 심볼

<div style="text-align: right">2021.01.23</div>

📌 ECMAScript 2015부터, `symbol`은 `number`와 `string`같은 기본 자료형임

📌 `symbol` 값들은 `Symbol` 생성자를 호출해서 생성함

```tsx
let sym1 = Symbol();
let sym2 = Symbol("key"); // 선택적 문자열 키
```

📌 심볼은 불변하며 유일함

```tsx
let sym2 = Symbol("key");
let sym3 = Symbol("key");
sym2 === sym3; // false
```

📌 문자열처럼 심벌은 객체 프로퍼티의 키로 사용될 수 있음

```tsx
const sym = Symbol();
let obj = {
  [sym]: "value",
};

console.log(obj[sym]); // "value"
```

📌 심볼은 계산된 프로퍼티 선언과 결합해 객체 프로퍼티와 클래스 멤버를 선언할 수도 있음

```tsx
const getClassNameSymbol = Symbol();

class C {
  [getClassNameSymbol]() {
    return "C";
  }
}

let c = new C();
let className = c[getClassNameSymbol](); // "C"
```

## 잘 알려진 심볼들(Well-known Symbols)

📌 ECMAScript 6에서 추가됨. 이전에 내부 전용 작업으로 간주되었던 JavaScript의 일반적인 동작을 나타내는 Well-known Symbol이라는 미리 정의된 Symbol임.

- `Symbol.hasInstance`

  : 생성자 객체가 어떤 객체를 생성자의 인스턴스로 인식하는지 확인하는 메서드. 전달된 값이 함수의 인스턴스이면 `true`를 반환함.

  ```tsx
  obj instanceof Array;
  // 위는 아래와 같음
  Array[Symbol.hasInstance](obj);
  ```

- `Symbol.isConcatSpreadable`

  : 객체가 자신의 배열 요소를 `Array.prototype.concat`를 사용하여 직렬로 나타낼 수 있는지를 나타내는 `boolean`값임

  : 다른 말로 객체가 length 프로퍼티와 숫자 키를 가지고 있으며 숫자 프로퍼티 값이 `concat()` 호출의 결과에 개별적으로 추가되어야 함을 나타내는 `boolean`값임

- `Symbol.iterator`

  : 객체의 기본 반복자를 반환하는 메서드. for-of 문으로 호출함.

  : 객체가 `Symbol.iterator` 프로퍼티에 대한 구현을 가지고 있다면 *lterable*로 간주됨

- `Symbol.match`

  : 정규식을 문자열과 비교하는 정규식 메서드

  : `String.prototype.match` 메서드로 호출

- `Symbol.replace`

  : 일치하는 부분 문자열을 대체하는 정규식 메서드

  : `String.prototype.replace` 메서드로 호출

- `Symbol.search`

  : 정규식과 일치하는 문자열의 인덱스를 반환하는 정규식 메서드

  : `String.prototype.search` 메서드로 호출함

- `Symbol.split`

  : 정규식과 일치하는 인덱스들에 위치한 문자열을 분할하는 정규식 메서드

  : `String.prototype.split` 메서드로 호출함

📌 `Symbol.match`, `Symbol.replace`, `Symbol.search`, `Symbol.split` 심볼들이 작동하는 예

```tsx
// effectively equivalent to /^.{10}$/
let hasLengthOf10 = {
  [Symbol.match]: function(value) {
    return value.length === 10 ? [value] : null;
  },
  [Symbol.replace]: function(value, replacement) {
    return value.length === 10 ? replacement : value;
  },
  [Symbol.search]: function(value) {
    return value.length === 10 ? 0 : -1;
  },
  [Symbol.split]: function(value) {
    return value.length === 10 ? ["", ""] : [value];
  },
};

let message1 = "Hello world", // 11 characters
  message2 = "Hello John"; // 10 characters

let match1 = message1.match(hasLengthOf10),
  match2 = message2.match(hasLengthOf10);
console.log(match1); // null
console.log(match2); // ["Hello John"]

let replace1 = message1.replace(hasLengthOf10, "Howdy!"),
  replace2 = message2.replace(hasLengthOf10, "Howdy!");
console.log(replace1); // "Hello world"
console.log(replace2); // "Howdy!"

let search1 = message1.search(hasLengthOf10),
  search2 = message2.search(hasLengthOf10);
console.log(search1); // -1
console.log(search2); // 0

let split1 = message1.split(hasLengthOf10),
  split2 = message2.split(hasLengthOf10);
console.log(split1); // ["Hello world"]
console.log(split2); // ["", ""]
```

- `Symbol.species`

  : 파생된 객체를 만드는 생성자 함수 프로퍼티 값임

- `Symbol.toPrimitive`

  : 객체를 해당 기본 값으로 변환하는 메서드

  : `ToPrimitive` 추상 연산으로 호출함

- `Symbol.toStringTag`

  : 객체의 기본 문자열 설명을 만드는데 사용되는 문자열 값임

  : 내장 메소드 `Object.prototype.toString` 로 호출함

- `Symbol.unscopables`

  : 고유한 프로퍼티 이름들이 연관된 객체의 'with' 환경 바인딩에서 제외된 객체임

Well-known Symbols는 잘 이해가 안된다. 추후에 다시 볼 것 🤔

> 참고자료 출처<br/>[Typescript-Handbook-ko - Symbols](https://typescript-handbook-ko.org/pages/symbols.html)<br/>[개발자의 기록 보관소 - ECMAScript 6 Symbol과 Symbol 프로퍼티](https://infoscis.github.io/2018/01/27/ecmascript-6-symbols-and-symbol-properties/)
