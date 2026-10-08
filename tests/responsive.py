"""Responsive smoke test for multiple simulated MacBook CSS viewport sizes.
Run: python3 tests/responsive.py (requires playwright + Chromium).
This validates layout in a browser, not physical MacBook/Plash support.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
html=(ROOT/'index.html').read_text(encoding='utf-8')
css=(ROOT/'src/style.css').read_text(encoding='utf-8')+'\n'+(ROOT/'src/adaptive.css').read_text(encoding='utf-8')
js=(ROOT/'src/app.js').read_text(encoding='utf-8')
html=html.replace('<link rel="stylesheet" href="./src/style.css">',f'<style>{css}</style>')
html=html.replace('<link rel="stylesheet" href="./src/adaptive.css">','')
html=html.replace('<script src="./src/app.js" defer></script>','')
html=html.replace('</body>',f'<script>{js}</script></body>')
store="""Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem(){return null},setItem(){},removeItem(){}}});"""
SIZES=[(1024,768),(1280,800),(1440,900),(1512,982),(1728,1117),(1920,1080),(960,640)]
with sync_playwright() as pw:
    b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    for width,height in SIZES:
        ctx=b.new_context(viewport={'width':width,'height':height})
        p=ctx.new_page();p.goto('about:blank');p.evaluate(store);p.set_content(html,wait_until='load')
        p.get_by_role('button',name='载入通用示例').click()
        sizes=p.evaluate('''() => ({body:document.body.scrollWidth,viewport:innerWidth, panel:document.querySelector('.panel').getBoundingClientRect().width, workspace:document.querySelector('.workspace').getBoundingClientRect().width})''')
        assert sizes['body']<=sizes['viewport']+2,(width,height,sizes)
        assert sizes['panel']>=250,(width,height,sizes)
        assert p.locator('.table thead th').count()==6,(width,height)
        print(f'PASS {width}x{height}: width={sizes["workspace"]:.0f}, panel={sizes["panel"]:.0f}')
        ctx.close()
    b.close()
