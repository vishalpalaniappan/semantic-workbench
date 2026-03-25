# Design Workbench

> [!NOTE]  
> The features mentioned below are in development.

The Design Workbench is a Unified Development Environment (UDE) powered by design-driven [automation][automation]. At its core is an [engine][dal-engine-core-js] that enables users to formally specify designs in a Design Abstraction Language (DAL) through behaviors, participants, and semantic invariants. By mapping an implementation onto those behaviors, instrumented execution can be transformed back into the behavior defined by the design, a process known as the Semantic Transform (ST). The result is a fully automated, end-to-end diagnostic solution for software systems that is seamlessly integrated into the development process. 

## Overview

The `Design Workbench` is a full-stack system composed of a React front end and a Node.js back end. The back end hosts a workspace that is synchronized to the front end over WebSockets. The front end provides a visual interface for constructing formal designs and mapping them onto implementations. 

The backend instruments the implementation with the mapping and executes it on the chosen substrate. The resulting execution traces are preserved and are automatically debugged in the workbench by the engine. If the engine is unable to identify the root cause automatically, the workbench enters "learning" mode where behavioral modifications and new invariants are introduced. 

The traces which motivated the invariants are assigned to the invariant and serve as provable conditions to verify that an implementation enforces an invariant. As a result, the backend also acts as a fully automated testing platform where the implementation is tested to verify that it respects every invariant using the associated environments. The backend can also choose the execution substrate and assign testing or execution to remote clusters.

In this framework, the design is the central actor...[ongoing]

## Development



## Providing Feedback






[dal-engine-core-js]: https://github.com/vishalpalaniappan/dal-engine-core-js
[automation]: https://vishalpalaniappan.github.io/asp-adli-python/Automating%20the%20Management%20of%20Software%20Systems.pdf