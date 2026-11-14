Start a project and add Motion
THE ANIMATION LIBRARY
Framer Motion is now simply called Motion — same library, new name. Copy the install command from motion.dev, or
just use the lines below.
npm create vite@latest my-site -- --template react
cd my-site && npm install
npm install motion
npm run dev # opens your site at localhost:5173
• In your code, import it as import { motion } from "motion/react" (the old framer-motion path still works,
but is outdated).
• Leave npm run dev running in a second terminal tab so you see every change live in the browser.
3 Turn on a UI/UX skill
YOUR DESIGN BRAIN
A skill is a plain text file of instructions that teaches Claude Code how you want things designed — spacing, type scale,
colour, motion. Once it is in place, every page it builds follows the same standard.
my-site/.claude/skills/ui-ux-pro-max/SKILL.md
# put it in ~/.claude/skills/ to use it in every project
• Then simply ask in plain English: “Use the ui-ux pro max skill to design this page.”
• Type /plugin inside Claude Code to browse ready-made skill and plugin collections.
4 Pull components from 21st.dev
THE FUN PART
21st.dev is a library of ready-made React sections — heroes, navbars, pricing tables, testimonials. Each one has a Copy
prompt button.
• Find a component you like fi click Copy prompt fi paste it into Claude Code.
• Add one line of your own: “Add this as the hero section and use my brand colours.”
• Build one section at a time: navbar fi hero fi features fi testimonials fi pricing fi footer.
• Look at the browser after each one and tell Claude what to change. That back-and-forth is the workflow.
Page 1 of 2
Build Websites with Claude Code
Build Websites with Claude Code Page 2 of 2
PART TWO
Polish it, ship it, sell it
A starter prompt you can copy
Build the hero section for a [type of business] landing page.
Use the ui-ux pro max skill. Stack: React + Vite + Motion
(import from "motion/react"). Include a headline, one line of
supporting text and a single call-to-action button. Fade the
content up on load. It must look right on a phone.
The loop you will repeat all day
ASK
Describe one section in plain
English.
LOOK
Check it in the browser at
localhost.
FIX
Tell Claude exactly what feels
wrong.
SAVE
Commit to git so you can
always go back.
Putting it online
• Run npm run build to create the final files.
• Push the folder to GitHub.
• Deploy free on Vercel or Netlify — both connect straight to
the repo and give you HTTPS.
• Point the client’s domain at it and hand over the login details.
Commands worth memorising
claude
# start Claude in this folder
npm run dev
# preview while you work
git commit -am "hero done"
# a save point you can return to
Check these before you charge for it
Looks right on a real phone, not a resized window
Loads in under three seconds
Real text and real images — no lorem ipsum
Contact form or WhatsApp button actually works
Page title, meta description and favicon set
Live on the client’s domain with HTTPS
If something goes wrong
• Claude Code will not start. Run claude doctor — it
checks the install and tells you the fix.
• The site will not run. Copy the red error text from the
terminal and paste it straight into Claude Code. It reads errors
better than you do.
• The design looks off. Do not say “make it better”. Say what
is wrong: “the heading is too large and the spacing above the
button is tight”.
• Claude broke something that worked. This is what git is
for — revert to your last commit and try a smaller instruction.
An honest word about the Rs 1,00,000 website
A single animated landing page built in an afternoon rarely sells for a lakh, and promising one is the fastest way to lose a
client. What does reach that price is scope plus outcome: a multi-page site with real copywriting, a CMS the client can edit,
SEO, analytics, forms wired into their CRM, and a month of support. So start smaller. Build two or three genuinely good sites
cheap or free, use them as your portfolio, quote in writing, and take half the fee upfront. These tools let you deliver in days
what used to take weeks — that speed is your margin, and it compounds with every site you finish.
Where to look things up:   code.claude.com/docs  ·  motion.dev  ·  21st.dev  ·  vercel.com
Now go and build the ugly first one. The second one will be good