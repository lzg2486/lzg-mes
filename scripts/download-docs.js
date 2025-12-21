import { execSync } from 'child_process';
import { existsSync, rmSync, mkdirSync, copyFileSync, readdirSync } from 'fs';
import { join } from 'path';

const TEMP_DIR = 'temp_element_plus';
const TARGET_DIR = '.mcontext';
const REPO_URL = 'https://github.com/element-plus/element-plus.git';
const BRANCH = 'dev';
const SOURCE_DIR = join(TEMP_DIR, 'docs', 'en-US');

console.log('📥 开始下载 Element Plus 最新文档...');

try {
  // 删除临时目录（如果存在）
  if (existsSync(TEMP_DIR)) {
    console.log('🗑️  清理旧的临时目录...');
    rmSync(TEMP_DIR, { recursive: true, force: true });
  }

  // 克隆仓库
  console.log('⬇️  正在克隆 Element Plus 仓库...');
  execSync(
    `git clone --branch ${BRANCH} --depth 1 ${REPO_URL} ${TEMP_DIR}`,
    { stdio: 'inherit' }
  );

  // 检查源目录是否存在
  if (!existsSync(SOURCE_DIR)) {
    throw new Error(`源目录不存在: ${SOURCE_DIR}`);
  }

  // 删除目标目录（如果存在）
  if (existsSync(TARGET_DIR)) {
    console.log('🗑️  清理旧的文档目录...');
    rmSync(TARGET_DIR, { recursive: true, force: true });
  }

  // 创建目标目录
  mkdirSync(TARGET_DIR, { recursive: true });

  // 复制文件函数
  function copyRecursive(src, dest) {
    const entries = readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = join(src, entry.name);
      const destPath = join(dest, entry.name);

      if (entry.isDirectory()) {
        mkdirSync(destPath, { recursive: true });
        copyRecursive(srcPath, destPath);
      } else {
        copyFileSync(srcPath, destPath);
      }
    }
  }

  // 复制文件
  console.log('📋 正在复制文档文件...');
  copyRecursive(SOURCE_DIR, TARGET_DIR);

  // 删除临时目录
  console.log('🗑️  清理临时文件...');
  rmSync(TEMP_DIR, { recursive: true, force: true });

  console.log('✅ 文档下载完成！');
} catch (error) {
  console.error('❌ 下载文档时出错:', error.message);
  
  // 清理临时目录
  if (existsSync(TEMP_DIR)) {
    rmSync(TEMP_DIR, { recursive: true, force: true });
  }
  
  process.exit(1);
}

