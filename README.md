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

VueRestResource is a Rest HTTP resource management for Vue.js and Vuex projects. This library integrates 
Vuex and the server data in a powerful way. 

The goal of this library is to reduce boilerplate, simplify synchronise server and client data (in Vuex),
take decisions so the workflow is more predictable.

---

## How to use:

```
import VRR from 'VueRestResource';
import store from 'your/vuex/store/instance';

const RestConfig = {
  baseUrl: '/api/path', // optional, depends on server configuration
  httpHeaders: {'X-CSRFToken': window.myPrivateToken}, // optional
  store: store // Vuex store
};

export const {HTTP, registerResource} = VRR(RestConfig);
```

This will configure the resource and from here you can use:
 - the `HTTP` class to do direct Axios/Ajax requests with _Promises_ 
 - the `registerResource` factory function taking the resource object as argument
 
 >**Note:** VueRestResource will register a module _Requests_ in the store. The store has to be _namespaced_. 


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

The `apiModule` and `apiModel` will be used to form the server endpoint, together with the `baseUrl` from the options (if given)
and with the `id` (if given).


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
It takes in 1 parameter, resource which needs to be a store object in the following format. 
 
```
Blocks: {
  apiModel: 'blocks',
  apiModule: MODULE,
  handler: {}, // optional
},
```
The apiModule is the name of the store module.  
The apiModel is the name of the object in this module.  
The handler object is where you can pass functions to change the data just before it is added to the store. 
It will create a memory for this resource.

You should first import the module using the path to your store.  
`import module from 'Store/Modules/module`

Then you can use the module to get the object.  
`const moduleResource = registerResource(module.objectName);`  

You need to pass in this resource when calling the other methods.

The `registerResource` function will return a Resource Class with the following methods:

#### get

`Resource.get(id)`

Param 1: _Number_, the id of the model you want to get

Fetches it from the server.
Puts the resource data with id in the store.

#### Create

`Resource.create(obj)`

Param 1: _Object_, the object/model you want to save (without id).

Updates the server.
Updates the store.

#### Update
`Resource.update(id, obj)`

Param 1: _Number_, the id of the model you want to update.
Param 2: _Object_, the object/model you want to update.

Updates the server.
Updates the store.

#### List
`Resource.List()`

Puts the resources into the store.


### asyncResourceValue

### asyncResourceGetter

This method is similar to Vuex's `mapGetters`.   

The idea is to get resources from the server whose you have the `id` for. 
If you have a `id` of a model/object and that id changes, the VRR will check the store for it. 
If it doesn't find it it will get it from the server for you and update the store. So you can use the computed property this function returns as the pointer to the value you want.

In other words:

Loads in the specific object in the store.
Use this to bind a state to a computed property.
If the Object is not found in the store, it fills the store with data from the server.

Param 1: _String_, name of the computed property the Vue instance will receive  
Param 2: _Object_, the resource Object  
Param 3: _String|Number_, the computed property, or prop, with/or the `id` of the object you want or the name of the instance value/property to observe.
Param 4: _Function_ (optional), callback to transform the data from the store before providing it as the value of the computed property. 
If you don't need it just pass `(data) => data`.  
e.g.

```
computed: {
  ...asyncResourceGetter('currentUser', UserResource, 'this.myUserIdProp')
},
```


### HTTP

### resourceListGetter

Use this to bind a state to a computed property, but only get the data that matches the array passed in.

Will always fill in the store with server data when the object in not found.  

Param 1: _String_, name of the local state  
Param 2: _Resource_, pass in the resource Object  
Param 3: _String_, the computed property name that has a array with IDs or a object to be used as a filter for the query

e.g.

```
computed: {
  ...resourceListGetter('userPosts', Posts, 'user.posts'),
},
```
