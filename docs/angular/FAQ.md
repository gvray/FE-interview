---
sidebar_position: 2
---
# FAQ?

## Angular中组件之间通信的方式

Angular 中组件通信可以按照组件之间的层级关系分为：**父→子**、**子→父**、**跨层级 / 无关系组件**。下面分别介绍常用的几种方式。

**1. 父组件 → 子组件：`@Input()` 输入属性**

父组件通过属性绑定把数据传给子组件，子组件用 `@Input()` 接收。

```ts
// child.component.ts
import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-child',
  template: `<p>姓名：{{ name }}</p>`,
})
export class ChildComponent {
  @Input() name!: string;
}

// parent.component.ts
@Component({
  template: `<app-child [name]="parentName"></app-child>`,
})
export class ParentComponent {
  parentName = 'Angular';
}
```

可通过 `@Input()` 的 setter 或 `ngOnChanges` 监听变化。

**2. 子组件 → 父组件：`@Output()` + `EventEmitter`**

子组件通过自定义事件向父组件抛数据，父组件用事件绑定接收。

```ts
export class ChildComponent {
  @Output() clicked = new EventEmitter<string>();
  onClick() { this.clicked.emit('hello'); }
}

@Component({ template: `<app-child (clicked)="onChild($event)"></app-child>` })
export class ParentComponent {
  onChild(msg: string) { console.log(msg); }
}
```

**3. 父组件 → 子组件：`@ViewChild` / `@ViewChildren`**

父组件可在视图初始化后直接拿到子组件实例，调用其方法或读取属性。

```ts
export class ParentComponent implements AfterViewInit {
  @ViewChild(ChildComponent) child!: ChildComponent;
  ngAfterViewInit() { this.child.someMethod(); }
}
```

**4. 跨层级 / 无关系组件：共享 Service**

借助单例 Service + RxJS 的 `BehaviorSubject` 作为事件总线实现双向通信。

```ts
@Injectable({ providedIn: 'root' })
export class MessageService {
  private subject = new BehaviorSubject<string>('');
  current$ = this.subject.asObservable();
  send(msg: string) { this.subject.next(msg); }
}

// 组件 A 注入并订阅
constructor(private msg: MessageService) {
  this.msg.current$.subscribe(m => console.log(m));
}
// 组件 B 发送
this.msg.send('hi');
```

**5. 投影内容通信：`@ContentChild` / `@ContentChildren`**

用于访问通过 `<ng-content>` 投影进来的子元素。

**6. 其他方式**

- 模板引用变量：模板内通过 `#ref` 直接访问子组件。
- 路由参数：`ActivatedRoute` / `Router` 在路由间传递数据。
- `NgRx`：基于 Redux 模式的全局状态管理，适合大型应用。
- `localStorage` / `sessionStorage`：跨会话持久化数据。

## Angular的八大组成部分并简单描述

Angular 框架由以下八个核心概念组成，它们共同构建起完整的应用体系：

| 概念 | 描述 |
| --- | --- |
| **模块 (Module / NgModule)** | 通过 `@NgModule` 装饰器组织组件、指令、管道、服务等，是 Angular 应用的基本组织单元。每个应用至少有一个根模块 `AppModule`。 |
| **组件 (Component)** | 通过 `@Component` 装饰器定义，由模板 + 样式 + 逻辑类组成，是 UI 的基本构建块。 |
| **模板 (Template)** | 基于 HTML 扩展的视图描述，支持插值 `{{ }}`、属性绑定、事件绑定、双向绑定及指令等语法。 |
| **指令 (Directive)** | 用于扩展 DOM 行为，分为结构型指令（`*ngIf`、`*ngFor`、`*ngSwitch`）、属性型指令（`ngClass`、`ngStyle`）和组件型指令。 |
| **管道 (Pipe)** | 在模板中对数据进行转换，如 `date`、`uppercase`、`currency`、`async`、`json` 等，也可自定义。 |
| **服务 (Service)** | 通过 `@Injectable` 装饰器封装业务逻辑、数据访问、工具函数等，是依赖注入的载体。 |
| **依赖注入 (DI)** | 通过注入器 (Injector) 与 Provider 实现松耦合，支持分层注入、`providedIn` 配置。 |
| **路由 (Router)** | 通过路径配置实现组件切换、懒加载、路由守卫、嵌套路由等。 |

```ts
// 模块示例
@NgModule({
  declarations: [AppComponent, HeaderComponent, HighlightDirective],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule],
  providers: [UserService],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

这八个部分相互协作：模块组织应用结构，组件 + 模板 + 指令 + 管道构成视图层，服务 + DI 处理业务与数据，路由负责页面跳转与拆分。

## Angular中常见的生命周期的钩子函数?

Angular 组件从创建、变更检测到销毁，会按顺序触发一系列生命周期钩子。实现对应接口（可选）即可在对应阶段执行逻辑。

| 钩子函数 | 调用时机 | 典型用途 |
| --- | --- | --- |
| `ngOnChanges` | 输入属性 `@Input()` 绑定值变化时调用，首次在 `ngOnInit` 之前调用一次 | 监听输入变化并响应 |
| `ngOnInit` | 输入属性首次设置完成后调用一次 | 初始化数据、发起 HTTP 请求 |
| `ngDoCheck` | 每次变更检测周期调用 | 自定义变更检测逻辑 |
| `ngAfterContentInit` | 投影内容 (`ng-content`) 初始化完成后调用一次 | 访问 `@ContentChild` |
| `ngAfterContentChecked` | 投影内容每次变更检测后调用 | 投影内容检测后的操作 |
| `ngAfterViewInit` | 组件视图初始化完成后调用一次 | 访问 `@ViewChild`、操作 DOM |
| `ngAfterViewChecked` | 组件视图每次变更检测后调用 | 视图检测完成后的操作 |
| `ngOnDestroy` | 组件销毁前调用一次 | 取消订阅、清理定时器、释放资源 |

```ts
import {
  Component, OnChanges, OnInit, DoCheck,
  AfterContentInit, AfterContentChecked,
  AfterViewInit, AfterViewChecked, OnDestroy, Input,
} from '@angular/core';

@Component({
  selector: 'app-lifecycle',
  template: `<p>{{ name }}</p>`,
})
export class LifecycleComponent
  implements OnChanges, OnInit, DoCheck,
    AfterContentInit, AfterContentChecked,
    AfterViewInit, AfterViewChecked, OnDestroy {
  @Input() name!: string;

  ngOnChanges() { console.log('ngOnChanges'); }
  ngOnInit()    { console.log('ngOnInit'); }
  ngDoCheck()   { console.log('ngDoCheck'); }
  ngAfterContentInit()    { console.log('ngAfterContentInit'); }
  ngAfterContentChecked() { console.log('ngAfterContentChecked'); }
  ngAfterViewInit()       { console.log('ngAfterViewInit'); }
  ngAfterViewChecked()    { console.log('ngAfterViewChecked'); }
  ngOnDestroy() { console.log('ngOnDestroy'); }
}
```

**调用顺序速记**：`OnChanges → OnInit → DoCheck → AfterContentInit → AfterContentChecked → AfterViewInit → AfterViewChecked → (循环变更检测) → OnDestroy`。实现接口是可选的，Angular 会通过命名约定（方法名匹配）自动调用对应钩子。

## Angular中路由的工作原理

Angular 路由由 `@angular/router` 提供，基于 URL 与组件的映射实现单页应用（SPA）的视图切换。

**1. 路由配置**

通过 `Routes` 数组定义路径到组件的映射，支持动态参数、懒加载、重定向、子路由。

```ts
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'detail/:id', component: DetailComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [{ path: 'users', component: UsersComponent }],
  },
  { path: 'lazy', loadChildren: () => import('./lazy/lazy.module').then(m => m.LazyModule) },
  { path: '**', redirectTo: '' },
];
```

**2. 启用路由**

根模块用 `RouterModule.forRoot(routes)` 注册，子模块用 `forChild(routes)`。

**3. 路由出口与导航**

- `<router-outlet>` 是占位符，匹配的组件会渲染于此。
- 模板中用 `routerLink="/detail/1"` 声明式导航。
- 代码中用 `Router.navigate(['/detail', id])` 或 `navigateByUrl` 编程式导航。
- `ActivatedRoute` 获取参数：`route.snapshot.paramMap.get('id')` 或订阅 `route.params`。

**4. 工作流程**

```
URL 变化
 → Router 解析路径，匹配 Routes
 → 执行路由守卫 (CanLoad / CanActivate / CanActivateChild)
 → 执行 Resolver 预获取数据
 → 激活对应组件，渲染到 <router-outlet>
 → 触发 CanDeactivate（离开旧路由时）
```

**5. 路由守卫 (Guards)**

| 守卫 | 接口 | 作用 |
| --- | --- | --- |
| `CanActivate` | `CanActivateFn` | 判断能否进入该路由 |
| `CanActivateChild` | `CanActivateChildFn` | 判断能否进入子路由 |
| `CanDeactivate` | `CanDeactivateFn<T>` | 判断能否离开该路由（防丢失修改） |
| `Resolve` | `ResolveFn<T>` | 进入前预获取数据 |
| `CanLoad` | `CanLoadFn` | 判断能否加载懒加载模块（已被 `CanMatch` 替代） |

```ts
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isLoggedIn || createUrlTreeToTree(inject(Router), ['/login']);
};
```

**6. 懒加载 (Lazy Loading)**

通过 `loadChildren` 按需加载模块，减小首屏体积，是 Angular 性能优化的关键手段。

## 解释rjx在Angular中的使用场景

> "rjx" 即 **RxJS** (Reactive Extensions for JavaScript)，是基于可观察数据流的异步编程库，是 Angular 的核心依赖之一。

**核心概念**

- `Observable` 可观察对象：数据流的源头
- `Observer` 观察者：通过 `next` / `error` / `complete` 消费数据
- `Subscription` 订阅：可取消
- `Operator` 操作符：`map`、`filter`、`switchMap`、`debounceTime` 等
- `Subject` / `BehaviorSubject`：既是观察者又是可观察对象，常用于事件总线

**1. HTTP 请求**

`HttpClient` 的所有方法都返回 `Observable`，天然支持取消、重试、组合。

```ts
this.http.get<User[]>('/api/users').pipe(
  retry(2),
  catchError(() => of([])),
).subscribe(users => this.users = users);
```

**2. 模板事件与 DOM 事件**

通过 `fromEvent` 把事件转成流，配合防抖、节流。

```ts
fromEvent(document, 'click').pipe(debounceTime(300)).subscribe();
```

**3. 表单响应式**

`FormControl.valueChanges` / `statusChanges` 都是 `Observable`，便于链式处理。

```ts
this.form.get('name')!.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(name => this.http.get(`/api/search?q=${name}`)),
).subscribe();
```

**4. 跨组件通信（事件总线）**

用 `Subject` / `BehaviorSubject` 在无关系组件间共享状态。

```ts
@Injectable({ providedIn: 'root' })
export class NotifyService {
  private subject = new BehaviorSubject<string>('');
  notify$ = this.subject.asObservable();
  send(msg: string) { this.subject.next(msg); }
}
```

**5. 路由参数**

`ActivatedRoute.params` / `queryParams` / `data` 都是 Observable，便于响应参数变化。

```ts
this.route.params.subscribe(params => this.id = params['id']);
```

**6. AsyncPipe 异步管道**

模板中 `| async` 自动订阅并在组件销毁时取消，免去手动管理。

```ts
// component.ts
users$ = this.http.get<User[]>('/api/users');
// template
<div *ngFor="let u of users$ | async">{{ u.name }}</div>
```

**7. 常用操作符**

| 操作符 | 作用 |
| --- | --- |
| `map` | 对流中数据做映射 |
| `filter` | 过滤 |
| `switchMap` | 切换到新流，取消旧订阅（适合搜索框） |
| `mergeMap` | 并发合并 |
| `concatMap` | 顺序执行 |
| `debounceTime` | 防抖 |
| `throttleTime` | 节流 |
| `distinctUntilChanged` | 去重 |
| `takeUntil` | 在指定流发出前自动取消订阅（常用于 `OnDestroy`） |

**8. 避免内存泄漏**

组件销毁前应取消订阅，常用 `takeUntil` 模式：

```ts
private destroy$ = new Subject<void>();
ngOnInit() {
  this.http.get('/api/data').pipe(takeUntil(this.destroy$)).subscribe();
}
ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

## AngularJS 双向绑定原理

> 这里指 **AngularJS 1.x** 的双向绑定，与 Angular (2+) 的实现方式不同。它基于"脏值检查 (Dirty Checking)"。

**核心机制**

**1. 数据 → 视图**

通过 `{{ }}` 插值、`ng-bind`、`ng-model` 等指令，将 `$scope` 上的数据渲染到视图。

**2. 视图 → 数据**

通过 `ng-model` 监听表单元素的 `input` / `change` 事件，把用户输入同步回 `$scope`，二者结合即"双向绑定"。

```html
<input ng-model="user.name">
<p>{{ user.name }}</p>
```

**3. `$watch` 列表**

AngularJS 为每个绑定在 `$scope` 上的表达式注册一个 watcher，包含：

```js
{
  exp: 'user.name',         // 表达式
  fn: function(newVal, oldVal) {},  // 监听函数（更新视图）
  last: 'old value',        // 上次的值，用于比较
}
```

**4. `$digest` 循环（脏值检查）**

当进入 Angular 上下文（DOM 事件、`$http`、`$timeout`、`$apply` 等）时，触发 `$digest`：

1. 遍历所有 watcher，比较 `current` 与 `last`。
2. 若发生变化，调用 listener 更新视图，并标记本次有变化。
3. 由于 listener 可能改变其他 `$scope` 值，需重复上述步骤直到值稳定（无变化）为止。
4. 为防止死循环，最多执行 10 次（TTL），超出报 `infdig` 错误。

**5. `$apply` 触发 `$digest`**

原生事件（如 `setTimeout`、jQuery 事件）不在 Angular 上下文中，需手动调用 `$scope.$apply()` 进入 `$digest`。`ng-model` 等内置指令已自动处理。

```
事件触发 → $apply → $digest 遍历 watchers
   → 比对 last 与 current → 不一致 → listener 更新视图
   → 重复直到稳定 → 结束本轮
```

**6. 性能与缺陷**

- 每个 watcher 都遍历，绑定多时性能下降（官方建议单页 watcher 数 < 2000）。
- 无法自动感知非 Angular 上下文的数据变化，需手动 `$apply`。
- 对数组、对象的深层变化检测成本高，需要借助 `$watch` 的第三个参数或 `.$digest` 的脏检查。
- 一个表达式中若触发新的变更检测循环，可能触发 `infdig`。

**7. 对比 Angular (2+)**

| 项 | AngularJS 1.x | Angular 2+ |
| --- | --- | --- |
| 变更检测 | 脏值检查 `$digest` | Zone.js 拦截异步 API 自动触发 |
| 数据流 | 默认双向（可禁用） | 默认单向，`[(ngModel)]` 显式双向 |
| 性能 | watcher 越多越慢 | 不可变数据 + `OnPush` 策略，引用对比更高效 |
| API | `$scope`、`$apply`、`$watch` | 组件类 + `@Input()` / `@Output()` |

总结：AngularJS 双向绑定 = **数据劫持的 watcher + $digest 脏值循环**，是它响应式 UI 的基础，也是性能瓶颈所在；Angular (2+) 通过 Zone.js + 单向数据流 + OnPush 策略从根上解决了这个问题。
