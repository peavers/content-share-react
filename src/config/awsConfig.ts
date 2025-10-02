const awsConfig = {
  Auth: {
    Cognito: {
      region: 'us-west-2',
      userPoolId: 'us-west-2_y4Urjvtic',
      userPoolClientId: '50msc1v502133ndm9hlqm9u23g',
      signUpVerificationMethod: 'code' as const,
      loginWith: {
        email: true
      }
    }
  },
  API: {
    REST: {
      SpringBootAPI: {
        endpoint: import.meta.env.VITE_API_URL || 'https://6iao3rzmoj.execute-api.us-west-2.amazonaws.com/prod',
        region: 'us-west-2'
      }
    }
  }
};

export default awsConfig;