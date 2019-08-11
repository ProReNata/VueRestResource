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

The goal of this library is to reduce boilerplate, simplify the synchronisation between server and client data (in Vuex),
take some decisions so the workflow is more predictable.


## Example:

(see [demo here](https://codesandbox.io/s/vue-rest-resource-demo-ptsnl))

```javascript
computed: {
  ...asyncResourceGetter('currentUser', UserResource, 'this.myUserIdProp')                             
},

```

This line is like a Vuex `mapGetter`, only it does some async magic and gets the data from the server for you. Its reactive to `myUserIdProp` and will get the data from Vuex in first hand. If Vuex does not have the data it will get it from the server, put it in Vuex for you, and give it back to the new computed property `currentUser` created my the `asyncResourceGetter`.

The `UserResource` aergument is the VRR configuration for that resource. Check the [demo here](https://codesandbox.io/s/vue-rest-resource-demo-ptsnl) to see it working and how things integrates together.


## Configuration:

```
import VRR from 'VueRestResource';
import store from 'your/vuex/store/instance';

const RestConfig = {
  baseUrl: '/api/path', // optional, depends on server configuration
  httpHeaders: {'X-CSRFToken': window.myPrivateToken}, // optional
  store: store // Vuex store
};

const vrrAPI = vrr.createVueRestResource(RestConfig);
export default vrrAPI;
```

This will configure the resource and from here you can use:
 - the `HTTP` class to do direct Axios/Ajax requests with _Promises_ 
 - the `registerResource` factory function taking the resource object as argument


---

VueRestResource will register a module _"VRR"_ in the store (configurable) so we can keep track of open requests.

You need to supply to VRR information on how to mount the endpoints and get data from the server. 
For that we need `apiModule` and `apiModel`. That information is used to organise the Vuex module store and keep track of things.



**The resource object**:

A resource object looks like 

```
  Patient: {
    apiModel: 'modelName',
    apiModule: 'moduleName', // can be empty string
  },
```

With that information VRR will create the store mutations method names, that follow the pattern:  

     const mutation = [apiModule, `${action}${capitalizeFirst(apiModel)}`]
        .filter(Boolean)
        .join('/');
        
so, the module name can be a empty string for simple endpoints with only one level depth.

The whole resource object could be:

```
const MODULE = 'Patients';

export default {
  __name: MODULE,
  Patient: {
    apiModel: 'patient',
    apiModule: MODULE,
    handler: {}, // custom handlers (optional)
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
and with the `id` (if given). The endpoint where VRR will look for data is:

    endpoint = `${[this.baseUrl, this.apiModule, this.apiModel]
      .filter(Boolean)
      .join('/')
      .toLowerCase()}/`;


### Glossary


#### apiModule

This will be the name of the store Module, which is used to namespace everything and should be in a folder with the same name.

The resource file is used to generate the state, mutators etc.  
To use the store you still need to generate the resource file into a store module.

#### apiModel

This is the name of an object in your module. e.g. the posts of a user.

## Methods (computed properties)

### registerResource

`import {registerResource} from VRR;`  

Use this method to create a Resource.  
It takes in 1 parameter, resource which needs to be a store object in the following format. 
 
```
{
  Blocks: {
    apiModel: 'blocks',
    apiModule: MODULE,
    handler: {}, // optional
  },
}
```
As named before:

 - the apiModule is the name of the store module.  
 - the apiModel is the name of the object in this module.  
 - the handler object is where you can pass functions to change the data just before it is added to the store. 
It will create a memory for this resource.


#### get

`Resource.get(vueComponentInstance, id)`

Param 1: _Object instance_, the pointer to the Vue instance consuming the API
Param 2: _Number_, the id of the model you want to get

The `.get` method fetches a specific object from the server and puts the resource data with id in the store.

#### Create

`Resource.create(vueComponentInstance, obj)`

Param 1: _Object instance_, the pointer to the Vue instance consuming the API
Param 2: _Object_, the object/model you want to save (without id).

The `.create` method updates the server with new data and puts the resource data with id in the store.

#### Update
`Resource.update(vueComponentInstance, id, obj)`

Param 1: _Object instance_, the pointer to the Vue instance consuming the API
Param 2: _Number_, the id of the model you want to update.
Param 3: _Object_, the object/model you want to update.

The `.update` method updates the server with new data and puts the resource data with id in the store.


#### List
`Resource.List(vueComponentInstance)`

Param 1: _Object instance_, the pointer to the Vue instance consuming the API

The `.list` method fetches a collection of data from the server and puts the resource data with id in the store.


### asyncResourceGetter

This method is similar to Vuex's `mapGetters`.   

The idea is to get resources from the server whose you have the `id` for, reactively. 
If you have a `id` of a model/object and that id changes, the VRR will first check the store for it and 
if it doesn't find it it will get it from the server for you and update the store. 
So you can use the computed property this function returns as the pointer to the value you want.

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

#### Get a nested object
Param 1: _String_, name of the computed property the Vue instance will receive  
Param 2: _Array_, Array of the resource Objects, executed in order  
Param 3: _String|Number_, the computed property, or prop, with/or the `id` of the first object.
Param 4: _Array:Function_, Array of functions, executed in order and with the data received from the previous function. 
If you don't need it just pass `(data) => data`.  
e.g.

```
computed: {
  ...asyncResourceGetter('currentUserCity', [UserResource, CityResource], id, [(userData) => userData.cityId, (cityData) => data])
},
```

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
