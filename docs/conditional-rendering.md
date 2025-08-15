# Conditional Rendering

Conditional rendering in NativeDocument allows you to dynamically show, hide, or switch between different pieces of content based on reactive state. Unlike traditional approaches that require manual DOM manipulation, NativeDocument's conditional rendering utilities automatically update the interface when observable values change.

## Understanding Conditional Rendering

All conditional rendering functions in NativeDocument work with Observables and automatically manage DOM updates. When the condition changes, content is efficiently added or removed from the DOM without affecting other elements.

```javascript
import { ShowIf, Button, Div, Observable } from 'native-document';

const isVisible = Observable(false);

// Content automatically appears/disappears based on isVisible
const conditionalContent = ShowIf(isVisible, 'This content toggles!');
```

## ShowIf - Basic Conditional Display

The `ShowIf` function renders content only when the Observable condition is truthy. When false, the content is completely removed from the DOM.

```javascript
const user = Observable({ name: 'Alice', isLoggedIn: false });

const App = Div([
    Button('Login').nd.onClick(() => 
        user.set({ ...user.val(), isLoggedIn: true })
    ),
    Button('Logout').nd.onClick(() => 
        user.set({ ...user.val(), isLoggedIn: false })
    ),
    
    // Shows only when user is logged in
    ShowIf(user.check(u => u.isLoggedIn), 'Welcome back!')
]);
```

### Dynamic Content Generation

Use functions to create content that reflects current observable values:

```javascript
const notifications = Observable.array([]);

const notificationBadge = ShowIf(
    notifications.check(list => list.length > 0),
    () => Span({ class: 'badge' }, `${notifications.val().length} new`)
);

// When notifications change, the badge updates automatically
notifications.push('New message');
```

### Using Observable Checkers

Observable checkers create derived conditions for cleaner code:

```javascript
const temperature = Observable(25);
const isCold = temperature.check(temp => temp < 15);
const isHot = temperature.check(temp => temp > 30);

const WeatherApp = Div([
    Div(['Current temperature: ', temperature, '°C']),
    ShowIf(isCold, Div({ class: 'cold' }, '🧥 It\'s cold! Wear a jacket.')),
    ShowIf(isHot, Div({ class: 'hot' }, '☀️ It\'s hot! Stay hydrated.')),
    Div([
        Button('-').nd.onClick(() => --temperature.$value),
        Button('+').nd.onClick(() => ++temperature.$value),
    ])
]);
```

## HideIf and HideIfNot - Inverse Conditions

These functions provide convenient inverses to `ShowIf`:

```javascript
const isLoading = Observable(true);
const hasData = Observable(false);

const DataDisplay = Div([
    // Hide content while loading
    HideIf(isLoading, Div('Data is ready to display')),
    
    // Show loading message only while loading
    // Equivalent to ShowIf()
    HideIfNot(isLoading, Div({ class: 'spinner' }, 'Loading...')),
]);
```

**Understanding the differences:**
```javascript
const condition = Observable(true);

// These are equivalent:
ShowIf(condition, content)
HideIfNot(condition, content)

// These are equivalent:
HideIf(condition, content)
ShowIf(condition.check(val => !val), content)
```

## Switch - Binary Content Switching

`Switch` efficiently toggles between exactly two pieces of content based on a boolean condition:

```javascript
const isDarkMode = Observable(false);

const ThemeToggle = Div([
    Button('Toggle Theme').nd.onClick(() => isDarkMode.set(!isDarkMode.val())),
    
    Switch(isDarkMode,
        Div({ class: 'dark-indicator' }, '🌙 Dark Mode'),    // when true
        Div({ class: 'light-indicator' }, '☀️ Light Mode')   // when false
    )
]);
```

### Dynamic Switch Content

Functions allow for reactive content that updates with current values:

```javascript
const user = Observable({ name: 'Guest', isAuthenticated: false });

const UserGreeting = Switch(
    user.check(u => u.isAuthenticated),
    () => Div({ class: 'welcome' }, `Welcome back, ${user.val().name}!`),
    () => Div({ class: 'login-prompt' }, 'Please sign in to continue')
);
```

## Match - Multiple Condition Handling

`Match` provides switch-case like functionality for handling multiple states:

```javascript
const requestStatus = Observable('idle');

const StatusDisplay = Match(requestStatus, {
    idle: Div({ class: 'status-idle' }, 'Ready to make request'),
    loading: Div({ class: 'status-loading' }, [
        Span({ class: 'spinner' }),
        ' Loading...'
    ]),
    success: Div({ class: 'status-success' }, '✅ Request completed'),
    error: Div({ class: 'status-error' }, '❌ Request failed'),
    timeout: Div({ class: 'status-timeout' }, '⏰ Request timed out')
});
```

### Dynamic Match Content

Functions in Match provide access to current observable values:

```javascript
const gameState = Observable({ 
    phase: 'menu', 
    score: 0, 
    level: 1 
});

const GameDisplay = Match(gameState.check(state => state.phase), {
    menu: () => Div({ class: 'game-menu' }, [
        H1('Welcome to the Game'),
        Button('Start Game').nd.onClick(() => 
            gameState.set({ ...gameState.val(), phase: 'playing' })
        )
    ]),
    
    playing: () => Div({ class: 'game-ui' }, [
        Div(['Score: ', gameState.check(s => s.score)]),
        Div(['Level: ', gameState.check(s => s.level)]),
        Button('Pause').nd.onClick(() => 
            gameState.set({ ...gameState.val(), phase: 'paused' })
        ),
        Button('Game Over').nd.onClick(() =>
            gameState.set({ ...gameState.val(), phase: 'gameOver' })
        )
    ]),
    
    paused: () => Div({ class: 'game-paused' }, [
        H2('Game Paused'),
        Button('Resume').nd.onClick(() => 
            gameState.set({ ...gameState.val(), phase: 'playing' })
        )
    ]),
    
    gameOver: () => Div({ class: 'game-over' }, [
        H2('Game Over'),
        Div(['Final Score: ', gameState.check(s => s.score)]),
        Button('Play Again').nd.onClick(() => 
            gameState.set({ phase: 'menu', score: 0, level: 1 })
        )
    ])
});
```

### Match with Default Cases

Handle unexpected values with default cases:

```javascript
const userRole = Observable('guest');

const RoleBasedMenu = Match(userRole, {
    admin: AdminMenu(),
    moderator: ModeratorMenu(),
    user: UserMenu(),
    // Default case for unknown roles
    default: GuestMenu()
});
```

## When - Fluent Builder Pattern

`When` provides a chainable interface for conditional rendering:

```javascript
const score = Observable(85);

const GradeDisplay = When(score.check(s => s >= 90))
    .show(() => Div({ class: 'grade-a' }, `Excellent! Score: ${score.val()}`))
    .otherwise(() => Div({ class: 'grade-b' }, `Score: ${score.val()}`));
```

### Complex Conditions with When

```javascript
const user = Observable({ 
    age: 25, 
    hasLicense: true, 
    hasInsurance: false 
});

const DrivingEligibility = When(user.check(u => 
    u.age >= 18 && u.hasLicense && u.hasInsurance
))
.show(() => Div({ class: 'eligible' }, [
    '✅ You can drive legally',
    Div(`Age: ${user.val().age}, License: Yes, Insurance: Yes`)
]))
.otherwise(() => {
    const u = user.val();
    const issues = [];
    if (u.age < 18) issues.push('Must be 18 or older');
    if (!u.hasLicense) issues.push('Need a valid license');
    if (!u.hasInsurance) issues.push('Need insurance coverage');
    
    return Div({ class: 'not-eligible' }, [
        '❌ Cannot drive legally',
        Div(['Issues: ', issues.join(', ')])
    ]);
});
```

## Practical Examples

### Form Validation with Progressive Disclosure

```javascript
const formData = Observable.object({
    email: '',
    password: '',
    confirmPassword: ''
});

const isValidEmail = formData.email.check(e => 
    e.includes('@') && e.includes('.') && e.length > 5
);

const isValidPassword = formData.password.check(p => p.length >= 8);

const passwordsMatch = Observable.computed(() => {
    const data = formData.$value;
    return data.password === data.confirmPassword && data.password.length > 0;
}, [formData.password, formData.confirmPassword]);

const canSubmit = Observable.computed(() => 
    isValidEmail.val() && isValidPassword.val() && passwordsMatch.val(),
    [isValidEmail, isValidPassword, passwordsMatch]
);

const RegistrationForm = Div({ class: 'registration-form' }, [
    // Email field with validation
    Input({ 
        type: 'email', 
        placeholder: 'Email', 
        value: formData.email 
    }),
    ShowIf(formData.email.check(e => e.length > 0 && !isValidEmail.val()),
        Div({ class: 'error' }, 'Please enter a valid email address')
    ),
    
    // Password field
    Input({ 
        type: 'password', 
        placeholder: 'Password', 
        value: formData.password 
    }),
    ShowIf(formData.password.check(p => p.length > 0 && p.length < 8),
        Div({ class: 'error' }, 'Password must be at least 8 characters')
    ),
    
    // Confirm password (only show after password is valid)
    ShowIf(isValidPassword, [
        Input({ 
            type: 'password', 
            placeholder: 'Confirm Password', 
            value: formData.confirmPassword 
        }),
        ShowIf(formData.confirmPassword.check(p => p.length > 0 && !passwordsMatch.val()),
            Div({ class: 'error' }, 'Passwords do not match')
        )
    ]),
    
    // Submit button
    Switch(canSubmit,
        Button('Create Account').nd.onClick(() => {
            console.log('Creating account...', formData.$value);
        }),
        Button({ disabled: true, class: 'disabled' }, 'Create Account')
    )
]);
```

### Progressive User Interface

```javascript
const appState = Observable.object({
    user: null,
    currentView: 'welcome',
    settings: { theme: 'light', notifications: true }
});

const isLoggedIn = appState.user.check(user => user !== null);
const isGuest = appState.user.check(user => user === null);

const App = Div({ class: 'app' }, [
    // Header - changes based on auth state
    Header({ class: 'app-header' }, [
        H1('My App'),
        Switch(isLoggedIn,
            // Authenticated header
            () => Div({ class: 'user-menu' }, [
                Span(['Welcome, ', appState.user.val().name]),
                Button('Settings').nd.onClick(() => 
                    appState.currentView.set('settings')
                ),
                Button('Logout').nd.onClick(() => {
                    appState.user.set(null);
                    appState.currentView.set('welcome');
                })
            ]),
            // Guest header
            Div({ class: 'auth-buttons' }, [
                Button('Sign In').nd.onClick(() => 
                    appState.currentView.set('login')
                ),
                Button('Sign Up').nd.onClick(() => 
                    appState.currentView.set('register')
                )
            ])
        )
    ]),
    
    // Main content area
    Match(appState.currentView, {
        welcome: WelcomeView(),
        login: LoginView(appState),
        register: RegisterView(appState),
        dashboard: When(isLoggedIn)
            .show(() => DashboardView(appState.user.val()))
            .otherwise(() => {
                appState.currentView.set('welcome');
                return Div('Redirecting...');
            }),
        settings: When(isLoggedIn)
            .show(() => SettingsView(appState))
            .otherwise(() => {
                appState.currentView.set('welcome');
                return Div('Please log in to access settings');
            })
    })
]);
```

## Performance Considerations

### Efficient Content Updates

NativeDocument optimizes conditional rendering by only updating the DOM when conditions actually change:

```javascript
const isVisible = Observable(true);

// This content is created once and reused
const expensiveContent = ShowIf(isVisible, () => {
    console.log('Creating expensive content'); // Only called when becoming visible
    return createComplexComponent();
});

// Toggling rapidly won't recreate content unnecessarily
isVisible.set(false);
isVisible.set(true); // Content is recreated
isVisible.set(true); // No recreation, already visible
```

### Memory Management

Functions in conditional rendering are called only when needed, preventing memory waste:

```javascript
const currentTab = Observable('home');

// Heavy components only created when their tab is active
const TabContent = Match(currentTab, {
    home: () => {
        console.log('Creating home tab');
        return HomeTabComponent(); // Only created when needed
    },
    profile: () => {
        console.log('Creating profile tab');
        return ProfileTabComponent(); // Only created when needed
    },
    settings: () => {
        console.log('Creating settings tab');
        return SettingsTabComponent(); // Only created when needed
    }
});
```

### Avoiding Unnecessary Computations

Use Observable.computed for expensive condition calculations:

```javascript
const items = Observable.array([...largeDataset]);
const searchTerm = Observable('');

// Computed once, reused in multiple places
const filteredItems = Observable.computed(() => {
    return items.val().filter(item => 
        item.name.toLowerCase().includes(searchTerm.val().toLowerCase())
    );
}, [items, searchTerm]);

const hasResults = filteredItems.check(results => results.length > 0);

const SearchResults = Div([
    ShowIf(hasResults, () => 
        ForEach(filteredItems, item => ItemComponent(item))
    ),
    HideIf(hasResults, 'No results found')
]);
```

## Best Practices

### 1. Choose the Right Tool

```javascript
// Good: Use ShowIf for simple boolean conditions
ShowIf(isVisible, content)

// Good: Use Switch for binary choices
Switch(isLoggedIn, welcomeMessage, loginPrompt)

// Good: Use Match for multiple states
Match(status, { loading: '...', success: '...', error: '...' })

// Less ideal: Using Match for simple boolean
Match(isVisible, { true: content, false: null })
```

### 2. Use Functions for Dynamic Content

```javascript
// Good: Function creates fresh content with current values
ShowIf(user.check(u => u.isAdmin), 
    () => Div(`Admin: ${user.val().name}`)
)

// Problematic: Static content won't update
ShowIf(user.check(u => u.isAdmin), 
    Div(`Admin: ${user.val().name}`) // Name won't update if user changes
)
```

### 3. Combine Conditions Logically

```javascript
// Good: Use computed observables for complex conditions
const canEdit = Observable.computed(() => {
    const u = user.val();
    const p = post.val();
    return u.isLoggedIn && (u.role === 'admin' || u.id === p.authorId);
}, [user, post]);

ShowIf(canEdit, editButton)

// Less maintainable: Inline complex logic
ShowIf(user.check(u => u.isLoggedIn && u.role === 'admin'), editButton)
```

### 4. Handle Edge Cases Gracefully

```javascript
// Good: Defensive programming
ShowIf(data.check(d => d && d.items && d.items.length > 0),
    () => ForEach(data.val().items, renderItem)
)

// Risky: Might throw errors on null/undefined
ShowIf(data.check(d => d.items.length > 0), content)
```

### 5. Use Meaningful Variable Names

```javascript
// Good: Clear intent
const isUserAuthenticated = user.check(u => u.token !== null);
const hasUnreadMessages = messages.check(m => m.some(msg => !msg.read));

ShowIf(hasUnreadMessages, notificationBadge)

// Less clear: Generic names
const check1 = user.check(u => u.token !== null);
const check2 = messages.check(m => m.some(msg => !msg.read));
```

## Common Patterns

### Loading States with Error Handling

```javascript
const requestState = Observable.object({
    status: 'idle', // idle, loading, success, error
    data: null,
    error: null
});

const DataView = Match(requestState.status, {
    idle: Button('Load Data').nd.onClick(loadData),
    loading: Div({ class: 'loading' }, 'Loading...'),
    success: () => DataDisplay(requestState.data.val()),
    error: () => Div({ class: 'error' }, [
        'Error: ', requestState.error,
        Button('Retry').nd.onClick(loadData)
    ])
});
```

### Feature Flags and Progressive Enhancement

```javascript
const features = Observable.object({
    darkMode: true,
    newDashboard: false,
    betaFeatures: false
});

const App = Div([
    // Theme switching
    Switch(features.darkMode,
        Div({ class: 'app dark-theme' }, content),
        Div({ class: 'app light-theme' }, content)
    ),
    
    // Beta features for power users
    ShowIf(features.betaFeatures, BetaPanel()),
    
    // A/B testing new dashboard
    Switch(features.newDashboard,
        NewDashboard(),
        LegacyDashboard()
    )
]);
```

## Debugging Conditional Rendering

### Using Console Logs in Conditions

```javascript
const debugCondition = condition.check(value => {
    console.log('Condition evaluated:', value);
    return value > 10;
});

ShowIf(debugCondition, content);
```

### Tracking State Changes

```javascript
const status = Observable('idle');

// Log all status changes
status.subscribe(newStatus => {
    console.log('Status changed to:', newStatus);
});

// Debug what content is being rendered
const StatusContent = Match(status, {
    idle: () => {
        console.log('Rendering idle state');
        return IdleComponent();
    },
    loading: () => {
        console.log('Rendering loading state');
        return LoadingComponent();
    }
});
```

## Next Steps

Now that you understand conditional rendering, explore these related topics:

- **[List Rendering](list-rendering.md)** - (ForEach | ForEachArray) and dynamic lists
- **[Routing](routing.md)** - Navigation and URL management
- **[State Management](state-management.md)** - Global state patterns
- **[Lifecycle Events](lifecycle-events.md)** - Lifecycle events
- **[Memory Management](memory-management.md)** - Memory management
- **[Anchor](anchor.md)** - Anchor