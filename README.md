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
<a href="https://badge.fury.io/js/ProReNata/VueRestResource" title="npm version">
<img src="https://badge.fury.io/js/ProReNata/VueRestResource.svg"
   alt="npm version" height="18"/>
</a>
<a name="ProReNata/VueRestResource"></a>

# VueRestResource

Rest HTTP resource management for Vue.js and Vuex projects. 

---

### How to use:

```
import VRR from 'VueRestResource';
import store from 'your/vuex/stor/instance';

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
