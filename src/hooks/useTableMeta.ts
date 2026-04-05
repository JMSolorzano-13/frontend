import {useState} from 'react'
import {
  FilterValue,
  SorterResult,
  TablePaginationConfig,
} from 'antd/lib/table/interface'
import { numberPagination } from '@utils/global/numberPagination'

export type TableMeta<T> = {
  sorter: SorterResult<T>[]
  pagination: TablePaginationConfig
  parsedOptions: SearchOptions
  filters: any // TODO Set a type if possible
}

const useTableMeta = <T>(initialTableMeta?: TableMeta<T> | undefined) => {
  const [meta, setMeta] = useState<TableMeta<T>>(() => {
    if (initialTableMeta) {
      return initialTableMeta
    }
    return {
      sorter: [{}],
      pagination: {
        current: 1,
        pageSize: numberPagination,
        defaultCurrent: 1,
      },
      parsedOptions: {orderBy: '', limit: numberPagination, offset: 0},
      filters: [],
    }
  })

  const handleTableMetaChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[]
  ) => {
    let orderBy = ''
    let limit = numberPagination
    let offset = 0
    sorter = Array.isArray(sorter) ? sorter : [sorter]
    if (sorter.length > 0) {
      sorter.forEach((s) => {
        let order = ''
        if (s.order === undefined || s.column === undefined) return
        order = s.order === 'ascend' ? 'asc' : 'desc'
        orderBy += `"${s.column.dataIndex}" ${order} `
      })
    }
    if (pagination) {
      limit = pagination.pageSize ?? numberPagination
      offset = pagination.current ? pagination.current - 1 : 0
    }

    setMeta({
      pagination,
      sorter,
      parsedOptions: {
        orderBy,
        limit,
        offset,
      },
      filters,
    })
  }

  return [meta, handleTableMetaChange, setMeta] as const
}

export default useTableMeta
