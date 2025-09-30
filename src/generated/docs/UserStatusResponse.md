# UserStatusResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**userId** | **string** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**message** | **string** |  | [optional] [default to undefined]
**hasOrganizations** | **boolean** |  | [optional] [default to undefined]
**organizationCount** | **number** |  | [optional] [default to undefined]
**hasPendingInvitations** | **boolean** |  | [optional] [default to undefined]
**pendingInvitationCount** | **number** |  | [optional] [default to undefined]
**organizations** | [**Array&lt;Organization&gt;**](Organization.md) |  | [optional] [default to undefined]
**pendingInvitations** | [**Array&lt;OrganizationInvitation&gt;**](OrganizationInvitation.md) |  | [optional] [default to undefined]

## Example

```typescript
import { UserStatusResponse } from './api';

const instance: UserStatusResponse = {
    userId,
    status,
    message,
    hasOrganizations,
    organizationCount,
    hasPendingInvitations,
    pendingInvitationCount,
    organizations,
    pendingInvitations,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
