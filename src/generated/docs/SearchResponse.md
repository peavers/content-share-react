# SearchResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**videos** | [**Array&lt;VideoSearchDocument&gt;**](VideoSearchDocument.md) |  | [optional] [default to undefined]
**users** | [**Array&lt;UserSearchDocument&gt;**](UserSearchDocument.md) |  | [optional] [default to undefined]
**organizations** | [**Array&lt;OrganizationSearchDocument&gt;**](OrganizationSearchDocument.md) |  | [optional] [default to undefined]
**total_results** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { SearchResponse } from './api';

const instance: SearchResponse = {
    videos,
    users,
    organizations,
    total_results,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
