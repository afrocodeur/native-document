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
            Strong(indexObservable.get(val => val + 1)),
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
                    if(index < playlist.length()-1) {
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

### Custom Key Functions with ForEachArray

Key functions are crucial for optimal performance with complex objects:

```javascript
const products = Observable.array([
    { sku: 'PHONE-001', name: 'Smartphone', price: 599 },
    { sku: 'LAPTOP-001', name: 'Laptop', price: 999 },
    { sku: 'TABLET-001', name: 'Tablet', price: 399 }
]);

const ProductCatalog = Div({ class: 'catalog' }, [
    ForEachArray(products,
        product => Div({ class: 'product-card' }, [
            H3(product.name),
            Div({ class: 'price' }, `$${product.price}`),
            Div({ class: 'sku' }, `SKU: ${product.sku}`)
        ]),
        'sku'  // Use SKU as key for efficient tracking
    )
]);

```

### Performance Configuration

`ForEachArray` supports performance tuning for large datasets:

```javascript
const bigDataset = Observable.array([...Array(10000)].map((_, i) => ({
    id: i,
    value: `Item ${i}`,
    category: Math.floor(i / 100)
})));

const BigList = Div([
    ForEachArray(bigDataset,
        item => Div({ class: 'list-item' }, [
            Strong(`#${item.id}`), ' - ', item.value
        ]),
        'id', // Key function
        {
            pushDelay: (items) => items.length > 100 ? 50 : 0  // Delay for large additions
        }
    )
]);

// Large additions are automatically throttled
bigDataset.push(...[...Array(500)].map((_, i) => ({
    id: 10000 + i,
    value: `New Item ${i}`,
    category: 999
})));
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
                'id'
            ),
            
            Button('Add Item').nd.onClick(() => {
                const newItem = {
                    id: Date.now(),
                    name: `New ${category.name} Item`,
                    price: Math.floor(Math.random() * 100) + 10
                };
                category.items.push(newItem);
            })
        ]),
        'id'
    )
]);
```

## Performance Best Practices

### 1. Always Use Keys for Complex Objects

```javascript
// ✅ Good: Efficient updates and reordering
ForEachArray(users, user => UserCard(user), 'id')
ForEach(tags, tag => TagComponent(tag), 'index')

// ❌ Poor: Inefficient, may cause unnecessary re-renders  
ForEachArray(users, user => UserCard(user))
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

ForEachArray(filteredItems, renderItem, 'id')

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
ForEachArray(users, user => UserProfile(user), 'id')
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
        ForEachArray(items, item => ItemComponent(item), 'id')
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
        ]),
        'name'
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
    ForEachArray(items, item => ItemComponent(item), 'id'),
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
}, 'id');
```

## Next Steps

Now that you understand list rendering, explore these related topics:

- **[Conditional Rendering](conditional-rendering.md)** - Show/hide content dynamically
- **[State Management](state-management.md)** - Managing application state
- **[Memory Management](memory-management.md)** - Understanding cleanup and memory