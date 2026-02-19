# Design Workbench

The repo contains a tool that serves as a workbench for working with design specifications. 

It provides an interface to do the following:

- Create a design specification with state transition and control flow graph.
- Specify the world state and define its participants.
- Specify the semantic invariants.
- Specify the mapping from design to implementation by importing source code.
- Generate a JSON file that will be added in the instrumentation performed by the ADLI tool. 

When the instrumented program is executed, it will generate a compressed log file that can contains the execution of the program. This execution can be transformed into the behavior of the design and it can be automatically debugged in the trace viewer.

From this description is clear that the trace viewer and this workbench will share common functions for how to interact with the design. So I will be specifying that those functions as a library that is separately maintained and imported into both these applications. 

Finally, the design workbench, the instrumentation and trace viewer all being in a separate tools is not ideal in my opinion. I will be merging all of them into a single tool in the future if the use cases support it. There are benefits to keeping it separate as well but I will decide on the best approach later. For now, I am working with separate tools.