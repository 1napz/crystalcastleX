
📝📝📝📝📝
support.claude.com
What are projects?
2 - 3 minutes

    All Collections
    Claude
    Features and capabilities
    What are projects?

Projects allow you to create self-contained workspaces with their own chat histories and knowledge bases. Within each project, you can upload documents, provide context, and have focused chats with Claude.

Project Knowledge

A key benefit of projects is the ability to provide context for your chats with Claude. You can upload relevant documents, text, code, or other files to a project's knowledge base, which Claude will use to better understand the context and background for your individual chats within that project.

In addition, you can define project instructions for each project to further tailor Claude's responses. For example, instructing Claude to use a more formal tone or answer questions from the perspective of a specific role or industry.

Enhanced project knowledge with RAG

When using a paid plan, your projects automatically scale to handle large amounts of content through Retrieval Augmented Generation (RAG). When your project knowledge approaches context limits, Claude seamlessly enables RAG mode to expand capacity by up to 10x while maintaining response quality.

Collaboration and Sharing (Team and Enterprise plans only)

For users on Claude for Work (Team and Enterprise) plans, projects can be shared with other members of your organization, enabling powerful collaboration and knowledge sharing capabilities. The sharing system includes:

Permission levels:

Sharing options:

Collaboration features:

Multiple members can contribute documents, create chats, and work together within the same project environment, making projects ideal for team collaboration.

For more information on private projects and visibility settings on Team and Enterprise plans, see Project visibility and sharing.

Related Articles

How large is the context window on paid Claude plans?

How can I create and manage projects?

Usage limit best practices

Retrieval augmented generation (RAG) for projects

Organize your tasks with projects in Claude Cowork

---------

📝


support.claude.com
Get started with Claude Cowork
6 - 8 minutes

This article explains how to use Claude Cowork, which brings Claude Code's agentic capabilities to Claude Desktop for knowledge work beyond coding.

Availability

Claude Cowork is available for paid plans (Pro, Max, Team, Enterprise) on:

Will my computer support Claude Cowork?

If you haven't installed Claude Desktop yet and want to check if your computer will support Cowork, click the link associated with your system to download a simple program that checks this for you:

Open the program after downloading to run the Cowork readiness check. If you see "This computer is ready for Cowork," you can move forward.

What is Claude Cowork?

Claude Cowork uses the same agentic architecture that powers Claude Code, now accessible within Claude Desktop and without opening the terminal. Instead of responding to prompts one at a time, Claude can take on complex, multi-step tasks and execute them on your behalf.

With Cowork, you can describe an outcome, step away, and come back to finished work—formatted documents, organized files, synthesized research, and more. With scheduled tasks, Claude can complete work for you automatically, which isn't possible in regular chats outside of Cowork. With the introduction of projects in Cowork, you can organize related tasks into persistent, self-contained workspaces with their own files, links, instructions, and memory, making Cowork more powerful for recurring or long-running work.

Important:

Key capabilities

How Claude Cowork runs your tasks

Cowork runs directly on your computer, giving Claude access to the files you choose to share. Code runs safely in an isolated space, but Claude can make real changes to your files.

When you start a task in Cowork, Claude:

You maintain visibility into what Claude is planning and doing throughout the process so you can steer when it matters, or let Claude run independently.

Get started

Requirements

Access Claude Cowork

What to expect during a task

When Claude is working on a task in Cowork:

Tasks can run for extended periods depending on complexity. You can monitor progress or step away and return when Claude finishes.

Add global and folder instructions

Global instructions

You can give Claude standing instructions that apply to every Cowork session. Use this to specify your preferred tone, output format, or background on your role.

To set global instructions:

Folder instructions

Folder instructions add project-specific context to Cowork when you select a local folder. Claude can also update these on its own during a session.

Claude Cowork plugins

Plugins customize how Claude works for your role, team, and company in Cowork. Each one bundles skills, connectors, and sub-agents into a single package. For details on finding, installing, and customizing plugins, see Use plugins in Cowork.

Schedule recurring tasks

You can set up tasks that Claude runs automatically or on demand. To schedule a task, type /schedule in any Cowork task. You can also click "Scheduled" in the left sidebar to view, create, and manage your scheduled tasks.

Scheduled tasks only run while your computer is awake and the Claude Desktop app is open.

Usage limits

Working on tasks with Cowork consumes more of your usage allocation than chatting with Claude. This is because complex, multi-step tasks are compute-intensive and require more tokens to execute.

If you find yourself hitting usage limits frequently when using Cowork, consider:

Example use cases

Cowork is designed for complex, multi-step work that benefits from file access and extended execution time. Here are some examples:

File and document management

Research and analysis

Document creation

Data and analysis

Permissions and security

Cowork runs with layered protections on your computer:

Permissions

Permissions work the same as for chat. You control:

Please carefully assess how much you trust an MCP or website before extending access beyond Claude's default settings.

Permission modes

Cowork has a mode selector that controls how Claude handles approvals during a session:

In both modes, Claude will still ask before permanently deleting files. For more on when to use each mode, see Use Claude Cowork safely.

Current limitations

Some Cowork capabilities are not yet available:

We're iterating on Cowork based on feedback. If you encounter issues or have suggestions, use the feedback button in the app to share feedback with our team.

Troubleshooting

I'm seeing "Setting up Claude's workspace" when I start Cowork; what does this mean?

This message is expected and indicates that Cowork is updating to the most recent version to apply any fixes and improvements.

Claude stopped working on my task

Ensure the Claude Desktop app was open throughout the entire task. If the app was closed or your computer went to sleep, the session may have ended.

I'm hitting usage limits quickly

Cowork consumes more usage than standard chat. Try using standard chat for simpler tasks and reserve Cowork for complex, multi-step work that benefits from file access.

Files aren't appearing where expected

Check that you've granted Claude the appropriate file access permissions. Review the output location Claude specified when completing the task.

I'm trying to start Cowork on Windows and seeing "VM service not running." What does this mean and how can I fix it?

"VM service not running" indicates that the Claude VM Service (CoworkVMService) isn't available. This can happen if you installed Cowork via the older .exe/Squirrel installer instead of MSIX, or the Windows service is stopped. To fix this, reinstall from our download page, or start "Claude VM Service" in services.msc / `sc start CoworkVMService` (or `CoworkVMServiceStore` for Microsoft Store installs).

I'm trying to start Cowork on Windows and seeing "EXDEV: cross-device link not permitted." What does this mean and how can I fix it?

This happens when the VM image download crosses a drive boundary. The most common cause of this issue is when the path Settings > System > Storage > "Where new content is saved" points at D:\ instead of C:\, which makes Windows symlink the MSIX package folder across drives. This can also be caused by AppData redirected to a network share via a roaming profile. To fix this, set storage back to C:\, uninstall then reinstall Cowork, and update to the latest desktop version (which downloads directly to the final drive).

Related Articles

Use Claude Cowork safely

Schedule recurring tasks in Claude Cowork

Assign tasks from anywhere in Claude Cowork

Let Claude use your computer in Cowork

Claude Cowork desktop architecture overview

