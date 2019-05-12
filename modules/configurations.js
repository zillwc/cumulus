const availableModules = [
  {
    name: 'lgtv',
    enabled: true,
    initializationParameters: {
      deviceMacAddress: '00:00:aa:00:0a:00',
    },
    executionParameters: {
      mode: 'study',
    },
  },
];

module.exports = {
  availableModules,
  enabledModules: availableModules.filter((mod) => !!mod.enabled),
};
