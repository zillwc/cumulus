const { availableModules, enabledModules } = require('./modules/configurations');

const moduleExecutionFactory = (mod) => async () => {
  console.log(`\n== ${mod.name} ==`);
  let currModule;
  let initParams;
  let exeParams;

  try {
    console.log('[*] requiring module');

    // eslint-disable-next-line global-require, import/no-dynamic-require
    currModule = require(`./modules/${mod.name}`);
  } catch (error) {
    console.error(`Failed to require module at "${__dirname}/modules/${mod.name}/"`, error);
  }

  try {
    console.log('[*] initializing module');
    initParams = mod.initializationParameters || {};
    await currModule.initialize(initParams);
  } catch (error) {
    console.error('Failed to initialize module', error);
  }

  try {
    console.log('[*] executing module');
    exeParams = mod.executionParameters || {};
    await currModule.execute(exeParams);
  } catch (error) {
    console.error('Failed to execute module', error);
  }

  console.log(`== ${mod.name} ==\n`);
};

async function init() {
  console.log(`Available Modules: ${availableModules.map((mod) => (`"${mod.name}"`))}`);
  console.log(`Enabled Modules: ${enabledModules.map((mod) => (`"${mod.name}"`))}`);

  let moduleExecutionChain = Promise.resolve();
  enabledModules.forEach((mod) => {
    moduleExecutionChain = moduleExecutionChain.then(moduleExecutionFactory(mod));
  });

  await moduleExecutionChain;
  process.exit(0);
}

init();
