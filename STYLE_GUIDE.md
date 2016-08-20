### Semi-colons

- NOT after import statements.
- NOT after module-level var declarations.
- NOT after curly brackets (except object declaration).
- Probably no semi-colons anywhere at module-level.

### Filename extensions like "*.js" in import statements

- NOT necessary. Leave them out.

### New-lines

- No blank lines between imports and none between var declarations.
- 2 blank lines between module-level functions and classes unless closely related.
- Use a comment line to separate groups further and group name in all caps.

```javascript
        function group1method() {
            ...
        }


        /********** NEXT SECTION DESCRIPTIVE NAME **********/

        function nextGroupMethod() {
            ...
        }
```

### Imports

- Top of module. May separate with blank or comment line to denote types.
- Order not important, but generally follow this:
    - Libraries
    - Components
    - Constants


### PropTypes validation

- Include all props from store and parent, but NOT bound dispatch functions.
