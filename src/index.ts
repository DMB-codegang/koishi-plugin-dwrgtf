import { Context, Schema, h } from 'koishi'
import { } from 'koishi-plugin-puppeteer'

import { tfToBigimage } from './utils'
import { TFMAP } from './data'


export const name = 'dwrgtf'

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export const inject = {
  optional: ['puppeteer'],
}

export const usage = '- 使用命令`天赋 <天赋名>`来查询天赋信息'

export function apply(ctx: Context) {
  ctx.command('天赋 <TfName>').action(async ({ session }, TfName) => {
    function findTalent(node, name) {
      if (node.name === "root") {
        const L1res = findTalent(node.L1, name);
        if (L1res) return L1res;
        const L2res = findTalent(node.L2, name);
        if (L2res) return L2res;
        const L3res = findTalent(node.L3, name);
        if (L3res) return L3res;
        const L4res = findTalent(node.L4, name);
        if (L4res) return L4res;
        return null;
      };

      if (node.name === name) return node;

      if (node.childCount > 0) {
        for (let i = 1; i <= node.childCount; i++) {
          const result = findTalent(node[i], name);
          if (result) return result;
        }
      }

      // 检查特殊节点（如laster）
      if (node.laster) {
        const result = findTalent(node.laster, name);
        if (result) return result;
      }

      return null;
    }

    const talent = findTalent(TFMAP.survivor.treeData, TfName);
    if (talent) {
      let message = `天赋名称: ${talent.name} — ${talent.describe}${h('img', { src: 'https://web.homeworkkun.top/%E5%A4%A9%E8%B5%8B%E6%A0%91/img/' + talent.name + '.png' })}\n效果: ${talent.content}`
      const tfBigimage = await tfToBigimage(ctx, talent.name)
      if (tfBigimage != 'puppeteer异常' && tfBigimage != '未找到该节点') message += `\n位置：${h.image(tfBigimage)}`
      return message;
    } else {
      return `没有找到名为${TfName}的天赋`;
    }
  })
}
