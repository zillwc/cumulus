const availableModules = [
  {
    name: 'lgtv',
    enabled: true,
    initializationParameters: {
      deviceMacAddress: 'bc:30:d9:00:00:00',
    },
    executionParameters: {
      mode: 'work',
    },
  },
];

module.exports = {
  availableModules,
  enabledModules: availableModules.filter((mod) => !!mod.enabled),
};
