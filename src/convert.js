const fs = require('fs');
const path = require('path');

// 读取config.json
const configPath = path.join(__dirname, 'config.json');
const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

// 转换函数
function transformData(data) {
  const result = {
    survivor: {
      name: data.survivor.name,
      treeData: {}
    }
  };

  // 转换节点数据
  const nodes = data.survivor.treeData.nodes;
  const centerNode = nodes.find(n => n.isCenter);
  
  // 构建层级结构
  // ... 转换逻辑实现 ...
  
  return result;
}

// 执行转换并写入新文件
const transformedData = transformData(configData);
const outputPath = path.join(__dirname, 'transformed_data.ts');
fs.writeFileSync(outputPath, `export const tf = ${JSON.stringify(transformedData, null, 2)};`);