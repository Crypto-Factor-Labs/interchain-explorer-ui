export const environment = {
  production: true,
  APP_BASE_URL: '{{apiBaseUrl}}',
  APP_POLL_FREQ: '{{apiProdFreq}}',

  externalExplorers: JSON.parse("{{externalExplorers}}"),
  stateValidationChainId: Number.parseInt("{{stateValidationChainId}}"),
};
