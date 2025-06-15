# Why I Built y-cli: Reclaiming Data Ownership in the AI Era

> As the creator of [y-cli](https://github.com/luohy15/y-cli), I wanted to share the philosophy and motivation behind this minimalist terminal-based AI chat interface.

![Interactive Chat](https://cdn.luohy15.com/interactive-chat.png)

## The Data Ownership Problem

When I started using AI assistants regularly, I quickly realized a fundamental issue: my conversations—often containing personal data, code snippets, and creative work—were being stored on remote servers with limited access and control. This raised several concerns:

1. **Data Portability** - What happens if a service shuts down or changes its terms?
2. **Privacy** - How is my data being used beyond providing the service?
3. **Vendor Lock-in** - Being tied to a specific provider's ecosystem
4. **Search and Reference** - Limited ability to search across past conversations

These concerns led me to create y-cli with a core principle: **your data should belong to you**. By storing all conversations in simple JSONL files on your local system, y-cli ensures:

- Complete ownership of your conversation history
- Easy backup and synchronization using your preferred tools (git, Dropbox, etc.)
- Ability to process, analyze, or migrate your data however you choose
- No dependence on proprietary storage formats or cloud services

## Understanding the LLM Landscape

The LLM ecosystem is evolving rapidly, with new models, capabilities, and approaches emerging constantly. For developers and AI enthusiasts, keeping up with these changes can be challenging.

y-cli was designed to provide a minimal interface to this evolving landscape, allowing users to:

1. **Experiment with different models** without switching tools or interfaces
2. **Compare capabilities** across providers (OpenAI, Anthropic, Deepseek, etc.)
3. **Understand the nuances** between different approaches to AI reasoning

Rather than creating a complex application with numerous features, y-cli focuses on providing just enough structure to interact with these models while maintaining flexibility.

## The MCP Revolution

The Model Context Protocol (MCP) represents one of the most significant advancements in AI utility. By allowing models to access external tools and data sources, MCP transforms AI from passive responders to active agents that can:

- Search the web for current information
- Access specialized knowledge bases
- Interact with APIs and services
- Process and analyze data

y-cli's MCP client support makes these capabilities accessible directly from your terminal, providing a straightforward way to experiment with and leverage this powerful paradigm.

```
➜  ~ y-cli mcp list
Name    Command    Arguments                                Environment
------  ---------  ---------------------------------------  ---------------------------------------
todo    uvx        mcp-todo
tavily  npx        -y tavily-mcp                            TAVILY_API_KEY=tvly-api-key...
pplx    node       /Users/mac/src/researcher-mcp/build/...  PERPLEXITY_API_KEY=pplx-api-key...
```

## Reasoning Models: Beyond Black Box AI

Another fascinating development in AI is the emergence of reasoning models that expose their thinking process. Models like Deepseek-r1 and OpenAI's o3-mini with reasoning_effort provide visibility into how the AI approaches problems.

y-cli supports these models specifically because they represent an important step toward more transparent and understandable AI. By seeing the reasoning process, users can:

- Better evaluate the quality of responses
- Identify potential biases or logical errors
- Learn from the model's problem-solving approach

This transparency is crucial for building trust and understanding in AI systems.

## The Terminal: Where Developers Live

As a developer, I spend most of my day in the terminal. It's where I write code, manage systems, and organize my workflow. Having to switch to a browser for AI assistance creates friction and context switching that interrupts my flow.

y-cli brings AI conversations to where developers already work, creating a seamless integration with existing workflows rather than forcing new habits or environments.

## Minimalism as a Philosophy

y-cli is intentionally minimal. It doesn't try to be everything to everyone. Instead, it focuses on doing a few things well:

1. Providing a clean interface to AI models
2. Ensuring data ownership
3. Supporting the latest advancements in AI capabilities
4. Integrating naturally with terminal workflows

This minimalism extends to the codebase itself, making it easier to understand, modify, and extend for your specific needs.

## Looking Forward

The AI landscape will continue to evolve rapidly. New models, capabilities, and paradigms will emerge. y-cli aims to provide a stable, user-controlled interface to this changing world—one that respects your data ownership while allowing you to experiment with and benefit from these advancements.

If you're interested in reclaiming ownership of your AI conversations while staying current with the latest developments, check out [y-cli on GitHub](https://github.com/luohy15/y-cli).
