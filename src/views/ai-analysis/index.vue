<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <div style="display: flex; align-items: center; gap: 12px">
          <span>PR 文件列表</span>
          <el-input v-model="prId" placeholder="输入 PR ID" style="width: 160px" />
          <el-button type="primary" :loading="loading" @click="loadFiles">查询</el-button>
        </div>
      </template>

      <el-table :data="fileList" stripe style="width: 100%">
        <el-table-column prop="filename" label="文件路径" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType[row.status]" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="additions" label="+新增" width="80" />
        <el-table-column prop="deletions" label="-删除" width="80" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button text type="primary" @click="showAiContext(row.id)">AI 分析</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- AI 分析详情抽屉 -->
    <el-drawer v-model="drawerVisible" title="AI 分析结果" size="480px">
      <template v-if="aiContext">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="风险等级">
            <el-tag :type="riskTagType[aiContext.riskLevel]">{{ aiContext.riskLevel }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="摘要">{{ aiContext.summary }}</el-descriptions-item>
        </el-descriptions>
        <div style="margin-top: 16px">
          <p style="font-weight: 600; margin-bottom: 8px">优化建议</p>
          <el-alert
            v-for="(s, i) in aiContext.suggestions"
            :key="i"
            :title="s"
            type="info"
            :closable="false"
            style="margin-bottom: 8px"
          />
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import type { AiContext, PrFile } from '@/api/ai-analysis/prAnalysis';
import { getAiContext, getPrFiles } from '@/api/ai-analysis/prAnalysis';

const prId = ref('1')
const loading = ref(false)
const fileList = ref<PrFile[]>([])
const drawerVisible = ref(false)
const aiContext = ref<AiContext | null>(null)

const statusType: Record<string, 'success' | 'warning' | 'info'> = {
  added: 'success',
  modified: 'warning',
  deleted: 'info',
}

const riskTagType: Record<string, 'success' | 'warning' | 'danger'> = {
  low: 'success',
  medium: 'warning',
  high: 'danger',
}

async function loadFiles() {
  const id = Number(prId.value)
  if (!prId.value.trim() || isNaN(id) || id <= 0) {
    ElMessage.warning('请输入有效的 PR ID')
    return
  }
  loading.value = true
  try {
    const res = await getPrFiles(id, { page: 1, pageSize: 10 })
    fileList.value = res.list
  } finally {
    loading.value = false
  }
}

async function showAiContext(fileId: number) {
  try {
    aiContext.value = await getAiContext(Number(prId.value), fileId)
    drawerVisible.value = true
  } catch {
    ElMessage.error('获取 AI 分析失败')
  }
}

// 初始加载
loadFiles()
</script>

