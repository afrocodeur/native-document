# List Rendering

List rendering in NativeDocument provides powerful utilities for efficiently displaying dynamic collections of data. The framework offers two specialized functions: `ForEach` for generic iteration over objects and arrays, and `ForEachArray` for high-performance array-specific operations with advanced optimization features.

## Understanding List Rendering

List rendering automatically manages DOM updates when your data changes. Instead of manually manipulating the DOM, you define how each item should be rendered, and NativeDocument handles creation, updates, reordering, and cleanup efficiently.

```javascript
import { ForEach, Observable, Li, Ul } from 'native-document';

const items = Observable.array(['Apple', 'Banana', 'Cherry']);

// Automatically updates when items change
const itemList = Ul([
    ForEach(items, item => Li(item))
]);

// Add items - DOM updates automatically
items.push('Orange', 'Grape');
```

## ForEach - Generic Collection Rendering

`ForEach` is the versatile option that works with both arrays and objects. It's perfect when you need flexibility or are working with mixed data types.

### Basic Array Iteration

```javascript
const fruits = Observable.array(['Apple', 'Banana', 'Cherry']);

const FruitList = Ul([
    ForEach(fruits, fruit => 
        Li({ class: 'fruit-item' }, fruit)
    )
]);

// All array operations trigger updates
fruits.push('Orange');          // Adds new item
fruits.splice(1, 1);           // Removes 'Banana'
fruits.sort();                 // Reorders items
```

### Object Iteration

```javascript
const userRoles = Observable({
    admin: 'Administrator',
    editor: 'Content Editor', 
    viewer: 'Read Only'
});

const RolesList = Ul([
    ForEach(userRoles, (roleName, roleKey) => 
        Li([
            Strong(roleKey), ': ', roleName
        ])
    )
]);

// Update object - DOM reflects changes
userRoles.set({
    ...userRoles.val(),
    moderator: 'Community Moderator'
});
```

### Using Index Parameter

```javascript
const tasks = Observable.array([
    'Review pull requests',
    'Update documentation',
    'Fix bug reports'
]);

const TaskList = Ol([
    ForEach(tasks, (task, indexObservable) =>
        Li([
            Strong(indexObservable.check(val => val + 1)),
            ' ',
            task,
            Button('Remove').nd.onClick(() =>
                tasks.remove(indexObservable.val())
            )
        ])
    )
]);
```

### Custom Key Functions

Use custom key functions

```javascript
const users = Observable.array([
    { id: 1, name: 'Alice', role: 'admin' },
    { id: 2, name: 'Bob', role: 'user' },
    { id: 3, name: 'Carol', role: 'editor' }
]);

// Use 'id' field as the key for efficient updates
const UserList = Div([
    ForEach(users, 
        user => Div({ class: 'user-card' }, [
            H3(user.name),
            Span({ class: 'role' }, user.role)
        ]),
        'id' // Key function - uses user.id
        // Or (item) => item.id
    )
]);

// When users reorder, DOM nodes are moved, not recreated
users.set((items) => items.sort((a, b) => a.name.localeCompare(b.name)));
```

## ForEachArray - High-Performance Array Rendering

`ForEachArray` is specifically optimized for **arrays of complex objects** and provides superior performance. **Use ForEachArray for object arrays** - it's designed for array-specific operations.

### Why ForEachArray for Complex Arrays?

`ForEachArray` includes optimizations that generic `ForEach` not provide:

- **Specialized diffing algorithm** optimized for array operations
- **Batch DOM updates** for better performance
- **Memory-efficient caching** with WeakMap references
- **Array method detection** for targeted updates (push, splice, sort, etc.)

### Basic Usage

```javascript
const messages = Observable.array([
    { id: 1, text: 'Hello world!', timestamp: Date.now() },
    { id: 2, text: 'How are you?', timestamp: Date.now() + 1000 }
]);

const ChatMessages = Div({ class: 'chat-container' }, [
    ForEachArray(messages, message => 
        Div({ class: 'message' }, [
            Div({ class: 'message-text' }, message.text),
            Div({ class: 'timestamp' }, new Date(message.timestamp).toLocaleTimeString())
        ])
    )
]);

// Optimized array operations
messages.push({ id: 3, text: 'New message!', timestamp: Date.now() });
```

### Advanced Array Operations

`ForEachArray` efficiently handles all array mutations:

```javascript
const playlist = Observable.array([
    { id: 1, title: 'Song One', artist: 'Artist A' },
    { id: 2, title: 'Song Two', artist: 'Artist B' },
    { id: 3, title: 'Song Three', artist: 'Artist C' }
]);

const PlaylistView = Div({ class: 'playlist' }, [
    ForEachArray(playlist, (song, indexObservable) => {

        return Div({ class: 'song-item', style: 'display: flex; align-items: center; column-gap: 10px;' }, [
            Div({ class: 'song-info' }, [
                Strong(indexObservable.get((value) => value + 1)),
                ' - ',
                Strong(song.title),
                Span({ class: 'artist' }, ` by ${song.artist}`)
            ]),
            Div({ class: 'song-controls' }, [
                Button('↑').nd.onClick(() => {
                    const index = indexObservable.$value;
                    if(index > 0) {
                        playlist.swap(index, index-1);
                    }
                }),
                Button('↓').nd.onClick(() => {
                    const index = indexObservable.$value;
                    if(index < playlist.length -1) {
                        playlist.swap(index, index+1);
                    }
                }),
                Button('Remove').nd.onClick(() =>{
                    playlist.remove(indexObservable.$value);
                })
            ])
        ])
    }, 'id'),
    Br,
    Div([
        Button('Push ').nd.onClick(() => {
            playlist.push({ id: 4, title: 'New Song', artist: 'New Artist' });
        }),
        Button('Unshift').nd.onClick(() => {
            playlist.unshift({ id: 0, title: 'First Song', artist: 'First' })
        }),
        Button('Reverse').nd.onClick(() => {
            playlist.reverse()
        }),
        Button('Sort').nd.onClick(() => {
            playlist.sort((a, b) => a.title.localeCompare(b.title))
        })
    ])
]);
```

### Date and Time Filters
```javascript
import { 
    dateEquals, dateBefore, dateAfter, dateBetween,
    timeEquals, timeBefore, timeAfter, timeBetween,
    dateTimeEquals, dateTimeBefore, dateTimeAfter, dateTimeBetween 
} from 'native-document/utils/filters';

const events = Observable.array([
    { name: 'Meeting', date: '2024-03-15' },
    { name: 'Conference', date: '2024-06-20' },
    { name: 'Workshop', date: '2024-09-10' }
]);

// Date filters
const today = Observable(new Date());
const todayEvents = events.where({
    date: dateEquals(today)
});

const futureEvents = events.where({
    date: dateAfter(new Date())
});

const summerEvents = events.where({
    date: dateBetween('2024-06-01', '2024-08-31')
});

// Time filters (ignores date, only checks time)
const morningEvents = events.where({
    date: timeBefore('2024-01-01 12:00:00')
});

const afternoonEvents = events.where({
    date: timeBetween(
        new Date('2024-01-01 13:00:00'),
        new Date('2024-01-01 17:00:00')
    )
});
```

### Custom Filters

Create custom filter logic:
```javascript
import { custom } from 'native-document/utils/filters';

const minRating = Observable(4);

const highRatedProducts = products.where({
    _: custom((product, minRatingValue) => {
        return product.rating >= minRatingValue && product.reviews > 10;
    }, minRating)  // Pass observables as dependencies
});

// Multiple observable dependencies
const searchTerm = Observable('');
const minPrice = Observable(0);

const advancedFilter = products.where({
    _: custom((product, search, price) => {
        const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
        const matchesPrice = product.price >= price;
        const hasDiscount = product.discount > 0;
        
        return matchesSearch && matchesPrice && hasDiscount;
    }, searchTerm, minPrice)
});
```

## Observable Array Utility Methods

### swap() - Reorder Items

Swap two items by their indices:
```javascript
const items = Observable.array(['A', 'B', 'C', 'D']);

// Swap items at index 0 and 2
items.swap(0, 2); // Result: ['C', 'B', 'A', 'D']

// Practical example: Move item up/down
const moveUp = (index) => {
    if (index > 0) {
        items.swap(index, index - 1);
    }
};

const moveDown = (index) => {
    if (index < items.length - 1) {
        items.swap(index, index + 1);
    }
};
```

### removeItem() - Remove by Value

Remove an item by its value (not index):
```javascript
const tags = Observable.array(['javascript', 'react', 'vue', 'angular']);

// Remove by value
tags.removeItem('react'); // Result: ['javascript', 'vue', 'angular']

// Practical example: Remove tag
const TagList = ForEachArray(tags, tag =>
    Span({ class: 'tag' }, [
        tag,
        Button('×').nd.onClick(() => tags.removeItem(tag))
    ]),
    (item) => item
);
```

### isEmpty() - Check if Empty

Check if array is empty:
```javascript
const todos = Observable.array([]);

// Check if empty
console.log(todos.isEmpty()); // true

todos.push({ text: 'New task' });
console.log(todos.isEmpty()); // false

// Practical example: Show empty state
const TodoList = Div([
    ShowIf(todos.check(list => list.isEmpty()),
        Div({ class: 'empty-state' }, 'No todos yet!')
    ),
    ForEachArray(todos, renderTodo, 'id')
]);
```

### clear() - Remove All Items

Clear all items from array:
```javascript
const notifications = Observable.array([...]);

// Clear all notifications
notifications.clear();

// Practical example: Clear all button
Button('Clear All').nd.onClick(() => notifications.clear())
```

### at() - Access Item by Index

Get item at specific index (supports negative indices):
```javascript
const items = Observable.array(['A', 'B', 'C', 'D']);

console.log(items.at(0));   // 'A'
console.log(items.at(-1));  // 'D' (last item)
console.log(items.at(-2));  // 'C' (second to last)
```

### count() - Conditional Count

Count items that match a condition:
```javascript
const tasks = Observable.array([
    { text: 'Task 1', done: true },
    { text: 'Task 2', done: false },
    { text: 'Task 3', done: true }
]);

// Count completed tasks
const completedCount = tasks.count(task => task.done); // 2

// Practical example: Display count
const Stats = Div([
    'Completed: ',
    Observable.computed(() => tasks.count(t => t.done), [tasks]),
    ' / ',
    tasks.check(list => list.length)
]);
```

### merge() - vBatch Add Items

Add multiple items efficiently:
```javascript
const items = Observable.array([1, 2, 3]);

// Add multiple items at once
items.merge([4, 5, 6]); // Result: [1, 2, 3, 4, 5, 6]

// More efficient than multiple push calls
// items.push(4); items.push(5); items.push(6); // Less efficient
````

## Advanced Filtering with where()

The `where()` method creates filtered observable arrays using powerful filter helpers that handle both static values and reactive observables.

### Import Filter Helpers
```javascript
// Direct import of specific helpers
import { equals, greaterThan, between, includes, and, or, not } from 'native-document/utils/filters';

// Or import all filters
import * as Filters from 'native-document/utils/filters';
```

### Basic Filtering with Helpers
```javascript
const products = Observable.array([
    { id: 1, name: 'Phone', price: 599, inStock: true, category: 'electronics' },
    { id: 2, name: 'Laptop', price: 999, inStock: false, category: 'electronics' },
    { id: 3, name: 'Tablet', price: 399, inStock: true, category: 'electronics' },
    { id: 4, name: 'Book', price: 29, inStock: true, category: 'books' }
]);

// Filter by exact value
const inStockProducts = products.where({ 
    inStock: equals(true)
});

// Filter by category
const electronics = products.where({ 
    category: equals('electronics')
});
```

### Reactive Filtering with Observables

Filter helpers work seamlessly with observables - filters update automatically when observables change:
```javascript
const minPrice = Observable(0);
const maxPrice = Observable(1000);
const searchTerm = Observable('');

// Reactive filters using observables
const filteredProducts = products.where({
    price: between(minPrice, maxPrice),  // Updates when minPrice or maxPrice change
    name: includes(searchTerm)            // Updates when searchTerm changes
});

// UI controls
const FiltersUI = Div([
    Input({ 
        type: 'number', 
        placeholder: 'Min price', 
        value: minPrice 
    }),
    Input({ 
        type: 'number', 
        placeholder: 'Max price', 
        value: maxPrice 
    }),
    Input({ 
        placeholder: 'Search products...', 
        value: searchTerm 
    })
]);

// Product list updates automatically
const ProductList = ForEachArray(filteredProducts, product => 
    ProductCard(product)
);
```

### Available Filter Helpers

#### Comparison Filters
```javascript
import { equals, notEquals, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual } from 'native-document/utils/filters';

// Or use shortcuts
import { eq, neq, gt, gte, lt, lte } from 'native-document/utils/filters';

const expensiveProducts = products.where({
    price: gt(500)  // price > 500
});

const affordableProducts = products.where({
    price: lte(100)  // price <= 100
});

const notPhones = products.where({
    name: neq('Phone')  // name !== 'Phone'
});
```

#### Range Filters
```javascript
import { between } from 'native-document/utils/filters';

const midRangeProducts = products.where({
    price: between(200, 800)  // price >= 200 AND price <= 800
});

// With reactive observables
const minPrice = Observable(100);
const maxPrice = Observable(500);

const rangeFiltered = products.where({
    price: between(minPrice, maxPrice)  // Updates when either observable changes
});
```

#### String Filters
```javascript
import { includes, startsWith, endsWith, match } from 'native-document/utils/filters';

// Contains (case-insensitive by default)
const searchResults = products.where({
    name: includes('phone')  // Matches 'Phone', 'PHONE', 'phone', 'Smartphone'
});

// Starts with
const pProducts = products.where({
    name: startsWith('P')  // Phone, Pencil, etc.
});

// Ends with
const bookProducts = products.where({
    name: endsWith('book')  // Textbook, Handbook, etc.
});

// Regex pattern matching
const alphaNumeric = products.where({
    sku: match(/^[A-Z]{3}-\d{3}$/)  // Matches 'ABC-123' pattern
});

// Simple text search (no regex)
const simpleSearch = products.where({
    name: match('lap', false)  // false = not regex, just contains
});
```

#### Array Filters
```javascript
import { inArray, notIn } from 'native-document/utils/filters';

const allowedCategories = Observable.array(['electronics', 'books']);

const filteredByCategory = products.where({
    category: inArray(allowedCategories)  // category in ['electronics', 'books']
});

const excludedCategories = ['clothing', 'food'];
const nonExcluded = products.where({
    category: notIn(excludedCategories)
});
```

#### Empty/Existence Filters
```javascript
import { isEmpty, isNotEmpty } from 'native-document/utils/filters';

const tasks = Observable.array([
    { title: 'Task 1', description: '' },
    { title: 'Task 2', description: 'Details here' }
]);

const tasksWithDescription = tasks.where({
    description: isNotEmpty()  // Has a description
});

const tasksWithoutDescription = tasks.where({
    description: isEmpty()  // Empty or null description
});
```

### Combining Filters with Logic
```javascript
import { and, or, not, equals, gt, lt, gte } from 'native-document/utils/filters';

// AND: All conditions must be true
const premiumElectronics = products.where({
    category: equals('electronics'),
    price: gt(500)
});

// OR: Any condition can be true
const dealsOrPopular = products.where({
    price: or(
        lt(50),           // Price < 50
        gte(1000)         // OR rating >= 1000
    )
});

// NOT: Invert condition
const notInStock = products.where({
    inStock: not(equals(true))  // NOT in stock
});

// Complex combinations
const searchQuery = Observable('');
const selectedCategory = Observable('all');

const complexFilter = products.where({
    category: and(
        or(
            equals('all'),                    // Show all categories
            equals(selectedCategory)          // OR match selected category
        ),
        includes(searchQuery)                 // AND name includes search term
    )
});
```

## Choosing Between ForEach and ForEachArray

### Use ForEachArray When:

✅ **Working with arrays of complex objects**  
✅ **Performance is critical** - Large lists, frequent updates  
✅ **Using array methods** - push, pop, splice, sort, reverse, etc.

```javascript
// Perfect for ForEachArray
const comments = Observable.array([...]);
const CommentList = ForEachArray(comments, comment => CommentComponent(comment));

// Array operations work optimally
comments.push(newComment);

comments.splice(index, 1);

comments.sort((a, b) => b.timestamp - a.timestamp);
```

### Use ForEach When:

✅ **Working with objects** - ForEach is required for object iteration  
✅ **Mixed data types** - When data might be array or object  
✅ **Arrays of primitive values** - string, number, boolean  
✅ **Simple use cases** - Small lists with infrequent updates

## Configuration Options

### ForEach Configuration

`ForEach` accepts an optional configuration object:
```javascript
ForEach(data, callback, key, { shouldKeepItemsInCache: false })
```

**shouldKeepItemsInCache**: When `true`, keeps rendered items in cache even when removed from the list. Useful for frequently toggling items visibility.
```javascript
const items = Observable.array(['A', 'B', 'C']);

// Items stay in cache when removed
const list = ForEach(items, item => Div(item), null, { 
    shouldKeepItemsInCache: true 
});

items.splice(1, 1); // Removes 'B' from DOM but keeps it cached
items.push('B');     // Re-adds 'B' without re-rendering
```

### ForEachArray Configuration

`ForEachArray` accepts a configuration object:
```javascript
ForEachArray(data, callback, { 
    shouldKeepItemsInCache: false
})
```

**shouldKeepItemsInCache**: Same as ForEach - keeps items in cache when removed.

**pushDelay**: Function that returns delay in milliseconds for batch operations. Useful for large datasets.
```javascript
const bigList = Observable.array([]);

const list = ForEachArray(bigList, item => Div(item), {
    pushDelay: (items) => {
        // Add delay for large batches
        return items.length > 100 ? 50 : 0;
    }
});

// Adding 500 items will be throttled
bigList.push(...Array(500).fill().map((_, i) => ({ id: i, text: `Item ${i}` })));
```
## Real-World Examples

### Nested Lists with Mixed Rendering

```javascript
const categories = Observable.array([
    {
        id: 1,
        name: 'Electronics',
        items: Observable.array([
            { id: 101, name: 'Smartphone', price: 599 },
            { id: 102, name: 'Laptop', price: 999 }
        ])
    },
    {
        id: 2, 
        name: 'Books',
        items: Observable.array([
            { id: 201, name: 'JavaScript Guide', price: 29.99 },
            { id: 202, name: 'Design Patterns', price: 39.99 }
        ])
    }
]);

const CategorizedProducts = Div({ class: 'product-categories' }, [
    // Categories use ForEachArray (it's an array)
    ForEachArray(categories, category => 
        Div({ class: 'category' }, [
            H3({ class: 'category-title' }, category.name),
            
            // Items within each category also use ForEachArray
            ForEachArray(category.items,
                item => Div({ class: 'product-item' }, [
                    Span({ class: 'product-name' }, item.name),
                    Span({ class: 'product-price' }, `$${item.price}`),
                    Button('Add to Cart').nd.onClick(() => addToCart(item))
                ]),
            ),
            
            Button('Add Item').nd.onClick(() => {
                const newItem = {
                    id: Date.now(),
                    name: `New ${category.name} Item`,
                    price: Math.floor(Math.random() * 100) + 10
                };
                category.items.push(newItem);
            })
        ])
    )
]);
```

## Performance Best Practices

### 1. Always Use Keys for Complex Objects

```javascript
// ✅ Good: Efficient updates and reordering
ForEachArray(users, user => UserCard(user))
ForEach(tags, tag => TagComponent(tag), 'index')
```

### 2. Choose the Right Function

```javascript
// ✅ Perfect: ForEachArray for complex objects
const users = Observable.array([{id: 1, name: 'Alice'}]);
ForEachArray(users, renderUser, 'id')

// ✅ Correct: ForEach for primitives
const tags = Observable.array(['js', 'css']);
ForEach(tags, renderTag)

// ✅ Correct: ForEach for objects
const config = Observable({theme: 'dark'});
ForEach(config, renderSetting, (item, key) => key)
```

### 3. Use Computed Values for Derived Lists

```javascript
// ✅ Efficient: Computed filtered list
const searchTerm = Observable('');
const filteredItems = Observable.computed(() => 
    allItems.val().filter(item => 
        item.name.toLowerCase().includes(searchTerm.val().toLowerCase())
    ),
    [allItems, searchTerm]
);

ForEachArray(filteredItems, renderItem);

// ❌ Inefficient: Filtering in render
ForEachArray(allItems, item => {
    if (item.name.includes(searchTerm.val())) {
        return renderItem(item);
    }
    return null;
})
```

## Memory Management

Both `ForEach` and `ForEachArray` automatically manage memory:

```javascript
// Cleanup is automatic when observables are garbage collected
let myList = Observable.array([1, 2, 3]);
let listComponent = ForEachArray(myList, item => Div(item));

// When references are lost, cleanup happens automatically
myList = null;
listComponent = null; // Memory will be freed
```

For explicit cleanup:

```javascript
const items = Observable.array([...]);
const listComponent = ForEachArray(items, renderItem);

// Manual cleanup when needed
items.cleanup();
```

## Common Pitfalls and Solutions

### 1. Missing Keys with Complex Objects

```javascript
// ❌ Problem: No key, inefficient updates
ForEachArray(users, user => UserProfile(user))

// ✅ Solution: Use unique key
ForEachArray(users, user => UserProfile(user))
```

### 2. Using ForEach for Complex Arrays

```javascript
// ❌ Suboptimal: Generic ForEach for arrays
ForEach(genericObject, renderItem)

// ✅ Optimal: Specialized ForEachArray for arrays
ForEachArray(arrayData, renderItem)
```

### 3. Modifying Arrays Directly

```javascript
// ❌ Wrong: Direct mutation doesn't trigger updates
items.val().push(newItem);

// ✅ Correct: Use Observable array methods
items.push(newItem);

// ✅ Also correct: Set new array
items.set([...items.val(), newItem]);
```

## Integration with Other Features

### With Conditional Rendering

```javascript
const items = Observable.array([]);
const showEmptyState = items.check(arr => arr.length === 0);

const ItemList = Div([
    ShowIf(showEmptyState, 
        Div({ class: 'empty-state' }, 'No items found')
    ),
    HideIf(showEmptyState,
        ForEachArray(items, item => ItemComponent(item))
    )
]);
```

### With Forms and Validation

```javascript
const formFields = Observable.array([
    { name: 'firstName', label: 'First Name', value: '', required: true },
    { name: 'lastName', label: 'Last Name', value: '', required: true },
    { name: 'email', label: 'Email', value: '', required: true }
]);

const DynamicForm = Form([
    ForEachArray(formFields, field => 
        Div({ class: 'form-group' }, [
            Label(field.label + (field.required ? ' *' : '')),
            Input({ 
                name: field.name,
                value: field.value,
                required: field.required
            }),
            ShowIf(field.error, 
                Div({ class: 'error' }, field.error)
            )
        ])
    ),
    Button({ type: 'submit' }, 'Submit')
]);
```

## Advanced Patterns

### Infinite Scrolling

```javascript
const items = Observable.array([]);
const isLoading = Observable(false);
const hasMore = Observable(true);

const loadMoreItems = async () => {
    if (isLoading.val()) return;
    
    isLoading.set(true);
    try {
        const newItems = await fetchItems(items.val().length);
        if (newItems.length === 0) {
            hasMore.set(false);
        } else {
            items.push(...newItems);
        }
    } finally {
        isLoading.set(false);
    }
};

const InfiniteList = Div([
    ForEachArray(items, item => ItemComponent(item)),
    ShowIf(isLoading, LoadingSpinner()),
    ShowIf(hasMore.check(more => more && !isLoading.val()),
        Button('Load More').nd.onClick(loadMoreItems)
    )
]);

```

### Drag and Drop Reordering

```javascript
const draggableItems = Observable.array([
    { id: 1, text: 'Item 1' },
    { id: 2, text: 'Item 2' },
    { id: 3, text: 'Item 3' }
]);

let draggedIndex = null;

const DraggableList = Div([
    ForEachArray(draggableItems, (item, indexObservable) => 
        Div({ 
            class: 'draggable-item',
            draggable: true
        }, item.text)
        .nd.onDragStart((e) => {
            draggedIndex = indexObservable.val();
        })
        .nd.onDragOver((e) => e.preventDefault())
        .nd.onDrop((e) => {
            e.preventDefault();
            const dropIndex = indexObservable.val();
            if (draggedIndex !== null && draggedIndex !== dropIndex) {
                const items = draggableItems.val();
                const draggedItem = items[draggedIndex];
                
                // Remove from old position
                items.splice(draggedIndex, 1);
                // Insert at new position
                items.splice(dropIndex, 0, draggedItem);
                
                draggableItems.set([...items]);
            }
            draggedIndex = null;
        }),
        'id'
    )
]);
```

## Debugging List Rendering

### Logging Updates

```javascript
const items = Observable.array([]);

// Log all array operations
items.subscribe((newItems, oldItems, operations) => {
    console.log('Array operation:', operations);
    console.log('Old items:', oldItems);
    console.log('New items:', newItems);
});

const DebugList = ForEachArray(items, (item, index) => {
    console.log('Rendering item:', item, 'at index:', index?.val());
    return ItemComponent(item);
});
```

## Next Steps

Now that you understand list rendering, explore these related topics:

- **[Conditional Rendering](conditional-rendering.md)** - Show/hide content dynamically
- **[Routing](routing.md)** - Navigation and URL management
- **[State Management](state-management.md)** - Global state patterns
- **[Lifecycle Events](lifecycle-events.md)** - Lifecycle events
- **[NDElement](native-document-element.md)** - Native Document Element
- **[Extending NDElement](extending-native-document-element.md)** - Custom Methods Guide
- **[Advanced Components](advanced-components.md)** - Template caching and singleton views
- **[Args Validation](validation.md)** - Function Argument Validation
- **[State Management](state-management.md)** - Managing application state
- **[Memory Management](memory-management.md)** - Understanding cleanup and memory

## Utilities

- **[Cache](docs/utils/cache.md)** - Lazy initialization and singleton patterns
- **[NativeFetch](docs/utils/native-fetch.md)** - HTTP client with interceptors
- **[Filters](docs/utils/filters.md)** - Data filtering helpers
