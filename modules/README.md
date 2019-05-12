This directory contains all the different modules for automation.

Each module should be self contained and adhere to the following exposed interface:
```javascript
{
  initialize: function(optionalInitializationParameters) { ... },
  execute: function(optionalExecutionParameters) { ... }
}
```

### Adding new module
To add a new module, create a new directory within this directory with a self-explantory name. This directory should contain all of the modules' assets and utility functions to avoid exposing any module state. An entry should be added in `module-configurations.json` file to indicate whether to load and execute the new module.
