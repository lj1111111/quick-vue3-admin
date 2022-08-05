<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { dicFormat, treeFormat } from '@/utils'
import QuickCrud from '@/components/QuickCrud/index.vue'
import { Column, Actionbar, Toolbar } from '@/types/table'
import { Dictionary } from '@/types/dictionary'
import { FormItem } from '@/types/form'
import { Options } from '@/types/options'
import { Tree } from '@/types/tree'
import { getDictionaryTypeList } from '@/api/dictionaryType'
import {
  getDictionaryList,
  addDictionary,
  updateDictionary,
  deleteDictionary,
} from '@/api/dictionary'
import { LeftTree } from '../../types/tree'

/**
 * 常规属性
 */
const dicTypeList = reactive<Array<Options>>([])
const treeDataList = reactive<Array<Tree>>([])
const dataList = reactive<Array<Dictionary>>([])
const currentTreeData = ref<Tree>({
  id: '',
  label: '',
  children: [],
})
/**
 * 表单
 */
const dialogTitle = reactive({
  add: '创建字典',
  edit: '修改字典',
  detail: '字典详情',
})
const formModel = reactive<Dictionary>({
  id: '',
  dicTypeId: '',
  dicId: '',
  name: '',
})
const formItems = reactive<Array<FormItem>>([
  {
    label: '字典编号',
    labelWidth: '80px',
    vModel: 'dicId',
    placeholder: '字典编号',
    editReadonly: true,
    prop: 'dicId',
    rules: [
      {
        required: true,
        message: '字典编号不能为空',
        trigger: 'blur',
      },
    ],
  },
  {
    label: '字典名称',
    labelWidth: '80px',
    vModel: 'name',
    placeholder: '字典名称',
    prop: 'name',
    rules: [
      {
        required: true,
        message: '字典名称不能为空',
        trigger: 'blur',
      },
    ],
  },
  {
    label: '字典类型',
    labelWidth: '80px',
    vModel: 'dicTypeId',
    placeholder: '字典类型',
    type: 'select',
    addDisabled: true,
    editDisabled: true,
    detailDisabled: true,
    options: dicTypeList,
    change: (val: string) => {
      console.log('change', val)
    },
  },
])
const handleFormSubmit = (form: Dictionary, done: any) => {
  console.log('handleFormSubmit', form)
  if (form.id) {
    updateDictionary(form).then(() => {
      ElMessage({
        type: 'success',
        message: '字典修改成功',
      })
      done()
    })
  } else {
    addDictionary(form).then(() => {
      ElMessage({
        type: 'success',
        message: '字典创建成功',
      })
      done()
    })
  }
}
/**
 * 工具栏
 */
const tableToolbar = reactive<Toolbar>({
  hiddenBatchDeleteButton: true,
  hiddenImportButton: true,
  hiddenExportButton: true,
  hiddenPrintButton: true,
})
/**
 * 表格
 */
const tableColumns = reactive<Array<Column>>([
  {
    width: '50',
    type: 'selection',
  },
  {
    label: '字典编号',
    prop: 'dicId',
    width: '200',
  },
  {
    label: '字典名称',
    prop: 'name',
  },
])
const handleDelete = (item: Dictionary, done: any) => {
  ElMessageBox.confirm(
    `你真的删除【${item.dictionaryName}】的字典吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    deleteDictionary(item.id).then(() => {
      ElMessage({
        type: 'success',
        message: '字典删除成功',
      })
      done()
    })
  })
}
const tableActionbar = reactive<Actionbar>({
  width: 300,
  hiddenDetailButton: true,
})
/**
 * 加载数据
 */
const load = (parmas: object) => {
  const { id } = currentTreeData.value
  getDictionaryList(id).then((res: any) => {
    const { data: dictionaryList } = res
    dataList.length = 0
    dataList.push(...dictionaryList)
  })
}
/**
 * 左树
 */
const leftTree = reactive<LeftTree>({
  treeData: [],
})
const treeLoad = (done: any) => {
  getDictionaryTypeList().then((res: any) => {
    const { data: dictionaryTypeList } = res
    const data = treeFormat(dictionaryTypeList, {
      id: 'dicTypeId',
      label: 'name',
      children: 'children',
    })
    treeDataList.length = 0
    treeDataList.push(...data)
    leftTree.treeData.length = 0
    leftTree.treeData.push(...treeDataList)
    const data1 = dicFormat(dictionaryTypeList, {
      value: 'dicTypeId',
      label: 'name',
    })
    dicTypeList.length = 0
    dicTypeList.push(...data1)

    currentTreeData.value.id = treeDataList[0].id
    done(currentTreeData.value.id)
  })
}
const handleTreeClick = (data: Tree, done: any) => {
  currentTreeData.value = data
  done()
}
</script>
<template>
  <quick-crud
    :dialog-title="dialogTitle"
    :form-model="formModel"
    :form-items="formItems"
    :table-data="dataList"
    :table-columns="tableColumns"
    :table-actionbar="tableActionbar"
    :table-toolbar="tableToolbar"
    dialog-titles="dialogTitles"
    :left-tree="leftTree"
    @on-load="load"
    @on-tree-load="treeLoad"
    @on-tree-click="handleTreeClick"
    @on-form-submit="handleFormSubmit"
    @on-delete="handleDelete"
  ></quick-crud>
</template>