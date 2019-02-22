<a href="https://travis-ci.org/ProReNata/VueRestResource"
   title="Travis status">
<img
   src="https://travis-ci.org/ProReNata/VueRestResource.svg?branch=master"
   alt="Travis status" height="18"/>
</a>
<a href="https://david-dm.org/ProReNata/VueRestResource"
   title="Dependency status">
<img src="https://david-dm.org/ProReNata/VueRestResource.svg"
   alt="Dependency status" height="18"/>
</a>
<a href="https://david-dm.org/ProReNata/VueRestResource?type=dev"
   title="devDependency status">
<img src="https://david-dm.org/ProReNata/VueRestResource/dev-status.svg"
   alt="devDependency status" height="18"/>
</a>
<a href="https://badge.fury.io/js/%40prorenata%2Fvue-rest-resource" title="npm version">
<img src="https://badge.fury.io/js/%40prorenata%2Fvue-rest-resource.svg"
   alt="npm version" height="18"/>
</a>
<a name="ProReNata/VueRestResource"></a>

# VueRestResource

Rest HTTP resource management for Vue.js and Vuex projects. 

---

## How to use:

```
import VRR from 'VueRestResource';
import store from 'your/vuex/store/instance';

const RestConfig = {
  baseUrl: '/api/path',
  httpHeaders: {'X-CSRFToken': window.myPrivateToken}, // optional
  store: store
};

export const {HTTP, registerResource} = VRR(RestConfig);
```

This will configure the resource and from here you can use:
 - the `HTTP` class to do direct Axios/Ajax requests with _Promises_ 
 - the `registerResource` factory function taking the resource object as argument

**The resource object**:

The store mutations method names have to follow the pattern:  

    const mutation = `${apiModule}/${action}${capitalizeFirst(apiModel)}`;

and thus the resource object could be:

```
const MODULE = 'Patients';

export default {
  __name: MODULE,
  Patient: {
    apiModel: 'patient',
    apiModule: MODULE,
    handler: {},
  },
  PatientFinderById: {
    apiModel: 'patientfinderbyid',
    apiModule: MODULE,
    handler: {
      list: response => response.data, // optional, in case you need custom handlers
    },
  },
};
```

## Glossary

### apiModule

This is the name of the Store Module, which is used to namespace everything and should be in a folder with the same name.

The resource file is used to generate the state, mutators etc.  
To use the store you still need to generate the resource file into a store module.

e.g. a module named Users

```
Store/Modules/Users/resource.js

const MODULE = 'Users';

export default {
  __name: MODULE,
  Posts: {
    apiModel: 'posts',
    apiModule: MODULE,
    handler: {},
  },
  Comments: {
    apiModel: 'comments',
    apiModule: MODULE,
    handler: {},
  },
  Score: {
    apiModel: 'score',
    apiModule: MODULE,
    handler: {},
  },
};

```

### apiModel

This is the name of an object in your module. e.g. the posts of a user.

## Methods

### registerResource

`import {registerResource} from VRR;`  
Use this method to create a Resource.  
It takes in 1 parameter, resources which needs to be a store object in the following format.  
```
Blocks: {
  apiModel: 'blocks',
  apiModule: MODULE,
  handler: {},
},
```
The apiModule is the name of the store module.  
The apiModel is the name of the object in this module.
It will create a memory for this resource.

You should first import the module using the path to your store.  
`import module from 'Store/Modules/module`

Then you can use the module to get the object.  
`const moduleResource = registerResource(module.objectName);`  

You need to pass in this resource when calling the other methods.

RETURNS a Resource Class with the following methods

#### get
`Resource.get(id)`

Param 1: Number: id to get

Fetches it from the server.
Puts the resource data with id in the store.

#### Create
`Resource.update(id, obj)`

Param : /: Object without id

Returns an id

Updates the server.
Updates the store.

#### Update
`Resource.update(id, obj)`

Param 1: Number: id to update
Param 2: /: New Value

Updates the server.
Updates the store.

#### List
`Resource.List()`

Puts the resource into the store.


### asyncResourceValue

### asyncResourceGetter

Loads in he specific object in the store.

Use this to bind a state to a computed property.

Object not found in the store: Fills the store with data from the server.
Returns the object.

Param 1: String: name of the local state  
Param 2: Resource: pass in the resource Object  
Param 3: Function: callback  
Param 4: Value to match  
Param 5: Array: Value to check

e.g.
```
computed: {
  ...asyncResourceGetter('firstUser', UserResource, (data) => data, 1, ['id']),
},
```

### HTTP

### resourceListGetter

Use this to bind a state to a computed property, but only get the data that matches the array passed in.

Will always fill in the store with server data when the object in not found.  

Param 1: String: name of the local state  
Param 2: Resource: pass in the resource Object  
Param 3: Array: needs to be an array of ids   **e.g.** `user.posts = [5, 4, 2, 9, 10, 7]`  

Param 4: Optional | Default: 'id':  Keyname of Value to check 

e.g.
```
computed: {
  ...resourceListGetter('userPosts', Posts, 'user.posts', 'id'),
},
```
