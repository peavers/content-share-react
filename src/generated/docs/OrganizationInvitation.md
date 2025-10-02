# OrganizationInvitation


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**organizationId** | **string** |  | [optional] [default to undefined]
**invitedBy** | **string** |  | [optional] [default to undefined]
**email** | **string** |  | [optional] [default to undefined]
**role** | **string** |  | [optional] [default to undefined]
**token** | **string** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**expiresAt** | **string** |  | [optional] [default to undefined]
**acceptedAt** | **string** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**organization** | [**Organization**](Organization.md) |  | [optional] [default to undefined]
**inviter** | [**User**](User.md) |  | [optional] [default to undefined]
**expired** | **boolean** |  | [optional] [default to undefined]
**active** | **boolean** |  | [optional] [default to undefined]

## Example

```typescript
import { OrganizationInvitation } from './api';

const instance: OrganizationInvitation = {
    id,
    organizationId,
    invitedBy,
    email,
    role,
    token,
    status,
    expiresAt,
    acceptedAt,
    createdAt,
    organization,
    inviter,
    expired,
    active,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
