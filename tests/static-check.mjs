import {readFileSync, existsSync} from 'node:fs';
import assert from 'node:assert/strict';
const html=readFileSync('index.html','utf8');
const css=readFileSync('src/style.css','utf8');
const js=readFileSync('src/app.js','utf8');
const responsive=readFileSync('src/adaptive.css','utf8');
assert(html.includes('id="desk"')&&html.includes('id="panelContent"'));
assert(js.includes('zhuri-open-v1')&&js.includes('exportData'));
assert(js.includes('timeStatus')&&js.includes('validTime'));
assert(css.includes('color-scheme:dark')&&css.includes('prefers-color-scheme:light'));
assert(html.includes('src/adaptive.css') && responsive.includes('@container planner'), 'responsive styles enabled');
assert(readFileSync('sw.js','utf8').includes('src/adaptive.css'), 'responsive CSS cached');
for (const doc of ['01-mac-local','02-github-pages','03-how-to-use','04-troubleshooting','05-data-and-privacy','06-screen-support']) assert(existsSync(`docs/${doc}.md`));
for(const source of [html,css,js]){
 assert(!/<script[^>]*src=["']https?:\/\//i.test(source),'No remote scripts allowed');
 assert(!/api[_-]?key\s*[:=]/i.test(source),'No inline API keys allowed');
 assert(!/https?:\/\/[^\s]+@/i.test(source),'No embedded credentials allowed');
}
assert(existsSync('LICENSE'));
assert(existsSync('sw.js')&&existsSync('manifest.webmanifest'));
assert(JSON.parse(readFileSync('manifest.webmanifest','utf8')).name);
console.log('PASS: static structure, local first, system theme, no remote scripts/API keys');
