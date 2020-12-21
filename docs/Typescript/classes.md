# 클래스

<div style="text-align: right">2020.12.18</div>

- 간단한 예제

```tsx
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return "Hello, " + this.greeting;
  }
}

let greeter = new Greeter("world");
```

## 상속(Inheritance)

📌 클래스는 기초 클래스로부터 프로퍼티와 메서드를 상속받음

📌 `Dog`는 `extends` 키워드를 사용하여 `Animal`이라는 기초 클래스(상위 클래스)로부터 파생된 파생클래스(하위 클래스)임

```tsx
class Animal {
  move(distanceInMeters: number = 0): void {
    console.log(`Animal moved ${distanceInMeters}m.`);
  }
}

class Dog extends Animal {
  bark() {
    console.log("Woof! Woof!");
  }
}

const dog = new Dog();
dog.bark();
dog.move(12);
```

📌 하위 클래스의 생성자는 상위 클래스의 생성자를 실행할 `super()` 를 호출해야 함

📌 하위 클래스의 생성자 내에서 `this`에 있는 프로퍼티에 접근하기 전에 `super()`를 먼저 호출해야 함

```tsx
class Animal {
  name: string;
  constructor(theName: string) {
    this.name = theName;
  }
  move(distanceInMeters: number = 0) {
    console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}

class Snake extends Animal {
  constructor(name: string) {
    super(name);
  }
  move(distanceInMeters = 5) {
    console.log("Slithering...");
    super.move(distanceInMeters);
  }
}

class Horse extends Animal {
  constructor(name: string) {
    super(name);
  }
  move(distanceInMeters = 45) {
    console.log("Galloping...");
    super.move(distanceInMeters);
  }
}

let sam = new Snake("Sammy the Python");
let tom: Animal = new Horse("Tommy the Palomino");

sam.move();
tom.move(34);

// result
/*
Slithering...
Sammy the Python moved 5m.
Galloping...
Tommy the Palomino moved 34m.
*/
```

## `public`, `private` 그리고 `protected` 지정자

### 기본적으로 공개(Public by default)

📌 typescript에서 기본적으로 각 멤버는 `public`임

```tsx
class Animal {
  public name: string;
  public constructor(theName: string) {
    this.name = theName;
  }
  public move(distanceInMeters: number) {
    console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}
```

### ECMAScript 비공개 필드 (ECMAScript Private Fields)

📌 typescript 3.8버전부터 비공개 필드 지원

📌 `private`보다 비공개 필드의 격리를 더욱 잘 보장해줌

📌 비공개 필드를 가진 클래스의 하위 클래스는 필드 이름 중복에 대한 걱정을 하지않아도 됨

```tsx
class C {
  private foo = 10;
}

console.log(new C().foo); // ❌ error
console.log(new C()["foo"]); // OK
```

```tsx
class C {
  #foo = 10;
}

console.log(new C().#foo); // ❌ error
console.log(new C()["#foo"]); // ❌ error
```

### Typescript 의 `private`

📌 클래스 내부에서만 접근 가능

```tsx
class Animal {
  private name: string;
  constructor(theName: string) {
    // 내부에선 접근 가능
    this.name = theName;
  }
}

new Animal("Cat").name; // ❌ error 외부에선 접근 불가능
```

📌 호환된다고 판단되는 두 개의 타입 중 한쪽에서 `private` 또는 `protected` 멤버를 가지고 있다면, 다른 한쪽도 동일한 선언의 `private` 또는 `protected` 멤버를 가지고 있어야 함

```tsx
class Animal {
  private name: string;
  constructor(theName: string) {
    this.name = theName;
  }
}

class Rhino extends Animal {
  constructor() {
    super("Rhino");
  }
}

class Employee {
  private name: string;
  constructor(theName: string) {
    this.name = theName;
  }
}

let animal = new Animal("Goat");
let rhino = new Rhino();
let employee = new Employee("Bob");

animal = rhino;
animal = employee; // ❌ error
```

### Typescript의 `protected`

📌 내 클래스와 파생된 하위 클래스 내부에서만 접근 가능

```tsx
class Person {
  protected name: string;
  constructor(name: string) {
    // 선언된 클래스 내부에서 접근 가능
    this.name = name;
  }
}

class Employee extends Person {
  private department: string;

  constructor(name: string, department: string) {
    super(name);
    this.department = department;
  }

  public getElevatorPitch() {
    // 선언된 클래스의 하위 클래스 내부에서 접근 가능
    return `Hello, my name is ${this.name} and I work in ${this.department}.`;
  }
}

let howard = new Employee("Howard", "Sales");
console.log(howard.getElevatorPitch());
console.log(howard.name); // ❌ error 외부에선 접근 불가능
```

📌 생성자 또한 `protected` 로 선언될 수 있음. 이는 클래스 외부에서 인스턴스화할 수 없지만 확장은 가능하다는 의미임

```tsx
class Person {
  protected name: string;
  protected constructor(theName: string) {
    this.name = theName;
  }
}

class Employee extends Person {
  private department: string;

  constructor(name: string, department: string) {
    // 클래스를 확장하였을 때 생성자 사용 가능(클래스 확장 가능)
    super(name);
    this.department = department;
  }

  public getElevatorPitch() {
    return `Hello, my name is ${this.name} and I work in ${this.department}.`;
  }
}

let howard = new Employee("Howard", "Sales");
// 클래스 외부에선 생성자를 사용할 수 없음(인스턴스를 생성할 수 없음)
let john = new Person("John"); // ❌ error
```

## 읽기전용 지정자(Readonly modifier)

📌 읽기전용 프로퍼티는 선언 시 또는 생성자 내부에서 초기화해야함

```tsx
class Octopus {
  readonly name: string;
  readonly numberOfLegs: number = 8;
  constructor(theName: string) {
    this.name = theName;
  }
}
let dad = new Octopus("Man with the 8 strong legs");
dad.name = "Man with the 3-piece suit"; // ❌ error
```

### 매개변수 프로퍼티(Parameter properties)

📌 클래스 속성의 선언과 할당을 동시에 수행

📌 생성자 매개변수에 접두어로 붙여 선언

📌 종류: `readonly`, `private`, `protected`, `public`

```tsx
class Octopus {
  readonly numberOfLegs: number = 8;
  constructor(readonly name: string) {}
}
```

## 접근자(Accessors)

📌 객체의 멤버에 대한 접근을 가로채는 방식으로 getters/setters 지원

📌 `get`만 선언하고 `set`은 선언하지 않은 속성은 자동으로 `readonly`로 인식됨

```tsx
const fullNameMaxLength = 10;

class Employee {
  // 속성이 undefined여서 문제가 생길 일이 없다고 확신한다면, 속성 이름 뒤에 느낌표(!)를 붙여
  // 확정적 할당 단언(definitive assignment assertion)을 제공할 수 있음
  // 컴파일러는 해당 속성의 초기화 체크를 건너뜀
  private _fullName!: string;

  get fullName(): string {
    return this._fullName;
  }

  set fullName(newName: string) {
    if (newName && newName.length > fullNameMaxLength) {
      throw new Error("fullName has a max length of " + fullNameMaxLength);
    }

    this._fullName = newName;
  }
}

let employee = new Employee();
employee.fullName = "Bob Smith";
if (employee.fullName) {
  console.log(employee.fullName);
}
```

## 전역 프로퍼티(Static properties)

📌 static 키워드를 이용하여 선언

📌 전역 프로퍼티에 접근할 때는 해당 클래스 이름을 앞에 붙임(인스턴스에서 프로퍼티에 접근할 때 `this`를 붙이는 것과 비슷함)

```tsx
class Grid {
  static origin = { x: 0, y: 0 };
  calculateDistanceFromOrigin(point: { x: number; y: number }) {
    let xDist = point.x - Grid.origin.x;
    let yDist = point.y - Grid.origin.y;
    return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
  }
  constructor(public scale: number) {}
}

let grid1 = new Grid(1.0); // 1x scale
let grid2 = new Grid(5.0); // 5x scale

console.log(grid1.calculateDistanceFromOrigin({ x: 10, y: 10 }));
console.log(grid2.calculateDistanceFromOrigin({ x: 10, y: 10 }));
```

## 추상 클래스(Abscract classes)

📌 다른 클래스들이 파생될 수 있는 기초 클래스

📌 추상 클래스는 직접 인스턴스화할 수 없음

📌 인터페이스와 달리 멤버에 대한 구현 세부정보를 포함할 수 있음

📌 `abstract` 키워드는 추상 클래스뿐만 아니라 추상 클래스 내에서 추상 메서드를 정의하는 데에도 사용됨

```tsx
abstract class Animal {
  abstract makeSound(): void;
  move(): void {
    console.log("roaming the earth...");
  }
}
```

📌 추상 클래스 내에서 추상으로 표시된 메서드는 구현을 포함하지 않으며 반드시 파생된 클래스에서 구현되어야 함

📌 추상 메서드를 정의할 때는 반드시 `abstract` 키워드를 포함해야 하며, 선택적으로 접근 지정자를 포함할 수 있음

```tsx
abstract class Department {
  constructor(public name: string) {}

  printName(): void {
    console.log("Department name: " + this.name);
  }

  abstract printMeeting(): void; // 반드시 파생된 클래스에서 구현되어야 함
}

class AccountingDepartment extends Department {
  constructor() {
    super("Accounting and Auditing"); // 파생된 클래스의 생성자는 반드시 super()를 호출해야 함
  }

  printMeeting(): void {
    console.log("The Accounting Department meets each Monday at 10am.");
  }

  generateReports(): void {
    console.log("Generating accounting reports...");
  }
}

let department: Department;
department = new Department(); // error
department = new AccountingDepartment();
department.printName();
department.printMeeting();
department.generateReports(); // error 추상 클래스에 해당 메서드가 없음
```

## 고급 기법(Advanced techniques)

### 생성자 함수(Constructor functions)

📌 클래스의 인스턴스를 new할 때 호출됨

📌 생성자 함수는 클래스의 모든 전역 변수들을 포함하고 있음

```tsx
class Greeter {
  static standardGreeting = "Hello, there";
  greeting!: string;
  greet() {
    if (this.greeting) {
      return "Hello, " + this.greeting;
    } else {
      return Greeter.standardGreeting;
    }
  }
}

let greeter1: Greeter;
greeter1 = new Greeter();
console.log(greeter1.greet()); // "Hello, there"

// typeof Greeter를 사용하여 인스턴스 타입이 아닌 Greeter 클래스 자체의 타입을 제공
// === typeof Greeter를 사용하여 생성자 함수의 타입인 Greeter라는 심볼의 타입을 제공
// Greeter 클래스의 인스턴스를 만드는 생성자와 함께 Greeter의 모든 정적 멤버를 포함함
let greeterMaker: typeof Greeter = Greeter;
greeterMaker.standardGreeting = "Hey there!";

let greeter2: Greeter = new greeterMaker();
console.log(greeter2.greet()); // "Hey there!"
```

### 인터페이스로써 클래스 사용하기(Using a `class` as an `interface`)

📌 클래스는 타입을 생성하기 때문에 인터페이스를 사용할 수 있는 동일한 위치에서 사용할 수 있음

```tsx
class Point {
  x!: number;
  y!: number;
}

interface Point3d extends Point {
  z: number;
}

let point3d: Point3d = { x: 1, y: 2, z: 3 };
```

> 참고자료 출처<br/>[Typescript-Handbook-ko - Classes](https://typescript-handbook-ko.org/pages/classes.html)<br/>[HEROPY Tech - 한눈에 보는 타입스크립트(updated)](https://heropy.blog/2020/01/27/typescript/)
