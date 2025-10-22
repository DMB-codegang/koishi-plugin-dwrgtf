import { Context, Schema, h } from 'koishi'
import { } from 'koishi-plugin-puppeteer'

import fs from 'fs';
import path from 'path';

export async function tfToBigimage(ctx: Context, name: string): Promise<string> {
  if (!ctx.puppeteer) return 'puppeteer异常';

  const configPath = path.join(__dirname, 'assets', 'config.json');
  const configContent = fs.readFileSync(configPath, 'utf8')
  const config = JSON.parse(configContent)

  const page = await ctx.puppeteer.browser.newPage()
  await page.goto('https://web.homeworkkun.top/%E5%A4%A9%E8%B5%8B%E6%A0%91/', { waitUntil: 'networkidle2' })

  await page.locator('#add-point-toggle-btn').click()
  await page.locator('.control-btn').click()

  // 遍历config.json中的节点，寻找name一致的节点并取出id
  let id = ''
  config.survivor.treeData.nodes.forEach(node => {
    if (node.name != name) return;
    id = node.id
  })
  if (id == '') return '未找到该节点';

  await page.locator(`#skill-node-${id}`).click()
  await page.locator(`#skill-node-${id}`).click()
  await new Promise(r => setTimeout(r, 500));
  
  const element = await page.$("#skill-tree-svg");
  await page.evaluate(() => {
    let buttons = document.querySelectorAll('#mode-switch-btn,#removed-talents-btn,#controls-container');
    buttons.forEach(btn => btn.remove());
  });
  const outputImageBase64 = await element.screenshot({
    type: "jpeg",  // 使用 JPEG 格式
    encoding: "base64",
  })
  await page.close();
  return `data:image/jpeg;base64,${outputImageBase64}`;
}

