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

From this description it is clear that the trace viewer and this workbench will share common functions for how to interact with the design. So I will be specifying those functions as a [library][dal-core-js] that is maintained separately and imported into both these applications. 

Finally, the design workbench, the instrumentation and trace viewer all being separate tools is one possible configuration. I could merge all of them into a single tool to make it convenient for the user. There are benefits to keeping it separate as well but I will decide on the best approach later. For now, I am working with separate tools and implement all the functionality.

[dal-core-js]: https://github.com/vishalpalaniappan/dal-core-js