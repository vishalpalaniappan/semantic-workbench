# Design Workbench

The repo contains a tool that serves as a workbench for working with design specifications. 

It provides an interface to do the following:

- Create a design specification with state transition and control flow graph.
- Define its participants and specify initial world state.
- Specify how the world state is modified by behaviors.
- Specify the semantic invariants that define the correctness of behaviors.
- Specify the mapping from design to implementation by importing source code.
- Generate a JSON file that will be added in the instrumentation performed by the ADLI tool. 

When the instrumented program is executed, it will generate a compressed log file that contains the execution of the program. This execution can be transformed into the behavior of the design and it can be automatically debugged in the trace viewer.

From this description it is clear that the trace viewer and this workbench will share common functions for how to interact with the design. So I will be specifying those functions as a [library][dal-engine-core-js] that is maintained separately and imported into both these applications. 

## Unified Development Environment (UDE)

The current configuration consists of separate tools: the design workbench, instrumentation layer, trace viewer, and automated testing framework. For now, each component is being developed independently in order to establish and validate the core functionality of the system.

Merging these tools into a single framework will create a unified development environment that integrates semantic design, implementation, instrumentation, execution, automated debugging, and automated testing.

There are multiple ways this integration could be structured. However, a minimal initial configuration capable of realizing the full semantic lifecycle is as follows:

- The workbench contains the DAL engine and enables the construction and validation of formal design specifications.
- Add NodeJS server and connect to workbench over websocket.
- The server maintains the centralized project workspace, and the workbench functions as a semantic IDE interface to it.
- The workbench supports both semantic design and implementation development within a unified environment.
- After mapping the design onto the implementation, the server performs instrumentation and executes the program.
- Execution traces are captured and persisted by the server.
- The workbench incorporates trace viewer and automatically debugs execution against the design.
- The design evolves by learning semantic invariants from execution traces, with each invariant being explicitly linked to the environment that informed it.
- Automated testing reuses these invariant-linked environments to validate new implementations.

In this configuration, the entire framework operates as a unified tool, and this minimal initial setup realizes the complete lifecycle with very little operational overhead.

Although I considered moving all semantic logic to the server and keeping the workbench as a thin UI client, I chose instead to retain the DAL engine in the frontend. This preserves the workbench as a true semantic IDE rather than a remote interface to a backend runtime.

Keeping the DAL engine on the frontend strengthens the architectural separation between semantics and mechanics. The workbench governs semantic definition, development, and validation, while the server maintains the authoritative workspace and execution substrate.

This separation also keeps the backend narrowly scoped and highly expandable. For example, execution could later be delegated to a remote cluster, parallelized for large-scale testing, or replaced with an alternative runtime substrate without affecting the semantic engine. Additionally, retaining the DAL engine in the frontend makes it straightforward to package the system as a desktop application in the future.

[dal-engine-core-js]: https://github.com/vishalpalaniappan/dal-engine-core-js