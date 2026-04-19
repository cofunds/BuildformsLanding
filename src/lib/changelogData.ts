/**
 * Changelog copy — edit this file to add or update releases (no MDX).
 * Entries are sorted by `id` (YYYY-MM-DD) newest-first at render time.
 */

export type ChangelogDetailBullet =
	| { kind: 'rich'; label: string; detail: string }
	| { kind: 'plain'; text: string };

export type ChangelogSection = {
	title: string;
	bullets: ChangelogDetailBullet[];
};

export type ChangelogEntry = {
	/** Sort key; use YYYY-MM-DD to match release date */
	id: string;
	date: string;
	title: string;
	description: string;
	version?: string;
	tags: string[];
	highlights: Array<{ label: string; detail: string }>;
	sections?: ChangelogSection[];
};

export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
	{
		id: '2026-04-19',
		date: '2026-04-19',
		title: 'Content Marketing, Builder Tweaks & Dashboard AI',
		description:
			'New blog system on the landing page, drag-and-drop option reordering in the form builder, and AI form creation now accessible from the dashboard and forms page.',
		version: '1.2',
		tags: ['Content', 'Forms', 'AI', 'Bug Fixes'],
		highlights: [
			{ label: 'Blog Launched', detail: 'server-rendered, SEO-optimized blog now live on the landing page' },
			{ label: 'Option Reordering', detail: 'drag to reorder choices inside multiple-choice and checkbox questions' },
			{ label: 'Dashboard AI', detail: 'create forms with AI directly from the dashboard and forms listing page' },
		],
		sections: [
			{
				title: 'Features',
				bullets: [
					{
						kind: 'rich',
						label: 'Blog Architecture',
						detail:
							'implemented a full blog system on the Astro landing page with server-rendered posts that are fully SEO-optimized and crawlable',
					},
					{
						kind: 'rich',
						label: 'Builder Enhancements',
						detail:
							'added drag-and-drop reordering of options within multiple-choice and checkbox questions directly inside the form builder',
					},
					{
						kind: 'rich',
						label: 'Dashboard AI',
						detail:
							'AI-powered form creation is now accessible directly from the main dashboard and the forms listing page, no longer limited to the editor',
					},
				],
			},
			{
				title: 'Bug Fixes',
				bullets: [
					{ kind: 'plain', text: 'Resolved various minor application bugs reported by the beta community' },
				],
			},
		],
	},
	{
		id: '2026-04-11',
		date: '2026-04-11',
		title: 'Deep AI Reports & Astro Landing Page',
		description:
			'Comprehensive automated reporting via FRED and a blazing-fast new landing page architecture rebuilt in Astro for better SEO and SSR.',
		version: '1.1',
		tags: ['AI', 'FRED', 'SEO', 'Infrastructure'],
		highlights: [
			{ label: 'Deep Reports via FRED', detail: 'generate full structured analysis reports and receive them by email' },
			{ label: 'Landing Page Separated', detail: 'the marketing site is now a standalone codebase rebuilt in Astro' },
			{ label: 'App Moved to beta.buildforms.so', detail: 'the core application now lives at its dedicated beta domain' },
			{ label: 'Updated OG Images', detail: 'social preview images refreshed across the platform' },
		],
		sections: [
			{
				title: 'Features',
				bullets: [
					{
						kind: 'rich',
						label: 'Deep Reports',
						detail:
							"FRED can now run a full deep analysis of a form's responses and generate a structured report covering trends, outliers, sentiment, and key takeaways, with an option to email the report directly to you",
					},
					{
						kind: 'rich',
						label: 'Infrastructure Split',
						detail:
							'successfully separated the marketing landing page from the core web application into independent codebases for cleaner deployments and easier updates',
					},
					{
						kind: 'rich',
						label: 'Astro Rewrite',
						detail:
							'completely rewrote the landing page using Astro to drastically improve SEO and Server-Side Rendering (SSR) capabilities, resulting in faster page loads and fully crawlable content',
					},
					{
						kind: 'rich',
						label: 'Domain Migration',
						detail: 'moved the core application to beta.buildforms.so to clearly reflect its current beta stage',
					},
					{
						kind: 'rich',
						label: 'Brand Updates',
						detail:
							'updated Open Graph (OG) images across both the landing page and the application for refreshed social previews',
					},
				],
			},
		],
	},
	{
		id: '2026-04-05',
		date: '2026-04-05',
		title: 'Generative UI & Automated Workflows',
		description:
			'Smarter AI interfaces with generative UI and page-context awareness, plus automated email communication workflows triggered on form submission.',
		version: '1.0',
		tags: ['AI', 'FRED', 'Email', 'Automation'],
		highlights: [
			{ label: 'Generative UI in FRED', detail: 'analysis results now render as interactive charts, tables, and summaries' },
			{ label: 'Page-Context Awareness', detail: 'FRED knows where you are in the app and responds accordingly' },
			{ label: 'Email Templates', detail: 'automated emails fire on form submission with fully customizable templates' },
		],
		sections: [
			{
				title: 'Features',
				bullets: [
					{
						kind: 'rich',
						label: 'Generative UI',
						detail:
							"improved FRED's interface to dynamically generate UI elements during form and workspace analysis, replacing plain text responses with interactive charts, tables, and structured summaries",
					},
					{
						kind: 'rich',
						label: 'Context Awareness',
						detail:
							'implemented page-context tracking so FRED understands exactly where you are in the application and tailors its responses without you needing to explain your context',
					},
					{
						kind: 'rich',
						label: 'Email Automation',
						detail:
							'added customizable email templates for automated responses upon form submission, supporting dynamic fields from submission data and delivery to respondents, your team, or both',
					},
				],
			},
		],
	},
	{
		id: '2026-03-29',
		date: '2026-03-29',
		title: 'Inbox Enhancements & Routing Fixes',
		description: 'Completing the two-way inbox communication loop and stabilizing section-based form routing logic.',
		version: '0.9',
		tags: ['Inbox', 'Bug Fixes'],
		highlights: [
			{ label: 'Inbound Communication', detail: 'respondents can now reply, completing the two-way inbox loop' },
			{ label: 'Inbox UI Overhaul', detail: 'the communications interface has been significantly cleaned up' },
			{ label: 'Routing Stabilization', detail: 'multiple edge cases in section-based routing have been resolved' },
		],
		sections: [
			{
				title: 'Features',
				bullets: [
					{
						kind: 'rich',
						label: 'Full Inbox Functionality',
						detail:
							'implemented inbound communication capabilities, allowing respondents to reply to your messages for full two-way conversation threads',
					},
					{
						kind: 'rich',
						label: 'UI Updates',
						detail:
							'polished and updated the user interface for the communications inbox, addressing the rough state from the initial beta release',
					},
				],
			},
			{
				title: 'Bug Fixes',
				bullets: [
					{ kind: 'plain', text: 'Fixed forms with circular section references causing infinite routing loops' },
					{ kind: 'plain', text: 'Resolved sections being skipped incorrectly under certain branching conditions' },
					{
						kind: 'plain',
						text: 'Corrected submission data not accurately reflecting the actual path taken by the respondent',
					},
				],
			},
		],
	},
	{
		id: '2026-03-21',
		date: '2026-03-21',
		title: 'Advanced AI Analytics & Logical Routing',
		description:
			'Powerful new AI capabilities for workspace and submission analysis, alongside the introduction of section-based conditional form logic.',
		version: '0.8',
		tags: ['AI', 'FRED', 'Forms', 'Beta'],
		highlights: [
			{ label: 'FRED Analytics (Beta)', detail: 'FRED can now analyze workspaces and individual form submissions' },
			{ label: 'Section-Based Routing', detail: 'build logic-driven forms that branch based on respondent answers' },
			{ label: 'Automated Pro Accounts', detail: 'beta testers now automatically receive Pro plan access' },
		],
		sections: [
			{
				title: 'Features',
				bullets: [
					{
						kind: 'rich',
						label: 'FRED Analytics (Beta)',
						detail:
							'upgraded FRED to analyze workspaces (response trends, form performance) and individual form submissions; early release with known rough edges',
					},
					{
						kind: 'rich',
						label: 'Logical Routing',
						detail:
							'implemented section-based routing to create advanced logic-driven forms, enabling conditional branching, skip patterns, and multi-path surveys based on user responses',
					},
					{
						kind: 'rich',
						label: 'Beta Automation',
						detail: 'automated the provisioning of Pro accounts for our beta testing group, no manual steps required',
					},
				],
			},
			{
				title: 'Bug Fixes & Notes',
				bullets: [
					{
						kind: 'plain',
						text: 'Initial release of FRED submission analysis has known bugs that will be addressed in the next patch',
					},
				],
			},
		],
	},
	{
		id: '2026-03-14',
		date: '2026-03-14',
		title: 'Access Control, Inbox Beta & Google Forms Import',
		description:
			'Enhancing security with role-based access control, introducing team communication tools, and providing migration support from Google Forms.',
		version: '0.7',
		tags: ['Permissions', 'Inbox', 'Integrations'],
		highlights: [
			{ label: 'Role-Based Access Control', detail: 'assign viewer, editor, or admin roles per form' },
			{ label: 'Inbox (Beta)', detail: 'outbound messaging to form respondents is now live' },
			{ label: 'Google Forms Import', detail: 'bring over your existing Google Forms along with their submissions' },
		],
		sections: [
			{
				title: 'Features',
				bullets: [
					{
						kind: 'rich',
						label: 'Advanced Invitations and RBAC',
						detail:
							'implemented fine-grained Role-Based Access Control for form invitations, allowing specific people to be invited at the form level with viewer, editor, or admin roles',
					},
					{
						kind: 'rich',
						label: 'Google Forms Importer',
						detail: 'added a tool to import existing Google Forms along with their question structure and historical submissions',
					},
					{
						kind: 'rich',
						label: 'Basic Inbox (Beta)',
						detail:
							'launched early outbound communication capabilities, allowing you to send messages to form respondents from within Buildforms',
					},
				],
			},
			{
				title: 'Bug Fixes & Notes',
				bullets: [
					{
						kind: 'plain',
						text:
							'The Inbox UI is currently in an early state and only supports outbound messaging -> inbound replies and UI improvements are planned for the next release',
					},
				],
			},
		],
	},
	{
		id: '2026-03-09',
		date: '2026-03-09',
		title: 'Team Collaboration & Editor AI',
		description:
			'Expanding team capabilities with workspace invitations and bringing FRED directly into the form editing environment.',
		version: '0.6',
		tags: ['Teams', 'Workspaces', 'FRED'],
		highlights: [
			{ label: 'Workspace Invitations', detail: 'invite team members by email to collaborate within your workspace' },
			{ label: 'Team Usage Tracking', detail: 'usage limits and consumption are now tracked at the team level' },
			{ label: 'FRED in the Editor', detail: 'access the AI assistant directly inside the form builder' },
		],
		sections: [
			{
				title: 'Features',
				bullets: [
					{
						kind: 'rich',
						label: 'Workspace Invites',
						detail:
							'users can now invite team members to collaborate within specific workspaces via email, giving them access to all forms inside',
					},
					{
						kind: 'rich',
						label: 'Team Usage Tracking',
						detail:
							'expanded the usage and limit tracking system to accommodate team-based consumption, with collective visibility over plan usage',
					},
					{
						kind: 'rich',
						label: 'Editor AI',
						detail:
							'integrated FRED directly into the form editor so you can ask it to add questions, restructure sections, or get suggestions without leaving the builder',
					},
				],
			},
		],
	},
	{
		id: '2026-03-01',
		date: '2026-03-01',
		title: 'Architecture Upgrade: Convex Migration & Real-Time Sync',
		description: 'A major backend architectural shift to enable seamless real-time collaboration across the platform.',
		version: '0.5',
		tags: ['Infrastructure', 'Real-time', 'Dashboard'],
		highlights: [
			{ label: 'Supabase to Convex Migration', detail: 'the entire backend data layer has been moved to Convex' },
			{ label: 'Real-Time Form Sync', detail: 'changes in the form editor now sync instantly across all open sessions' },
			{ label: 'Live Dashboard', detail: 'submission counts, active forms, and workspace activity update in real time' },
		],
		sections: [
			{
				title: 'Features',
				bullets: [
					{
						kind: 'rich',
						label: 'Convex Migration',
						detail:
							'successfully transitioned our backend infrastructure from Supabase to Convex, covering auth, storage, queries, and mutations for improved speed and scalability',
					},
					{
						kind: 'rich',
						label: 'Real-Time Forms',
						detail:
							'implemented real-time synchronization in the form builder so changes reflect instantaneously across all open tabs and collaborators',
					},
					{
						kind: 'rich',
						label: 'Live Dashboard',
						detail:
							'upgraded the main dashboard to reflect real-time data including submission counts, active forms, and workspace activity without requiring a page refresh',
					},
				],
			},
		],
	},
	{
		id: '2026-02-28',
		date: '2026-02-28',
		title: 'Introducing FRED: AI-Powered Form Creation',
		description:
			'Bringing artificial intelligence to the platform with our new AI chatbot FRED, alongside advanced token tracking and AI-assisted form generation.',
		version: '0.4',
		tags: ['AI', 'FRED', 'Forms'],
		highlights: [
			{ label: 'Meet FRED', detail: 'our in-app AI chatbot is live and ready to help you build' },
			{ label: 'AI Form Creation', detail: 'describe your form in plain language and FRED generates it for you' },
			{ label: 'Token Tracking', detail: 'advanced usage tracking for AI consumption per account' },
		],
		sections: [
			{
				title: 'Features',
				bullets: [
					{
						kind: 'rich',
						label: 'FRED Chatbot',
						detail: 'started the implementation of our intelligent assistant to help users navigate and build within the platform',
					},
					{
						kind: 'rich',
						label: 'AI Form Creation',
						detail:
							'users can now generate complete forms from simple text prompts using AI, making form building significantly faster',
					},
					{
						kind: 'rich',
						label: 'Token Management',
						detail: 'implemented advanced tracking for AI tokens to monitor and manage AI usage effectively per account',
					},
				],
			},
		],
	},
	{
		id: '2026-02-22',
		date: '2026-02-22',
		title: 'DODO Payments & Usage Tracking',
		description: 'Integration of robust payment processing and comprehensive usage monitoring systems.',
		version: '0.3',
		tags: ['Payments', 'Infrastructure'],
		highlights: [
			{ label: 'DODO Payments Integration', detail: 'laying the groundwork for paid plans and subscription management' },
			{ label: 'Usage Tracking Deployed', detail: 'full visibility over submission counts, feature usage, and plan limits per workspace' },
		],
		sections: [
			{
				title: 'Features',
				bullets: [
					{
						kind: 'rich',
						label: 'Payment Infrastructure',
						detail:
							'began the implementation of DODO Payments to handle future subscriptions and transactions, including checkout flow and webhook handling',
					},
					{
						kind: 'rich',
						label: 'Usage Tracking',
						detail:
							'deployed a new tracking system providing users with robust control and visibility over their usage limits including form submissions, response counts, and feature usage per workspace',
					},
				],
			},
		],
	},
	{
		id: '2026-02-15',
		date: '2026-02-15',
		title: 'Advanced Question Types & Form Theming',
		description:
			'Enhancing form customization with new interactive question types, visual theming, and public-facing workspace pages.',
		version: '0.2',
		tags: ['Forms', 'Theming', 'Workspaces'],
		highlights: [
			{ label: 'New Question Types', detail: 'video upload and custom link questions now available' },
			{ label: 'Theme Editor Launched', detail: 'customize colors, fonts, and backgrounds to match your brand' },
			{ label: 'Public Workspace Pages', detail: 'each workspace now has a public-facing page listing all published forms' },
		],
		sections: [
			{
				title: 'Features',
				bullets: [
					{ kind: 'rich', label: 'New Question Types', detail: 'added support for video upload questions and custom link questions' },
					{
						kind: 'rich',
						label: 'Form Theming',
						detail:
							'implemented design controls allowing users to customize the visual appearance of their forms including colors, fonts, and backgrounds',
					},
					{
						kind: 'rich',
						label: 'Public Workspaces',
						detail: 'deployed public-facing workspace pages for easier sharing and accessibility',
					},
				],
			},
			{
				title: 'Bug Fixes',
				bullets: [{ kind: 'plain', text: 'Resolved minor rendering bugs associated with public form views' }],
			},
		],
	},
	{
		id: '2026-02-07',
		date: '2026-02-07',
		title: 'Initial Beta Release: Forms & Workspaces',
		description:
			'The foundational release of our platform, introducing core form building capabilities and workspace management.',
		version: '0.1',
		tags: ['Launch', 'Forms', 'Workspaces'],
		highlights: [
			{ label: 'Form Builder Launched', detail: 'create forms with core question types including text, multiple choice, and checkboxes' },
			{ label: 'Workspaces Introduced', detail: 'every account gets a workspace to organize and publish forms' },
			{ label: 'Public Forms Live', detail: 'respondents can open a link and submit responses instantly' },
		],
		sections: [
			{
				title: 'Features',
				bullets: [
					{
						kind: 'rich',
						label: 'Basic Form Builder',
						detail:
							'create simple forms with standard question types including short text, long text, multiple choice, and checkboxes',
					},
					{
						kind: 'rich',
						label: 'Workspaces',
						detail: 'initial setup for creating and managing isolated workspaces for different projects',
					},
					{
						kind: 'plain',
						text: 'Public form sharing via link, allowing respondents to submit responses without an account',
					},
				],
			},
		],
	},
];
