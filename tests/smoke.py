"""Run offline browser smoke tests: python3 tests/smoke.py.

Because sandboxed CI environments may prohibit HTTP/file navigation, assets are
inlined into an about:blank document for testing. Production uses local files.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
html=(ROOT/'index.html').read_text()
css=(ROOT/'src/style.css').read_text() + '\n' + (ROOT/'src/adaptive.css').read_text()
js=(ROOT/'src/app.js').read_text()
html=html.replace('<link rel="stylesheet" href="./src/style.css">',f'<style>{css}</style>')
html=html.replace('<script src="./src/app.js" defer></script>','')
html=html.replace('</body>',f'<script>{js}</script></body>')
FAKE_STORAGE="""window._memoryStore = window._memoryStore || {};
Object.defineProperty(window, 'localStorage', {configurable:true, value:{
 getItem(k){return window._memoryStore[k] ?? null},
 setItem(k,v){window._memoryStore[k]=String(v)},
 removeItem(k){delete window._memoryStore[k]}
}});"""

def open_app(browser, scheme):
    ctx=browser.new_context(viewport={'width':1512,'height':982},color_scheme=scheme,accept_downloads=True)
    pg=ctx.new_page()
    pg.goto('about:blank')
    pg.evaluate(FAKE_STORAGE)
    pg.set_content(html,wait_until='load')
    return ctx,pg

with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    ctx,page=open_app(browser,'light')
    errors=[]
    page.on('pageerror',lambda exc:errors.append(str(exc)))
    assert '欢迎使用逐日' in page.locator('#panelHeading').inner_text()
    page.get_by_role('button',name='载入通用示例').click()
    assert '每日时间表' in page.locator('#panelHeading').inner_text()
    assert page.locator('tbody tr').count()==5
    page.screenshot(path=str(ROOT/'preview-light.png'))
    page.locator('tbody tr').first.click()
    assert '时段详情' in page.locator('#panelFooter').inner_text()
    page.locator('[data-action="edit-time"]').click()
    page.locator('#scheduleForm [name="title"]').fill('测试任务')
    page.locator('#scheduleForm button[type=submit]').click()
    assert '测试任务' in page.locator('.table').inner_text()
    page.get_by_role('button',name='查看全部').click()
    assert page.locator('#panelHeading h2').inner_text()=='我的计划'
    page.locator('#panelContent [data-project]').first.click()
    assert '示例：一周计划' in page.locator('#panelHeading').inner_text()
    page.locator('[data-stage]').first.click()
    page.locator('[data-check]').first.click()
    assert page.locator('.item.done').count()==1
    saved=page.evaluate('localStorage.getItem("zhuri-open-v1")')
    assert '"done":true' in saved
    page.locator('[data-action="back"]').click()
    assert page.locator('#panelHeading h2').inner_text()=='示例：一周计划'
    page.locator('[data-action="back"]').click()
    assert page.locator('#panelHeading h2').inner_text()=='我的计划'
    page.locator('[data-action="back"]').click()
    assert page.locator('#panelHeading h2').inner_text()=='每日时间表'
    page.locator('#resizer').focus()
    page.keyboard.press('End')
    assert page.locator('#resizer').get_attribute('aria-valuenow')=='0'
    page.keyboard.press('ArrowLeft')
    assert page.locator('#resizer').get_attribute('aria-valuenow')=='1'
    page.screenshot(path=str(ROOT/'preview-expanded.png'))
    assert not errors, errors
    dark,dp=open_app(browser,'dark')
    dp.get_by_role('button',name='载入通用示例').click()
    dp.screenshot(path=str(ROOT/'preview-dark.png'))
    print('PASS: onboarding, demo, six-column timetable, edit, plans, checklist, save, back navigation, resize, light/dark, no JS errors')
    browser.close()
