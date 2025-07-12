# My AI Coding Tools Experience Record

## My Background

I'm an ordinary backend programmer with 6 years of experience, and I've also written some simple frontend projects. I've worked at both large companies and small startups. You can check out my [resume](https://cdn.luohy15.com/cv.pdf) if you're interested.

Since I'm quite interested in technology, I've basically touched projects in various languages. In my previous work, I mainly used Java to write CRUD code. On GitHub, I have two AI chat practice projects with 100 stars each (both written using AI coding tools), which are Python ([y-cli](https://github.com/luohy15/y-cli)) and TypeScript ([y-gui](https://github.com/luohy15/y-gui)) projects.

Besides development, I've also been involved in some DevOps/CI/CD projects and have completely maintained all cloud service infrastructure at a small company I previously worked for.

## Coding Tools Journey

![](https://cdn.luohy15.com/ai-coding-tools-using-experience-1.png)

From the GitHub heatmap, you can clearly see the boost that coding tools have given me - I've become more passionate about writing code (because feedback is much faster).

- Nov 2024 Started getting familiar with OpenRouter, saw Cline and Claude 3.5 Sonnet at the top of the leaderboard (Cline has always been the top application on OpenRouter), began trying to use them and gradually became a power user
- Dec 2024 Also tried using Cursor, got a membership, but at that time Cursor actually generated Flask code for me in a FastAPI project, which I found quite stupid so I uninstalled it immediately; later tried installing it once more but didn't really use it, mainly for two reasons:
	- I prefer tools like Cline that allow manual context management
	- I'm used to VS Code (I even use VS Code for Java projects)
- Jan 2025 Direct connection to OpenRouter started erroring (regional restrictions), so I [found Cloudflare AI Gateway](https://luohy15.com/cline-openrouter-fix/) as a proxy, which allowed me to continue using it stably. I tried submitting code to the Cline project to support custom OpenRouter Base URLs, but it wasn't merged, so I've been using a custom version (from another perspective, this prevented the solution from being widely used, keeping it available without being banned)
- Jan 2025 Started using Cline to build y-cli code
- Feb 2025 Claude Sonnet Upgraded from 3.5 to 3.7
- Mar 2025 Started using Cline to build y-gui code
- May 2025 Because I mentioned DeepWiki in y-gui's README, Devin gave me $500 open source grant credit. I tried using it a few times but wasn't used to the mode of committing every session (I prefer deciding when to commit based on my own thoughts), so I didn't continue using it
- Jun 2025 Claude Sonnet Upgraded from 3.7 to 4
- Jul 2025 [Started using Claude Code](https://luohy15.com/compare-cline-and-claude-code/), got [y-router](https://github.com/luohy15/y-router) logic working in less than one evening, recent expenses have already exceeded Cline

## What I Mainly Use It For

Coding tools are definitely mainly used for coding - writing Java CRUD code, y-gui and y-cli chat application code. Actually, if a model can code, then other things are even simpler, so besides that, I also use them for writing project documentation, personal notes and blog posts, and combining with script commands for batch file management operations.

Both Cline and Claude Code's task history are theoretically accessible, so one could write a tool to analyze usage purposes.

## What Models I Prefer

![](https://cdn.luohy15.com/ai-coding-tools-using-experience-2.png)

For programming, I basically only use Claude Sonnet. Gemini is mainly consumed by y-gui for casual chat.

## Cost Expenses

About $100 per month. After switching to Claude Code, usage frequency has increased, so if models don't reduce their prices in the future, monthly costs are expected to be even higher.

![](https://cdn.luohy15.com/ai-coding-tools-using-experience-3.png)

## Personal Impressions

### Claude 3.5 Sonnet

Claude 3.5 Sonnet is a groundbreaking model. Starting with this model, AI programming began to reach a usable state. For programming scenarios, I use and only use Claude.

### Cline

Cline is my AI programming enlightenment tool that taught me a lot of AI programming-related knowledge.

Notable upgrades in Cline:

- Upgraded from write_file to replace_in_file, significantly reducing token output, making it usable even for Java projects within 1000 lines
- Added plan mode, allowing you to review the approach before execution, making it easy to clarify your thoughts

### Claude Code

Claude Code's advantages compared to Cline:

- Uses standard tools parameter calling (Cline puts tools parameter descriptions in system prompt to support more models), theoretically should have better results
- Has much fewer mouse clicking operations compared to Cline, more convenient for keyboard users, leading to higher usage frequency
- Can appear in more places, such as CI/CD pipelines

### Regional Restrictions

Regional restrictions can be both a disadvantage and an advantage for Chinese programmers. In the process of researching how to deal with restrictions, you inevitably need to touch many details and understand the underlying principles.