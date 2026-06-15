<template>
  <div>
    <el-row :gutter="16" class="stat-cards">
      <el-col :span="6" v-for="card in statCards" :key="card.label">
        <el-card shadow="never">
          <div class="stat-card">
            <div class="stat-value">{{ card.value }}</div>
            <div class="stat-label">{{ card.label }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" style="margin-top: 16px">
      <template #header>最近分析记录</template>
      <el-table :data="recentList" stripe style="width: 100%">
        <el-table-column prop="prId" label="PR ID" width="100" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="riskLevel" label="风险等级" width="120">
          <template #default="{ row }">
            <el-tag :type="riskTagType[row.riskLevel]">{{ row.riskLevel }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="分析时间" width="180" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
const statCards = [
  { label: '今日分析 PR', value: 128 },
  { label: '高风险文件', value: 12 },
  { label: '平均风险分', value: '3.2' },
  { label: '累计分析', value: '2,048' },
]

const riskTagType: Record<string, 'success' | 'warning' | 'danger'> = {
  low: 'success',
  medium: 'warning',
  high: 'danger',
}

const recentList = [
  { prId: '#1024', title: 'feat: 新增用户权限模块', riskLevel: 'low', time: '2024-01-15 14:32' },
  { prId: '#1023', title: 'fix: 修复支付流程异常', riskLevel: 'high', time: '2024-01-15 13:10' },
  { prId: '#1022', title: 'refactor: 重构数据层', riskLevel: 'medium', time: '2024-01-15 11:45' },
]
</script>

<style scoped lang="less">
.stat-card {
  text-align: center;
  padding: 8px 0;

  .stat-value {
    font-size: 28px;
    font-weight: 700;
    color: #409eff;
  }

  .stat-label {
    font-size: 13px;
    color: #888;
    margin-top: 6px;
  }
}
</style>

