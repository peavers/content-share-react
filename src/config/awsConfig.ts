const awsConfig = {
  Auth: {
    Cognito: {
      region: 'us-west-2',
      userPoolId: 'us-west-2_ZQqydrsiU',
      userPoolClientId: '2257su1lgchgbn814oei7lv7v3',
      signUpVerificationMethod: 'code' as const,
      loginWith: {
        oauth: {
          domain: 'spring-boot-auth-665316247771.auth.us-west-2.amazoncognito.com',
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: ['http://localhost:3000/'],
          redirectSignOut: ['http://localhost:3000/'],
          responseType: 'code' as const
        },
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