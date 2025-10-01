# CognitoUserDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**username** | **string** |  | [optional] [default to undefined]
**email** | **string** |  | [optional] [default to undefined]
**emailVerified** | **boolean** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**enabled** | **boolean** |  | [optional] [default to undefined]
**createdDate** | **string** |  | [optional] [default to undefined]
**lastModifiedDate** | **string** |  | [optional] [default to undefined]
**groups** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**attributes** | **{ [key: string]: string; }** |  | [optional] [default to undefined]

## Example

```typescript
import { CognitoUserDto } from './api';

const instance: CognitoUserDto = {
    username,
    email,
    emailVerified,
    status,
    enabled,
    createdDate,
    lastModifiedDate,
    groups,
    attributes,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
