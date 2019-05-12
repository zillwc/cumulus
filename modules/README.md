## Modules

##### This directory contains all the different modules for automation.  

Each module should be self contained and adhere to the following exposed interface:
```javascript
{
  initialize: function(initializationParameters) { ... },
  execute: function(executionParameters) { ... }
}
```

### Adding a new module
To add a new module, create a new directory within this directory with a self-explantory name. This directory should contain all of the modules' assets and utility functions to avoid exposing any module state. An entry should be added in `configurations.js` file, inside the `availableModules` to indicate whether to load and execute the new module.  

```javascript
// configurations.js
const availableModules = [
  {
    name: 'myNewModule',          // required
    enabled: true,                // optional (default: false)
    initializationParameters: {}, // optional (default: {})
    executionParameters: {},      // optional (default: {})
  },
];
```  

| Field   | Purpose   | Required?   | Default Value   |
|---|---|---|---|
| **name**  | string name of the module. Module must also be contained in a directory with this exact name.  | yes  | `null`  |
| **enabled**  | boolean flag to indicate whether the module should be enabled.  | no  | `false`  |
| **initializationParameters**  | object parameter to send to the `initialize` function during module initialization.  | no  | `{}`  |
| **executionParameters**  | object parameter to send to the `execute` function during module execution.  | no  | `{}`  |

  

