# CreateOrganizationRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**avatarUrl** | **string** |  | [optional] [default to undefined]
**websiteUrl** | **string** |  | [optional] [default to undefined]
**organizationType** | **string** |  | [optional] [default to undefined]
**visibility** | **string** |  | [optional] [default to undefined]
**plan** | **string** |  | [optional] [default to undefined]
**settings** | **{ [key: string]: any; }** |  | [optional] [default to undefined]
**inviteEmails** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**inviteRoles** | **Array&lt;string&gt;** |  | [optional] [default to undefined]

## Example

```typescript
import { CreateOrganizationRequest } from './api';

const instance: CreateOrganizationRequest = {
    name,
    description,
    avatarUrl,
    websiteUrl,
    organizationType,
    visibility,
    plan,
    settings,
    inviteEmails,
    inviteRoles,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
