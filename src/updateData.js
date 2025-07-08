const fs = require('fs');
const path = require('path');

// 读取文件
const dataPath = path.join(__dirname, 'data.ts');
const configPath = path.join(__dirname, 'assets', 'config.json');

const dataContent = fs.readFileSync(dataPath, 'utf8');
const configContent = fs.readFileSync(configPath, 'utf8');

// 解析JSON
const config = JSON.parse(configContent);
let data = dataContent;

// 遍历config.json中的节点
config.survivor.treeData.nodes.forEach(node => {
  if (!node.name) return;
  console.log(`当前节点：${node.name}`)
  // 在data.ts中查找匹配的name属性
  const regex = new RegExp(`\\"name\\":\\"${node.name}\\"`);
  console.log(`当前正则：${regex}`)
  if (regex.test(data)) {
    // 找到匹配项，添加id2属性
    console.log(`【找到匹配项】：${node.name}`)
    data = data.replace(
      regex,
      `\"name\":\"${node.name}\",\"id2\":\"${node.id}\"`
    );
  }
});

// 写入更新后的文件
fs.writeFileSync(dataPath, data);
console.log('data.ts updated successfully');