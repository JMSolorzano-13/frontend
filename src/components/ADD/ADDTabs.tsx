import {useEffect, useState} from 'react'
import {Tabs} from 'antd'
import type {TabsProps} from 'antd'
import usePermissions from '@hooks/usePermissions'
import {useLocation, useNavigate} from 'react-router'
import editSearchParams from '@utils/editSearchParams'
import {ADD_CFDI_Types} from '@constants/Enums'
import { useDisableButtonsADD } from '@hooks/useDisableButtonsADD'

interface ADDTabsType {
  handleChange?: (tab: ADD_CFDI_Types) => void
}

export default function ADDTabs({handleChange}: ADDTabsType) {
  const location = useLocation()
  const navigate = useNavigate()
  const canAccessPayroll = usePermissions()

  const isADDButtonDisabled = useDisableButtonsADD()

  const [tab, setTab] = useState<ADD_CFDI_Types>(() => {
    const currentTab = (
      new URLSearchParams(location.search).get('type') || ''
    ).toUpperCase()
    const tabType = ADD_CFDI_Types[currentTab as keyof typeof ADD_CFDI_Types]
    if (tabType) {
      if (handleChange) {
        handleChange(tabType)
      }
      return tabType
    }
    return ADD_CFDI_Types.ALL
  })

  const handleTabChange = () => {
    const currentURLTab = new URLSearchParams(location.search).get('type')
    const newTab =
      Object.keys(ADD_CFDI_Types)[
        Object.values(ADD_CFDI_Types).indexOf(tab)
      ].toLowerCase()
    if (currentURLTab !== newTab) {
      navigate(
        editSearchParams(location.search, [
          {
            key: 'type',
            value:
              Object.keys(ADD_CFDI_Types)[
                Object.values(ADD_CFDI_Types).indexOf(tab)
              ].toLowerCase(),
          },
        ]),
        {replace: true}
      )
    }
  }

  useEffect(() => {
    handleTabChange()
  }, [tab])

  function loadTabs() {
    const items: TabsProps['items'] = [
      {
        id: 'tab-all',
        label: 'Todos',
        key: 'ALL',
        style: {backgroundColor: 'white', padding: '15px 15px 0 15px'},
        disabled: isADDButtonDisabled
      },
      {
        id: 'tab-I',
        label: 'Ingreso',
        key: 'I',
        style: {backgroundColor: 'white', padding: '15px 15px 0 15px'},
        disabled: isADDButtonDisabled
      },
      {
        id: 'tab-E',
        label: 'Egreso',
        key: 'E',
        style: {backgroundColor: 'white', padding: '15px 15px 0 15px'},
        disabled: isADDButtonDisabled
      },
      {
        id: 'tab-T',
        label: 'Traslado',
        key: 'T',
        style: {backgroundColor: 'white', padding: '15px 15px 0 15px'},
        disabled: isADDButtonDisabled
      },
    ]
    if (canAccessPayroll) {
      items.push({
        id: 'tab-N',
        label: 'Nómina',
        key: 'N',
        style: {backgroundColor: 'white', padding: '15px 15px 0 15px'},
        disabled: isADDButtonDisabled
      })
    }
    items.push({
      id: 'tab-P',
      label: 'Pago',
      key: 'P',
      style: {backgroundColor: 'white', padding: '15px 15px 0 15px'},
      disabled: isADDButtonDisabled
    })
    return items
  }

  return (
    <Tabs
      type="card"
      size="small"
      items={loadTabs()}
      activeKey={tab}
      onChange={(key) => {
        setTab(key as ADD_CFDI_Types)
        if (handleChange) handleChange(key as ADD_CFDI_Types)
      }}
    />
  )
}
